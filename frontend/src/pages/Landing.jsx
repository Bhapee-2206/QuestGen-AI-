import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BrainCircuit, 
  Sparkles, 
  ArrowRight, 
  FileText, 
  ShieldCheck, 
  Zap,
  Layout as LayoutIcon,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const Landing = () => {
  return (
    <div className="min-h-screen bg-surface selection:bg-primary-fixed selection:text-on-primary-fixed overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-2xl shadow-primary/30">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover scale-110" />
            </div>
            <span className="font-headline font-extrabold text-xl tracking-tight text-indigo-700">QuestGen AI</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">Workflow</a>
            <a href="#pricing" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="px-5 py-2.5 text-sm font-bold text-on-surface hover:text-primary transition-all">Sign In</Link>
            <Link to="/register" className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-soft"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-8"
          >
            <Sparkles size={14} />
            <span>AI-Powered Academic Intelligence</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-7xl font-headline font-black text-on-surface tracking-tight leading-[1.1] mb-8"
          >
            From Lectures to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500">Assessments</span> in Seconds
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed mb-12"
          >
            Transform your syllabus, PDFs, and lecture notes into rigorous, Bloom's Taxonomy aligned question papers automatically. Built for educators, designed for students.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/register" className="w-full sm:w-auto px-10 py-5 bg-primary text-white font-headline font-bold text-lg rounded-2xl shadow-2xl shadow-primary/30 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 group">
              Start Generating Free
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            <button 
                onClick={() => {
                    localStorage.setItem('guestMode', 'true');
                    window.location.href = '/';
                }}
                className="w-full sm:w-auto px-10 py-5 bg-white text-on-surface font-headline font-bold text-lg rounded-2xl border border-outline-variant hover:bg-surface-container-low transition-colors"
             >
                Try Live Demo
            </button>
          </motion.div>

          {/* Social Proof Placeholder */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-20 pt-10 border-t border-outline-variant/30 text-on-surface-variant/60 text-xs font-bold uppercase tracking-widest"
          >
            Trusted by 2,000+ Educators at institutions like
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 mt-8 grayscale opacity-50">
              <span className="text-xl italic font-serif">Stanford</span>
              <span className="text-xl font-headline font-bold">MIT</span>
              <span className="text-xl font-bold">OXFORD</span>
              <span className="text-xl font-headline">Berkeley</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-headline font-black text-on-surface tracking-tight mb-4">Powerful Features</h2>
            <p className="text-on-surface-variant max-w-xl mx-auto">Everything you need to create comprehensive assessments without the manual grind.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FileText className="text-blue-500" />,
                title: "Multi-Format Support",
                desc: "Upload PDFs, DOCX, or plain text. Our engine parses complex academic content with 99% accuracy."
              },
              {
                icon: <Zap className="text-amber-500" />,
                title: "Fast Generation",
                desc: "Generate 50+ questions in under 45 seconds using advanced LLM optimization."
              },
              {
                icon: <ShieldCheck className="text-emerald-500" />,
                title: "Bloom's Taxonomy",
                desc: "Control cognitive levels from basic recall to complex synthesis and critical evaluation."
              },
              {
                icon: <LayoutIcon className="text-primary" />,
                title: "Custom Question Banks",
                desc: "Save and organize your questions into reusable banks for different semesters and courses."
              },
              {
                icon: <CheckCircle2 className="text-indigo-500" />,
                title: "Export Ecosystem",
                desc: "Download high-quality PDFs or export directly to LMS formats like Canvas and Moodle."
              },
              {
                icon: <BrainCircuit className="text-purple-500" />,
                title: "AI Verifier",
                desc: "Every question is checked for factual accuracy and clarity by our secondary validation engine."
              }
            ].map((f, i) => (
              <div key={i} className="glass-card p-8 rounded-[2rem] hover:shadow-xl transition-shadow border-none bg-white">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-on-surface mb-3 tracking-tight font-headline">{f.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - 100% Free Focus */}
      <section id="pricing" className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
            <div className="max-w-sm w-full bg-white rounded-[3rem] p-10 shadow-2xl shadow-primary/10 border-2 border-primary/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                    <span className="px-4 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full">Active Tier</span>
                </div>
                <h3 className="text-2xl font-black text-on-surface mb-2 font-headline">Free Forever</h3>
                <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-5xl font-black text-primary">$0</span>
                    <span className="text-on-surface-variant font-bold">/mo</span>
                </div>
                <ul className="space-y-4 mb-10">
                    {[
                        "Unlimited generations",
                        "High-speed AI (Gemini Flash)",
                        "PDF / Word Exports",
                        "Cloud Question Bank",
                        "Priority Support"
                    ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm font-semibold text-on-surface-variant">
                            <CheckCircle2 size={18} className="text-primary" />
                            {item}
                        </li>
                    ))}
                </ul>
                <Link to="/register" className="w-full py-5 bg-primary text-white rounded-2xl font-headline font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center justify-center">
                    Get Started Now
                </Link>
            </div>
            <p className="mt-8 text-on-surface-variant text-sm font-medium">No credit card required. Educational use only.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-outline-variant/30 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <BrainCircuit size={18} />
            </div>
            <span className="font-headline font-extrabold text-lg tracking-tight text-indigo-700">QuestGen AI</span>
          </div>
          <div className="flex gap-8 text-sm font-bold text-on-surface-variant/60">
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-primary transition-colors">GitHub</a>
            <a href="#" className="hover:text-primary transition-colors">Documentation</a>
          </div>
          <p className="text-sm text-on-surface-variant/40 font-bold">© 2026 Academic Intellect Corp.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
