'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { UserPlus, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

const registerSchema = z.object({
  full_name:       z.string().min(3, 'Nom trop court (min 3 caractères)'),
  email:           z.string().email('Email invalide'),
  password:        z.string().min(6, '6 caractères minimum'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path:    ['confirmPassword'],
});

type RegisterValues = z.infer<typeof registerSchema>;

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export const RegisterForm = () => {
  const { setAuth }  = useAuthStore();
  const router       = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterValues) => {
    setApiError(null);
    try {
      // ── 1. Créer le compte ──────────────────────────────────
      const res = await fetch(`${API}/api/auth/register`, {
        method:      'POST',
        headers:     { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          full_name: data.full_name,
          email:     data.email,
          password:  data.password,
          role:      'student',
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setApiError(json.detail || json.message || 'Erreur lors de la création du compte.');
        return;
      }

      // ── 2. Connexion automatique après inscription ──────────
      const loginRes = await fetch(`${API}/api/auth/login`, {
        method:      'POST',
        headers:     { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      const loginJson = await loginRes.json().catch(() => ({}));

      if (loginRes.ok) {
        const user  = loginJson.user  ?? loginJson;
        const token = loginJson.token ?? loginJson.access_token ?? 'session';
        setAuth(user, token);
        router.push('/chatbot');   // → direct au chatbot pour compléter le profil via SAMI
      } else {
        // Inscription OK mais login échoué → rediriger vers /login
        router.push('/login');
      }

    } catch {
      setApiError('Impossible de joindre le serveur. Vérifie que le backend est lancé.');
    }
  };

  const inputClass =
    'w-full p-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl ' +
    'text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-supmti-blue/20 ' +
    'focus:border-supmti-blue dark:focus:border-blue-500 transition-all placeholder:text-gray-400';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      {/* Erreur API globale */}
      {apiError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
          <AlertCircle size={16} className="text-red-500 shrink-0" />
          <p className="text-xs font-medium text-red-600 dark:text-red-400">{apiError}</p>
        </div>
      )}

      {/* Nom complet */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1 uppercase">
          Nom Complet
        </label>
        <input
          {...register('full_name')}
          placeholder="Ex: Yassine Mansouri"
          className={inputClass}
        />
        {errors.full_name && (
          <p className="text-red-500 text-[10px] italic ml-1">{errors.full_name.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1 uppercase">
          Email
        </label>
        <input
          {...register('email')}
          placeholder="yassine@exemple.com"
          autoComplete="email"
          className={inputClass}
        />
        {errors.email && (
          <p className="text-red-500 text-[10px] italic ml-1">{errors.email.message}</p>
        )}
      </div>

      {/* Mots de passe */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1 uppercase">
            Mot de passe
          </label>
          <input
            type="password"
            {...register('password')}
            placeholder="••••••••"
            autoComplete="new-password"
            className={inputClass}
          />
          {errors.password && (
            <p className="text-red-500 text-[10px] italic ml-1">{errors.password.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1 uppercase">
            Confirmation
          </label>
          <input
            type="password"
            {...register('confirmPassword')}
            placeholder="••••••••"
            autoComplete="new-password"
            className={inputClass}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-[10px] italic ml-1">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      {/* Info SAMI */}
      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-xl">
        <p className="text-[11px] text-blue-600 dark:text-blue-400 leading-relaxed">
          💬 Après inscription, <strong>SAMI</strong> te posera quelques questions pour compléter ton profil
          et calculer ton FitScore automatiquement.
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-supmti-blue dark:bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg hover:shadow-blue-200 dark:shadow-none hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <><Loader2 size={20} className="animate-spin" /> Création en cours...</>
        ) : (
          <><UserPlus size={20} /> Créer mon compte étudiant</>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-medium">
        <ShieldCheck size={12} /> Données sécurisées · SUPMTI 2026
      </div>
    </form>
  );
};