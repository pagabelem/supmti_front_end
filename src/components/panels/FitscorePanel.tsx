// // 'use client';
// // import { useState } from 'react';
// // import { BarChart3, Target, BrainCircuit, MessageSquareText, ChevronRight } from 'lucide-react';
// // import { useSessionStore } from '@/store/sessionStore';
// // import { usePanelStore }   from '@/store/panelStore';
// // import { getFitscore }     from '@/services/panelService';
// // import { Spinner, ErrorBox, ActionBtn, ScoreBar, ResultCard, Prose } from './ui';
// // import { cn } from '@/lib/utils';

// // export const FitscorePanel = () => {
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError]     = useState<string | null>(null);
// //   const { fitscore, setFitscore } = useSessionStore();
// //   const { closePanel, openPanel } = usePanelStore();

// //   const calc = async () => {
// //     setLoading(true);
// //     setError(null);
// //     try {
// //       const data = await getFitscore();
// //       if (data.error) { 
// //         setError(data.message || 'Données insuffisantes'); 
// //         setLoading(false); 
// //         return; 
// //       }
// //       setFitscore(data as Parameters<typeof setFitscore>[0]);
// //     } catch { 
// //       setError('Lien avec le moteur de calcul interrompu.'); 
// //     }
// //     setLoading(false);
// //   };

// //   return (
// //     <div className="space-y-6 animate-in fade-in duration-500 pb-6">
// //       {/* ── Header : Concept ── */}
// //       <div className="p-4 rounded-2xl bg-gradient-to-br from-[#006666]/5 to-blue-500/5 border border-[#006666]/10">
// //         <div className="flex items-center gap-2 mb-2">
// //           <BrainCircuit size={18} className="text-[#006666]" />
// //           <span className="text-[10px] font-black text-[#006666] uppercase tracking-[0.2em]">Algorithme de Matching</span>
// //         </div>
// //         <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
// //           SAMI croise ton <span className="text-slate-700 dark:text-slate-200 font-bold">cursus actuel</span>, tes <span className="text-slate-700 dark:text-slate-200 font-bold">performances au BAC</span> et ton <span className="text-slate-700 dark:text-slate-200 font-bold">profil psycho</span> pour identifier ta voie idéale.
// //         </p>
// //       </div>

// //       {/* ── Action Trigger ── */}
// //       <div className="relative group">
// //         {!fitscore?.classement && (
// //            <div className="absolute -inset-0.5 bg-[#006666] rounded-xl blur opacity-10 group-hover:opacity-25 transition duration-1000"></div>
// //         )}
// //         <ActionBtn 
// //           onClick={calc} 
// //           disabled={loading}
// //           className={cn(
// //             "relative w-full py-4 font-bold transition-all active:scale-95 shadow-xl",
// //             fitscore?.classement ? "bg-slate-100 dark:bg-slate-800 text-slate-500 shadow-none" : "bg-[#006666] text-white"
// //           )}
// //         >
// //           {loading ? (
// //             <span className="flex items-center gap-2 italic text-sm">Synchronisation des données...</span>
// //           ) : (
// //             <span className="flex items-center justify-center gap-2">
// //               <BarChart3 size={18} />
// //               {fitscore?.classement ? "Recalculer mon FitScore" : "Calculer mon FitScore"}
// //             </span>
// //           )}
// //         </ActionBtn>
// //       </div>

// //       {loading && (
// //         <div className="flex flex-col items-center py-12 gap-4 animate-pulse">
// //           <Spinner />
// //           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Calcul de probabilités...</p>
// //         </div>
// //       )}

// //       {/* ── Erreur & Onboarding ── */}
// //       {error && (
// //         <div className="animate-in zoom-in-95 duration-300">
// //           <ErrorBox message={error} />
// //           <div className="mt-4 p-4 rounded-xl bg-orange-500/5 border border-dashed border-orange-500/20">
// //             <p className="text-[11px] text-slate-500 mb-3 text-center">
// //               Il manque des informations sur tes notes ou tes intérêts pour un calcul précis.
// //             </p>
// //             <ActionBtn variant="secondary" onClick={() => closePanel()} className="w-full text-xs">
// //               <MessageSquareText size={14} className="mr-2" /> Discuter avec SAMI
// //             </ActionBtn>
// //           </div>
// //         </div>
// //       )}

// //       {/* ── Résultats ── */}
// //       {!loading && !error && fitscore?.classement && (
// //         <div className="space-y-4 animate-in slide-in-from-top-4 duration-700">
          
// //           {/* Top 1 Highlight */}
// //           <div className="relative px-1">
// //             <div className="flex items-center gap-2 mb-3">
// //               <Target size={14} className="text-[#006666]" />
// //               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Classement Prédictif</h4>
// //             </div>
            
// //             <ResultCard className="border-t-4 border-t-[#006666] bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-2xl shadow-slate-200/50 dark:shadow-none">
// //               <div className="space-y-5 py-2">
// //                 {fitscore.classement.map((f, idx) => (
// //                   <div key={f.filiere_id} className="relative">
// //                     <ScoreBar 
// //                       label={f.filiere_nom || f.filiere_id} 
// //                       value={f.score_total} 
// //                     />
// //                     {idx === 0 && (
// //                       <div className="absolute -right-1 -top-2">
// //                         <span className="bg-emerald-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm animate-bounce">TOP MATCH</span>
// //                       </div>
// //                     )}
// //                   </div>
// //                 ))}
// //               </div>
// //             </ResultCard>
// //           </div>

// //           {/* Rapport Narratif */}
// //           {fitscore.rapport && (
// //             <div className="animate-in fade-in duration-1000 delay-300">
// //               <div className="flex items-center gap-2 mb-3 px-1">
// //                 <BrainCircuit size={14} className="text-slate-400" />
// //                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-xs">Analyse du profil</h4>
// //               </div>
// //               <ResultCard>
// //                 <Prose content={fitscore.rapport} className="text-sm leading-relaxed" />
// //               </ResultCard>
// //             </div>
// //           )}

// //           {/* Upsell vers le test psycho */}
// //           <button 
// //             onClick={() => openPanel('psycho')}
// //             className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-900 text-white group hover:bg-black transition-all shadow-lg"
// //           >
// //             <div className="flex items-center gap-3 text-left">
// //               <div className="p-2 bg-white/10 rounded-lg group-hover:scale-110 transition-transform">
// //                 <BrainCircuit size={20} className="text-emerald-400" />
// //               </div>
// //               <div>
// //                 <p className="text-[11px] font-black uppercase tracking-widest text-emerald-400">Précision +25%</p>
// //                 <p className="text-xs text-slate-400">Passer le test psychométrique</p>
// //               </div>
// //             </div>
// //             <ChevronRight size={18} className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
// //           </button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };




// 'use client';
// import { useState } from 'react';
// import { BarChart3, Target, BrainCircuit, MessageSquareText, ChevronRight } from 'lucide-react';
// import { useSessionStore } from '@/store/sessionStore';
// import { usePanelStore }   from '@/store/panelStore';
// import { getFitscore }     from '@/services/panelService';
// import { Spinner, ErrorBox, ActionBtn, ScoreBar, ResultCard, Prose } from './ui';
// import { cn } from '@/lib/utils';

// export const FitscorePanel = () => {
//   const [loading, setLoading] = useState(false);
//   const [error,   setError]   = useState<string | null>(null);
//   const { fitscore, setFitscore } = useSessionStore();
//   const { closePanel, openPanel } = usePanelStore();

//   const calc = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await getFitscore();
//       if (data.error) {
//         setError(data.message || 'Données insuffisantes');
//         setLoading(false);
//         return;
//       }
//       setFitscore(data as Parameters<typeof setFitscore>[0]);
//     } catch {
//       setError('Lien avec le moteur de calcul interrompu.');
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500 pb-6">

//       {/* Header */}
//       <div className="p-4 rounded-2xl bg-gradient-to-br from-[#006666]/5 to-blue-500/5 border border-[#006666]/10">
//         <div className="flex items-center gap-2 mb-2">
//           <BrainCircuit size={18} className="text-[#006666]" />
//           <span className="text-[10px] font-black text-[#006666] uppercase tracking-[0.2em]">Algorithme de Matching</span>
//         </div>
//         <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
//           SAMI croise ton <span className="text-slate-700 dark:text-slate-200 font-bold">cursus actuel</span>, tes{' '}
//           <span className="text-slate-700 dark:text-slate-200 font-bold">performances au BAC</span> et ton{' '}
//           <span className="text-slate-700 dark:text-slate-200 font-bold">profil psycho</span> pour identifier ta voie idéale.
//         </p>
//       </div>

//       {/* Bouton calculer */}
//       <div className="relative group">
//         {!fitscore?.classement && (
//           <div className="absolute -inset-0.5 bg-[#006666] rounded-xl blur opacity-10 group-hover:opacity-25 transition duration-1000" />
//         )}
//         <ActionBtn
//           onClick={calc}
//           disabled={loading}
//           className={cn(
//             "relative w-full py-4 font-bold transition-all active:scale-95 shadow-xl",
//             fitscore?.classement
//               ? "bg-slate-100 dark:bg-slate-800 text-slate-500 shadow-none"
//               : "bg-[#006666] text-white"
//           )}
//         >
//           {loading ? (
//             <span className="flex items-center gap-2 italic text-sm">Synchronisation des données...</span>
//           ) : (
//             <span className="flex items-center justify-center gap-2">
//               <BarChart3 size={18} />
//               {fitscore?.classement ? "Recalculer mon FitScore" : "Calculer mon FitScore"}
//             </span>
//           )}
//         </ActionBtn>
//       </div>

//       {loading && (
//         <div className="flex flex-col items-center py-12 gap-4 animate-pulse">
//           <Spinner label="Calcul de probabilités..." />
//         </div>
//       )}

//       {/* Erreur */}
//       {error && (
//         <div className="animate-in zoom-in-95 duration-300">
//           <ErrorBox message={error} />
//           <div className="mt-4 p-4 rounded-xl bg-orange-500/5 border border-dashed border-orange-500/20">
//             <p className="text-[11px] text-slate-500 mb-3 text-center">
//               Il manque des informations sur tes notes ou tes intérêts pour un calcul précis.
//             </p>
//             <ActionBtn variant="secondary" onClick={() => closePanel()} className="w-full text-xs">
//               <MessageSquareText size={14} className="mr-2" /> Discuter avec SAMI
//             </ActionBtn>
//           </div>
//         </div>
//       )}

//       {/* Résultats */}
//       {!loading && !error && fitscore?.classement && (
//         <div className="space-y-4 animate-in slide-in-from-top-4 duration-700">

//           <div className="relative px-1">
//             <div className="flex items-center gap-2 mb-3">
//               <Target size={14} className="text-[#006666]" />
//               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Classement Prédictif</h4>
//             </div>

//             <ResultCard className="border-t-4 border-t-[#006666] bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-2xl shadow-slate-200/50 dark:shadow-none">
//               <div className="space-y-5 py-2">
//                 {fitscore.classement.map((f: any, idx: number) => {
//                   // FIX : utiliser filiere_nom OU nom en priorité sur filiere_id brut
//                   const label = f.filiere_nom || f.nom || f.filiere_id || '';
//                   const score = f.score_total ?? f.score ?? 0;
//                   const eligible = f.eligible !== false; // true par défaut

//                   return (
//                     <div key={f.filiere_id || idx} className="relative">
//                       <ScoreBar label={label} value={score} />
//                       {/* Badge TOP MATCH pour le premier */}
//                       {idx === 0 && (
//                         <div className="absolute -right-1 -top-2">
//                           <span className="bg-emerald-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm animate-bounce">
//                             TOP MATCH
//                           </span>
//                         </div>
//                       )}
//                       {/* Badge non-éligible */}
//                       {!eligible && (
//                         <div className="mt-1 flex items-center gap-1">
//                           <span className="text-[9px] text-orange-500 font-bold">
//                             ⚠️ Niveau requis non atteint
//                           </span>
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             </ResultCard>
//           </div>

//           {/* Rapport narratif */}
//           {fitscore.rapport && (
//             <div className="animate-in fade-in duration-1000 delay-300">
//               <div className="flex items-center gap-2 mb-3 px-1">
//                 <BrainCircuit size={14} className="text-slate-400" />
//                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Analyse du profil</h4>
//               </div>
//               <ResultCard>
//                 <Prose content={fitscore.rapport} className="text-sm leading-relaxed" />
//               </ResultCard>
//             </div>
//           )}

//           {/* Upsell vers test psycho */}
//           <button
//             onClick={() => openPanel('psycho')}
//             className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-900 text-white group hover:bg-black transition-all shadow-lg"
//           >
//             <div className="flex items-center gap-3 text-left">
//               <div className="p-2 bg-white/10 rounded-lg group-hover:scale-110 transition-transform">
//                 <BrainCircuit size={20} className="text-emerald-400" />
//               </div>
//               <div>
//                 <p className="text-[11px] font-black uppercase tracking-widest text-emerald-400">Précision +25%</p>
//                 <p className="text-xs text-slate-400">Passer le test psychométrique</p>
//               </div>
//             </div>
//             <ChevronRight size={18} className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };



'use client';
import { useState } from 'react';
import { BarChart3, Target, BrainCircuit, MessageSquareText, ChevronRight, XCircle } from 'lucide-react';
import { useSessionStore } from '@/store/sessionStore';
import { usePanelStore }   from '@/store/panelStore';
import { getFitscore }     from '@/services/panelService';
import { ErrorBox, ActionBtn, ScoreBar, ResultCard, Prose } from './ui';
import { cn } from '@/lib/utils';

export const FitscorePanel = () => {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const { fitscore, setFitscore } = useSessionStore();
  const { closePanel, openPanel } = usePanelStore();

  const calc = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFitscore();
      if (data.error) {
        setError(data.message || 'Données insuffisantes');
        setLoading(false);
        return;
      }
      setFitscore(data as Parameters<typeof setFitscore>[0]);
    } catch {
      setError('Lien avec le moteur de calcul interrompu.');
    }
    setLoading(false);
  };

  // Séparer éligibles / non-éligibles
  const eligibles    = fitscore?.classement?.filter((f: any) => f.eligible !== false) ?? [];
  const nonEligibles = fitscore?.classement?.filter((f: any) => f.eligible === false) ?? [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-6">

      {/* Header */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#006666]/5 to-blue-500/5 border border-[#006666]/10">
        <div className="flex items-center gap-2 mb-2">
          <BrainCircuit size={18} className="text-[#006666]" />
          <span className="text-[10px] font-black text-[#006666] uppercase tracking-[0.2em]">Algorithme de Matching</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          SAMI croise ton <span className="text-slate-700 dark:text-slate-200 font-bold">cursus actuel</span>, tes{' '}
          <span className="text-slate-700 dark:text-slate-200 font-bold">performances au BAC</span> et ton{' '}
          <span className="text-slate-700 dark:text-slate-200 font-bold">profil psycho</span> pour identifier ta voie idéale.
        </p>
      </div>

      {/* Bouton calculer */}
      <div className="relative group">
        {!fitscore?.classement && (
          <div className="absolute -inset-0.5 bg-[#006666] rounded-xl blur opacity-10 group-hover:opacity-25 transition duration-1000" />
        )}
        <ActionBtn
          onClick={calc}
          disabled={loading}
          className={cn(
            "relative w-full py-4 font-bold transition-all active:scale-95 shadow-xl",
            fitscore?.classement
              ? "bg-slate-100 dark:bg-slate-800 text-slate-500 shadow-none"
              : "bg-[#006666] text-white"
          )}
        >
          {loading ? (
            <span className="flex items-center gap-2 italic text-sm">Synchronisation des données...</span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <BarChart3 size={18} />
              {fitscore?.classement ? "Recalculer mon FitScore" : "Calculer mon FitScore"}
            </span>
          )}
        </ActionBtn>
      </div>

      {loading && (
        <div className="flex flex-col items-center py-12 gap-4 animate-pulse">
          <div className="w-10 h-10 border-2 border-[#006666]/30 border-t-[#006666] rounded-full animate-spin" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Calcul de probabilités...</p>
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div className="animate-in zoom-in-95 duration-300">
          <ErrorBox message={error} />
          <div className="mt-4 p-4 rounded-xl bg-orange-500/5 border border-dashed border-orange-500/20">
            <p className="text-[11px] text-slate-500 mb-3 text-center">
              Il manque des informations sur tes notes ou tes intérêts pour un calcul précis.
            </p>
            <ActionBtn variant="secondary" onClick={() => closePanel()} className="w-full text-xs">
              <MessageSquareText size={14} className="mr-2" /> Discuter avec SAMI
            </ActionBtn>
          </div>
        </div>
      )}

      {/* Résultats */}
      {!loading && !error && fitscore?.classement && (
        <div className="space-y-4 animate-in slide-in-from-top-4 duration-700">

          {/* ── Filières ÉLIGIBLES ── */}
          {eligibles.length > 0 && (
            <div className="relative px-1">
              <div className="flex items-center gap-2 mb-3">
                <Target size={14} className="text-[#006666]" />
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Classement — Filières accessibles ({eligibles.length})
                </h4>
              </div>

              <ResultCard className="border-t-4 border-t-[#006666] bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-2xl shadow-slate-200/50 dark:shadow-none">
                <div className="space-y-5 py-2">
                  {eligibles.map((f: any, idx: number) => {
                    const label = f.filiere_nom || f.nom || f.filiere_id || '';
                    const score = f.score_total ?? f.score ?? 0;
                    return (
                      <div key={f.filiere_id || idx} className="relative">
                        <ScoreBar label={label} value={score} />
                        {idx === 0 && (
                          <div className="absolute -right-1 -top-2">
                            <span className="bg-emerald-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm animate-bounce">
                              TOP MATCH
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ResultCard>
            </div>
          )}

          {/* ── Filières NON ÉLIGIBLES — section repliable ── */}
          {nonEligibles.length > 0 && (
            <details className="group">
              <summary className="flex items-center gap-2 px-1 cursor-pointer list-none">
                <XCircle size={12} className="text-red-400" />
                <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">
                  Non accessibles à ton niveau ({nonEligibles.length})
                </span>
                <ChevronRight size={12} className="text-slate-400 ml-auto group-open:rotate-90 transition-transform" />
              </summary>
              <div className="mt-3 space-y-2 px-1">
                {nonEligibles.map((f: any, idx: number) => {
                  const label = f.filiere_nom || f.nom || f.filiere_id || '';
                  const score = f.score_total ?? f.score ?? 0;
                  return (
                    <div key={f.filiere_id || idx} className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-slate-400">{label}</span>
                        <span className="text-[10px] text-red-400 font-bold">{score}%</span>
                      </div>
                      {f.explication?.raison_ineligibilite && (
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                          {f.explication.raison_ineligibilite}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </details>
          )}

          {/* Rapport narratif */}
          {fitscore.rapport && (
            <div className="animate-in fade-in duration-1000 delay-300">
              <div className="flex items-center gap-2 mb-3 px-1">
                <BrainCircuit size={14} className="text-slate-400" />
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Analyse du profil</h4>
              </div>
              <ResultCard>
                <Prose content={fitscore.rapport} className="text-sm leading-relaxed" />
              </ResultCard>
            </div>
          )}

          {/* Upsell psycho */}
          <button
            onClick={() => openPanel('psycho')}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-900 text-white group hover:bg-black transition-all shadow-lg"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="p-2 bg-white/10 rounded-lg group-hover:scale-110 transition-transform">
                <BrainCircuit size={20} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-emerald-400">Précision +25%</p>
                <p className="text-xs text-slate-400">Passer le test psychométrique</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      )}
    </div>
  );
};