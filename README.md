# QuestGen AI - Deployment Guide

## Architecture
- **Frontend**: React (Vite) + Tailwind + Lucide Icons
- **Backend**: FastAPI (Python) + MongoDB + Google Gemini AI

## 1. Backend Deployment (AI Service)
The backend can be deployed to platforms like **Render**, **Railway**, or **Heroku**.

### Environment Variables
Ensure the following are set in your production environment:
- `GEMINI_API_KEY`: Your Google AI API Key.
- `MONGO_URI`: Connection string for MongoDB Atlas.
- `JWT_SECRET`: A long, random string for auth tokens.

### Docker (Recommended)
You can use the provided `Dockerfile` in the `ai-service` directory.
```bash
docker build -t questgen-ai-service .
docker run -p 8000:8000 --env-file .env questgen-ai-service
```

## 2. Frontend Deployment
The frontend can be deployed to **Vercel**, **Netlify**, or **Cloudflare Pages**.

### Environment Variables
- `VITE_AI_SERVICE_URL`: The URL where your backend is hosted (e.g., `https://questgen-api.onrender.com`).

### Build Command
```bash
npm run build
```

## 3. Database (MongoDB)
- Use **MongoDB Atlas** (Free Tier available).
- Create a database called `questgen_ai`.
- Collections like `users` and `papers` will be created automatically on first use.

## 4. Google Gemini API
- Get your free API key from [Google AI Studio](https://aistudio.google.com/).
