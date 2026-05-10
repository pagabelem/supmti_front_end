// // src/components/layout/Sidebar.tsx
// 'use client';
// import { useState, useEffect, useCallback } from 'react';
// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';
// import RapportButton from '@/components/chatbot/RapportButton';

// import {
//   LayoutDashboard, MessageSquare, UserCircle, Settings,
//   ChevronLeft, ChevronRight, GraduationCap, History,
//   BarChart3, DoorOpen, Rocket, Scale, Brain, Medal, UserCheck,
//   Plus, LucideIcon, Sparkles, LogOut
// } from 'lucide-react';
// import { cn }              from '@/lib/utils';
// import { useAuthStore }    from '@/store/authStore';
// import { useSessionStore } from '@/store/sessionStore';
// import { usePanelStore, PanelType } from '@/store/panelStore';
// import chatbotService      from '@/services/chatbotService';

// interface NavItem     { name: string; href: string; icon: LucideIcon; }
// interface FeatureItem { id: PanelType; label: string; icon: LucideIcon; color: string; bg: string; badge?: string; }

// const studentItems: NavItem[] = [
//   { name: 'Dashboard',  href: '/dashboard', icon: LayoutDashboard },
//   { name: 'Chatbot IA', href: '/chatbot',   icon: MessageSquare   },
//   { name: 'Mon Profil', href: '/profile',   icon: UserCircle      },
//   { name: 'Historique', href: '/history',   icon: History         },
//   { name: 'Paramètres', href: '/settings',  icon: Settings        },
// ];

// const featureItems: FeatureItem[] = [
//   { id: 'profil',    label: 'Mon Profil',         icon: UserCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10'  },
//   { id: 'fitscore',  label: 'FitScore',            icon: BarChart3,  color: 'text-orange-500',  bg: 'bg-orange-500/10',  badge: 'IA'  },
//   { id: 'admission', label: 'Admission',           icon: DoorOpen,   color: 'text-blue-500',    bg: 'bg-blue-500/10'    },
//   { id: 'carriere',  label: 'Simulation Carrière', icon: Rocket,     color: 'text-purple-500',  bg: 'bg-purple-500/10', badge: 'GPT' },
//   { id: 'comparer',  label: 'Comparer Filières',   icon: Scale,      color: 'text-cyan-500',    bg: 'bg-cyan-500/10'   },
//   { id: 'psycho',    label: 'Test Psychométrique', icon: Brain,      color: 'text-pink-500',    bg: 'bg-pink-500/10'   },
//   { id: 'coach',     label: 'Coach Académique',    icon: Medal,      color: 'text-yellow-500',  bg: 'bg-yellow-500/10' },
//   { id: 'peermatch', label: 'Peer Match',          icon: UserCheck,  color: 'text-emerald-500', bg: 'bg-emerald-500/10'  },
// ];

// export const Sidebar = () => {
//   const [collapsed, setCollapsed] = useState(false);
//   const pathname  = usePathname();
//   const router    = useRouter();
//   const { user, logout }  = useAuthStore();

//   const { profil, historique_chats, setProfil, setFitscore, setHistorique } = useSessionStore();
//   const { activePanel, openPanel, peerBadge } = usePanelStore();
//   const isChatbot = pathname === '/chatbot';

//   const chargerSession = useCallback(async () => {
//     try {
//       const data = await chatbotService.getSession();
//       if (data.profil)           setProfil(data.profil as Parameters<typeof setProfil>[0]);
//       if (data.fitscore)         setFitscore(data.fitscore as Parameters<typeof setFitscore>[0]);
//       if (data.historique_chats) setHistorique(data.historique_chats);
//     } catch {/* silencieux */}
//   }, [setProfil, setFitscore, setHistorique]);

//   useEffect(() => { chargerSession(); }, [chargerSession]);

//   useEffect(() => {
//     const onUpdate = () => chargerSession();
//     window.addEventListener('sami:profile-updated', onUpdate);
//     window.addEventListener('sami:new-chat', onUpdate);
//     return () => {
//       window.removeEventListener('sami:profile-updated', onUpdate);
//       window.removeEventListener('sami:new-chat', onUpdate);
//     };
//   }, [chargerSession]);

//   const handleNewChat = async () => {
//     try { await chatbotService.newChat(); } catch {}
//     window.dispatchEvent(new CustomEvent('sami:new-chat'));
//   };

//   const handleLogout = () => {
//     logout();
//     router.push('/login');
//   };

//   // Infos à afficher dans le footer
//   const prenom  = profil?.informations_personnelles?.prenom || user?.full_name?.split(' ')[0] || 'Utilisateur';
//   const nomComplet = user?.full_name || prenom;
//   const bac     = profil?.parcours_academique?.type_bac;
//   const moyenne = profil?.parcours_academique?.moyenne_generale;
//   const initial = nomComplet.charAt(0).toUpperCase();

//   return (
//     <aside className={cn(
//       "h-screen flex flex-col sticky top-0 z-[60] transition-all duration-500 ease-in-out border-r",
//       "bg-white/90 dark:bg-slate-950/95 backdrop-blur-xl border-slate-200/60 dark:border-slate-800/60",
//       collapsed ? "w-20" : "w-72"
//     )}>

//       {/* Toggle */}
//       <button onClick={() => setCollapsed(!collapsed)}
//         className="absolute -right-3 top-16 h-6 w-6 rounded-full bg-[#006666] text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-50 border-2 border-white dark:border-slate-900">
//         {collapsed ? <ChevronRight size={12} strokeWidth={3} /> : <ChevronLeft size={12} strokeWidth={3} />}
//       </button>

//       {/* Logo */}
//       <div className={cn("h-20 flex items-center px-6 gap-3 flex-shrink-0", collapsed && "justify-center")}>
//         <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#006666] to-[#004d4d] flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
//           <GraduationCap className="text-white" size={24} />
//         </div>
//         {!collapsed && (
//           <div className="flex flex-col animate-in fade-in slide-in-from-left-4 duration-500">
//             <span className="font-black text-xl tracking-tighter text-slate-900 dark:text-white leading-none">SUPMTI</span>
//             <span className="text-[10px] font-bold text-[#006666] tracking-[0.25em] uppercase">AI Laboratory</span>
//           </div>
//         )}
//       </div>

//       <div className="flex-1 overflow-hidden flex flex-col px-3">

//         {/* Nouveau Chat */}
//         {isChatbot && (
//           <div className="mb-4 pt-2">
//             <button onClick={handleNewChat}
//               className={cn(
//                 "group relative w-full flex items-center gap-3 rounded-2xl p-3.5 transition-all duration-300",
//                 "bg-slate-900 dark:bg-[#006666]/10 border border-slate-800 dark:border-[#006666]/30",
//                 "hover:shadow-lg hover:shadow-[#006666]/10 hover:border-[#006666]",
//                 collapsed ? "justify-center" : "px-5"
//               )}>
//               <Plus size={18} className="text-[#006666] group-hover:rotate-90 transition-transform duration-300" />
//               {!collapsed && <span className="text-sm font-bold text-white">Nouvelle Session</span>}
//             </button>
//           </div>
//         )}

//         <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">

//           {/* Fonctionnalités IA */}
//           {isChatbot && (
//             <div className="mb-6">
//               {!collapsed && (
//                 <p className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2 mb-4">
//                   <Sparkles size={10} /> Capacités IA
//                 </p>
//               )}
//               <div className="space-y-1">
//                 {featureItems.map(({ id, label, icon: Icon, color, bg, badge }) => {
//                   const isActive      = activePanel === id;
//                   const showPeerBadge = id === 'peermatch' && peerBadge;
//                   return (
//                     <button key={id} onClick={() => openPanel(id)}
//                       className={cn(
//                         "w-full flex items-center gap-3 p-2 rounded-xl transition-all border-2",
//                         isActive
//                           ? "bg-white dark:bg-slate-900 border-[#006666]/40 shadow-sm"
//                           : "border-transparent hover:bg-slate-100/50 dark:hover:bg-slate-900/50",
//                         collapsed && "justify-center"
//                       )}>
//                       <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", bg)}>
//                         <Icon size={16} className={color} />
//                       </div>
//                       {!collapsed && (
//                         <div className="flex-1 flex items-center justify-between overflow-hidden">
//                           <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">{label}</span>
//                           {badge && <span className="text-[8px] bg-[#CC0000] text-white px-1.5 py-0.5 rounded-md font-bold">{badge}</span>}
//                           {showPeerBadge && <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />}
//                         </div>
//                       )}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           )}

//           {/* Navigation */}
//           <div className="mb-6">
//             {!collapsed && (
//               <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2 mb-4">
//                 Navigation
//               </p>
//             )}
//             <nav className="space-y-1">
//               {studentItems.map((item) => {
//                 const active = pathname === item.href;
//                 const Icon   = item.icon;
//                 return (
//                   <Link key={item.href} href={item.href}
//                     className={cn(
//                       "flex items-center gap-3 p-3 rounded-xl transition-all group",
//                       active
//                         ? "bg-[#006666] text-white shadow-lg shadow-emerald-900/20"
//                         : "text-slate-500 hover:text-[#006666] dark:hover:text-white",
//                       collapsed && "justify-center"
//                     )}>
//                     <Icon size={20} className={cn(active ? "text-white" : "group-hover:scale-110 transition-transform")} />
//                     {!collapsed && <span className="text-sm font-bold">{item.name}</span>}
//                   </Link>
//                 );
//               })}
//             </nav>
//           </div>

//           {/* Historique */}
//           {isChatbot && !collapsed && (
//             <div className="mb-6 animate-in slide-in-from-bottom-4 duration-700">
//               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 mb-4">
//                 Chronologie
//               </p>
//               <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
//                 {historique_chats.length === 0 ? (
//                   <p className="text-[10px] text-slate-400 italic text-center p-4">Aucun échange</p>
//                 ) : (
//                   [...historique_chats].reverse().map((c) => (
//                     <div key={c.id}
//                       onClick={() => window.dispatchEvent(new CustomEvent('sami:load-chat', { detail: c.id }))}
//                       className={cn(
//                         "group p-3 rounded-2xl border border-transparent hover:border-[#006666]/30 transition-all cursor-pointer",
//                         c.en_cours ? "bg-[#006666]/10 border-[#006666]/20" : "bg-slate-50/50 dark:bg-slate-900/40"
//                       )}>
//                       <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">{c.titre}</p>
//                       <p className="text-[9px] text-slate-400 mt-1 uppercase font-medium">
//                         {c.date} · {c.nb_messages} msg
//                         {c.en_cours && <span className="ml-1 text-[#006666]">● en cours</span>}
//                       </p>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="px-3 mb-3">
//         <RapportButton />
//       </div>

//       {/* ── Footer utilisateur connecté ── */}
//       <div className="p-3 flex-shrink-0 border-t border-slate-100 dark:border-slate-800/60">
//         {collapsed ? (
//           /* Mode réduit — juste l'avatar + logout */
//           <div className="flex flex-col items-center gap-2">
//             <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#006666] to-[#CC0000] p-[2px]">
//               <div className="h-full w-full rounded-[9px] bg-white dark:bg-slate-900 flex items-center justify-center font-bold text-[#006666] text-sm">
//                 {initial}
//               </div>
//             </div>
//             <button onClick={handleLogout} title="Se déconnecter"
//               className="p-2 rounded-xl text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all">
//               <LogOut size={15} />
//             </button>
//           </div>
//         ) : (
//           /* Mode étendu — nom complet + rôle + déconnexion */
//           <div className="flex items-center gap-3 px-2 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
//             {/* Avatar */}
//             <div className="relative shrink-0">
//               <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#006666] to-[#CC0000] p-[2px]">
//                 <div className="h-full w-full rounded-[9px] bg-white dark:bg-slate-900 flex items-center justify-center font-bold text-[#006666] text-sm">
//                   {initial}
//                 </div>
//               </div>
//               <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-500" />
//             </div>

//             {/* Infos */}
//             <div className="flex-1 min-w-0">
//               <p className="text-[13px] font-black text-slate-900 dark:text-white truncate uppercase tracking-tight">
//                 {nomComplet}
//               </p>
//               <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase flex items-center gap-1 mt-0.5">
//                 {bac && bac !== 'AUTRE' ? `BAC ${bac}` : user?.role || 'Étudiant'}
//                 {moyenne && moyenne > 0 && (
//                   <>
//                     <span className="h-1 w-1 rounded-full bg-slate-300" />
//                     {moyenne}/20
//                   </>
//                 )}
//               </p>
//             </div>

//             {/* Bouton déconnexion */}
//             <button onClick={handleLogout} title="Se déconnecter"
//               className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all shrink-0"
//             >
//               <LogOut size={16} />
//             </button>
//           </div>
//         )}
//       </div>
//     </aside>
//   );
// };
































// 'use client';
// import { useState, useEffect, useCallback } from 'react';
// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';
// import RapportButton from '@/components/chatbot/RapportButton';

// import {
//   LayoutDashboard, MessageSquare, UserCircle, Settings,
//   ChevronLeft, ChevronRight, GraduationCap, History,
//   BarChart3, DoorOpen, Rocket, Scale, Brain, Medal, UserCheck,
//   Plus, LucideIcon, Sparkles, LogOut
// } from 'lucide-react';
// import { cn }              from '@/lib/utils';
// import { useAuthStore }    from '@/store/authStore';
// import { useSessionStore } from '@/store/sessionStore';
// import { usePanelStore, PanelType } from '@/store/panelStore';
// import { useLang }         from '@/i18n/LanguageContext';
// import chatbotService      from '@/services/chatbotService';

// interface NavItem     { nameKey: string; href: string; icon: LucideIcon; }
// interface FeatureItem { id: PanelType; labelKey: string; icon: LucideIcon; color: string; bg: string; badge?: string; }

// const studentItems: NavItem[] = [
//   { nameKey: 'dashboard',  href: '/dashboard', icon: LayoutDashboard },
//   { nameKey: 'chat',       href: '/chatbot',   icon: MessageSquare   },
//   { nameKey: 'profil',     href: '/profile',   icon: UserCircle      },
//   { nameKey: 'history',    href: '/history',   icon: History         },
//   { nameKey: 'settings',   href: '/settings',  icon: Settings        },
// ];

// const featureItems: FeatureItem[] = [
//   { id: 'profil',    labelKey: 'profil',    icon: UserCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10'  },
//   { id: 'fitscore',  labelKey: 'fitscore',  icon: BarChart3,  color: 'text-orange-500',  bg: 'bg-orange-500/10',  badge: 'IA'  },
//   { id: 'admission', labelKey: 'admission', icon: DoorOpen,   color: 'text-blue-500',    bg: 'bg-blue-500/10'    },
//   { id: 'carriere',  labelKey: 'carriere',  icon: Rocket,     color: 'text-purple-500',  bg: 'bg-purple-500/10', badge: 'GPT' },
//   { id: 'comparer',  labelKey: 'comparer',  icon: Scale,      color: 'text-cyan-500',    bg: 'bg-cyan-500/10'   },
//   { id: 'psycho',    labelKey: 'psycho',    icon: Brain,      color: 'text-pink-500',    bg: 'bg-pink-500/10'   },
//   { id: 'coach',     labelKey: 'coach',     icon: Medal,      color: 'text-yellow-500',  bg: 'bg-yellow-500/10' },
//   { id: 'peermatch', labelKey: 'peermatch', icon: UserCheck,  color: 'text-emerald-500', bg: 'bg-emerald-500/10'  },
// ];

// export const Sidebar = () => {
//   const [collapsed, setCollapsed] = useState(false);
//   const pathname  = usePathname();
//   const router    = useRouter();
//   const { user, logout }  = useAuthStore();
//   const { t, isRTL } = useLang();

//   const { profil, historique_chats, setProfil, setFitscore, setHistorique } = useSessionStore();
//   const { activePanel, openPanel, peerBadge } = usePanelStore();
//   const isChatbot = pathname === '/chatbot';

//   const chargerSession = useCallback(async () => {
//     try {
//       const data = await chatbotService.getSession();
//       if (data.profil)           setProfil(data.profil as Parameters<typeof setProfil>[0]);
//       if (data.fitscore)         setFitscore(data.fitscore as Parameters<typeof setFitscore>[0]);
//       if (data.historique_chats) setHistorique(data.historique_chats);
//     } catch {/* silencieux */}
//   }, [setProfil, setFitscore, setHistorique]);

//   useEffect(() => { chargerSession(); }, [chargerSession]);

//   useEffect(() => {
//     const onUpdate = () => chargerSession();
//     window.addEventListener('sami:profile-updated', onUpdate);
//     window.addEventListener('sami:new-chat', onUpdate);
//     return () => {
//       window.removeEventListener('sami:profile-updated', onUpdate);
//       window.removeEventListener('sami:new-chat', onUpdate);
//     };
//   }, [chargerSession]);

//   const handleNewChat = async () => {
//     try { await chatbotService.newChat(); } catch {}
//     window.dispatchEvent(new CustomEvent('sami:new-chat'));
//   };

//   const handleLogout = () => {
//     logout();
//     router.push('/login');
//   };

//   const prenom     = profil?.informations_personnelles?.prenom || user?.full_name?.split(' ')[0] || t('common','loading');
//   const nomComplet = user?.full_name || prenom;
//   const bac        = profil?.parcours_academique?.type_bac;
//   const moyenne    = profil?.parcours_academique?.moyenne_generale;
//   const initial    = nomComplet.charAt(0).toUpperCase();

//   return (
//     <aside className={cn(
//       "h-screen flex flex-col sticky top-0 z-[60] transition-all duration-500 ease-in-out border-r",
//       "bg-white/90 dark:bg-slate-950/95 backdrop-blur-xl border-slate-200/60 dark:border-slate-800/60",
//       collapsed ? "w-20" : "w-72"
//     )}>

//       {/* Toggle */}
//       <button onClick={() => setCollapsed(!collapsed)}
//         className="absolute -right-3 top-16 h-6 w-6 rounded-full bg-[#006666] text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-50 border-2 border-white dark:border-slate-900">
//         {collapsed ? <ChevronRight size={12} strokeWidth={3} /> : <ChevronLeft size={12} strokeWidth={3} />}
//       </button>

//       {/* Logo */}
//       <div className={cn("h-20 flex items-center px-6 gap-3 flex-shrink-0", collapsed && "justify-center")}>
//         <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#006666] to-[#004d4d] flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
//           <GraduationCap className="text-white" size={24} />
//         </div>
//         {!collapsed && (
//           <div className="flex flex-col animate-in fade-in slide-in-from-left-4 duration-500">
//             <span className="font-black text-xl tracking-tighter text-slate-900 dark:text-white leading-none">SUPMTI</span>
//             <span className="text-[10px] font-bold text-[#006666] tracking-[0.25em] uppercase">AI Laboratory</span>
//           </div>
//         )}
//       </div>

//       <div className="flex-1 overflow-hidden flex flex-col px-3">

//         {/* Nouveau Chat */}
//         {isChatbot && (
//           <div className="mb-4 pt-2">
//             <button onClick={handleNewChat}
//               className={cn(
//                 "group relative w-full flex items-center gap-3 rounded-2xl p-3.5 transition-all duration-300",
//                 "bg-slate-900 dark:bg-[#006666]/10 border border-slate-800 dark:border-[#006666]/30",
//                 "hover:shadow-lg hover:shadow-[#006666]/10 hover:border-[#006666]",
//                 collapsed ? "justify-center" : "px-5"
//               )}>
//               <Plus size={18} className="text-[#006666] group-hover:rotate-90 transition-transform duration-300" />
//               {!collapsed && <span className="text-sm font-bold text-white">{t('nav','new_session')}</span>}
//             </button>
//           </div>
//         )}

//         <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">

//           {/* Fonctionnalités IA */}
//           {isChatbot && (
//             <div className="mb-6">
//               {!collapsed && (
//                 <p className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2 mb-4">
//                   <Sparkles size={10} /> {t('nav','ai_capabilities')}
//                 </p>
//               )}
//               <div className="space-y-1">
//                 {featureItems.map(({ id, labelKey, icon: Icon, color, bg, badge }) => {
//                   const isActive      = activePanel === id;
//                   const showPeerBadge = id === 'peermatch' && peerBadge;
//                   return (
//                     <button key={id} onClick={() => openPanel(id)}
//                       className={cn(
//                         "w-full flex items-center gap-3 p-2 rounded-xl transition-all border-2",
//                         isActive
//                           ? "bg-white dark:bg-slate-900 border-[#006666]/40 shadow-sm"
//                           : "border-transparent hover:bg-slate-100/50 dark:hover:bg-slate-900/50",
//                         collapsed && "justify-center"
//                       )}>
//                       <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", bg)}>
//                         <Icon size={16} className={color} />
//                       </div>
//                       {!collapsed && (
//                         <div className="flex-1 flex items-center justify-between overflow-hidden">
//                           <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">
//                             {t('nav', labelKey as any)}
//                           </span>
//                           {badge && <span className="text-[8px] bg-[#CC0000] text-white px-1.5 py-0.5 rounded-md font-bold">{badge}</span>}
//                           {showPeerBadge && <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />}
//                         </div>
//                       )}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           )}

//           {/* Navigation */}
//           <div className="mb-6">
//             {!collapsed && (
//               <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2 mb-4">
//                 {t('nav','navigation_title')}
//               </p>
//             )}
//             <nav className="space-y-1">
//               {studentItems.map((item) => {
//                 const active = pathname === item.href;
//                 const Icon   = item.icon;
//                 return (
//                   <Link key={item.href} href={item.href}
//                     className={cn(
//                       "flex items-center gap-3 p-3 rounded-xl transition-all group",
//                       active
//                         ? "bg-[#006666] text-white shadow-lg shadow-emerald-900/20"
//                         : "text-slate-500 hover:text-[#006666] dark:hover:text-white",
//                       collapsed && "justify-center"
//                     )}>
//                     <Icon size={20} className={cn(active ? "text-white" : "group-hover:scale-110 transition-transform")} />
//                     {!collapsed && <span className="text-sm font-bold">{t('nav', item.nameKey as any)}</span>}
//                   </Link>
//                 );
//               })}
//             </nav>
//           </div>

//           {/* Historique */}
//           {isChatbot && !collapsed && (
//             <div className="mb-6 animate-in slide-in-from-bottom-4 duration-700">
//               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 mb-4">
//                 {t('nav','chronologie')}
//               </p>
//               <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
//                 {historique_chats.length === 0 ? (
//                   <p className="text-[10px] text-slate-400 italic text-center p-4">{t('nav','no_exchange')}</p>
//                 ) : (
//                   [...historique_chats].reverse().map((c) => (
//                     <div key={c.id}
//                       onClick={() => window.dispatchEvent(new CustomEvent('sami:load-chat', { detail: c.id }))}
//                       className={cn(
//                         "group p-3 rounded-2xl border border-transparent hover:border-[#006666]/30 transition-all cursor-pointer",
//                         c.en_cours ? "bg-[#006666]/10 border-[#006666]/20" : "bg-slate-50/50 dark:bg-slate-900/40"
//                       )}>
//                       <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">{c.titre}</p>
//                       <p className="text-[9px] text-slate-400 mt-1 uppercase font-medium">
//                         {c.date} · {c.nb_messages} msg
//                         {c.en_cours && <span className="ml-1 text-[#006666]">{t('nav','in_progress')}</span>}
//                       </p>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="px-3 mb-3">
//         <RapportButton />
//       </div>

//       {/* Footer utilisateur */}
//       <div className="p-3 flex-shrink-0 border-t border-slate-100 dark:border-slate-800/60">
//         {collapsed ? (
//           <div className="flex flex-col items-center gap-2">
//             <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#006666] to-[#CC0000] p-[2px]">
//               <div className="h-full w-full rounded-[9px] bg-white dark:bg-slate-900 flex items-center justify-center font-bold text-[#006666] text-sm">
//                 {initial}
//               </div>
//             </div>
//             <button onClick={handleLogout} title={t('nav','logout')}
//               className="p-2 rounded-xl text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all">
//               <LogOut size={15} />
//             </button>
//           </div>
//         ) : (
//           <div className="flex items-center gap-3 px-2 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
//             <div className="relative shrink-0">
//               <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#006666] to-[#CC0000] p-[2px]">
//                 <div className="h-full w-full rounded-[9px] bg-white dark:bg-slate-900 flex items-center justify-center font-bold text-[#006666] text-sm">
//                   {initial}
//                 </div>
//               </div>
//               <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-500" />
//             </div>

//             <div className="flex-1 min-w-0">
//               <p className="text-[13px] font-black text-slate-900 dark:text-white truncate uppercase tracking-tight">
//                 {nomComplet}
//               </p>
//               <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase flex items-center gap-1 mt-0.5">
//                 {bac && bac !== 'AUTRE' ? `BAC ${bac}` : user?.role || 'Étudiant'}
//                 {moyenne && moyenne > 0 && (
//                   <>
//                     <span className="h-1 w-1 rounded-full bg-slate-300" />
//                     {moyenne}/20
//                   </>
//                 )}
//               </p>
//             </div>

//             <button onClick={handleLogout} title={t('nav','logout')}
//               className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all shrink-0"
//             >
//               <LogOut size={16} />
//             </button>
//           </div>
//         )}
//       </div>
//     </aside>
//   );
// };





// src/components/layout/Sidebar.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import RapportButton from '@/components/chatbot/RapportButton';
import {
  LayoutDashboard,
  MessageSquare,
  UserCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  History,
  BarChart3,
  DoorOpen,
  Rocket,
  Scale,
  Brain,
  Medal,
  UserCheck,
  Plus,
  LucideIcon,
  Sparkles,
  LogOut,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useSessionStore } from '@/store/sessionStore';
import { usePanelStore, PanelType } from '@/store/panelStore';
import { useLang } from '@/i18n/LanguageContext';
import chatbotService from '@/services/chatbotService';
import { tr } from 'node_modules/date-fns/locale/tr.cjs';

interface NavItem {
  nameKey: string;
  fallback: string;
  href: string;
  icon: LucideIcon;
}

interface FeatureItem {
  id: PanelType;
  labelKey: string;
  fallback: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  badge?: string;
}

const studentItems: NavItem[] = [
  { nameKey: 'dashboard', fallback: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { nameKey: 'chat', fallback: 'Chatbot IA', href: '/chatbot', icon: MessageSquare },
  { nameKey: 'profil', fallback: 'Mon Profil', href: '/profile', icon: UserCircle },
  { nameKey: 'history', fallback: 'Historique', href: '/history', icon: History },
  { nameKey: 'settings', fallback: 'Paramètres', href: '/settings', icon: Settings },
];

const featureItems: FeatureItem[] = [
  { id: 'profil', labelKey: 'profil', fallback: 'Mon Profil', icon: UserCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { id: 'fitscore', labelKey: 'fitscore', fallback: 'FitScore IA', icon: BarChart3, color: 'text-orange-500', bg: 'bg-orange-500/10', badge: 'IA' },
  { id: 'admission', labelKey: 'admission', fallback: 'Simulation Admission', icon: DoorOpen, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'carriere', labelKey: 'carriere', fallback: 'Simulation Carrière', icon: Rocket, color: 'text-purple-500', bg: 'bg-purple-500/10', badge: 'GPT' },
  { id: 'comparer', labelKey: 'comparer', fallback: 'Comparer Filières', icon: Scale, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  { id: 'psycho', labelKey: 'psycho', fallback: 'Test Psycho', icon: Brain, color: 'text-pink-500', bg: 'bg-pink-500/10' },
  { id: 'coach', labelKey: 'coach', fallback: 'Coach Académique', icon: Medal, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  { id: 'peermatch', labelKey: 'peermatch', fallback: 'Peer Match', icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { profil, historique_chats, setProfil, setFitscore, setHistorique } = useSessionStore();
  const { activePanel, openPanel, peerBadge } = usePanelStore();
  const { t, isRTL } = useLang();

  const isChatbot = pathname === '/chatbot';

  const tr = (section: string, key: string, fallback: string) => {
        try {
          const value = t(section, key);
          return value || fallback;
        } catch {
          return fallback;
        }
      };




      
  const chargerSession = useCallback(async () => {
    try {
      const data = await chatbotService.getSession();
      if (data.profil) setProfil(data.profil as Parameters<typeof setProfil>[0]);
      if (data.fitscore) setFitscore(data.fitscore as Parameters<typeof setFitscore>[0]);
      if (data.historique_chats) setHistorique(data.historique_chats);
    } catch {
      // silencieux
    }
  }, [setProfil, setFitscore, setHistorique]);

  useEffect(() => {
    chargerSession();
  }, [chargerSession]);

  useEffect(() => {
    const onUpdate = () => chargerSession();
    window.addEventListener('sami:profile-updated', onUpdate);
    window.addEventListener('sami:new-chat', onUpdate);

    return () => {
      window.removeEventListener('sami:profile-updated', onUpdate);
      window.removeEventListener('sami:new-chat', onUpdate);
    };
  }, [chargerSession]);

  const handleNewChat = async () => {
    try {
      await chatbotService.newChat();
    } catch {}
    window.dispatchEvent(new CustomEvent('sami:new-chat'));
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const prenom =
    profil?.informations_personnelles?.prenom ||
    user?.full_name?.split(' ')[0] ||
    'Utilisateur';

  const nomComplet = user?.full_name || prenom;
  const bac = profil?.parcours_academique?.type_bac;
  const moyenne = profil?.parcours_academique?.moyenne_generale;
  const initial = nomComplet.charAt(0).toUpperCase();

  return (
    <aside
      dir={isRTL ? 'rtl' : 'ltr'}
      className={cn(
        'h-screen flex flex-col sticky top-0 z-[60] transition-all duration-500 ease-in-out border-r',
        'bg-white/90 dark:bg-slate-950/95 backdrop-blur-xl border-slate-200/60 dark:border-slate-800/60',
        collapsed ? 'w-20' : 'w-72'
      )}
    >
      {/* Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          'absolute top-16 h-6 w-6 rounded-full bg-[#006666] text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-50 border-2 border-white dark:border-slate-900',
          isRTL ? '-left-3' : '-right-3'
        )}
      >
        {collapsed ? (
          isRTL ? <ChevronLeft size={12} strokeWidth={3} /> : <ChevronRight size={12} strokeWidth={3} />
        ) : (
          isRTL ? <ChevronRight size={12} strokeWidth={3} /> : <ChevronLeft size={12} strokeWidth={3} />
        )}
      </button>

      {/* Logo */}
      <div className={cn('h-20 flex items-center px-6 gap-3 flex-shrink-0', collapsed && 'justify-center')}>
        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#006666] to-[#004d4d] flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
          <GraduationCap className="text-white" size={24} />
        </div>

        {!collapsed && (
          <div className="flex flex-col animate-in fade-in slide-in-from-left-4 duration-500">
            <span className="font-black text-xl tracking-tighter text-slate-900 dark:text-white leading-none">
              SUPMTI
            </span>
            <span className="text-[10px] font-bold text-[#006666] tracking-[0.25em] uppercase">
              AI Laboratory
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-hidden flex flex-col px-3">
        {/* Nouveau Chat */}
        {isChatbot && (
          <div className="mb-4 pt-2">
            <button
              onClick={handleNewChat}
              className={cn(
                'group relative w-full flex items-center gap-3 rounded-2xl p-3.5 transition-all duration-300',
                'bg-slate-900 dark:bg-[#006666]/10 border border-slate-800 dark:border-[#006666]/30',
                'hover:shadow-lg hover:shadow-[#006666]/10 hover:border-[#006666]',
                collapsed ? 'justify-center' : 'px-5'
              )}
            >
              <Plus
                size={18}
                className="text-[#006666] group-hover:rotate-90 transition-transform duration-300"
              />
              {!collapsed && (
                <span className="text-sm font-bold text-white">
                  {tr('nav', 'new_session', 'Nouvelle Session')}
                </span>
              )}
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
          {/* Fonctionnalités IA */}
          {isChatbot && (
            <div className="mb-6">
              {!collapsed && (
                <p className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2 mb-4">
                  <Sparkles size={10} />
                  {tr('nav', 'ai_capabilities', 'Capacités IA')}
                </p>
              )}

              <div className="space-y-1">
                {featureItems.map(({ id, labelKey, fallback, icon: Icon, color, bg, badge }) => {
                  const isActive = activePanel === id;
                  const showPeerBadge = id === 'peermatch' && peerBadge;

                  return (
                    <button
                      key={id}
                      onClick={() => openPanel(id)}
                      className={cn(
                        'w-full flex items-center gap-3 p-2 rounded-xl transition-all border-2',
                        isActive
                          ? 'bg-white dark:bg-slate-900 border-[#006666]/40 shadow-sm'
                          : 'border-transparent hover:bg-slate-100/50 dark:hover:bg-slate-900/50',
                        collapsed && 'justify-center'
                      )}
                    >
                      <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center shrink-0', bg)}>
                        <Icon size={16} className={color} />
                      </div>

                      {!collapsed && (
                        <div className="flex-1 flex items-center justify-between overflow-hidden min-w-0">
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">
                            {tr('nav', labelKey, fallback)}
                          </span>

                          <div className="flex items-center gap-2 shrink-0">
                            {badge && (
                              <span className="text-[8px] bg-[#CC0000] text-white px-1.5 py-0.5 rounded-md font-bold">
                                {badge}
                              </span>
                            )}
                            {showPeerBadge && <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />}
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mb-6">
            {!collapsed && (
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2 mb-4">
                {tr('nav', 'navigation_title', 'Navigation')}
              </p>
            )}

            <nav className="space-y-1">
              {studentItems.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-xl transition-all group',
                      active
                        ? 'bg-[#006666] text-white shadow-lg shadow-emerald-900/20'
                        : 'text-slate-500 hover:text-[#006666] dark:hover:text-white',
                      collapsed && 'justify-center'
                    )}
                  >
                    <Icon
                      size={20}
                      className={cn(active ? 'text-white' : 'group-hover:scale-110 transition-transform')}
                    />
                    {!collapsed && (
                      <span className="text-sm font-bold truncate">
                        {tr('nav', item.nameKey, item.fallback)}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Historique */}
          {isChatbot && !collapsed && (
            <div className="mb-6 animate-in slide-in-from-bottom-4 duration-700">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 mb-4">
                {tr('nav', 'chronologie', 'Chronologie')}
              </p>

              <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {historique_chats.length === 0 ? (
                  <p className="text-[10px] text-slate-400 italic text-center p-4">
                    {tr('nav', 'no_exchange', 'Aucun échange')}
                  </p>
                ) : (
                  [...historique_chats].reverse().map((c) => (
                    <div
                      key={c.id}
                      onClick={() =>
                        window.dispatchEvent(new CustomEvent('sami:load-chat', { detail: c.id }))
                      }
                      className={cn(
                        'group p-3 rounded-2xl border border-transparent hover:border-[#006666]/30 transition-all cursor-pointer',
                        c.en_cours
                          ? 'bg-[#006666]/10 border-[#006666]/20'
                          : 'bg-slate-50/50 dark:bg-slate-900/40'
                      )}
                    >
                      <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">
                        {c.titre}
                      </p>
                      <p className="text-[9px] text-slate-400 mt-1 uppercase font-medium">
                        {c.date} · {c.nb_messages} msg
                        {c.en_cours && (
                          <span className="ml-1 text-[#006666]">
                            {tr('nav', 'in_progress', '● en cours')}
                          </span>
                        )}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-3 mb-3">
        <RapportButton />
      </div>

      {/* Footer utilisateur */}
      <div className="p-3 flex-shrink-0 border-t border-slate-100 dark:border-slate-800/60">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#006666] to-[#CC0000] p-[2px]">
              <div className="h-full w-full rounded-[9px] bg-white dark:bg-slate-900 flex items-center justify-center font-bold text-[#006666] text-sm">
                {initial}
              </div>
            </div>

            <button
              onClick={handleLogout}
              title={tr('nav', 'logout', 'Déconnexion')}
              className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-3">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-[#006666] to-[#CC0000] p-[2px] shrink-0">
                <div className="h-full w-full rounded-[14px] bg-white dark:bg-slate-950 flex items-center justify-center font-black text-[#006666]">
                  {initial}
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-slate-800 dark:text-white truncate">
                  {nomComplet}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {bac ? `${bac}` : 'Profil étudiant'}
                  {typeof moyenne === 'number' ? ` • ${moyenne}/20` : ''}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="h-9 w-9 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors shrink-0"
                title={tr('nav', 'logout', 'Déconnexion')}
              >
                <LogOut size={17} />
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};