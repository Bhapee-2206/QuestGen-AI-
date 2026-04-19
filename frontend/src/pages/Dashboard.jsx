import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  HelpCircle, 
  Zap, 
  TrendingUp, 
  CheckCircle2, 
  Eye, 
  Download, 
  Plus
} from 'lucide-react';
import { auth, papers } from '../lib/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(auth.getUser());
  const [loading, setLoading] = useState(true);
  const [recentPapers, setRecentPapers] = useState([]);
  const [stats, setStats] = useState([
    { label: 'Total Papers', value: '0', change: '+0', icon: <FileText className="text-indigo-600" />, trend: 'up' },
    { label: 'Questions Bank', value: '0', change: 'AI Verified', icon: <HelpCircle className="text-emerald-600" />, trend: 'check' },
    { label: 'Cloud Storage', value: 'Live', change: 'MongoDB', icon: <Zap className="text-orange-600" />, trend: 'none' },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (localStorage.getItem('guestMode') === 'true') {
          setLoading(false);
          return;
        }
        const data = await papers.list();
        setRecentPapers(Array.isArray(data) ? data.slice(0, 3) : []);
        setStats(prev => {
          const newStats = [...prev];
          newStats[0].value = data.length.toString();
          newStats[1].value = data.reduce((acc, p) => acc + (p.question_count || 0), 0).toString();
          return newStats;
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <section>
        <h2 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2">Welcome back, {user?.full_name?.split(' ')[0] || 'Scholar'}.</h2>
        <p className="text-slate-500 text-lg">Your AI co-pilot is ready to transform your research into rigorous assessments.</p>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="glass-card bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                {stat.icon}
              </div>
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                <h3 className="text-3xl font-extrabold text-slate-900">{stat.value}</h3>
                <p className={`text-xs font-bold mt-2 flex items-center gap-1 ${
                  stat.trend === 'up' ? 'text-emerald-600' : stat.trend === 'check' ? 'text-indigo-600' : 'text-slate-400'
                }`}>
                  {stat.trend === 'up' && <TrendingUp size={14} />}
                  {stat.trend === 'check' && <CheckCircle2 size={14} />}
                  {stat.change}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Action Card */}
        <div className="lg:col-span-4 bg-gradient-to-br from-primary to-primary-container p-8 rounded-[2rem] text-white relative overflow-hidden flex flex-col justify-between shadow-xl min-h-[220px]">
          <div className="relative z-10">
            <h3 className="text-2xl font-extrabold leading-tight mb-2">Accelerate Your Curriculum</h3>
            <p className="text-indigo-100 text-sm opacity-90">Upload any document and generate high-fidelity MCQs in seconds.</p>
          </div>
          <div className="relative z-10 pt-6">
            <button 
              onClick={() => navigate('/generate')}
              className="bg-white text-indigo-700 px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              Generate New Paper
            </button>
          </div>
          <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-8 -top-8 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Papers */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-bold text-slate-900">Recently Generated Papers</h4>
            <button onClick={() => navigate('/history')} className="text-indigo-600 text-sm font-bold hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {recentPapers.map((paper, idx) => (
              <div key={idx} className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white hover:bg-slate-50 rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-100/50 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-bold text-slate-800 truncate">{paper.title}</h5>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] sm:text-[11px] font-medium text-slate-400">Created {new Date(paper.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                  <span className={`px-3 py-1 text-[11px] font-bold rounded-full border uppercase tracking-wide ${
                    paper.status === 'Ready' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                      : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                  }`}>
                    {paper.status || 'Ready'}
                  </span>
                  <div className="flex gap-1 sm:gap-2">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Eye size={18} /></button>
                    <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Download size={18} /></button>
                  </div>
                </div>
              </div>
            ))}
            {recentPapers.length === 0 && (
              <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">No recent papers found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Insights Column */}
        <div className="lg:col-span-4 space-y-6">
          <h4 className="text-xl font-bold text-slate-900 mb-6">AI Insights</h4>
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/50">
            <h6 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Quality Score</h6>
            <div className="flex items-end gap-2 mb-6">
              <span className="text-5xl font-black text-indigo-700">98</span>
              <span className="text-lg font-bold text-slate-400 pb-1">/100</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full w-[98%]"></div>
            </div>
            <p className="text-xs text-slate-500 mt-4 leading-relaxed">Your generated questions maintain exceptional academic rigor.</p>
          </div>

          <div className="glass-card bg-white/40 p-6 rounded-3xl border border-white/60">
            <h6 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Topic Coverage</h6>
            <div className="space-y-4">
              {[
                { name: 'Thermodynamics', val: '92%' },
                { name: 'Neural Networks', val: '84%' },
                { name: 'History', val: '71%' },
              ].map(topic => (
                <div key={topic.name} className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">{topic.name}</span>
                  <span className="text-sm font-bold text-indigo-600">{topic.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
