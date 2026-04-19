import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  Plus, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Users
} from 'lucide-react';
import { papers } from '../lib/api';

const QuestionBank = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      if (localStorage.getItem('guestMode') === 'true') {
        setQuestions([]);
        setLoading(false);
        return;
      }
      const data = await papers.list();
      // Flatten all questions from all papers
      const allQuestions = Array.isArray(data) ? data.flatMap(paper => 
        (paper.questions || []).map(q => ({
          ...q,
          paperTitle: paper.title,
          date: new Date(paper.created_at).toLocaleDateString()
        }))
      ) : [];
      setQuestions(allQuestions);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">Question Bank</h2>
          <p className="text-slate-500 mt-1">Manage and organize your generated assessment library.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white text-on-surface px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-slate-50 transition-all border border-slate-100 shadow-sm">
            <Download size={18} />
            Export Selected
          </button>
          <button className="bg-gradient-to-br from-primary to-primary-container text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg hover:scale-[1.02] transition-transform">
            <Plus size={18} />
            Manual Entry
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="relative">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 ml-1">Topic</label>
          <select className="w-full bg-white border-none rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer shadow-sm">
            <option>All Topics</option>
            <option>Quantum Mechanics</option>
            <option>Molecular Biology</option>
          </select>
        </div>
        <div className="relative">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 ml-1">Difficulty</label>
          <select className="w-full bg-white border-none rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer shadow-sm">
            <option>All Levels</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
        <div className="relative">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 ml-1">Type</label>
          <select className="w-full bg-white border-none rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer shadow-sm">
            <option>All Types</option>
            <option>Multiple Choice</option>
            <option>True/False</option>
            <option>Open Ended</option>
          </select>
        </div>
        <div className="flex items-end">
          <button className="w-full h-[42px] bg-indigo-50 text-indigo-700 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2">
            <Filter size={18} />
            Reset Filters
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Question Text</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Type</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Difficulty</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Topic</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Date Added</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {questions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                        <Search className="text-slate-300" size={32} />
                      </div>
                      <div>
                        <p className="text-slate-900 font-bold">No questions found</p>
                        <p className="text-slate-400 text-sm">Generate some papers to populate your question bank.</p>
                      </div>
                      <button 
                        onClick={() => navigate('/generate')}
                        className="mt-2 text-primary font-bold text-sm hover:underline flex items-center gap-2"
                      >
                        <Plus size={14} />
                        Generate Now
                      </button>
                    </div>
                  </td>
                </tr>
              ) : questions.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-5 max-w-xs">
                    <p className="text-sm font-semibold text-on-surface line-clamp-2">{q.question}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Source: {q.paperTitle}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-2 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-tight">{q.type}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        <div className="w-1.5 h-3 bg-primary rounded-full"></div>
                        <div className={`w-1.5 h-3 ${q.difficulty !== 'Beginner' ? 'bg-primary' : 'bg-slate-200'} rounded-full`}></div>
                        <div className={`w-1.5 h-3 ${q.difficulty === 'Advanced' ? 'bg-primary' : 'bg-slate-200'} rounded-full`}></div>
                      </div>
                      <span className="text-xs font-medium text-slate-600">{q.difficulty}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-600">{q.topic}</td>
                  <td className="px-6 py-5 text-sm text-slate-400 font-medium">{q.date}</td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50/30">
          <p className="text-xs text-slate-500 font-medium">Showing <span className="text-on-surface font-bold">1-10</span> of <span className="text-on-surface font-bold">124</span> questions</p>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-on-surface disabled:opacity-30" disabled>
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded-lg bg-primary text-white text-xs font-bold shadow-sm">1</button>
              <button className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors">2</button>
              <button className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors">3</button>
            </div>
            <button className="p-2 text-slate-400 hover:text-on-surface transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Suggestion Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100/50 relative overflow-hidden group">
          <div className="relative z-10">
            <Sparkles className="text-indigo-600 mb-3" size={24} />
            <h4 className="text-sm font-bold text-indigo-900 mb-1">AI Smart Cleanup</h4>
            <p className="text-xs text-indigo-700/70 leading-relaxed">We found 12 duplicate questions in your bank. Click to merge them.</p>
          </div>
        </div>
        <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100/50 relative overflow-hidden group">
          <div className="relative z-10">
            <CheckCircle2 className="text-emerald-600 mb-3" size={24} />
            <h4 className="text-sm font-bold text-emerald-900 mb-1">Weekly Digest</h4>
            <p className="text-xs text-emerald-700/70 leading-relaxed">You've generated 45 new advanced physics questions this week.</p>
          </div>
        </div>
        <div className="bg-slate-100/50 p-6 rounded-3xl border border-slate-200/50 relative overflow-hidden group">
          <div className="relative z-10">
            <Users className="text-slate-600 mb-3" size={24} />
            <h4 className="text-sm font-bold text-slate-900 mb-1">Collaborate</h4>
            <p className="text-xs text-slate-700/70 leading-relaxed">Invite team members to edit and review this question bank.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionBank;
