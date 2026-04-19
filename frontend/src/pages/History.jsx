import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  Eye, 
  Search, 
  Filter, 
  ArrowUpAZ,
  ChevronLeft,
  ChevronRight,
  Zap,
  LayoutGrid,
  Trash2
} from 'lucide-react';
import { papers } from '../lib/api';

const History = () => {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      if (localStorage.getItem('guestMode') === 'true') {
        setHistoryItems([]);
        setLoading(false);
        return;
      }
      const data = await papers.list();
      setHistoryItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching history:', err);
      setHistoryItems([]);
    } finally {
      setLoading(false);
    }
  };

  const deletePaper = async (id) => {
    if (!window.confirm('Are you sure you want to delete this paper?')) return;
    try {
      await papers.delete(id);
      setHistoryItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting paper:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-[0.2em] text-indigo-600 uppercase mb-2 block">Archive Overview</span>
          <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">Generation History</h2>
          <p className="text-slate-500 mt-2 max-w-lg">Manage and review your AI-generated academic assessments.</p>
        </div>
      </div>

      <div className="bg-slate-50/50 rounded-[2rem] p-4 border border-slate-100">
        <div className="bg-white rounded-[1.5rem] shadow-sm overflow-hidden border border-slate-100">
          <div className="grid grid-cols-12 px-8 py-5 bg-slate-50/50 border-b border-slate-50">
            <div className="col-span-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Question Paper Details</div>
            <div className="col-span-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</div>
            <div className="col-span-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Questions</div>
            <div className="col-span-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Difficulty</div>
            <div className="col-span-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</div>
          </div>

          {historyItems.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                <Search className="text-slate-300" size={32} />
              </div>
              <div>
                <p className="text-slate-900 font-bold">No generation history</p>
                <p className="text-slate-400 text-sm max-w-xs mx-auto">Your generated assessment papers will appear here for management and export.</p>
              </div>
              <button 
                onClick={() => navigate('/generate')}
                className="mt-4 px-6 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition-all text-sm flex items-center gap-2"
              >
                <Zap size={14} />
                Create First Paper
              </button>
            </div>
          ) : (
            historyItems.map((item) => (
              <div key={item.id} className="grid grid-cols-12 px-8 py-6 items-center hover:bg-indigo-50/20 transition-all border-t first:border-t-0 border-slate-50 group cursor-pointer">
                <div className="col-span-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors text-sm">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{item.category || 'General Assessment'}</p>
                  </div>
                </div>
                <div className="col-span-2 text-xs text-slate-500 font-bold">
                    {new Date(item.created_at).toLocaleDateString()}
                </div>
                <div className="col-span-2 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wide">
                    {item.questions?.length || item.question_count || 0} Items
                  </span>
                </div>
                <div className="col-span-1 capitalize text-xs font-semibold text-slate-600">
                    {item.difficulty || 'Mixed'}
                </div>
                <div className="col-span-2 flex justify-end gap-2">
                  <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white transition-all rounded-lg shadow-sm border border-transparent hover:border-indigo-100">
                    <Eye size={18} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white transition-all rounded-lg shadow-sm border border-transparent hover:border-indigo-100">
                    <Download size={18} />
                  </button>
                  <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        deletePaper(item.id);
                    }}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-white transition-all rounded-lg shadow-sm border border-transparent hover:border-red-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
