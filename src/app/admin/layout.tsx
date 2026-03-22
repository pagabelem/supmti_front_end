'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import {
  LayoutDashboard, Users, Database, MessageSquare,
  BarChart3, Shield, LogOut, GraduationCap,
  UserCheck, ChevronRight, Loader2, BrainCircuit,
  BarChart2, FileText, Search, Bell, Sun, Moon, X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const NAV = [
  { href:'/admin/dashboard',     label:'Dashboard',     icon:LayoutDashboard, color:'text-slate-400' },
  { href:'/admin/users',         label:'Étudiants',     icon:Users,           color:'text-blue-400'    },
  { href:'/admin/ambassadors',   label:'Ambassadeurs', icon:UserCheck,       color:'text-purple-400'  },
  { href:'/admin/fitscore',      label:'FitScore',      icon:BarChart2,       color:'text-orange-400'  },
  { href:'/admin/peermatch',     label:'PeerMatch',     icon:Users,           color:'text-cyan-400'    },
  { href:'/admin/knowledge',     label:'Base RAG',      icon:Database,        color:'text-emerald-400' },
  { href:'/admin/conversations', label:'Conversations',icon:MessageSquare,    color:'text-green-400'   },
  { href:'/admin/analytics',     label:'Analytics',     icon:BarChart3,       color:'text-yellow-400'  },
  { href:'/admin/reports',       label:'Rapports',      icon:FileText,        color:'text-pink-400'    },
  { href:'/admin/ai-config',     label:'Config IA',     icon:BrainCircuit,    color:'text-red-400'     },
];

// ── Composant recherche globale ───────────────────────────────
function GlobalSearch({ onClose }: { onClose: () => void }) {
  const [q,       setQ]       = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    if (!q.trim() || q.length < 2) { setResults([]); return; }
    setLoading(true);
    const uid = (() => { try { return JSON.parse(localStorage.getItem('supmti-auth')||'{}')?.state?.user?.id||''; } catch { return ''; } })();
    fetch(`${API}/api/admin/students`, { credentials:'include', headers: uid ? {'X-User-Id':uid} : {} })
      .then(r => r.json())
      .then(d => {
        const students = (d.students||[]).filter((s:any) =>
          s.full_name?.toLowerCase().includes(q.toLowerCase()) ||
          s.email?.toLowerCase().includes(q.toLowerCase()) ||
          s.city?.toLowerCase().includes(q.toLowerCase())
        ).slice(0,5).map((s:any) => ({ type:'student', label:s.full_name, sub:s.email, href:'/admin/users', id:s.id }));
        setResults(students);
      })
      .catch(()=>setResults([]))
      .finally(()=>setLoading(false));
  }, [q]);

  const navResults = NAV.filter(n => n.label.toLowerCase().includes(q.toLowerCase()))
    .map(n => ({ type:'page', label:n.label, sub:'Page admin', href:n.href }));

  const all = [...navResults, ...results];

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 bg-black/70 backdrop-blur-sm"
      onClick={e => { if(e.target===e.currentTarget) onClose(); }}>
      <div className="w-full max-w-xl mx-4 bg-bg-card border border-border-base rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 p-4 border-b border-border-base">
          <Search size={18} className="text-text-secondary shrink-0" />
          <input ref={inputRef} value={q} onChange={e=>setQ(e.target.value)}
            placeholder="Rechercher étudiants, pages, ambassadeurs…"
            className="flex-1 bg-transparent text-text-primary text-sm outline-none placeholder:text-text-muted" />
          {loading && <Loader2 size={14} className="animate-spin text-text-secondary" />}
          <button onClick={onClose} className="text-text-muted hover:text-text-primary"><X size={16}/></button>
        </div>
        <div className="max-h-80 overflow-y-auto bg-bg-card">
          {q.length < 2 ? (
            <div className="p-8 text-center text-text-muted text-sm">Tape au moins 2 caractères…</div>
          ) : all.length === 0 ? (
            <div className="p-8 text-center text-text-muted text-sm">Aucun résultat pour "{q}"</div>
          ) : all.map((r, i) => (
            <button key={i} onClick={() => { router.push(r.href); onClose(); }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bg-hover transition-all text-left">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black",
                r.type==='page' ? "bg-supmti-blue/20 text-supmti-blue" : "bg-accent-blue/20 text-accent-blue")}>
                {r.type==='page' ? '📄' : r.label.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-text-primary">{r.label}</p>
                <p className="text-xs text-text-secondary">{r.sub}</p>
              </div>
              <span className={cn("ml-auto text-[9px] px-2 py-0.5 rounded-full font-bold uppercase",
                r.type==='page' ? "bg-bg-input text-text-secondary" : "bg-accent-blue/10 text-accent-blue")}>
                {r.type==='page' ? 'Page' : 'Étudiant'}
              </span>
            </button>
          ))}
        </div>
        <div className="px-4 py-2 border-t border-border-base text-[10px] text-text-muted bg-bg-sidebar/50">
          Entrée pour naviguer · Échap pour fermer
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout }      = useAuthStore();
  const { theme, setTheme }   = useTheme();
  const router                = useRouter();
  const pathname              = usePathname();
  const [mounted,  setMounted]  = useState(false);
  const [showSearch,setShowSearch]= useState(false);
  const [notifCount,setNotifCount]= useState(0);
  const [showNotif, setShowNotif] = useState(false);
  const [notifs,    setNotifs]    = useState<any[]>([]);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!user)                 { router.push('/login');     return; }
    if (user.role !== 'admin') { router.push('/dashboard'); }
  }, [mounted, user, router]);

  useEffect(() => {
    if (!mounted || !user || user.role !== 'admin') return;
    const uid = (() => { try { return JSON.parse(localStorage.getItem('supmti-auth')||'{}')?.state?.user?.id||''; } catch { return ''; } })();
    
    const fetchNotifs = () => {
        fetch(`${API}/api/admin/students`, { credentials:'include', headers: uid ? {'X-User-Id':uid} : {} })
        .then(r => r.json())
        .then(d => {
            const recent = (d.students||[]).filter((s:any) => {
                const date = new Date(s.created_at);
                return (Date.now() - date.getTime()) < 24*60*60*1000;
            });
            setNotifCount(recent.length);
            setNotifs(recent.map((s:any) => ({
                msg: `${s.full_name} vient de s'inscrire`,
                time: new Date(s.created_at).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}),
            })));
        }).catch(()=>{});
    };

    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, [mounted, user]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setShowSearch(true); }
      if (e.key === 'Escape') { setShowSearch(false); setShowNotif(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (!mounted || !user || user.role !== 'admin') {
    return (
      <div className="flex h-screen items-center justify-center bg-bg-primary">
        <Loader2 size={24} className="animate-spin text-supmti-blue" />
      </div>
    );
  }

  return (
    <>
      {showSearch && <GlobalSearch onClose={() => setShowSearch(false)} />}

      <div className="flex h-screen bg-bg-primary text-text-primary overflow-hidden transition-colors duration-300">

        {/* ── Sidebar ── */}
        <aside className="w-64 flex flex-col border-r border-border-base bg-bg-sidebar shrink-0">

          <div className="h-16 flex items-center gap-3 px-5 border-b border-border-base">
            <div className="w-8 h-8 rounded-lg bg-supmti-blue flex items-center justify-center shrink-0 shadow-lg shadow-supmti-blue/20">
              <Shield size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-text-primary leading-none">SUPMTI</p>
              <p className="text-[10px] text-supmti-blue font-bold uppercase tracking-widest">Backoffice</p>
            </div>
          </div>

          <div className="px-3 py-3 border-b border-border-base space-y-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-hover/50 border border-border-base/50">
              <div className="w-7 h-7 rounded-lg bg-supmti-blue/20 flex items-center justify-center text-supmti-blue font-black text-xs shrink-0">
                {user.full_name?.charAt(0)||'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-text-primary truncate">{user.full_name}</p>
                <p className="text-[9px] text-supmti-blue font-bold uppercase tracking-widest">Administrateur</p>
              </div>
            </div>
            <button onClick={() => setShowSearch(true)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-input border border-border-base text-text-secondary hover:text-text-primary text-xs transition-all">
              <Search size={13}/><span className="flex-1 text-left">Rechercher…</span>
              <kbd className="text-[9px] bg-bg-hover px-1.5 py-0.5 rounded font-mono border border-border-base">⌘K</kbd>
            </button>
          </div>

          <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
            {NAV.map(({ href, label, icon:Icon, color }) => {
              const active = pathname===href || pathname.startsWith(href+'/');
              return (
                <Link key={href} href={href} className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold",
                  active ? "bg-supmti-blue text-white shadow-lg shadow-supmti-blue/20"
                         : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
                )}>
                  <Icon size={15} className={active ? 'text-white' : color} />
                  <span className="flex-1">{label}</span>
                  {active && <ChevronRight size={13}/>}
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-border-base space-y-1">
            <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-all text-sm font-semibold">
              <GraduationCap size={15}/> Voir le site
            </Link>
            <button onClick={() => { logout(); router.push('/login'); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-sm font-semibold">
              <LogOut size={15}/> Déconnexion
            </button>
          </div>
        </aside>

        {/* ── Contenu ── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          <header className="h-14 flex items-center justify-between px-6 border-b border-border-base bg-bg-sidebar shrink-0">
            <div className="flex items-center gap-2 text-sm text-text-secondary font-medium uppercase tracking-wider">
               <span className="text-supmti-blue font-black">/</span>
               {NAV.find(n=>n.href===pathname)?.label || 'Admin'}
            </div>
            
            <div className="flex items-center gap-3">
              {/* Dark Toggle Sécurisé */}
              <button
                onClick={() => setTheme(theme==='dark'?'light':'dark')}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-input border border-border-base text-text-secondary hover:text-text-primary transition-all"
              >
                {mounted && (theme === 'dark' ? (
                  <><Sun size={15} className="text-accent-orange"/><span className="text-xs font-bold hidden md:block">Clair</span></>
                ) : (
                  <><Moon size={15} className="text-accent-blue"/><span className="text-xs font-bold hidden md:block">Sombre</span></>
                ))}
              </button>

              <div className="relative">
                <button onClick={() => setShowNotif(!showNotif)}
                  className="relative p-2 rounded-xl hover:bg-bg-hover text-text-secondary hover:text-text-primary transition-all">
                  <Bell size={18}/>
                  {notifCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-black text-white flex items-center justify-center animate-pulse">
                      {notifCount > 9 ? '9+' : notifCount}
                    </span>
                  )}
                </button>
                {showNotif && (
                  <div className="absolute right-0 top-12 w-72 bg-bg-card border border-border-base rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border-base bg-bg-sidebar/50">
                      <p className="text-xs font-black text-text-primary uppercase tracking-widest">Notifications</p>
                      <button onClick={() => {setShowNotif(false);setNotifCount(0);}} className="text-text-muted hover:text-text-primary"><X size={14}/></button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {notifs.length===0 ? (
                        <p className="text-center text-text-muted text-xs py-8">Aucune notification</p>
                        ) : notifs.map((n,i)=>(
                        <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-bg-hover transition-all border-b border-border-base/50">
                            <div className="w-8 h-8 rounded-full bg-supmti-blue/10 flex items-center justify-center text-supmti-blue text-xs font-black shrink-0 border border-supmti-blue/20">
                            {n.msg.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                            <p className="text-xs text-text-primary font-bold truncate">{n.msg}</p>
                            <p className="text-[10px] text-text-muted">{n.time}</p>
                            </div>
                        </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-bg-primary p-6">
            <div className="max-w-7xl mx-auto">
                {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}