// // src/app/profile/page.tsx
// 'use client';
// import { useState, useEffect } from 'react';
// import { useForm, SubmitHandler } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { useAuthStore }    from '@/store/authStore';
// import { useSessionStore } from '@/store/sessionStore';
// import { Save, Loader2, CheckCircle2, AlertCircle, User, GraduationCap, ArrowLeft, RefreshCw, Brain, BarChart3, MapPin, Sparkles } from 'lucide-react';
// import Link from 'next/link';

// const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
// function getUid() {
//   try { return JSON.parse(localStorage.getItem('supmti-auth')||'{}')?.state?.user?.id||''; }
//   catch { return ''; }
// }

// const profileSchema = z.object({
//   full_name: z.string().min(2, 'Nom requis'),
//   average:   z.coerce.number().min(0).max(20),
//   bac_type:  z.string().min(1, 'Type de Bac requis'),
//   level:     z.string().min(1, 'Niveau requis'),
//   city:      z.string().min(1, 'Ville requise'),
//   interests: z.string().min(2, 'Intérêts requis'),
// });
// type ProfileValues = z.infer<typeof profileSchema>;

// const inputCls = "w-full p-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-supmti-blue/20 focus:border-supmti-blue dark:focus:border-blue-500 outline-none transition-all shadow-sm placeholder:text-gray-400";
// const labelCls = "block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1";

// export default function ProfilePage() {
//   const { user, setAuth, token } = useAuthStore();
//   const { profil }               = useSessionStore();

//   const [status,      setStatus]      = useState<'idle'|'success'|'error'>('idle');
//   const [apiError,    setApiError]    = useState<string|null>(null);
//   const [loadingDB,   setLoadingDB]   = useState(true);
//   const [dbData,      setDbData]      = useState<any>(null);
//   const [samiSource,  setSamiSource]  = useState(false); // indique si des champs viennent de SAMI

//   const { register, handleSubmit, reset, setValue, watch,
//     formState: { errors, isSubmitting, isDirty } } = useForm<ProfileValues>({
//     resolver: zodResolver(profileSchema),
//     defaultValues: {
//       full_name: '', average: 0, bac_type: '', level: '', city: '', interests: '',
//     },
//   });

//   // ── 1. Charger depuis la DB au montage ────────────────────
//   useEffect(() => {
//     const uid = getUid();
//     if (!uid) { setLoadingDB(false); return; }

//     fetch(`${API}/api/profil`, {
//       credentials: 'include',
//       headers: { 'X-User-Id': uid },
//     })
//       .then(r => r.json())
//       .then(data => {
//         setDbData(data);
//         const interests = Array.isArray(data.interests)
//           ? data.interests.join(', ')
//           : data.interests || '';
//         reset({
//           full_name: data.full_name || user?.full_name || '',
//           average:   Number(data.average) || 0,
//           bac_type:  data.bac_type || '',
//           level:     data.level    || '',
//           city:      data.city     || '',
//           interests,
//         });
//       })
//       .catch(() => {
//         // Fallback sur authStore si DB inaccessible
//         reset({
//           full_name: user?.full_name || '',
//           average:   Number((user as any)?.average) || 0,
//           bac_type:  (user as any)?.bac_type || '',
//           level:     (user as any)?.level    || '',
//           city:      (user as any)?.city     || '',
//           interests: Array.isArray((user as any)?.interests)
//             ? (user as any).interests.join(', ')
//             : (user as any)?.interests || '',
//         });
//       })
//       .finally(() => setLoadingDB(false));
//   }, []);

//   // ── 2. Synchroniser depuis la session SAMI en temps réel ─
//   useEffect(() => {
//     if (!profil) return;
//     const info = profil.informations_personnelles || {};
//     const acad = profil.parcours_academique       || {};
//     const inter= profil.interets                  || [];

//     let changed = false;

//     if (acad.moyenne_generale && acad.moyenne_generale > 0) {
//       setValue('average', acad.moyenne_generale, { shouldDirty: true });
//       changed = true;
//     }
//     if (acad.type_bac && acad.type_bac !== 'AUTRE') {
//       setValue('bac_type', acad.type_bac, { shouldDirty: true });
//       changed = true;
//     }
//     if (info.prenom && !watch('full_name')) {
//       const nom = `${info.prenom} ${info.nom || ''}`.trim();
//       setValue('full_name', nom, { shouldDirty: true });
//       changed = true;
//     }
//     if (info.ville) {
//       setValue('city', info.ville, { shouldDirty: true });
//       changed = true;
//     }
//     if (acad.niveau_etude) {
//       setValue('level', acad.niveau_etude, { shouldDirty: true });
//       changed = true;
//     }
//     if (inter.length > 0) {
//       setValue('interests', inter.join(', '), { shouldDirty: true });
//       changed = true;
//     }

//     if (changed) setSamiSource(true);
//   }, [profil]);

//   // ── 3. Écouter les mises à jour du chat ──────────────────
//   useEffect(() => {
//     const handler = () => {
//       // Déclenche re-render pour re-sync profil SAMI
//       setSamiSource(prev => prev);
//     };
//     window.addEventListener('sami:profile-updated', handler);
//     return () => window.removeEventListener('sami:profile-updated', handler);
//   }, []);

//   const onSubmit: SubmitHandler<ProfileValues> = async (data) => {
//     setApiError(null); setStatus('idle');
//     if (!user?.id) { setApiError('Non connecté.'); setStatus('error'); return; }

//     try {
//       const payload = {
//         ...data,
//         interests: data.interests.split(',').map(i => i.trim()).filter(Boolean),
//         user_id: user.id,
//       };
//       const res = await fetch(`${API}/api/profil`, {
//         method: 'PUT', credentials: 'include',
//         headers: { 'Content-Type': 'application/json', 'X-User-Id': user.id },
//         body: JSON.stringify(payload),
//       });
//       const json = await res.json().catch(() => ({}));
//       if (!res.ok) { setApiError(json.detail || 'Erreur mise à jour.'); setStatus('error'); return; }

//       setAuth({ ...user, ...data, interests: payload.interests }, token!);
//       setStatus('success');
//       setSamiSource(false);
//       setTimeout(() => setStatus('idle'), 3000);
//     } catch {
//       setApiError('Impossible de joindre le serveur.');
//       setStatus('error');
//     }
//   };

//   // Valeurs observées pour les badges
//   const avgVal  = watch('average');
//   const bacVal  = watch('bac_type');
//   const lvlVal  = watch('level');

//   // FitScore estimé (simple)
//   const fitEstimate = avgVal > 0
//     ? Math.min(100, Math.round((avgVal / 20) * 60 + (bacVal ? 20 : 0) + (lvlVal ? 20 : 0)))
//     : null;

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-8 px-4">
//       <div className="max-w-2xl mx-auto">

//         {/* Header */}
//         <div className="flex items-center gap-4 mb-8">
//           <Link href="/chatbot" className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:text-supmti-blue transition-colors shadow-sm">
//             <ArrowLeft size={18} />
//           </Link>
//           <div className="flex items-center gap-3">
//             <div className="p-2.5 bg-supmti-blue/10 dark:bg-blue-900/20 rounded-xl">
//               <GraduationCap size={24} className="text-supmti-blue dark:text-blue-400" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-black text-gray-900 dark:text-white">Mon Profil</h1>
//               {user?.email && (
//                 <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
//                   <User size={12} />{user.email}
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Banner SAMI sync */}
//         {samiSource && (
//           <div className="p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/30 rounded-2xl mb-4 flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
//             <Sparkles size={16} className="text-orange-500 shrink-0" />
//             <p className="text-sm text-orange-700 dark:text-orange-300 flex-1">
//               <strong>SAMI a mis à jour ton profil</strong> depuis la conversation. Vérifie les champs et sauvegarde.
//             </p>
//             <button onClick={() => setSamiSource(false)} className="text-orange-400 hover:text-orange-600 text-xs font-bold">✕</button>
//           </div>
//         )}

//         {/* Info banner */}
//         <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl mb-6">
//           <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
//             💡 Ces informations sont utilisées par <strong>SAMI</strong> pour calculer ton{' '}
//             <strong>FitScore</strong>. Plus ton profil est complet, plus les recommandations sont précises.
//           </p>
//         </div>

//         {/* Cards aperçu */}
//         <div className="grid grid-cols-3 gap-3 mb-6">
//           <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm text-center">
//             <BarChart3 size={20} className="text-orange-500 mx-auto mb-1" />
//             <p className="text-xl font-black text-gray-900 dark:text-white">{avgVal > 0 ? `${avgVal}/20` : '—'}</p>
//             <p className="text-[10px] text-gray-400 uppercase tracking-widest">Moyenne</p>
//           </div>
//           <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm text-center">
//             <Brain size={20} className="text-purple-500 mx-auto mb-1" />
//             <p className="text-xl font-black text-gray-900 dark:text-white">{bacVal || '—'}</p>
//             <p className="text-[10px] text-gray-400 uppercase tracking-widest">BAC</p>
//           </div>
//           <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm text-center">
//             <Sparkles size={20} className="text-emerald-500 mx-auto mb-1" />
//             <p className={`text-xl font-black ${fitEstimate && fitEstimate >= 70 ? 'text-emerald-500' : fitEstimate ? 'text-orange-500' : 'text-gray-400'}`}>
//               {fitEstimate ? `${fitEstimate}%` : '—'}
//             </p>
//             <p className="text-[10px] text-gray-400 uppercase tracking-widest">FitScore est.</p>
//           </div>
//         </div>

//         {/* Formulaire */}
//         <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">

//           {loadingDB ? (
//             <div className="flex items-center justify-center py-12 gap-3 text-gray-400">
//               <Loader2 size={20} className="animate-spin" /><span>Chargement du profil…</span>
//             </div>
//           ) : (
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

//               {/* Feedback */}
//               {status === 'success' && (
//                 <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
//                   <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
//                   <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Profil sauvegardé !</p>
//                 </div>
//               )}
//               {status === 'error' && apiError && (
//                 <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
//                   <AlertCircle size={16} className="text-red-500 shrink-0" />
//                   <p className="text-xs font-medium text-red-600 dark:text-red-400">{apiError}</p>
//                 </div>
//               )}

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 <div className="space-y-1 md:col-span-2">
//                   <label className={labelCls}>Nom Complet</label>
//                   <input {...register('full_name')} className={inputCls} />
//                   {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
//                 </div>

//                 <div className="space-y-1">
//                   <label className={labelCls}>Moyenne Générale (/20)</label>
//                   <input type="number" step="0.01" min="0" max="20" {...register('average')} className={inputCls} />
//                   {errors.average && <p className="text-red-500 text-xs mt-1">{errors.average.message}</p>}
//                 </div>

//                 <div className="space-y-1">
//                   <label className={labelCls}>Type de BAC</label>
//                   <select {...register('bac_type')} className={inputCls}>
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
//                   <label className={labelCls}>Niveau Actuel</label>
//                   <input {...register('level')} placeholder="Ex: Terminale, 1ère année…" className={inputCls} />
//                   {errors.level && <p className="text-red-500 text-xs mt-1">{errors.level.message}</p>}
//                 </div>

//                 <div className="space-y-1">
//                   <label className={labelCls}>Ville</label>
//                   <input {...register('city')} placeholder="Ex: Meknès, Fès…" className={inputCls} />
//                   {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
//                 </div>

//                 <div className="space-y-1 md:col-span-2">
//                   <label className={labelCls}>Centres d'intérêt</label>
//                   <textarea {...register('interests')} rows={3} placeholder="Ex: Programmation, IA, Réseaux…" className={`${inputCls} resize-none`} />
//                   {errors.interests && <p className="text-red-500 text-xs mt-1">{errors.interests.message}</p>}
//                   <p className="text-[10px] text-gray-400 ml-1">Séparés par des virgules — utilisés par SAMI</p>
//                 </div>
//               </div>

//               <button type="submit" disabled={isSubmitting}
//                 className="flex items-center justify-center gap-2 w-full bg-supmti-blue dark:bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-800 dark:hover:bg-blue-700 transition-all shadow-lg disabled:opacity-70 hover:scale-[1.01] active:scale-95">
//                 {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
//                 {isSubmitting ? 'Sauvegarde…' : isDirty ? '💾 Sauvegarder les modifications' : 'Profil à jour'}
//               </button>
//             </form>
//           )}
//         </div>

//         {/* Source des données */}
//         <div className="mt-4 p-3 rounded-xl bg-gray-100 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700">
//           <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-2">Sources des données</p>
//           <div className="flex flex-wrap gap-2">
//             <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold">
//               🗄️ Base de données
//             </span>
//             <span className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg font-bold ${profil ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400' : 'bg-gray-50 dark:bg-slate-700 text-gray-400'}`}>
//               🤖 SAMI {profil ? '● Actif' : '● Inactif'}
//             </span>
//             <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 font-bold">
//               ✏️ Saisie manuelle
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }