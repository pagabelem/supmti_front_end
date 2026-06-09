/* eslint-disable @typescript-eslint/no-explicit-any */
// // src/app/profile/page.tsx
// 'use client';
// import { useState, useEffect, useCallback } from 'react';
// import { useForm, SubmitHandler } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { useAuthStore }    from '@/store/authStore';
// import { useSessionStore } from '@/store/sessionStore';
// import {
//   Save, Loader2, CheckCircle2, AlertCircle,
//   User, GraduationCap, ArrowLeft,
//   Brain, BarChart3, Sparkles
// } from 'lucide-react';
// import Link from 'next/link';

// const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
// function getUid() {
//   try { return JSON.parse(localStorage.getItem('supmti-auth')||'{}')?.state?.user?.id||''; }
//   catch { return ''; }
// }

// const schema = z.object({
//   full_name: z.string().min(2, 'Nom requis'),
//   average:   z.coerce.number().min(0).max(20),
//   bac_type:  z.string().min(1, 'BAC requis'),
//   level:     z.string().min(1, 'Niveau requis'),
//   city:      z.string().min(1, 'Ville requise'),
//   interests: z.string().min(2, 'Intérêts requis'),
// });
// type V = z.infer<typeof schema>;

// const inp = "w-full p-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-supmti-blue/20 focus:border-supmti-blue outline-none transition-all shadow-sm placeholder:text-gray-400";
// const lbl = "block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1";

// // ── Merge profil SAMI + données DB ────────────────────────────
// function mergeWithSami(base: Partial<V>, profil: any): V {
//   const info = profil?.informations_personnelles || {};
//   const acad = profil?.parcours_academique       || {};
//   const inter= profil?.interets                  || [];

//   const samiBac  = acad.type_bac && acad.type_bac !== 'AUTRE' ? acad.type_bac : '';
//   const samiAvg  = acad.moyenne_generale > 0 ? acad.moyenne_generale : 0;
//   const samiLvl  = acad.niveau_etude || '';
//   const samiCity = info.ville || '';
//   const samiName = info.prenom ? `${info.prenom} ${info.nom||''}`.trim() : '';
//   const samiInter= inter.length > 0 ? inter.join(', ') : '';

//   return {
//     full_name: samiName  || base.full_name || '',
//     average:   samiAvg   || Number(base.average) || 0,
//     bac_type:  samiBac   || base.bac_type  || '',
//     level:     samiLvl   || base.level     || '',
//     city:      samiCity  || base.city      || '',
//     interests: samiInter || base.interests || '',
//   };
// }

// export default function ProfilePage() {
//   const { user, setAuth, token } = useAuthStore();
//   const { profil }               = useSessionStore();

//   const [status,    setStatus]    = useState<'idle'|'success'|'error'>('idle');
//   const [apiError,  setApiError]  = useState<string|null>(null);
//   const [loading,   setLoading]   = useState(true);
//   const [dbBase,    setDbBase]    = useState<Partial<V>>({});
//   const [samiAlert, setSamiAlert] = useState(false);

//   const { register, handleSubmit, reset, watch,
//     formState: { errors, isSubmitting, isDirty } } = useForm<V>({
//     resolver: zodResolver(schema),
//     defaultValues: { full_name:'', average:0, bac_type:'', level:'', city:'', interests:'' },
//   });

//   // ── Charger depuis la DB ──────────────────────────────────
//   const loadFromDB = useCallback(async () => {
//     const uid = getUid();
//     if (!uid) { setLoading(false); return; }
//     try {
//       const res  = await fetch(`${API}/api/profil`, {
//         credentials:'include', headers:{'X-User-Id':uid}
//       });
//       const data = await res.json();
//       const base: Partial<V> = {
//         full_name: data.full_name || user?.full_name || '',
//         average:   Number(data.average) || 0,
//         bac_type:  data.bac_type  || '',
//         level:     data.level     || '',
//         city:      data.city      || '',
//         interests: Array.isArray(data.interests)
//           ? data.interests.join(', ')
//           : data.interests || '',
//       };
//       setDbBase(base);
//       // Merge immédiat avec profil SAMI existant
//       reset(mergeWithSami(base, profil));
//     } catch {
//       const base: Partial<V> = {
//         full_name: user?.full_name || '',
//         average:   Number((user as any)?.average) || 0,
//         bac_type:  (user as any)?.bac_type  || '',
//         level:     (user as any)?.level     || '',
//         city:      (user as any)?.city      || '',
//         interests: Array.isArray((user as any)?.interests)
//           ? (user as any).interests.join(', ')
//           : (user as any)?.interests || '',
//       };
//       setDbBase(base);
//       reset(mergeWithSami(base, profil));
//     } finally {
//       setLoading(false);
//     }
//   }, [profil, user]);

//   // Charger au montage
//   useEffect(() => { loadFromDB(); }, []);

//   // ── Re-sync quand profil SAMI change ─────────────────────
//   // Déclenché à chaque fois que useSessionStore().profil change
//   useEffect(() => {
//     if (!profil || loading) return;
//     const merged = mergeWithSami(dbBase, profil);
//     reset(merged, { keepDirty: false }); // reset complet avec nouvelles valeurs
//     setSamiAlert(true);
//     const t = setTimeout(() => setSamiAlert(false), 5000);
//     return () => clearTimeout(t);
//   }, [profil]); // ← dépendance directe sur profil

//   // ── Écouter l'événement sami:profile-updated ─────────────
//   useEffect(() => {
//     const handler = async () => {
//       // Recharger depuis la DB ET re-merger avec le nouveau profil SAMI
//       await loadFromDB();
//     };
//     window.addEventListener('sami:profile-updated', handler);
//     return () => window.removeEventListener('sami:profile-updated', handler);
//   }, [loadFromDB]);

//   const onSubmit: SubmitHandler<V> = async (data) => {
//     setApiError(null); setStatus('idle');
//     if (!user?.id) { setApiError('Non connecté.'); setStatus('error'); return; }
//     try {
//       const payload = {
//         ...data,
//         interests: data.interests.split(',').map(i=>i.trim()).filter(Boolean),
//         user_id: user.id,
//       };
//       const res = await fetch(`${API}/api/profil`, {
//         method:'PUT', credentials:'include',
//         headers:{'Content-Type':'application/json','X-User-Id':user.id},
//         body: JSON.stringify(payload),
//       });
//       const json = await res.json().catch(()=>({}));
//       if (!res.ok) { setApiError(json.detail||'Erreur.'); setStatus('error'); return; }
//       setAuth({...user,...data,interests:payload.interests}, token!);
//       setDbBase(data); // mettre à jour la base locale
//       setStatus('success');
//       setSamiAlert(false);
//       setTimeout(()=>setStatus('idle'), 3000);
//     } catch {
//       setApiError('Impossible de joindre le serveur.');
//       setStatus('error');
//     }
//   };

//   // Valeurs en direct pour les cards
//   const avgVal = watch('average');
//   const bacVal = watch('bac_type');
//   const lvlVal = watch('level');
//   const fitEst = avgVal > 0
//     ? Math.min(100, Math.round((avgVal/20)*60 + (bacVal?20:0) + (lvlVal?20:0)))
//     : null;

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-8 px-4">
//       <div className="max-w-2xl mx-auto">

//         {/* Header */}
//         <div className="flex items-center gap-4 mb-8">
//           <Link href="/chatbot" className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 hover:text-supmti-blue transition-colors shadow-sm">
//             <ArrowLeft size={18}/>
//           </Link>
//           <div className="flex items-center gap-3">
//             <div className="p-2.5 bg-supmti-blue/10 dark:bg-blue-900/20 rounded-xl">
//               <GraduationCap size={24} className="text-supmti-blue dark:text-blue-400"/>
//             </div>
//             <div>
//               <h1 className="text-2xl font-black text-gray-900 dark:text-white">Mon Profil</h1>
//               {user?.email && (
//                 <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
//                   <User size={12}/>{user.email}
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Banner SAMI sync */}
//         {samiAlert && (
//           <div className="p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-2xl mb-4 flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
//             <Sparkles size={15} className="text-orange-500 shrink-0 animate-pulse"/>
//             <p className="text-sm text-orange-700 dark:text-orange-300 flex-1">
//               <strong>SAMI a mis à jour ton profil</strong> depuis la conversation. Sauvegarde pour confirmer.
//             </p>
//             <button onClick={()=>setSamiAlert(false)} className="text-orange-400 hover:text-orange-600 font-bold text-xs">✕</button>
//           </div>
//         )}

//         {/* Banner info */}
//         <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl mb-6">
//           <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
//             💡 <strong>SAMI remplit automatiquement</strong> ce profil depuis tes conversations. Parle à SAMI de ton BAC, ta moyenne et tes intérêts — les champs se mettent à jour en temps réel.
//           </p>
//         </div>

//         {/* Cards aperçu live */}
//         <div className="grid grid-cols-3 gap-3 mb-6">
//           {[
//             { icon: BarChart3, val: avgVal > 0 ? `${avgVal}/20` : '—', label:'Moyenne', color:'text-orange-500', active: avgVal > 0 },
//             { icon: Brain,     val: bacVal || '—',                      label:'BAC',     color:'text-purple-500', active: !!bacVal },
//             { icon: Sparkles,  val: fitEst ? `${fitEst}%` : '—',       label:'FitScore est.', color: fitEst && fitEst >= 70 ? 'text-emerald-500' : 'text-orange-400', active: !!fitEst },
//           ].map(({ icon:Icon, val, label, color, active }) => (
//             <div key={label} className={`p-4 rounded-2xl border shadow-sm text-center transition-all ${active ? 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800' : 'bg-gray-100/50 dark:bg-slate-900/30 border-gray-100 dark:border-slate-800 opacity-60'}`}>
//               <Icon size={20} className={`${color} mx-auto mb-1 ${active ? '' : 'grayscale'}`}/>
//               <p className={`text-xl font-black ${active ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>{val}</p>
//               <p className="text-[10px] text-gray-400 uppercase tracking-widest">{label}</p>
//             </div>
//           ))}
//         </div>

//         {/* Formulaire */}
//         <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
//           {loading ? (
//             <div className="flex items-center justify-center py-12 gap-3 text-gray-400">
//               <Loader2 size={20} className="animate-spin"/><span>Chargement…</span>
//             </div>
//           ) : (
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

//               {status === 'success' && (
//                 <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
//                   <CheckCircle2 size={16} className="text-emerald-500 shrink-0"/>
//                   <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Profil sauvegardé !</p>
//                 </div>
//               )}
//               {status === 'error' && apiError && (
//                 <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
//                   <AlertCircle size={16} className="text-red-500 shrink-0"/>
//                   <p className="text-xs font-medium text-red-600 dark:text-red-400">{apiError}</p>
//                 </div>
//               )}

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 <div className="space-y-1 md:col-span-2">
//                   <label className={lbl}>Nom Complet</label>
//                   <input {...register('full_name')} className={inp}/>
//                   {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
//                 </div>
//                 <div className="space-y-1">
//                   <label className={lbl}>Moyenne Générale (/20)</label>
//                   <input type="number" step="0.01" min="0" max="20" {...register('average')} className={inp}/>
//                   {errors.average && <p className="text-red-500 text-xs mt-1">{errors.average.message}</p>}
//                 </div>
//                 <div className="space-y-1">
//                   <label className={lbl}>Type de BAC</label>
//                   <select {...register('bac_type')} className={inp}>
//                     <option value="">Sélectionner…</option>
//                     <option value="SM">Sciences Maths</option>
//                     <option value="PC">Physique-Chimie</option>
//                     <option value="SVT">SVT</option>
//                     <option value="Eco">Économie</option>
//                     <option value="Info">Informatique</option>
//                     <option value="Lettres">Lettres</option>
//                   </select>
//                   {errors.bac_type && <p className="text-red-500 text-xs mt-1">{errors.bac_type.message}</p>}
//                 </div>
//                 <div className="space-y-1">
//                   <label className={lbl}>Niveau Actuel</label>
//                   <input {...register('level')} placeholder="Ex: Terminale, 1ère année…" className={inp}/>
//                   {errors.level && <p className="text-red-500 text-xs mt-1">{errors.level.message}</p>}
//                 </div>
//                 <div className="space-y-1">
//                   <label className={lbl}>Ville</label>
//                   <input {...register('city')} placeholder="Ex: Meknès, Fès…" className={inp}/>
//                   {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
//                 </div>
//                 <div className="space-y-1 md:col-span-2">
//                   <label className={lbl}>Centres d'intérêt</label>
//                   <textarea {...register('interests')} rows={3} placeholder="Ex: Programmation, IA, Réseaux…" className={`${inp} resize-none`}/>
//                   {errors.interests && <p className="text-red-500 text-xs mt-1">{errors.interests.message}</p>}
//                   <p className="text-[10px] text-gray-400 ml-1">Séparés par des virgules</p>
//                 </div>
//               </div>

//               <button type="submit" disabled={isSubmitting}
//                 className="flex items-center justify-center gap-2 w-full bg-supmti-blue dark:bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg disabled:opacity-70 hover:scale-[1.01] active:scale-95">
//                 {isSubmitting ? <Loader2 size={20} className="animate-spin"/> : <Save size={20}/>}
//                 {isSubmitting ? 'Sauvegarde…' : isDirty ? '💾 Sauvegarder les modifications' : '✓ Profil à jour'}
//               </button>
//             </form>
//           )}
//         </div>

//         {/* Indicateur sources */}
//         <div className="mt-4 p-3 rounded-xl bg-gray-100 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 flex flex-wrap gap-2">
//           <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest self-center mr-2">Sources :</span>
//           <span className="text-[10px] px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold">🗄️ Base de données</span>
//           <span className={`text-[10px] px-2 py-1 rounded-lg font-bold ${profil ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400' : 'bg-gray-50 dark:bg-slate-700 text-gray-400'}`}>
//             🤖 SAMI {profil ? '● Actif' : '● Inactif'}
//           </span>
//           <span className="text-[10px] px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 font-bold">✏️ Manuel</span>
//         </div>
//       </div>
//     </div>
//   );
// }



// // src/app/profile/page.tsx
// 'use client';
// import { useState, useEffect, useCallback } from 'react';
// import { useForm, SubmitHandler } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { useAuthStore }    from '@/store/authStore';
// import { useSessionStore } from '@/store/sessionStore';
// import {
//   Save, Loader2, CheckCircle2, AlertCircle,
//   User, GraduationCap, ArrowLeft,
//   Brain, BarChart3, Sparkles
// } from 'lucide-react';
// import Link from 'next/link';

// const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
// function getUid() {
//   try { return JSON.parse(localStorage.getItem('supmti-auth')||'{}')?.state?.user?.id||''; }
//   catch { return ''; }
// }

// const schema = z.object({
//   full_name: z.string().min(2, 'Nom requis'),
//   average:   z.coerce.number().min(0).max(20),
//   bac_type:  z.string().min(1, 'BAC requis'),
//   level:     z.string().min(1, 'Niveau requis'),
//   city:      z.string().min(1, 'Ville requise'),
//   interests: z.string().min(2, 'Intérêts requis'),
// });
// type V = z.infer<typeof schema>;

// const inp = "w-full p-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-supmti-blue/20 focus:border-supmti-blue outline-none transition-all shadow-sm placeholder:text-gray-400";
// const lbl = "block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1";

// // ── Liste des BAC connus dans le système ──────────────────────
// const BAC_CONNUS = [
//   'SMA', 'SMB', 'SP', 'SVT', 'STE', 'STM', 'STGC',
//   'SEG', 'SGC', 'LSH', 'S', 'SM', 'D', 'E', 'C', 'L', 'A',
//   'BAC_GENERAL_FR', 'PC', 'Eco', 'Info', 'Lettres',
// ];

// // ── FIX 1 : mergeWithSami corrigé ─────────────────────────────
// // Corrections :
// //   - profil?.preferences?.centres_interet  (était profil?.interets)
// //   - acad.niveau_actuel                    (était acad.niveau_etude)
// //   - acad.type_bac accepté même si hors liste select
// function mergeWithSami(base: Partial<V>, profil: any): V {
//   const info  = profil?.informations_personnelles  || {};
//   const acad  = profil?.parcours_academique        || {};
//   // ← CORRECTION : chemin correct vers les centres d'intérêt
//   const inter = profil?.preferences?.centres_interet || [];

//   const samiBac  = acad.type_bac && acad.type_bac !== 'AUTRE' ? acad.type_bac : '';
//   const samiAvg  = acad.moyenne_generale > 0 ? acad.moyenne_generale : 0;
//   // ← CORRECTION : niveau_actuel (pas niveau_etude)
//   const samiLvl  = acad.niveau_actuel || acad.diplome_actuel || '';
//   const samiCity = info.ville || '';
//   const samiName = info.prenom
//     ? `${info.prenom} ${info.nom || ''}`.trim()
//     : '';
//   // ← inter est maintenant un tableau correct
//   const samiInter = inter.length > 0 ? inter.join(', ') : '';

//   return {
//     full_name: samiName  || base.full_name || '',
//     average:   samiAvg   || Number(base.average) || 0,
//     bac_type:  samiBac   || base.bac_type  || '',
//     // ← CORRECTION : si niveau SAMI ressemble à bac3/bac2 → le convertir lisiblement
//     level:     samiLvl   || base.level     || '',
//     city:      samiCity  || base.city      || '',
//     interests: samiInter || base.interests || '',
//   };
// }

// // ── Convertit niveau_actuel backend en label lisible ──────────
// function niveauLabel(niveau: string): string {
//   const map: Record<string, string> = {
//     post_bac: 'Terminale / Baccalauréat',
//     bac1:     'BAC+1',
//     bac2:     'BAC+2 (DUT/BTS/DEUG)',
//     bac3:     'BAC+3 (Licence)',
//   };
//   return map[niveau] || niveau;
// }

// export default function ProfilePage() {
//   const { user, setAuth, token } = useAuthStore();
//   // ← FIX 2 : on lit directement le store Zustand (réactif)
//   const { profil } = useSessionStore();

//   const [status,    setStatus]    = useState<'idle'|'success'|'error'>('idle');
//   const [apiError,  setApiError]  = useState<string|null>(null);
//   const [loading,   setLoading]   = useState(true);
//   const [dbBase,    setDbBase]    = useState<Partial<V>>({});
//   const [samiAlert, setSamiAlert] = useState(false);
//   // ← Pour le champ BAC libre (valeur hors liste)
//   const [bacLibre,  setBacLibre]  = useState(false);

//   const { register, handleSubmit, reset, watch, setValue,
//     formState: { errors, isSubmitting, isDirty } } = useForm<V>({
//     resolver: zodResolver(schema),
//     defaultValues: { full_name:'', average:0, bac_type:'', level:'', city:'', interests:'' },
//   });

//   // ── Charger depuis la DB au montage ──────────────────────────
//   const loadFromDB = useCallback(async () => {
//     const uid = getUid();
//     if (!uid) { setLoading(false); return; }
//     try {
//       const res  = await fetch(`${API}/api/profil`, {
//         credentials: 'include',
//         headers:     { 'X-User-Id': uid },
//       });
//       const data = await res.json();

//       // ← FIX 3 : lire les intérêts depuis data.profil.preferences (réponse SAMI)
//       // Le backend /api/profil retourne { profil: {...} } en session
//       const samiProfil = data.profil || data;
//       const interetsDB = Array.isArray(data.interests)
//         ? data.interests
//         : samiProfil?.preferences?.centres_interet || [];

//       const base: Partial<V> = {
//         full_name: data.full_name || user?.full_name || '',
//         average:   Number(data.average) || 0,
//         bac_type:  data.bac_type  || '',
//         level:     data.level     || '',
//         city:      data.city      || '',
//         interests: interetsDB.length > 0
//           ? interetsDB.join(', ')
//           : (Array.isArray(data.interests) ? data.interests.join(', ') : data.interests || ''),
//       };
//       setDbBase(base);

//       // Merger avec le profil SAMI déjà en mémoire
//       const merged = mergeWithSami(base, profil);
//       reset(merged);

//       // Détecter si le BAC est hors liste
//       if (merged.bac_type && !BAC_CONNUS.includes(merged.bac_type)) {
//         setBacLibre(true);
//       }
//     } catch {
//       const base: Partial<V> = {
//         full_name: user?.full_name || '',
//         average:   Number((user as any)?.average) || 0,
//         bac_type:  (user as any)?.bac_type  || '',
//         level:     (user as any)?.level     || '',
//         city:      (user as any)?.city      || '',
//         interests: Array.isArray((user as any)?.interests)
//           ? (user as any).interests.join(', ')
//           : (user as any)?.interests || '',
//       };
//       setDbBase(base);
//       reset(mergeWithSami(base, profil));
//     } finally {
//       setLoading(false);
//     }
//   }, [profil, user, reset]);

//   useEffect(() => { loadFromDB(); }, []);

//   // ── FIX 2 : Re-sync DIRECT depuis le store Zustand ───────────
//   // Dès que profil change dans le store (après sendMessage),
//   // on re-merge immédiatement SANS rappeler l'API
//   useEffect(() => {
//     if (!profil || loading) return;

//     const merged = mergeWithSami(dbBase, profil);
//     reset(merged, { keepDirty: false });

//     // Détecter BAC libre
//     if (merged.bac_type && !BAC_CONNUS.includes(merged.bac_type)) {
//       setBacLibre(true);
//     } else {
//       setBacLibre(false);
//     }

//     setSamiAlert(true);
//     const t = setTimeout(() => setSamiAlert(false), 5000);
//     return () => clearTimeout(t);
//   }, [profil]); // ← déclenché par setProfil() dans ChatInput

//   // ── Écouter sami:profile-updated ─────────────────────────────
//   // Sert à forcer un reload depuis DB si besoin
//   useEffect(() => {
//     const handler = () => loadFromDB();
//     window.addEventListener('sami:profile-updated', handler);
//     return () => window.removeEventListener('sami:profile-updated', handler);
//   }, [loadFromDB]);

//   const onSubmit: SubmitHandler<V> = async (data) => {
//     setApiError(null); setStatus('idle');
//     if (!user?.id) { setApiError('Non connecté.'); setStatus('error'); return; }
//     try {
//       const payload = {
//         ...data,
//         interests: data.interests.split(',').map(i => i.trim()).filter(Boolean),
//         user_id: user.id,
//       };
//       const res = await fetch(`${API}/api/profil`, {
//         method:      'PUT',
//         credentials: 'include',
//         headers:     { 'Content-Type': 'application/json', 'X-User-Id': user.id },
//         body:        JSON.stringify(payload),
//       });
//       const json = await res.json().catch(() => ({}));
//       if (!res.ok) { setApiError(json.detail || 'Erreur.'); setStatus('error'); return; }
//       setAuth({ ...user, ...data, interests: payload.interests }, token!);
//       setDbBase(data);
//       setStatus('success');
//       setSamiAlert(false);
//       setTimeout(() => setStatus('idle'), 3000);
//     } catch {
//       setApiError('Impossible de joindre le serveur.');
//       setStatus('error');
//     }
//   };

//   const avgVal = watch('average');
//   const bacVal = watch('bac_type');
//   const lvlVal = watch('level');
//   const fitEst = avgVal > 0
//     ? Math.min(100, Math.round((avgVal / 20) * 60 + (bacVal ? 20 : 0) + (lvlVal ? 20 : 0)))
//     : null;

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-8 px-4">
//       <div className="max-w-2xl mx-auto">

//         {/* Header */}
//         <div className="flex items-center gap-4 mb-8">
//           <Link href="/chatbot" className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 hover:text-supmti-blue transition-colors shadow-sm">
//             <ArrowLeft size={18}/>
//           </Link>
//           <div className="flex items-center gap-3">
//             <div className="p-2.5 bg-supmti-blue/10 dark:bg-blue-900/20 rounded-xl">
//               <GraduationCap size={24} className="text-supmti-blue dark:text-blue-400"/>
//             </div>
//             <div>
//               <h1 className="text-2xl font-black text-gray-900 dark:text-white">Mon Profil</h1>
//               {user?.email && (
//                 <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
//                   <User size={12}/>{user.email}
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Banner SAMI sync */}
//         {samiAlert && (
//           <div className="p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-2xl mb-4 flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
//             <Sparkles size={15} className="text-orange-500 shrink-0 animate-pulse"/>
//             <p className="text-sm text-orange-700 dark:text-orange-300 flex-1">
//               <strong>SAMI a mis à jour ton profil</strong> depuis la conversation. Sauvegarde pour confirmer.
//             </p>
//             <button onClick={() => setSamiAlert(false)} className="text-orange-400 hover:text-orange-600 font-bold text-xs">✕</button>
//           </div>
//         )}

//         {/* Banner info */}
//         <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl mb-6">
//           <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
//             💡 <strong>SAMI remplit automatiquement</strong> ce profil depuis tes conversations. Parle à SAMI de ton BAC, ta moyenne et tes intérêts — les champs se mettent à jour en temps réel.
//           </p>
//         </div>

//         {/* Cards aperçu live */}
//         <div className="grid grid-cols-3 gap-3 mb-6">
//           {[
//             { icon: BarChart3, val: avgVal > 0 ? `${avgVal}/20` : '—',  label: 'Moyenne',       color: 'text-orange-500',  active: avgVal > 0 },
//             { icon: Brain,     val: bacVal || '—',                        label: 'BAC',           color: 'text-purple-500',  active: !!bacVal   },
//             { icon: Sparkles,  val: fitEst ? `${fitEst}%` : '—',         label: 'FitScore est.', color: fitEst && fitEst >= 70 ? 'text-emerald-500' : 'text-orange-400', active: !!fitEst },
//           ].map(({ icon: Icon, val, label, color, active }) => (
//             <div key={label} className={`p-4 rounded-2xl border shadow-sm text-center transition-all ${active ? 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800' : 'bg-gray-100/50 dark:bg-slate-900/30 border-gray-100 dark:border-slate-800 opacity-60'}`}>
//               <Icon size={20} className={`${color} mx-auto mb-1 ${active ? '' : 'grayscale'}`}/>
//               <p className={`text-xl font-black ${active ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>{val}</p>
//               <p className="text-[10px] text-gray-400 uppercase tracking-widest">{label}</p>
//             </div>
//           ))}
//         </div>

//         {/* Formulaire */}
//         <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
//           {loading ? (
//             <div className="flex items-center justify-center py-12 gap-3 text-gray-400">
//               <Loader2 size={20} className="animate-spin"/><span>Chargement…</span>
//             </div>
//           ) : (
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

//               {status === 'success' && (
//                 <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
//                   <CheckCircle2 size={16} className="text-emerald-500 shrink-0"/>
//                   <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Profil sauvegardé !</p>
//                 </div>
//               )}
//               {status === 'error' && apiError && (
//                 <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
//                   <AlertCircle size={16} className="text-red-500 shrink-0"/>
//                   <p className="text-xs font-medium text-red-600 dark:text-red-400">{apiError}</p>
//                 </div>
//               )}

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

//                 <div className="space-y-1 md:col-span-2">
//                   <label className={lbl}>Nom Complet</label>
//                   <input {...register('full_name')} className={inp}/>
//                   {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
//                 </div>

//                 <div className="space-y-1">
//                   <label className={lbl}>Moyenne Générale (/20)</label>
//                   <input type="number" step="0.01" min="0" max="20" {...register('average')} className={inp}/>
//                   {errors.average && <p className="text-red-500 text-xs mt-1">{errors.average.message}</p>}
//                 </div>

//                 {/* ── FIX 1 : Champ BAC hybride select + input libre ── */}
//                 <div className="space-y-1">
//                   <label className={lbl}>Type de BAC</label>
//                   <div className="space-y-2">
//                     <select
//                       value={bacLibre ? '__autre__' : (watch('bac_type') || '')}
//                       onChange={(e) => {
//                         if (e.target.value === '__autre__') {
//                           setBacLibre(true);
//                           setValue('bac_type', '');
//                         } else {
//                           setBacLibre(false);
//                           setValue('bac_type', e.target.value, { shouldDirty: true });
//                         }
//                       }}
//                       className={inp}
//                     >
//                       <option value="">Sélectionner…</option>
//                       <optgroup label="Maroc — Filières scientifiques">
//                         <option value="SMA">SMA — Sciences Maths A</option>
//                         <option value="SMB">SMB — Sciences Maths B</option>
//                         <option value="SP">SP — Sciences Physiques</option>
//                         <option value="SVT">SVT — Sciences de la Vie</option>
//                         <option value="STE">STE — Sciences Tech. Élec.</option>
//                         <option value="STM">STM — Sciences Tech. Méca.</option>
//                       </optgroup>
//                       <optgroup label="Maroc — Filières économiques & lettres">
//                         <option value="SEG">SEG — Sciences Économiques</option>
//                         <option value="SGC">SGC — Sciences Gestion Comptable</option>
//                         <option value="STGC">STGC — Sciences Tech. Gestion</option>
//                         <option value="LSH">LSH — Lettres & Sciences Humaines</option>
//                       </optgroup>
//                       <optgroup label="France / International">
//                         <option value="BAC_GENERAL_FR">BAC Général (France)</option>
//                         <option value="S">Série S</option>
//                         <option value="ES">Série ES</option>
//                         <option value="L">Série L</option>
//                       </optgroup>
//                       <optgroup label="Autre / Supérieur">
//                         <option value="__autre__">Autre / Diplôme supérieur…</option>
//                       </optgroup>
//                     </select>

//                     {/* Input libre si valeur hors liste (Licence, DUT, BTS, etc.) */}
//                     {bacLibre && (
//                       <input
//                         {...register('bac_type')}
//                         placeholder="Ex: Licence Informatique, DUT, BTS…"
//                         className={`${inp} border-orange-300 dark:border-orange-700 focus:border-orange-500`}
//                         autoFocus
//                       />
//                     )}

//                     {/* Afficher la valeur SAMI si hors liste et déjà remplie */}
//                     {!bacLibre && bacVal && !BAC_CONNUS.includes(bacVal) && (
//                       <p className="text-[11px] text-orange-600 dark:text-orange-400 ml-1 flex items-center gap-1">
//                         <Sparkles size={10}/> SAMI a détecté : <strong>{bacVal}</strong>
//                         <button
//                           type="button"
//                           onClick={() => setBacLibre(true)}
//                           className="underline ml-1"
//                         >
//                           modifier
//                         </button>
//                       </p>
//                     )}
//                   </div>
//                   {errors.bac_type && <p className="text-red-500 text-xs mt-1">{errors.bac_type.message}</p>}
//                 </div>

//                 <div className="space-y-1">
//                   <label className={lbl}>Niveau Actuel</label>
//                   <input
//                     {...register('level')}
//                     placeholder="Ex: Terminale, 1ère année, Licence…"
//                     className={inp}
//                   />
//                   {errors.level && <p className="text-red-500 text-xs mt-1">{errors.level.message}</p>}
//                 </div>

//                 <div className="space-y-1">
//                   <label className={lbl}>Ville</label>
//                   <input {...register('city')} placeholder="Ex: Meknès, Fès…" className={inp}/>
//                   {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
//                 </div>

//                 <div className="space-y-1 md:col-span-2">
//                   <label className={lbl}>Centres d'intérêt</label>
//                   <textarea
//                     {...register('interests')}
//                     rows={3}
//                     placeholder="Ex: Programmation, IA, Réseaux, Finance…"
//                     className={`${inp} resize-none`}
//                   />
//                   {errors.interests && <p className="text-red-500 text-xs mt-1">{errors.interests.message}</p>}
//                   <p className="text-[10px] text-gray-400 ml-1">Séparés par des virgules</p>
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="flex items-center justify-center gap-2 w-full bg-supmti-blue dark:bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg disabled:opacity-70 hover:scale-[1.01] active:scale-95"
//               >
//                 {isSubmitting ? <Loader2 size={20} className="animate-spin"/> : <Save size={20}/>}
//                 {isSubmitting ? 'Sauvegarde…' : isDirty ? '💾 Sauvegarder les modifications' : '✓ Profil à jour'}
//               </button>
//             </form>
//           )}
//         </div>

//         {/* Indicateur sources */}
//         <div className="mt-4 p-3 rounded-xl bg-gray-100 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 flex flex-wrap gap-2">
//           <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest self-center mr-2">Sources :</span>
//           <span className="text-[10px] px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold">🗄️ Base de données</span>
//           <span className={`text-[10px] px-2 py-1 rounded-lg font-bold ${profil ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400' : 'bg-gray-50 dark:bg-slate-700 text-gray-400'}`}>
//             🤖 SAMI {profil ? '● Actif' : '● Inactif'}
//           </span>
//           <span className="text-[10px] px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 font-bold">✏️ Manuel</span>
//         </div>
//       </div>
//     </div>
//   );
// }





// 'use client';
// import { useState, useEffect, useCallback } from 'react';
// import { useForm, SubmitHandler } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { useAuthStore } from '@/store/authStore';
// import { useSessionStore } from '@/store/sessionStore';
// import {
//   Save, Loader2, CheckCircle2, AlertCircle,
//   User, GraduationCap, ArrowLeft,
//   Brain, BarChart3, Sparkles, MapPin, Target, ClipboardList
// } from 'lucide-react';
// import Link from 'next/link';
// import { cn } from '@/lib/utils';

// const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
// const colors = { teal: '#005555', red: '#E31E24' };

// function getUid() {
//   try { return JSON.parse(localStorage.getItem('supmti-auth')||'{}')?.state?.user?.id||''; }
//   catch { return ''; }
// }

// const schema = z.object({
//   full_name: z.string().min(2, 'Nom requis'),
//   average: z.coerce.number().min(0).max(20),
//   bac_type: z.string().min(1, 'BAC requis'),
//   level: z.string().min(1, 'Niveau requis'),
//   city: z.string().min(1, 'Ville requise'),
//   interests: z.string().min(2, 'Intérêts requis'),
// });
// type V = z.infer<typeof schema>;

// // Style des inputs harmonisé avec Login/Register
// const inp = "w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-[#005555] focus:ring-4 focus:ring-[#005555]/5 transition-all shadow-sm placeholder:text-slate-400";
// const lbl = "block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 ml-4";

// const BAC_CONNUS = [
//   'SMA', 'SMB', 'SP', 'SVT', 'STE', 'STM', 'STGC',
//   'SEG', 'SGC', 'LSH', 'S', 'SM', 'D', 'E', 'C', 'L', 'A',
//   'BAC_GENERAL_FR', 'PC', 'Eco', 'Info', 'Lettres',
// ];

// function mergeWithSami(base: Partial<V>, profil: any): V {
//   const info = profil?.informations_personnelles || {};
//   const acad = profil?.parcours_academique || {};
//   const inter = profil?.preferences?.centres_interet || [];

//   return {
//     full_name: (info.prenom ? `${info.prenom} ${info.nom || ''}`.trim() : '') || base.full_name || '',
//     average: acad.moyenne_generale > 0 ? acad.moyenne_generale : Number(base.average) || 0,
//     bac_type: (acad.type_bac && acad.type_bac !== 'AUTRE' ? acad.type_bac : '') || base.bac_type || '',
//     level: (acad.niveau_actuel || acad.diplome_actuel || '') || base.level || '',
//     city: info.ville || base.city || '',
//     interests: inter.length > 0 ? inter.join(', ') : base.interests || '',
//   };
// }

// export default function ProfilePage() {
//   const { user, setAuth, token } = useAuthStore();
//   const { profil } = useSessionStore();

//   const [status, setStatus] = useState<'idle'|'success'|'error'>('idle');
//   const [apiError, setApiError] = useState<string|null>(null);
//   const [loading, setLoading] = useState(true);
//   const [dbBase, setDbBase] = useState<Partial<V>>({});
//   const [samiAlert, setSamiAlert] = useState(false);
//   const [bacLibre, setBacLibre] = useState(false);

//   const { register, handleSubmit, reset, watch, setValue,
//     formState: { errors, isSubmitting, isDirty } } = useForm<V>({
//     resolver: zodResolver(schema),
//     defaultValues: { full_name:'', average:0, bac_type:'', level:'', city:'', interests:'' },
//   });

//   const loadFromDB = useCallback(async () => {
//     const uid = getUid();
//     if (!uid) { setLoading(false); return; }
//     try {
//       const res = await fetch(`${API}/api/profil`, {
//         credentials: 'include',
//         headers: { 'X-User-Id': uid },
//       });
//       const data = await res.json();
//       const samiProfil = data.profil || data;
//       const interetsDB = Array.isArray(data.interests) ? data.interests : samiProfil?.preferences?.centres_interet || [];

//       const base: Partial<V> = {
//         full_name: data.full_name || user?.full_name || '',
//         average: Number(data.average) || 0,
//         bac_type: data.bac_type || '',
//         level: data.level || '',
//         city: data.city || '',
//         interests: interetsDB.length > 0 ? interetsDB.join(', ') : '',
//       };
//       setDbBase(base);
//       const merged = mergeWithSami(base, profil);
//       reset(merged);
//       if (merged.bac_type && !BAC_CONNUS.includes(merged.bac_type)) setBacLibre(true);
//     } catch {
//       setLoading(false);
//     } finally {
//       setLoading(false);
//     }
//   }, [profil, user, reset]);

//   useEffect(() => { loadFromDB(); }, []);

//   useEffect(() => {
//     if (!profil || loading) return;
//     const merged = mergeWithSami(dbBase, profil);
//     reset(merged, { keepDirty: false });
//     setBacLibre(merged.bac_type && !BAC_CONNUS.includes(merged.bac_type) ? true : false);
//     setSamiAlert(true);
//     const t = setTimeout(() => setSamiAlert(false), 6000);
//     return () => clearTimeout(t);
//   }, [profil]);

//   const onSubmit: SubmitHandler<V> = async (data) => {
//     setApiError(null); setStatus('idle');
//     try {
//       const payload = { ...data, interests: data.interests.split(',').map(i => i.trim()).filter(Boolean), user_id: user?.id };
//       const res = await fetch(`${API}/api/profil`, {
//         method: 'PUT',
//         credentials: 'include',
//         headers: { 'Content-Type': 'application/json', 'X-User-Id': user?.id || '' },
//         body: JSON.stringify(payload),
//       });
//       if (!res.ok) { setStatus('error'); return; }
//       setAuth({ ...user, ...data, interests: payload.interests }, token!);
//       setDbBase(data);
//       setStatus('success');
//       setTimeout(() => setStatus('idle'), 3000);
//     } catch { setStatus('error'); }
//   };

//   const avgVal = watch('average');
//   const bacVal = watch('bac_type');
//   const lvlVal = watch('level');
//   const fitEst = avgVal > 0 ? Math.min(100, Math.round((avgVal / 20) * 60 + (bacVal ? 20 : 0) + (lvlVal ? 20 : 0))) : null;

//   return (
//     <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 transition-colors duration-300">
//       <div className="max-w-2xl mx-auto">
        
//         {/* Header avec Logo et Marque */}
//         <div className="text-center mb-10">
//           <img src="/images/logo-supmti.png" alt="SUPMTI" className="h-16 mx-auto mb-6 dark:brightness-110" />
//           <div className="w-full flex h-2 rounded-full overflow-hidden shadow-inner bg-white dark:bg-slate-900">
//             <div className="h-full w-[30%]" style={{ backgroundColor: colors.red }} />
//             <div className="h-full w-[70%]" style={{ backgroundColor: colors.teal }} />
//           </div>
//         </div>

//         {/* Navigation & Titre */}
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center gap-4">
//             <Link href="/chatbot" className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-[#005555] transition-all shadow-sm">
//               <ArrowLeft size={20}/>
//             </Link>
//             <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Mon Profil</h1>
//           </div>
//           {status === 'success' && (
//             <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border border-emerald-100 dark:border-emerald-800 animate-in fade-in zoom-in">
//               <CheckCircle2 size={16}/> <span className="text-xs font-bold">Enregistré</span>
//             </div>
//           )}
//         </div>

//         {/* Alert SAMI Sync */}
//         {samiAlert && (
//           <div className="p-4 bg-orange-50 dark:bg-orange-950/20 border-l-4 border-orange-400 rounded-r-2xl mb-6 flex items-center gap-4 animate-in slide-in-from-right-4">
//             <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm">
//               <Sparkles size={18} className="text-orange-500 animate-pulse"/>
//             </div>
//             <p className="text-sm text-orange-800 dark:text-orange-300 font-medium leading-tight">
//               SAMI a détecté de nouvelles informations ! <br/>
//               <span className="text-[11px] opacity-80 italic">Pense à sauvegarder pour confirmer les changements.</span>
//             </p>
//           </div>
//         )}

//         {/* Cards Statistiques */}
//         <div className="grid grid-cols-3 gap-4 mb-8">
//           {[
//             { icon: BarChart3, val: avgVal > 0 ? `${avgVal}/20` : '—', label: 'Moyenne', color: 'text-orange-500' },
//             { icon: Brain, val: bacVal || '—', label: 'Série BAC', color: 'text-purple-500' },
//             { icon: Target, val: fitEst ? `${fitEst}%` : '—', label: 'FitScore', color: fitEst && fitEst >= 70 ? 'text-[#005555]' : 'text-orange-400' },
//           ].map((card, i) => (
//             <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm text-center">
//               <card.icon size={18} className={`${card.color} mx-auto mb-2 opacity-80`}/>
//               <div className="text-lg font-black text-slate-900 dark:text-white truncate px-1">{card.val}</div>
//               <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{card.label}</div>
//             </div>
//           ))}
//         </div>

//         {/* Formulaire Principal */}
//         <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl">
//           {loading ? (
//             <div className="flex flex-col items-center py-20 gap-4 text-slate-400">
//               <Loader2 size={32} className="animate-spin text-[#005555]"/>
//               <span className="text-xs font-bold uppercase tracking-widest">Synchronisation...</span>
//             </div>
//           ) : (
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
//               {/* Nom Complet */}
//               <div className="group">
//                 <label className={lbl}>Identité</label>
//                 <div className="relative">
//                   <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#005555]" size={18}/>
//                   <input {...register('full_name')} placeholder="Nom et Prénom" className={inp}/>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Moyenne */}
//                 <div className="group">
//                   <label className={lbl}>Moyenne</label>
//                   <div className="relative">
//                     <BarChart3 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#005555]" size={18}/>
//                     <input type="number" step="0.01" {...register('average')} placeholder="Moyenne / 20" className={inp}/>
//                   </div>
//                 </div>

//                 {/* Ville */}
//                 <div className="group">
//                   <label className={lbl}>Localisation</label>
//                   <div className="relative">
//                     <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#005555]" size={18}/>
//                     <input {...register('city')} placeholder="Ville" className={inp}/>
//                   </div>
//                 </div>
//               </div>

//               {/* BAC Type */}
//               <div className="group">
//                 <label className={lbl}>Diplôme de base</label>
//                 <div className="relative space-y-3">
//                   <div className="relative">
//                     <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#005555]" size={18}/>
//                     <select
//                       value={bacLibre ? '__autre__' : (watch('bac_type') || '')}
//                       onChange={(e) => {
//                         const val = e.target.value;
//                         if (val === '__autre__') { setBacLibre(true); setValue('bac_type', ''); }
//                         else { setBacLibre(false); setValue('bac_type', val, { shouldDirty: true }); }
//                       }}
//                       className={inp}
//                     >
//                       <option value="">Choisir ton BAC...</option>
//                       <optgroup label="Sciences & Tech">
//                         <option value="SMA">Sciences Maths A</option>
//                         <option value="SMB">Sciences Maths B</option>
//                         <option value="SP">Sciences Physiques</option>
//                         <option value="SVT">SVT</option>
//                       </optgroup>
//                       <optgroup label="Économie & Gestion">
//                         <option value="SEG">Sciences Économiques</option>
//                         <option value="SGC">Sciences Gestion Comptable</option>
//                       </optgroup>
//                       <option value="__autre__">Autre diplôme (Licence, BTS...)</option>
//                     </select>
//                   </div>
//                   {bacLibre && (
//                     <input 
//                       {...register('bac_type')} 
//                       autoFocus 
//                       placeholder="Précisez votre diplôme..." 
//                       className={cn(inp, "border-orange-200 dark:border-orange-900/50 bg-orange-50/30 dark:bg-orange-900/10")} 
//                     />
//                   )}
//                 </div>
//               </div>

//               {/* Niveau Actuel */}
//               <div className="group">
//                 <label className={lbl}>Situation Actuelle</label>
//                 <div className="relative">
//                   <ClipboardList className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#005555]" size={18}/>
//                   <input {...register('level')} placeholder="Ex: Terminale, BAC+2..." className={inp}/>
//                 </div>
//               </div>

//               {/* Intérêts */}
//               <div className="group">
//                 <label className={lbl}>Passions & Intérêts</label>
//                 <div className="relative">
//                   <Sparkles className="absolute left-4 top-4 text-slate-400 group-focus-within:text-[#005555]" size={18}/>
//                   <textarea {...register('interests')} rows={3} placeholder="IA, Finance, Développement web..." className={cn(inp, "pl-11 pt-3 resize-none")}/>
//                 </div>
//               </div>

//               {/* Bouton de sauvegarde */}
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 style={{ backgroundColor: colors.teal }}
//                 className="w-full py-4 rounded-2xl font-black text-white transition-all flex justify-center items-center gap-3 active:scale-[0.97] hover:opacity-90 shadow-xl shadow-[#005555]/20 disabled:opacity-50"
//               >
//                 {isSubmitting ? <Loader2 size={20} className="animate-spin"/> : <Save size={20}/>}
//                 <span>{isDirty ? 'Enregistrer les modifications' : 'Profil à jour'}</span>
//               </button>
//             </form>
//           )}
//         </div>

//         {/* Footer info */}
//         <div className="mt-8 flex items-center justify-center gap-6">
//            <div className="flex items-center gap-2">
//               <div className="w-2 h-2 rounded-full bg-blue-500"></div>
//               <span className="text-[10px] font-bold text-slate-400 uppercase">Sync DB</span>
//            </div>
//            <div className="flex items-center gap-2">
//               <div className={cn("w-2 h-2 rounded-full", profil ? "bg-orange-500 animate-pulse" : "bg-slate-300")}></div>
//               <span className="text-[10px] font-bold text-slate-400 uppercase">SAMI Intelligence</span>
//            </div>
//         </div>
//       </div>
//     </div>
//   );
// }




'use client';
import { useState, useEffect, useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/store/authStore';
import { useSessionStore } from '@/store/sessionStore';
import { useLang } from '@/i18n/LanguageContext'; // Ajouté
import {
  Save, Loader2, CheckCircle2, AlertCircle,
  User, GraduationCap, ArrowLeft,
  Brain, BarChart3, Sparkles, MapPin, Target, ClipboardList
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
const colors = { teal: '#005555', red: '#E31E24' };

function getUid() {
  try { return JSON.parse(localStorage.getItem('supmti-auth')||'{}')?.state?.user?.id||''; }
  catch { return ''; }
}

const schema = z.object({
  full_name: z.string().min(2, 'Nom requis'),
  average: z.coerce.number().min(0).max(20),
  bac_type: z.string().min(1, 'BAC requis'),
  level: z.string().min(1, 'Niveau requis'),
  city: z.string().min(1, 'Ville requise'),
  interests: z.string().min(2, 'Intérêts requis'),
});
type V = z.infer<typeof schema>;

const inp = "w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-[#005555] focus:ring-4 focus:ring-[#005555]/5 transition-all shadow-sm placeholder:text-slate-400";
const lbl = "block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 ml-4";

const BAC_CONNUS = [
  'SMA', 'SMB', 'SP', 'SVT', 'STE', 'STM', 'STGC',
  'SEG', 'SGC', 'LSH', 'S', 'SM', 'D', 'E', 'C', 'L', 'A',
  'BAC_GENERAL_FR', 'PC', 'Eco', 'Info', 'Lettres',
];

function mergeWithSami(base: Partial<V>, profil: any): V {
  const info = profil?.informations_personnelles || {};
  const acad = profil?.parcours_academique || {};
  const inter = profil?.preferences?.centres_interet || [];

  return {
    full_name: (info.prenom ? `${info.prenom} ${info.nom || ''}`.trim() : '') || base.full_name || '',
    average: acad.moyenne_generale > 0 ? acad.moyenne_generale : Number(base.average) || 0,
    bac_type: (acad.type_bac && acad.type_bac !== 'AUTRE' ? acad.type_bac : '') || base.bac_type || '',
    level: (acad.niveau_actuel || acad.diplome_actuel || '') || base.level || '',
    city: info.ville || base.city || '',
    interests: inter.length > 0 ? inter.join(', ') : base.interests || '',
  };
}

export default function ProfilePage() {
  const { user, setAuth, token } = useAuthStore();
  const { profil } = useSessionStore();
  const { t, isRTL } = useLang(); // Ajouté

  const [status, setStatus] = useState<'idle'|'success'|'error'>('idle');
  const [apiError, setApiError] = useState<string|null>(null);
  const [loading, setLoading] = useState(true);
  const [dbBase, setDbBase] = useState<Partial<V>>({});
  const [samiAlert, setSamiAlert] = useState(false);
  const [bacLibre, setBacLibre] = useState(false);

  const { register, handleSubmit, reset, watch, setValue,
    formState: { errors, isSubmitting, isDirty } } = useForm<V>({
    // zodResolver can produce a resolver type with `unknown` for coerced values;
    // cast to any to satisfy the useForm generic V where average is number.
    resolver: zodResolver(schema) as any,
    defaultValues: { full_name:'', average:0, bac_type:'', level:'', city:'', interests:'' },
  });

  const loadFromDB = useCallback(async () => {
    const uid = getUid();
    if (!uid) { setLoading(false); return; }
    try {
      const res = await fetch(`${API}/api/profil`, {
        credentials: 'include',
        headers: { 'X-User-Id': uid },
      });
      const data = await res.json();
      const samiProfil = data.profil || data;
      const interetsDB = Array.isArray(data.interests) ? data.interests : samiProfil?.preferences?.centres_interet || [];

      const base: Partial<V> = {
        full_name: data.full_name || user?.full_name || '',
        average: Number(data.average) || 0,
        bac_type: data.bac_type || '',
        level: data.level || '',
        city: data.city || '',
        interests: interetsDB.length > 0 ? interetsDB.join(', ') : '',
      };
      setDbBase(base);
      const merged = mergeWithSami(base, profil);
      reset(merged);
      if (merged.bac_type && !BAC_CONNUS.includes(merged.bac_type)) setBacLibre(true);
    } catch {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [profil, user, reset]);

  useEffect(() => { loadFromDB(); }, []);

  useEffect(() => {
    if (!profil || loading) return;
    const merged = mergeWithSami(dbBase, profil);
    reset(merged, { keepDirty: false });
    setBacLibre(merged.bac_type && !BAC_CONNUS.includes(merged.bac_type) ? true : false);
    setSamiAlert(true);
    const t = setTimeout(() => setSamiAlert(false), 6000);
    return () => clearTimeout(t);
  }, [profil]);

  const onSubmit: SubmitHandler<V> = async (data) => {
    setApiError(null); setStatus('idle');
    try {
      const payload = { ...data, interests: data.interests.split(',').map(i => i.trim()).filter(Boolean), user_id: user?.id };
      const res = await fetch(`${API}/api/profil`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'X-User-Id': user?.id || '' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) { setStatus('error'); return; }
      setAuth({ ...user, ...data, id: user?.id ?? '', interests: payload.interests, email: (data as any).email ?? user?.email ?? '', role: (user?.role ?? 'student') }, token! as any);
      setDbBase(data);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch { setStatus('error'); }
  };

  const avgVal = watch('average');
  const bacVal = watch('bac_type');
  const lvlVal = watch('level');
  const fitEst = avgVal > 0 ? Math.min(100, Math.round((avgVal / 20) * 60 + (bacVal ? 20 : 0) + (lvlVal ? 20 : 0))) : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 transition-colors duration-300" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-2xl mx-auto">
        
        {/* Header avec Logo et Marque */}
        <div className="text-center mb-10">
          <img src="/images/logo-supmti.png" alt="SUPMTI" className="h-16 mx-auto mb-6 dark:brightness-110" />
          <div className="w-full flex h-2 rounded-full overflow-hidden shadow-inner bg-white dark:bg-slate-900">
            <div className="h-full w-[30%]" style={{ backgroundColor: colors.red }} />
            <div className="h-full w-[70%]" style={{ backgroundColor: colors.teal }} />
          </div>
        </div>

        {/* Navigation & Titre */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/chatbot" className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-[#005555] transition-all shadow-sm">
              <ArrowLeft size={20} className={isRTL ? 'rotate-180' : ''}/>
            </Link>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{t('profile', 'title')}</h1>
          </div>
          {status === 'success' && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border border-emerald-100 dark:border-emerald-800 animate-in fade-in zoom-in">
              <CheckCircle2 size={16}/> <span className="text-xs font-bold">{t('profile', 'saved')}</span>
            </div>
          )}
        </div>

        {/* Alert SAMI Sync */}
        {samiAlert && (
          <div className="p-4 bg-orange-50 dark:bg-orange-950/20 border-l-4 border-orange-400 rounded-r-2xl mb-6 flex items-center gap-4 animate-in slide-in-from-right-4">
            <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm">
              <Sparkles size={18} className="text-orange-500 animate-pulse"/>
            </div>
            <p className="text-sm text-orange-800 dark:text-orange-300 font-medium leading-tight">
              {t('profile', 'sami_alert')} <br/>
              <span className="text-[11px] opacity-80 italic">{t('profile', 'sami_hint')}</span>
            </p>
          </div>
        )}

        {/* Cards Statistiques */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: BarChart3, val: avgVal > 0 ? `${avgVal}/20` : '—', label: t('profile', 'stat_avg'), color: 'text-orange-500' },
            { icon: Brain, val: bacVal || '—', label: t('profile', 'stat_bac'), color: 'text-purple-500' },
            { icon: Target, val: fitEst ? `${fitEst}%` : '—', label: 'FitScore', color: fitEst && fitEst >= 70 ? 'text-[#005555]' : 'text-orange-400' },
          ].map((card, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm text-center">
              <card.icon size={18} className={`${card.color} mx-auto mb-2 opacity-80`}/>
              <div className="text-lg font-black text-slate-900 dark:text-white truncate px-1">{card.val}</div>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{card.label}</div>
            </div>
          ))}
        </div>

        {/* Formulaire Principal */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl">
          {loading ? (
            <div className="flex flex-col items-center py-20 gap-4 text-slate-400">
              <Loader2 size={32} className="animate-spin text-[#005555]"/>
              <span className="text-xs font-bold uppercase tracking-widest">{t('profile', 'syncing')}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Nom Complet */}
              <div className="group">
                <label className={lbl}>{t('profile', 'label_id')}</label>
                <div className="relative">
                  <User className={cn("absolute top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#005555]", isRTL ? "right-4" : "left-4")} size={18}/>
                  <input {...register('full_name')} placeholder={t('profile', 'ph_name')} className={cn(inp, isRTL ? "pr-11 pl-4" : "pl-11 pr-4")}/>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Moyenne */}
                <div className="group">
                  <label className={lbl}>{t('profile', 'label_avg')}</label>
                  <div className="relative">
                    <BarChart3 className={cn("absolute top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#005555]", isRTL ? "right-4" : "left-4")} size={18}/>
                    <input type="number" step="0.01" {...register('average')} placeholder="Moyenne / 20" className={cn(inp, isRTL ? "pr-11 pl-4" : "pl-11 pr-4")}/>
                  </div>
                </div>

                {/* Ville */}
                <div className="group">
                  <label className={lbl}>{t('profile', 'label_loc')}</label>
                  <div className="relative">
                    <MapPin className={cn("absolute top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#005555]", isRTL ? "right-4" : "left-4")} size={18}/>
                    <input {...register('city')} placeholder={t('profile', 'ph_city')} className={cn(inp, isRTL ? "pr-11 pl-4" : "pl-11 pr-4")}/>
                  </div>
                </div>
              </div>

              {/* BAC Type */}
              <div className="group">
                <label className={lbl}>{t('profile', 'label_bac')}</label>
                <div className="relative space-y-3">
                  <div className="relative">
                    <GraduationCap className={cn("absolute top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#005555]", isRTL ? "right-4" : "left-4")} size={18}/>
                    <select
                      value={bacLibre ? '__autre__' : (watch('bac_type') || '')}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '__autre__') { setBacLibre(true); setValue('bac_type', ''); }
                        else { setBacLibre(false); setValue('bac_type', val, { shouldDirty: true }); }
                      }}
                      className={cn(inp, isRTL ? "pr-11 pl-4" : "pl-11 pr-4")}
                    >
                      <option value="">{t('profile', 'ph_bac')}</option>
                      <optgroup label="Sciences & Tech">
                        <option value="SMA">Sciences Maths A</option>
                        <option value="SMB">Sciences Maths B</option>
                        <option value="SP">Sciences Physiques</option>
                        <option value="SVT">SVT</option>
                      </optgroup>
                      <optgroup label="Économie & Gestion">
                        <option value="SEG">Sciences Économiques</option>
                        <option value="SGC">Sciences Gestion Comptable</option>
                      </optgroup>
                      <option value="__autre__">Autre diplôme (Licence, BTS...)</option>
                    </select>
                  </div>
                  {bacLibre && (
                    <input 
                      {...register('bac_type')} 
                      autoFocus 
                      placeholder={t('profile', 'ph_bac_other')} 
                      className={cn(inp, "border-orange-200 dark:border-orange-900/50 bg-orange-50/30 dark:bg-orange-900/10", isRTL ? "pr-11 pl-4" : "pl-11 pr-4")} 
                    />
                  )}
                </div>
              </div>

              {/* Niveau Actuel */}
              <div className="group">
                <label className={lbl}>{t('profile', 'label_status')}</label>
                <div className="relative">
                  <ClipboardList className={cn("absolute top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#005555]", isRTL ? "right-4" : "left-4")} size={18}/>
                  <input {...register('level')} placeholder={t('profile', 'ph_level')} className={cn(inp, isRTL ? "pr-11 pl-4" : "pl-11 pr-4")}/>
                </div>
              </div>

              {/* Intérêts */}
              <div className="group">
                <label className={lbl}>{t('profile', 'label_interests')}</label>
                <div className="relative">
                  <Sparkles className={cn("absolute top-4 text-slate-400 group-focus-within:text-[#005555]", isRTL ? "right-4" : "left-4")} size={18}/>
                  <textarea {...register('interests')} rows={3} placeholder={t('profile', 'ph_interests')} className={cn(inp, "pt-3 resize-none", isRTL ? "pr-11 pl-4" : "pl-11 pr-4")}/>
                </div>
              </div>

              {/* Bouton de sauvegarde */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{ backgroundColor: colors.teal }}
                className="w-full py-4 rounded-2xl font-black text-white transition-all flex justify-center items-center gap-3 active:scale-[0.97] hover:opacity-90 shadow-xl shadow-[#005555]/20 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={20} className="animate-spin"/> : <Save size={20}/>}
                <span>{isDirty ? t('profile', 'btn_save') : t('profile', 'btn_up_to_date')}</span>
              </button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-8 flex items-center justify-center gap-6">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Sync DB</span>
           </div>
           <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", profil ? "bg-orange-500 animate-pulse" : "bg-slate-300")}></div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">SAMI Intelligence</span>
           </div>
        </div>
      </div>
    </div>
  );
}