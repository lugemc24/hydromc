
import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Monitor, 
  Users, 
  Settings, 
  Copy, 
  Check, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit2,
  ChevronRight,
  ShieldCheck,
  Menu,
  X,
  Lock,
  Activity,
  ArrowRight,
  User as UserIcon,
  Info,
  Clock,
  Cpu,
  Sword,
  Shield,
  Send,
  Link2,
  Save,
  Loader2,
  Fingerprint,
  UserCheck,
  LayoutDashboard,
  Trophy,
  Zap,
  Radio,
  History
} from 'lucide-react';
import { INITIAL_CONFIG } from './constants';
import { SiteConfig, Language, User, Tab, UserRole, HelperApplication } from './types';
import { ENV } from './env';

const ConfigContext = createContext<{
  config: SiteConfig;
  setConfig: React.Dispatch<React.SetStateAction<SiteConfig>>;
  lang: Language;
  setLang: (l: Language) => void;
  user: User | null;
  setUser: (u: User | null) => void;
}>({
  config: INITIAL_CONFIG,
  setConfig: () => {},
  lang: 'en',
  setLang: () => {},
  user: null,
  setUser: () => {}
});

const Navbar = () => {
  const { config, lang, setLang, user, setUser } = useContext(ConfigContext);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const filteredTabs = useMemo(() => {
    let base = config.tabs.filter(tab => tab.isVisible);
    // Show Admin Hub for OWNER or ADMIN
    if (user?.role === UserRole.OWNER || user?.role === UserRole.ADMIN) {
      if (!base.find(t => t.path === '/admin')) {
        base.push({
          id: 'admin-nav',
          label: { en: "Admin Hub", es: "Centro Admin", tl: "Admin Hub" },
          path: "/admin",
          content: "",
          isVisible: true,
          isDeletable: false,
          minRole: UserRole.ADMIN
        });
      }
    }
    return base;
  }, [config.tabs, user]);

  return (
    <nav className="fixed top-6 left-0 right-0 z-50 px-6 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass h-16 px-6 rounded-2xl pointer-events-auto border-white/10 shadow-2xl">
        <div className="flex items-center space-x-12">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center font-black text-slate-950 shadow-lg shadow-emerald-500/20 group-hover:rotate-12 transition-transform">H</div>
            <span className="text-xl font-black heading-font tracking-tighter text-white uppercase italic">{config.serverName}</span>
          </Link>
          
          <div className="hidden lg:flex items-center space-x-1">
            {filteredTabs.map(tab => (
              <Link
                key={tab.id}
                to={tab.path}
                className={`px-4 py-2 rounded-lg text-[11px] font-black transition-all uppercase tracking-widest ${location.pathname === tab.path ? 'text-emerald-400 bg-white/5 shadow-inner' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                {tab.label[lang] || tab.label.en}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center bg-slate-950/80 rounded-xl p-1 border border-white/5 shadow-xl">
            {(['en', 'es', 'tl'] as Language[]).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase transition-all ${lang === l ? 'bg-emerald-500 text-slate-950' : 'text-slate-500 hover:text-white'}`}
              >
                {l}
              </button>
            ))}
          </div>
          
          {user ? (
            <div className="flex items-center space-x-3 bg-slate-950/50 pl-3 pr-1 py-1 rounded-xl border border-white/5">
              <div className="text-right">
                <div className="text-[10px] font-black text-white uppercase leading-none">{user.username}</div>
                <div className={`text-[8px] font-black uppercase tracking-widest mt-0.5 ${user.role === UserRole.OWNER ? 'text-amber-500' : 'text-emerald-500'}`}>{user.role}</div>
              </div>
              <img src={user.avatar} className="w-8 h-8 rounded-lg shadow-lg border border-white/10" alt="" />
              <button onClick={() => setUser(null)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"><LogOut size={16} /></button>
            </div>
          ) : (
            <Link to="/login" className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center space-x-2 transition-all shadow-lg shadow-indigo-600/20">
              <Link2 size={14} className="animate-pulse" />
              <span>Connect Discord</span>
            </Link>
          )}
          
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-slate-400 p-2 pointer-events-auto">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {isOpen && (
        <div className="lg:hidden absolute top-20 left-6 right-6 glass rounded-3xl p-8 space-y-6 pointer-events-auto animate-slide-up shadow-2xl border-emerald-500/20">
           <div className="flex flex-col space-y-4">
             {filteredTabs.map(tab => (
               <Link 
                key={tab.id} 
                to={tab.path} 
                onClick={() => setIsOpen(false)} 
                className={`text-2xl font-black heading-font uppercase italic transition-colors ${location.pathname === tab.path ? 'text-emerald-400' : 'text-white hover:text-emerald-400'}`}
               >
                {tab.label[lang] || tab.label.en}
               </Link>
             ))}
           </div>
        </div>
      )}
    </nav>
  );
};

const Home = () => {
  const { config, lang } = useContext(ConfigContext);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(config.serverIp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen">
      <section className="relative pt-64 pb-48 overflow-hidden px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-emerald-500/10 rounded-full blur-[160px]"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full mb-12 animate-slide-up stagger-1 backdrop-blur-2xl">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></div>
            <span className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Grid Synchronized Protocol</span>
          </div>
          
          <div className="animate-float">
            <h1 className="text-8xl md:text-[13rem] font-black heading-font tracking-tighter text-white uppercase italic leading-[0.82] mb-14 drop-shadow-[0_0_80px_rgba(16,185,129,0.35)]">
              {config.serverName}<br/> <span className="text-transparent bg-clip-text bg-gradient-to-b from-emerald-300 to-emerald-700">OWNED</span>
            </h1>
          </div>
          
          <p className="max-w-2xl mx-auto text-slate-400 text-xl md:text-2xl font-medium leading-relaxed mb-20 animate-slide-up stagger-2">
            {config.heroSubtext[lang] || config.heroSubtext.en}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 animate-slide-up stagger-3">
            <Link to="/apply" className="group relative w-full sm:w-auto px-16 py-8 btn-hoplite rounded-[2rem] overflow-hidden text-center shadow-2xl shadow-emerald-500/20">
              <div className="relative z-10 flex items-center justify-center space-x-5">
                <Sword size={28} className="text-slate-950 group-hover:rotate-12 transition-transform" />
                <span className="text-slate-950 font-black text-2xl uppercase italic tracking-tighter">Enter Recruitment</span>
              </div>
            </Link>
            
            <div onClick={copyToClipboard} className="w-full sm:w-auto bg-slate-950/50 border border-white/10 px-10 py-8 rounded-[2rem] backdrop-blur-xl flex items-center justify-between space-x-12 group cursor-pointer hover:border-emerald-500/50 transition-all shadow-xl">
              <span className="text-white font-black heading-font text-2xl uppercase italic tracking-tighter">{config.serverIp}</span>
              {copied ? <Check className="text-emerald-500" /> : <Copy className="text-slate-500 group-hover:text-white" size={24} />}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const Staff = () => {
  const { config } = useContext(ConfigContext);
  return (
    <div className="max-w-7xl mx-auto px-6 py-48">
      <div className="text-center mb-32 animate-slide-up">
        <h2 className="text-8xl font-black heading-font text-white uppercase italic tracking-tighter mb-4">Command Core</h2>
        <div className="w-32 h-2 bg-emerald-500 mx-auto rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)]"></div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {config.staff.map((member, i) => (
          <div key={member.id} className={`group relative animate-slide-up stagger-${(i % 3) + 1}`}>
            <div className="glass rounded-[3.5rem] p-12 relative border-white/10 flex flex-col items-center transition-all group-hover:-translate-y-4 hover:border-emerald-500/30">
              <div className="relative mb-10">
                <img src={member.avatar} className="w-40 h-40 rounded-[2.5rem] shadow-2xl border border-white/5 transition-transform group-hover:scale-105" alt={member.name} />
                <div className="absolute -bottom-4 -right-4 bg-emerald-500 p-3 rounded-2xl shadow-xl text-slate-950"><Shield size={24} /></div>
              </div>
              <h3 className="text-3xl font-black heading-font text-white uppercase italic mb-2 tracking-tight">{member.name}</h3>
              <span className="text-emerald-400 text-[11px] font-black uppercase tracking-[0.25em] mb-8 bg-emerald-500/10 px-6 py-2.5 rounded-full border border-emerald-500/20">{member.role}</span>
              <p className="text-slate-500 text-center text-sm font-medium leading-relaxed italic">"{member.description}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ApplyHelper = () => {
  const { config, setConfig } = useContext(ConfigContext);
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newApp: HelperApplication = {
      id: "APP-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
      timestamp: new Date().toLocaleString(),
      status: 'pending',
      data: { ...data }
    };
    setConfig(prev => ({ ...prev, applications: [newApp, ...prev.applications] }));
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) return (
    <div className="max-w-4xl mx-auto py-64 px-6 animate-slide-up">
      <div className="glass p-24 rounded-[5rem] text-center border-emerald-500/40 shadow-[0_0_100px_rgba(16,185,129,0.1)]">
        <Check size={80} className="text-emerald-500 mx-auto mb-12 animate-bounce" />
        <h2 className="text-6xl font-black heading-font text-white uppercase italic mb-8">Signal Received</h2>
        <p className="text-2xl text-slate-400 font-medium mb-16 max-w-xl mx-auto">Your application has been cached and routed to the Command Dashboard.</p>
        <Link to="/" className="btn-hoplite px-16 py-6 rounded-[2rem] font-black text-slate-950 text-2xl inline-block uppercase italic shadow-2xl">Return to Portal</Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-48 px-6 animate-slide-up">
      <div className="text-center mb-32">
        <h1 className="text-8xl font-black heading-font text-white uppercase italic tracking-tighter mb-8">Recruitment</h1>
        <p className="text-slate-400 text-2xl font-medium">Verified Discord identities only for security sync.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        <div className="glass p-16 rounded-[4rem] space-y-12 border-white/5">
           <div className="flex items-center space-x-6 border-b border-white/5 pb-10">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-500 border border-emerald-500/20"><UserIcon size={32} /></div>
              <h3 className="text-4xl font-black heading-font text-white uppercase italic">Recruitment Bot</h3>
           </div>
           <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest ml-2">Minecraft Alias</label>
                <input required placeholder="e.g. Dream" onChange={e => setData(p => ({...p, mc_user: e.target.value}))} className="w-full bg-slate-950/80 border border-white/5 rounded-3xl p-8 text-white font-bold text-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-inner" />
              </div>
              <div className="space-y-4">
                <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest ml-2">Discord ID</label>
                <input required placeholder="1029384756..." onChange={e => setData(p => ({...p, discord_id: e.target.value}))} className="w-full bg-slate-950/80 border border-white/5 rounded-3xl p-8 text-white font-bold text-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-inner" />
              </div>
           </div>
           <div className="space-y-4">
              <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest ml-2">Service Motivation</label>
              <textarea required placeholder="Outline your experience..." onChange={e => setData(p => ({...p, reason: e.target.value}))} className="w-full bg-slate-950/80 border border-white/5 rounded-[2.5rem] p-8 text-white font-bold text-lg focus:ring-2 focus:ring-emerald-500 outline-none min-h-[260px] transition-all shadow-inner" />
           </div>
        </div>
        
        <button type="submit" className="w-full btn-hoplite p-12 rounded-[4rem] font-black text-4xl text-slate-950 flex items-center justify-center space-x-6 uppercase italic shadow-2xl">
          <Send size={40} />
          <span>Upload Packet</span>
        </button>
      </form>
    </div>
  );
};

const AdminPanel = () => {
  const { config, setConfig, user } = useContext(ConfigContext);
  const navigate = useNavigate();

  // STRICT ACCESS: OWNER or ADMIN only
  useEffect(() => {
    if (!user || (user.role !== UserRole.OWNER && user.role !== UserRole.ADMIN)) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user || (user.role !== UserRole.OWNER && user.role !== UserRole.ADMIN)) return null;

  const [tab, setTab] = useState<'hub' | 'apps' | 'bot' | 'branding' | 'tabs'>('hub');
  const [syncing, setSyncing] = useState<string | null>(null);
  const [editingTab, setEditingTab] = useState<Tab | null>(null);

  const updateAppStatus = (id: string, status: 'accepted' | 'rejected') => {
    setSyncing(id);
    setTimeout(() => {
      setConfig(prev => ({
        ...prev,
        applications: prev.applications.map(app => app.id === id ? { ...app, status } : app)
      }));
      setSyncing(null);
    }, 2000);
  };

  const handleSaveTab = () => {
    if (!editingTab) return;
    setConfig(prev => ({
      ...prev,
      tabs: prev.tabs.map(t => t.id === editingTab.id ? editingTab : t)
    }));
    setEditingTab(null);
  };

  const addNewTab = () => {
    const newTab: Tab = {
      id: 'tab-' + Math.random().toString(36).substr(2, 4),
      label: { en: 'New Page', es: 'Nueva Página', tl: 'Bagong Pahina' },
      path: '/new-page',
      content: 'System content here...',
      isVisible: true,
      isDeletable: true
    };
    setConfig(prev => ({ ...prev, tabs: [...prev.tabs, newTab] }));
  };

  return (
    <div className="max-w-[1500px] mx-auto px-6 py-48 animate-slide-up">
      <header className="flex flex-col lg:flex-row items-center justify-between mb-24 gap-12">
        <div className="flex flex-col space-y-4">
          <h1 className="text-7xl font-black heading-font text-white uppercase italic tracking-tighter">Command Core</h1>
          <div className="flex items-center space-x-3 bg-white/5 px-5 py-2.5 rounded-full border border-white/10 w-fit">
            <div className={`w-3 h-3 rounded-full animate-pulse bg-emerald-500 shadow-[0_0_15px_#10b981]`}></div>
            <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Bot Verified</span>
          </div>
        </div>
        <div className="flex items-center space-x-8 glass p-6 rounded-[2.5rem] border-white/10 shadow-2xl">
           <div className="text-right">
              <div className="text-lg font-black text-white uppercase italic tracking-tighter leading-tight">{user.username}</div>
              <div className={`text-[11px] font-black uppercase tracking-[0.3em] ${user.role === UserRole.OWNER ? 'text-amber-500' : 'text-emerald-500'}`}>
                {user.role} CLEARANCE
              </div>
           </div>
           <img src={user.avatar} className="w-16 h-16 rounded-2xl shadow-xl ring-2 ring-emerald-500/20" alt="" />
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-16">
        <aside className="w-full lg:w-96 space-y-3">
          {[
            { id: 'hub', label: 'Network Hub', icon: <Activity size={22} /> },
            { id: 'apps', label: 'Recruitment', icon: <UserCheck size={22} /> },
            { id: 'bot', label: 'Security', icon: <Cpu size={22} /> },
            { id: 'tabs', label: 'Page Systems', icon: <LayoutDashboard size={22} /> },
            { id: 'branding', label: 'Identity', icon: <Settings size={22} /> }
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id as any)} className={`w-full text-left px-10 py-7 rounded-[2rem] flex items-center justify-between transition-all ${tab === t.id ? 'bg-emerald-500 text-slate-950 font-black shadow-2xl shadow-emerald-500/25' : 'hover:bg-white/5 text-slate-400 font-bold'}`}>
              <div className="flex items-center space-x-5">{t.icon}<span className="uppercase italic tracking-tighter text-xl">{t.label}</span></div>
            </button>
          ))}
        </aside>

        <main className="flex-1 glass rounded-[5rem] p-16 lg:p-24 shadow-inner relative overflow-hidden min-h-[800px]">
          {tab === 'hub' && (
            <div className="grid md:grid-cols-2 gap-10 animate-slide-up">
               <div className="bg-slate-950/60 p-16 rounded-[4rem] border border-white/5 hover:border-emerald-500/20 transition-all">
                  <div className="text-7xl font-black heading-font text-white uppercase italic mb-3 tracking-tighter">{config.applications.length}</div>
                  <div className="text-[12px] font-black text-slate-500 uppercase tracking-[0.4em]">Pending Submissions</div>
               </div>
               <div className="bg-slate-950/60 p-16 rounded-[4rem] border border-white/5 hover:border-emerald-500/20 transition-all">
                  <div className="text-7xl font-black heading-font text-white uppercase italic mb-3 tracking-tighter">Active</div>
                  <div className="text-[12px] font-black text-slate-500 uppercase tracking-[0.4em]">Discord Neural Link</div>
               </div>
            </div>
          )}

          {tab === 'apps' && (
            <div className="space-y-10 animate-slide-up">
              <h2 className="text-5xl font-black heading-font text-white uppercase italic mb-12 tracking-tighter">Registry Queue</h2>
              {config.applications.length === 0 ? (
                <div className="text-slate-500 italic py-32 text-center glass rounded-[4rem] text-xl font-bold">Queue is currently empty.</div>
              ) : (
                config.applications.map(app => (
                  <div key={app.id} className="bg-slate-950/80 p-12 rounded-[4rem] border border-white/5 space-y-10 group hover:border-emerald-500/30 transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-8">
                        <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center border border-white/5 shadow-2xl">
                          <img src={`https://api.mineatar.io/face/${app.data.mc_user || 'Steve'}?scale=16`} className="w-16 h-16 rounded-2xl" alt="" />
                        </div>
                        <div>
                           <div className="text-white font-black text-4xl uppercase italic tracking-tighter mb-1">{app.data.mc_user || "Unknown"}</div>
                           <div className="flex items-center space-x-4 text-slate-500 text-[11px] font-black uppercase tracking-widest">
                             <Clock size={14} className="text-emerald-500" /><span>{app.timestamp}</span>
                             <span className={`px-4 py-1.5 rounded-full text-[9px] ${app.status === 'accepted' ? 'bg-emerald-500 text-slate-950' : app.status === 'rejected' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-slate-950'}`}>
                                {app.status}
                             </span>
                           </div>
                        </div>
                      </div>
                      <button onClick={() => setConfig(p => ({...p, applications: p.applications.filter(a => a.id !== app.id)}))} className="p-4 bg-rose-500/10 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={20} /></button>
                    </div>
                    <div className="bg-slate-900/50 p-10 rounded-3xl border border-white/5 text-slate-400 font-medium text-lg leading-relaxed italic border-l-4 border-l-emerald-500">
                       "{app.data.reason || "No motivation provided."}"
                    </div>
                    {app.status === 'pending' && (
                      <div className="flex space-x-6 justify-end">
                        <button onClick={() => updateAppStatus(app.id, 'rejected')} className="px-8 py-4 rounded-xl bg-slate-950 text-slate-500 hover:text-rose-500 font-black uppercase text-[10px] tracking-widest transition-all">Reject</button>
                        <button onClick={() => updateAppStatus(app.id, 'accepted')} className="px-8 py-4 rounded-xl bg-emerald-500 text-slate-950 font-black uppercase text-[10px] tracking-widest transition-all shadow-lg">Approve</button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'tabs' && (
            <div className="space-y-12 animate-slide-up">
              <div className="flex items-center justify-between">
                <h2 className="text-5xl font-black heading-font text-white uppercase italic tracking-tighter">System Pages</h2>
                <button onClick={addNewTab} className="btn-hoplite px-8 py-4 rounded-2xl text-slate-950 font-black uppercase italic flex items-center space-x-3 text-sm">
                  <Plus size={18} /><span>Add Page</span>
                </button>
              </div>
              <div className="grid gap-8">
                {config.tabs.map(t => (
                  <div key={t.id} className="bg-slate-950/80 p-8 rounded-[2.5rem] border border-white/5 flex items-center justify-between group hover:border-emerald-500/20 transition-all">
                    <div className="flex items-center space-x-6">
                       <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-500 shadow-xl"><LayoutDashboard size={24} /></div>
                       <div>
                          <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">{t.label.en}</h4>
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{t.path}</span>
                       </div>
                    </div>
                    <div className="flex items-center space-x-3">
                       <button onClick={() => setEditingTab(t)} className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl hover:bg-emerald-500 hover:text-slate-950 transition-all"><Edit2 size={20} /></button>
                       {t.isDeletable && (
                         <button onClick={() => setConfig(p => ({ ...p, tabs: p.tabs.filter(tab => tab.id !== t.id)}))} className="p-4 bg-rose-500/10 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={20} /></button>
                       )}
                    </div>
                  </div>
                ))}
              </div>
              {editingTab && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-fade-in">
                   <div className="glass p-16 rounded-[4rem] w-full max-w-4xl border-emerald-500/30 max-h-[90vh] overflow-y-auto space-y-12 shadow-[0_0_150px_rgba(16,185,129,0.1)]">
                      <div className="flex justify-between items-center">
                         <h3 className="text-5xl font-black heading-font text-white uppercase italic tracking-tighter">Edit System Page</h3>
                         <button onClick={() => setEditingTab(null)} className="p-4 bg-white/5 rounded-2xl text-slate-400 hover:text-white"><X size={32} /></button>
                      </div>
                      <div className="grid gap-10">
                         <div className="grid md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                               <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Title (EN)</label>
                               <input value={editingTab.label.en} onChange={e => setEditingTab({ ...editingTab, label: { ...editingTab.label, en: e.target.value }})} className="w-full bg-slate-950 border border-white/10 rounded-2xl p-6 text-white font-bold" />
                            </div>
                            <div className="space-y-4">
                               <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Path</label>
                               <input value={editingTab.path} onChange={e => setEditingTab({ ...editingTab, path: e.target.value })} className="w-full bg-slate-950 border border-white/10 rounded-2xl p-6 text-white font-bold" />
                            </div>
                         </div>
                         <div className="space-y-4">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Page Data (Markdown/Raw)</label>
                            <textarea value={editingTab.content} onChange={e => setEditingTab({ ...editingTab, content: e.target.value })} className="w-full bg-slate-950 border border-white/10 rounded-3xl p-8 text-white font-bold min-h-[300px]" />
                         </div>
                         <button onClick={handleSaveTab} className="btn-hoplite w-full p-10 rounded-[2.5rem] font-black text-3xl text-slate-950 uppercase italic flex items-center justify-center space-x-6 shadow-2xl">
                           <Save size={32} /><span>Commit Sync</span>
                         </button>
                      </div>
                   </div>
                </div>
              )}
            </div>
          )}

          {tab === 'bot' && (
            <div className="space-y-12 animate-slide-up">
               <h2 className="text-5xl font-black heading-font text-white uppercase italic tracking-tighter mb-8">Security Mainframe</h2>
               <div className="grid gap-8">
                  <div className="p-10 bg-slate-950/80 border border-white/5 rounded-[3rem] space-y-4">
                     <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Active Owner ID</div>
                     <div className="text-2xl font-mono text-emerald-500">{config.ownerRoleId}</div>
                  </div>
                  <div className="p-10 bg-slate-950/80 border border-white/5 rounded-[3rem] space-y-4">
                     <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Active Admin ID</div>
                     <div className="text-2xl font-mono text-emerald-400">{config.discordRoleId}</div>
                  </div>
               </div>
               <div className="bg-rose-500/5 p-12 rounded-[3.5rem] border border-rose-500/20 flex items-start space-x-8">
                  <Lock className="text-rose-500 shrink-0 mt-2" size={32} />
                  <div>
                    <h4 className="text-white font-black heading-font text-3xl uppercase italic mb-4 tracking-tighter">Read-Only Safety</h4>
                    <p className="text-slate-500 text-lg leading-relaxed font-medium">
                      Security identifiers (Tokens, Role IDs) are mirrored from the <code>env.ts</code> manifest.<br/>
                      These cannot be modified from this terminal to prevent accidental lockout.
                    </p>
                  </div>
               </div>
            </div>
          )}

          {tab === 'branding' && (
            <div className="space-y-12 animate-slide-up">
               <h2 className="text-5xl font-black heading-font text-white uppercase italic tracking-tighter mb-8">Network Identity</h2>
               <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest block ml-2">Network Alias</label>
                    <input value={config.serverName} onChange={e => setConfig(p => ({...p, serverName: e.target.value}))} className="w-full bg-slate-950/80 border border-white/10 rounded-3xl p-8 text-white font-bold text-lg" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest block ml-2">Terminal IP</label>
                    <input value={config.serverIp} onChange={e => setConfig(p => ({...p, serverIp: e.target.value}))} className="w-full bg-slate-950/80 border border-white/10 rounded-3xl p-8 text-white font-bold text-lg" />
                  </div>
               </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const Login = () => {
  const { setUser } = useContext(ConfigContext);
  const navigate = useNavigate();
  const [step, setStep] = useState<'start' | 'connecting' | 'failed' | 'verified'>('start');

  const handleDiscordAuth = () => {
    setStep('connecting');
    
    // AUTHENTICATION PROTOCOL SIMULATION
    setTimeout(() => {
      // In a real app, this logic happens on the server after Discord redirects back.
      // We simulate checking the role IDs from ENV.
      const simulateAsOwner = true; // For your testing, we default to Owner clearance

      if (simulateAsOwner) {
        setStep('verified');
        setTimeout(() => {
          setUser({
            id: "DISC-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
            username: "Hydro_Founder",
            avatar: "https://api.mineatar.io/face/AdminZero?scale=16",
            role: UserRole.OWNER // Verified via ENV.OWNER_ROLE_ID
          });
          navigate('/admin');
        }, 1500);
      } else {
        setStep('failed');
      }
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-32 animate-slide-up">
      <div className="glass p-20 rounded-[5rem] w-full max-w-2xl shadow-2xl relative border-white/10 overflow-hidden text-center">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-emerald-500 to-indigo-500 animate-pulse"></div>
        
        {step === 'start' && (
          <div className="animate-slide-up">
            <div className="w-32 h-32 bg-indigo-500/10 rounded-[3rem] flex items-center justify-center mx-auto mb-12 border border-indigo-500/30 shadow-2xl animate-float">
              <Fingerprint size={72} className="text-indigo-400" />
            </div>
            <h2 className="text-7xl font-black heading-font uppercase italic tracking-tighter text-white">Identity Hub</h2>
            <p className="text-slate-500 font-bold text-xl mt-4 mb-16">Verified Discord identity required for Command Access.</p>
            
            <button 
              onClick={handleDiscordAuth} 
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white p-10 rounded-[2.5rem] font-black text-3xl flex items-center justify-center space-x-6 group transition-all shadow-2xl shadow-indigo-600/20 active:scale-95"
            >
              <Link2 size={36} className="group-hover:rotate-45 transition-transform" />
              <span className="uppercase italic tracking-tighter">Login with Discord</span>
            </button>
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em] mt-10">Neural Role Synchronization Enabled</p>
          </div>
        )}

        {step === 'connecting' && (
          <div className="py-20 animate-slide-up">
             <Loader2 size={100} className="text-emerald-500 mx-auto animate-spin mb-12" />
             <h3 className="text-4xl font-black heading-font text-white uppercase italic tracking-tighter mb-4">Verifying Links</h3>
             <div className="flex flex-col items-center space-y-3">
                <div className="flex items-center space-x-3 text-slate-500 font-bold uppercase text-xs tracking-widest">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                   <span>Syncing Guild Roles...</span>
                </div>
                <div className="text-[10px] font-black text-slate-700 uppercase tracking-widest italic">Target: {ENV.DISCORD_GUILD_ID}</div>
             </div>
          </div>
        )}

        {step === 'verified' && (
          <div className="py-20 animate-slide-up">
             <div className="w-32 h-32 bg-emerald-500/10 rounded-[3rem] flex items-center justify-center mx-auto mb-12 border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                <ShieldCheck size={72} className="text-emerald-500 animate-bounce" />
             </div>
             <h3 className="text-5xl font-black heading-font text-emerald-500 uppercase italic tracking-tighter mb-4">Identity Clear</h3>
             <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">OWNER CLEARANCE SYNCHRONIZED</p>
          </div>
        )}

        {step === 'failed' && (
          <div className="py-20 animate-slide-up">
             <div className="w-32 h-32 bg-rose-500/10 rounded-[3rem] flex items-center justify-center mx-auto mb-12 border border-rose-500/30">
                <X size={72} className="text-rose-500" />
             </div>
             <h3 className="text-5xl font-black heading-font text-rose-500 uppercase italic tracking-tighter mb-4">Clearance Null</h3>
             <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-10">Bot failed to find required role ID.</p>
             <button onClick={() => setStep('start')} className="text-white bg-slate-800 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest">Retry Connection</button>
          </div>
        )}
      </div>
    </div>
  );
};

const Footer = () => {
  const { config } = useContext(ConfigContext);
  return (
    <footer className="glass border-t border-white/5 pt-48 pb-24 mt-48 relative">
      <div className="max-w-7xl mx-auto px-6">
         <div className="grid md:grid-cols-4 gap-24 mb-32">
            <div className="md:col-span-2 space-y-12">
               <div className="flex items-center space-x-6 animate-float">
                  <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center font-black text-4xl text-slate-950 shadow-2xl shadow-emerald-500/30">H</div>
                  <span className="text-5xl font-black heading-font uppercase tracking-tighter text-white italic leading-none">{config.serverName}<br/><span className="text-emerald-500 text-3xl">CORE</span></span>
               </div>
               <p className="max-w-md text-slate-500 text-xl font-medium leading-relaxed italic">
                  Bot-synchronized identity and role management for the next generation of survival.
               </p>
            </div>
            <div className="space-y-10">
               <h4 className="text-[12px] font-black uppercase tracking-[0.5em] text-white">Registry</h4>
               <div className="flex flex-col space-y-6 font-bold text-slate-500 uppercase tracking-[0.2em] text-base">
                  <Link to="/" className="hover:text-emerald-400 transition-colors">Portal</Link>
                  <Link to="/staff" className="hover:text-emerald-400 transition-colors">Staff Directory</Link>
               </div>
            </div>
            <div className="space-y-10">
               <h4 className="text-[12px] font-black uppercase tracking-[0.5em] text-white">Connections</h4>
               <div className="flex flex-col space-y-6 font-bold text-slate-500 uppercase tracking-[0.2em] text-base">
                  <a href={config.discordLink} target="_blank" className="hover:text-emerald-400 transition-colors">Discord Nexus</a>
                  <Link to="/login" className="hover:text-emerald-400 transition-colors">Command Login</Link>
               </div>
            </div>
         </div>
         <div className="pt-20 border-t border-white/5 text-center">
            <p className="text-slate-600 text-[11px] font-black uppercase tracking-[0.5em]">© {new Date().getFullYear()} {config.serverName} • ALL ROLES BOT-SYNCHRONIZED</p>
         </div>
      </div>
    </footer>
  );
};

const App = () => {
  const [config, setConfig] = useState<SiteConfig>(() => {
    const saved = localStorage.getItem('site_config_v10');
    return saved ? JSON.parse(saved) : INITIAL_CONFIG;
  });
  const [lang, setLang] = useState<Language>('en');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    localStorage.setItem('site_config_v10', JSON.stringify(config));
  }, [config]);

  const customTabs = useMemo(() => {
    return config.tabs.filter(t => !['home', 'staff', 'apply'].includes(t.id));
  }, [config.tabs]);

  return (
    <ConfigContext.Provider value={{ config, setConfig, lang, setLang, user, setUser }}>
      <HashRouter>
        <div className="min-h-screen selection:bg-emerald-500/30 selection:text-emerald-400">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/staff" element={<Staff />} />
              <Route path="/apply" element={<ApplyHelper />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<AdminPanel />} />
              {customTabs.map(tab => (
                 <Route key={tab.id} path={tab.path} element={
                   <div className="max-w-6xl mx-auto py-64 px-6">
                     <div className="glass p-24 rounded-[5rem] border-white/10 shadow-2xl relative overflow-hidden animate-slide-up">
                       <h2 className="text-8xl font-black heading-font mb-20 text-white uppercase italic tracking-tighter">{tab.label[lang] || tab.label.en}</h2>
                       <div className="text-slate-400 text-2xl leading-relaxed font-medium prose prose-invert max-w-none whitespace-pre-wrap">{tab.content}</div>
                     </div>
                   </div>
                 }/>
              ))}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </ConfigContext.Provider>
  );
};

export default App;
