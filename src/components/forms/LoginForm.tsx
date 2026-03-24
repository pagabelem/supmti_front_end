// 'use client';
// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { useAuthStore } from '@/store/authStore';
// import { useRouter } from 'next/navigation';
// import { Mail, Lock, Loader2, AlertCircle, ShieldAlert, Terminal } from 'lucide-react';
// import { cn } from '@/lib/utils';

// const loginSchema = z.object({
//   email:    z.string().email('Email invalide'),
//   password: z.string().min(6, 'Minimum 6 caractères'),
// });

// type LoginValues = z.infer<typeof loginSchema>;

// const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// interface LoginFormProps {
//   isAdminMode?: boolean;
// }

// export const LoginForm = ({ isAdminMode = false }: LoginFormProps) => {
//   const { setAuth }  = useAuthStore();
//   const router       = useRouter();
//   const [apiError, setApiError] = useState<string | null>(null);

//   const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({
//     resolver: zodResolver(loginSchema),
//   });

//   const onSubmit = async (data: LoginValues) => {
//     setApiError(null);
//     try {
//       const res = await fetch(`${API}/api/auth/login`, {
//         method:      'POST',
//         headers:     { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({ email: data.email, password: data.password }),
//       });

//       const json = await res.json().catch(() => ({}));

//       if (!res.ok) {
//         setApiError(json.detail || json.message || 'Email ou mot de passe incorrect.');
//         return;
//       }

//       const user  = json.user  ?? json;
//       const token = json.token ?? json.access_token ?? 'session';

//       setAuth(user, token);

//       const role = (user.role || '').toLowerCase();
//       if (role === 'admin') {
//         router.push('/admin/dashboard');
//       } else {
//         router.push('/dashboard');
//       }

//     } catch {
//       setApiError(isAdminMode 
//         ? 'CRITICAL_ERROR: CONNECTION_REFUSED. Check backend status.' 
//         : 'Impossible de joindre le serveur. Vérifie que le backend est lancé.'
//       );
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

//       {/* Erreur API globale */}
//       {apiError && (
//         <div className={cn(
//           "flex items-center gap-2 p-3 rounded-xl border animate-shake",
//           isAdminMode 
//             ? "bg-red-950/20 border-red-500/50" 
//             : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
//         )}>
//           {isAdminMode ? <ShieldAlert size={16} className="text-red-500" /> : <AlertCircle size={16} className="text-red-500 shrink-0" />}
//           <p className={cn(
//             "text-xs font-medium",
//             isAdminMode ? "text-red-400 font-mono uppercase" : "text-red-600 dark:text-red-400"
//           )}>
//             {isAdminMode ? `[ERROR] : ${apiError}` : apiError}
//           </p>
//         </div>
//       )}

//       {/* Email / Root User */}
//       <div>
//         <label className={cn(
//           "block text-sm font-bold mb-1.5 ml-1 transition-colors",
//           isAdminMode ? "text-emerald-500 font-mono italic" : "text-gray-700 dark:text-gray-300"
//         )}>
//           {isAdminMode ? "> IDENTIFIER" : "Email"}
//         </label>
//         <div className="relative group">
//           <div className={cn(
//             "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors",
//             isAdminMode ? "text-emerald-700 group-focus-within:text-emerald-400" : "text-gray-400 group-focus-within:text-supmti-blue"
//           )}>
//             {isAdminMode ? <Terminal size={18} /> : <Mail size={18} />}
//           </div>
//           <input
//             {...register('email')}
//             placeholder={isAdminMode ? "root@sami.system" : "nom@exemple.com"}
//             autoComplete="email"
//             className={cn(
//               "w-full pl-10 pr-4 py-2.5 rounded-xl outline-none transition-all shadow-sm border",
//               isAdminMode 
//                 ? "bg-black border-emerald-500/30 text-emerald-500 font-mono placeholder:text-emerald-900 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 shadow-[inset_0_0_10px_rgba(16,185,129,0.05)]" 
//                 : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-supmti-blue/20 focus:border-supmti-blue"
//             )}
//           />
//         </div>
//         {errors.email && (
//           <p className={cn("text-xs mt-1.5 ml-1 italic", isAdminMode ? "text-red-500 font-mono" : "text-red-500 font-medium")}>
//             {isAdminMode ? `! ${errors.email.message?.toUpperCase()}` : errors.email.message}
//           </p>
//         )}
//       </div>

//       {/* Mot de passe / Access Key */}
//       <div>
//         <label className={cn(
//           "block text-sm font-bold mb-1.5 ml-1 transition-colors",
//           isAdminMode ? "text-emerald-500 font-mono italic" : "text-gray-700 dark:text-gray-300"
//         )}>
//           {isAdminMode ? "> ACCESS_KEY" : "Mot de passe"}
//         </label>
//         <div className="relative group">
//           <div className={cn(
//             "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors",
//             isAdminMode ? "text-emerald-700 group-focus-within:text-emerald-400" : "text-gray-400 group-focus-within:text-supmti-blue"
//           )}>
//             <Lock size={18} />
//           </div>
//           <input
//             type="password"
//             {...register('password')}
//             placeholder="••••••••"
//             autoComplete="current-password"
//             className={cn(
//               "w-full pl-10 pr-4 py-2.5 rounded-xl outline-none transition-all shadow-sm border",
//               isAdminMode 
//                 ? "bg-black border-emerald-500/30 text-emerald-500 font-mono placeholder:text-emerald-900 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 shadow-[inset_0_0_10px_rgba(16,185,129,0.05)]" 
//                 : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-supmti-blue/20 focus:border-supmti-blue"
//             )}
//           />
//         </div>
//         {errors.password && (
//           <p className={cn("text-xs mt-1.5 ml-1 italic", isAdminMode ? "text-red-500 font-mono" : "text-red-500 font-medium")}>
//              {isAdminMode ? `! ${errors.password.message?.toUpperCase()}` : errors.password.message}
//           </p>
//         )}
//       </div>

//       {/* Submit */}
//       <button
//         type="submit"
//         disabled={isSubmitting}
//         className={cn(
//           "w-full py-3 rounded-xl font-bold transition-all flex justify-center items-center gap-2",
//           isAdminMode
//             ? "bg-emerald-600 hover:bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.25)] uppercase tracking-widest font-mono active:scale-95"
//             : "bg-supmti-blue dark:bg-blue-600 text-white hover:bg-blue-800 shadow-lg shadow-blue-100 dark:shadow-none hover:scale-[1.02] active:scale-95"
//         )}
//       >
//         {isSubmitting ? (
//           <Loader2 size={20} className="animate-spin" />
//         ) : (
//           isAdminMode ? 'GRANT_ACCESS' : 'Se connecter'
//         )}
//       </button>

//       {!isAdminMode && (
//         <div className="text-center mt-2">
//           <button type="button" className="text-xs text-gray-500 dark:text-gray-400 hover:text-supmti-blue dark:hover:text-blue-400 transition-colors">
//             Mot de passe oublié ?
//           </button>
//         </div>
//       )}
//     </form>
//   );
// };


// 'use client';
// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { useAuthStore } from '@/store/authStore';
// import { useRouter } from 'next/navigation';
// import { Mail, Lock, Loader2, AlertCircle, ShieldAlert, Terminal, ArrowRight } from 'lucide-react';
// import { cn } from '@/lib/utils';

// const loginSchema = z.object({
//   email: z.string().email('Email invalide'),
//   password: z.string().min(6, 'Minimum 6 caractères'),
// });

// type LoginValues = z.infer<typeof loginSchema>;

// const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// const colors = {
//   teal: '#005555',
//   red: '#E31E24',
// };

// export const LoginForm = ({ isAdminMode = false }: { isAdminMode?: boolean }) => {
//   const { setAuth } = useAuthStore();
//   const router = useRouter();
//   const [apiError, setApiError] = useState<string | null>(null);

//   const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({
//     resolver: zodResolver(loginSchema),
//   });

//   const onSubmit = async (data: LoginValues) => {
//     setApiError(null);
//     try {
//       const res = await fetch(`${API}/api/auth/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data),
//       });

//       const json = await res.json().catch(() => ({}));
//       if (!res.ok) {
//         setApiError(json.detail || json.message || 'Identifiants incorrects.');
//         return;
//       }

//       setAuth(json.user ?? json, json.token ?? 'session');
//       const role = (json.user?.role || '').toLowerCase();
      
//       // Routes conservées telles quelles
//       if (role === 'admin') {
//         router.push('/admin/dashboard');
//       } else {
//         router.push('/dashboard');
//       }
//     } catch {
//       setApiError(isAdminMode ? 'SYSTEM_OFFLINE: CHECK_BACKEND' : 'Serveur inaccessible.');
//     }
//   };

//   return (
//     // Conteneur principal avec padding
//     <div className="w-full max-w-md mx-auto p-10 bg-white rounded-3xl shadow-2xl border border-slate-100">
      
//       {/* En-tête avec Logo et Trait de Marque (Caché en mode Admin) */}
//       {!isAdminMode && (
//         <div className="text-center mb-10">
//           <img 
//             src="/images/logo-supmti.png" 
//             alt="Logo SUPMTI" 
//             className="h-20 mx-auto"
//           />
//           {/* Trait de marque décoratif style SUPMTI */}
//           <div className="w-full flex h-2.5 rounded-full overflow-hidden mt-6 shadow-inner" style={{ backgroundColor: 'white' }}>
//             <div className="h-full w-[35%]" style={{ backgroundColor: colors.red }} />
//             <div className="h-full w-[65%]" style={{ backgroundColor: colors.teal }} />
//           </div>
//         </div>
//       )}

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
//         {/* Affichage des Erreurs API */}
//         {apiError && (
//           <div className={cn(
//             "flex items-center gap-3 p-4 rounded-xl border animate-in slide-in-from-top-4 duration-300",
//             isAdminMode 
//               ? "bg-red-950/20 border-red-500/40 text-red-400 font-mono text-[11px]" 
//               : "bg-red-50 border-red-100 text-red-600 shadow-sm"
//           )}>
//             {isAdminMode ? <ShieldAlert size={16} /> : <AlertCircle size={20} className="shrink-0" />}
//             <p className="font-semibold">{isAdminMode ? `> ERROR_LOG: ${apiError.toUpperCase()}` : apiError}</p>
//           </div>
//         )}

//         {/* Champ Identifiant - Sans Étiquette (cachée) */}
//         <div className="space-y-2">
//           {/* Étiquette masquée */}
//           <div className="relative group">
//             <div className={cn(
//               "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200",
//               isAdminMode ? "text-emerald-900 group-focus-within:text-emerald-400" : "text-slate-400 group-focus-within:text-[#005555]"
//             )}>
//               {isAdminMode ? <Terminal size={18} /> : <Mail size={20} />}
//             </div>
//             <input
//               {...register('email')}
//               // Placeholder descriptif pour compenser l'absence d'étiquette
//               placeholder={isAdminMode ? ":: root_identifier" : "Entrez votre identifiant ou email"}
//               className={cn(
//                 "w-full pl-12 pr-4 py-3.5 rounded-2xl border transition-all duration-200 outline-none",
//                 isAdminMode 
//                   ? "bg-zinc-950 border-emerald-900/30 text-emerald-400 font-mono focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10" 
//                   : "bg-white border-slate-200 focus:border-[#005555] focus:ring-4 focus:ring-[#005555]/5 shadow-sm"
//               )}
//             />
//           </div>
//           {errors.email && <p className="text-[11px] text-red-500 ml-3 font-medium">⚠ {errors.email.message}</p>}
//         </div>

//         {/* Champ Mot de passe - Sans Étiquette (cachée) */}
//         <div className="space-y-2">
//           {/* Étiquette masquée */}
//           <div className="relative group">
//             <div className={cn(
//               "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200",
//               isAdminMode ? "text-emerald-900 group-focus-within:text-emerald-400" : "text-slate-400 group-focus-within:text-[#005555]"
//             )}>
//               <Lock size={20} />
//             </div>
//             <input
//               type="password"
//               {...register('password')}
//               // Placeholder descriptif pour compenser l'absence d'étiquette
//               placeholder={isAdminMode ? ":: secure_key" : "Entrez votre mot de passe"}
//               className={cn(
//                 "w-full pl-12 pr-4 py-3.5 rounded-2xl border transition-all duration-200 outline-none",
//                 isAdminMode 
//                   ? "bg-zinc-950 border-emerald-900/30 text-emerald-400 font-mono focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10" 
//                   : "bg-white border-slate-200 focus:border-[#005555] focus:ring-4 focus:ring-[#005555]/5 shadow-sm"
//               )}
//             />
//           </div>
//           {errors.password && <p className="text-[11px] text-red-500 ml-3 font-medium">⚠ {errors.password.message}</p>}
//         </div>

//         {/* Bouton de Connexion */}
//         <button
//           type="submit"
//           disabled={isSubmitting}
//           style={!isAdminMode ? { backgroundColor: colors.teal } : {}}
//           className={cn(
//             "w-full py-4 rounded-2xl font-black text-white transition-all duration-300 flex justify-center items-center gap-3 active:scale-[0.97]",
//             isAdminMode 
//               ? "bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.3)] font-mono uppercase tracking-[0.25em]" 
//               : "hover:shadow-xl hover:shadow-[#005555]/20"
//           )}
//         >
//           {isSubmitting ? (
//             <Loader2 size={22} className="animate-spin" />
//           ) : (
//             <>
//               <span className={!isAdminMode ? "text-lg" : ""}>
//                 {isAdminMode ? 'AUTHORIZE_SESSION' : 'Se connecter'}
//               </span>
//               {!isAdminMode && <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />}
//             </>
//           )}
//         </button>

//         {/* Mot de passe oublié (Caché en mode Admin) */}
//         {!isAdminMode && (
//           <div className="pt-2 text-center">
//             <button type="button" className="text-sm font-bold text-slate-400 hover:text-[#E31E24] transition-colors duration-200 underline-offset-4 hover:underline">
//               Mot de passe oublié ?
//             </button>
//           </div>
//         )}
//       </form>
//     </div>
//   );
// };



'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, AlertCircle, ShieldAlert, Terminal, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Minimum 6 caractères'),
});

type LoginValues = z.infer<typeof loginSchema>;

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
const colors = { teal: '#005555', red: '#E31E24' };

export const LoginForm = ({ isAdminMode = false }: { isAdminMode?: boolean }) => {
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginValues) => {
    setApiError(null);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setApiError(json.detail || json.message || 'Identifiants incorrects.');
        return;
      }
      setAuth(json.user ?? json, json.token ?? 'session');
      const role = (json.user?.role || '').toLowerCase();
      router.push(role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } catch {
      setApiError(isAdminMode ? 'SYSTEM_OFFLINE' : 'Serveur inaccessible.');
    }
  };

  return (
    <div className={cn(
      "w-full max-w-md mx-auto p-10 rounded-3xl shadow-2xl border transition-all duration-300",
      isAdminMode 
        ? "bg-black border-emerald-900/30 shadow-emerald-900/10" 
        : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
    )}>
      
      {!isAdminMode && (
        <div className="text-center mb-10">
          <img src="/images/logo-supmti.png" alt="Logo" className="h-20 mx-auto dark:brightness-110" />
          <div className="w-full flex h-2 rounded-full overflow-hidden mt-6 bg-slate-100 dark:bg-slate-800 shadow-inner">
            <div className="h-full w-[35%]" style={{ backgroundColor: colors.red }} />
            <div className="h-full w-[65%]" style={{ backgroundColor: colors.teal }} />
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {apiError && (
          <div className={cn(
            "flex items-center gap-3 p-4 rounded-xl border animate-in slide-in-from-top-4",
            isAdminMode ? "bg-red-950/20 border-red-500/40 text-red-400 font-mono" : "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400"
          )}>
            {isAdminMode ? <ShieldAlert size={16} /> : <AlertCircle size={20} />}
            <p className="text-sm font-semibold">{apiError}</p>
          </div>
        )}

        <div className="relative group">
          <div className={cn(
            "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors",
            isAdminMode ? "text-emerald-900 group-focus-within:text-emerald-400" : "text-slate-400 dark:text-slate-500 group-focus-within:text-[#005555]"
          )}>
            {isAdminMode ? <Terminal size={18} /> : <Mail size={20} />}
          </div>
          <input
            {...register('email')}
            placeholder={isAdminMode ? ":: root_identifier" : "Identifiant ou email"}
            className={cn(
              "w-full pl-12 pr-4 py-3.5 rounded-2xl border outline-none transition-all",
              isAdminMode 
                ? "bg-zinc-950 border-emerald-900/30 text-emerald-400 font-mono focus:border-emerald-500" 
                : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-[#005555]"
            )}
          />
        </div>

        <div className="relative group">
          <div className={cn(
            "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors",
            isAdminMode ? "text-emerald-900 group-focus-within:text-emerald-400" : "text-slate-400 dark:text-slate-500 group-focus-within:text-[#005555]"
          )}>
            <Lock size={20} />
          </div>
          <input
            type="password"
            {...register('password')}
            placeholder={isAdminMode ? ":: secure_key" : "Mot de passe"}
            className={cn(
              "w-full pl-12 pr-4 py-3.5 rounded-2xl border outline-none transition-all",
              isAdminMode 
                ? "bg-zinc-950 border-emerald-900/30 text-emerald-400 font-mono focus:border-emerald-500" 
                : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-[#005555]"
            )}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={!isAdminMode ? { backgroundColor: colors.teal } : {}}
          className={cn(
            "w-full py-4 rounded-2xl font-black text-white transition-all flex justify-center items-center gap-3 active:scale-[0.97]",
            isAdminMode ? "bg-emerald-600 hover:bg-emerald-500 font-mono tracking-widest" : "hover:opacity-90 shadow-lg shadow-[#005555]/20 dark:shadow-none"
          )}
        >
          {isSubmitting ? <Loader2 size={22} className="animate-spin" /> : <>{isAdminMode ? 'AUTH_EXEC' : 'Se connecter'} <ArrowRight size={20} /></>}
        </button>

        {!isAdminMode && (
          <div className="text-center">
            <button type="button" className="text-sm font-bold text-slate-400 dark:text-slate-500 hover:text-[#E31E24] transition-colors">
              Mot de passe oublié ?
            </button>
          </div>
        )}
      </form>
    </div>
  );
};