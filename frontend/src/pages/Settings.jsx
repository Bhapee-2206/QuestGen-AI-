import React, { useState, useEffect } from 'react';
import { 
  User, 
  Bell, 
  Palette,
  Key,
  Save,
  CheckCircle,
  ChevronRight,
  Mail,
  Shield,
  Moon,
  Sun,
  Loader2,
  BrainCircuit,
  LogOut,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/api';

const SettingSection = ({ title, description, icon: Icon, children }) => (
  <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
    <div className="flex items-start gap-4 mb-8 pb-6 border-b border-slate-50">
      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
        <Icon size={22} />
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500 mt-0.5">{description}</p>
      </div>
    </div>
    {children}
  </div>
);

const FieldRow = ({ label, children }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-slate-50 last:border-0">
    <label className="text-sm font-semibold text-slate-700 min-w-[160px]">{label}</label>
    <div className="flex-1 max-w-sm">{children}</div>
  </div>
);

const Settings = () => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [institution, setInstitution] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [theme, setTheme] = useState('light');
  const [emailNotifs, setEmailNotifs] = useState(true);

  useEffect(() => {
    const user = auth.getUser();
    if (user) {
      setUserEmail(user.email || '');
      setDisplayName(user.full_name || '');
      setInstitution(user.institution || '');
    }
    setGeminiKey(localStorage.getItem('geminiKey') || '');
    setTheme(localStorage.getItem('appTheme') || 'light');
  }, []);

  const handleSave = async () => {
    setSaving(true);
    
    if (geminiKey) localStorage.setItem('geminiKey', geminiKey);
    localStorage.setItem('appTheme', theme);

    try {
      if (localStorage.getItem('guestMode') !== 'true') {
        await auth.updateProfile(displayName, institution);
      } else {
        const guest = JSON.parse(localStorage.getItem('user') || '{}');
        guest.full_name = displayName;
        guest.institution = institution;
        localStorage.setItem('user', JSON.stringify(guest));
      }
    } catch (err) {
      console.warn('Profile update failed:', err.message);
    }

    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    setSaved(true);
    setTimeout(() => {
        setSaved(false);
        window.location.reload();
    }, 1500);
  };

  const handleLogout = () => {
    auth.logout();
    window.location.href = '/landing';
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <div>
        <span className="text-[10px] font-bold tracking-[0.2em] text-indigo-600 uppercase mb-2 block">Workspace</span>
        <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">Settings</h2>
        <p className="text-slate-500 mt-2 max-w-lg">Manage your account preferences, API keys, and workspace configuration.</p>
      </div>

      <SettingSection title="Profile" description="Manage your personal account information." icon={User}>
        <div className="space-y-0">
          <FieldRow label="Display Name">
            <input 
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-slate-800 font-medium focus:ring-2 focus:ring-indigo-100 outline-none text-sm"
              placeholder="Your name"
            />
          </FieldRow>
          <FieldRow label="Email Address">
            <div className="w-full bg-slate-50 rounded-xl py-3 px-4 text-slate-500 text-sm flex items-center gap-2">
              <Mail size={14} />
              {userEmail || 'guest@questgen.ai'}
            </div>
          </FieldRow>
          <FieldRow label="Institution">
            <input 
              type="text"
              value={institution}
              onChange={e => setInstitution(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-slate-800 font-medium focus:ring-2 focus:ring-indigo-100 outline-none text-sm"
              placeholder="University or Organization"
            />
          </FieldRow>
        </div>
      </SettingSection>

      <SettingSection title="AI Configuration" description="Configure your AI provider keys for question generation." icon={BrainCircuit}>
        <div className="space-y-6">
          <div className="bg-indigo-50 rounded-2xl p-5 flex gap-4 border border-indigo-100">
            <Info size={18} className="text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-indigo-900 mb-1">Gemini API Key</p>
              <p className="text-xs text-indigo-700/70 leading-relaxed">Get your free Gemini API key at <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" className="underline font-semibold">aistudio.google.com</a>.</p>
            </div>
          </div>

          <FieldRow label="Gemini API Key">
            <div className="relative">
              <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="password"
                value={geminiKey}
                onChange={e => setGeminiKey(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-xl py-3 pl-9 pr-4 text-slate-800 font-mono text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                placeholder="AIzaSy••••••••••••••••••••••••"
              />
            </div>
          </FieldRow>
        </div>
      </SettingSection>

      <SettingSection title="Appearance" description="Customize your visual experience." icon={Palette}>
        <div className="flex gap-3">
          {[
            { id: 'light', icon: <Sun size={18} />, label: 'Light' },
            { id: 'dark', icon: <Moon size={18} />, label: 'Dark (Soon)' },
          ].map(t => (
            <button 
              key={t.id}
              onClick={() => t.id !== 'dark' && setTheme(t.id)}
              disabled={t.id === 'dark'}
              className={`flex-1 flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                theme === t.id 
                  ? 'border-primary bg-indigo-50 text-indigo-900' 
                  : 'border-slate-100 hover:border-slate-200'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </SettingSection>

      <SettingSection title="Account & Reset" description="Manage session and local storage." icon={Shield}>
          <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div>
                      <p className="text-sm font-bold text-slate-800">Clear Local Storage</p>
                      <p className="text-xs text-slate-400">Resets guest mode and cached settings.</p>
                  </div>
                  <button 
                    onClick={() => { localStorage.clear(); window.location.reload(); }}
                    className="px-4 py-2 bg-white text-red-600 border border-slate-100 rounded-lg text-xs font-bold hover:bg-red-50 hover:border-red-100 transition-all"
                  >
                      Reset App
                  </button>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-4 border-2 border-slate-100 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 hover:text-red-600 hover:border-red-100 transition-all"
              >
                  <LogOut size={18} />
                  Sign Out of QuestGen
              </button>
          </div>
      </SettingSection>

      <div className="flex justify-end pt-8">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-3 px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-white rounded-2xl font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70"
        >
          {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {saved && (
        <div className="fixed bottom-8 right-8 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-5 z-50">
          <CheckCircle size={24} />
          <div>
            <p className="font-bold leading-none">Settings Saved!</p>
            <p className="text-xs text-white/80 mt-1">Your preferences have been updated.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
