// 'use client';
// import { useEffect, useRef } from 'react';
// import { X, LayoutDashboard } from 'lucide-react';
// import { usePanelStore, PanelType } from '@/store/panelStore';
// import { ProfilPanel }   from './ProfilPanel';
// import { FitscorePanel } from './FitscorePanel';
// import { AdmissionPanel } from './AdmissionPanel';
// import { CarrierePanel } from './CarrierePanel';
// import { ComparerPanel } from './ComparerPanel';
// import { PsychoPanel }   from './PsychoPanel';
// import { CoachPanel }    from './CoachPanel';
// import { PeerMatchPanel } from './PeerMatchPanel';
// import { cn } from '@/lib/utils';

// const PANEL_TITLES: Record<NonNullable<PanelType>, string> = {
//   profil:    '👤 Mon Profil',
//   fitscore:  '📊 FitScore IA',
//   admission: '🎯 Simulation Admission',
//   carriere:  '🚀 Simulation Carrière',
//   comparer:  '⚖️ Comparer Filières',
//   psycho:    '🧠 Test Psychométrique',
//   coach:     '🏅 Coach Académique',
//   peermatch: '🤝 Peer Match',
// };

// export const PanelOverlay = () => {
//   const { activePanel, closePanel } = usePanelStore();
//   const overlayRef = useRef<HTMLDivElement>(null);

//   // Fermeture sur Echap
//   useEffect(() => {
//     const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closePanel(); };
//     document.addEventListener('keydown', handler);
//     return () => document.removeEventListener('keydown', handler);
//   }, [closePanel]);

//   if (!activePanel) return null;

//   return (
//     <div
//       ref={overlayRef}
//       className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[200] flex items-start justify-end transition-all duration-500 animate-in fade-in"
//       onClick={(e) => { if (e.target === overlayRef.current) closePanel(); }}
//     >
//       {/* ── Container du Panel (Sheet) ── */}
//       <div className={cn(
//         "w-[480px] max-w-[90vw] h-screen bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-white/[0.07]",
//         "flex flex-col shadow-[[-20px_0_60px_-15px_rgba(0,0,0,0.3)]]",
//         "animate-in slide-in-from-right duration-500 cubic-bezier(0.4, 0, 0.2, 1)"
//       )}>
        
//         {/* Header : Finition Miroir / Premium */}
//         <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-white/[0.07] bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl sticky top-0 z-20">
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 rounded-xl bg-[#006666]/10 flex items-center justify-center text-[#006666]">
//               <LayoutDashboard size={18} />
//             </div>
//             <div>
//               <h2 className="font-black text-sm text-slate-800 dark:text-white uppercase tracking-wider">
//                 {PANEL_TITLES[activePanel].split(' ')[1]} {/* Récupère le texte après l'émoji */}
//               </h2>
//               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] -mt-0.5">
//                 Module Intelligent SAMI
//               </p>
//             </div>
//           </div>

//           <button
//             onClick={closePanel}
//             className="group w-10 h-10 rounded-2xl flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 transition-all duration-300 active:scale-90"
//           >
//             <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
//           </button>
//         </div>

//         {/* Corps : Dégradé de fond subtil pour le contenu */}
//         <div className="flex-1 overflow-y-auto custom-scrollbar relative">
//           {/* Subtle gradient background decoration */}
//           <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#006666]/5 to-transparent pointer-events-none" />
          
//           <div className="p-6 relative z-10">
//             {activePanel === 'profil'    && <ProfilPanel />}
//             {activePanel === 'fitscore'  && <FitscorePanel />}
//             {activePanel === 'admission' && <AdmissionPanel />}
//             {activePanel === 'carriere'  && <CarrierePanel />}
//             {activePanel === 'comparer'  && <ComparerPanel />}
//             {activePanel === 'psycho'    && <PsychoPanel />}
//             {activePanel === 'coach'     && <CoachPanel />}
//             {activePanel === 'peermatch' && <PeerMatchPanel />}
//           </div>
//         </div>

//         {/* Footer : Signature discrète */}
//         <div className="px-6 py-4 border-t border-slate-100 dark:border-white/[0.07] bg-slate-50/50 dark:bg-black/20">
//            <div className="flex justify-between items-center opacity-40">
//               <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">SUPMTI AI Division</span>
//               <div className="h-1 w-1 rounded-full bg-slate-400" />
//               <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">v2.0 Beta</span>
//            </div>
//         </div>
//       </div>
//     </div>
//   );
// };



'use client';

import { useEffect, useRef } from 'react';
import { X, LayoutDashboard } from 'lucide-react';
import { usePanelStore, PanelType } from '@/store/panelStore';
import { useLang } from '@/i18n/LanguageContext';
import  ProfilPanel     from './ProfilPanel';
import { FitscorePanel }  from './FitscorePanel';
import { AdmissionPanel } from './AdmissionPanel';
import { CarrierePanel }  from './CarrierePanel';
import { ComparerPanel }  from './ComparerPanel';
import { PsychoPanel }    from './PsychoPanel';
import { CoachPanel }     from './CoachPanel';
import { PeerMatchPanel } from './PeerMatchPanel';
import { cn } from '@/lib/utils';

export const PanelOverlay = () => {
  const { activePanel, closePanel } = usePanelStore();
  const { t } = useLang();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Titres traduits dynamiquement
  const PANEL_TITLES: Record<NonNullable<PanelType>, string> = {
    profil:    `👤 ${t('profile','title')}`,
    fitscore:  `📊 ${t('panels','fitscore_title')}`,
    admission: `🎯 ${t('panels','admission_title')}`,
    carriere:  `🚀 ${t('panels','carriere_title')}`,
    comparer:  `⚖️ ${t('panels','comparer_title')}`,
    psycho:    `🧠 ${t('panels','psycho_title')}`,
    coach:     `🏅 ${t('panels','coach_title')}`,
    peermatch: `🤝 ${t('panels','peer_title')}`,
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closePanel(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [closePanel]);

  if (!activePanel) return null;

  const titleFull  = PANEL_TITLES[activePanel];
  const titleText  = titleFull.split(' ').slice(1).join(' ');

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[200] flex items-start justify-end transition-all duration-500 animate-in fade-in"
      onClick={(e) => { if (e.target === overlayRef.current) closePanel(); }}
    >
      <div className={cn(
        "w-[480px] max-w-[90vw] h-screen bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-white/[0.07]",
        "flex flex-col shadow-[[-20px_0_60px_-15px_rgba(0,0,0,0.3)]]",
        "animate-in slide-in-from-right duration-500 cubic-bezier(0.4, 0, 0.2, 1)"
      )}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-white/[0.07] bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#006666]/10 flex items-center justify-center text-[#006666]">
              <LayoutDashboard size={18} />
            </div>
            <div>
              <h2 className="font-black text-sm text-slate-800 dark:text-white uppercase tracking-wider">
                {titleText}
              </h2>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] -mt-0.5">
                {t('panels','module_sami')}
              </p>
            </div>
          </div>

          <button
            onClick={closePanel}
            className="group w-10 h-10 rounded-2xl flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 transition-all duration-300 active:scale-90"
            title={t('panel_overlay','close_btn')}
          >
            <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Corps */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#006666]/5 to-transparent pointer-events-none" />
          
          <div className="p-6 relative z-10">
            {activePanel === 'profil'    && <ProfilPanel />}
            {activePanel === 'fitscore'  && <FitscorePanel />}
            {activePanel === 'admission' && <AdmissionPanel />}
            {activePanel === 'carriere'  && <CarrierePanel />}
            {activePanel === 'comparer'  && <ComparerPanel />}
            {activePanel === 'psycho'    && <PsychoPanel />}
            {activePanel === 'coach'     && <CoachPanel />}
            {activePanel === 'peermatch' && <PeerMatchPanel />}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-white/[0.07] bg-slate-50/50 dark:bg-black/20">
           <div className="flex justify-between items-center opacity-40">
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">{t('panels','supmti_ai')}</span>
              <div className="h-1 w-1 rounded-full bg-slate-400" />
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">{t('panels','version_beta')}</span>
           </div>
        </div>
      </div>
    </div>
  );
};