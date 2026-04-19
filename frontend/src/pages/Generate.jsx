import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CloudUpload, 
  Trash2, 
  Info, 
  ChevronDown, 
  CheckSquare, 
  Type, 
  FileText, 
  CheckCircle,
  Bolt,
  Loader2,
  AlertCircle,
  BookOpen
} from 'lucide-react';
import { auth, papers } from '../lib/api';

const Generate = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [difficulty, setDifficulty] = useState('Intermediate (Analysis)');
  const [quantity, setQuantity] = useState(25);
  const [types, setTypes] = useState(['Multiple Choice']);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'].includes(droppedFile.type)) {
      setFile(droppedFile);
      setError(null);
    } else if (droppedFile) {
      setError('Please upload a PDF, DOCX, or TXT file.');
    }
  };

  const removeFile = () => setFile(null);

  const toggleType = (type) => {
    if (types.includes(type)) {
      if (types.length === 1) return; // keep at least one
      setTypes(types.filter(t => t !== type));
    } else {
      setTypes([...types, type]);
    }
  };

  const handleGenerate = async () => {
    if (!file) {
      setError('Please upload a file to generate questions from.');
      return;
    }
    if (types.length === 0) {
      setError('Please select at least one question type.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('difficulty', difficulty);
      formData.append('quantity', quantity.toString());
      formData.append('types', types.join(','));
      
      const geminiKey = localStorage.getItem('geminiKey');
      if (geminiKey) {
        formData.append('api_key', geminiKey);
      }

      const generatedData = await papers.generate(formData);

      // Save to MongoDB if logged in
      const user = auth.getUser();
      if (user) {
        try {
          await papers.save({
            title: generatedData.title,
            difficulty: difficulty,
            question_count: generatedData.questions?.length || quantity,
            types: types,
            questions: generatedData.questions,
          });
        } catch (dbErr) {
          console.warn('Could not save to database:', dbErr.message);
        }
      }

      sessionStorage.setItem('generatedPaper', JSON.stringify(generatedData));
      navigate('/paper');

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-4">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2 font-headline">Generate Questions</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">Transform your syllabus or course material into high-quality assessments. Upload your documents and let our Intelligence Engine do the rest.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: File Upload Area */}
        <div className="lg:col-span-7 space-y-6">
          <div 
            className={`relative border-2 border-dashed rounded-[2rem] p-6 sm:p-12 flex flex-col items-center justify-center text-center space-y-4 transition-all cursor-pointer ${
              isDragging 
                ? 'border-primary bg-indigo-50 scale-[1.01]' 
                : 'border-indigo-100 hover:bg-white hover:border-primary-container bg-slate-50/50 shadow-sm'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <input 
              ref={fileInputRef}
              id="file-upload" 
              type="file" 
              className="hidden" 
              onChange={handleFileChange}
              accept=".pdf,.docx,.txt"
            />
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-2 transition-colors ${isDragging ? 'bg-primary/10' : 'bg-indigo-50'}`}>
              <CloudUpload className={isDragging ? 'text-primary' : 'text-primary'} size={32} />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-headline">Upload Course Material</h3>
              <p className="text-sm text-slate-500 mt-1">{isDragging ? 'Drop it!' : 'Drag and drop your file here'}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {['PDF', 'DOCX', 'TXT'].map(ext => (
                <span key={ext} className="px-3 py-1 bg-white text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm border border-slate-100">{ext}</span>
              ))}
            </div>
            <button className="mt-4 px-6 py-2 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-sm text-sm">
              Browse Files
            </button>
          </div>

          {file && (
            <div className="bg-white rounded-[2rem] p-5 sm:p-6 border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-2">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Material</h4>
                <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                  <CheckCircle size={12} /> Ready to process
                </span>
              </div>
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-indigo-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                    <FileText className="text-red-500" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{file.name}</p>
                    <p className="text-[11px] text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); removeFile(); }}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-white"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-5 flex items-start gap-3">
              <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-red-700 font-medium leading-relaxed">{error}</p>
            </div>
          )}
        </div>

        {/* Right Column: Configuration Area */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white rounded-[2rem] p-8 shadow-sm space-y-8 border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 font-headline">Parameters</h3>
            
            {/* Difficulty */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Cognitive Level</label>
              <div className="relative">
                <select 
                  className="w-full bg-slate-50 border-none rounded-xl py-4 px-5 text-slate-800 font-semibold appearance-none focus:ring-2 focus:ring-indigo-100 cursor-pointer"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option>Beginner (Recall)</option>
                  <option>Intermediate (Analysis)</option>
                  <option>Advanced (Synthesis)</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" size={18} />
              </div>
            </div>

            {/* Assessment Types */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Assessment Types</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'Multiple Choice', icon: <CheckSquare size={18} /> },
                  { id: 'Short Answer', icon: <Type size={18} /> },
                  { id: 'Long Essay', icon: <FileText size={18} /> },
                  { id: 'True / False', icon: <BookOpen size={18} /> },
                ].map(type => (
                  <button 
                    key={type.id}
                    onClick={() => toggleType(type.id)}
                    className={`flex items-center justify-between p-4 rounded-xl transition-all group border-2 ${
                      types.includes(type.id) 
                        ? 'bg-indigo-50 border-primary/20 text-indigo-900' 
                        : 'bg-slate-50 border-transparent hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={types.includes(type.id) ? 'text-primary' : 'text-slate-400'}>{type.icon}</span>
                      <span className="font-bold">{type.id}</span>
                    </div>
                    {types.includes(type.id) && <CheckCircle className="text-primary" size={18} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Question Quantity</label>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-black">{quantity}</span>
              </div>
              <input 
                className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                max="100" min="5" type="range" 
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>5 QUESTIONS</span>
                <span>100 QUESTIONS</span>
              </div>
            </div>
          </div>

          <div className="bg-indigo-900/5 rounded-2xl p-6 border border-indigo-50 flex gap-4">
            <Info className="text-indigo-600 shrink-0" size={20} />
            <div className="space-y-1">
              <p className="text-sm font-bold text-indigo-900 leading-tight">Pro Tip</p>
              <p className="text-xs text-indigo-700/70 leading-relaxed font-medium">Clear document structure (headings, lists) improves Bloom's Taxonomy generation by 40%.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 flex flex-col items-center">
        <button 
          onClick={handleGenerate}
          disabled={loading || !file}
          className="group relative px-12 py-5 overflow-hidden rounded-2xl shadow-xl hover:scale-[1.03] transition-all duration-300 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-container"></div>
          <div className="relative flex items-center gap-3 text-white">
            {loading ? <Loader2 className="animate-spin" size={24} /> : <Bolt size={24} />}
            <span className="text-xl font-extrabold tracking-tight font-headline">
              {loading ? 'Processing Document...' : 'Generate Questions'}
            </span>
          </div>
        </button>
        <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <span>✨ Powered by Academic Engine v4.2 • Est. time: ~45 seconds</span>
        </p>
      </div>
    </div>
  );
};

export default Generate;
