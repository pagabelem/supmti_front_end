// 'use client';
// import { useEffect } from 'react';
// import { useAuthStore }    from '@/store/authStore';
// import { useSessionStore } from '@/store/sessionStore';

// import {
//   TrendingUp, BookOpen, MessageSquare, GraduationCap,
//   Brain, Rocket, Target, ArrowRight, Sparkles, CheckCircle2, Clock,
//   Scale, Medal, UserCheck, DoorOpen
// } from 'lucide-react';
// import Link from 'next/link';
// import { cn } from '@/lib/utils';

// export default function DashboardPage() {
//   const { user } = useAuthStore();
//   const { profil, fitscore, historique_chats, loadSession } = useSessionStore();

//   useEffect(() => { loadSession(); }, []);

//   const prenom      = profil?.informations_personnelles?.prenom  || user?.name || 'Étudiant';
//   const bac         = profil?.parcours_academique?.label_bac     || profil?.parcours_academique?.type_bac;
//   const moyenne     = profil?.parcours_academique?.moyenne_generale;
//   const mention     = profil?.parcours_academique?.mention;
//   const statut      = profil?.statut_profil;
//   const topScore    = fitscore?.classement?.[0];
//   const topScore2   = fitscore?.classement?.[1];
//   const nbChats     = historique_chats.length;
//   const dernierChat = historique_chats.length > 0 ? [...historique_chats].reverse()[0] : null;

//   const profilSteps = [
//     { label: 'Prénom',   done: !!profil?.informations_personnelles?.prenom },
//     { label: 'BAC',      done: !!bac && bac !== 'AUTRE' },
//     { label: 'Moyenne',  done: !!moyenne && moyenne > 0 },
//     { label: 'Intérêts', done: (profil?.preferences?.centres_interet?.length ?? 0) > 0 },
//     { label: 'FitScore', done: !!fitscore },
//   ];
//   const profilPct = Math.round((profilSteps.filter(s => s.done).length / profilSteps.length) * 100);

//   const actions = [
//     {
//       show:    !fitscore,
//       href:    '/chatbot?panel=fitscore',
//       icon:    TrendingUp,
//       color:   'text-orange-500',
//       bg:      'bg-orange-500/10',
//       border:  'border-orange-500/20 hover:border-orange-500/50 hover:bg-orange-500/5',
//       title:   'Calculer mon FitScore',
//       desc:    'Découvre ta compatibilité avec chaque filière',
//     },
//     {
//       show:    !bac || !moyenne,
//       href:    '/profile',
//       icon:    BookOpen,
//       color:   'text-blue-500',
//       bg:      'bg-blue-500/10',
//       border:  'border-blue-500/20 hover:border-blue-500/50 hover:bg-blue-500/5',
//       title:   'Compléter mon profil',
//       desc:    'Renseigne ton BAC et ta moyenne',
//     },
//     {
//       show:    true,
//       href:    '/chatbot?panel=admission',
//       icon:    DoorOpen,
//       color:   'text-cyan-500',
//       bg:      'bg-cyan-500/10',
//       border:  'border-cyan-500/20 hover:border-cyan-500/50 hover:bg-cyan-500/5',
//       title:   'Vérifier mon admission',
//       desc:    "Simule tes chances d'admission",
//     },
//     {
//       show:    true,
//       href:    '/chatbot?panel=carriere',
//       icon:    Rocket,
//       color:   'text-purple-500',
//       bg:      'bg-purple-500/10',
//       border:  'border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-500/5',
//       title:   'Simuler ma carrière',
//       desc:    'Visualise ton avenir professionnel',
//     },
//     {
//       show:    true,
//       href:    '/chatbot?panel=psycho',
//       icon:    Brain,
//       color:   'text-pink-500',
//       bg:      'bg-pink-500/10',
//       border:  'border-pink-500/20 hover:border-pink-500/50 hover:bg-pink-500/5',
//       title:   'Test psychométrique',
//       desc:    'Analyse ton profil académique',
//     },
//     {
//       show:    true,
//       href:    '/chatbot?panel=coach',
//       icon:    Medal,
//       color:   'text-yellow-500',
//       bg:      'bg-yellow-500/10',
//       border:  'border-yellow-500/20 hover:border-yellow-500/50 hover:bg-yellow-500/5',
//       title:   'Coach académique',
//       desc:    "Plan d'action personnalisé",
//     },
//   ];

//   return (
//     <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-transparent min-h-screen font-outfit">

//       {/* --- HEADER SECTION --- */}
//       <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
//         <div>
//           <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-text-primary tracking-tight">
//             Bonjour, <span className="text-accent-cyan">{prenom}</span> 👋
//           </h1>
//           <p className="text-slate-500 dark:text-text-secondary mt-2 font-medium">
//             Ravi de te revoir. Voici l'état actuel de ton orientation.
//           </p>
//         </div>
        
//         {statut && (
//           <div className={cn(
//             "flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-bold uppercase tracking-wider",
//             statut === 'complet' 
//               ? "bg-accent-green/10 border-accent-green/20 text-accent-green" 
//               : "bg-accent-orange/10 border-accent-orange/20 text-accent-orange"
//           )}>
//             <div className={cn("w-2 h-2 rounded-full animate-pulse", statut === 'complet' ? "bg-accent-green" : "bg-accent-orange")} />
//             Profil {statut}
//           </div>
//         )}
//       </div>

//       {/* --- TOP CARDS GRID --- */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//         {/* FitScore Card (Gradient Design) */}
//         <Link href="/chatbot?panel=fitscore"
//           className={cn(
//             "relative group overflow-hidden p-6 rounded-[2rem] text-white shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-95",
//             topScore 
//               ? "bg-gradient-to-br from-[#06b6d4] to-[#0891b2]" 
//               : "bg-gradient-to-br from-slate-800 to-slate-950 border border-white/5"
//           )}>
//           <div className="relative z-10 flex flex-col h-full justify-between">
//             <div className="flex justify-between items-start">
//               <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
//                 <TrendingUp size={24} />
//               </div>
//               <span className="bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">SAMI_Predictor</span>
//             </div>

//             <div className="mt-8">
//               {topScore ? (
//                 <>
//                   <p className="text-white/70 text-sm font-medium">Compatibilité Max.</p>
//                   <h2 className="text-5xl font-black mt-1 tracking-tighter">{topScore.score_total}%</h2>
//                   <p className="text-white/90 text-sm mt-2 font-bold flex items-center gap-2">
//                     <Target size={14} /> {topScore.filiere_nom || topScore.filiere_id}
//                   </p>
//                 </>
//               ) : (
//                 <>
//                   <p className="text-white/60 text-sm">Prêt pour ton analyse ?</p>
//                   <h2 className="text-2xl font-black mt-2">FitScore non calculé</h2>
//                   <div className="mt-4 flex items-center gap-2 text-xs font-bold bg-white text-cyan-600 w-fit px-4 py-2 rounded-full group-hover:bg-cyan-50 transition-colors">
//                     Lancer l'IA <ArrowRight size={14} />
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//           {/* Decorative spheres */}
//           <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
//           <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl" />
//         </Link>

//         {/* Parcours Académique (Dark Glassmorphism) */}
//         <div className="bg-white dark:bg-bg-card p-7 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="p-2 bg-accent-blue/10 rounded-xl">
//               <BookOpen className="text-accent-blue" size={22} />
//             </div>
//             <h3 className="font-bold text-slate-800 dark:text-text-primary uppercase text-xs tracking-widest">Scolarité</h3>
//           </div>
          
//           <div className="space-y-5">
//             <div className="p-4 rounded-2xl bg-slate-50 dark:bg-bg-input border border-slate-100 dark:border-white/5">
//               <p className="text-[10px] text-slate-400 dark:text-text-muted font-bold uppercase mb-1">Type de Bac</p>
//               <p className="text-sm font-bold text-slate-700 dark:text-text-primary">
//                 {bac && bac !== 'AUTRE' ? bac : "Non défini"}
//               </p>
//             </div>
//             <div className="p-4 rounded-2xl bg-slate-50 dark:bg-bg-input border border-slate-100 dark:border-white/5">
//               <p className="text-[10px] text-slate-400 dark:text-text-muted font-bold uppercase mb-1">Performance</p>
//               <div className="flex items-end gap-2">
//                 <span className="text-2xl font-black text-accent-cyan">
//                   {moyenne && moyenne > 0 ? `${moyenne}` : "--"}
//                 </span>
//                 <span className="text-xs font-bold text-slate-400 mb-1">/20</span>
//                 {mention && (
//                   <span className="ml-auto text-[10px] px-2 py-1 bg-accent-cyan/10 text-accent-cyan rounded-md font-bold uppercase">
//                     {mention}
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Activité SAMI (Interactive) */}
//         <Link href="/history" className="group bg-white dark:bg-bg-card p-7 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-xl transition-all hover:border-accent-green/30">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="p-2 bg-accent-green/10 rounded-xl">
//               <MessageSquare className="text-accent-green" size={22} />
//             </div>
//             <h3 className="font-bold text-slate-800 dark:text-text-primary uppercase text-xs tracking-widest">Activité SAMI</h3>
//           </div>

//           <div className="space-y-4">
//             <div className="flex items-center justify-between px-2">
//               <span className="text-sm text-slate-500 dark:text-text-secondary">Discussions</span>
//               <span className="text-xl font-black text-slate-800 dark:text-text-primary">{nbChats}</span>
//             </div>

//             {dernierChat ? (
//               <div className="p-4 rounded-2xl bg-accent-green/5 border border-accent-green/10 group-hover:bg-accent-green/10 transition-colors">
//                 <div className="flex items-center gap-2 mb-2">
//                   <div className="w-1.5 h-1.5 rounded-full bg-accent-green" />
//                   <span className="text-[10px] font-bold text-accent-green uppercase">Dernier échange</span>
//                 </div>
//                 <p className="text-sm font-bold text-slate-700 dark:text-text-primary truncate">{dernierChat.titre}</p>
//                 <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-400">
//                   <Clock size={12} /> {dernierChat.date}
//                 </div>
//               </div>
//             ) : (
//               <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-100 dark:border-white/5 rounded-2xl">
//                 <p className="text-xs text-slate-400 italic font-medium tracking-wide">Aucun historique</p>
//               </div>
//             )}
//           </div>
//         </Link>
//       </div>

//       {/* --- PROGRESSION SECTION --- */}
//       <div className="bg-white dark:bg-bg-card border border-slate-100 dark:border-white/5 rounded-[2rem] p-8 shadow-xl shadow-slate-200/30 dark:shadow-none">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
//           <div>
//             <h3 className="text-xl font-black text-slate-800 dark:text-text-primary flex items-center gap-2">
//               <Sparkles size={20} className="text-accent-cyan" /> État de ton profil
//             </h3>
//             <p className="text-sm text-slate-500 dark:text-text-secondary mt-1">Plus ton profil est complet, plus SAMI sera précis.</p>
//           </div>
//           <div className="text-right">
//             <span className="text-4xl font-black text-accent-cyan tracking-tighter">{profilPct}%</span>
//           </div>
//         </div>

//         <div className="w-full h-4 bg-slate-100 dark:bg-bg-input rounded-full mb-8 overflow-hidden p-1">
//           <div className="h-full rounded-full bg-gradient-to-r from-accent-cyan to-accent-blue transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(6,182,212,0.3)]"
//             style={{ width: `${profilPct}%` }} />
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//           {profilSteps.map(({ label, done }) => (
//             <div key={label} className={cn(
//               "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all",
//               done 
//                 ? "bg-accent-green/5 border-accent-green/10 text-accent-green" 
//                 : "bg-slate-50 dark:bg-bg-input border-slate-100 dark:border-white/5 text-slate-400 dark:text-text-muted"
//             )}>
//               <CheckCircle2 size={20} className={cn("mb-2 transition-colors", done ? 'text-accent-green' : 'text-slate-200 dark:text-slate-800')} />
//               <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* --- ACTIONS SECTION --- */}
//       <div className="space-y-4">
//         <div className="flex items-center gap-2 px-2">
//            <Target size={18} className="text-accent-orange" />
//            <h3 className="text-lg font-black text-slate-800 dark:text-text-primary uppercase tracking-tight">Outils d'orientation</h3>
//         </div>
        
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {actions.filter(a => a.show).map(({ href, icon:Icon, color, bg, border, title, desc }) => (
//             <Link key={href+title} href={href}
//               className={cn(
//                 "group relative p-5 rounded-[1.5rem] border-2 border-dashed transition-all duration-300",
//                 "bg-white dark:bg-bg-card",
//                 border
//               )}>
//               <div className="flex items-start justify-between">
//                 <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", bg)}>
//                   <Icon size={22} className={color} />
//                 </div>
//                 <div className="p-1 bg-slate-50 dark:bg-bg-input rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
//                   <ArrowRight size={16} className="text-slate-400" />
//                 </div>
//               </div>
//               <div className="mt-4 min-w-0">
//                 <p className="text-sm font-black text-slate-800 dark:text-text-primary group-hover:text-accent-cyan transition-colors">{title}</p>
//                 <p className="text-[11px] font-medium text-slate-400 dark:text-text-muted mt-1 leading-relaxed">{desc}</p>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>

//       {/* --- FOOTER --- */}
//       <div className="pt-8 border-t border-slate-100 dark:border-white/5 text-center">
//         <p className="text-[10px] font-bold text-slate-400 dark:text-text-muted uppercase tracking-[0.3em]">
//           © 2026 SUPMTI MEKNÈS • SAMI INTELLIGENCE ARTIFICIELLE
//         </p>
//       </div>
//     </div>
//   );
// }





'use client';
import { useEffect } from 'react';
import { useAuthStore }    from '@/store/authStore';
import { useSessionStore } from '@/store/sessionStore';
import { useLang }         from '@/i18n/LanguageContext';

import {
  TrendingUp, BookOpen, MessageSquare, GraduationCap,
  Brain, Rocket, Target, ArrowRight, Sparkles, CheckCircle2, Clock,
  Scale, Medal, UserCheck, DoorOpen
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { profil, fitscore, historique_chats, loadSession } = useSessionStore();
  const { t, isRTL } = useLang();

  useEffect(() => { loadSession(); }, []);

  const prenom      = profil?.informations_personnelles?.prenom  || user?.name || t('common', 'loading').replace('…','');
  const bac         = profil?.parcours_academique?.label_bac     || profil?.parcours_academique?.type_bac;
  const moyenne     = profil?.parcours_academique?.moyenne_generale;
  const mention     = profil?.parcours_academique?.mention;
  const statut      = profil?.statut_profil;
  const topScore    = fitscore?.classement?.[0];
  const topScore2   = fitscore?.classement?.[1];
  const nbChats     = historique_chats.length;
  const dernierChat = historique_chats.length > 0 ? [...historique_chats].reverse()[0] : null;

  const profilSteps = [
    { label: t('profile', 'ph_name').split(' ')[0],   done: !!profil?.informations_personnelles?.prenom },
    { label: 'BAC',                                    done: !!bac && bac !== 'AUTRE' },
    { label: t('profile', 'stat_avg'),                 done: !!moyenne && moyenne > 0 },
    { label: t('nav', 'profil').split(' ')[1] || 'Intérêts', done: (profil?.preferences?.centres_interet?.length ?? 0) > 0 },
    { label: 'FitScore',                               done: !!fitscore },
  ];
  const profilPct = Math.round((profilSteps.filter(s => s.done).length / profilSteps.length) * 100);

  // Traductions des actions
  const actions = [
    {
      show:    !fitscore,
      href:    '/chatbot?panel=fitscore',
      icon:    TrendingUp,
      color:   'text-orange-500',
      bg:      'bg-orange-500/10',
      border:  'border-orange-500/20 hover:border-orange-500/50 hover:bg-orange-500/5',
      title:   t('panels', 'fitscore_btn'),
      desc:    t('panels', 'fitscore_title'),
    },
    {
      show:    !bac || !moyenne,
      href:    '/profile',
      icon:    BookOpen,
      color:   'text-blue-500',
      bg:      'bg-blue-500/10',
      border:  'border-blue-500/20 hover:border-blue-500/50 hover:bg-blue-500/5',
      title:   t('profile', 'btn_save'),
      desc:    t('profile', 'label_bac') + ' & ' + t('profile', 'stat_avg'),
    },
    {
      show:    true,
      href:    '/chatbot?panel=admission',
      icon:    DoorOpen,
      color:   'text-cyan-500',
      bg:      'bg-cyan-500/10',
      border:  'border-cyan-500/20 hover:border-cyan-500/50 hover:bg-cyan-500/5',
      title:   t('panels', 'admission_btn'),
      desc:    t('panels', 'admission_title'),
    },
    {
      show:    true,
      href:    '/chatbot?panel=carriere',
      icon:    Rocket,
      color:   'text-purple-500',
      bg:      'bg-purple-500/10',
      border:  'border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-500/5',
      title:   t('panels', 'carriere_btn'),
      desc:    t('panels', 'carriere_title'),
    },
    {
      show:    true,
      href:    '/chatbot?panel=psycho',
      icon:    Brain,
      color:   'text-pink-500',
      bg:      'bg-pink-500/10',
      border:  'border-pink-500/20 hover:border-pink-500/50 hover:bg-pink-500/5',
      title:   t('panels', 'psycho_btn'),
      desc:    t('panels', 'psycho_title'),
    },
    {
      show:    true,
      href:    '/chatbot?panel=coach',
      icon:    Medal,
      color:   'text-yellow-500',
      bg:      'bg-yellow-500/10',
      border:  'border-yellow-500/20 hover:border-yellow-500/50 hover:bg-yellow-500/5',
      title:   t('panels', 'coach_btn'),
      desc:    t('panels', 'coach_title'),
    },
  ];

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-transparent min-h-screen font-outfit">

      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-text-primary tracking-tight">
            {/* "Bonjour" traduit */}
            {t('chat', 'empty_title').split(',')[0]}, <span className="text-accent-cyan">{prenom}</span> 👋
          </h1>
          <p className="text-slate-500 dark:text-text-secondary mt-2 font-medium">
            {t('chat', 'empty_subtitle')}
          </p>
        </div>

        {statut && (
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-bold uppercase tracking-wider",
            statut === 'complet'
              ? "bg-accent-green/10 border-accent-green/20 text-accent-green"
              : "bg-accent-orange/10 border-accent-orange/20 text-accent-orange"
          )}>
            <div className={cn("w-2 h-2 rounded-full animate-pulse", statut === 'complet' ? "bg-accent-green" : "bg-accent-orange")} />
            {/* "Profil complet / incomplet" */}
            {t('nav', 'profil')} {statut}
          </div>
        )}
      </div>

      {/* --- TOP CARDS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* FitScore Card */}
        <Link href="/chatbot?panel=fitscore"
          className={cn(
            "relative group overflow-hidden p-6 rounded-[2rem] text-white shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-95",
            topScore
              ? "bg-gradient-to-br from-[#06b6d4] to-[#0891b2]"
              : "bg-gradient-to-br from-slate-800 to-slate-950 border border-white/5"
          )}>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                <TrendingUp size={24} />
              </div>
              <span className="bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">SAMI_Predictor</span>
            </div>

            <div className="mt-8">
              {topScore ? (
                <>
                  <p className="text-white/70 text-sm font-medium">{t('panels', 'fitscore_top')}</p>
                  <h2 className="text-5xl font-black mt-1 tracking-tighter">{topScore.score_total}%</h2>
                  <p className="text-white/90 text-sm mt-2 font-bold flex items-center gap-2">
                    <Target size={14} /> {topScore.filiere_nom || topScore.filiere_id}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-white/60 text-sm">{t('panels', 'complete_profile')}</p>
                  <h2 className="text-2xl font-black mt-2">{t('panels', 'fitscore_title')}</h2>
                  <div className="mt-4 flex items-center gap-2 text-xs font-bold bg-white text-cyan-600 w-fit px-4 py-2 rounded-full group-hover:bg-cyan-50 transition-colors">
                    {t('panels', 'fitscore_btn')} <ArrowRight size={14} />
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl" />
        </Link>

        {/* Parcours Académique */}
        <div className="bg-white dark:bg-bg-card p-7 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-accent-blue/10 rounded-xl">
              <BookOpen className="text-accent-blue" size={22} />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-text-primary uppercase text-xs tracking-widest">
              {t('profile', 'label_bac')}
            </h3>
          </div>

          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-bg-input border border-slate-100 dark:border-white/5">
              <p className="text-[10px] text-slate-400 dark:text-text-muted font-bold uppercase mb-1">{t('profile', 'stat_bac')}</p>
              <p className="text-sm font-bold text-slate-700 dark:text-text-primary">
                {bac && bac !== 'AUTRE' ? bac : t('common', 'error').replace('Erreur','-')}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-bg-input border border-slate-100 dark:border-white/5">
              <p className="text-[10px] text-slate-400 dark:text-text-muted font-bold uppercase mb-1">{t('profile', 'stat_avg')}</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-black text-accent-cyan">
                  {moyenne && moyenne > 0 ? `${moyenne}` : "--"}
                </span>
                <span className="text-xs font-bold text-slate-400 mb-1">/20</span>
                {mention && (
                  <span className="ml-auto text-[10px] px-2 py-1 bg-accent-cyan/10 text-accent-cyan rounded-md font-bold uppercase">
                    {mention}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Activité SAMI */}
        <Link href="/history" className="group bg-white dark:bg-bg-card p-7 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-xl transition-all hover:border-accent-green/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-accent-green/10 rounded-xl">
              <MessageSquare className="text-accent-green" size={22} />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-text-primary uppercase text-xs tracking-widest">
              {t('nav', 'history')}
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-sm text-slate-500 dark:text-text-secondary">{t('history', 'subtitle_count')}</span>
              <span className="text-xl font-black text-slate-800 dark:text-text-primary">{nbChats}</span>
            </div>

            {dernierChat ? (
              <div className="p-4 rounded-2xl bg-accent-green/5 border border-accent-green/10 group-hover:bg-accent-green/10 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                  <span className="text-[10px] font-bold text-accent-green uppercase">{t('history', 'in_progress')}</span>
                </div>
                <p className="text-sm font-bold text-slate-700 dark:text-text-primary truncate">{dernierChat.titre}</p>
                <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-400">
                  <Clock size={12} /> {dernierChat.date}
                </div>
              </div>
            ) : (
              <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-100 dark:border-white/5 rounded-2xl">
                <p className="text-xs text-slate-400 italic font-medium tracking-wide">{t('history', 'subtitle_empty')}</p>
              </div>
            )}
          </div>
        </Link>
      </div>

      {/* --- PROGRESSION SECTION --- */}
      <div className="bg-white dark:bg-bg-card border border-slate-100 dark:border-white/5 rounded-[2rem] p-8 shadow-xl shadow-slate-200/30 dark:shadow-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h3 className="text-xl font-black text-slate-800 dark:text-text-primary flex items-center gap-2">
              <Sparkles size={20} className="text-accent-cyan" /> {t('profile', 'sami_hint')}
            </h3>
            <p className="text-sm text-slate-500 dark:text-text-secondary mt-1">{t('profile', 'sami_alert')}</p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-black text-accent-cyan tracking-tighter">{profilPct}%</span>
          </div>
        </div>

        <div className="w-full h-4 bg-slate-100 dark:bg-bg-input rounded-full mb-8 overflow-hidden p-1">
          <div className="h-full rounded-full bg-gradient-to-r from-accent-cyan to-accent-blue transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            style={{ width: `${profilPct}%` }} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {profilSteps.map(({ label, done }) => (
            <div key={label} className={cn(
              "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all",
              done
                ? "bg-accent-green/5 border-accent-green/10 text-accent-green"
                : "bg-slate-50 dark:bg-bg-input border-slate-100 dark:border-white/5 text-slate-400 dark:text-text-muted"
            )}>
              <CheckCircle2 size={20} className={cn("mb-2 transition-colors", done ? 'text-accent-green' : 'text-slate-200 dark:text-slate-800')} />
              <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* --- ACTIONS SECTION --- */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
           <Target size={18} className="text-accent-orange" />
           <h3 className="text-lg font-black text-slate-800 dark:text-text-primary uppercase tracking-tight">
             {t('common', 'module_sami')}
           </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.filter(a => a.show).map(({ href, icon:Icon, color, bg, border, title, desc }) => (
            <Link key={href+title} href={href}
              className={cn(
                "group relative p-5 rounded-[1.5rem] border-2 border-dashed transition-all duration-300",
                "bg-white dark:bg-bg-card",
                border
              )}>
              <div className="flex items-start justify-between">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", bg)}>
                  <Icon size={22} className={color} />
                </div>
                <div className="p-1 bg-slate-50 dark:bg-bg-input rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight size={16} className={cn("text-slate-400", isRTL && "rotate-180")} />
                </div>
              </div>
              <div className="mt-4 min-w-0">
                <p className="text-sm font-black text-slate-800 dark:text-text-primary group-hover:text-accent-cyan transition-colors">{title}</p>
                <p className="text-[11px] font-medium text-slate-400 dark:text-text-muted mt-1 leading-relaxed">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* --- FOOTER --- */}
      <div className="pt-8 border-t border-slate-100 dark:border-white/5 text-center">
        <p className="text-[10px] font-bold text-slate-400 dark:text-text-muted uppercase tracking-[0.3em]">
          © 2026 SUPMTI MEKNÈS • SAMI INTELLIGENCE ARTIFICIELLE
        </p>
      </div>
    </div>
  );
}