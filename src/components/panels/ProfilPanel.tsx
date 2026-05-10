// 'use client';
// import { User, MapPin, GraduationCap, BarChart, Lightbulb, Target, MessageSquare } from 'lucide-react';
// import { usePanelStore }   from '@/store/panelStore';
// import { useSessionStore } from '@/store/sessionStore';
// import { ActionBtn } from './ui';
// import { cn } from '@/lib/utils';

// export const ProfilPanel = () => {
//   const { closePanel } = usePanelStore();
//   const { profil }     = useSessionStore();

//   const info  = profil?.informations_personnelles;
//   const parc  = profil?.parcours_academique;
//   const pref  = profil?.preferences;
//   const notes = parc?.notes_matieres || {};
//   const hasProfile = info?.prenom && info.prenom !== 'Étudiant';

//   // --- État Vide : Incitation au Chat ---
//   if (!hasProfile) {
//     return (
//       <div className="flex flex-col items-center text-center py-12 px-6 animate-in fade-in zoom-in-95 duration-500">
//         <div className="relative mb-6">
//           <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full"></div>
//           <div className="relative w-20 h-20 bg-slate-900 border border-white/10 rounded-3xl flex items-center justify-center text-4xl shadow-2xl">
//             👤
//           </div>
//         </div>
//         <h3 className="font-black text-white text-lg mb-2 uppercase tracking-tight">Identité inconnue</h3>
//         <p className="text-xs text-slate-400 leading-relaxed mb-8">
//           SAMI n'a pas encore assez de données pour dresser ton profil. Parle-lui de ton <span className="text-orange-400 font-bold">parcours</span> ou de tes <span className="text-orange-400 font-bold">ambitions</span>.
//         </p>
//         <div className="w-full p-4 bg-white/[0.03] border border-dashed border-white/10 rounded-2xl mb-6">
//           <p className="text-[10px] text-slate-500 italic">"Je m'appelle Corneil, j'ai un BAC Info et je vise un Master en IA."</p>
//         </div>
//         <ActionBtn onClick={() => closePanel()} className="w-full bg-[#006666] text-white py-4 font-bold">
//           <MessageSquare size={18} className="mr-2" /> Compléter mon profil
//         </ActionBtn>
//       </div>
//     );
//   }

//   // --- Sous-composants Sublimés ---
//   const Row = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: string, color?: string }) => (
//     <div className="flex items-center gap-4 px-4 py-3 border-b border-slate-100 dark:border-white/[0.03] last:border-none hover:bg-slate-50 dark:hover:bg-white/[0.01] transition-colors">
//       <div className={cn("shrink-0 p-1.5 rounded-lg bg-slate-100 dark:bg-white/5", color || "text-slate-400")}>
//         <Icon size={14} />
//       </div>
//       <div className="flex flex-col">
//         <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</span>
//         <span className="text-[13px] text-slate-700 dark:text-slate-200 font-bold leading-tight">{value}</span>
//       </div>
//     </div>
//   );

//   const Section = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
//     <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/[0.07] rounded-2xl overflow-hidden mb-5 shadow-sm">
//       <div className="px-4 py-2.5 bg-slate-50 dark:bg-white/[0.03] border-b border-slate-200 dark:border-white/[0.07] flex items-center gap-2">
//         <Icon size={12} className="text-orange-500" />
//         <h3 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">{title}</h3>
//       </div>
//       <div className="divide-y divide-slate-100 dark:divide-white/[0.03]">
//         {children}
//       </div>
//     </div>
//   );

//   return (
//     <div className="animate-in slide-in-from-bottom-4 duration-500">
//       {/* Header Profil */}
//       <div className="flex items-center gap-4 mb-8 px-1">
//         <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#006666] to-emerald-600 flex items-center justify-center text-white shadow-xl">
//           <User size={28} />
//         </div>
//         <div>
//           <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tighter">
//             {info?.prenom}
//           </h2>
//           <div className="flex items-center gap-2 mt-0.5">
//              <div className={cn(
//                "h-2 w-2 rounded-full",
//                profil?.statut_profil === 'complet' ? 'bg-emerald-500 animate-pulse' : 'bg-orange-500'
//              )} />
//              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
//                Profil {profil?.statut_profil}
//              </span>
//           </div>
//         </div>
//       </div>

//       {/* Sections de données */}
//       <Section title="Informations" icon={User}>
//         {info?.prenom && <Row icon={User} label="Prénom" value={info.prenom} />}
//         {(info?.ville || info?.pays) && (
//           <Row icon={MapPin} label="Localisation" value={`${info.ville || ''}${info.ville && info.pays ? ', ' : ''}${info.pays || ''}`} />
//         )}
//       </Section>

//       <Section title="Cursus" icon={GraduationCap}>
//         {parc?.type_bac && parc.type_bac !== 'AUTRE' && (
//           <Row icon={GraduationCap} label="Diplôme BAC" value={parc.label_bac || parc.type_bac} color="text-blue-500" />
//         )}
//         {parc?.moyenne_generale && parc.moyenne_generale > 0 && (
//           <Row icon={BarChart} label="Performance" value={`${parc.moyenne_generale}/20 — ${parc.mention || 'Passable'}`} color="text-emerald-500" />
//         )}
//         {parc?.niveau_actuel && (
//           <Row icon={Target} label="Niveau actuel" value={parc.niveau_actuel} />
//         )}
//         {Object.keys(notes).length > 0 && (
//           <div className="p-4 bg-slate-50 dark:bg-white/[0.02]">
//              <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Relevé partiel</p>
//              <div className="flex flex-wrap gap-2">
//                 {Object.entries(notes).map(([m, n]) => (
//                   <span key={m} className="px-2 py-1 rounded-md bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] font-bold text-slate-600 dark:text-slate-300">
//                     {m}: <span className="text-[#006666]">{n}</span>
//                   </span>
//                 ))}
//              </div>
//           </div>
//         )}
//       </Section>

//       {pref?.centres_interet && pref.centres_interet.length > 0 && (
//         <Section title="Objectifs" icon={Lightbulb}>
//           <Row icon={Lightbulb} label="Centres d'intérêt" value={pref.centres_interet.join(', ')} color="text-yellow-500" />
//           {pref.ambition_professionnelle && (
//             <Row icon={Target} label="Ambition" value={pref.ambition_professionnelle} color="text-rose-500" />
//           )}
//         </Section>
//       )}

//       {/* Footer info */}
//       <p className="text-[10px] text-slate-400 text-center mt-6 italic">
//         Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
//       </p>
//     </div>
//   );
// };



// ============================================================
// FIX — ProfilPanel.tsx
//
// PROBLÈMES CORRIGÉS :
// 1. La sauvegarde envoie maintenant `level` normalisé
//    ET `diplome_actuel` séparément
// 2. L'affichage de la mention utilise la valeur retournée
//    par le backend (plus de calcul côté frontend incohérent)
// 3. Le champ "Diplôme BAC" détecte si c'est un diplôme
//    post-BAC et remplit diplome_actuel correctement
// ============================================================

// 'use client';
// import { useState, useEffect } from 'react';
// import { useChatStore }    from '@/store/chatStore';
// import { useSessionStore } from '@/store/sessionStore';

// const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// function getUserId(): string {
//   try {
//     const raw = localStorage.getItem('supmti-auth');
//     if (!raw) return '';
//     return JSON.parse(raw)?.state?.user?.id || '';
//   } catch { return ''; }
// }

// // Normaliser niveau côté frontend (miroir du backend)
// function normaliserNiveau(diplome: string): string {
//   const d = diplome.toLowerCase();
//   if (/dut|bts|deug|deust|cpge|technicien|ts |bac\+2|bac 2/.test(d)) return 'bac2';
//   if (/licence|bachelor|l3|l2|bac\+3|bac 3/.test(d)) return 'bac3';
//   if (/master|m1|m2|ingénieur|ingenieur|bac\+4|bac\+5/.test(d)) return 'bac4';
//   if (/bac\+1|prépa|prepa|bac 1/.test(d)) return 'bac1';
//   if (/terminale|baccalauréat|lycée/.test(d)) return 'post_bac';
//   return 'post_bac';
// }

// // Détecter si un texte est un diplôme post-BAC
// function estDiplomePostBac(val: string): boolean {
//   return /dut|bts|deug|licence|bachelor|master|ingénieur|ingenieur|l[23]|m[12]|technicien|cpge/i.test(val);
// }

// const NIVEAUX = [
//   { value: 'post_bac', label: 'Bachelier / Terminale' },
//   { value: 'bac1',     label: 'BAC+1' },
//   { value: 'bac2',     label: 'BAC+2 (DUT / BTS / DEUG)' },
//   { value: 'bac3',     label: 'BAC+3 (Licence / Bachelor)' },
//   { value: 'bac4',     label: 'BAC+4/5 (Master / Ingénieur)' },
// ];

// export default function ProfilPanel() {
//   const { profil, setProfil } = useSessionStore();
//   const info  = profil?.informations_personnelles || {};
//   const parc  = profil?.parcours_academique       || {};
//   const pref  = profil?.preferences               || {};

//   const [prenom,   setPrenom]   = useState(info.prenom     || '');
//   const [ville,    setVille]    = useState(info.ville       || '');
//   const [bac,      setBac]      = useState(parc.type_bac   || parc.diplome_actuel || parc.label_bac || '');
//   const [moyenne,  setMoyenne]  = useState(String(parc.moyenne_generale || ''));
//   const [niveau,   setNiveau]   = useState(parc.niveau_actuel || 'post_bac');
//   const [interets, setInterets] = useState((pref.centres_interet || []).join(', '));
//   const [saving,   setSaving]   = useState(false);
//   const [saved,    setSaved]    = useState(false);
//   const [error,    setError]    = useState('');

//   // Remettre à jour si le profil change (après load session)
//   useEffect(() => {
//     setPrenom(profil?.informations_personnelles?.prenom     || '');
//     setVille (profil?.informations_personnelles?.ville       || '');
//     setBac   (profil?.parcours_academique?.diplome_actuel   || profil?.parcours_academique?.type_bac || profil?.parcours_academique?.label_bac || '');
//     setMoyenne(String(profil?.parcours_academique?.moyenne_generale || ''));
//     setNiveau (profil?.parcours_academique?.niveau_actuel    || 'post_bac');
//     setInterets((profil?.preferences?.centres_interet || []).join(', '));
//   }, [profil]);

//   // Auto-détecter le niveau quand le champ bac change
//   const handleBacChange = (val: string) => {
//     setBac(val);
//     if (estDiplomePostBac(val)) {
//       const niv = normaliserNiveau(val);
//       setNiveau(niv);
//     }
//   };

//   const handleSave = async () => {
//     setSaving(true); setError(''); setSaved(false);
//     try {
//       const userId = getUserId();
//       const moy    = parseFloat(moyenne);

//       const payload: Record<string, unknown> = {
//         user_id: userId,
//         city:    ville   || null,
//         interests: interets.split(',').map(s => s.trim()).filter(Boolean),
//       };

//       if (prenom) payload.full_name = prenom;
//       if (!isNaN(moy) && moy > 0) payload.average = moy;

//       // Détecter si bac est un diplôme post-BAC ou un type de bac classique
//       if (bac) {
//         if (estDiplomePostBac(bac)) {
//           payload.diplome_actuel = bac;   // ← envoyé séparément
//           payload.level          = normaliserNiveau(bac);
//           // bac_type reste vide ou on met "AUTRE"
//         } else {
//           payload.bac_type = bac;
//           payload.level    = niveau;
//         }
//       } else {
//         payload.level = niveau;
//       }

//       const res = await fetch(`${API}/api/profil`, {
//         method:  'PUT',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//           ...(userId ? { 'X-User-Id': userId } : {}),
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();
//       if (!res.ok || data.error) throw new Error(data.message || 'Erreur sauvegarde');

//       // Mettre à jour le store local
//       const newProfil = {
//         ...profil,
//         informations_personnelles: { ...info, prenom, ville },
//         parcours_academique: {
//           ...parc,
//           moyenne_generale: !isNaN(moy) ? moy : parc.moyenne_generale,
//           type_bac:  estDiplomePostBac(bac) ? (parc.type_bac || 'AUTRE') : bac,
//           label_bac: bac,
//           diplome_actuel: estDiplomePostBac(bac) ? bac : parc.diplome_actuel,
//           niveau_actuel:  estDiplomePostBac(bac) ? normaliserNiveau(bac) : niveau,
//         },
//         preferences: { ...pref, centres_interet: payload.interests as string[] },
//       };
//       setProfil(newProfil as Parameters<typeof setProfil>[0]);
//       window.dispatchEvent(new CustomEvent('sami:profile-updated'));

//       setSaved(true);
//       setTimeout(() => setSaved(false), 3000);
//     } catch (e: unknown) {
//       setError(e instanceof Error ? e.message : 'Erreur inconnue');
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="flex flex-col gap-5 p-1">
//       <div className="grid grid-cols-2 gap-4">
//         {/* Prénom */}
//         <div className="flex flex-col gap-1.5">
//           <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Prénom</label>
//           <input value={prenom} onChange={e => setPrenom(e.target.value)}
//             placeholder="Votre prénom"
//             className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#006666]/30" />
//         </div>

//         {/* Ville */}
//         <div className="flex flex-col gap-1.5">
//           <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ville</label>
//           <input value={ville} onChange={e => setVille(e.target.value)}
//             placeholder="Votre ville"
//             className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#006666]/30" />
//         </div>
//       </div>

//       {/* Diplôme */}
//       <div className="flex flex-col gap-1.5">
//         <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
//           Diplôme / Type de BAC
//         </label>
//         <input value={bac} onChange={e => handleBacChange(e.target.value)}
//           placeholder="ex: BAC Sciences, DUT Informatique, Licence Web…"
//           className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#006666]/30" />
//         {bac && estDiplomePostBac(bac) && (
//           <p className="text-[11px] text-[#006666]">
//             ✓ Diplôme post-BAC détecté → niveau auto : <strong>{normaliserNiveau(bac).toUpperCase()}</strong>
//           </p>
//         )}
//       </div>

//       {/* Niveau actuel */}
//       <div className="flex flex-col gap-1.5">
//         <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Niveau actuel</label>
//         <select value={niveau} onChange={e => setNiveau(e.target.value)}
//           className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#006666]/30">
//           {NIVEAUX.map(n => (
//             <option key={n.value} value={n.value}>{n.label}</option>
//           ))}
//         </select>
//       </div>

//       {/* Moyenne */}
//       <div className="flex flex-col gap-1.5">
//         <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
//           Moyenne générale (/20)
//         </label>
//         <input
//           type="number" min="0" max="20" step="0.5"
//           value={moyenne} onChange={e => setMoyenne(e.target.value)}
//           placeholder="ex: 14.5"
//           className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#006666]/30" />
//         {moyenne && !isNaN(parseFloat(moyenne)) && (
//           <p className="text-[11px] text-slate-500">
//             {parseFloat(moyenne) >= 18 ? '🏆 Très Bien'
//              : parseFloat(moyenne) >= 16 ? '⭐ Bien'
//              : parseFloat(moyenne) >= 14 ? '✅ Assez Bien'
//              : parseFloat(moyenne) >= 10 ? '📚 Passable'
//              : '⚠️ Insuffisant'}
//           </p>
//         )}
//       </div>

//       {/* Intérêts */}
//       <div className="flex flex-col gap-1.5">
//         <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
//           Centres d'intérêt (séparés par virgule)
//         </label>
//         <textarea value={interets} onChange={e => setInterets(e.target.value)}
//           rows={2}
//           placeholder="informatique, IA, management, finance…"
//           className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#006666]/30 resize-none" />
//       </div>

//       {/* Bouton save */}
//       {error && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>}

//       <button onClick={handleSave} disabled={saving}
//         className="w-full py-3 rounded-xl bg-[#006666] text-white font-bold text-sm shadow-lg hover:bg-[#005555] transition-all disabled:opacity-50">
//         {saving ? 'Sauvegarde…' : saved ? '✅ Profil sauvegardé !' : 'Sauvegarder le profil'}
//       </button>
//     </div>
//   );
// }





// 'use client';
// import { useState, useEffect } from 'react';
// import { useChatStore } from '@/store/chatStore';
// import { useSessionStore } from '@/store/sessionStore';
// import { useLang } from '@/i18n/LanguageContext';

// const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// function getUserId(): string {
//   try {
//     const raw = localStorage.getItem('supmti-auth');
//     if (!raw) return '';
//     return JSON.parse(raw)?.state?.user?.id || '';
//   } catch { return ''; }
// }

// function normaliserNiveau(diplome: string): string {
//   const d = diplome.toLowerCase();
//   if (/dut|bts|deug|deust|cpge|technicien|ts |bac\+2|bac 2/.test(d)) return 'bac2';
//   if (/licence|bachelor|l3|l2|bac\+3|bac 3/.test(d)) return 'bac3';
//   if (/master|m1|m2|ingénieur|ingenieur|bac\+4|bac\+5/.test(d)) return 'bac4';
//   if (/bac\+1|prépa|prepa|bac 1/.test(d)) return 'bac1';
//   if (/terminale|baccalauréat|lycée/.test(d)) return 'post_bac';
//   return 'post_bac';
// }

// function estDiplomePostBac(val: string): boolean {
//   return /dut|bts|deug|licence|bachelor|master|ingénieur|ingenieur|l[23]|m[12]|technicien|cpge/i.test(val);
// }

// export default function ProfilPanel() {
//   const { t } = useLang();
//   const { profil, setProfil } = useSessionStore();
//   const info = profil?.informations_personnelles || {};
//   const parc = profil?.parcours_academique || {};
//   const pref = profil?.preferences || {};

//   const [prenom, setPrenom] = useState(info.prenom || '');
//   const [ville, setVille] = useState(info.ville || '');
//   const [bac, setBac] = useState(parc.type_bac || parc.diplome_actuel || parc.label_bac || '');
//   const [moyenne, setMoyenne] = useState(String(parc.moyenne_generale || ''));
//   const [niveau, setNiveau] = useState(parc.niveau_actuel || 'post_bac');
//   const [interets, setInterets] = useState((pref.centres_interet || []).join(', '));
//   const [saving, setSaving] = useState(false);
//   const [saved, setSaved] = useState(false);
//   const [error, setError] = useState('');

//   const NIVEAUX = [
//     { value: 'post_bac', label: t('profile.levels.post_bac', 'Bachelier / Terminale') },
//     { value: 'bac1', label: t('profile.levels.bac1', 'BAC+1') },
//     { value: 'bac2', label: t('profile.levels.bac2', 'BAC+2 (DUT / BTS / DEUG)') },
//     { value: 'bac3', label: t('profile.levels.bac3', 'BAC+3 (Licence / Bachelor)') },
//     { value: 'bac4', label: t('profile.levels.bac4', 'BAC+4/5 (Master / Ingénieur)') },
//   ];

//   const NOTES_EVALUATION = [
//     { min: 18, text: t('profile.grade_excellent', 'Très Bien') },
//     { min: 16, text: t('profile.grade_good', 'Bien') },
//     { min: 14, text: t('profile.grade_fair', 'Assez Bien') },
//     { min: 10, text: t('profile.grade_pass', 'Passable') },
//     { min: 0, text: t('profile.grade_fail', 'Insuffisant') },
//   ];

//   useEffect(() => {
//     setPrenom(profil?.informations_personnelles?.prenom || '');
//     setVille(profil?.informations_personnelles?.ville || '');
//     setBac(profil?.parcours_academique?.diplome_actuel || profil?.parcours_academique?.type_bac || profil?.parcours_academique?.label_bac || '');
//     setMoyenne(String(profil?.parcours_academique?.moyenne_generale || ''));
//     setNiveau(profil?.parcours_academique?.niveau_actuel || 'post_bac');
//     setInterets((profil?.preferences?.centres_interet || []).join(', '));
//   }, [profil]);

//   const handleBacChange = (val: string) => {
//     setBac(val);
//     if (estDiplomePostBac(val)) {
//       const niv = normaliserNiveau(val);
//       setNiveau(niv);
//     }
//   };

//   const handleSave = async () => {
//     setSaving(true); setError(''); setSaved(false);
//     try {
//       const userId = getUserId();
//       const moy = parseFloat(moyenne);

//       const payload: Record<string, unknown> = {
//         user_id: userId,
//         city: ville || null,
//         interests: interets.split(',').map(s => s.trim()).filter(Boolean),
//       };

//       if (prenom) payload.full_name = prenom;
//       if (!isNaN(moy) && moy > 0) payload.average = moy;

//       if (bac) {
//         if (estDiplomePostBac(bac)) {
//           payload.diplome_actuel = bac;
//           payload.level = normaliserNiveau(bac);
//         } else {
//           payload.bac_type = bac;
//           payload.level = niveau;
//         }
//       } else {
//         payload.level = niveau;
//       }

//       const res = await fetch(`${API}/api/profil`, {
//         method: 'PUT',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//           ...(userId ? { 'X-User-Id': userId } : {}),
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();
//       if (!res.ok || data.error) throw new Error(data.message || t('profile.save_error', 'Erreur sauvegarde'));

//       const newProfil = {
//         ...profil,
//         informations_personnelles: { ...info, prenom, ville },
//         parcours_academique: {
//           ...parc,
//           moyenne_generale: !isNaN(moy) ? moy : parc.moyenne_generale,
//           type_bac: estDiplomePostBac(bac) ? (parc.type_bac || 'AUTRE') : bac,
//           label_bac: bac,
//           diplome_actuel: estDiplomePostBac(bac) ? bac : parc.diplome_actuel,
//           niveau_actuel: estDiplomePostBac(bac) ? normaliserNiveau(bac) : niveau,
//         },
//         preferences: { ...pref, centres_interet: payload.interests as string[] },
//       };
//       setProfil(newProfil as Parameters<typeof setProfil>[0]);
//       window.dispatchEvent(new CustomEvent('sami:profile-updated'));

//       setSaved(true);
//       setTimeout(() => setSaved(false), 3000);
//     } catch (e: unknown) {
//       setError(e instanceof Error ? e.message : t('profile.unknown_error', 'Erreur inconnue'));
//     } finally {
//       setSaving(false);
//     }
//   };

//   const getGradeEvaluation = (note: number) => {
//     return NOTES_EVALUATION.find(evalItem => note >= evalItem.min)?.text || '';
//   };

//   return (
//     <div className="flex flex-col gap-5 p-1">
//       <div className="grid grid-cols-2 gap-4">
//         {/* Prénom */}
//         <div className="flex flex-col gap-1.5">
//           <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
//             {t('profile.first_name', 'Prénom')}
//           </label>
//           <input 
//             value={prenom} 
//             onChange={e => setPrenom(e.target.value)}
//             placeholder={t('profile.placeholders.first_name', 'Votre prénom')}
//             className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#006666]/30" 
//           />
//         </div>

//         {/* Ville */}
//         <div className="flex flex-col gap-1.5">
//           <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
//             {t('profile.city', 'Ville')}
//           </label>
//           <input 
//             value={ville} 
//             onChange={e => setVille(e.target.value)}
//             placeholder={t('profile.placeholders.city', 'Votre ville')}
//             className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#006666]/30" 
//           />
//         </div>
//       </div>

//       {/* Diplôme */}
//       <div className="flex flex-col gap-1.5">
//         <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
//           {t('profile.degree', 'Diplôme / Type de BAC')}
//         </label>
//         <input 
//           value={bac} 
//           onChange={e => handleBacChange(e.target.value)}
//           placeholder={t('profile.placeholders.degree', 'ex: BAC Sciences, DUT Informatique, Licence Web…')}
//           className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#006666]/30" 
//         />
//         {bac && estDiplomePostBac(bac) && (
//           <p className="text-[11px] text-[#006666]">
//             {t('profile.post_bac_detected', '✓ Diplôme post-BAC détecté → niveau auto :')} <strong>{normaliserNiveau(bac).toUpperCase()}</strong>
//           </p>
//         )}
//       </div>

//       {/* Niveau actuel */}
//       <div className="flex flex-col gap-1.5">
//         <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
//           {t('profile.current_level', 'Niveau actuel')}
//         </label>
//         <select 
//           value={niveau} 
//           onChange={e => setNiveau(e.target.value)}
//           className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#006666]/30"
//         >
//           {NIVEAUX.map(n => (
//             <option key={n.value} value={n.value}>{n.label}</option>
//           ))}
//         </select>
//       </div>

//       {/* Moyenne */}
//       <div className="flex flex-col gap-1.5">
//         <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
//           {t('profile.average', 'Moyenne générale (/20)')}
//         </label>
//         <input
//           type="number" 
//           min="0" 
//           max="20" 
//           step="0.5"
//           value={moyenne} 
//           onChange={e => setMoyenne(e.target.value)}
//           placeholder={t('profile.placeholders.average', 'ex: 14.5')}
//           className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#006666]/30" 
//         />
//         {moyenne && !isNaN(parseFloat(moyenne)) && (
//           <p className="text-[11px] text-slate-500">
//             {getGradeEvaluation(parseFloat(moyenne))}
//           </p>
//         )}
//       </div>

//       {/* Intérêts */}
//       <div className="flex flex-col gap-1.5">
//         <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
//           {t('profile.interests', 'Centres d\'intérêt (séparés par virgule)')}
//         </label>
//         <textarea 
//           value={interets} 
//           onChange={e => setInterets(e.target.value)}
//           rows={2}
//           placeholder={t('profile.placeholders.interests', 'informatique, IA, management, finance…')}
//           className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#006666]/30 resize-none" 
//         />
//       </div>

//       {/* Bouton save */}
//       {error && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>}

//       <button 
//         onClick={handleSave} 
//         disabled={saving}
//         className="w-full py-3 rounded-xl bg-[#006666] text-white font-bold text-sm shadow-lg hover:bg-[#005555] transition-all disabled:opacity-50"
//       >
//         {saving 
//           ? t('profile.saving', 'Sauvegarde…') 
//           : saved 
//             ? `✅ ${t('profile.saved', 'Profil sauvegardé !')}` 
//             : t('profile.save_button', 'Sauvegarder le profil')}
//       </button>
//     </div>
//   );
// }



'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  User,
  MapPin,
  GraduationCap,
  BarChart3,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  BrainCircuit,
} from 'lucide-react';
import { useSessionStore } from '@/store/sessionStore';
import { useLang } from '@/i18n/LanguageContext';
import { cn } from '@/lib/utils';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

function getUserId(): string {
  try {
    const raw = localStorage.getItem('supmti-auth');
    if (!raw) return '';
    return JSON.parse(raw)?.state?.user?.id || '';
  } catch {
    return '';
  }
}

function normaliserNiveau(diplome: string): string {
  const d = diplome.toLowerCase();
  if (/dut|bts|deug|deust|cpge|technicien|ts |bac\+2|bac 2/.test(d)) return 'bac2';
  if (/licence|bachelor|l3|l2|bac\+3|bac 3/.test(d)) return 'bac3';
  if (/master|m1|m2|ingénieur|ingenieur|bac\+4|bac\+5/.test(d)) return 'bac4';
  if (/bac\+1|prépa|prepa|bac 1/.test(d)) return 'bac1';
  if (/terminale|baccalauréat|lycée/.test(d)) return 'post_bac';
  return 'post_bac';
}

function estDiplomePostBac(val: string): boolean {
  return /dut|bts|deug|licence|bachelor|master|ingénieur|ingenieur|l[23]|m[12]|technicien|cpge/i.test(val);
}

type NiveauItem = {
  value: string;
  label: string;
};

export default function ProfilPanel() {
  const { t } = useLang();
  const { profil, setProfil } = useSessionStore();

  const info = profil?.informations_personnelles || {};
  const parc = profil?.parcours_academique || {};
  const pref = profil?.preferences || {};

  const [prenom, setPrenom] = useState(info.prenom || '');
  const [ville, setVille] = useState(info.ville || '');
  const [bac, setBac] = useState(parc.type_bac || parc.diplome_actuel || parc.label_bac || '');
  const [moyenne, setMoyenne] = useState(String(parc.moyenne_generale || ''));
  const [niveau, setNiveau] = useState(parc.niveau_actuel || 'post_bac');
  const [interets, setInterets] = useState((pref.centres_interet || []).join(', '));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const NIVEAUX: NiveauItem[] = useMemo(
    () => [
      { value: 'post_bac', label: t('profile', 'level_post_bac') || 'Bachelier / Terminale' },
      { value: 'bac1', label: t('profile', 'level_bac1') || 'BAC+1' },
      { value: 'bac2', label: t('profile', 'level_bac2') || 'BAC+2 (DUT / BTS / DEUG)' },
      { value: 'bac3', label: t('profile', 'level_bac3') || 'BAC+3 (Licence / Bachelor)' },
      { value: 'bac4', label: t('profile', 'level_bac4') || 'BAC+4/5 (Master / Ingénieur)' },
    ],
    [t]
  );

  const NOTES_EVALUATION = useMemo(
    () => [
      { min: 18, text: t('profile', 'grade_excellent') || '🏆 Très Bien' },
      { min: 16, text: t('profile', 'grade_good') || '⭐ Bien' },
      { min: 14, text: t('profile', 'grade_fair') || '✅ Assez Bien' },
      { min: 10, text: t('profile', 'grade_pass') || '📚 Passable' },
      { min: 0, text: t('profile', 'grade_fail') || '⚠️ Insuffisant' },
    ],
    [t]
  );

  useEffect(() => {
    setPrenom(profil?.informations_personnelles?.prenom || '');
    setVille(profil?.informations_personnelles?.ville || '');
    setBac(
      profil?.parcours_academique?.diplome_actuel ||
        profil?.parcours_academique?.type_bac ||
        profil?.parcours_academique?.label_bac ||
        ''
    );
    setMoyenne(String(profil?.parcours_academique?.moyenne_generale || ''));
    setNiveau(profil?.parcours_academique?.niveau_actuel || 'post_bac');
    setInterets((profil?.preferences?.centres_interet || []).join(', '));
  }, [profil]);

  const handleBacChange = (val: string) => {
    setBac(val);
    if (estDiplomePostBac(val)) {
      setNiveau(normaliserNiveau(val));
    }
  };

  const getGradeEvaluation = (note: number) => {
    return NOTES_EVALUATION.find((item) => note >= item.min)?.text || '';
  };

  const gradeLabel =
    moyenne && !Number.isNaN(parseFloat(moyenne)) ? getGradeEvaluation(parseFloat(moyenne)) : '';

  const averageNumber =
    moyenne && !Number.isNaN(parseFloat(moyenne)) ? parseFloat(moyenne) : null;

  const profileCompletion = [
    prenom.trim(),
    ville.trim(),
    bac.trim(),
    niveau.trim(),
    interets.trim(),
    moyenne.trim(),
  ].filter(Boolean).length;

  const completionPercent = Math.round((profileCompletion / 6) * 100);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSaved(false);

    try {
      const userId = getUserId();
      const moy = parseFloat(moyenne);

      const payload: Record<string, unknown> = {
        user_id: userId,
        city: ville || null,
        interests: interets.split(',').map((s) => s.trim()).filter(Boolean),
      };

      if (prenom) payload.full_name = prenom;
      if (!Number.isNaN(moy) && moy > 0) payload.average = moy;

      if (bac) {
        if (estDiplomePostBac(bac)) {
          payload.diplome_actuel = bac;
          payload.level = normaliserNiveau(bac);
        } else {
          payload.bac_type = bac;
          payload.level = niveau;
        }
      } else {
        payload.level = niveau;
      }

      const res = await fetch(`${API}/api/profil`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(userId ? { 'X-User-Id': userId } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.message || t('profile', 'save_error') || 'Erreur sauvegarde');
      }

      const newProfil = {
        ...profil,
        informations_personnelles: { ...info, prenom, ville },
        parcours_academique: {
          ...parc,
          moyenne_generale: !Number.isNaN(moy) ? moy : parc.moyenne_generale,
          type_bac: estDiplomePostBac(bac) ? parc.type_bac || 'AUTRE' : bac,
          label_bac: bac,
          diplome_actuel: estDiplomePostBac(bac) ? bac : parc.diplome_actuel,
          niveau_actuel: estDiplomePostBac(bac) ? normaliserNiveau(bac) : niveau,
        },
        preferences: { ...pref, centres_interet: payload.interests as string[] },
      };

      setProfil(newProfil as Parameters<typeof setProfil>[0]);
      window.dispatchEvent(new CustomEvent('sami:profile-updated'));

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t('profile', 'unknown_error') || 'Erreur inconnue');
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 outline-none transition-all placeholder:text-slate-400 focus:border-[#006666]/40 focus:ring-4 focus:ring-[#006666]/10';

  const labelClass =
    'mb-1.5 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500';

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      {/* Header / résumé */}
      <div className="rounded-3xl border border-[#006666]/10 bg-gradient-to-br from-[#006666]/5 via-emerald-500/[0.04] to-blue-500/[0.05] p-4">
        <div className="mb-3 flex items-center gap-2">
          <BrainCircuit size={16} className="text-[#006666]" />
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#006666]">
            {t('profile', 'profile_intelligence') || 'Profil intelligent'}
          </span>
        </div>

        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          {t('profile', 'profile_intro') ||
            'Complète ton profil académique et personnel pour améliorer les recommandations, le FitScore et les suggestions de parcours.'}
        </p>

        <div className="mt-4 rounded-2xl border border-white/50 bg-white/70 p-3 dark:border-white/[0.05] dark:bg-slate-900/40">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
              {t('profile', 'completion') || 'Complétion'}
            </span>
            <span className="text-xs font-black text-[#006666]">{completionPercent}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700/60">
            <div
              className="h-full rounded-full bg-[#006666] transition-all duration-500"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grille principale */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
          <label className={labelClass}>
            <User size={13} />
            {t('profile', 'first_name') || 'Prénom'}
          </label>
          <input
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            placeholder={t('profile', 'placeholder_first_name') || 'Votre prénom'}
            className={inputClass}
          />
        </div>

        <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
          <label className={labelClass}>
            <MapPin size={13} />
            {t('profile', 'city') || 'Ville'}
          </label>
          <input
            value={ville}
            onChange={(e) => setVille(e.target.value)}
            placeholder={t('profile', 'placeholder_city') || 'Votre ville'}
            className={inputClass}
          />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
        <label className={labelClass}>
          <GraduationCap size={13} />
          {t('profile', 'degree') || 'Diplôme / Type de BAC'}
        </label>

        <input
          value={bac}
          onChange={(e) => handleBacChange(e.target.value)}
          placeholder={
            t('profile', 'placeholder_degree') ||
            'ex: BAC Sciences, DUT Informatique, Licence Web…'
          }
          className={inputClass}
        />

        {bac && estDiplomePostBac(bac) && (
          <div className="mt-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
            <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
              {t('profile', 'post_bac_detected') ||
                '✓ Diplôme post-BAC détecté → niveau auto :'}{' '}
              <strong>{normaliserNiveau(bac).toUpperCase()}</strong>
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_0.95fr]">
        <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
          <label className={labelClass}>
            <Sparkles size={13} />
            {t('profile', 'current_level') || 'Niveau actuel'}
          </label>

          <select
            value={niveau}
            onChange={(e) => setNiveau(e.target.value)}
            className={cn(inputClass, 'appearance-none')}
          >
            {NIVEAUX.map((n) => (
              <option key={n.value} value={n.value}>
                {n.label}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
          <label className={labelClass}>
            <BarChart3 size={13} />
            {t('profile', 'average') || 'Moyenne générale (/20)'}
          </label>

          <input
            type="number"
            min="0"
            max="20"
            step="0.5"
            value={moyenne}
            onChange={(e) => setMoyenne(e.target.value)}
            placeholder={t('profile', 'placeholder_average') || 'ex: 14.5'}
            className={inputClass}
          />

          {averageNumber !== null && (
            <div className="mt-3 flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                {t('profile', 'academic_assessment') || 'Évaluation'}
              </span>
              <span className="text-[11px] font-black text-[#006666]">{gradeLabel}</span>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
        <label className={labelClass}>
          <Sparkles size={13} />
          {t('profile', 'interests') || "Centres d'intérêt (séparés par virgule)"}
        </label>

        <textarea
          value={interets}
          onChange={(e) => setInterets(e.target.value)}
          rows={3}
          placeholder={
            t('profile', 'placeholder_interests') || 'informatique, IA, management, finance…'
          }
          className={cn(inputClass, 'resize-none')}
        />
      </div>

      {error && (
        <div className="animate-in zoom-in-95 rounded-2xl border border-red-500/20 bg-red-50 px-4 py-3 dark:bg-red-950/20">
          <div className="flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
            <p className="text-xs font-medium text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className={cn(
          'group w-full rounded-2xl py-4 text-sm font-black text-white shadow-xl transition-all active:scale-[0.98]',
          saving
            ? 'cursor-not-allowed bg-slate-400'
            : saved
            ? 'bg-emerald-600'
            : 'bg-[#006666] hover:bg-[#005555]'
        )}
      >
        <span className="flex items-center justify-center gap-2">
          {saved ? (
            <CheckCircle2 size={18} />
          ) : (
            <Save size={17} className={cn(!saving && 'transition-transform group-hover:scale-110')} />
          )}

          {saving
            ? t('profile', 'saving') || 'Sauvegarde…'
            : saved
            ? t('profile', 'saved') || 'Profil sauvegardé !'
            : t('profile', 'save_button') || 'Sauvegarder le profil'}
        </span>
      </button>
    </div>
  );
}