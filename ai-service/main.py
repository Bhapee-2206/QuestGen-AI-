from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends, Header
from fastapi.responses import JSONResponse
from starlette.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr
from typing import List, Optional
import requests
import io
import PyPDF2
import docx
import os
import json
import jwt
import datetime
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pymongo import MongoClient
from bson import ObjectId
from passlib.context import CryptContext
from google import genai
from google.genai import types

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth Configuration
SECRET_KEY = os.getenv("JWT_SECRET")
if not SECRET_KEY:
    SECRET_KEY = "questgen_dev_secret_key_change_me"
    print("⚠️ WARNING: Using hardcoded JWT_SECRET. Set JWT_SECRET in environment for production.")
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# MongoDB Initialization
MONGO_URI = os.getenv("MONGO_URI")
db = None
if MONGO_URI:
    try:
        # Set a shorter timeout for initial connection
        client_db = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        # Force a call to check connectivity
        client_db.admin.command('ping')
        db = client_db.get_default_database()
        print(f"✅ Successfully connected to MongoDB: {db.name}")
    except Exception as e:
        print(f"❌ MongoDB connection error: {e}")
        print("Running in 'local-memory' mode (No database persistence)")
else:
    print("⚠️ No MONGO_URI found in environment. Database features disabled.")

# Gemini Client
client = None
if os.getenv("GEMINI_API_KEY"):
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Models
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = "Academic User"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Helper Functions
def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + datetime.timedelta(days=7)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    try:
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

def extract_text_from_bytes(file_bytes: bytes, filename: str):
    try:
        content = io.BytesIO(file_bytes)
        if filename.endswith('.pdf'):
            reader = PyPDF2.PdfReader(content)
            text = ""
            for page in reader.pages:
                text += page.extract_text()
            return text
        elif filename.endswith('.docx'):
            doc = docx.Document(content)
            return "\n".join([para.text for para in doc.paragraphs])
        else:
            return file_bytes.decode('utf-8')
    except Exception as e:
        print(f"Extraction error: {e}")
        return ""

# Health Check
@app.get("/api/health")
def read_root():
    return {
        "status": "QuestGen AI Service Running",
        "db_connected": db is not None,
        "ai_enabled": client is not None,
        "provider": "Google/Gemini"
    }

# Auth Endpoints
@app.post("/auth/register")
async def register(user: UserRegister):
    if db is None: raise HTTPException(status_code=500, detail="Database not connected")
    if db.users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="User already exists")
    
    hashed_password = get_password_hash(user.password)
    user_data = {
        "email": user.email,
        "password": hashed_password,
        "full_name": user.full_name,
        "created_at": datetime.datetime.utcnow()
    }
    result = db.users.insert_one(user_data)
    user_id = str(result.inserted_id)
    token = create_access_token(data={"sub": user_id, "email": user.email})
    return {"access_token": token, "token_type": "bearer", "user": {"id": user_id, "email": user.email, "full_name": user.full_name}}

@app.post("/auth/login")
async def login(user: UserLogin):
    if db is None: raise HTTPException(status_code=500, detail="Database not connected")
    db_user = db.users.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user_id = str(db_user["_id"])
    token = create_access_token(data={"sub": user_id, "email": user.email})
    return {"access_token": token, "token_type": "bearer", "user": {"id": user_id, "email": user.email, "full_name": db_user.get("full_name")}}

@app.put("/auth/profile")
async def update_profile(data: dict, user_id: str = Depends(get_current_user)):
    if db is None: raise HTTPException(status_code=500, detail="Database not connected")
    db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"full_name": data.get("full_name"), "institution": data.get("institution")}}
    )
    db_user = db.users.find_one({"_id": ObjectId(user_id)})
    return {"id": user_id, "email": db_user["email"], "full_name": db_user.get("full_name"), "institution": db_user.get("institution")}

# Generation Endpoint
@app.post("/generate")
async def generate_questions(
    file: Optional[UploadFile] = File(None),
    file_url: Optional[str] = Form(None),
    difficulty: str = Form("Intermediate"),
    quantity: int = Form(10),
    question_types: str = Form("Multiple Choice", alias="types"),
    api_key: Optional[str] = Form(None)
):
    try:
        text = ""
        if file:
            content = await file.read()
            text = extract_text_from_bytes(content, file.filename)
        elif file_url:
            response = requests.get(file_url)
            text = extract_text_from_bytes(response.content, file_url)
        
        if not text:
            text = "Sample educational content."

        type_list = [t.strip() for t in question_types.split(',')]
        context = text[:20000]

        active_client = client
        if api_key:
            active_client = genai.Client(api_key=api_key)
        
        if not active_client:
            questions = []
            for i in range(quantity):
                q_type = type_list[i % len(type_list)]
                questions.append({
                    "id": i + 1,
                    "type": q_type,
                    "question": f"Sample {difficulty} question about the content.",
                    "options": ["Option A", "Option B", "Option C", "Option D"] if q_type == "Multiple Choice" else None,
                    "answer": "Option A" if q_type == "Multiple Choice" else "Sample answer text",
                    "difficulty": difficulty
                })
            return {"title": "Generated Paper (Demo)", "questions": questions}

        prompt = f"""Generate {quantity} {difficulty} level questions based on this material: {context}. Types: {', '.join(type_list)}.
        
        Return exactly {quantity} questions in this JSON format:
        {{
          "title": "Topic Name",
          "questions": [
            {{
              "id": 1,
              "type": "Multiple Choice",
              "question": "What is...?",
              "options": ["...", "...", "...", "..."],
              "answer": "...",
              "difficulty": "{difficulty}"
            }}
          ]
        }}
        """

        # Primary model: Gemini 2.0 Flash
        # Fallback: Gemini 1.5 Flash
        model_names = ['gemini-2.0-flash', 'gemini-1.5-flash']
        
        response = None
        last_error = ""
        
        for m_name in model_names:
            try:
                print(f"DEBUG: Attempting with model {m_name}...")
                response = active_client.models.generate_content(
                    model=m_name,
                    contents=prompt,
                    config=types.GenerateContentConfig(response_mime_type="application/json"),
                )
                if response: break
            except Exception as e:
                last_error = str(e)
                print(f"DEBUG: Model {m_name} failed: {last_error}")
                continue

        if not response:
            raise HTTPException(status_code=500, detail=f"AI Generation failed after trying all models. Last error: {last_error}")

        return json.loads(response.text)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Database Management
@app.post("/papers")
async def save_paper(paper: dict, user_id: str = Depends(get_current_user)):
    if db is None: raise HTTPException(status_code=500, detail="Database not connected")
    paper["user_id"] = user_id
    paper["created_at"] = datetime.datetime.utcnow()
    result = db.papers.insert_one(paper)
    return {"id": str(result.inserted_id)}

@app.get("/papers")
async def get_papers(user_id: str = Depends(get_current_user)):
    if db is None: raise HTTPException(status_code=500, detail="Database not connected")
    cursor = db.papers.find({"user_id": user_id}).sort("created_at", -1)
    papers = []
    for p in cursor:
        p["id"] = str(p["_id"])
        del p["_id"]
        papers.append(p)
    return papers

@app.delete("/papers/{paper_id}")
async def delete_paper(paper_id: str, user_id: str = Depends(get_current_user)):
    if db is None: raise HTTPException(status_code=500, detail="Database not connected")
    db.papers.delete_one({"_id": ObjectId(paper_id), "user_id": user_id})
    return {"status": "deleted"}

# Serve Frontend Static Files
# This should be at the bottom so it doesn't shadow API routes
static_path = os.path.join(os.path.dirname(__file__), "static")

@app.exception_handler(404)
async def not_found_handler(request, exc):
    # If the request is for an API route, return 404
    if request.url.path.startswith("/api/") or request.url.path.startswith("/auth/"):
        return JSONResponse(status_code=404, content={"detail": "Not Found"})
    # Otherwise, serve the frontend's index.html
    index_file = os.path.join(static_path, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return JSONResponse(status_code=404, content={"detail": "Not Found"})

if os.path.exists(static_path):
    app.mount("/", StaticFiles(directory=static_path, html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
