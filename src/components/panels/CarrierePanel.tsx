/* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client';
// import { useState, useEffect } from 'react';
// import { Rocket, Target, Briefcase, TrendingUp, Sparkles } from 'lucide-react';
// import { getCarriere, CarriereResponse } from '@/services/panelService';
// import { Spinner, ActionBtn, ResultCard, Prose, ErrorBox } from './ui';
// import { cn } from '@/lib/utils';

// const FILIERES = [
//   { id: 'ISI',   nom: "Ingénierie Systèmes Informatiques", icon: '💻', color: 'from-blue-500 to-indigo-600' },
//   { id: 'ME',    nom: "Management des Entreprises",         icon: '📊', color: 'from-emerald-500 to-teal-600' },
//   { id: 'IISIC', nom: "IA & Systèmes d'Information",        icon: '🤖', color: 'from-purple-500 to-pink-600' },
//   { id: 'IISRT', nom: "Réseaux & Télécommunications",       icon: '📡', color: 'from-cyan-500 to-blue-600' },
//   { id: 'FACG',  nom: "Finance, Audit & Contrôle",          icon: '💰', color: 'from-amber-500 to-orange-600' },
//   { id: 'MSTIC', nom: "Management Digital & TIC",           icon: '🌐', color: 'from-pink-500 to-rose-600' },
// ];

// export const CarrierePanel = () => {
//   const [loading,   setLoading]   = useState(false);
//   const [init,       setInit]      = useState<CarriereResponse | null>(null);
//   const [selected,   setSelected]  = useState<string | null>(null);
//   const [result,     setResult]    = useState<CarriereResponse | null>(null);
//   const [error,      setError]     = useState<string | null>(null);

//   useEffect(() => {
//     getCarriere().then(setInit).catch(() => {});
//   }, []);

//   const simulate = async () => {
//     if (!selected) return;
//     setLoading(true); setError(null); setResult(null);
//     try {
//       const data = await getCarriere(selected);
//       setResult(data);
//     } catch { setError('Erreur lors de la génération du scénario.'); }
//     setLoading(false);
//   };

//   const filieres = init?.filieres_disponibles?.length
//     ? FILIERES.filter(f => init.filieres_disponibles!.includes(f.id))
//     : FILIERES;

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500">
//       {/* ── Explication & Contexte ── */}
//       {init?.explication && (
//         <div className="bg-slate-50 dark:bg-white/[0.03] border border-slate-200/50 dark:border-white/[0.05] rounded-2xl p-4">
//           <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
//             "{init.explication}"
//           </p>
//           {init.annee_entree && (
//             <div className="mt-3 flex items-center gap-2">
//               <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
//               <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
//                 Projection Promotion {init.annee_entree}
//               </span>
//             </div>
//           )}
//         </div>
//       )}

//       {/* ── Grille de Sélection Magnifiée ── */}
//       <div>
//         <div className="flex justify-between items-end mb-3 px-1">
//           <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Filières disponibles</p>
//           {selected && <span className="text-[10px] font-bold text-[#006666] animate-bounce">Choix : {selected}</span>}
//         </div>
        
//         <div className="grid grid-cols-2 gap-2.5">
//           {filieres.map(f => (
//             <button
//               key={f.id}
//               onClick={() => setSelected(f.id)}
//               className={cn(
//                 'relative group p-3 rounded-2xl border-2 transition-all duration-300 overflow-hidden',
//                 selected === f.id
//                   ? 'border-[#006666] bg-white dark:bg-slate-900 shadow-lg shadow-emerald-500/10'
//                   : 'border-slate-100 dark:border-white/[0.05] bg-white/50 dark:bg-white/[0.02] hover:border-slate-200 dark:hover:border-white/[0.1]'
//               )}
//             >
//               {/* Indicateur de sélection visuel */}
//               <div className={cn(
//                 "absolute top-0 right-0 h-12 w-12 bg-gradient-to-br transition-opacity duration-500 opacity-5 blur-xl",
//                 f.color
//               )} />
              
//               <div className="relative z-10">
//                 <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
//                 <div className={cn(
//                   "text-[11px] font-black tracking-tighter uppercase",
//                   selected === f.id ? "text-[#006666]" : "text-slate-400"
//                 )}>{f.id}</div>
//                 <div className="text-[9px] font-medium text-slate-500 dark:text-slate-400 leading-tight mt-1 line-clamp-1">{f.nom}</div>
//               </div>
//             </button>
//           ))}
//         </div>
//       </div>

//       <ActionBtn 
//         onClick={simulate} 
//         disabled={!selected || loading}
//         className={cn(
//           "w-full h-12 rounded-2xl font-bold tracking-tight shadow-xl transition-all",
//           selected ? "bg-[#006666] text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
//         )}
//       >
//         {loading ? <Spinner /> : <><Rocket size={16} className="mr-2" /> Simuler ma carrière</>}
//       </ActionBtn>

//       {error && <ErrorBox message={error} />}

//       {/* ── Résultats & Données Clés ── */}
//       {!loading && result && (
//         <div className="space-y-4 animate-in slide-in-from-top-4 duration-500 pb-6">
          
//           {result.donnees_cles && (
//             <ResultCard className="border-l-4 border-l-[#006666] overflow-hidden">
//               <div className="flex items-center gap-2 mb-4">
//                 <TrendingUp size={14} className="text-[#006666]" />
//                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
//                   Perspectives : {result.filiere_nom || selected}
//                 </h4>
//               </div>
              
//               <div className="grid gap-2">
//                 {[
//                   { label: 'Salaire départ', val: result.donnees_cles.salaire_depart, icon: Briefcase },
//                   { label: 'Après 3 ans',    val: result.donnees_cles.salaire_3ans,   icon: TrendingUp },
//                   { label: 'Après 7 ans',    val: result.donnees_cles.salaire_7ans,   icon: Target },
//                   { label: 'Taux insertion', val: result.donnees_cles.taux_insertion, icon: Sparkles },
//                 ].map(({ label, val, icon: Icon }) => val && (
//                   <div key={label} className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.02]">
//                     <div className="flex items-center gap-2">
//                       <Icon size={12} className="text-slate-400" />
//                       <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">{label}</span>
//                     </div>
//                     <span className="text-[11px] font-black text-[#006666] dark:text-emerald-400">{val}</span>
//                   </div>
//                 ))}
//               </div>
//             </ResultCard>
//           )}

//           {result.scenario && (
//             <ResultCard className="relative overflow-hidden bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
//               <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-white/[0.05] pb-3">
//                 <Rocket size={14} className="text-orange-500" />
//                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Projection de Vie</h4>
//               </div>
//               <Prose content={result.scenario} className="text-sm italic" />
//             </ResultCard>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };




// 'use client';
// import { useState, useEffect } from 'react';
// import { Rocket, Target, Briefcase, TrendingUp, Sparkles, Loader2 } from 'lucide-react';
// import { getCarriere } from '@/services/panelService';
// import { ActionBtn, ResultCard, Prose, ErrorBox } from './ui';
// import { cn } from '@/lib/utils';

// // ── Couleurs par filière ─────────────────────────────────────
// const FILIERE_META: Record<string, { icon: string; color: string }> = {
//   IISI:  { icon: '💻', color: 'from-blue-500 to-indigo-600'   },
//   MGE:   { icon: '📊', color: 'from-emerald-500 to-teal-600'  },
//   MDI:   { icon: '🌍', color: 'from-cyan-500 to-blue-600'     },
//   IISIC: { icon: '🤖', color: 'from-purple-500 to-pink-600'   },
//   IISRT: { icon: '📡', color: 'from-sky-500 to-blue-600'      },
//   FACG:  { icon: '💰', color: 'from-amber-500 to-orange-600'  },
//   MRI:   { icon: '🤝', color: 'from-rose-500 to-pink-600'     },
// };

// // ── Type local pour ce panel ─────────────────────────────────
// interface FiliereInfo {
//   id:     string;
//   nom:    string;
//   niveau: string;
// }

// interface DonneesCles {
//   salaire_depart?:   string;
//   salaire_3ans?:     string;
//   salaire_7ans?:     string;
//   taux_insertion?:   string;
// }

// interface SimulationResult {
//   filiere_nom?:  string;
//   scenario?:     string;
//   donnees_cles?: DonneesCles;
//   error?:        boolean;
//   message?:      string;
// }

// export const CarrierePanel = () => {
//   const [loadingInit, setLoadingInit] = useState(true);
//   const [loading,     setLoading]     = useState(false);
//   const [filieres,    setFilieres]    = useState<FiliereInfo[]>([]);
//   const [explication, setExplication] = useState('');
//   const [anneeEntree, setAnneeEntree] = useState('');
//   const [selected,    setSelected]    = useState<string | null>(null);
//   const [result,      setResult]      = useState<SimulationResult | null>(null);
//   const [error,       setError]       = useState<string | null>(null);

//   // Charger les filières accessibles selon le niveau
//   useEffect(() => {
//     setLoadingInit(true);
//     getCarriere()
//       .then((data: any) => {
//         if (data.filieres_disponibles && Array.isArray(data.filieres_disponibles)) {
//           const noms: Record<string, string> = data.filieres_disponibles_noms || {};
//           const mapped: FiliereInfo[] = data.filieres_disponibles.map((id: string) => ({
//             id,
//             nom:    noms[id] || id,
//             niveau: ['IISIC', 'IISRT', 'FACG', 'MRI'].includes(id) ? 'BAC+5' : 'BAC+3',
//           }));
//           setFilieres(mapped);
//           setExplication(data.explication || '');
//           setAnneeEntree(data.annee_entree || '');
//         }
//       })
//       .catch(() => {})
//       .finally(() => setLoadingInit(false));
//   }, []);

//   const simulate = async () => {
//     if (!selected) return;
//     setLoading(true); setError(null); setResult(null);
//     try {
//       const data: any = await getCarriere(selected);
//       if (data.error) {
//         setError(data.message || 'Erreur lors de la simulation.');
//       } else {
//         setResult(data as SimulationResult);
//       }
//     } catch {
//       setError('Erreur lors de la génération du scénario.');
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500">

//       {/* ── Contexte niveau ── */}
//       {explication && (
//         <div className="bg-slate-50 dark:bg-white/[0.03] border border-slate-200/50 dark:border-white/[0.05] rounded-2xl p-4">
//           <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
//             "{explication}"
//           </p>
//           {anneeEntree && (
//             <div className="mt-3 flex items-center gap-2">
//               <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
//               <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
//                 Entrée en {anneeEntree}
//               </span>
//             </div>
//           )}
//         </div>
//       )}

//       {/* ── Grille filières dynamique ── */}
//       <div>
//         <div className="flex justify-between items-end mb-3 px-1">
//           <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
//             Filières accessibles
//           </p>
//           {selected && (
//             <span className="text-[10px] font-bold text-[#006666] animate-bounce">
//               Choix : {selected}
//             </span>
//           )}
//         </div>

//         {loadingInit ? (
//           <div className="flex items-center justify-center py-8 gap-3 text-slate-400">
//             <Loader2 size={18} className="animate-spin" />
//             <span className="text-xs">Chargement des filières...</span>
//           </div>
//         ) : filieres.length === 0 ? (
//           <div className="text-center py-6 text-slate-400 text-xs bg-slate-50 dark:bg-white/[0.02] rounded-2xl border border-dashed border-slate-200 dark:border-white/[0.05]">
//             Complète ton profil (niveau, BAC, moyenne) pour voir les filières disponibles.
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 gap-2.5">
//             {filieres.map(f => {
//               const meta = FILIERE_META[f.id] || { icon: '🎓', color: 'from-slate-500 to-slate-600' };
//               return (
//                 <button
//                   key={f.id}
//                   onClick={() => setSelected(f.id)}
//                   className={cn(
//                     'relative group p-3 rounded-2xl border-2 transition-all duration-300 overflow-hidden text-left',
//                     selected === f.id
//                       ? 'border-[#006666] bg-white dark:bg-slate-900 shadow-lg shadow-emerald-500/10'
//                       : 'border-slate-100 dark:border-white/[0.05] bg-white/50 dark:bg-white/[0.02] hover:border-slate-200 dark:hover:border-white/[0.1]'
//                   )}
//                 >
//                   {/* Décoration fond */}
//                   <div className={cn(
//                     "absolute top-0 right-0 h-12 w-12 bg-gradient-to-br transition-opacity duration-500 opacity-5 blur-xl",
//                     meta.color
//                   )} />
//                   <div className="relative z-10">
//                     <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
//                       {meta.icon}
//                     </div>
//                     <div className={cn(
//                       "text-[11px] font-black tracking-tighter uppercase",
//                       selected === f.id ? "text-[#006666]" : "text-slate-400"
//                     )}>
//                       {f.id}
//                     </div>
//                     <div className="text-[9px] font-medium text-slate-500 dark:text-slate-400 leading-tight mt-1 line-clamp-2">
//                       {f.nom}
//                     </div>
//                     <div className={cn(
//                       "text-[8px] font-black mt-1 px-1.5 py-0.5 rounded-full w-fit",
//                       f.niveau === 'BAC+5'
//                         ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
//                         : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
//                     )}>
//                       {f.niveau}
//                     </div>
//                   </div>
//                 </button>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* ── Bouton simuler ── */}
//       <ActionBtn
//         onClick={simulate}
//         disabled={!selected || loading || loadingInit}
//         className={cn(
//           "w-full h-12 rounded-2xl font-bold tracking-tight shadow-xl transition-all",
//           selected
//             ? "bg-[#006666] text-white"
//             : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
//         )}
//       >
//         {loading
//           ? <><Loader2 size={16} className="animate-spin mr-2" />Simulation en cours...</>
//           : <><Rocket size={16} className="mr-2" />Simuler ma carrière</>
//         }
//       </ActionBtn>

//       {error && <ErrorBox message={error} />}

//       {/* ── Résultats ── */}
//       {!loading && result && (
//         <div className="space-y-4 animate-in slide-in-from-top-4 duration-500 pb-6">

//           {result.donnees_cles && (
//             <ResultCard className="border-l-4 border-l-[#006666] overflow-hidden">
//               <div className="flex items-center gap-2 mb-4">
//                 <TrendingUp size={14} className="text-[#006666]" />
//                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
//                   Perspectives : {result.filiere_nom || selected}
//                 </h4>
//               </div>
//               <div className="grid gap-2">
//                 {[
//                   { label: 'Salaire départ', val: result.donnees_cles.salaire_depart,  icon: Briefcase  },
//                   { label: 'Après 3 ans',    val: result.donnees_cles.salaire_3ans,    icon: TrendingUp },
//                   { label: 'Après 7 ans',    val: result.donnees_cles.salaire_7ans,    icon: Target     },
//                   { label: 'Taux insertion', val: result.donnees_cles.taux_insertion,  icon: Sparkles   },
//                 ].map(({ label, val, icon: Icon }) => val && (
//                   <div key={label} className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.02]">
//                     <div className="flex items-center gap-2">
//                       <Icon size={12} className="text-slate-400" />
//                       <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">{label}</span>
//                     </div>
//                     <span className="text-[11px] font-black text-[#006666] dark:text-emerald-400">{val}</span>
//                   </div>
//                 ))}
//               </div>
//             </ResultCard>
//           )}

//           {result.scenario && (
//             <ResultCard className="relative overflow-hidden bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
//               <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-white/[0.05] pb-3">
//                 <Rocket size={14} className="text-orange-500" />
//                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
//                   Projection de Vie
//                 </h4>
//               </div>
//               <Prose content={result.scenario} className="text-sm italic" />
//             </ResultCard>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };
















// // ============================================================
// // CarrierePanel.tsx — avec i18n
// // ============================================================
// 'use client';
// import { useState, useEffect } from 'react';
// import { Rocket, Target, Briefcase, TrendingUp, Sparkles, Loader2 } from 'lucide-react';
// import { getCarriere } from '@/services/panelService';
// import { ActionBtn, ResultCard, Prose, ErrorBox } from './ui';
// import { useLang } from '@/i18n/LanguageContext';
// import { cn } from '@/lib/utils';

// const FILIERE_META: Record<string, { icon: string; color: string }> = {
//   IISI:  { icon: '💻', color: 'from-blue-500 to-indigo-600'  },
//   MGE:   { icon: '📊', color: 'from-emerald-500 to-teal-600' },
//   MDI:   { icon: '🌍', color: 'from-cyan-500 to-blue-600'    },
//   IISIC: { icon: '🤖', color: 'from-purple-500 to-pink-600'  },
//   IISRT: { icon: '📡', color: 'from-sky-500 to-blue-600'     },
//   FACG:  { icon: '💰', color: 'from-amber-500 to-orange-600' },
//   MRI:   { icon: '🤝', color: 'from-rose-500 to-pink-600'    },
// };

// interface FiliereInfo { id: string; nom: string; niveau: string; }
// interface DonneesCles { salaire_depart?: string; salaire_3ans?: string; salaire_7ans?: string; taux_insertion?: string; }
// interface SimulationResult { filiere_nom?: string; scenario?: string; donnees_cles?: DonneesCles; error?: boolean; message?: string; }

// export const CarrierePanel = () => {
//   const { t } = useLang();
//   const [loadingInit, setLoadingInit] = useState(true);
//   const [loading,     setLoading]     = useState(false);
//   const [filieres,    setFilieres]    = useState<FiliereInfo[]>([]);
//   const [explication, setExplication] = useState('');
//   const [anneeEntree, setAnneeEntree] = useState('');
//   const [selected,    setSelected]    = useState<string | null>(null);
//   const [result,      setResult]      = useState<SimulationResult | null>(null);
//   const [error,       setError]       = useState<string | null>(null);

//   useEffect(() => {
//     setLoadingInit(true);
//     getCarriere()
//       .then((data: any) => {
//         if (data.filieres_disponibles && Array.isArray(data.filieres_disponibles)) {
//           const noms: Record<string, string> = data.filieres_disponibles_noms || {};
//           const mapped: FiliereInfo[] = data.filieres_disponibles.map((id: string) => ({
//             id, nom: noms[id] || id, niveau: ['IISIC', 'IISRT', 'FACG', 'MRI'].includes(id) ? 'BAC+5' : 'BAC+3',
//           }));
//           setFilieres(mapped);
//           setExplication(data.explication || '');
//           setAnneeEntree(data.annee_entree || '');
//         }
//       })
//       .catch(() => {})
//       .finally(() => setLoadingInit(false));
//   }, []);

//   const simulate = async () => {
//     if (!selected) return;
//     setLoading(true); setError(null); setResult(null);
//     try {
//       const data: any = await getCarriere(selected);
//       if (data.error) setError(data.message || t('panels','error_connection'));
//       else setResult(data as SimulationResult);
//     } catch { setError(t('panels','error_connection')); }
//     setLoading(false);
//   };

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500">

//       {explication && (
//         <div className="bg-slate-50 dark:bg-white/[0.03] border border-slate-200/50 dark:border-white/[0.05] rounded-2xl p-4">
//           <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">"{explication}"</p>
//           {anneeEntree && (
//             <div className="mt-3 flex items-center gap-2">
//               <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
//               <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
//                 {t('carriere','context_quote')} — {anneeEntree}
//               </span>
//             </div>
//           )}
//         </div>
//       )}

//       <div>
//         <div className="flex justify-between items-end mb-3 px-1">
//           <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
//             {t('carriere','filieres_label')}
//           </p>
//           {selected && (
//             <span className="text-[10px] font-bold text-[#006666] animate-bounce">
//               {t('carriere','btn_disabled')} : {selected}
//             </span>
//           )}
//         </div>

//         {loadingInit ? (
//           <div className="flex items-center justify-center py-8 gap-3 text-slate-400">
//             <Loader2 size={18} className="animate-spin" />
//             <span className="text-xs">{t('carriere','loading_filieres')}</span>
//           </div>
//         ) : filieres.length === 0 ? (
//           <div className="text-center py-6 text-slate-400 text-xs bg-slate-50 dark:bg-white/[0.02] rounded-2xl border border-dashed border-slate-200 dark:border-white/[0.05]">
//             {t('carriere','no_filieres')}
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 gap-2.5">
//             {filieres.map(f => {
//               const meta = FILIERE_META[f.id] || { icon: '🎓', color: 'from-slate-500 to-slate-600' };
//               return (
//                 <button key={f.id} onClick={() => setSelected(f.id)}
//                   className={cn(
//                     'relative group p-3 rounded-2xl border-2 transition-all duration-300 overflow-hidden text-left',
//                     selected === f.id
//                       ? 'border-[#006666] bg-white dark:bg-slate-900 shadow-lg shadow-emerald-500/10'
//                       : 'border-slate-100 dark:border-white/[0.05] bg-white/50 dark:bg-white/[0.02] hover:border-slate-200 dark:hover:border-white/[0.1]'
//                   )}>
//                   <div className={cn("absolute top-0 right-0 h-12 w-12 bg-gradient-to-br transition-opacity duration-500 opacity-5 blur-xl", meta.color)} />
//                   <div className="relative z-10">
//                     <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">{meta.icon}</div>
//                     <div className={cn("text-[11px] font-black tracking-tighter uppercase", selected === f.id ? "text-[#006666]" : "text-slate-400")}>{f.id}</div>
//                     <div className="text-[9px] font-medium text-slate-500 dark:text-slate-400 leading-tight mt-1 line-clamp-2">{f.nom}</div>
//                     <div className={cn("text-[8px] font-black mt-1 px-1.5 py-0.5 rounded-full w-fit",
//                       f.niveau === 'BAC+5' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
//                     )}>{f.niveau}</div>
//                   </div>
//                 </button>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       <ActionBtn onClick={simulate} disabled={!selected || loading || loadingInit}
//         className={cn("w-full h-12 rounded-2xl font-bold tracking-tight shadow-xl transition-all",
//           selected ? "bg-[#006666] text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
//         )}>
//         {loading
//           ? <><Loader2 size={16} className="animate-spin mr-2" />{t('carriere','btn_loading')}</>
//           : <><Rocket size={16} className="mr-2" />{t('carriere','btn_simulate')}</>
//         }
//       </ActionBtn>

//       {error && <ErrorBox message={error} />}

//       {!loading && result && (
//         <div className="space-y-4 animate-in slide-in-from-top-4 duration-500 pb-6">
//           {result.donnees_cles && (
//             <ResultCard className="border-l-4 border-l-[#006666] overflow-hidden">
//               <div className="flex items-center gap-2 mb-4">
//                 <TrendingUp size={14} className="text-[#006666]" />
//                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
//                   {t('carriere','result_title')} : {result.filiere_nom || selected}
//                 </h4>
//               </div>
//               <div className="grid gap-2">
//                 {[
//                   { label: t('carriere','salary_start'), val: result.donnees_cles.salaire_depart, icon: Briefcase  },
//                   { label: t('carriere','salary_3'),     val: result.donnees_cles.salaire_3ans,   icon: TrendingUp },
//                   { label: t('carriere','salary_7'),     val: result.donnees_cles.salaire_7ans,   icon: Target     },
//                   { label: t('carriere','insertion'),    val: result.donnees_cles.taux_insertion,  icon: Sparkles   },
//                 ].map(({ label, val, icon: Icon }) => val && (
//                   <div key={label} className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.02]">
//                     <div className="flex items-center gap-2">
//                       <Icon size={12} className="text-slate-400" />
//                       <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">{label}</span>
//                     </div>
//                     <span className="text-[11px] font-black text-[#006666] dark:text-emerald-400">{val}</span>
//                   </div>
//                 ))}
//               </div>
//             </ResultCard>
//           )}
//           {result.scenario && (
//             <ResultCard className="relative overflow-hidden bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
//               <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-white/[0.05] pb-3">
//                 <Rocket size={14} className="text-orange-500" />
//                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('carriere','projection_title')}</h4>
//               </div>
//               <Prose content={result.scenario} className="text-sm italic" />
//             </ResultCard>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };



'use client';

import { useState, useEffect } from 'react';
import {
  Rocket,
  Target,
  Briefcase,
  TrendingUp,
  Sparkles,
  Loader2,
  BrainCircuit,
  GraduationCap,
  ChevronRight,
} from 'lucide-react';
import { getCarriere } from '@/services/panelService';
import { ActionBtn, ResultCard, Prose, ErrorBox } from './ui';
import { useLang } from '@/i18n/LanguageContext';
import { cn } from '@/lib/utils';

const FILIERE_META: Record<string, { icon: string; color: string }> = {
  IISI: { icon: '💻', color: 'from-blue-500 to-indigo-600' },
  MGE: { icon: '📊', color: 'from-emerald-500 to-teal-600' },
  MDI: { icon: '🌍', color: 'from-cyan-500 to-blue-600' },
  IISIC: { icon: '🤖', color: 'from-purple-500 to-pink-600' },
  IISRT: { icon: '📡', color: 'from-sky-500 to-blue-600' },
  FACG: { icon: '💰', color: 'from-amber-500 to-orange-600' },
  MRI: { icon: '🤝', color: 'from-rose-500 to-pink-600' },
};

interface FiliereInfo {
  id: string;
  nom: string;
  niveau: string;
}

interface DonneesCles {
  salaire_depart?: string;
  salaire_3ans?: string;
  salaire_7ans?: string;
  taux_insertion?: string;
}

interface SimulationResult {
  filiere_nom?: string;
  scenario?: string;
  donnees_cles?: DonneesCles;
  error?: boolean;
  message?: string;
}

export const CarrierePanel = () => {
  const { t } = useLang();

  const [loadingInit, setLoadingInit] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filieres, setFilieres] = useState<FiliereInfo[]>([]);
  const [explication, setExplication] = useState('');
  const [anneeEntree, setAnneeEntree] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCarriere()
      .then((data: any) => {
        if (data.filieres_disponibles && Array.isArray(data.filieres_disponibles)) {
          const noms: Record<string, string> = data.filieres_disponibles_noms || {};

          const mapped: FiliereInfo[] = data.filieres_disponibles.map((id: string) => ({
            id,
            nom: noms[id] || id,
            niveau: ['IISIC', 'IISRT', 'FACG', 'MRI'].includes(id) ? 'BAC+5' : 'BAC+3',
          }));

          setFilieres(mapped);
          setExplication(data.explication || '');
          setAnneeEntree(data.annee_entree || '');
        }
      })
      .catch(() => {})
      .finally(() => setLoadingInit(false));
  }, []);

  const simulate = async () => {
    if (!selected) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data: any = await getCarriere(selected);

      if (data.error) {
        setError(data.message || t('panels', 'error_connection'));
      } else {
        setResult(data as SimulationResult);
      }
    } catch {
      setError(t('panels', 'error_connection'));
    }

    setLoading(false);
  };

  const selectedFiliere = filieres.find((f) => f.id === selected);

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      {/* Header intelligent */}
      <div className="rounded-3xl border border-[#006666]/10 bg-gradient-to-br from-[#006666]/5 via-emerald-500/[0.04] to-blue-500/[0.05] p-4">
        <div className="mb-3 flex items-center gap-2">
          <BrainCircuit size={16} className="text-[#006666]" />
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#006666]">
            {t('carriere', 'header_badge')}
          </span>
        </div>

        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          {t('carriere', 'header_intro')}
        </p>

        {explication && (
          <div className="mt-4 rounded-2xl border border-white/50 bg-white/70 p-3 dark:border-white/[0.05] dark:bg-slate-900/40">
            <p className="text-xs italic leading-relaxed text-slate-500 dark:text-slate-400">
              “{explication}”
            </p>

            {anneeEntree && (
              <div className="mt-3 flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                  {t('carriere', 'context_quote')} — {anneeEntree}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bloc sélection */}
      <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
        <div className="mb-4 flex items-end justify-between px-1">
          <div>
            <p className="mb-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
              <GraduationCap size={12} />
              {t('carriere', 'filieres_label')}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('carriere', 'filieres_hint')}
            </p>
          </div>

          {selected && (
            <span className="rounded-full bg-[#006666]/10 px-2.5 py-1 text-[10px] font-black text-[#006666]">
              {selected}
            </span>
          )}
        </div>

        {loadingInit ? (
          <div className="flex items-center justify-center gap-3 py-10 text-slate-400">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-xs font-medium">{t('carriere', 'loading_filieres')}</span>
          </div>
        ) : filieres.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-6 text-center text-xs text-slate-400 dark:border-white/[0.05] dark:bg-white/[0.02]">
            {t('carriere', 'no_filieres')}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filieres.map((f) => {
              const meta = FILIERE_META[f.id] || {
                icon: '🎓',
                color: 'from-slate-500 to-slate-600',
              };

              const isSelected = selected === f.id;

              return (
                <button
                  key={f.id}
                  onClick={() => setSelected(f.id)}
                  className={cn(
                    'group relative overflow-hidden rounded-2xl border-2 p-3 text-left transition-all duration-300',
                    isSelected
                      ? 'border-[#006666] bg-white shadow-lg shadow-emerald-500/10 dark:bg-slate-900'
                      : 'border-slate-100 bg-white/50 hover:border-slate-200 dark:border-white/[0.05] dark:bg-white/[0.02] dark:hover:border-white/[0.1]'
                  )}
                >
                  <div
                    className={cn(
                      'absolute right-0 top-0 h-14 w-14 bg-gradient-to-br opacity-10 blur-xl transition-opacity duration-500',
                      meta.color
                    )}
                  />

                  <div className="relative z-10">
                    <div className="mb-2 text-2xl transition-transform duration-300 group-hover:scale-110">
                      {meta.icon}
                    </div>

                    <div
                      className={cn(
                        'text-[11px] font-black uppercase tracking-tight',
                        isSelected ? 'text-[#006666]' : 'text-slate-500 dark:text-slate-300'
                      )}
                    >
                      {f.id}
                    </div>

                    <div className="mt-1 line-clamp-2 text-[10px] font-medium leading-tight text-slate-500 dark:text-slate-400">
                      {f.nom}
                    </div>

                    <div
                      className={cn(
                        'mt-2 w-fit rounded-full px-1.5 py-0.5 text-[8px] font-black',
                        f.niveau === 'BAC+5'
                          ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                          : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                      )}
                    >
                      {f.niveau}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* CTA */}
      <button
        onClick={simulate}
        disabled={!selected || loading || loadingInit}
        className={cn(
          'group w-full rounded-2xl py-4 text-sm font-black shadow-xl transition-all active:scale-[0.98]',
          selected && !loadingInit
            ? 'bg-[#006666] text-white hover:bg-[#005555]'
            : 'cursor-not-allowed bg-slate-100 text-slate-400 shadow-none dark:bg-slate-800'
        )}
      >
        <span className="flex items-center justify-center gap-2">
          {loading ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              {t('carriere', 'btn_loading')}
            </>
          ) : (
            <>
              <Rocket size={17} className="transition-transform group-hover:scale-110" />
              {selected
                ? t('carriere', 'btn_simulate')
                : t('carriere', 'btn_disabled')}
            </>
          )}
        </span>
      </button>

      {error && <ErrorBox message={error} />}

      {/* Résultats */}
      {!loading && result && (
        <div className="space-y-4 animate-in slide-in-from-top-4 duration-500 pb-6">
          {selectedFiliere && (
            <div className="rounded-2xl border border-[#006666]/10 bg-[#006666]/5 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#006666]">
                    {t('carriere', 'selected_program')}
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-100">
                    {selectedFiliere.nom}
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-[10px] font-black text-[#006666] dark:bg-slate-900">
                  <ChevronRight size={12} />
                  {selectedFiliere.id}
                </div>
              </div>
            </div>
          )}

          {result.donnees_cles && (
            <ResultCard className="overflow-hidden border-l-4 border-l-[#006666]">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp size={14} className="text-[#006666]" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  {t('carriere', 'result_title')} : {result.filiere_nom || selected}
                </h4>
              </div>

              <div className="grid gap-2">
                {[
                  {
                    label: t('carriere', 'salary_start'),
                    val: result.donnees_cles.salaire_depart,
                    icon: Briefcase,
                  },
                  {
                    label: t('carriere', 'salary_3'),
                    val: result.donnees_cles.salaire_3ans,
                    icon: TrendingUp,
                  },
                  {
                    label: t('carriere', 'salary_7'),
                    val: result.donnees_cles.salaire_7ans,
                    icon: Target,
                  },
                  {
                    label: t('carriere', 'insertion'),
                    val: result.donnees_cles.taux_insertion,
                    icon: Sparkles,
                  },
                ].map(
                  ({ label, val, icon: Icon }) =>
                    val && (
                      <div
                        key={label}
                        className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-white/[0.02] dark:bg-white/[0.03]"
                      >
                        <div className="flex items-center gap-2">
                          <Icon size={12} className="text-slate-400" />
                          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                            {label}
                          </span>
                        </div>

                        <span className="text-[11px] font-black text-[#006666] dark:text-emerald-400">
                          {val}
                        </span>
                      </div>
                    )
                )}
              </div>
            </ResultCard>
          )}

          {result.scenario && (
            <ResultCard className="relative overflow-hidden bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
              <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-white/[0.05]">
                <Rocket size={14} className="text-orange-500" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  {t('carriere', 'projection_title')}
                </h4>
              </div>

              <Prose content={result.scenario} className="text-sm italic leading-relaxed" />
            </ResultCard>
          )}
        </div>
      )}
    </div>
  );
};