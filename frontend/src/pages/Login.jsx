import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, BrainCircuit } from 'lucide-react';
import { auth } from '../lib/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await auth.login(email, password);
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col items-center justify-center p-6 selection:bg-primary-fixed selection:text-on-primary-fixed">
      <main className="w-full max-w-5xl">
        <div className="glass-card shadow-2xl rounded-[2rem] overflow-hidden grid md:grid-cols-2 min-h-[640px]">
          <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                  <BrainCircuit size={24} />
                </div>
                <span className="font-headline font-extrabold text-2xl tracking-tight text-indigo-700">QuestGen AI</span>
              </div>
              <h1 className="font-headline text-4xl font-bold text-on-surface mb-2 tracking-tight">Welcome Back</h1>
              <p className="text-on-surface-variant font-body text-sm">Enter your credentials to access your academic workspace.</p>
            </div>

            <form className="space-y-6" onSubmit={handleLogin}>
              {error && (
                <div className="p-3 bg-error-container text-on-error-container text-xs rounded-xl border border-error/10">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="email">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline-variant group-focus-within:text-primary transition-colors">
                    <Mail size={18} />
                  </div>
                  <input 
                    className="w-full pl-11 pr-4 py-4 bg-surface-container-low border-0 rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all placeholder:text-outline text-on-surface text-sm" 
                    id="email" 
                    type="email" 
                    placeholder="name@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant" htmlFor="password">Password</label>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline-variant group-focus-within:text-primary transition-colors">
                    <Lock size={18} />
                  </div>
                  <input 
                    className="w-full pl-11 pr-4 py-4 bg-surface-container-low border-0 rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all placeholder:text-outline text-on-surface text-sm" 
                    id="password" 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary focus:ring-offset-0 bg-surface-container-low" type="checkbox" />
                  <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">Remember me</span>
                </label>
                <a className="text-sm font-semibold text-primary hover:text-primary-container transition-colors" href="#">Forgot Password?</a>
              </div>

              <button 
                className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-70"
                type="submit"
                disabled={loading}
              >
                <span>{loading ? 'Logging in...' : 'Login to Workspace'}</span>
                {!loading && <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />}
              </button>
            </form>

            <div className="mt-8 pt-6 text-center border-t border-slate-50">
              <button 
                onClick={() => {
                  localStorage.setItem('guestMode', 'true');
                  window.location.reload();
                }}
                className="text-on-surface-variant text-sm font-semibold hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                <span>Demo Mode: Explore as Guest</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="mt-6 pt-4 text-center">
              <p className="text-on-surface-variant text-sm">
                Don't have an account? 
                <Link className="text-primary font-bold hover:underline underline-offset-4 ml-1" to="/register">Sign Up</Link>
              </p>
            </div>
          </div>

          <div className="hidden md:block relative bg-slate-50 overflow-hidden">
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
              <div className="relative w-full max-w-sm aspect-square mb-12">
                <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl animate-pulse-soft"></div>
                <img 
                  alt="AI Intelligence Visualization" 
                  className="relative z-10 w-full h-full object-contain mix-blend-multiply opacity-90"
                  src="/ai-viz.png" 
                />
              </div>
              <div className="relative z-10">
                <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">Precision Intelligence</h2>
                <p className="text-on-surface-variant text-sm leading-relaxed max-w-xs mx-auto">
                  Harness the power of advanced LLMs to transform your documents into rigorous academic assessments in seconds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
