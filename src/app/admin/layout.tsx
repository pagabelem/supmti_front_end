/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */


// 'use client';
// import { useEffect, useState, useRef, useCallback } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import { useTheme } from 'next-themes';
// import Link from 'next/link';
// import { useAuthStore } from '@/store/authStore';
// import {
//   LayoutDashboard, Users, Database, MessageSquare,
//   BarChart3, Shield, LogOut, GraduationCap,
//   UserCheck, ChevronRight, Loader2, BrainCircuit,
//   BarChart2, FileText, Search, Bell, Sun, Moon, X,
//   AlertTriangle
// } from 'lucide-react';
// import { cn } from '@/lib/utils';

// const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// const NAV = [
//   { href:'/admin/dashboard',     label:'Dashboard',      icon:LayoutDashboard, color:'text-slate-400'   },
//   { href:'/admin/users',         label:'Étudiants',      icon:Users,           color:'text-blue-400'    },
//   { href:'/admin/ambassadors',   label:'Ambassadeurs',   icon:UserCheck,       color:'text-purple-400'  },
//   { href:'/admin/fitscore',      label:'FitScore',       icon:BarChart2,       color:'text-orange-400'  },
//   { href:'/admin/peermatch',     label:'PeerMatch',      icon:Users,           color:'text-cyan-400'    },
//   { href:'/admin/knowledge',     label:'Base RAG',       icon:Database,        color:'text-emerald-400' },
//   { href:'/admin/faq',           label:'FAQ manquante',  icon:AlertTriangle,   color:'text-red-400'     },
//   { href:'/admin/anonymous',     label:'Visiteurs Anonymes', icon:Users,       color:'text-orange-400' },
//   { href:'/admin/conversations', label:'Conversations',  icon:MessageSquare,   color:'text-green-400'   },
//   { href:'/admin/analytics',     label:'Analytics',      icon:BarChart3,       color:'text-yellow-400'  },
//   { href:'/admin/reports',       label:'Rapports',       icon:FileText,        color:'text-pink-400'    },
//   { href:'/admin/ai-config',     label:'Config IA',      icon:BrainCircuit,    color:'text-red-400'     },
// ];

// // ── Helper headers typé correctement ─────────────────────────
// function getAuthHeaders(): Record<string, string> {
//   try {
//     const uid = JSON.parse(localStorage.getItem('supmti-auth') || '{}')?.state?.user?.id || '';
//     if (uid) return { 'X-User-Id': uid };
//   } catch {}
//   return {};
// }

// // ── Composant recherche globale ───────────────────────────────
// function GlobalSearch({ onClose }: { onClose: () => void }) {
//   const [q,       setQ]       = useState('');
//   const [results, setResults] = useState<{ type: string; label: string; sub: string; href: string }[]>([]);
//   const [loading, setLoading] = useState(false);
//   const router   = useRouter();
//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => { inputRef.current?.focus(); }, []);

//   useEffect(() => {
//     if (!q.trim() || q.length < 2) { setResults([]); return; }
//     setLoading(true);
//     fetch(`${API}/api/admin/students`, {
//       credentials: 'include',
//       headers: getAuthHeaders(),
//     })
//       .then(r => r.json())
//       .then((d: { students?: { full_name?: string; email?: string; city?: string; id?: string }[] }) => {
//         const students = (d.students || [])
//           .filter(s =>
//             s.full_name?.toLowerCase().includes(q.toLowerCase()) ||
//             s.email?.toLowerCase().includes(q.toLowerCase()) ||
//             s.city?.toLowerCase().includes(q.toLowerCase())
//           )
//           .slice(0, 5)
//           .map(s => ({ type: 'student', label: s.full_name || '', sub: s.email || '', href: '/admin/users' }));
//         setResults(students);
//       })
//       .catch(() => setResults([]))
//       .finally(() => setLoading(false));
//   }, [q]);

//   const navResults = NAV
//     .filter(n => n.label.toLowerCase().includes(q.toLowerCase()))
//     .map(n => ({ type: 'page', label: n.label, sub: 'Page admin', href: n.href }));

//   const all = [...navResults, ...results];

//   return (
//     <div
//       className="fixed inset-0 z-[100] flex items-start justify-center pt-20 bg-black/70 backdrop-blur-sm"
//       onClick={e => { if (e.target === e.currentTarget) onClose(); }}
//     >
//       <div className="w-full max-w-xl mx-4 bg-bg-card border border-border-base rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
//         <div className="flex items-center gap-3 p-4 border-b border-border-base">
//           <Search size={18} className="text-text-secondary shrink-0" />
//           <input
//             ref={inputRef} value={q} onChange={e => setQ(e.target.value)}
//             placeholder="Rechercher étudiants, pages, ambassadeurs…"
//             className="flex-1 bg-transparent text-text-primary text-sm outline-none placeholder:text-text-muted"
//           />
//           {loading && <Loader2 size={14} className="animate-spin text-text-secondary" />}
//           <button onClick={onClose} className="text-text-muted hover:text-text-primary"><X size={16} /></button>
//         </div>
//         <div className="max-h-80 overflow-y-auto bg-bg-card">
//           {q.length < 2 ? (
//             <div className="p-8 text-center text-text-muted text-sm">Tape au moins 2 caractères…</div>
//           ) : all.length === 0 ? (
//             <div className="p-8 text-center text-text-muted text-sm">Aucun résultat pour &quot;{q}&quot;</div>
//           ) : all.map((r, i) => (
//             <button
//               key={i}
//               onClick={() => { router.push(r.href); onClose(); }}
//               className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bg-hover transition-all text-left"
//             >
//               <div className={cn(
//                 'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black',
//                 r.type === 'page' ? 'bg-supmti-blue/20 text-supmti-blue' : 'bg-accent-blue/20 text-accent-blue'
//               )}>
//                 {r.type === 'page' ? '📄' : r.label.charAt(0)}
//               </div>
//               <div>
//                 <p className="text-sm font-bold text-text-primary">{r.label}</p>
//                 <p className="text-xs text-text-secondary">{r.sub}</p>
//               </div>
//               <span className={cn(
//                 'ml-auto text-[9px] px-2 py-0.5 rounded-full font-bold uppercase',
//                 r.type === 'page' ? 'bg-bg-input text-text-secondary' : 'bg-accent-blue/10 text-accent-blue'
//               )}>
//                 {r.type === 'page' ? 'Page' : 'Étudiant'}
//               </span>
//             </button>
//           ))}
//         </div>
//         <div className="px-4 py-2 border-t border-border-base text-[10px] text-text-muted bg-bg-sidebar/50">
//           Entrée pour naviguer · Échap pour fermer
//         </div>
//       </div>
//     </div>
//   );
// }

// // ════════════════════════════════════════════════════════════════
// // LAYOUT PRINCIPAL
// // ════════════════════════════════════════════════════════════════
// export default function AdminLayout({ children }: { children: React.ReactNode }) {
//   const { user, logout }    = useAuthStore();
//   const { theme, setTheme } = useTheme();
//   const router              = useRouter();
//   const pathname            = usePathname();

//   const [mounted,    setMounted]    = useState(false);
//   const [showSearch, setShowSearch] = useState(false);
//   const [notifCount, setNotifCount] = useState(0);
//   const [showNotif,  setShowNotif]  = useState(false);
//   const [notifs,     setNotifs]     = useState<{ msg: string; time: string }[]>([]);
//   const [faqCount,   setFaqCount]   = useState(0);

//   // ── Monter côté client uniquement ──────────────────────────
//   useEffect(() => { setMounted(true); }, []);

//   // ── Redirection si non admin ────────────────────────────────
//   // Utilise un ref pour éviter le setState-dans-effet
//   const redirectedRef = useRef(false);
//   useEffect(() => {
//     if (!mounted || redirectedRef.current) return;
//     if (!user) {
//       redirectedRef.current = true;
//       router.push('/login');
//       return;
//     }
//     if (user.role !== 'admin') {
//       redirectedRef.current = true;
//       router.push('/dashboard');
//     }
//   }, [mounted, user, router]);

//   // ── Fetch notifs + FAQ count ────────────────────────────────
//   const fetchData = useCallback(() => {
//     if (!user || user.role !== 'admin') return;
//     const headers = getAuthHeaders();

//     // Notifs nouvelles inscriptions
//     fetch(`${API}/api/admin/students`, { credentials: 'include', headers })
//       .then(r => r.json())
//       .then((d: { students?: { full_name?: string; created_at?: string }[] }) => {
//         const recent = (d.students || []).filter(s => {
//           if (!s.created_at) return false;
//           return (Date.now() - new Date(s.created_at).getTime()) < 24 * 60 * 60 * 1000;
//         });
//         setNotifCount(recent.length);
//         setNotifs(recent.map(s => ({
//           msg:  `${s.full_name || '?'} vient de s'inscrire`,
//           time: new Date(s.created_at || '').toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
//         })));
//       })
//       .catch(() => {});

//     // Compteur FAQ non traitées
//     fetch(`${API}/api/admin/faq/stats`, { credentials: 'include', headers })
//       .then(r => r.json())
//       .then((d: { non_traitees?: number }) => { setFaqCount(d.non_traitees || 0); })
//       .catch(() => {});
//   }, [user]);

//   useEffect(() => {
//     if (!mounted || !user || user.role !== 'admin') return;
//     fetchData();
//     const interval = setInterval(fetchData, 30000);
//     return () => clearInterval(interval);
//   }, [mounted, user, fetchData]);

//   // ── Raccourcis clavier ──────────────────────────────────────
//   useEffect(() => {
//     const handler = (e: KeyboardEvent) => {
//       if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setShowSearch(true); }
//       if (e.key === 'Escape') { setShowSearch(false); setShowNotif(false); }
//     };
//     window.addEventListener('keydown', handler);
//     return () => window.removeEventListener('keydown', handler);
//   }, []);

//   // ── Garde d'affichage ───────────────────────────────────────
//   if (!mounted || !user || user.role !== 'admin') {
//     return (
//       <div className="flex h-screen items-center justify-center bg-bg-primary">
//         <Loader2 size={24} className="animate-spin text-supmti-blue" />
//       </div>
//     );
//   }

//   return (
//     <>
//       {showSearch && <GlobalSearch onClose={() => setShowSearch(false)} />}

//       <div className="flex h-screen bg-bg-primary text-text-primary overflow-hidden transition-colors duration-300">

//         {/* ── Sidebar Admin ── */}
//         <aside className="w-64 flex flex-col border-r border-border-base bg-bg-sidebar shrink-0">

//           <div className="h-16 flex items-center gap-3 px-5 border-b border-border-base">
//             <div className="w-8 h-8 rounded-lg bg-supmti-blue flex items-center justify-center shrink-0 shadow-lg shadow-supmti-blue/20">
//               <Shield size={16} className="text-white" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-sm font-black text-text-primary leading-none">SUPMTI</p>
//               <p className="text-[10px] text-supmti-blue font-bold uppercase tracking-widest">Backoffice</p>
//             </div>
//           </div>

//           <div className="px-3 py-3 border-b border-border-base space-y-2">
//             <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-hover/50 border border-border-base/50">
//               <div className="w-7 h-7 rounded-lg bg-supmti-blue/20 flex items-center justify-center text-supmti-blue font-black text-xs shrink-0">
//                 {user.full_name?.charAt(0) || 'A'}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-xs font-black text-text-primary truncate">{user.full_name}</p>
//                 <p className="text-[9px] text-supmti-blue font-bold uppercase tracking-widest">Administrateur</p>
//               </div>
//             </div>
//             <button
//               onClick={() => setShowSearch(true)}
//               className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-input border border-border-base text-text-secondary hover:text-text-primary text-xs transition-all"
//             >
//               <Search size={13} />
//               <span className="flex-1 text-left">Rechercher…</span>
//               <kbd className="text-[9px] bg-bg-hover px-1.5 py-0.5 rounded font-mono border border-border-base">⌘K</kbd>
//             </button>
//           </div>

//           <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
//             {NAV.map(({ href, label, icon: Icon, color }) => {
//               const active = pathname === href || pathname.startsWith(href + '/');
//               const isFaq  = href === '/admin/faq';
//               return (
//                 <Link
//                   key={href} href={href}
//                   className={cn(
//                     'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold',
//                     active
//                       ? 'bg-supmti-blue text-white shadow-lg shadow-supmti-blue/20'
//                       : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
//                   )}
//                 >
//                   <Icon size={15} className={active ? 'text-white' : color} />
//                   <span className="flex-1">{label}</span>
//                   {/* Badge FAQ non traitées */}
//                   {isFaq && faqCount > 0 && (
//                     <span className={cn(
//                       'text-[9px] font-black px-1.5 py-0.5 rounded-full',
//                       active ? 'bg-white/20 text-white' : 'bg-red-500 text-white'
//                     )}>
//                       {faqCount > 99 ? '99+' : faqCount}
//                     </span>
//                   )}
//                   {active && <ChevronRight size={13} />}
//                 </Link>
//               );
//             })}
//           </nav>

//           <div className="p-3 border-t border-border-base space-y-1">
//             <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-all text-sm font-semibold">
//               <GraduationCap size={15} /> Voir le site
//             </Link>
//             <button
//               onClick={() => { logout(); router.push('/login'); }}
//               className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-sm font-semibold"
//             >
//               <LogOut size={15} /> Déconnexion
//             </button>
//           </div>
//         </aside>

//         {/* ── Contenu principal ── */}
//         <div className="flex-1 flex flex-col overflow-hidden">

//           <header className="h-14 flex items-center justify-between px-6 border-b border-border-base bg-bg-sidebar shrink-0">
//             <div className="flex items-center gap-2 text-sm text-text-secondary font-medium uppercase tracking-wider">
//               <span className="text-supmti-blue font-black">/</span>
//               {NAV.find(n => n.href === pathname)?.label || 'Admin'}
//             </div>

//             <div className="flex items-center gap-3">
//               {/* Dark mode toggle */}
//               <button
//                 onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
//                 className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-input border border-border-base text-text-secondary hover:text-text-primary transition-all"
//               >
//                 {mounted && (theme === 'dark' ? (
//                   <><Sun size={15} className="text-accent-orange" /><span className="text-xs font-bold hidden md:block">Clair</span></>
//                 ) : (
//                   <><Moon size={15} className="text-accent-blue" /><span className="text-xs font-bold hidden md:block">Sombre</span></>
//                 ))}
//               </button>

//               {/* Notifications */}
//               <div className="relative">
//                 <button
//                   onClick={() => setShowNotif(!showNotif)}
//                   className="relative p-2 rounded-xl hover:bg-bg-hover text-text-secondary hover:text-text-primary transition-all"
//                 >
//                   <Bell size={18} />
//                   {notifCount > 0 && (
//                     <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-black text-white flex items-center justify-center animate-pulse">
//                       {notifCount > 9 ? '9+' : notifCount}
//                     </span>
//                   )}
//                 </button>

//                 {showNotif && (
//                   <div className="absolute right-0 top-12 w-72 bg-bg-card border border-border-base rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
//                     <div className="flex items-center justify-between px-4 py-3 border-b border-border-base bg-bg-sidebar/50">
//                       <p className="text-xs font-black text-text-primary uppercase tracking-widest">Notifications</p>
//                       <button
//                         onClick={() => { setShowNotif(false); setNotifCount(0); }}
//                         className="text-text-muted hover:text-text-primary"
//                       >
//                         <X size={14} />
//                       </button>
//                     </div>
//                     <div className="max-h-64 overflow-y-auto">
//                       {notifs.length === 0 ? (
//                         <p className="text-center text-text-muted text-xs py-8">Aucune notification</p>
//                       ) : notifs.map((n, i) => (
//                         <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-bg-hover transition-all border-b border-border-base/50">
//                           <div className="w-8 h-8 rounded-full bg-supmti-blue/10 flex items-center justify-center text-supmti-blue text-xs font-black shrink-0 border border-supmti-blue/20">
//                             {n.msg.charAt(0)}
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <p className="text-xs text-text-primary font-bold truncate">{n.msg}</p>
//                             <p className="text-[10px] text-text-muted">{n.time}</p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </header>

//           <main className="flex-1 overflow-y-auto bg-bg-primary p-6">
//             <div className="max-w-7xl mx-auto">
//               {children}
//             </div>
//           </main>
//         </div>
//       </div>
//     </>
//   );
// }





// src/app/admin/layout.tsx
'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import {
  LayoutDashboard, Users, Database, MessageSquare,
  BarChart3, Shield, LogOut, GraduationCap,
  UserCheck, ChevronRight, Loader2, BrainCircuit,
  BarChart2, FileText, Search, Bell, Sun, Moon, X,
  AlertTriangle, Sparkles, TrendingUp, Zap, Award,
  Menu, ChevronLeft, Activity, Clock, Settings, HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const NAV = [
  { href:'/admin/dashboard',     label:'Tableau de bord',      icon:LayoutDashboard, color:'from-sky-500 to-cyan-500', desc:'Vue d\'ensemble' },
  { href:'/admin/users',         label:'Étudiants',            icon:Users,           color:'from-blue-500 to-indigo-500', desc:'Gestion des profils' },
  { href:'/admin/ambassadors',   label:'Ambassadeurs',         icon:UserCheck,       color:'from-purple-500 to-pink-500', desc:'Équipe SUPMTI' },
  { href:'/admin/fitscore',      label:'FitScore',             icon:BarChart2,       color:'from-orange-500 to-red-500', desc:'Compatibilités' },
  { href:'/admin/peermatch',     label:'PeerMatch',            icon:Users,           color:'from-cyan-500 to-teal-500', desc:'Matching étudiant' },
  { href:'/admin/knowledge',     label:'Base RAG',             icon:Database,        color:'from-emerald-500 to-green-500', desc:'Documentation' },
  { href:'/admin/faq',           label:'FAQ manquante',        icon:AlertTriangle,   color:'from-red-500 to-rose-500', desc:'Questions sans réponse' },
  { href:'/admin/anonymous',     label:'Visiteurs',            icon:Users,           color:'from-amber-500 to-orange-500', desc:'Conversations anonymes' },
  { href:'/admin/conversations', label:'Conversations',        icon:MessageSquare,   color:'from-green-500 to-emerald-500', desc:'Historique chats' },
  { href:'/admin/analytics',     label:'Analytics',            icon:BarChart3,       color:'from-yellow-500 to-amber-500', desc:'Statistiques' },
  { href:'/admin/reports',       label:'Rapports',             icon:FileText,        color:'from-pink-500 to-rose-500', desc:'Exports PDF/CSV' },
  { href:'/admin/ai-config',     label:'Configuration IA',     icon:BrainCircuit,    color:'from-violet-500 to-purple-500', desc:'Paramètres IA' },
];

// Helper headers
function getAuthHeaders(): Record<string, string> {
  try {
    const uid = JSON.parse(localStorage.getItem('supmti-auth') || '{}')?.state?.user?.id || '';
    if (uid) return { 'X-User-Id': uid };
  } catch {}
  return {};
}

// Composant Global Search amélioré
function GlobalSearch({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<{ type: string; label: string; sub: string; href: string; icon?: any }[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    if (!q.trim() || q.length < 2) { setResults([]); return; }
    setLoading(true);
    Promise.all([
      fetch(`${API}/api/admin/students`, { credentials: 'include', headers: getAuthHeaders() }).then(r => r.json()).catch(() => ({ students: [] })),
      fetch(`${API}/api/admin/ambassadeurs`, { credentials: 'include', headers: getAuthHeaders() }).then(r => r.json()).catch(() => ({ ambassadeurs: [] }))
    ]).then(([studentsData, ambData]) => {
      const students = (studentsData.students || [])
        .filter((s: any) =>
          s.full_name?.toLowerCase().includes(q.toLowerCase()) ||
          s.email?.toLowerCase().includes(q.toLowerCase())
        )
        .slice(0, 4)
        .map((s: any) => ({ type: 'student', label: s.full_name || '', sub: s.email || '', href: '/admin/users', icon: GraduationCap }));
      
      const ambassadors = (ambData.ambassadeurs || [])
        .filter((a: any) =>
          a.nom?.toLowerCase().includes(q.toLowerCase()) ||
          a.email?.toLowerCase().includes(q.toLowerCase())
        )
        .slice(0, 2)
        .map((a: any) => ({ type: 'ambassador', label: a.nom || '', sub: `${a.program_id} · ${a.niveau}`, href: '/admin/ambassadors', icon: UserCheck }));
      
      setResults([...students, ...ambassadors]);
    })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [q]);

  const navResults = NAV
    .filter(n => n.label.toLowerCase().includes(q.toLowerCase()))
    .map(n => ({ type: 'page', label: n.label, sub: n.desc, href: n.href, icon: n.icon }));

  const all = [...navResults, ...results];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-20 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-2xl mx-4 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-200 dark:border-slate-700">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            ref={inputRef}
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Rechercher étudiants, ambassadeurs, pages..."
            className="w-full pl-11 pr-12 py-4 bg-transparent text-slate-900 dark:text-white text-base outline-none placeholder:text-slate-400"
          />
          {loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Loader2 size={18} className="animate-spin text-[#006666]" />
            </div>
          )}
        </div>
        
        <div className="max-h-96 overflow-y-auto border-t border-slate-100 dark:border-slate-800">
          {q.length < 2 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#006666] to-[#008888] flex items-center justify-center">
                <Search size={28} className="text-white" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Recherche globale</p>
              <p className="text-xs text-slate-400 mt-1">Tape au moins 2 caractères pour chercher</p>
              <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-slate-400">
                <span>⌘K pour ouvrir</span>
                <span>ESC pour fermer</span>
              </div>
            </div>
          ) : all.length === 0 ? (
            <div className="p-12 text-center">
              <AlertTriangle size={32} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
              <p className="text-slate-500 dark:text-slate-400">Aucun résultat pour &quot;{q}&quot;</p>
            </div>
          ) : (
            <div className="py-2">
              {all.map((r, i) => {
                const Icon = r.icon;
                return (
                  <button
                    key={i}
                    onClick={() => { router.push(r.href); onClose(); }}
                    className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gradient-to-r hover:from-slate-50 hover:to-transparent dark:hover:from-slate-800/50 transition-all duration-200 text-left group"
                  >
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110',
                      r.type === 'page' 
                        ? 'bg-gradient-to-br from-[#006666]/10 to-[#008888]/10 text-[#006666]'
                        : r.type === 'student'
                          ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-600'
                          : 'bg-purple-100 dark:bg-purple-500/10 text-purple-600'
                    )}>
                      {Icon ? <Icon size={18} /> : <span className="font-bold text-sm">{r.label.charAt(0)}</span>}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{r.label}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{r.sub}</p>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 flex justify-between text-[10px] text-slate-400">
          <span>🔍 Navigation rapide</span>
          <div className="flex gap-3">
            <span><kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600">↓</kbd> naviguer</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600">↵</kbd> sélectionner</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant Notification amélioré
function NotificationPanel({ onClose }: { onClose: () => void }) {
  const [notifs, setNotifs] = useState<{ id: string; title: string; message: string; time: string; type: 'info' | 'success' | 'warning' }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/admin/students`, { credentials: 'include', headers: getAuthHeaders() })
      .then(r => r.json())
      .then((d: { students?: any[] }) => {
        const recent = (d.students || [])
          .filter((s: any) => s.created_at && (Date.now() - new Date(s.created_at).getTime()) < 7 * 24 * 60 * 60 * 1000)
          .slice(0, 5)
          .map((s: any, i: number) => ({
            id: `student-${i}`,
            title: 'Nouvel étudiant inscrit',
            message: `${s.full_name || 'Un étudiant'} a rejoint SUPMTI`,
            time: new Date(s.created_at).toLocaleDateString('fr-FR'),
            type: 'info' as const
          }));
        setNotifs(recent);
      })
      .catch(() => setNotifs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in slide-in-from-top-2 duration-200">
      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={14} className="text-[#006666]" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h3>
          </div>
          {notifs.length > 0 && (
            <span className="text-[10px] font-bold text-[#006666] bg-[#006666]/10 px-2 py-0.5 rounded-full">
              {notifs.length} nouvelle{notifs.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <Loader2 size={20} className="animate-spin mx-auto text-slate-400" />
          </div>
        ) : notifs.length === 0 ? (
          <div className="p-8 text-center">
            <Bell size={24} className="mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            <p className="text-xs text-slate-500">Aucune notification</p>
          </div>
        ) : (
          notifs.map((n) => (
            <div key={n.id} className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all border-b border-slate-100 dark:border-slate-800/50 last:border-0">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#006666]/10 flex items-center justify-center flex-shrink-0">
                  {n.type === 'info' && <Zap size={12} className="text-[#006666]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{n.title}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{n.message}</p>
                  <p className="text-[9px] text-slate-400 mt-1">{n.time}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <button 
        onClick={onClose}
        className="w-full px-4 py-2 text-center text-[11px] font-medium text-slate-500 hover:text-[#006666] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all border-t border-slate-100 dark:border-slate-800"
      >
        Fermer
      </button>
    </div>
  );
}

// Composant Selector Theme amélioré
function ThemeSelector({ theme, setTheme, mounted }: { theme: string | undefined; setTheme: (t: string) => void; mounted: boolean }) {
  if (!mounted) return null;
  
  return (
    <div className="relative group">
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
      >
        {theme === 'dark' ? (
          <>
            <Sun size={16} className="text-amber-500" />
            <span className="text-xs font-medium hidden md:inline">Mode Clair</span>
          </>
        ) : (
          <>
            <Moon size={16} className="text-indigo-500" />
            <span className="text-xs font-medium hidden md:inline">Mode Sombre</span>
          </>
        )}
      </button>
    </div>
  );
}

// Layout principal
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [faqCount, setFaqCount] = useState(0);
  const [ambCount, setAmbCount] = useState(0);
  const redirectedRef = useRef(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || redirectedRef.current) return;
    if (!user) {
      redirectedRef.current = true;
      router.push('/login');
      return;
    }
    if (user.role !== 'admin') {
      redirectedRef.current = true;
      router.push('/dashboard');
    }
  }, [mounted, user, router]);

  const fetchData = useCallback(() => {
    if (!user || user.role !== 'admin') return;
    const headers = getAuthHeaders();

    fetch(`${API}/api/admin/faq/stats`, { credentials: 'include', headers })
      .then(r => r.json())
      .then((d: { non_traitees?: number }) => setFaqCount(d.non_traitees || 0))
      .catch(() => {});

    fetch(`${API}/api/admin/ambassadeurs`, { credentials: 'include', headers })
      .then(r => r.json())
      .then((d: { ambassadeurs?: any[] }) => setAmbCount((d.ambassadeurs || []).filter(a => a.is_active).length))
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!mounted || !user || user.role !== 'admin') return;
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [mounted, user, fetchData]);

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
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-[#006666]/20 border-t-[#006666] animate-spin" />
            <Shield size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#006666]" />
          </div>
          <p className="mt-4 text-sm text-slate-500">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showSearch && <GlobalSearch onClose={() => setShowSearch(false)} />}

      <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 overflow-hidden">
        
        {/* Sidebar */}
        <aside className={cn(
          "flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 relative",
          collapsed ? "w-20" : "w-64"
        )}>
          
          {/* Logo */}
          <div className={cn(
            "h-16 flex items-center border-b border-slate-100 dark:border-slate-800 transition-all",
            collapsed ? "justify-center px-3" : "gap-3 px-5"
          )}>
            <div className="relative group">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#006666] to-[#008888] blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-[#006666] to-[#008888] flex items-center justify-center shadow-lg">
                <Shield size={18} className="text-white" />
              </div>
            </div>
            {!collapsed && (
              <div>
                <p className="text-sm font-black text-slate-900 dark:text-white leading-tight">SUPMTI</p>
                <p className="text-[9px] text-[#006666] font-bold uppercase tracking-widest">Backoffice</p>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className={cn(
            "p-3 border-b border-slate-100 dark:border-slate-800",
            collapsed && "px-2"
          )}>
            <div className={cn(
              "flex items-center rounded-xl bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-800 border border-slate-100 dark:border-slate-700 p-2",
              collapsed ? "justify-center" : "gap-3"
            )}>
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#006666] to-[#008888] flex items-center justify-center text-white font-bold text-sm">
                  {user.full_name?.charAt(0) || 'A'}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800" />
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.full_name}</p>
                  <p className="text-[9px] text-[#006666] font-bold uppercase">Administrateur</p>
                </div>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-3">
            <button
              onClick={() => setShowSearch(true)}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all group",
                collapsed && "justify-center"
              )}
            >
              <Search size={16} className="group-hover:scale-110 transition-transform" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left text-xs">Rechercher...</span>
                  <kbd className="text-[9px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600">⌘K</kbd>
                </>
              )}
            </button>
          </div>

          {/* Navigation */}

{/* Navigation */}
<nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
  {NAV.map(({ href, label, icon: Icon, color, desc }) => {
    const active = pathname === href || pathname.startsWith(href + '/');
    const isFaq = href === '/admin/faq';
    const showBadge = isFaq && faqCount > 0;
    
    return (
      <Link
        key={href}
        href={href}
        className={cn(
          "flex items-center rounded-xl transition-all duration-200 group relative",
          collapsed ? "justify-center py-3" : "gap-3 px-3 py-2.5",
          active
            ? "bg-gradient-to-r from-[#006666] to-[#008888] text-white shadow-lg shadow-[#006666]/20"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
        )}
      >
        <div className={cn(
          "transition-all duration-200",
          active ? "scale-110" : "group-hover:scale-110"
        )}>
          <Icon size={18} className={active ? "text-white" : ""} />
        </div>
        
        {!collapsed && (
          <>
            <span className="flex-1 text-sm font-medium">{label}</span>
            {showBadge && (
              <span className={cn(
                "text-[9px] font-bold px-1.5 py-0.5 rounded-full transition-all",
                active 
                  ? "bg-white/20 text-white" 
                  : "bg-red-500 text-white shadow-sm shadow-red-500/30"
              )}>
                {faqCount > 99 ? '99+' : faqCount}
              </span>
            )}
            {active && <ChevronRight size={14} className="opacity-70" />}
          </>
        )}
        
        {/* Tooltip pour collapsed */}
        {collapsed && showBadge && (
          <div className="absolute left-full ml-2 px-2 py-1 rounded bg-red-500 text-white text-xs font-medium whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            {label} ({faqCount})
          </div>
        )}
        
        {/* Tooltip sans badge */}
        {collapsed && !showBadge && (
          <div className="absolute left-full ml-2 px-2 py-1 rounded bg-slate-800 dark:bg-slate-700 text-white text-xs font-medium whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            {label}
          </div>
        )}
      </Link>
    );
  })}
</nav>

          {/* Footer Actions */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <Link href="/" className={cn(
              "flex items-center rounded-xl transition-all text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800",
              collapsed ? "justify-center py-3" : "gap-3 px-3 py-2.5"
            )}>
              <GraduationCap size={18} />
              {!collapsed && <span className="text-sm font-medium">Voir le site</span>}
            </Link>
            
            <button
              onClick={() => { logout(); router.push('/login'); }}
              className={cn(
                "w-full flex items-center rounded-xl transition-all text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10",
                collapsed ? "justify-center py-3" : "gap-3 px-3 py-2.5"
              )}
            >
              <LogOut size={18} />
              {!collapsed && <span className="text-sm font-medium">Déconnexion</span>}
            </button>

            {/* Collapse Toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={cn(
                "w-full flex items-center justify-center rounded-xl transition-all text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 py-2"
              )}
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Header */}
          <header className="h-14 flex items-center justify-between px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                <span className="text-[#006666] font-bold">/</span>
                {NAV.find(n => n.href === pathname)?.label || 'Admin'}
              </div>
              <div className="hidden md:flex items-center gap-1 text-[10px] text-slate-400">
                <Activity size={10} />
                <span>Live</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ThemeSelector theme={theme} setTheme={setTheme} mounted={mounted} />
              
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotif(!showNotif)}
                  className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all"
                >
                  <Bell size={18} />
                  {faqCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
                      {faqCount > 9 ? '9+' : faqCount}
                    </span>
                  )}
                </button>
                {showNotif && (
                  <div className="absolute right-0 top-12 z-50">
                    <NotificationPanel onClose={() => setShowNotif(false)} />
                  </div>
                )}
              </div>

              {/* Stats rapides */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-[10px] font-medium">
                <TrendingUp size={12} className="text-emerald-500" />
                <span className="text-slate-600 dark:text-slate-400">FitScore moyen</span>
                <span className="font-bold text-slate-900 dark:text-white">81.2%</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}