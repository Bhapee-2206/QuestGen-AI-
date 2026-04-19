import React, { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { 
  BarChart3, 
  BrainCircuit, 
  Database, 
  History as HistoryIcon, 
  Settings, 
  PlusCircle, 
  Search, 
  Bell, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { auth } from '../lib/api';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <BarChart3 size={20} /> },
    { name: 'Generate Questions', path: '/generate', icon: <BrainCircuit size={20} /> },
    { name: 'Question Bank', path: '/bank', icon: <Database size={20} /> },
    { name: 'History', path: '/history', icon: <HistoryIcon size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  const sidebarClasses = `
    h-screen w-64 fixed left-0 top-0 bg-white/90 backdrop-blur-xl flex flex-col py-6 px-4 space-y-2 border-r border-slate-200/50 z-50 transition-transform duration-300 ease-in-out
    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
  `;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      <aside className={sidebarClasses}>
        <div className="flex items-center justify-between gap-3 px-2 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg border border-indigo-100">
               <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-lg font-black text-indigo-700 leading-none">QuestGen AI</h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Academic Intel</p>
            </div>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden p-2 text-slate-400">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => { if(window.innerWidth < 1024) toggleSidebar(); }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm' 
                    : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50'
                }`
              }
            >
              {item.icon}
              <span className="text-sm">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto px-2">
          <Link 
            to="/generate" 
            onClick={() => { if(window.innerWidth < 1024) toggleSidebar(); }}
            className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold text-sm shadow-[0_10px_20px_rgba(53,37,205,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            <PlusCircle size={18} />
            New Generation
          </Link>
        </div>
      </aside>
    </>
  );
};

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const user = auth.getUser();

  const handleLogout = () => {
    auth.logout();
    window.location.href = '/landing';
  };

  return (
    <header className="fixed top-0 w-full h-16 left-0 flex justify-between items-center px-4 lg:px-8 lg:pl-72 z-30 bg-white/80 backdrop-blur-xl shadow-[0_20px_40px_rgba(53,37,205,0.06)]">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
        <div className="relative w-full max-w-md group hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
          <input 
            className="w-full bg-slate-100/50 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
            placeholder="Search..."
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <button className="p-2 text-slate-600 hover:bg-slate-100/50 rounded-full transition-all relative hidden xs:block">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white"></span>
        </button>
        <button 
          onClick={handleLogout}
          className="p-2 text-slate-600 hover:bg-slate-100/50 rounded-full transition-all"
        >
          <LogOut size={20} />
        </button>
        <div className="h-8 w-px bg-slate-200 mx-1 lg:mx-2"></div>
        <div className="flex items-center gap-3 pl-1 lg:pl-2">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-slate-800 leading-none truncate max-w-[120px]">{user?.full_name || 'Academic User'}</p>
            <p className="text-[10px] text-indigo-600 font-medium mt-1 truncate max-w-[120px]">{user?.email}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm shrink-0">
            {user?.full_name?.charAt(0) || 'A'}
          </div>
        </div>
      </div>
    </header>
  );
};

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <main className="lg:ml-64 pt-24 pb-12 px-4 md:px-8 lg:px-12 min-h-screen transition-all">
        {children}
      </main>
    </div>
  );
};

export default Layout;
