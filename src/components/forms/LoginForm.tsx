'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, AlertCircle, ShieldAlert, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  email:    z.string().email('Email invalide'),
  password: z.string().min(6, 'Minimum 6 caractères'),
});

type LoginValues = z.infer<typeof loginSchema>;

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

interface LoginFormProps {
  isAdminMode?: boolean;
}

export const LoginForm = ({ isAdminMode = false }: LoginFormProps) => {
  const { setAuth }  = useAuthStore();
  const router       = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginValues) => {
    setApiError(null);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method:      'POST',
        headers:     { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setApiError(json.detail || json.message || 'Email ou mot de passe incorrect.');
        return;
      }

      const user  = json.user  ?? json;
      const token = json.token ?? json.access_token ?? 'session';

      setAuth(user, token);

      const role = (user.role || '').toLowerCase();
      if (role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }

    } catch {
      setApiError(isAdminMode 
        ? 'CRITICAL_ERROR: CONNECTION_REFUSED. Check backend status.' 
        : 'Impossible de joindre le serveur. Vérifie que le backend est lancé.'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      {/* Erreur API globale */}
      {apiError && (
        <div className={cn(
          "flex items-center gap-2 p-3 rounded-xl border animate-shake",
          isAdminMode 
            ? "bg-red-950/20 border-red-500/50" 
            : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
        )}>
          {isAdminMode ? <ShieldAlert size={16} className="text-red-500" /> : <AlertCircle size={16} className="text-red-500 shrink-0" />}
          <p className={cn(
            "text-xs font-medium",
            isAdminMode ? "text-red-400 font-mono uppercase" : "text-red-600 dark:text-red-400"
          )}>
            {isAdminMode ? `[ERROR] : ${apiError}` : apiError}
          </p>
        </div>
      )}

      {/* Email / Root User */}
      <div>
        <label className={cn(
          "block text-sm font-bold mb-1.5 ml-1 transition-colors",
          isAdminMode ? "text-emerald-500 font-mono italic" : "text-gray-700 dark:text-gray-300"
        )}>
          {isAdminMode ? "> IDENTIFIER" : "Email"}
        </label>
        <div className="relative group">
          <div className={cn(
            "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors",
            isAdminMode ? "text-emerald-700 group-focus-within:text-emerald-400" : "text-gray-400 group-focus-within:text-supmti-blue"
          )}>
            {isAdminMode ? <Terminal size={18} /> : <Mail size={18} />}
          </div>
          <input
            {...register('email')}
            placeholder={isAdminMode ? "root@sami.system" : "nom@exemple.com"}
            autoComplete="email"
            className={cn(
              "w-full pl-10 pr-4 py-2.5 rounded-xl outline-none transition-all shadow-sm border",
              isAdminMode 
                ? "bg-black border-emerald-500/30 text-emerald-500 font-mono placeholder:text-emerald-900 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 shadow-[inset_0_0_10px_rgba(16,185,129,0.05)]" 
                : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-supmti-blue/20 focus:border-supmti-blue"
            )}
          />
        </div>
        {errors.email && (
          <p className={cn("text-xs mt-1.5 ml-1 italic", isAdminMode ? "text-red-500 font-mono" : "text-red-500 font-medium")}>
            {isAdminMode ? `! ${errors.email.message?.toUpperCase()}` : errors.email.message}
          </p>
        )}
      </div>

      {/* Mot de passe / Access Key */}
      <div>
        <label className={cn(
          "block text-sm font-bold mb-1.5 ml-1 transition-colors",
          isAdminMode ? "text-emerald-500 font-mono italic" : "text-gray-700 dark:text-gray-300"
        )}>
          {isAdminMode ? "> ACCESS_KEY" : "Mot de passe"}
        </label>
        <div className="relative group">
          <div className={cn(
            "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors",
            isAdminMode ? "text-emerald-700 group-focus-within:text-emerald-400" : "text-gray-400 group-focus-within:text-supmti-blue"
          )}>
            <Lock size={18} />
          </div>
          <input
            type="password"
            {...register('password')}
            placeholder="••••••••"
            autoComplete="current-password"
            className={cn(
              "w-full pl-10 pr-4 py-2.5 rounded-xl outline-none transition-all shadow-sm border",
              isAdminMode 
                ? "bg-black border-emerald-500/30 text-emerald-500 font-mono placeholder:text-emerald-900 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 shadow-[inset_0_0_10px_rgba(16,185,129,0.05)]" 
                : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-supmti-blue/20 focus:border-supmti-blue"
            )}
          />
        </div>
        {errors.password && (
          <p className={cn("text-xs mt-1.5 ml-1 italic", isAdminMode ? "text-red-500 font-mono" : "text-red-500 font-medium")}>
             {isAdminMode ? `! ${errors.password.message?.toUpperCase()}` : errors.password.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "w-full py-3 rounded-xl font-bold transition-all flex justify-center items-center gap-2",
          isAdminMode
            ? "bg-emerald-600 hover:bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.25)] uppercase tracking-widest font-mono active:scale-95"
            : "bg-supmti-blue dark:bg-blue-600 text-white hover:bg-blue-800 shadow-lg shadow-blue-100 dark:shadow-none hover:scale-[1.02] active:scale-95"
        )}
      >
        {isSubmitting ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          isAdminMode ? 'GRANT_ACCESS' : 'Se connecter'
        )}
      </button>

      {!isAdminMode && (
        <div className="text-center mt-2">
          <button type="button" className="text-xs text-gray-500 dark:text-gray-400 hover:text-supmti-blue dark:hover:text-blue-400 transition-colors">
            Mot de passe oublié ?
          </button>
        </div>
      )}
    </form>
  );
};