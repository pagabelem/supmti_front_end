// 'use client';
// import { useState, useEffect } from 'react';
// import { useTheme } from 'next-themes';
// import {
//   Settings, Globe, Volume2, ShieldCheck, Sparkles,
//   Trash2, KeyRound, Bell, Moon, Sun, ChevronRight,
//   Bot, Info, Loader2, CheckCircle2, AlertCircle
// } from 'lucide-react';
// import { useAuthStore } from '@/store/authStore';
// import { useRouter }    from 'next/navigation';

// const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// function getUserId(): string {
//   try {
//     const raw = localStorage.getItem('supmti-auth');
//     if (!raw) return '';
//     return JSON.parse(raw)?.state?.user?.id || '';
//   } catch { return ''; }
// }

// // ── Clé localStorage pour les préférences UI ─────────────────
// const PREFS_KEY = 'supmti-settings';

// function loadLocalPrefs() {
//   try {
//     const raw = localStorage.getItem(PREFS_KEY);
//     return raw ? JSON.parse(raw) : {};
//   } catch { return {}; }
// }

// function saveLocalPrefs(prefs: object) {
//   localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
// }

// // ── Toggle Switch ─────────────────────────────────────────────
// const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
//   <button
//     onClick={onChange}
//     className={`w-14 h-8 rounded-full transition-all relative shrink-0 ${
//       value ? 'bg-[#006666] shadow-lg shadow-emerald-100 dark:shadow-emerald-900/20' : 'bg-gray-200 dark:bg-slate-700'
//     }`}
//   >
//     <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${value ? 'left-7' : 'left-1'}`} />
//   </button>
// );

// export default function SettingsPage() {
//   const { theme, setTheme } = useTheme();
//   const { logout }          = useAuthStore();
//   const router              = useRouter();

//   const [language,       setLanguage]       = useState('fr');
//   const [ttsEnabled,     setTtsEnabled]     = useState(false);
//   const [notifications,  setNotifications]  = useState(true);
//   const [saving,         setSaving]         = useState(false);
//   const [saveStatus,     setSaveStatus]     = useState<'idle'|'ok'|'error'>('idle');
//   const [deleting,       setDeleting]       = useState(false);
//   const [mounted,        setMounted]        = useState(false);

//   // Éviter le flash SSR pour next-themes
//   useEffect(() => { setMounted(true); }, []);

//   // Charger les préférences sauvegardées
//   useEffect(() => {
//     const prefs = loadLocalPrefs();
//     if (prefs.language)      setLanguage(prefs.language);
//     if (prefs.ttsEnabled     !== undefined) setTtsEnabled(prefs.ttsEnabled);
//     if (prefs.notifications  !== undefined) setNotifications(prefs.notifications);
//   }, []);

//   const handleSave = async () => {
//     setSaving(true);
//     setSaveStatus('idle');

//     // Sauvegarder en localStorage
//     const prefs = { language, ttsEnabled, notifications };
//     saveLocalPrefs(prefs);

//     // Sauvegarder la langue en DB si connecté
//     const uid = getUserId();
//     if (uid) {
//       try {
//         await fetch(`${API}/api/profil`, {
//           method:      'PUT',
//           credentials: 'include',
//           headers:     { 'Content-Type': 'application/json', 'X-User-Id': uid },
//           body:        JSON.stringify({ user_id: uid }),
//           // On passe seulement ce qui change côté profil
//           // La langue est stockée en localStorage pour l'instant
//         });
//       } catch { /* silencieux — localStorage suffit */ }
//     }

//     // Simuler un délai réseau
//     await new Promise(r => setTimeout(r, 600));
//     setSaveStatus('ok');
//     setSaving(false);
//     setTimeout(() => setSaveStatus('idle'), 3000);
//   };

//   const handleDeleteHistory = async () => {
//     if (!confirm('Supprimer tout l\'historique des conversations ? Cette action est irréversible.')) return;
//     setDeleting(true);
//     try {
//       const uid = getUserId();
//       const res = await fetch(`${API}/api/reset`, {
//         method:      'POST',
//         credentials: 'include',
//         headers:     uid ? { 'X-User-Id': uid } : {},
//       });
//       if (res.ok) {
//         alert('Historique supprimé avec succès.');
//         window.dispatchEvent(new CustomEvent('sami:new-chat'));
//       }
//     } catch {
//       alert('Erreur lors de la suppression.');
//     } finally {
//       setDeleting(false);
//     }
//   };

//   const handleChangePassword = () => {
//     // Déconnecter et rediriger vers login pour changer le mot de passe
//     router.push('/login?action=change-password');
//   };

//   if (!mounted) return null;

//   const isDark = theme === 'dark';

//   return (
//     <div className="relative flex flex-col min-h-screen bg-gray-50/50 dark:bg-slate-950">

//       {/* Blobs décoratifs */}
//       <div className="absolute inset-0 pointer-events-none overflow-hidden">
//         <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 dark:bg-blue-900/10 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-50 animate-blob" />
//         <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100 dark:bg-purple-900/10 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-50 animate-blob" style={{ animationDelay: '2s' }} />
//       </div>

//       <div className="container mx-auto px-6 py-12 relative z-10">

//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
//           <div className="flex items-center gap-5">
//             <div className="p-4 bg-supmti-blue text-white rounded-[2rem] shadow-xl shadow-blue-200 dark:shadow-none">
//               <Settings size={32} className="animate-[spin_4s_linear_infinite]" />
//             </div>
//             <div>
//               <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Paramètres</h1>
//               <p className="text-gray-500 dark:text-gray-400 font-medium">Personnalisez votre expérience</p>
//             </div>
//           </div>
//           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-700 text-supmti-blue dark:text-blue-400 text-xs font-bold shadow-sm">
//             <Sparkles size={14} className="animate-pulse" />
//             Assistant SAMI 2026
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

//           {/* ── Colonne gauche ── */}
//           <div className="lg:col-span-2 space-y-8">

//             {/* Langue */}
//             <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
//               <div className="flex items-center gap-3 mb-8">
//                 <div className="p-2 bg-blue-50 dark:bg-blue-950/30 text-supmti-blue rounded-xl">
//                   <Globe size={20} />
//                 </div>
//                 <h2 className="text-xl font-bold text-gray-800 dark:text-white">Langue et Région</h2>
//               </div>
//               <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center p-6 rounded-[2rem] bg-gray-50 dark:bg-slate-800/50 border border-transparent hover:border-blue-100 dark:hover:border-slate-700 transition-all">
//                 <div>
//                   <p className="font-black text-gray-800 dark:text-white">Langue du Chatbot</p>
//                   <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[250px]">SAMI s'adaptera à votre choix de langue.</p>
//                 </div>
//                 <select
//                   value={language}
//                   onChange={(e) => setLanguage(e.target.value)}
//                   className="w-full sm:w-auto bg-white dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-700 rounded-2xl px-6 py-3 text-sm font-bold text-supmti-blue dark:text-blue-400 outline-none focus:border-supmti-blue transition-all cursor-pointer"
//                 >
//                   <option value="fr">🇫🇷 Français</option>
//                   <option value="ar">🇲🇦 Darija</option>
//                   <option value="en">🇬🇧 English</option>
//                 </select>
//               </div>
//             </section>

//             {/* Audio / TTS */}
//             <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
//               <div className="flex items-center gap-3 mb-8">
//                 <div className="p-2 bg-green-50 dark:bg-green-950/30 text-green-600 rounded-xl">
//                   <Volume2 size={20} />
//                 </div>
//                 <h2 className="text-xl font-bold text-gray-800 dark:text-white">Multimodalité Audio</h2>
//               </div>
//               <div className="flex justify-between items-center p-6 rounded-[2rem] bg-gray-50 dark:bg-slate-800/50 border border-transparent hover:border-green-100 dark:hover:border-green-900/30 transition-all">
//                 <div>
//                   <p className="font-black text-gray-800 dark:text-white">Lecture automatique (TTS)</p>
//                   <p className="text-xs text-gray-500 dark:text-gray-400">SAMI lira ses réponses à haute voix automatiquement.</p>
//                 </div>
//                 <Toggle value={ttsEnabled} onChange={() => setTtsEnabled(!ttsEnabled)} />
//               </div>
//             </section>

//             {/* Apparence */}
//             <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm">
//               <div className="flex items-center gap-3 mb-8">
//                 <div className="p-2 bg-purple-50 dark:bg-purple-950/30 text-purple-600 rounded-xl">
//                   <Moon size={20} />
//                 </div>
//                 <h2 className="text-xl font-bold text-gray-800 dark:text-white">Apparence</h2>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 {[
//                   { val: 'light',  label: 'Mode Clair',  icon: <Sun  size={18} /> },
//                   { val: 'dark',   label: 'Mode Sombre', icon: <Moon size={18} /> },
//                   { val: 'system', label: 'Système',     icon: <Settings size={18} /> },
//                 ].map(({ val, label, icon }) => (
//                   <button
//                     key={val}
//                     onClick={() => setTheme(val)}
//                     className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-2 transition-all ${
//                       theme === val
//                         ? 'border-supmti-blue bg-blue-50 dark:bg-blue-950/20 text-supmti-blue dark:text-blue-400'
//                         : 'border-gray-100 dark:border-slate-700 text-gray-400 dark:text-slate-500 hover:border-gray-200'
//                     }`}
//                   >
//                     <div className="flex items-center gap-2">
//                       {icon}
//                       <span className="font-bold text-sm">{label}</span>
//                     </div>
//                     <div className={`w-4 h-4 rounded-full border-2 shrink-0 ${
//                       theme === val ? 'bg-supmti-blue border-white' : 'border-gray-200 dark:border-slate-600'
//                     }`} />
//                   </button>
//                 ))}
//               </div>
//             </section>
//           </div>

//           {/* ── Colonne droite ── */}
//           <div className="space-y-8">

//             {/* Sécurité */}
//             <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm">
//               <div className="flex items-center gap-3 mb-8 text-red-500">
//                 <ShieldCheck size={20} />
//                 <h2 className="text-xl font-bold dark:text-white">Sécurité</h2>
//               </div>
//               <div className="space-y-4">
//                 <button
//                   onClick={handleChangePassword}
//                   className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all group font-bold text-gray-700 dark:text-gray-300 text-sm"
//                 >
//                   <div className="flex items-center gap-3">
//                     <KeyRound size={18} className="text-gray-400" />
//                     Modifier le mot de passe
//                   </div>
//                   <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform text-gray-400" />
//                 </button>

//                 <div className="h-px bg-gray-100 dark:bg-slate-800 mx-4" />

//                 <button
//                   onClick={handleDeleteHistory}
//                   disabled={deleting}
//                   className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-all group font-bold text-red-500 text-sm disabled:opacity-50"
//                 >
//                   <div className="flex items-center gap-3">
//                     {deleting
//                       ? <Loader2 size={18} className="animate-spin" />
//                       : <Trash2 size={18} />
//                     }
//                     Supprimer l'historique (RGPD)
//                   </div>
//                 </button>
//               </div>
//             </section>

//             {/* Notifications */}
//             <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center gap-3 text-orange-500">
//                   <Bell size={20} />
//                   <h2 className="text-xl font-bold dark:text-white">Alertes</h2>
//                 </div>
//                 <Toggle value={notifications} onChange={() => setNotifications(!notifications)} />
//               </div>
//               <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed font-medium">
//                 Recevez des alertes pour les recommandations basées sur votre FitScore.
//               </p>
//             </section>

//             {/* Version */}
//             <div className="text-center p-6 bg-slate-900 dark:bg-[#006666]/10 rounded-[2.5rem] text-white dark:text-emerald-400 shadow-xl shadow-slate-900/10 relative overflow-hidden group border dark:border-[#006666]/20">
//               <div className="relative z-10">
//                 <Info size={24} className="mx-auto mb-2 opacity-50" />
//                 <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Version App</p>
//                 <p className="text-lg font-black italic">v2.4-SUPMTI</p>
//               </div>
//               <Bot size={80} className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform" />
//             </div>
//           </div>
//         </div>

//         {/* Footer actions */}
//         <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
//           {/* Feedback sauvegarde */}
//           <div className="h-8 flex items-center">
//             {saveStatus === 'ok' && (
//               <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-bold animate-in fade-in">
//                 <CheckCircle2 size={16} /> Préférences sauvegardées !
//               </div>
//             )}
//             {saveStatus === 'error' && (
//               <div className="flex items-center gap-2 text-red-500 text-sm font-bold animate-in fade-in">
//                 <AlertCircle size={16} /> Erreur lors de la sauvegarde.
//               </div>
//             )}
//           </div>

//           <div className="flex gap-4">
//             <button
//               onClick={() => {
//                 const prefs = loadLocalPrefs();
//                 if (prefs.language)     setLanguage(prefs.language);
//                 if (prefs.ttsEnabled    !== undefined) setTtsEnabled(prefs.ttsEnabled);
//                 if (prefs.notifications !== undefined) setNotifications(prefs.notifications);
//               }}
//               className="px-8 py-4 text-gray-400 dark:text-gray-500 font-bold hover:text-gray-600 dark:hover:text-gray-300 transition"
//             >
//               Annuler
//             </button>
//             <button
//               onClick={handleSave}
//               disabled={saving}
//               className="px-12 py-4 bg-supmti-blue text-white rounded-[1.5rem] font-black shadow-2xl shadow-blue-200 dark:shadow-none hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
//             >
//               {saving
//                 ? <><Loader2 size={18} className="animate-spin" /> Sauvegarde…</>
//                 : <>Sauvegarder <ChevronRight size={18} /></>
//               }
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// 'use client';
// import { useState, useEffect } from 'react';
// import { useTheme } from 'next-themes';
// import {
//   Settings, Globe, Volume2, ShieldCheck, Sparkles,
//   Trash2, KeyRound, Bell, Moon, Sun, ChevronRight,
//   Bot, Info, Loader2, CheckCircle2, AlertCircle, X, Eye, EyeOff, Lock
// } from 'lucide-react';
// import { useAuthStore } from '@/store/authStore';

// const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// function getUserId(): string {
//   try { return JSON.parse(localStorage.getItem('supmti-auth')||'{}')?.state?.user?.id||''; }
//   catch { return ''; }
// }

// const PREFS_KEY = 'supmti-settings';
// function loadLocalPrefs() { try { return JSON.parse(localStorage.getItem(PREFS_KEY)||'{}'); } catch { return {}; } }
// function saveLocalPrefs(p: object) { localStorage.setItem(PREFS_KEY, JSON.stringify(p)); }

// const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
//   <button onClick={onChange}
//     className={`w-14 h-8 rounded-full transition-all relative shrink-0 ${value ? 'bg-[#006666] shadow-lg shadow-emerald-100 dark:shadow-emerald-900/20' : 'bg-gray-200 dark:bg-slate-700'}`}>
//     <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${value ? 'left-7' : 'left-1'}`} />
//   </button>
// );

// // ── Modal changement de mot de passe ─────────────────────────
// function ChangePasswordModal({ onClose }: { onClose: () => void }) {
//   const [currentPwd,  setCurrentPwd]  = useState('');
//   const [newPwd,      setNewPwd]      = useState('');
//   const [confirmPwd,  setConfirmPwd]  = useState('');
//   const [showCurrent, setShowCurrent] = useState(false);
//   const [showNew,     setShowNew]     = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [loading,     setLoading]     = useState(false);
//   const [error,       setError]       = useState<string|null>(null);
//   const [success,     setSuccess]     = useState(false);

//   const strength = (pwd: string) => {
//     let s = 0;
//     if (pwd.length >= 8)          s++;
//     if (/[A-Z]/.test(pwd))        s++;
//     if (/[0-9]/.test(pwd))        s++;
//     if (/[^A-Za-z0-9]/.test(pwd)) s++;
//     return s;
//   };
//   const strengthLabel = ['', 'Faible', 'Moyen', 'Bon', 'Fort'];
//   const strengthColor = ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-emerald-400'];
//   const pwdStrength   = strength(newPwd);

//   const handleSubmit = async () => {
//     setError(null);
//     if (!currentPwd)              return setError('Mot de passe actuel requis.');
//     if (newPwd.length < 6)        return setError('Le nouveau mot de passe doit faire au moins 6 caractères.');
//     if (newPwd !== confirmPwd)    return setError('Les mots de passe ne correspondent pas.');
//     if (newPwd === currentPwd)    return setError('Le nouveau mot de passe doit être différent de l\'actuel.');

//     setLoading(true);
//     try {
//       const uid = getUserId();
//       const res = await fetch(`${API}/api/auth/change-password`, {
//         method:      'POST',
//         credentials: 'include',
//         headers:     { 'Content-Type': 'application/json', ...(uid ? {'X-User-Id': uid} : {}) },
//         body:        JSON.stringify({ current_password: currentPwd, new_password: newPwd }),
//       });
//       const data = await res.json().catch(() => ({}));
//       if (!res.ok) {
//         setError(data.detail || data.message || 'Mot de passe actuel incorrect.');
//       } else {
//         setSuccess(true);
//         setTimeout(() => onClose(), 2000);
//       }
//     } catch {
//       setError('Impossible de joindre le serveur.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
//       onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
//       <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl border border-gray-100 dark:border-slate-800 animate-in zoom-in-95 duration-200 overflow-hidden">

//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
//               <Lock size={18} className="text-red-500"/>
//             </div>
//             <div>
//               <p className="font-black text-gray-900 dark:text-white">Modifier le mot de passe</p>
//               <p className="text-xs text-gray-400 dark:text-slate-500">Choisissez un mot de passe sécurisé</p>
//             </div>
//           </div>
//           <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-all">
//             <X size={16}/>
//           </button>
//         </div>

//         {success ? (
//           <div className="p-8 text-center">
//             <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
//               <CheckCircle2 size={32} className="text-white"/>
//             </div>
//             <p className="font-black text-gray-900 dark:text-white text-lg">Mot de passe modifié !</p>
//             <p className="text-sm text-gray-400 mt-1">Fermeture automatique…</p>
//           </div>
//         ) : (
//           <div className="p-6 space-y-4">

//             {error && (
//               <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl animate-in fade-in">
//                 <AlertCircle size={15} className="text-red-500 shrink-0"/>
//                 <p className="text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>
//               </div>
//             )}

//             {/* Mot de passe actuel */}
//             <div>
//               <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-1.5 ml-1 uppercase">
//                 Mot de passe actuel
//               </label>
//               <div className="relative">
//                 <input type={showCurrent ? 'text' : 'password'} value={currentPwd}
//                   onChange={e => { setCurrentPwd(e.target.value); setError(null); }}
//                   placeholder="••••••••"
//                   className="w-full px-4 py-3 pr-11 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-gray-900 dark:text-white text-sm outline-none focus:border-[#006666] transition-all"/>
//                 <button type="button" onClick={() => setShowCurrent(!showCurrent)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
//                   {showCurrent ? <EyeOff size={16}/> : <Eye size={16}/>}
//                 </button>
//               </div>
//             </div>

//             {/* Nouveau mot de passe */}
//             <div>
//               <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-1.5 ml-1 uppercase">
//                 Nouveau mot de passe
//               </label>
//               <div className="relative">
//                 <input type={showNew ? 'text' : 'password'} value={newPwd}
//                   onChange={e => { setNewPwd(e.target.value); setError(null); }}
//                   placeholder="••••••••"
//                   className="w-full px-4 py-3 pr-11 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-gray-900 dark:text-white text-sm outline-none focus:border-[#006666] transition-all"/>
//                 <button type="button" onClick={() => setShowNew(!showNew)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
//                   {showNew ? <EyeOff size={16}/> : <Eye size={16}/>}
//                 </button>
//               </div>
//               {/* Barre de force */}
//               {newPwd && (
//                 <div className="mt-2 space-y-1">
//                   <div className="flex gap-1">
//                     {[1,2,3,4].map(i => (
//                       <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= pwdStrength ? strengthColor[pwdStrength] : 'bg-gray-200 dark:bg-slate-700'}`}/>
//                     ))}
//                   </div>
//                   <p className={`text-[10px] font-bold ml-0.5 ${strengthColor[pwdStrength].replace('bg-','text-')}`}>
//                     {strengthLabel[pwdStrength]}
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Confirmer */}
//             <div>
//               <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-1.5 ml-1 uppercase">
//                 Confirmer le mot de passe
//               </label>
//               <div className="relative">
//                 <input type={showConfirm ? 'text' : 'password'} value={confirmPwd}
//                   onChange={e => { setConfirmPwd(e.target.value); setError(null); }}
//                   placeholder="••••••••"
//                   className={`w-full px-4 py-3 pr-11 bg-gray-50 dark:bg-slate-800 border rounded-2xl text-gray-900 dark:text-white text-sm outline-none transition-all ${
//                     confirmPwd && newPwd !== confirmPwd
//                       ? 'border-red-300 dark:border-red-700 focus:border-red-500'
//                       : confirmPwd && newPwd === confirmPwd
//                         ? 'border-emerald-300 dark:border-emerald-700 focus:border-emerald-500'
//                         : 'border-gray-200 dark:border-slate-700 focus:border-[#006666]'
//                   }`}/>
//                 <button type="button" onClick={() => setShowConfirm(!showConfirm)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
//                   {showConfirm ? <EyeOff size={16}/> : <Eye size={16}/>}
//                 </button>
//                 {confirmPwd && (
//                   <div className="absolute right-9 top-1/2 -translate-y-1/2">
//                     {newPwd === confirmPwd
//                       ? <CheckCircle2 size={14} className="text-emerald-500"/>
//                       : <X size={14} className="text-red-400"/>
//                     }
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Boutons */}
//             <div className="flex gap-3 pt-2">
//               <button onClick={onClose}
//                 className="flex-1 py-3 rounded-2xl border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 font-bold text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-all">
//                 Annuler
//               </button>
//               <button onClick={handleSubmit} disabled={loading || !currentPwd || !newPwd || !confirmPwd}
//                 className="flex-1 py-3 rounded-2xl bg-[#006666] text-white font-black text-sm hover:bg-[#004d4d] disabled:opacity-50 flex items-center justify-center gap-2 transition-all">
//                 {loading ? <><Loader2 size={15} className="animate-spin"/> Modification…</> : 'Modifier'}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ============================================================
// // PAGE SETTINGS
// // ============================================================
// export default function SettingsPage() {
//   const { theme, setTheme } = useTheme();
//   const { logout }          = useAuthStore();

//   const [language,       setLanguage]       = useState('fr');
//   const [ttsEnabled,     setTtsEnabled]     = useState(false);
//   const [notifications,  setNotifications]  = useState(true);
//   const [saving,         setSaving]         = useState(false);
//   const [saveStatus,     setSaveStatus]     = useState<'idle'|'ok'|'error'>('idle');
//   const [deleting,       setDeleting]       = useState(false);
//   const [mounted,        setMounted]        = useState(false);
//   const [showPwdModal,   setShowPwdModal]   = useState(false);

//   useEffect(() => { setMounted(true); }, []);

//   useEffect(() => {
//     const prefs = loadLocalPrefs();
//     if (prefs.language)                      setLanguage(prefs.language);
//     if (prefs.ttsEnabled    !== undefined)   setTtsEnabled(prefs.ttsEnabled);
//     if (prefs.notifications !== undefined)   setNotifications(prefs.notifications);
//   }, []);

//   const handleSave = async () => {
//     setSaving(true); setSaveStatus('idle');
//     saveLocalPrefs({ language, ttsEnabled, notifications });
//     await new Promise(r => setTimeout(r, 600));
//     setSaveStatus('ok'); setSaving(false);
//     setTimeout(() => setSaveStatus('idle'), 3000);
//   };

//   const handleDeleteHistory = async () => {
//     if (!confirm('Supprimer tout l\'historique ? Action irréversible.')) return;
//     setDeleting(true);
//     try {
//       const uid = getUserId();
//       const res = await fetch(`${API}/api/reset`, {
//         method:'POST', credentials:'include',
//         headers: uid ? {'X-User-Id':uid} : {},
//       });
//       if (res.ok) {
//         alert('Historique supprimé.');
//         window.dispatchEvent(new CustomEvent('sami:new-chat'));
//       }
//     } catch { alert('Erreur.'); }
//     finally { setDeleting(false); }
//   };

//   if (!mounted) return null;

//   return (
//     <>
//       {showPwdModal && <ChangePasswordModal onClose={() => setShowPwdModal(false)}/>}

//       <div className="relative flex flex-col min-h-screen bg-gray-50/50 dark:bg-slate-950">

//         {/* Blobs */}
//         <div className="absolute inset-0 pointer-events-none overflow-hidden">
//           <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 dark:bg-blue-900/10 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-50"/>
//           <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100 dark:bg-purple-900/10 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-50" style={{animationDelay:'2s'}}/>
//         </div>

//         <div className="container mx-auto px-6 py-12 relative z-10">

//           {/* Header */}
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
//             <div className="flex items-center gap-5">
//               <div className="p-4 bg-supmti-blue text-white rounded-[2rem] shadow-xl shadow-blue-200 dark:shadow-none">
//                 <Settings size={32} className="animate-[spin_4s_linear_infinite]"/>
//               </div>
//               <div>
//                 <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Paramètres</h1>
//                 <p className="text-gray-500 dark:text-gray-400 font-medium">Personnalisez votre expérience</p>
//               </div>
//             </div>
//             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-700 text-supmti-blue dark:text-blue-400 text-xs font-bold shadow-sm">
//               <Sparkles size={14} className="animate-pulse"/> Assistant SAMI 2026
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

//             {/* Colonne gauche */}
//             <div className="lg:col-span-2 space-y-8">

//               {/* Langue */}
//               <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
//                 <div className="flex items-center gap-3 mb-8">
//                   <div className="p-2 bg-blue-50 dark:bg-blue-950/30 text-supmti-blue rounded-xl"><Globe size={20}/></div>
//                   <h2 className="text-xl font-bold text-gray-800 dark:text-white">Langue et Région</h2>
//                 </div>
//                 <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center p-6 rounded-[2rem] bg-gray-50 dark:bg-slate-800/50 border border-transparent hover:border-blue-100 dark:hover:border-slate-700 transition-all">
//                   <div>
//                     <p className="font-black text-gray-800 dark:text-white">Langue du Chatbot</p>
//                     <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[250px]">SAMI s'adaptera à votre choix.</p>
//                   </div>
//                   <select value={language} onChange={e=>setLanguage(e.target.value)}
//                     className="w-full sm:w-auto bg-white dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-700 rounded-2xl px-6 py-3 text-sm font-bold text-supmti-blue dark:text-blue-400 outline-none focus:border-supmti-blue transition-all cursor-pointer">
//                     <option value="fr">🇫🇷 Français</option>
//                     <option value="ar">🇲🇦 Darija</option>
//                     <option value="en">🇬🇧 English</option>
//                   </select>
//                 </div>
//               </section>

//               {/* Audio */}
//               <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
//                 <div className="flex items-center gap-3 mb-8">
//                   <div className="p-2 bg-green-50 dark:bg-green-950/30 text-green-600 rounded-xl"><Volume2 size={20}/></div>
//                   <h2 className="text-xl font-bold text-gray-800 dark:text-white">Multimodalité Audio</h2>
//                 </div>
//                 <div className="flex justify-between items-center p-6 rounded-[2rem] bg-gray-50 dark:bg-slate-800/50 border border-transparent hover:border-green-100 dark:hover:border-green-900/30 transition-all">
//                   <div>
//                     <p className="font-black text-gray-800 dark:text-white">Lecture automatique (TTS)</p>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">SAMI lira ses réponses à haute voix.</p>
//                   </div>
//                   <Toggle value={ttsEnabled} onChange={() => setTtsEnabled(!ttsEnabled)}/>
//                 </div>
//               </section>

//               {/* Apparence */}
//               <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm">
//                 <div className="flex items-center gap-3 mb-8">
//                   <div className="p-2 bg-purple-50 dark:bg-purple-950/30 text-purple-600 rounded-xl"><Moon size={20}/></div>
//                   <h2 className="text-xl font-bold text-gray-800 dark:text-white">Apparence</h2>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   {[
//                     {val:'light',  label:'Mode Clair',  icon:<Sun size={18}/>},
//                     {val:'dark',   label:'Mode Sombre', icon:<Moon size={18}/>},
//                     {val:'system', label:'Système',     icon:<Settings size={18}/>},
//                   ].map(({val,label,icon}) => (
//                     <button key={val} onClick={() => setTheme(val)}
//                       className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-2 transition-all ${
//                         theme===val
//                           ? 'border-supmti-blue bg-blue-50 dark:bg-blue-950/20 text-supmti-blue dark:text-blue-400'
//                           : 'border-gray-100 dark:border-slate-700 text-gray-400 dark:text-slate-500 hover:border-gray-200'
//                       }`}>
//                       <div className="flex items-center gap-2">{icon}<span className="font-bold text-sm">{label}</span></div>
//                       <div className={`w-4 h-4 rounded-full border-2 shrink-0 ${theme===val?'bg-supmti-blue border-white':'border-gray-200 dark:border-slate-600'}`}/>
//                     </button>
//                   ))}
//                 </div>
//               </section>
//             </div>

//             {/* Colonne droite */}
//             <div className="space-y-8">

//               {/* Sécurité */}
//               <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm">
//                 <div className="flex items-center gap-3 mb-8 text-red-500">
//                   <ShieldCheck size={20}/>
//                   <h2 className="text-xl font-bold dark:text-white">Sécurité</h2>
//                 </div>
//                 <div className="space-y-4">
//                   {/* ← Ouvre la modal au lieu de rediriger */}
//                   <button onClick={() => setShowPwdModal(true)}
//                     className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all group font-bold text-gray-700 dark:text-gray-300 text-sm">
//                     <div className="flex items-center gap-3">
//                       <KeyRound size={18} className="text-gray-400"/>
//                       Modifier le mot de passe
//                     </div>
//                     <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform text-gray-400"/>
//                   </button>

//                   <div className="h-px bg-gray-100 dark:bg-slate-800 mx-4"/>

//                   <button onClick={handleDeleteHistory} disabled={deleting}
//                     className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-all group font-bold text-red-500 text-sm disabled:opacity-50">
//                     <div className="flex items-center gap-3">
//                       {deleting ? <Loader2 size={18} className="animate-spin"/> : <Trash2 size={18}/>}
//                       Supprimer l'historique (RGPD)
//                     </div>
//                   </button>
//                 </div>
//               </section>

//               {/* Notifications */}
//               <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="flex items-center gap-3 text-orange-500">
//                     <Bell size={20}/>
//                     <h2 className="text-xl font-bold dark:text-white">Alertes</h2>
//                   </div>
//                   <Toggle value={notifications} onChange={() => setNotifications(!notifications)}/>
//                 </div>
//                 <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed font-medium">
//                   Recevez des alertes pour les recommandations basées sur votre FitScore.
//                 </p>
//               </section>

//               {/* Version */}
//               <div className="text-center p-6 bg-slate-900 dark:bg-[#006666]/10 rounded-[2.5rem] text-white dark:text-emerald-400 shadow-xl shadow-slate-900/10 relative overflow-hidden group border dark:border-[#006666]/20">
//                 <div className="relative z-10">
//                   <Info size={24} className="mx-auto mb-2 opacity-50"/>
//                   <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Version App</p>
//                   <p className="text-lg font-black italic">v2.4-SUPMTI</p>
//                 </div>
//                 <Bot size={80} className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform"/>
//               </div>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
//             <div className="h-8 flex items-center">
//               {saveStatus==='ok'    && <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-bold animate-in fade-in"><CheckCircle2 size={16}/> Préférences sauvegardées !</div>}
//               {saveStatus==='error' && <div className="flex items-center gap-2 text-red-500 text-sm font-bold animate-in fade-in"><AlertCircle size={16}/> Erreur lors de la sauvegarde.</div>}
//             </div>
//             <div className="flex gap-4">
//               <button onClick={() => { const p=loadLocalPrefs(); if(p.language)setLanguage(p.language); if(p.ttsEnabled!==undefined)setTtsEnabled(p.ttsEnabled); if(p.notifications!==undefined)setNotifications(p.notifications); }}
//                 className="px-8 py-4 text-gray-400 dark:text-gray-500 font-bold hover:text-gray-600 dark:hover:text-gray-300 transition">
//                 Annuler
//               </button>
//               <button onClick={handleSave} disabled={saving}
//                 className="px-12 py-4 bg-supmti-blue text-white rounded-[1.5rem] font-black shadow-2xl shadow-blue-200 dark:shadow-none hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
//                 {saving ? <><Loader2 size={18} className="animate-spin"/> Sauvegarde…</> : <>Sauvegarder <ChevronRight size={18}/></>}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }






// ============================================================
// src/app/settings/page.tsx  (VERSION COMPLÈTE AVEC i18n)
// ============================================================
// 'use client';
// import { useState, useEffect } from 'react';
// import { useTheme } from 'next-themes';
// import {
//   Settings, Globe, Volume2, ShieldCheck, Sparkles,
//   Trash2, KeyRound, Bell, Moon, Sun, ChevronRight,
//   Bot, Info, Loader2, CheckCircle2, AlertCircle, X, Eye, EyeOff, Lock
// } from 'lucide-react';
// import { useAuthStore } from '@/store/authStore';
// import { useLang }      from '@/i18n/LanguageContext';
// import { Lang }         from '@/i18n/translations';
// import { cn }           from '@/lib/utils';

// const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// function getUserId(): string {
//   try { return JSON.parse(localStorage.getItem('supmti-auth')||'{}')?.state?.user?.id||''; }
//   catch { return ''; }
// }

// const PREFS_KEY = 'supmti-settings';
// function loadLocalPrefs() { try { return JSON.parse(localStorage.getItem(PREFS_KEY)||'{}'); } catch { return {}; } }
// function saveLocalPrefs(p: object) { localStorage.setItem(PREFS_KEY, JSON.stringify(p)); }

// // ── Toggle ────────────────────────────────────────────────────
// const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
//   <button onClick={onChange}
//     className={cn(
//       'w-14 h-8 rounded-full transition-all duration-300 relative shrink-0',
//       value ? 'bg-[#006666] shadow-lg shadow-emerald-100 dark:shadow-emerald-900/20' : 'bg-gray-200 dark:bg-slate-700'
//     )}>
//     <div className={cn(
//       'absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-sm',
//       value ? 'left-7' : 'left-1'
//     )} />
//   </button>
// );

// // ── Modal changement mot de passe ─────────────────────────────
// function ChangePasswordModal({ onClose }: { onClose: () => void }) {
//   const { t } = useLang();
//   const [currentPwd,  setCurrentPwd]  = useState('');
//   const [newPwd,      setNewPwd]      = useState('');
//   const [confirmPwd,  setConfirmPwd]  = useState('');
//   const [showCurrent, setShowCurrent] = useState(false);
//   const [showNew,     setShowNew]     = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [loading,     setLoading]     = useState(false);
//   const [error,       setError]       = useState<string|null>(null);
//   const [success,     setSuccess]     = useState(false);

//   const strength = (pwd: string) => {
//     let s = 0;
//     if (pwd.length >= 8)          s++;
//     if (/[A-Z]/.test(pwd))        s++;
//     if (/[0-9]/.test(pwd))        s++;
//     if (/[^A-Za-z0-9]/.test(pwd)) s++;
//     return s;
//   };
// const strengthLabel = [
//   '',
//   t('settings', 'weak'),
//   t('settings', 'medium'),
//   t('settings', 'good'),
//   t('settings', 'strong'),
// ];
//   const strengthColor = ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-emerald-400'];
//   const pwdStrength   = strength(newPwd);

//   const handleSubmit = async () => {
//     setError(null);
//     if (!currentPwd)           return setError('Mot de passe actuel requis.');
//     if (newPwd.length < 6)     return setError('Minimum 6 caractères.');
//     if (newPwd !== confirmPwd) return setError('Les mots de passe ne correspondent pas.');
//     if (newPwd === currentPwd) return setError('Le nouveau mot de passe doit être différent.');
//     setLoading(true);
//     try {
//       const uid = getUserId();
//       const res = await fetch(`${API}/api/auth/change-password`, {
//         method:      'POST',
//         credentials: 'include',
//         headers:     { 'Content-Type': 'application/json', ...(uid ? {'X-User-Id':uid} : {}) },
//         body:        JSON.stringify({ current_password: currentPwd, new_password: newPwd }),
//       });
//       const data = await res.json().catch(() => ({}));
//       if (!res.ok) setError(data.detail || 'Mot de passe actuel incorrect.');
//       else { setSuccess(true); setTimeout(onClose, 2000); }
//     } catch { setError('Impossible de joindre le serveur.'); }
//     finally { setLoading(false); }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
//       onClick={e => { if (e.target===e.currentTarget) onClose(); }}>
//       <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl border border-gray-100 dark:border-slate-800 animate-in zoom-in-95 duration-200 overflow-hidden">
//         <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
//               <Lock size={18} className="text-red-500"/>
//             </div>
//             <div>
//               <p className="font-black text-gray-900 dark:text-white">{t('settings','change_pwd')}</p>
// <p className="text-xs text-gray-400 dark:text-slate-500">
//   {t('settings', 'password_secure_hint')}
// </p>            </div>
//           </div>
//           <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-700 transition-all">
//             <X size={16}/>
//           </button>
//         </div>
//         {success ? (
//           <div className="p-8 text-center">
//             <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
//               <CheckCircle2 size={32} className="text-white"/>
//             </div>
//          <p className="font-black text-gray-900 dark:text-white text-lg">
//   {t('settings', 'password_changed')}
// </p>
// <p className="text-sm text-gray-400 mt-1">
//   {t('settings', 'auto_close')}
// </p>
//           </div>
//         ) : (
//           <div className="p-6 space-y-4">
//             {error && (
//               <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl animate-in fade-in">
//                 <AlertCircle size={15} className="text-red-500 shrink-0"/>
//                 <p className="text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>
//               </div>
//             )}
//             {[
//               { label:t('settings', 'current_password'), val:currentPwd, set:setCurrentPwd, show:showCurrent, toggle:()=>setShowCurrent(!showCurrent) },
//               { label:t('settings', 'new_password'), val:newPwd, set:setNewPwd, show:showNew, toggle:()=>setShowNew(!showNew) },
//               { label:t('settings', 'confirm_password'), val:confirmPwd, set:setConfirmPwd, show:showConfirm, toggle:()=>setShowConfirm(!showConfirm) },
//             ].map(({ label, val, set, show, toggle }, i) => (
//               <div key={i}>
//                 <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-1.5 ml-1 uppercase">{label}</label>
//                 <div className="relative">
//                   <input type={show?'text':'password'} value={val}
//                     onChange={e => { set(e.target.value); setError(null); }}
//                     placeholder="••••••••"
//                     className="w-full px-4 py-3 pr-11 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-sm outline-none focus:border-[#006666] transition-all text-gray-900 dark:text-white"/>
//                   <button type="button" onClick={toggle}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
//                     {show ? <EyeOff size={16}/> : <Eye size={16}/>}
//                   </button>
//                 </div>
//                 {i===1 && newPwd && (
//                   <div className="mt-2 space-y-1">
//                     <div className="flex gap-1">
//                       {[1,2,3,4].map(n => (
//                         <div key={n} className={cn('h-1.5 flex-1 rounded-full transition-all', n<=pwdStrength?strengthColor[pwdStrength]:'bg-gray-200 dark:bg-slate-700')}/>
//                       ))}
//                     </div>
//                     <p className={cn('text-[10px] font-bold ml-0.5', strengthColor[pwdStrength].replace('bg-','text-'))}>
//                       {strengthLabel[pwdStrength]}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             ))}
//             <div className="flex gap-3 pt-2">
//               <button onClick={onClose} className="flex-1 py-3 rounded-2xl border border-gray-200 dark:border-slate-700 text-gray-500 font-bold text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-all">
//                 {t('settings','cancel')}
//               </button>
//               <button onClick={handleSubmit} disabled={loading||!currentPwd||!newPwd||!confirmPwd}
//                 className="flex-1 py-3 rounded-2xl bg-[#006666] text-white font-black text-sm hover:bg-[#004d4d] disabled:opacity-50 flex items-center justify-center gap-2 transition-all">
// {loading
//   ? <><Loader2 size={15} className="animate-spin"/> {t('settings', 'updating')}</>
//   : t('settings', 'edit')
// }
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ── Carte de sélection de langue ──────────────────────────────
// const LANG_OPTIONS: { code: Lang; flag: string; label_fr: string; label_self: string; desc: string }[] = [
//   { code:'fr', flag:'🇫🇷', label_fr:'Français',  label_self:'Français', desc:'Interface en français' },
//   { code:'en', flag:'🇬🇧', label_fr:'Anglais',   label_self:'English',  desc:'Interface in English' },
//   { code:'ar', flag:'🇲🇦', label_fr:'Darija',    label_self:'الدارجة', desc:'الواجهة بالدارجة المغربية' },
// ];

// // ============================================================
// // PAGE PRINCIPALE
// // ============================================================
// export default function SettingsPage() {
//   const { theme, setTheme } = useTheme();
//   const { logout }          = useAuthStore();
//   const { lang, setLang, t, isRTL } = useLang();

//   const [ttsEnabled,    setTtsEnabled]    = useState(false);
//   const [notifications, setNotifications] = useState(true);
//   const [saving,        setSaving]        = useState(false);
//   const [saveStatus,    setSaveStatus]    = useState<'idle'|'ok'|'error'>('idle');
//   const [deleting,      setDeleting]      = useState(false);
//   const [mounted,       setMounted]       = useState(false);
//   const [showPwdModal,  setShowPwdModal]  = useState(false);
//   // Langue locale — confirmée seulement à la sauvegarde
//   const [localLang,     setLocalLang]     = useState<Lang>(lang);

//   useEffect(() => { setMounted(true); }, []);
//   useEffect(() => { setLocalLang(lang); }, [lang]);

//   useEffect(() => {
//     const prefs = loadLocalPrefs();
//     if (prefs.ttsEnabled    !== undefined) setTtsEnabled(prefs.ttsEnabled);
//     if (prefs.notifications !== undefined) setNotifications(prefs.notifications);
//   }, []);

//   const handleSave = async () => {
//     setSaving(true); setSaveStatus('idle');
//     // Appliquer la langue choisie
//     setLang(localLang);
//     saveLocalPrefs({ ttsEnabled, notifications });
//     await new Promise(r => setTimeout(r, 700));
//     setSaveStatus('ok'); setSaving(false);
//     setTimeout(() => setSaveStatus('idle'), 3000);
//   };

//   const handleDeleteHistory = async () => {
//     if (!confirm('Supprimer tout l\'historique ? Action irréversible.')) return;
//     setDeleting(true);
//     try {
//       const uid = getUserId();
//       const res = await fetch(`${API}/api/reset`, {
//         method:'POST', credentials:'include',
//         headers: uid ? {'X-User-Id':uid} : {},
//       });
//       if (res.ok) {
//         alert('Historique supprimé.');
//         window.dispatchEvent(new CustomEvent('sami:new-chat'));
//       }
//     } catch { alert('Erreur.'); }
//     finally { setDeleting(false); }
//   };

//   if (!mounted) return null;

//   return (
//     <>
//       {showPwdModal && <ChangePasswordModal onClose={() => setShowPwdModal(false)}/>}

//       <div dir={isRTL?'rtl':'ltr'} className="relative flex flex-col min-h-screen bg-gray-50/50 dark:bg-slate-950">
//         {/* Blobs déco */}
//         <div className="absolute inset-0 pointer-events-none overflow-hidden">
//           <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 dark:bg-blue-900/10 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-50"/>
//           <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-100 dark:bg-emerald-900/10 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-40"/>
//         </div>

//         <div className="container mx-auto px-6 py-12 relative z-10">

//           {/* Header */}
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
//             <div className="flex items-center gap-5">
//               <div className="p-4 bg-[#006666] text-white rounded-[2rem] shadow-xl shadow-emerald-200 dark:shadow-none">
//                 <Settings size={32} className="animate-[spin_6s_linear_infinite]"/>
//               </div>
//               <div>
//                 <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
//                   {t('settings','title')}
//                 </h1>
//                 <p className="text-gray-500 dark:text-gray-400 font-medium">{t('settings','subtitle')}</p>
//               </div>
//             </div>
//             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-700 text-[#006666] dark:text-emerald-400 text-xs font-bold shadow-sm">
//               <Sparkles size={14} className="animate-pulse"/> SAMI 2026
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Colonne principale */}
//             <div className="lg:col-span-2 space-y-8">

//               {/* ── LANGUE ── */}
//               <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="p-2 bg-blue-50 dark:bg-blue-950/30 text-blue-600 rounded-xl">
//                     <Globe size={20}/>
//                   </div>
//                   <div>
//                     <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('settings','lang_section')}</h2>
//                     <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{t('settings','lang_desc')}</p>
//                   </div>
//                 </div>

//                 {/* Grille 3 langues */}
//                 <div className="grid grid-cols-3 gap-4">
//                   {LANG_OPTIONS.map(opt => (
//                     <button
//                       key={opt.code}
//                       onClick={() => setLocalLang(opt.code)}
//                       className={cn(
//                         'relative p-5 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all duration-200 group',
//                         localLang === opt.code
//                           ? 'border-[#006666] bg-emerald-50 dark:bg-emerald-950/20 shadow-lg shadow-emerald-100 dark:shadow-none'
//                           : 'border-gray-100 dark:border-slate-700 hover:border-gray-200 dark:hover:border-slate-600 hover:shadow-md'
//                       )}
//                     >
//                       {/* Indicateur sélectionné */}
//                       {localLang === opt.code && (
//                         <div className="absolute top-3 right-3 w-5 h-5 bg-[#006666] rounded-full flex items-center justify-center">
//                           <CheckCircle2 size={12} className="text-white"/>
//                         </div>
//                       )}
//                       <span className="text-4xl group-hover:scale-110 transition-transform duration-200">
//                         {opt.flag}
//                       </span>
//                       <div className="text-center">
//                         <p className={cn(
//                           'font-black text-sm leading-tight',
//                           localLang === opt.code ? 'text-[#006666] dark:text-emerald-400' : 'text-gray-700 dark:text-slate-200'
//                         )}>
//                           {opt.label_self}
//                         </p>
//                         <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5 font-medium">
//                           {opt.label_fr}
//                         </p>
//                       </div>
//                     </button>
//                   ))}
//                 </div>

//                 {/* Note changement instantané */}
//                 {localLang !== lang && (
//                   <div className="mt-4 p-3 rounded-2xl bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
//                     <Info size={14} className="text-orange-500 shrink-0"/>
//                     <p className="text-xs text-orange-700 dark:text-orange-400 font-medium">
//                       {localLang === 'fr' && t('settings', 'lang_after_save_fr')}
//                       {localLang === 'en' && t('settings', 'lang_after_save_en')}
//                       {localLang === 'ar' && t('settings', 'lang_after_save_ar')}
//                     </p>
//                   </div>
//                 )}
//               </section>

//               {/* ── AUDIO ── */}
//               <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
//                 <div className="flex items-center gap-3 mb-8">
//                   <div className="p-2 bg-green-50 dark:bg-green-950/30 text-green-600 rounded-xl"><Volume2 size={20}/></div>
//                   <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('settings','audio_section')}</h2>
//                 </div>
//                 <div className="flex justify-between items-center p-6 rounded-[2rem] bg-gray-50 dark:bg-slate-800/50 border border-transparent hover:border-green-100 dark:hover:border-green-900/30 transition-all">
//                   <div>
//                     <p className="font-black text-gray-800 dark:text-white">{t('settings','tts_label')}</p>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">{t('settings','tts_desc')}</p>
//                   </div>
//                   <Toggle value={ttsEnabled} onChange={() => setTtsEnabled(!ttsEnabled)}/>
//                 </div>
//               </section>

//               {/* ── APPARENCE ── */}
//               <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm">
//                 <div className="flex items-center gap-3 mb-8">
//                   <div className="p-2 bg-purple-50 dark:bg-purple-950/30 text-purple-600 rounded-xl"><Moon size={20}/></div>
//                   <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('settings','appearance')}</h2>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   {[
//                     { val:'light',  label: t('settings','light'),  icon:<Sun size={18}/> },
//                     { val:'dark',   label: t('settings','dark'),   icon:<Moon size={18}/> },
//                     { val:'system', label: t('settings','system'), icon:<Settings size={18}/> },
//                   ].map(({ val, label, icon }) => (
//                     <button key={val} onClick={() => setTheme(val)}
//                       className={cn(
//                         'p-4 rounded-2xl border-2 flex items-center justify-between gap-2 transition-all',
//                         theme===val
//                           ? 'border-[#006666] bg-emerald-50 dark:bg-emerald-950/20 text-[#006666] dark:text-emerald-400'
//                           : 'border-gray-100 dark:border-slate-700 text-gray-400 dark:text-slate-500 hover:border-gray-200'
//                       )}>
//                       <div className="flex items-center gap-2">{icon}<span className="font-bold text-sm">{label}</span></div>
//                       <div className={cn(
//                         'w-4 h-4 rounded-full border-2 shrink-0',
//                         theme===val ? 'bg-[#006666] border-white' : 'border-gray-200 dark:border-slate-600'
//                       )}/>
//                     </button>
//                   ))}
//                 </div>
//               </section>
//             </div>

//             {/* Colonne droite */}
//             <div className="space-y-8">

//               {/* Sécurité */}
//               <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm">
//                 <div className="flex items-center gap-3 mb-8 text-red-500">
//                   <ShieldCheck size={20}/>
//                   <h2 className="text-xl font-bold dark:text-white">{t('settings','security')}</h2>
//                 </div>
//                 <div className="space-y-4">
//                   <button onClick={() => setShowPwdModal(true)}
//                     className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all group font-bold text-gray-700 dark:text-gray-300 text-sm">
//                     <div className="flex items-center gap-3">
//                       <KeyRound size={18} className="text-gray-400"/>
//                       {t('settings','change_pwd')}
//                     </div>
//                     <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform text-gray-400"/>
//                   </button>
//                   <div className="h-px bg-gray-100 dark:bg-slate-800 mx-4"/>
//                   <button onClick={handleDeleteHistory} disabled={deleting}
//                     className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-all group font-bold text-red-500 text-sm disabled:opacity-50">
//                     <div className="flex items-center gap-3">
//                       {deleting ? <Loader2 size={18} className="animate-spin"/> : <Trash2 size={18}/>}
//                       {t('settings','delete_history')}
//                     </div>
//                   </button>
//                 </div>
//               </section>

//               {/* Notifications */}
//               <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="flex items-center gap-3 text-orange-500">
//                     <Bell size={20}/>
//                     <h2 className="text-xl font-bold dark:text-white">{t('settings','notif_section')}</h2>
//                   </div>
//                   <Toggle value={notifications} onChange={() => setNotifications(!notifications)}/>
//                 </div>
//                 <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed font-medium">
//                   {t('settings','notif_desc')}
//                 </p>
//               </section>

//               {/* Langue actuelle badge */}
//               <div className="p-6 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm text-center space-y-3">
// <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
//   {t('settings', 'active_language')}
// </p>                <div className="flex items-center justify-center gap-2">
//                   <span className="text-3xl">{LANG_OPTIONS.find(l=>l.code===lang)?.flag}</span>
//                   <div className="text-left">
//                     <p className="font-black text-gray-900 dark:text-white text-sm">
//                       {LANG_OPTIONS.find(l=>l.code===lang)?.label_self}
//                     </p>
//                     <p className="text-[10px] text-gray-400">
//                       {LANG_OPTIONS.find(l=>l.code===lang)?.label_fr}
//                     </p>
//                   </div>
//                 </div>
//                 {lang === 'ar' && (
//                   <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
//                     الواجهة تدعم RTL ✓
//                   </p>
//                 )}
//               </div>

//               {/* Version */}
//               <div className="text-center p-6 bg-slate-900 dark:bg-[#006666]/10 rounded-[2.5rem] text-white dark:text-emerald-400 shadow-xl relative overflow-hidden group border dark:border-[#006666]/20">
//                 <div className="relative z-10">
//                   <Info size={24} className="mx-auto mb-2 opacity-50"/>
// <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">
//   {t('settings', 'app_version')}
// </p>                  <p className="text-lg font-black italic">v2.4-SUPMTI</p>
//                 </div>
//                 <Bot size={80} className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform"/>
//               </div>
//             </div>
//           </div>

//           {/* Footer actions */}
//           <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
//             <div className="h-8 flex items-center">
//               {saveStatus==='ok' && (
//                 <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-bold animate-in fade-in">
//                   <CheckCircle2 size={16}/> {t('settings','saved')}
//                 </div>
//               )}
//             </div>
//             <div className="flex gap-4">
//               <button
//                 onClick={() => { const p=loadLocalPrefs(); if(p.ttsEnabled!==undefined)setTtsEnabled(p.ttsEnabled); if(p.notifications!==undefined)setNotifications(p.notifications); setLocalLang(lang); }}
//                 className="px-8 py-4 text-gray-400 dark:text-gray-500 font-bold hover:text-gray-600 dark:hover:text-gray-300 transition">
//                 {t('settings','cancel')}
//               </button>
//               <button onClick={handleSave} disabled={saving}
//                 className="px-12 py-4 bg-[#006666] text-white rounded-[1.5rem] font-black shadow-2xl shadow-emerald-200 dark:shadow-none hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
//                 {saving
//                   ? <><Loader2 size={18} className="animate-spin"/> {t('settings','saving')}</>
//                   : <>{t('settings','save')} <ChevronRight size={18}/></>
//                 }
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }














'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import {
  Settings,
  Globe,
  Volume2,
  ShieldCheck,
  Sparkles,
  Trash2,
  KeyRound,
  Bell,
  Moon,
  Sun,
  ChevronRight,
  Bot,
  Info,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Eye,
  EyeOff,
  Lock,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useLang } from '@/i18n/LanguageContext';
import { Lang } from '@/i18n/translations';
import { cn } from '@/lib/utils';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

function getUserId(): string {
  try {
    return JSON.parse(localStorage.getItem('supmti-auth') || '{}')?.state?.user?.id || '';
  } catch {
    return '';
  }
}

const PREFS_KEY = 'supmti-settings';

function loadLocalPrefs() {
  try {
    return JSON.parse(localStorage.getItem(PREFS_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveLocalPrefs(p: object) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(p));
}

const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
  <button
    onClick={onChange}
    className={cn(
      'w-14 h-8 rounded-full transition-all duration-300 relative shrink-0',
      value
        ? 'bg-[#006666] shadow-lg shadow-emerald-100 dark:shadow-emerald-900/20'
        : 'bg-gray-200 dark:bg-slate-700'
    )}
  >
    <div
      className={cn(
        'absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-sm',
        value ? 'left-7' : 'left-1'
      )}
    />
  </button>
);

function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const { t } = useLang();

  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const strength = (pwd: string) => {
    let s = 0;
    if (pwd.length >= 8) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    return s;
  };

  const strengthLabel = [
    '',
    t('settings', 'weak'),
    t('settings', 'medium'),
    t('settings', 'good'),
    t('settings', 'strong'),
  ];

  const strengthColor = ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-emerald-400'];
  const pwdStrength = strength(newPwd);

  const handleSubmit = async () => {
    setError(null);

    if (!currentPwd) {
      return setError(t('settings', 'current_password'));
    }

    if (newPwd.length < 6) {
      return setError('Minimum 6 caractères.');
    }

    if (newPwd !== confirmPwd) {
      return setError('Les mots de passe ne correspondent pas.');
    }

    if (newPwd === currentPwd) {
      return setError('Le nouveau mot de passe doit être différent.');
    }

    setLoading(true);

    try {
      const uid = getUserId();
      const res = await fetch(`${API}/api/auth/change-password`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(uid ? { 'X-User-Id': uid } : {}),
        },
        body: JSON.stringify({
          current_password: currentPwd,
          new_password: newPwd,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.detail || 'Mot de passe actuel incorrect.');
      } else {
        setSuccess(true);
        setTimeout(onClose, 2000);
      }
    } catch {
      setError('Impossible de joindre le serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl border border-gray-100 dark:border-slate-800 animate-in zoom-in-95 duration-200 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
              <Lock size={18} className="text-red-500" />
            </div>
            <div>
              <p className="font-black text-gray-900 dark:text-white">
                {t('settings', 'change_pwd')}
              </p>
              <p className="text-xs text-gray-400 dark:text-slate-500">
                {t('settings', 'password_secure_hint')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-700 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 size={32} className="text-white" />
            </div>
            <p className="font-black text-gray-900 dark:text-white text-lg">
              {t('settings', 'password_changed')}
            </p>
            <p className="text-sm text-gray-400 mt-1">{t('settings', 'auto_close')}</p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl animate-in fade-in">
                <AlertCircle size={15} className="text-red-500 shrink-0" />
                <p className="text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>
              </div>
            )}

            {[
              {
                label: t('settings', 'current_password'),
                val: currentPwd,
                set: setCurrentPwd,
                show: showCurrent,
                toggle: () => setShowCurrent(!showCurrent),
              },
              {
                label: t('settings', 'new_password'),
                val: newPwd,
                set: setNewPwd,
                show: showNew,
                toggle: () => setShowNew(!showNew),
              },
              {
                label: t('settings', 'confirm_password'),
                val: confirmPwd,
                set: setConfirmPwd,
                show: showConfirm,
                toggle: () => setShowConfirm(!showConfirm),
              },
            ].map(({ label, val, set, show, toggle }, i) => (
              <div key={i}>
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-1.5 ml-1 uppercase">
                  {label}
                </label>

                <div className="relative">
                  <input
                    type={show ? 'text' : 'password'}
                    value={val}
                    onChange={(e) => {
                      set(e.target.value);
                      setError(null);
                    }}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-11 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-sm outline-none focus:border-[#006666] transition-all text-gray-900 dark:text-white"
                  />

                  <button
                    type="button"
                    onClick={toggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {i === 1 && newPwd && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((n) => (
                        <div
                          key={n}
                          className={cn(
                            'h-1.5 flex-1 rounded-full transition-all',
                            n <= pwdStrength ? strengthColor[pwdStrength] : 'bg-gray-200 dark:bg-slate-700'
                          )}
                        />
                      ))}
                    </div>
                    <p
                      className={cn(
                        'text-[10px] font-bold ml-0.5',
                        strengthColor[pwdStrength].replace('bg-', 'text-')
                      )}
                    >
                      {strengthLabel[pwdStrength]}
                    </p>
                  </div>
                )}
              </div>
            ))}

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl border border-gray-200 dark:border-slate-700 text-gray-500 font-bold text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
              >
                {t('settings', 'cancel')}
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading || !currentPwd || !newPwd || !confirmPwd}
                className="flex-1 py-3 rounded-2xl bg-[#006666] text-white font-black text-sm hover:bg-[#004d4d] disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    {t('settings', 'updating')}
                  </>
                ) : (
                  t('settings', 'edit')
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const LANG_OPTIONS: { code: Lang; flag: string; label_fr: string; label_self: string; desc: string }[] = [
  { code: 'fr', flag: '🇫🇷', label_fr: 'Français', label_self: 'Français', desc: 'Interface en français' },
  { code: 'en', flag: '🇬🇧', label_fr: 'Anglais', label_self: 'English', desc: 'Interface in English' },
  { code: 'ar', flag: '🇲🇦', label_fr: 'Darija', label_self: 'الدارجة', desc: 'الواجهة بالدارجة المغربية' },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { lang, setLang, t, isRTL } = useLang();

  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'ok' | 'error'>('idle');
  const [deleting, setDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [localLang, setLocalLang] = useState<Lang>(lang);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setLocalLang(lang);
  }, [lang]);

  useEffect(() => {
    const prefs = loadLocalPrefs();
    if (prefs.ttsEnabled !== undefined) setTtsEnabled(prefs.ttsEnabled);
    if (prefs.notifications !== undefined) setNotifications(prefs.notifications);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus('idle');

    setLang(localLang);
    saveLocalPrefs({ ttsEnabled, notifications });

    await new Promise((r) => setTimeout(r, 700));

    setSaveStatus('ok');
    setSaving(false);
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const handleDeleteHistory = async () => {
    if (!confirm(t('settings', 'delete_history_confirm'))) return;

    setDeleting(true);

    try {
      const uid = getUserId();
      const res = await fetch(`${API}/api/reset`, {
        method: 'POST',
        credentials: 'include',
        headers: uid ? { 'X-User-Id': uid } : {},
      });

      if (res.ok) {
        alert(t('settings', 'delete_history_success'));
        window.dispatchEvent(new CustomEvent('sami:new-chat'));
      } else {
        alert(t('settings', 'delete_history_error'));
      }
    } catch {
      alert(t('settings', 'delete_history_error'));
    } finally {
      setDeleting(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      {showPwdModal && <ChangePasswordModal onClose={() => setShowPwdModal(false)} />}

      <div dir={isRTL ? 'rtl' : 'ltr'} className="relative flex flex-col min-h-screen bg-gray-50/50 dark:bg-slate-950">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 dark:bg-blue-900/10 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-50" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-100 dark:bg-emerald-900/10 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-40" />
        </div>

        <div className="container mx-auto px-6 py-12 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-[#006666] text-white rounded-[2rem] shadow-xl shadow-emerald-200 dark:shadow-none">
                <Settings size={32} className="animate-[spin_6s_linear_infinite]" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                  {t('settings', 'title')}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  {t('settings', 'subtitle')}
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-700 text-[#006666] dark:text-emerald-400 text-xs font-bold shadow-sm">
              <Sparkles size={14} className="animate-pulse" /> SAMI 2026
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-50 dark:bg-blue-950/30 text-blue-600 rounded-xl">
                    <Globe size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                      {t('settings', 'lang_section')}
                    </h2>
                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                      {t('settings', 'lang_desc')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {LANG_OPTIONS.map((opt) => (
                    <button
                      key={opt.code}
                      onClick={() => setLocalLang(opt.code)}
                      className={cn(
                        'relative p-5 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all duration-200 group',
                        localLang === opt.code
                          ? 'border-[#006666] bg-emerald-50 dark:bg-emerald-950/20 shadow-lg shadow-emerald-100 dark:shadow-none'
                          : 'border-gray-100 dark:border-slate-700 hover:border-gray-200 dark:hover:border-slate-600 hover:shadow-md'
                      )}
                    >
                      {localLang === opt.code && (
                        <div className="absolute top-3 right-3 w-5 h-5 bg-[#006666] rounded-full flex items-center justify-center">
                          <CheckCircle2 size={12} className="text-white" />
                        </div>
                      )}

                      <span className="text-4xl group-hover:scale-110 transition-transform duration-200">
                        {opt.flag}
                      </span>

                      <div className="text-center">
                        <p
                          className={cn(
                            'font-black text-sm leading-tight',
                            localLang === opt.code
                              ? 'text-[#006666] dark:text-emerald-400'
                              : 'text-gray-700 dark:text-slate-200'
                          )}
                        >
                          {opt.label_self}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5 font-medium">
                          {opt.label_fr}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                {localLang !== lang && (
                  <div className="mt-4 p-3 rounded-2xl bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Info size={14} className="text-orange-500 shrink-0" />
                    <p className="text-xs text-orange-700 dark:text-orange-400 font-medium">
                      {localLang === 'fr' && t('settings', 'lang_after_save_fr')}
                      {localLang === 'en' && t('settings', 'lang_after_save_en')}
                      {localLang === 'ar' && t('settings', 'lang_after_save_ar')}
                    </p>
                  </div>
                )}
              </section>

              <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-green-50 dark:bg-green-950/30 text-green-600 rounded-xl">
                    <Volume2 size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    {t('settings', 'audio_section')}
                  </h2>
                </div>

                <div className="flex justify-between items-center p-6 rounded-[2rem] bg-gray-50 dark:bg-slate-800/50 border border-transparent hover:border-green-100 dark:hover:border-green-900/30 transition-all">
                  <div>
                    <p className="font-black text-gray-800 dark:text-white">
                      {t('settings', 'tts_label')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t('settings', 'tts_desc')}
                    </p>
                  </div>
                  <Toggle value={ttsEnabled} onChange={() => setTtsEnabled(!ttsEnabled)} />
                </div>
              </section>

              <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-purple-50 dark:bg-purple-950/30 text-purple-600 rounded-xl">
                    <Moon size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    {t('settings', 'appearance')}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { val: 'light', label: t('settings', 'light'), icon: <Sun size={18} /> },
                    { val: 'dark', label: t('settings', 'dark'), icon: <Moon size={18} /> },
                    { val: 'system', label: t('settings', 'system'), icon: <Settings size={18} /> },
                  ].map(({ val, label, icon }) => (
                    <button
                      key={val}
                      onClick={() => setTheme(val)}
                      className={cn(
                        'p-4 rounded-2xl border-2 flex items-center justify-between gap-2 transition-all',
                        theme === val
                          ? 'border-[#006666] bg-emerald-50 dark:bg-emerald-950/20 text-[#006666] dark:text-emerald-400'
                          : 'border-gray-100 dark:border-slate-700 text-gray-400 dark:text-slate-500 hover:border-gray-200'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {icon}
                        <span className="font-bold text-sm">{label}</span>
                      </div>
                      <div
                        className={cn(
                          'w-4 h-4 rounded-full border-2 shrink-0',
                          theme === val
                            ? 'bg-[#006666] border-white'
                            : 'border-gray-200 dark:border-slate-600'
                        )}
                      />
                    </button>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-3 mb-8 text-red-500">
                  <ShieldCheck size={20} />
                  <h2 className="text-xl font-bold dark:text-white">{t('settings', 'security')}</h2>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => setShowPwdModal(true)}
                    className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all group font-bold text-gray-700 dark:text-gray-300 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <KeyRound size={18} className="text-gray-400" />
                      {t('settings', 'change_pwd')}
                    </div>
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform text-gray-400" />
                  </button>

                  <div className="h-px bg-gray-100 dark:bg-slate-800 mx-4" />

                  <button
                    onClick={handleDeleteHistory}
                    disabled={deleting}
                    className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-all group font-bold text-red-500 text-sm disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      {deleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                      {t('settings', 'delete_history')}
                    </div>
                  </button>
                </div>
              </section>

              <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3 text-orange-500">
                    <Bell size={20} />
                    <h2 className="text-xl font-bold dark:text-white">
                      {t('settings', 'notif_section')}
                    </h2>
                  </div>
                  <Toggle value={notifications} onChange={() => setNotifications(!notifications)} />
                </div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed font-medium">
                  {t('settings', 'notif_desc')}
                </p>
              </section>

              <div className="p-6 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm text-center space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {t('settings', 'active_language')}
                </p>

                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl">{LANG_OPTIONS.find((l) => l.code === lang)?.flag}</span>
                  <div className="text-left">
                    <p className="font-black text-gray-900 dark:text-white text-sm">
                      {LANG_OPTIONS.find((l) => l.code === lang)?.label_self}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {LANG_OPTIONS.find((l) => l.code === lang)?.label_fr}
                    </p>
                  </div>
                </div>

                {lang === 'ar' && (
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                    {t('settings', 'rtl_supported')}
                  </p>
                )}
              </div>

              <div className="text-center p-6 bg-slate-900 dark:bg-[#006666]/10 rounded-[2.5rem] text-white dark:text-emerald-400 shadow-xl relative overflow-hidden group border dark:border-[#006666]/20">
                <div className="relative z-10">
                  <Info size={24} className="mx-auto mb-2 opacity-50" />
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                    {t('settings', 'app_version')}
                  </p>
                  <p className="text-lg font-black italic">v2.4-SUPMTI</p>
                </div>
                <Bot size={80} className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform" />
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="h-8 flex items-center">
              {saveStatus === 'ok' && (
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-bold animate-in fade-in">
                  <CheckCircle2 size={16} /> {t('settings', 'saved')}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  const p = loadLocalPrefs();
                  if (p.ttsEnabled !== undefined) setTtsEnabled(p.ttsEnabled);
                  if (p.notifications !== undefined) setNotifications(p.notifications);
                  setLocalLang(lang);
                }}
                className="px-8 py-4 text-gray-400 dark:text-gray-500 font-bold hover:text-gray-600 dark:hover:text-gray-300 transition"
              >
                {t('settings', 'cancel')}
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="px-12 py-4 bg-[#006666] text-white rounded-[1.5rem] font-black shadow-2xl shadow-emerald-200 dark:shadow-none hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> {t('settings', 'saving')}
                  </>
                ) : (
                  <>
                    {t('settings', 'save')} <ChevronRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}