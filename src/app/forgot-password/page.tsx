/* eslint-disable react/no-unescaped-entities */
// src/app/forgot-password/page.tsx
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Mail, Lock, KeyRound, ArrowRight, ArrowLeft, Loader2, CheckCircle2, AlertCircle, GraduationCap, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

const API    = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
const colors = { teal: '#005555', red: '#E31E24' };

const emailSchema    = z.object({ email: z.string().email('Adresse email invalide') });
const codeSchema     = z.object({ code: z.string().length(6, 'Le code doit contenir 6 chiffres') });
const passwordSchema = z.object({
  password:        z.string().min(6, 'Minimum 6 caractères'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

type EmailValues    = z.infer<typeof emailSchema>;
type CodeValues     = z.infer<typeof codeSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;
type Step = 'email' | 'code' | 'password' | 'success';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step,       setStep]       = useState<Step>('email');
  const [apiError,   setApiError]   = useState<string | null>(null);
  const [userEmail,  setUserEmail]  = useState('');
  const [resetToken, setResetToken] = useState('');
  const [devCode,    setDevCode]    = useState<string | null>(null); // ← code visible en dev

  const emailForm    = useForm<EmailValues>({ resolver: zodResolver(emailSchema) });
  const codeForm     = useForm<CodeValues>({ resolver: zodResolver(codeSchema) });
  const passwordForm = useForm<PasswordValues>({ resolver: zodResolver(passwordSchema) });

  /* ── Étape 1 : Email ── */
  const onEmailSubmit = async (data: EmailValues) => {
    setApiError(null);
    setDevCode(null);
    try {
      const res  = await fetch(`${API}/api/auth/forgot-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) { setApiError(json.detail || json.message || 'Email introuvable.'); return; }
      setUserEmail(data.email);
      // Afficher le code en dev si retourné par l'API
      if (json.dev_code) setDevCode(json.dev_code);
      setStep('code');
    } catch { setApiError('Serveur inaccessible. Vérifiez que le backend tourne.'); }
  };

  /* ── Étape 2 : Code ── */
  const onCodeSubmit = async (data: CodeValues) => {
    setApiError(null);
    try {
      const res  = await fetch(`${API}/api/auth/verify-reset-code`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, code: data.code }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) { setApiError(json.detail || json.message || 'Code invalide ou expiré.'); return; }
      setResetToken(json.token || data.code);
      setDevCode(null);
      setStep('password');
    } catch { setApiError('Serveur inaccessible.'); }
  };

  /* ── Étape 3 : Nouveau mot de passe ── */
  const onPasswordSubmit = async (data: PasswordValues) => {
    setApiError(null);
    try {
      const res  = await fetch(`${API}/api/auth/reset-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, token: resetToken, new_password: data.password }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) { setApiError(json.detail || json.message || 'Réinitialisation échouée.'); return; }
      setStep('success');
    } catch { setApiError('Serveur inaccessible.'); }
  };

  const stepIndex: Record<Step, number> = { email: 0, code: 1, password: 2, success: 3 };
  const steps = ['Email', 'Vérification', 'Nouveau mot de passe'];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100 dark:from-slate-950 dark:to-slate-900 px-4 py-12">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 rounded-3xl shadow-xl mb-4 border bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700">
            <GraduationCap size={40} className="text-[#006666]"/>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">SUPMTI Meknès</h1>
          <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">Réinitialisation du mot de passe</p>
        </div>

        {/* Stepper */}
        {step !== 'success' && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((label, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all",
                  stepIndex[step] > i  ? "bg-[#005555] text-white"
                  : stepIndex[step] === i ? "bg-[#005555] text-white ring-4 ring-[#005555]/20"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                )}>
                  {stepIndex[step] > i ? <CheckCircle2 size={14}/> : i + 1}
                </div>
                <span className={cn("text-xs font-bold hidden sm:block",
                  stepIndex[step] >= i ? "text-slate-700 dark:text-slate-200" : "text-slate-400"
                )}>{label}</span>
                {i < steps.length - 1 && (
                  <div className={cn("w-8 h-0.5 mx-1 rounded transition-all",
                    stepIndex[step] > i ? "bg-[#005555]" : "bg-slate-200 dark:bg-slate-700")}/>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Carte */}
        <div className="rounded-3xl shadow-2xl border bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-8">

            {/* Erreur */}
            {apiError && (
              <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 animate-in slide-in-from-top-4">
                <AlertCircle size={18} className="shrink-0"/>
                <p className="text-sm font-semibold">{apiError}</p>
              </div>
            )}

            {/* ── ÉTAPE 1 : Email ── */}
            {step === 'email' && (
              <div className="animate-in fade-in zoom-in-95 duration-300">
                <div className="mb-6">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">Mot de passe oublié ? 🔑</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Entrez votre adresse email pour recevoir un code de vérification.
                  </p>
                </div>
                <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-5">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#005555] transition-colors">
                      <Mail size={20}/>
                    </div>
                    <input {...emailForm.register('email')} placeholder="votre@email.com"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-[#005555] transition-all shadow-sm"/>
                    {emailForm.formState.errors.email && (
                      <p className="text-xs text-red-500 mt-1 ml-1">{emailForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <button type="submit" disabled={emailForm.formState.isSubmitting}
                    style={{ backgroundColor: colors.teal }}
                    className="w-full py-4 rounded-2xl font-black text-white transition-all flex justify-center items-center gap-3 active:scale-[0.97] hover:opacity-90 shadow-lg disabled:opacity-70">
                    {emailForm.formState.isSubmitting
                      ? <Loader2 size={22} className="animate-spin"/>
                      : <>Envoyer le code <ArrowRight size={20}/></>}
                  </button>
                </form>
              </div>
            )}

            {/* ── ÉTAPE 2 : Code ── */}
            {step === 'code' && (
              <div className="animate-in fade-in zoom-in-95 duration-300">
                <div className="mb-6">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">Vérification 📩</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Code envoyé à <span className="font-bold text-[#005555]">{userEmail}</span>
                  </p>
                </div>

                {/* ── Bannière dev_code ── */}
                {devCode && (
                  <div className="flex items-center gap-3 p-4 mb-5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                    <Terminal size={16} className="text-emerald-600 shrink-0"/>
                    <div>
                      <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-0.5">Mode dev — code de test</p>
                      <p className="text-2xl font-black font-mono tracking-[0.4em] text-emerald-600 dark:text-emerald-300">{devCode}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={codeForm.handleSubmit(onCodeSubmit)} className="space-y-5">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#005555] transition-colors">
                      <KeyRound size={20}/>
                    </div>
                    <input {...codeForm.register('code')} placeholder="_ _ _ _ _ _"
                      maxLength={6} inputMode="numeric"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-[#005555] transition-all shadow-sm tracking-[0.5em] text-center font-mono text-lg"/>
                    {codeForm.formState.errors.code && (
                      <p className="text-xs text-red-500 mt-1 text-center">{codeForm.formState.errors.code.message}</p>
                    )}
                  </div>
                  <button type="submit" disabled={codeForm.formState.isSubmitting}
                    style={{ backgroundColor: colors.teal }}
                    className="w-full py-4 rounded-2xl font-black text-white transition-all flex justify-center items-center gap-3 active:scale-[0.97] hover:opacity-90 shadow-lg disabled:opacity-70">
                    {codeForm.formState.isSubmitting
                      ? <Loader2 size={22} className="animate-spin"/>
                      : <>Vérifier le code <ArrowRight size={20}/></>}
                  </button>
                  <button type="button"
                    onClick={() => { setStep('email'); setApiError(null); setDevCode(null); codeForm.reset(); }}
                    className="w-full flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-[#005555] transition-colors font-semibold">
                    <ArrowLeft size={16}/> Changer d'email
                  </button>
                </form>
              </div>
            )}

            {/* ── ÉTAPE 3 : Nouveau mot de passe ── */}
            {step === 'password' && (
              <div className="animate-in fade-in zoom-in-95 duration-300">
                <div className="mb-6">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">Nouveau mot de passe 🔒</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Minimum 6 caractères.</p>
                </div>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-5">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#005555] transition-colors">
                      <Lock size={20}/>
                    </div>
                    <input type="password" {...passwordForm.register('password')} placeholder="Nouveau mot de passe"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-[#005555] transition-all shadow-sm"/>
                    {passwordForm.formState.errors.password && (
                      <p className="text-xs text-red-500 mt-1 ml-1">{passwordForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#005555] transition-colors">
                      <Lock size={20}/>
                    </div>
                    <input type="password" {...passwordForm.register('confirmPassword')} placeholder="Confirmer le mot de passe"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-[#005555] transition-all shadow-sm"/>
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-xs text-red-500 mt-1 ml-1">{passwordForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>
                  <button type="submit" disabled={passwordForm.formState.isSubmitting}
                    style={{ backgroundColor: colors.teal }}
                    className="w-full py-4 rounded-2xl font-black text-white transition-all flex justify-center items-center gap-3 active:scale-[0.97] hover:opacity-90 shadow-lg disabled:opacity-70">
                    {passwordForm.formState.isSubmitting
                      ? <Loader2 size={22} className="animate-spin"/>
                      : <>Réinitialiser le mot de passe <ArrowRight size={20}/></>}
                  </button>
                </form>
              </div>
            )}

            {/* ── ÉTAPE 4 : Succès ── */}
            {step === 'success' && (
              <div className="animate-in fade-in zoom-in-95 duration-300 text-center py-4">
                <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border-2 border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} className="text-emerald-500"/>
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">Mot de passe mis à jour !</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
                  Votre mot de passe a été réinitialisé. Vous pouvez maintenant vous connecter.
                </p>
                <button onClick={() => router.push('/login')} style={{ backgroundColor: colors.teal }}
                  className="w-full py-4 rounded-2xl font-black text-white transition-all flex justify-center items-center gap-3 active:scale-[0.97] hover:opacity-90 shadow-lg">
                  Se connecter <ArrowRight size={20}/>
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-[10px] mt-6 uppercase tracking-widest text-slate-400">
          © 2026 SUPMTI · Plateforme IA Multimodale
        </p>
      </div>
    </div>
  );
}