// 'use client';
// import { useState, useEffect } from 'react';
// import { LoginForm }    from '@/components/forms/LoginForm';
// import { RegisterForm } from '@/components/forms/RegisterForm';
// import { GraduationCap, ShieldCheck, Terminal } from 'lucide-react';
// import { cn } from '@/lib/utils';

// type Tab = 'login' | 'register' | 'admin';

// // --- Composant Effet Machine à Écrire ---
// function Typewriter({ text }: { text: string }) {
//   const [displayText, setDisplayText] = useState('');

//   useEffect(() => {
//     let i = 0;
//     const timer = setInterval(() => {
//       setDisplayText(text.slice(0, i));
//       i++;
//       if (i > text.length) clearInterval(timer);
//     }, 50);
//     return () => clearInterval(timer);
//   }, [text]);

//   return (
//     <span className="font-mono">
//       {displayText}
//       <span className="animate-pulse">_</span>
//     </span>
//   );
// }

// export default function LoginPage() {
//   const [tab, setTab] = useState<Tab>('login');

//   // Écoute du raccourci CTRL + SHIFT + A
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
//         e.preventDefault();
//         setTab('admin');
//       }
//     };
//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, []);

//   return (
//     <div className={cn(
//       "min-h-screen flex items-center justify-center transition-colors duration-500 px-4 py-12",
//       tab === 'admin' 
//         ? "bg-black" 
//         : "bg-gradient-to-br from-white to-gray-100 dark:from-slate-950 dark:to-slate-900"
//     )}>
//       <div className="w-full max-w-md">

//         {/* ── Logo & Header ── */}
//         <div className="flex flex-col items-center mb-8">
//           <div className={cn(
//             "p-4 rounded-3xl shadow-xl mb-4 border transition-all duration-500",
//             tab === 'admin' 
//               ? "bg-zinc-900 border-emerald-500/50 shadow-emerald-500/10" 
//               : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700"
//           )}>
//             {tab === 'admin' ? (
//               <ShieldCheck size={40} className="text-emerald-500 animate-pulse" />
//             ) : (
//               <GraduationCap size={40} className="text-[#006666]" />
//             )}
//           </div>
          
//           <h1 className={cn(
//             "text-2xl font-black tracking-tight transition-colors",
//             tab === 'admin' ? "text-white font-mono" : "text-slate-900 dark:text-white"
//           )}>
//             {tab === 'admin' ? "CORE_SYSTEM_ACCESS" : "SUPMTI Meknès"}
//           </h1>
//           <p className={cn(
//             "text-sm mt-1 transition-colors",
//             tab === 'admin' ? "text-emerald-500/70 font-mono" : "text-slate-500 dark:text-slate-400"
//           )}>
//             {tab === 'admin' ? <Typewriter text="SAMI_ROOT v2.0 // Port: 8000" /> : "Espace étudiant — Assistant IA"}
//           </p>
//         </div>

//         {/* ── Carte principale ── */}
//         <div className={cn(
//           "rounded-3xl shadow-2xl border transition-all duration-500 overflow-hidden relative",
//           tab === 'admin' 
//             ? "bg-zinc-900 border-emerald-500/30 shadow-emerald-500/5" 
//             : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
//         )}>

//           {/* Effet Scanline (Ligne qui descend) - Uniquement en Admin */}
//           {tab === 'admin' && (
//             <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
//               <div className="w-full h-[2px] bg-emerald-500 animate-scan" />
//             </div>
//           )}

//           {/* ── Onglets (Cachés en mode Admin) ── */}
//           {tab !== 'admin' && (
//             <div className="flex border-b border-slate-100 dark:border-slate-800">
//               <button
//                 onClick={() => setTab('login')}
//                 className={cn(
//                   'flex-1 py-4 text-sm font-bold transition-all',
//                   tab === 'login'
//                     ? 'text-[#006666] border-b-2 border-[#006666] bg-emerald-50/50 dark:bg-emerald-950/10'
//                     : 'text-slate-400 hover:text-slate-600'
//                 )}
//               >
//                 Se connecter
//               </button>
//               <button
//                 onClick={() => setTab('register')}
//                 className={cn(
//                   'flex-1 py-4 text-sm font-bold transition-all',
//                   tab === 'register'
//                     ? 'text-[#006666] border-b-2 border-[#006666] bg-emerald-50/50 dark:bg-emerald-950/10'
//                     : 'text-slate-400 hover:text-slate-600'
//                 )}
//               >
//                 Créer un compte
//               </button>
//             </div>
//           )}

//           {/* ── Contenu ── */}
//           <div className="p-8">
//             {tab === 'admin' ? (
//               /* Vue ADMIN Specifique */
//               <div className="animate-in fade-in zoom-in-95 duration-500">
//                 <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-black border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
//                   <Terminal size={18} className="text-emerald-500" />
//                   <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
//                     <Typewriter text="AUTHENTICATION_REQUIRED // SECURE_LINE" />
//                   </div>
//                 </div>
                
//                 <LoginForm isAdminMode={true} />

//                 <button 
//                   onClick={() => setTab('login')}
//                   className="w-full mt-8 text-[9px] font-mono text-emerald-900 hover:text-red-500 transition-all uppercase tracking-[0.3em]"
//                 >
//                   [ Terminate Session & Exit ]
//                 </button>
//               </div>
//             ) : tab === 'login' ? (
//               <>
//                 <div className="mb-6">
//                   <h2 className="text-xl font-black text-slate-900 dark:text-white">Bon retour 👋</h2>
//                   <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Connecte-toi pour ton orientation</p>
//                 </div>
//                 <LoginForm />
//                 <p className="text-center text-xs text-slate-400 mt-6">
//                   Pas encore de compte ?{' '}
//                   <button onClick={() => setTab('register')} className="text-[#006666] font-bold hover:underline">Créer un compte</button>
//                 </p>
//               </>
//             ) : (
//               <>
//                 <div className="mb-6">
//                   <h2 className="text-xl font-black text-slate-900 dark:text-white">Rejoins SUPMTI 🎓</h2>
//                   <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Crée ton compte maintenant</p>
//                 </div>
//                 <RegisterForm />
//                 <p className="text-center text-xs text-slate-400 mt-6">
//                   Déjà inscrit ?{' '}
//                   <button onClick={() => setTab('login')} className="text-[#006666] font-bold hover:underline">Se connecter</button>
//                 </p>
//               </>
//             )}
//           </div>
//         </div>

//         {/* ── Footer ── */}
//         <p className={cn(
//           "text-center text-[10px] mt-6 uppercase tracking-widest transition-colors",
//           tab === 'admin' ? "text-emerald-900 font-mono" : "text-slate-400"
//         )}>
//           © 2026 SUPMTI · {tab === 'admin' ? "AUTHORIZED_PERSONNEL_ONLY" : "Plateforme IA Multimodale"}
//         </p>
//       </div>
//     </div>
//   );
// }



'use client';
import { useState, useEffect } from 'react';
import { LoginForm }    from '@/components/forms/LoginForm';
import { RegisterForm } from '@/components/forms/RegisterForm';
import { GraduationCap, ShieldCheck, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLang } from '@/i18n/LanguageContext';

type Tab = 'login' | 'register' | 'admin';

function Typewriter({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState('');
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(timer);
    }, 50);
    return () => clearInterval(timer);
  }, [text]);
  return <span className="font-mono">{displayText}<span className="animate-pulse">_</span></span>;
}

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>('login');
  const { t } = useLang();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setTab('admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center transition-colors duration-500 px-4 py-12",
      tab === 'admin'
        ? "bg-black"
        : "bg-gradient-to-br from-white to-gray-100 dark:from-slate-950 dark:to-slate-900"
    )}>
      <div className="w-full max-w-md">

        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-8">
          <div className={cn(
            "p-4 rounded-3xl shadow-xl mb-4 border transition-all duration-500",
            tab === 'admin'
              ? "bg-zinc-900 border-emerald-500/50 shadow-emerald-500/10"
              : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700"
          )}>
            {tab === 'admin'
              ? <ShieldCheck size={40} className="text-emerald-500 animate-pulse" />
              : <GraduationCap size={40} className="text-[#006666]" />
            }
          </div>

          <h1 className={cn(
            "text-2xl font-black tracking-tight transition-colors",
            tab === 'admin' ? "text-white font-mono" : "text-slate-900 dark:text-white"
          )}>
            {tab === 'admin' ? "CORE_SYSTEM_ACCESS" : "SUPMTI Meknès"}
          </h1>
          <p className={cn(
            "text-sm mt-1 transition-colors",
            tab === 'admin' ? "text-emerald-500/70 font-mono" : "text-slate-500 dark:text-slate-400"
          )}>
            {tab === 'admin'
              ? <Typewriter text="SAMI_ROOT v2.0 // Port: 8000" />
              : t('chat', 'empty_subtitle')
            }
          </p>
        </div>

        {/* Carte principale */}
        <div className={cn(
          "rounded-3xl shadow-2xl border transition-all duration-500 overflow-hidden relative",
          tab === 'admin'
            ? "bg-zinc-900 border-emerald-500/30 shadow-emerald-500/5"
            : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
        )}>
          {tab === 'admin' && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
              <div className="w-full h-[2px] bg-emerald-500 animate-scan" />
            </div>
          )}

          {/* Onglets */}
          {tab !== 'admin' && (
            <div className="flex border-b border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setTab('login')}
                className={cn(
                  'flex-1 py-4 text-sm font-bold transition-all',
                  tab === 'login'
                    ? 'text-[#006666] border-b-2 border-[#006666] bg-emerald-50/50 dark:bg-emerald-950/10'
                    : 'text-slate-400 hover:text-slate-600'
                )}
              >
                {t('auth', 'login')}
              </button>
              <button
                onClick={() => setTab('register')}
                className={cn(
                  'flex-1 py-4 text-sm font-bold transition-all',
                  tab === 'register'
                    ? 'text-[#006666] border-b-2 border-[#006666] bg-emerald-50/50 dark:bg-emerald-950/10'
                    : 'text-slate-400 hover:text-slate-600'
                )}
              >
                {t('auth', 'register')}
              </button>
            </div>
          )}

          {/* Contenu */}
          <div className="p-8">
            {tab === 'admin' ? (
              <div className="animate-in fade-in zoom-in-95 duration-500">
                <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-black border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                  <Terminal size={18} className="text-emerald-500" />
                  <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
                    <Typewriter text="AUTHENTICATION_REQUIRED // SECURE_LINE" />
                  </div>
                </div>
                <LoginForm isAdminMode={true} />
                <button
                  onClick={() => setTab('login')}
                  className="w-full mt-8 text-[9px] font-mono text-emerald-900 hover:text-red-500 transition-all uppercase tracking-[0.3em]"
                >
                  [ Terminate Session &amp; Exit ]
                </button>
              </div>
            ) : tab === 'login' ? (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    {t('auth', 'has_account')} 👋
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {t('chat', 'empty_subtitle')}
                  </p>
                </div>
                <LoginForm />
                <p className="text-center text-xs text-slate-400 mt-6">
                  {t('auth', 'no_account')}{' '}
                  <button onClick={() => setTab('register')} className="text-[#006666] font-bold hover:underline">
                    {t('auth', 'register')}
                  </button>
                </p>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    SUPMTI 🎓
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {t('auth', 'register')}
                  </p>
                </div>
                <RegisterForm />
                <p className="text-center text-xs text-slate-400 mt-6">
                  {t('auth', 'has_account')}{' '}
                  <button onClick={() => setTab('login')} className="text-[#006666] font-bold hover:underline">
                    {t('auth', 'login')}
                  </button>
                </p>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className={cn(
          "text-center text-[10px] mt-6 uppercase tracking-widest transition-colors",
          tab === 'admin' ? "text-emerald-900 font-mono" : "text-slate-400"
        )}>
          © 2026 SUPMTI · {tab === 'admin' ? "AUTHORIZED_PERSONNEL_ONLY" : "Plateforme IA Multimodale"}
        </p>
      </div>
    </div>
  );
}