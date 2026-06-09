/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client';
// import { X, BarChart3, DoorOpen, Rocket, Scale, Brain, Medal, UserCheck, UserCircle, Loader2, ChevronRight, AlertCircle } from 'lucide-react';
// import { useState, useEffect, useCallback } from 'react';
// import { usePanelStore, PanelType } from '@/store/panelStore';
// import { useSessionStore } from '@/store/sessionStore';
// import { cn } from '@/lib/utils';
// import ReactMarkdown from 'react-markdown';
// import * as api from '@/services/panelService';

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// const PANEL_META: Record<NonNullable<PanelType>, { label: string; icon: typeof BarChart3; color: string; bg: string }> = {
//   profil:    { label: 'Mon Profil',         icon: UserCircle,  color: 'text-emerald-500', bg: 'from-emerald-500/10 to-emerald-500/5' },
//   fitscore:  { label: 'FitScore IA',         icon: BarChart3,   color: 'text-orange-500',  bg: 'from-orange-500/10 to-orange-500/5'  },
//   admission: { label: 'Simulation Admission',icon: DoorOpen,    color: 'text-blue-500',    bg: 'from-blue-500/10 to-blue-500/5'     },
//   carriere:  { label: 'Simulation Carrière', icon: Rocket,      color: 'text-purple-500',  bg: 'from-purple-500/10 to-purple-500/5' },
//   comparer:  { label: 'Comparer Filières',   icon: Scale,       color: 'text-cyan-500',    bg: 'from-cyan-500/10 to-cyan-500/5'     },
//   psycho:    { label: 'Test Psychométrique', icon: Brain,       color: 'text-pink-500',    bg: 'from-pink-500/10 to-pink-500/5'     },
//   coach:     { label: 'Coach Académique',    icon: Medal,       color: 'text-yellow-500',  bg: 'from-yellow-500/10 to-yellow-500/5' },
//   peermatch: { label: 'Peer Match',          icon: UserCheck,   color: 'text-emerald-500', bg: 'from-emerald-500/10 to-emerald-500/5'},
// };

// const FILIERES_PAIRS = [
//   ['ISI', 'ME'], ['ISI', 'IISIC'], ['ISI', 'IISRT'],
//   ['ME', 'FACG'], ['ME', 'MSTIC'], ['IISIC', 'IISRT'],
//   ['FACG', 'MSTIC'],
// ];

// // ─── Composant Rapport Markdown ───────────────────────────────────────────────

// const RapportMarkdown = ({ content }: { content: string }) => (
//   <div className="prose prose-sm max-w-none dark:prose-invert
//     prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white
//     prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed
//     prose-strong:text-slate-800 dark:prose-strong:text-slate-100
//     prose-ul:text-slate-600 dark:prose-ul:text-slate-300
//     prose-li:marker:text-[#006666]">
//     <ReactMarkdown>{content}</ReactMarkdown>
//   </div>
// );

// // ─── Composant Erreur Profil Incomplet ────────────────────────────────────────

// const ProfilIncompletMsg = ({ message }: { message: string }) => (
//   <div className="flex flex-col items-center text-center gap-4 py-10 px-4">
//     <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
//       <AlertCircle size={28} className="text-amber-500" />
//     </div>
//     <div>
//       <p className="font-bold text-slate-800 dark:text-white mb-1">Profil incomplet</p>
//       <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>
//     </div>
//     <p className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2">
//       💬 Parle d&apos;abord à SAMI dans le chat pour renseigner ton profil.
//     </p>
//   </div>
// );

// // ─── Panel : Profil ───────────────────────────────────────────────────────────

// const ProfilPanel = () => {
//   const { profil } = useSessionStore();

//   if (!profil?.informations_personnelles?.prenom && !profil?.parcours_academique?.type_bac) {
//     return <ProfilIncompletMsg message="Aucune information de profil disponible pour l'instant." />;
//   }

//   const infos   = profil?.informations_personnelles ?? {};
//   const parcours = profil?.parcours_academique ?? {};
//   const prefs   = profil?.preferences ?? {};
//   const psycho  = profil?.profil_psychometrique;

//   const rows = [
//     { label: 'Prénom',   value: infos.prenom },
//     { label: 'Pays',     value: infos.pays },
//     { label: 'Ville',    value: infos.ville },
//     { label: 'BAC',      value: parcours.label_bac || parcours.type_bac },
//     { label: 'Moyenne',  value: parcours.moyenne_generale ? `${parcours.moyenne_generale}/20` : null },
//     { label: 'Mention',  value: parcours.mention },
//     { label: 'Niveau',   value: parcours.niveau_actuel },
//     { label: 'Diplôme',  value: parcours.diplome_actuel },
//     { label: 'Intérêts', value: prefs.centres_interet?.join(', ') },
//     { label: 'Ambition', value: prefs.ambition_professionnelle },
//   ].filter(r => r.value);

//   return (
//     <div className="space-y-4">
//       <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
//         {rows.map(({ label, value }) => (
//           <div key={label} className="flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
//             <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
//             <span className="text-sm font-medium text-slate-800 dark:text-slate-100 text-right max-w-[60%]">{String(value)}</span>
//           </div>
//         ))}
//       </div>

//       {psycho?.scores && (
//         <div className="rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
//           <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50">
//             <p className="text-xs font-black uppercase tracking-widest text-slate-500">Profil Psychométrique</p>
//           </div>
//           <div className="p-4 space-y-3 bg-white dark:bg-slate-900">
//             {Object.entries(psycho.scores as Record<string, number>).map(([dim, score]) => (
//               <div key={dim}>
//                 <div className="flex justify-between mb-1">
//                   <span className="text-xs capitalize text-slate-500">{dim.replace('_', ' ')}</span>
//                   <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{score}%</span>
//                 </div>
//                 <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
//                   <div
//                     className="h-full bg-gradient-to-r from-[#006666] to-emerald-400 rounded-full transition-all duration-700"
//                     style={{ width: `${score}%` }}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       <div className={cn(
//         "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold",
//         profil?.statut_profil === 'complet'
//           ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
//           : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
//       )}>
//         <span className={cn("w-2 h-2 rounded-full", profil?.statut_profil === 'complet' ? 'bg-emerald-500' : 'bg-amber-500')} />
//         Profil {profil?.statut_profil ?? 'incomplet'}
//       </div>
//     </div>
//   );
// };

// // ─── Panel : FitScore ─────────────────────────────────────────────────────────

// const FitscorePanel = () => {
//   const [state, setState] = useState<{ loading: boolean; rapport?: string; classement?: api.FitscoreResponse['classement']; error?: string }>({ loading: false });

//   const load = async () => {
//     setState({ loading: true });
//     const data = await api.getFitscore();
//     if (data.error || data.message) setState({ loading: false, error: data.message || 'Erreur inconnue' });
//     else setState({ loading: false, rapport: data.rapport, classement: data.classement });
//   };

//   if (state.loading) return <Loader />;
//   if (state.error)   return <ProfilIncompletMsg message={state.error} />;

//   if (!state.rapport) return (
//     <div className="flex flex-col items-center gap-6 py-8 px-2">
//       <div className="text-center">
//         <p className="font-bold text-slate-800 dark:text-white mb-2">Calculer ton FitScore</p>
//         <p className="text-sm text-slate-500">Découvre ta compatibilité avec chaque filière SUPMTI grâce à l'IA.</p>
//       </div>
//       <button onClick={load} className="btn-primary">
//         <BarChart3 size={16} /> Calculer mon FitScore
//       </button>
//     </div>
//   );

//   return (
//     <div className="space-y-5">
//       {state.classement && (
//         <div className="space-y-2">
//           {state.classement.map((item, i) => (
//             <div key={item.filiere_id} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
//               <span className={cn("text-lg font-black w-6 text-center", i === 0 ? 'text-yellow-500' : i === 1 ? 'text-slate-400' : 'text-amber-600')}>
//                 {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
//               </span>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{item.filiere_nom}</p>
//                 <div className="mt-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
//                   <div className="h-full bg-gradient-to-r from-[#006666] to-emerald-400 rounded-full transition-all duration-700" style={{ width: `${item.score_total}%` }} />
//                 </div>
//               </div>
//               <span className="text-sm font-black text-[#006666] dark:text-emerald-400 shrink-0">{item.score_total}%</span>
//             </div>
//           ))}
//         </div>
//       )}
//       <RapportMarkdown content={state.rapport} />
//     </div>
//   );
// };

// // ─── Panel : Admission ────────────────────────────────────────────────────────

// const AdmissionPanel = () => {
//   const [state, setState] = useState<{ loading: boolean; rapport?: string; error?: string }>({ loading: false });

//   const load = async () => {
//     setState({ loading: true });
//     const data = await api.getAdmission();
//     if (data.error || data.message) setState({ loading: false, error: data.message });
//     else setState({ loading: false, rapport: data.rapport });
//   };

//   if (state.loading) return <Loader />;
//   if (state.error)   return <ProfilIncompletMsg message={state.error!} />;

//   if (!state.rapport) return (
//     <div className="flex flex-col items-center gap-6 py-8 px-2">
//       <p className="text-center text-sm text-slate-500">Simule tes chances d'admission dans chaque filière de SUPMTI.</p>
//       <button onClick={load} className="btn-primary"><DoorOpen size={16} /> Simuler mon admission</button>
//     </div>
//   );

//   return <RapportMarkdown content={state.rapport} />;
// };

// // ─── Panel : Carrière ─────────────────────────────────────────────────────────

// const CarrierePanel = () => {
//   const [filieres, setFilieres] = useState<string[]>([]);
//   const [selected, setSelected] = useState('');
//   const [state, setState] = useState<{ loading: boolean; scenario?: string; donnees?: api.CarriereResponse['donnees_cles']; error?: string }>({ loading: false });

//   useEffect(() => {
//     api.getCarriere().then(d => {
//       if (d.filieres_disponibles) setFilieres(d.filieres_disponibles);
//     });
//   }, []);

//   const load = async () => {
//     if (!selected) return;
//     setState({ loading: true });
//     const data = await api.getCarriere(selected);
//     if (data.error) setState({ loading: false, error: data.message });
//     else setState({ loading: false, scenario: data.scenario, donnees: data.donnees_cles });
//   };

//   if (state.loading) return <Loader />;

//   return (
//     <div className="space-y-4">
//       {!state.scenario ? (
//         <>
//           <p className="text-sm text-slate-500">Sélectionne une filière pour simuler ta carrière professionnelle.</p>
//           <div className="grid grid-cols-2 gap-2">
//             {filieres.map(f => (
//               <button key={f} onClick={() => setSelected(f)} className={cn("p-3 rounded-xl border-2 text-sm font-bold transition-all", selected === f ? 'border-[#006666] bg-[#006666]/5 text-[#006666]' : 'border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300')}>
//                 {f}
//               </button>
//             ))}
//           </div>
//           {selected && <button onClick={load} className="btn-primary w-full"><Rocket size={16} /> Simuler la carrière {selected}</button>}
//           {state.error && <ProfilIncompletMsg message={state.error} />}
//         </>
//       ) : (
//         <div className="space-y-4">
//           {state.donnees && (
//             <div className="grid grid-cols-2 gap-2">
//               {[
//                 { label: 'Départ',       value: state.donnees.salaire_depart },
//                 { label: '3 ans',        value: state.donnees.salaire_3ans },
//                 { label: '7 ans',        value: state.donnees.salaire_7ans },
//                 { label: 'Insertion',    value: state.donnees.taux_insertion },
//               ].filter(i => i.value).map(({ label, value }) => (
//                 <div key={label} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-center">
//                   <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">{label}</p>
//                   <p className="text-xs font-black text-slate-800 dark:text-slate-100">{value}</p>
//                 </div>
//               ))}
//             </div>
//           )}
//           <RapportMarkdown content={state.scenario} />
//           <button onClick={() => { setState({ loading: false }); setSelected(''); }} className="text-xs text-slate-400 hover:text-slate-600 underline">← Choisir une autre filière</button>
//         </div>
//       )}
//     </div>
//   );
// };

// // ─── Panel : Comparer ─────────────────────────────────────────────────────────

// const ComparerPanel = () => {
//   const [pair, setPair] = useState<[string, string] | null>(null);
//   const [state, setState] = useState<{ loading: boolean; comparaison?: string; recommandation?: string; error?: string }>({ loading: false });

//   const load = async (f1: string, f2: string) => {
//     setPair([f1, f2]);
//     setState({ loading: true });
//     const data = await api.getComparer(f1, f2);
//     if (data.error) setState({ loading: false, error: data.message });
//     else setState({ loading: false, comparaison: data.comparaison, recommandation: data.recommandation });
//   };

//   if (state.loading) return <Loader />;

//   return (
//     <div className="space-y-3">
//       {!state.comparaison ? (
//         <>
//           <p className="text-sm text-slate-500">Clique sur une paire de filières à comparer.</p>
//           <div className="space-y-2">
//             {FILIERES_PAIRS.map(([f1, f2]) => (
//               <button key={`${f1}-${f2}`} onClick={() => load(f1, f2)} className="w-full flex items-center justify-between p-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 hover:border-cyan-300 dark:hover:border-cyan-700 transition-all group">
//                 <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{f1}</span>
//                 <Scale size={14} className="text-slate-300 group-hover:text-cyan-500 transition-colors" />
//                 <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{f2}</span>
//               </button>
//             ))}
//           </div>
//           {state.error && <ProfilIncompletMsg message={state.error} />}
//         </>
//       ) : (
//         <div className="space-y-4">
//           {pair && (
//             <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-cyan-50 dark:bg-cyan-900/10 border border-cyan-100 dark:border-cyan-900/30">
//               <span className="font-black text-cyan-700 dark:text-cyan-400">{pair[0]}</span>
//               <Scale size={16} className="text-cyan-400" />
//               <span className="font-black text-cyan-700 dark:text-cyan-400">{pair[1]}</span>
//             </div>
//           )}
//           <RapportMarkdown content={state.comparaison} />
//           {state.recommandation && (
//             <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
//               <p className="text-xs font-black uppercase tracking-widest text-[#006666] mb-2">Recommandation IA</p>
//               <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{state.recommandation}</p>
//             </div>
//           )}
//           <button onClick={() => { setState({ loading: false }); setPair(null); }} className="text-xs text-slate-400 hover:text-slate-600 underline">← Choisir une autre paire</button>
//         </div>
//       )}
//     </div>
//   );
// };

// // ─── Panel : Psycho ───────────────────────────────────────────────────────────

// const PsychoPanel = () => {
//   const [phase, setPhase] = useState<'idle' | 'test' | 'done'>('idle');
//   const [question, setQuestion] = useState('');
//   const [progress, setProgress] = useState({ actuelle: 0, total: 10 });
//   const [answer, setAnswer] = useState('');
//   const [rapport, setRapport] = useState('');
//   const [loading, setLoading] = useState(false);

//   const start = async () => {
//     setLoading(true);
//     const data = await api.startPsycho();
//     setQuestion(data.message);
//     setProgress({ actuelle: data.question_actuelle, total: data.total_questions });
//     setPhase('test');
//     setLoading(false);
//   };

//   const answer_submit = async () => {
//     if (!answer.trim()) return;
//     setLoading(true);
//     const data = await api.answerPsycho(answer);
//     setAnswer('');
//     if (data.complete && data.rapport) {
//       setRapport(data.rapport);
//       setPhase('done');
//     } else if (data.message) {
//       setQuestion(data.message);
//       setProgress({ actuelle: data.question_actuelle ?? progress.actuelle + 1, total: data.total_questions ?? 10 });
//     }
//     setLoading(false);
//   };

//   if (loading) return <Loader />;

//   if (phase === 'idle') return (
//     <div className="flex flex-col items-center gap-6 py-8 text-center px-2">
//       <div className="w-14 h-14 rounded-2xl bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center text-3xl">🧠</div>
//       <div>
//         <p className="font-bold text-slate-800 dark:text-white mb-2">Test Psychométrique</p>
//         <p className="text-sm text-slate-500">10 questions pour découvrir ton profil académique et affiner ton orientation.</p>
//       </div>
//       <button onClick={start} className="btn-primary"><Brain size={16} /> Commencer le test</button>
//     </div>
//   );

//   if (phase === 'done') return (
//     <div className="space-y-4">
//       <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 text-center">
//         <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">✅ Test terminé !</p>
//       </div>
//       <RapportMarkdown content={rapport} />
//     </div>
//   );

//   return (
//     <div className="space-y-4">
//       <div className="space-y-1">
//         <div className="flex justify-between text-xs text-slate-400 mb-1">
//           <span>Question {progress.actuelle}/{progress.total}</span>
//           <span>{Math.round((progress.actuelle / progress.total) * 100)}%</span>
//         </div>
//         <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
//           <div className="h-full bg-gradient-to-r from-pink-500 to-pink-400 rounded-full transition-all duration-500" style={{ width: `${(progress.actuelle / progress.total) * 100}%` }} />
//         </div>
//       </div>

//       <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
//         <RapportMarkdown content={question} />
//       </div>

//       <textarea
//         value={answer}
//         onChange={e => setAnswer(e.target.value)}
//         placeholder="Ta réponse..."
//         rows={3}
//         className="w-full p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 resize-none outline-none focus:border-pink-400 transition-colors"
//         onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); answer_submit(); } }}
//       />
//       <button onClick={answer_submit} disabled={!answer.trim()} className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed">
//         Répondre <ChevronRight size={16} />
//       </button>
//     </div>
//   );
// };

// // ─── Panel : Coach ────────────────────────────────────────────────────────────

// const CoachPanel = () => {
//   const [state, setState] = useState<{ loading: boolean; rapport?: string; error?: string }>({ loading: false });

//   const load = async () => {
//     setState({ loading: true });
//     const data = await api.getCoach();
//     if (data.error || data.message) setState({ loading: false, error: data.message });
//     else setState({ loading: false, rapport: data.rapport });
//   };

//   if (state.loading) return <Loader />;
//   if (state.error)   return <ProfilIncompletMsg message={state.error!} />;

//   if (!state.rapport) return (
//     <div className="flex flex-col items-center gap-6 py-8 px-2 text-center">
//       <p className="text-sm text-slate-500">Reçois un rapport de suivi personnalisé avec des conseils concrets pour progresser.</p>
//       <button onClick={load} className="btn-primary"><Medal size={16} /> Générer mon rapport coach</button>
//     </div>
//   );

//   return <RapportMarkdown content={state.rapport} />;
// };

// // ─── Panel : Peer Match ───────────────────────────────────────────────────────

// const PeerMatchPanel = () => (
//   <div className="flex flex-col items-center gap-5 py-8 text-center px-2">
//     <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-3xl">👥</div>
//     <div>
//       <p className="font-bold text-slate-800 dark:text-white mb-2">Peer Match</p>
//       <p className="text-sm text-slate-500 leading-relaxed">
//         Tu hésites encore ? Échange directement avec un(e) étudiant(e) SUPMTI qui est passé par là.
//       </p>
//     </div>
//     <div className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-left space-y-3">
//       <p className="text-xs font-black uppercase tracking-widest text-slate-400">Comment ça marche</p>
//       {['Dis à SAMI ta filière d\'hésitation', 'Un ambassadeur étudiant te sera suggéré', 'Contacte-le directement via WhatsApp ou Email'].map((step, i) => (
//         <div key={i} className="flex items-start gap-3">
//           <span className="w-5 h-5 rounded-full bg-[#006666]/10 text-[#006666] text-xs font-black flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
//           <p className="text-sm text-slate-600 dark:text-slate-300">{step}</p>
//         </div>
//       ))}
//     </div>
//     <p className="text-xs text-slate-400 italic">Utilise le chat pour déclencher le Peer Match automatiquement.</p>
//   </div>
// );

// // ─── Loader ───────────────────────────────────────────────────────────────────

// const Loader = () => (
//   <div className="flex flex-col items-center justify-center gap-3 py-16">
//     <Loader2 size={28} className="text-[#006666] animate-spin" />
//     <p className="text-sm text-slate-400">Analyse en cours...</p>
//   </div>
// );

// // ─── Panel Container + Routing ────────────────────────────────────────────────

// const PANEL_COMPONENTS: Record<NonNullable<PanelType>, React.FC> = {
//   profil:    ProfilPanel,
//   fitscore:  FitscorePanel,
//   admission: AdmissionPanel,
//   carriere:  CarrierePanel,
//   comparer:  ComparerPanel,
//   psycho:    PsychoPanel,
//   coach:     CoachPanel,
//   peermatch: PeerMatchPanel,
// };

// export const PanelRenderer = () => {
//   const { activePanel, closePanel } = usePanelStore();

//   if (!activePanel) return null;

//   const meta = PANEL_META[activePanel];
//   const Icon = meta.icon;
//   const PanelContent = PANEL_COMPONENTS[activePanel];

//   return (
//     <>
//       {/* Overlay */}
//       <div
//         className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40 animate-in fade-in duration-200"
//         onClick={closePanel}
//       />

//       {/* Panel Drawer */}
//       <aside className={cn(
//         "fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm flex flex-col",
//         "bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl",
//         "border-l border-slate-200 dark:border-slate-800 shadow-2xl",
//         "animate-in slide-in-from-right-8 duration-300"
//       )}>

//         {/* Header */}
//         <div className={cn("flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r", meta.bg)}>
//           <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", 'bg-white dark:bg-slate-900 shadow-sm')}>
//             <Icon size={18} className={meta.color} />
//           </div>
//           <div className="flex-1">
//             <h2 className="font-black text-slate-900 dark:text-white text-sm">{meta.label}</h2>
//             <p className="text-[10px] text-slate-400 uppercase tracking-widest">SUPMTI · IA</p>
//           </div>
//           <button
//             onClick={closePanel}
//             className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
//           >
//             <X size={16} />
//           </button>
//         </div>

//         {/* Scrollable Content */}
//         <div className="flex-1 overflow-y-auto p-5">
//           <PanelContent />
//         </div>
//       </aside>
//     </>
//   );
// };





























'use client';
import { X, BarChart3, DoorOpen, Rocket, Scale, Brain, Medal, UserCheck, UserCircle, Loader2, ChevronRight, AlertCircle } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { usePanelStore, PanelType } from '@/store/panelStore';
import { useSessionStore } from '@/store/sessionStore';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import * as api from '@/services/panelService';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PANEL_META: Record<NonNullable<PanelType>, { label: string; icon: typeof BarChart3; color: string; bg: string }> = {
  profil:    { label: 'Mon Profil',          icon: UserCircle, color: 'text-emerald-500', bg: 'from-emerald-500/10 to-emerald-500/5' },
  fitscore:  { label: 'FitScore IA',          icon: BarChart3,  color: 'text-orange-500',  bg: 'from-orange-500/10 to-orange-500/5'  },
  admission: { label: 'Simulation Admission', icon: DoorOpen,   color: 'text-blue-500',    bg: 'from-blue-500/10 to-blue-500/5'     },
  carriere:  { label: 'Simulation Carrière',  icon: Rocket,     color: 'text-purple-500',  bg: 'from-purple-500/10 to-purple-500/5' },
  comparer:  { label: 'Comparer Filières',    icon: Scale,      color: 'text-cyan-500',    bg: 'from-cyan-500/10 to-cyan-500/5'     },
  psycho:    { label: 'Test Psychométrique',  icon: Brain,      color: 'text-pink-500',    bg: 'from-pink-500/10 to-pink-500/5'     },
  coach:     { label: 'Coach Académique',     icon: Medal,      color: 'text-yellow-500',  bg: 'from-yellow-500/10 to-yellow-500/5' },
  peermatch: { label: 'Peer Match',           icon: UserCheck,  color: 'text-emerald-500', bg: 'from-emerald-500/10 to-emerald-500/5'},
};

const FILIERES_PAIRS = [
  ['ISI', 'ME'], ['ISI', 'IISIC'], ['ISI', 'IISRT'],
  ['ME', 'FACG'], ['ME', 'MSTIC'], ['IISIC', 'IISRT'],
  ['FACG', 'MSTIC'],
];

// ─── Composant Rapport Markdown ───────────────────────────────────────────────

const RapportMarkdown = ({ content }: { content: string }) => (
  <div className="prose prose-sm max-w-none dark:prose-invert
    prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white
    prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed
    prose-strong:text-slate-800 dark:prose-strong:text-slate-100
    prose-ul:text-slate-600 dark:prose-ul:text-slate-300
    prose-li:marker:text-[#006666]">
    <ReactMarkdown>{content}</ReactMarkdown>
  </div>
);

// ─── Composant Erreur Profil Incomplet ────────────────────────────────────────

const ProfilIncompletMsg = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center text-center gap-4 py-10 px-4">
    <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
      <AlertCircle size={28} className="text-amber-500" />
    </div>
    <div>
      <p className="font-bold text-slate-800 dark:text-white mb-1">Profil incomplet</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>
    </div>
    <p className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2">
      💬 Parle d&apos;abord à SAMI dans le chat pour renseigner ton profil.
    </p>
  </div>
);

// ─── Panel : Profil ───────────────────────────────────────────────────────────

const ProfilPanel = () => {
  const { profil } = useSessionStore();

  if (!profil?.informations_personnelles?.prenom && !profil?.parcours_academique?.type_bac) {
    return <ProfilIncompletMsg message="Aucune information de profil disponible pour l'instant." />;
  }

  const infos    = profil?.informations_personnelles ?? {};
  const parcours = profil?.parcours_academique ?? {};
  const prefs    = profil?.preferences ?? {};

  // ── FIX : cast explicite en Record<string, number> ──────────────
  const psychoScores = profil?.profil_psychometrique?.scores as Record<string, number> | undefined;

  const rows = [
    { label: 'Prénom',   value: infos.prenom },
    { label: 'Pays',     value: infos.pays },
    { label: 'Ville',    value: infos.ville },
    { label: 'BAC',      value: parcours.label_bac || parcours.type_bac },
    { label: 'Moyenne',  value: parcours.moyenne_generale ? `${parcours.moyenne_generale}/20` : null },
    { label: 'Mention',  value: parcours.mention },
    { label: 'Niveau',   value: parcours.niveau_actuel },
    { label: 'Diplôme',  value: parcours.diplome_actuel },
    { label: 'Intérêts', value: prefs.centres_interet?.join(', ') },
    { label: 'Ambition', value: prefs.ambition_professionnelle },
  ].filter((r): r is { label: string; value: string } => !!r.value);

  return (
    <div className="space-y-4">
      <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
            <span className="text-sm font-medium text-slate-800 dark:text-slate-100 text-right max-w-[60%]">{value}</span>
          </div>
        ))}
      </div>

      {/* ── FIX : utilise psychoScores casté ─────────────────────── */}
      {psychoScores && Object.keys(psychoScores).length > 0 && (
        <div className="rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50">
            <p className="text-xs font-black uppercase tracking-widest text-slate-500">Profil Psychométrique</p>
          </div>
          <div className="p-4 space-y-3 bg-white dark:bg-slate-900">
            {Object.entries(psychoScores).map(([dim, score]) => (
              <div key={dim}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs capitalize text-slate-500">{dim.replace('_', ' ')}</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{score}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#006666] to-emerald-400 rounded-full transition-all duration-700"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold",
        profil?.statut_profil === 'complet'
          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
          : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
      )}>
        <span className={cn("w-2 h-2 rounded-full", profil?.statut_profil === 'complet' ? 'bg-emerald-500' : 'bg-amber-500')} />
        Profil {profil?.statut_profil ?? 'incomplet'}
      </div>
    </div>
  );
};

// ─── Panel : FitScore ─────────────────────────────────────────────────────────

const FitscorePanel = () => {
  const [state, setState] = useState<{ loading: boolean; rapport?: string; classement?: api.FitscoreResponse['classement']; error?: string }>({ loading: false });

  const load = async () => {
    setState({ loading: true });
    const data = await api.getFitscore();
    if (data.error || data.message) setState({ loading: false, error: data.message || 'Erreur inconnue' });
    else setState({ loading: false, rapport: data.rapport, classement: data.classement });
  };

  if (state.loading) return <Loader />;
  if (state.error)   return <ProfilIncompletMsg message={state.error} />;

  if (!state.rapport) return (
    <div className="flex flex-col items-center gap-6 py-8 px-2">
      <div className="text-center">
        <p className="font-bold text-slate-800 dark:text-white mb-2">Calculer ton FitScore</p>
        <p className="text-sm text-slate-500">Découvre ta compatibilité avec chaque filière SUPMTI grâce à l'IA.</p>
      </div>
      <button onClick={load} className="btn-primary">
        <BarChart3 size={16} /> Calculer mon FitScore
      </button>
    </div>
  );

  return (
    <div className="space-y-5">
      {state.classement && (
        <div className="space-y-2">
          {state.classement.map((item, i) => (
            <div key={item.filiere_id} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <span className={cn("text-lg font-black w-6 text-center", i === 0 ? 'text-yellow-500' : i === 1 ? 'text-slate-400' : 'text-amber-600')}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{item.filiere_nom}</p>
                <div className="mt-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#006666] to-emerald-400 rounded-full transition-all duration-700" style={{ width: `${item.score_total}%` }} />
                </div>
              </div>
              <span className="text-sm font-black text-[#006666] dark:text-emerald-400 shrink-0">{item.score_total}%</span>
            </div>
          ))}
        </div>
      )}
      <RapportMarkdown content={state.rapport} />
    </div>
  );
};

// ─── Panel : Admission ────────────────────────────────────────────────────────

const AdmissionPanel = () => {
  const [state, setState] = useState<{ loading: boolean; rapport?: string; error?: string }>({ loading: false });

  const load = async () => {
    setState({ loading: true });
    const data = await api.getAdmission();
    if (data.error || data.message) setState({ loading: false, error: data.message });
    else setState({ loading: false, rapport: typeof data.rapport === 'string' ? data.rapport : JSON.stringify(data.rapport) });
  };

  if (state.loading) return <Loader />;
  if (state.error)   return <ProfilIncompletMsg message={state.error!} />;

  if (!state.rapport) return (
    <div className="flex flex-col items-center gap-6 py-8 px-2">
      <p className="text-center text-sm text-slate-500">Simule tes chances d'admission dans chaque filière de SUPMTI.</p>
      <button onClick={load} className="btn-primary"><DoorOpen size={16} /> Simuler mon admission</button>
    </div>
  );

  return <RapportMarkdown content={state.rapport} />;
};

// ─── Panel : Carrière ─────────────────────────────────────────────────────────

const CarrierePanel = () => {
  const [filieres, setFilieres] = useState<string[]>([]);
  const [selected, setSelected] = useState('');
  const [state, setState] = useState<{ loading: boolean; scenario?: string; donnees?: api.CarriereResponse['donnees_cles']; error?: string }>({ loading: false });

  useEffect(() => {
    api.getCarriere().then((d: any) => {
      if (d.filieres_disponibles) setFilieres(d.filieres_disponibles);
    });
  }, []);

  const load = async () => {
    if (!selected) return;
    setState({ loading: true });
    const data = await api.getCarriere(selected);
    if (data.error) setState({ loading: false, error: data.message });
    else setState({ loading: false, scenario: data.scenario, donnees: data.donnees_cles });
  };

  if (state.loading) return <Loader />;

  return (
    <div className="space-y-4">
      {!state.scenario ? (
        <>
          <p className="text-sm text-slate-500">Sélectionne une filière pour simuler ta carrière professionnelle.</p>
          <div className="grid grid-cols-2 gap-2">
            {filieres.map(f => (
              <button key={f} onClick={() => setSelected(f)}
                className={cn("p-3 rounded-xl border-2 text-sm font-bold transition-all",
                  selected === f
                    ? 'border-[#006666] bg-[#006666]/5 text-[#006666]'
                    : 'border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                )}>
                {f}
              </button>
            ))}
          </div>
          {selected && (
            <button onClick={load} className="btn-primary w-full">
              <Rocket size={16} /> Simuler la carrière {selected}
            </button>
          )}
          {state.error && <ProfilIncompletMsg message={state.error} />}
        </>
      ) : (
        <div className="space-y-4">
          {state.donnees && (
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Départ',    value: state.donnees.salaire_depart   },
                { label: '3 ans',     value: state.donnees.salaire_3ans     },
                { label: '7 ans',     value: state.donnees.salaire_7ans     },
                { label: 'Insertion', value: state.donnees.taux_insertion   },
              ].filter((i): i is { label: string; value: string } => !!i.value).map(({ label, value }) => (
                <div key={label} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">{label}</p>
                  <p className="text-xs font-black text-slate-800 dark:text-slate-100">{value}</p>
                </div>
              ))}
            </div>
          )}
          <RapportMarkdown content={state.scenario} />
          <button onClick={() => { setState({ loading: false }); setSelected(''); }}
            className="text-xs text-slate-400 hover:text-slate-600 underline">
            ← Choisir une autre filière
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Panel : Comparer ─────────────────────────────────────────────────────────

const ComparerPanel = () => {
  const [pair, setPair] = useState<[string, string] | null>(null);
  const [state, setState] = useState<{ loading: boolean; comparaison?: string; recommandation?: string; error?: string }>({ loading: false });

  const load = async (f1: string, f2: string) => {
    setPair([f1, f2]);
    setState({ loading: true });
    const data = await api.getComparer(f1, f2);
    if (data.error) setState({ loading: false, error: data.message });
    else setState({ loading: false, comparaison: data.comparaison, recommandation: data.recommandation });
  };

  if (state.loading) return <Loader />;

  return (
    <div className="space-y-3">
      {!state.comparaison ? (
        <>
          <p className="text-sm text-slate-500">Clique sur une paire de filières à comparer.</p>
          <div className="space-y-2">
            {FILIERES_PAIRS.map(([f1, f2]) => (
              <button key={`${f1}-${f2}`} onClick={() => load(f1, f2)}
                className="w-full flex items-center justify-between p-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 hover:border-cyan-300 dark:hover:border-cyan-700 transition-all group">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{f1}</span>
                <Scale size={14} className="text-slate-300 group-hover:text-cyan-500 transition-colors" />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{f2}</span>
              </button>
            ))}
          </div>
          {state.error && <ProfilIncompletMsg message={state.error} />}
        </>
      ) : (
        <div className="space-y-4">
          {pair && (
            <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-cyan-50 dark:bg-cyan-900/10 border border-cyan-100 dark:border-cyan-900/30">
              <span className="font-black text-cyan-700 dark:text-cyan-400">{pair[0]}</span>
              <Scale size={16} className="text-cyan-400" />
              <span className="font-black text-cyan-700 dark:text-cyan-400">{pair[1]}</span>
            </div>
          )}
          <RapportMarkdown content={state.comparaison} />
          {state.recommandation && (
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <p className="text-xs font-black uppercase tracking-widest text-[#006666] mb-2">Recommandation IA</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{state.recommandation}</p>
            </div>
          )}
          <button onClick={() => { setState({ loading: false }); setPair(null); }}
            className="text-xs text-slate-400 hover:text-slate-600 underline">
            ← Choisir une autre paire
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Panel : Psycho ───────────────────────────────────────────────────────────

const PsychoPanel = () => {
  const [phase,    setPhase]    = useState<'idle' | 'test' | 'done'>('idle');
  const [question, setQuestion] = useState('');
  const [progress, setProgress] = useState({ actuelle: 0, total: 10 });
  const [answer,   setAnswer]   = useState('');
  const [rapport,  setRapport]  = useState('');
  const [loading,  setLoading]  = useState(false);

  const start = async () => {
    setLoading(true);
    const data = await api.startPsycho();
    setQuestion(data.message);
    setProgress({ actuelle: data.question_actuelle, total: data.total_questions });
    setPhase('test');
    setLoading(false);
  };

  const answer_submit = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    const data = await api.answerPsycho(answer);
    setAnswer('');
    if (data.complete && data.rapport) {
      setRapport(data.rapport);
      setPhase('done');
    } else if (data.message) {
      setQuestion(data.message);
      setProgress({ actuelle: data.question_actuelle ?? progress.actuelle + 1, total: data.total_questions ?? 10 });
    }
    setLoading(false);
  };

  if (loading) return <Loader />;

  if (phase === 'idle') return (
    <div className="flex flex-col items-center gap-6 py-8 text-center px-2">
      <div className="w-14 h-14 rounded-2xl bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center text-3xl">🧠</div>
      <div>
        <p className="font-bold text-slate-800 dark:text-white mb-2">Test Psychométrique</p>
        <p className="text-sm text-slate-500">10 questions pour découvrir ton profil académique et affiner ton orientation.</p>
      </div>
      <button onClick={start} className="btn-primary"><Brain size={16} /> Commencer le test</button>
    </div>
  );

  if (phase === 'done') return (
    <div className="space-y-4">
      <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 text-center">
        <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">✅ Test terminé !</p>
      </div>
      <RapportMarkdown content={rapport} />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Question {progress.actuelle}/{progress.total}</span>
          <span>{Math.round((progress.actuelle / progress.total) * 100)}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-pink-500 to-pink-400 rounded-full transition-all duration-500"
            style={{ width: `${(progress.actuelle / progress.total) * 100}%` }} />
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
        <RapportMarkdown content={question} />
      </div>

      <textarea
        value={answer}
        onChange={e => setAnswer(e.target.value)}
        placeholder="Ta réponse..."
        rows={3}
        className="w-full p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 resize-none outline-none focus:border-pink-400 transition-colors"
        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); answer_submit(); } }}
      />
      <button onClick={answer_submit} disabled={!answer.trim()}
        className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed">
        Répondre <ChevronRight size={16} />
      </button>
    </div>
  );
};

// ─── Panel : Coach ────────────────────────────────────────────────────────────

const CoachPanel = () => {
  const [state, setState] = useState<{ loading: boolean; rapport?: string; error?: string }>({ loading: false });

  const load = async () => {
    setState({ loading: true });
    const data = await api.getCoach();
    if (data.error || data.message) setState({ loading: false, error: data.message });
    else setState({ loading: false, rapport: data.rapport });
  };

  if (state.loading) return <Loader />;
  if (state.error)   return <ProfilIncompletMsg message={state.error!} />;

  if (!state.rapport) return (
    <div className="flex flex-col items-center gap-6 py-8 px-2 text-center">
      <p className="text-sm text-slate-500">Reçois un rapport de suivi personnalisé avec des conseils concrets pour progresser.</p>
      <button onClick={load} className="btn-primary"><Medal size={16} /> Générer mon rapport coach</button>
    </div>
  );

  return <RapportMarkdown content={state.rapport} />;
};

// ─── Panel : Peer Match ───────────────────────────────────────────────────────

const PeerMatchPanel = () => (
  <div className="flex flex-col items-center gap-5 py-8 text-center px-2">
    <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-3xl">👥</div>
    <div>
      <p className="font-bold text-slate-800 dark:text-white mb-2">Peer Match</p>
      <p className="text-sm text-slate-500 leading-relaxed">
        Tu hésites encore ? Échange directement avec un(e) étudiant(e) SUPMTI qui est passé par là.
      </p>
    </div>
    <div className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-left space-y-3">
      <p className="text-xs font-black uppercase tracking-widest text-slate-400">Comment ça marche</p>
      {[
        "Dis à SAMI ta filière d'hésitation",
        'Un ambassadeur étudiant te sera suggéré',
        'Contacte-le directement via WhatsApp ou Email',
      ].map((step, i) => (
        <div key={i} className="flex items-start gap-3">
          <span className="w-5 h-5 rounded-full bg-[#006666]/10 text-[#006666] text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
            {i + 1}
          </span>
          <p className="text-sm text-slate-600 dark:text-slate-300">{step}</p>
        </div>
      ))}
    </div>
    <p className="text-xs text-slate-400 italic">Utilise le chat pour déclencher le Peer Match automatiquement.</p>
  </div>
);

// ─── Loader ───────────────────────────────────────────────────────────────────

const Loader = () => (
  <div className="flex flex-col items-center justify-center gap-3 py-16">
    <Loader2 size={28} className="text-[#006666] animate-spin" />
    <p className="text-sm text-slate-400">Analyse en cours...</p>
  </div>
);

// ─── Panel Container + Routing ────────────────────────────────────────────────

const PANEL_COMPONENTS: Record<NonNullable<PanelType>, React.FC> = {
  profil:    ProfilPanel,
  fitscore:  FitscorePanel,
  admission: AdmissionPanel,
  carriere:  CarrierePanel,
  comparer:  ComparerPanel,
  psycho:    PsychoPanel,
  coach:     CoachPanel,
  peermatch: PeerMatchPanel,
};

export const PanelRenderer = () => {
  const { activePanel, closePanel } = usePanelStore();

  if (!activePanel) return null;

  const meta         = PANEL_META[activePanel];
  const Icon         = meta.icon;
  const PanelContent = PANEL_COMPONENTS[activePanel];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40 animate-in fade-in duration-200"
        onClick={closePanel}
      />

      {/* Panel Drawer */}
      <aside className={cn(
        "fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm flex flex-col",
        "bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl",
        "border-l border-slate-200 dark:border-slate-800 shadow-2xl",
        "animate-in slide-in-from-right-8 duration-300"
      )}>

        {/* Header */}
        <div className={cn("flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r", meta.bg)}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white dark:bg-slate-900 shadow-sm">
            <Icon size={18} className={meta.color} />
          </div>
          <div className="flex-1">
            <h2 className="font-black text-slate-900 dark:text-white text-sm">{meta.label}</h2>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">SUPMTI · IA</p>
          </div>
          <button
            onClick={closePanel}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5">
          <PanelContent />
        </div>
      </aside>
    </>
  );
};