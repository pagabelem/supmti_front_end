// 'use client';
// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { useAuthStore } from '@/store/authStore';
// import { useRouter } from 'next/navigation';
// import { UserPlus, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

// const registerSchema = z.object({
//   full_name:       z.string().min(3, 'Nom trop court (min 3 caractères)'),
//   email:           z.string().email('Email invalide'),
//   password:        z.string().min(6, '6 caractères minimum'),
//   confirmPassword: z.string(),
// }).refine((d) => d.password === d.confirmPassword, {
//   message: 'Les mots de passe ne correspondent pas',
//   path:    ['confirmPassword'],
// });

// type RegisterValues = z.infer<typeof registerSchema>;

// const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// export const RegisterForm = () => {
//   const { setAuth }  = useAuthStore();
//   const router       = useRouter();
//   const [apiError, setApiError] = useState<string | null>(null);

//   const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterValues>({
//     resolver: zodResolver(registerSchema),
//   });

//   const onSubmit = async (data: RegisterValues) => {
//     setApiError(null);
//     try {
//       // ── 1. Créer le compte ──────────────────────────────────
//       const res = await fetch(`${API}/api/auth/register`, {
//         method:      'POST',
//         headers:     { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({
//           full_name: data.full_name,
//           email:     data.email,
//           password:  data.password,
//           role:      'student',
//         }),
//       });

//       const json = await res.json().catch(() => ({}));

//       if (!res.ok) {
//         setApiError(json.detail || json.message || 'Erreur lors de la création du compte.');
//         return;
//       }

//       // ── 2. Connexion automatique après inscription ──────────
//       const loginRes = await fetch(`${API}/api/auth/login`, {
//         method:      'POST',
//         headers:     { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({ email: data.email, password: data.password }),
//       });

//       const loginJson = await loginRes.json().catch(() => ({}));

//       if (loginRes.ok) {
//         const user  = loginJson.user  ?? loginJson;
//         const token = loginJson.token ?? loginJson.access_token ?? 'session';
//         setAuth(user, token);
//         router.push('/chatbot');   // → direct au chatbot pour compléter le profil via SAMI
//       } else {
//         // Inscription OK mais login échoué → rediriger vers /login
//         router.push('/login');
//       }

//     } catch {
//       setApiError('Impossible de joindre le serveur. Vérifie que le backend est lancé.');
//     }
//   };

//   const inputClass =
//     'w-full p-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl ' +
//     'text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-supmti-blue/20 ' +
//     'focus:border-supmti-blue dark:focus:border-blue-500 transition-all placeholder:text-gray-400';

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

//       {/* Erreur API globale */}
//       {apiError && (
//         <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
//           <AlertCircle size={16} className="text-red-500 shrink-0" />
//           <p className="text-xs font-medium text-red-600 dark:text-red-400">{apiError}</p>
//         </div>
//       )}

//       {/* Nom complet */}
//       <div className="space-y-1">
//         <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1 uppercase">
//           Nom Complet
//         </label>
//         <input
//           {...register('full_name')}
//           placeholder="Ex: Yassine Mansouri"
//           className={inputClass}
//         />
//         {errors.full_name && (
//           <p className="text-red-500 text-[10px] italic ml-1">{errors.full_name.message}</p>
//         )}
//       </div>

//       {/* Email */}
//       <div className="space-y-1">
//         <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1 uppercase">
//           Email
//         </label>
//         <input
//           {...register('email')}
//           placeholder="yassine@exemple.com"
//           autoComplete="email"
//           className={inputClass}
//         />
//         {errors.email && (
//           <p className="text-red-500 text-[10px] italic ml-1">{errors.email.message}</p>
//         )}
//       </div>

//       {/* Mots de passe */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="space-y-1">
//           <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1 uppercase">
//             Mot de passe
//           </label>
//           <input
//             type="password"
//             {...register('password')}
//             placeholder="••••••••"
//             autoComplete="new-password"
//             className={inputClass}
//           />
//           {errors.password && (
//             <p className="text-red-500 text-[10px] italic ml-1">{errors.password.message}</p>
//           )}
//         </div>
//         <div className="space-y-1">
//           <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1 uppercase">
//             Confirmation
//           </label>
//           <input
//             type="password"
//             {...register('confirmPassword')}
//             placeholder="••••••••"
//             autoComplete="new-password"
//             className={inputClass}
//           />
//           {errors.confirmPassword && (
//             <p className="text-red-500 text-[10px] italic ml-1">{errors.confirmPassword.message}</p>
//           )}
//         </div>
//       </div>

//       {/* Info SAMI */}
//       <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-xl">
//         <p className="text-[11px] text-blue-600 dark:text-blue-400 leading-relaxed">
//           💬 Après inscription, <strong>SAMI</strong> te posera quelques questions pour compléter ton profil
//           et calculer ton FitScore automatiquement.
//         </p>
//       </div>

//       {/* Submit */}
//       <button
//         type="submit"
//         disabled={isSubmitting}
//         className="w-full bg-supmti-blue dark:bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg hover:shadow-blue-200 dark:shadow-none hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//       >
//         {isSubmitting ? (
//           <><Loader2 size={20} className="animate-spin" /> Création en cours...</>
//         ) : (
//           <><UserPlus size={20} /> Créer mon compte étudiant</>
//         )}
//       </button>

//       <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-medium">
//         <ShieldCheck size={12} /> Données sécurisées · SUPMTI 2026
//       </div>
//     </form>
//   );
// };



'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { UserPlus, ShieldCheck, AlertCircle, Loader2, User, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';

const registerSchema = z.object({
  full_name: z.string().min(3, 'Nom trop court'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, '6 caractères min'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

type RegisterValues = z.infer<typeof registerSchema>;

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
const colors = { teal: '#005555', red: '#E31E24' };

export const RegisterForm = () => {
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterValues) => {
    setApiError(null);
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: data.full_name, email: data.email, password: data.password, role: 'student' }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setApiError(json.detail || json.message || 'Erreur de création.');
        return;
      }
      const loginRes = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      const loginJson = await loginRes.json().catch(() => ({}));
      if (loginRes.ok) {
        setAuth(loginJson.user ?? loginJson, loginJson.token ?? 'session');
        router.push('/chatbot'); 
      } else {
        router.push('/login');
      }
    } catch {
      setApiError('Serveur inaccessible.');
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-10 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 transition-all">
      <div className="text-center mb-8">
        <img src="/images/logo-supmti.png" alt="Logo" className="h-16 mx-auto mb-6 dark:brightness-110" />
        <div className="w-full flex h-2 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-inner">
          <div className="h-full w-1/3" style={{ backgroundColor: colors.red }} />
          <div className="h-full w-2/3" style={{ backgroundColor: colors.teal }} />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {apiError && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400">
            <AlertCircle size={20} />
            <p className="text-sm font-semibold">{apiError}</p>
          </div>
        )}

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-[#005555] transition-colors">
            <User size={20} />
          </div>
          <input {...register('full_name')} placeholder="Nom complet" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-[#005555] transition-all shadow-sm" />
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-[#005555] transition-colors">
            <Mail size={20} />
          </div>
          <input {...register('email')} placeholder="Email étudiant" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-[#005555] transition-all shadow-sm" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-[#005555] transition-colors"><Lock size={18} /></div>
            <input type="password" {...register('password')} placeholder="Mot de passe" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-[#005555] transition-all shadow-sm" />
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-[#005555] transition-colors"><Lock size={18} /></div>
            <input type="password" {...register('confirmPassword')} placeholder="Confirmation" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-[#005555] transition-all shadow-sm" />
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-l-4 border-[#005555] rounded-r-2xl">
          <div className="flex gap-3">
            <Sparkles size={18} className="text-[#005555] shrink-0" />
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              SAMI t'aidera à finaliser ton profil après l'inscription.
            </p>
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} style={{ backgroundColor: colors.teal }} className="w-full py-4 rounded-2xl font-black text-white transition-all flex justify-center items-center gap-3 active:scale-[0.97] hover:shadow-xl hover:shadow-[#005555]/20 disabled:opacity-70">
          {isSubmitting ? <Loader2 size={22} className="animate-spin" /> : <><span className="text-lg">Créer mon compte</span> <ArrowRight size={20} /></>}
        </button>

        <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 font-bold tracking-widest uppercase">
          <ShieldCheck size={14} /> SUPMTI 2026
        </div>
      </form>
    </div>
  );
};