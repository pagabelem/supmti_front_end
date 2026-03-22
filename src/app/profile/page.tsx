// src/app/profile/page.tsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore }    from '@/store/authStore';
import { useSessionStore } from '@/store/sessionStore';
import {
  Save, Loader2, CheckCircle2, AlertCircle,
  User, GraduationCap, ArrowLeft,
  Brain, BarChart3, Sparkles
} from 'lucide-react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
function getUid() {
  try { return JSON.parse(localStorage.getItem('supmti-auth')||'{}')?.state?.user?.id||''; }
  catch { return ''; }
}

const schema = z.object({
  full_name: z.string().min(2, 'Nom requis'),
  average:   z.coerce.number().min(0).max(20),
  bac_type:  z.string().min(1, 'BAC requis'),
  level:     z.string().min(1, 'Niveau requis'),
  city:      z.string().min(1, 'Ville requise'),
  interests: z.string().min(2, 'Intérêts requis'),
});
type V = z.infer<typeof schema>;

const inp = "w-full p-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-supmti-blue/20 focus:border-supmti-blue outline-none transition-all shadow-sm placeholder:text-gray-400";
const lbl = "block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1";

// ── Merge profil SAMI + données DB ────────────────────────────
function mergeWithSami(base: Partial<V>, profil: any): V {
  const info = profil?.informations_personnelles || {};
  const acad = profil?.parcours_academique       || {};
  const inter= profil?.interets                  || [];

  const samiBac  = acad.type_bac && acad.type_bac !== 'AUTRE' ? acad.type_bac : '';
  const samiAvg  = acad.moyenne_generale > 0 ? acad.moyenne_generale : 0;
  const samiLvl  = acad.niveau_etude || '';
  const samiCity = info.ville || '';
  const samiName = info.prenom ? `${info.prenom} ${info.nom||''}`.trim() : '';
  const samiInter= inter.length > 0 ? inter.join(', ') : '';

  return {
    full_name: samiName  || base.full_name || '',
    average:   samiAvg   || Number(base.average) || 0,
    bac_type:  samiBac   || base.bac_type  || '',
    level:     samiLvl   || base.level     || '',
    city:      samiCity  || base.city      || '',
    interests: samiInter || base.interests || '',
  };
}

export default function ProfilePage() {
  const { user, setAuth, token } = useAuthStore();
  const { profil }               = useSessionStore();

  const [status,    setStatus]    = useState<'idle'|'success'|'error'>('idle');
  const [apiError,  setApiError]  = useState<string|null>(null);
  const [loading,   setLoading]   = useState(true);
  const [dbBase,    setDbBase]    = useState<Partial<V>>({});
  const [samiAlert, setSamiAlert] = useState(false);

  const { register, handleSubmit, reset, watch,
    formState: { errors, isSubmitting, isDirty } } = useForm<V>({
    resolver: zodResolver(schema),
    defaultValues: { full_name:'', average:0, bac_type:'', level:'', city:'', interests:'' },
  });

  // ── Charger depuis la DB ──────────────────────────────────
  const loadFromDB = useCallback(async () => {
    const uid = getUid();
    if (!uid) { setLoading(false); return; }
    try {
      const res  = await fetch(`${API}/api/profil`, {
        credentials:'include', headers:{'X-User-Id':uid}
      });
      const data = await res.json();
      const base: Partial<V> = {
        full_name: data.full_name || user?.full_name || '',
        average:   Number(data.average) || 0,
        bac_type:  data.bac_type  || '',
        level:     data.level     || '',
        city:      data.city      || '',
        interests: Array.isArray(data.interests)
          ? data.interests.join(', ')
          : data.interests || '',
      };
      setDbBase(base);
      // Merge immédiat avec profil SAMI existant
      reset(mergeWithSami(base, profil));
    } catch {
      const base: Partial<V> = {
        full_name: user?.full_name || '',
        average:   Number((user as any)?.average) || 0,
        bac_type:  (user as any)?.bac_type  || '',
        level:     (user as any)?.level     || '',
        city:      (user as any)?.city      || '',
        interests: Array.isArray((user as any)?.interests)
          ? (user as any).interests.join(', ')
          : (user as any)?.interests || '',
      };
      setDbBase(base);
      reset(mergeWithSami(base, profil));
    } finally {
      setLoading(false);
    }
  }, [profil, user]);

  // Charger au montage
  useEffect(() => { loadFromDB(); }, []);

  // ── Re-sync quand profil SAMI change ─────────────────────
  // Déclenché à chaque fois que useSessionStore().profil change
  useEffect(() => {
    if (!profil || loading) return;
    const merged = mergeWithSami(dbBase, profil);
    reset(merged, { keepDirty: false }); // reset complet avec nouvelles valeurs
    setSamiAlert(true);
    const t = setTimeout(() => setSamiAlert(false), 5000);
    return () => clearTimeout(t);
  }, [profil]); // ← dépendance directe sur profil

  // ── Écouter l'événement sami:profile-updated ─────────────
  useEffect(() => {
    const handler = async () => {
      // Recharger depuis la DB ET re-merger avec le nouveau profil SAMI
      await loadFromDB();
    };
    window.addEventListener('sami:profile-updated', handler);
    return () => window.removeEventListener('sami:profile-updated', handler);
  }, [loadFromDB]);

  const onSubmit: SubmitHandler<V> = async (data) => {
    setApiError(null); setStatus('idle');
    if (!user?.id) { setApiError('Non connecté.'); setStatus('error'); return; }
    try {
      const payload = {
        ...data,
        interests: data.interests.split(',').map(i=>i.trim()).filter(Boolean),
        user_id: user.id,
      };
      const res = await fetch(`${API}/api/profil`, {
        method:'PUT', credentials:'include',
        headers:{'Content-Type':'application/json','X-User-Id':user.id},
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(()=>({}));
      if (!res.ok) { setApiError(json.detail||'Erreur.'); setStatus('error'); return; }
      setAuth({...user,...data,interests:payload.interests}, token!);
      setDbBase(data); // mettre à jour la base locale
      setStatus('success');
      setSamiAlert(false);
      setTimeout(()=>setStatus('idle'), 3000);
    } catch {
      setApiError('Impossible de joindre le serveur.');
      setStatus('error');
    }
  };

  // Valeurs en direct pour les cards
  const avgVal = watch('average');
  const bacVal = watch('bac_type');
  const lvlVal = watch('level');
  const fitEst = avgVal > 0
    ? Math.min(100, Math.round((avgVal/20)*60 + (bacVal?20:0) + (lvlVal?20:0)))
    : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/chatbot" className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 hover:text-supmti-blue transition-colors shadow-sm">
            <ArrowLeft size={18}/>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-supmti-blue/10 dark:bg-blue-900/20 rounded-xl">
              <GraduationCap size={24} className="text-supmti-blue dark:text-blue-400"/>
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white">Mon Profil</h1>
              {user?.email && (
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
                  <User size={12}/>{user.email}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Banner SAMI sync */}
        {samiAlert && (
          <div className="p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-2xl mb-4 flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
            <Sparkles size={15} className="text-orange-500 shrink-0 animate-pulse"/>
            <p className="text-sm text-orange-700 dark:text-orange-300 flex-1">
              <strong>SAMI a mis à jour ton profil</strong> depuis la conversation. Sauvegarde pour confirmer.
            </p>
            <button onClick={()=>setSamiAlert(false)} className="text-orange-400 hover:text-orange-600 font-bold text-xs">✕</button>
          </div>
        )}

        {/* Banner info */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl mb-6">
          <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
            💡 <strong>SAMI remplit automatiquement</strong> ce profil depuis tes conversations. Parle à SAMI de ton BAC, ta moyenne et tes intérêts — les champs se mettent à jour en temps réel.
          </p>
        </div>

        {/* Cards aperçu live */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: BarChart3, val: avgVal > 0 ? `${avgVal}/20` : '—', label:'Moyenne', color:'text-orange-500', active: avgVal > 0 },
            { icon: Brain,     val: bacVal || '—',                      label:'BAC',     color:'text-purple-500', active: !!bacVal },
            { icon: Sparkles,  val: fitEst ? `${fitEst}%` : '—',       label:'FitScore est.', color: fitEst && fitEst >= 70 ? 'text-emerald-500' : 'text-orange-400', active: !!fitEst },
          ].map(({ icon:Icon, val, label, color, active }) => (
            <div key={label} className={`p-4 rounded-2xl border shadow-sm text-center transition-all ${active ? 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800' : 'bg-gray-100/50 dark:bg-slate-900/30 border-gray-100 dark:border-slate-800 opacity-60'}`}>
              <Icon size={20} className={`${color} mx-auto mb-1 ${active ? '' : 'grayscale'}`}/>
              <p className={`text-xl font-black ${active ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>{val}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>

        {/* Formulaire */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-12 gap-3 text-gray-400">
              <Loader2 size={20} className="animate-spin"/><span>Chargement…</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              {status === 'success' && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0"/>
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Profil sauvegardé !</p>
                </div>
              )}
              {status === 'error' && apiError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                  <AlertCircle size={16} className="text-red-500 shrink-0"/>
                  <p className="text-xs font-medium text-red-600 dark:text-red-400">{apiError}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1 md:col-span-2">
                  <label className={lbl}>Nom Complet</label>
                  <input {...register('full_name')} className={inp}/>
                  {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className={lbl}>Moyenne Générale (/20)</label>
                  <input type="number" step="0.01" min="0" max="20" {...register('average')} className={inp}/>
                  {errors.average && <p className="text-red-500 text-xs mt-1">{errors.average.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className={lbl}>Type de BAC</label>
                  <select {...register('bac_type')} className={inp}>
                    <option value="">Sélectionner…</option>
                    <option value="SM">Sciences Maths</option>
                    <option value="PC">Physique-Chimie</option>
                    <option value="SVT">SVT</option>
                    <option value="Eco">Économie</option>
                    <option value="Info">Informatique</option>
                    <option value="Lettres">Lettres</option>
                  </select>
                  {errors.bac_type && <p className="text-red-500 text-xs mt-1">{errors.bac_type.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className={lbl}>Niveau Actuel</label>
                  <input {...register('level')} placeholder="Ex: Terminale, 1ère année…" className={inp}/>
                  {errors.level && <p className="text-red-500 text-xs mt-1">{errors.level.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className={lbl}>Ville</label>
                  <input {...register('city')} placeholder="Ex: Meknès, Fès…" className={inp}/>
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className={lbl}>Centres d'intérêt</label>
                  <textarea {...register('interests')} rows={3} placeholder="Ex: Programmation, IA, Réseaux…" className={`${inp} resize-none`}/>
                  {errors.interests && <p className="text-red-500 text-xs mt-1">{errors.interests.message}</p>}
                  <p className="text-[10px] text-gray-400 ml-1">Séparés par des virgules</p>
                </div>
              </div>

              <button type="submit" disabled={isSubmitting}
                className="flex items-center justify-center gap-2 w-full bg-supmti-blue dark:bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg disabled:opacity-70 hover:scale-[1.01] active:scale-95">
                {isSubmitting ? <Loader2 size={20} className="animate-spin"/> : <Save size={20}/>}
                {isSubmitting ? 'Sauvegarde…' : isDirty ? '💾 Sauvegarder les modifications' : '✓ Profil à jour'}
              </button>
            </form>
          )}
        </div>

        {/* Indicateur sources */}
        <div className="mt-4 p-3 rounded-xl bg-gray-100 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 flex flex-wrap gap-2">
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest self-center mr-2">Sources :</span>
          <span className="text-[10px] px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold">🗄️ Base de données</span>
          <span className={`text-[10px] px-2 py-1 rounded-lg font-bold ${profil ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400' : 'bg-gray-50 dark:bg-slate-700 text-gray-400'}`}>
            🤖 SAMI {profil ? '● Actif' : '● Inactif'}
          </span>
          <span className="text-[10px] px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 font-bold">✏️ Manuel</span>
        </div>
      </div>
    </div>
  );
}