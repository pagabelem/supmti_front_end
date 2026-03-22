'use client';
import { useState } from 'react';
import { DoorOpen, ShieldCheck, Sparkles, GraduationCap } from 'lucide-react';
import { getAdmission } from '@/services/panelService';
import { Spinner, ActionBtn, ResultCard, Prose, ErrorBox } from './ui';
import { cn } from '@/lib/utils';

export const AdmissionPanel = () => {
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<string | null>(null);
  const [error,   setError]   = useState<string | null>(null);

  const calc = async () => {
    setLoading(true); 
    setError(null);
    try {
      const data = await getAdmission();
      if (data.error) { 
        setError(data.message || 'Profil insuffisant pour une simulation précise.'); 
      }
      else { 
        setResult(data.rapport || ''); 
      }
    } catch { 
      setError('Erreur de connexion au moteur de calcul.'); 
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* ── Header Iconographique ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950/30 p-5 border border-blue-100/50 dark:border-blue-900/20">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 tracking-tight">Vérificateur d'Éligibilité</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-[240px]">
            SAMI analyse ton dossier pour calculer tes chances d'admission et ton éligibilité aux <span className="text-blue-600 dark:text-blue-400 font-bold">bourses d'excellence</span>.
          </p>
        </div>
        {/* Décoration en arrière-plan */}
        <GraduationCap size={80} className="absolute -right-4 -bottom-4 text-blue-500/5 dark:text-blue-400/5 -rotate-12" />
      </div>

      {/* ── Bouton d'Action Premium ── */}
      <div className="relative group">
        {!loading && !result && (
           <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-[#006666] rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        )}
        <ActionBtn 
          onClick={calc} 
          disabled={loading}
          className={cn(
            "relative w-full py-4 font-bold tracking-tight shadow-xl transition-all active:scale-95",
            result ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-none border-transparent" : "bg-[#006666] text-white"
          )}
        >
          {loading ? (
            <span className="flex items-center gap-2">Exploration du dossier...</span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <DoorOpen size={18} className={cn(result ? "text-slate-400" : "animate-pulse")} />
              {result ? "Relancer la simulation" : "Simuler mon admission"}
            </span>
          )}
        </ActionBtn>
      </div>

      {/* ── Zone de Résultats ── */}
      <div className="min-h-[100px] flex flex-col items-center justify-center">
        {loading && (
          <div className="flex flex-col items-center gap-4 py-10 animate-pulse">
            <Spinner />
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Analyse Algorithmique</p>
          </div>
        )}

        {error && (
          <div className="w-full animate-in zoom-in-95 duration-300">
            <ErrorBox message={error} />
            <p className="text-[10px] text-center text-slate-400 mt-4 px-6 italic">
              Complète ton profil avec tes notes de BAC pour débloquer cette fonctionnalité.
            </p>
          </div>
        )}

        {!loading && result && (
          <div className="w-full animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex items-center gap-2 mb-3 px-1">
              <Sparkles size={14} className="text-orange-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-xs">Rapport SAMI Intelligence</span>
            </div>
            <ResultCard className="border-t-4 border-t-[#006666] shadow-2xl shadow-blue-500/5">
              <Prose content={result} />
            </ResultCard>
            
            {/* Petit Footer de réassurance */}
            <div className="mt-6 p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-[10px] text-slate-400 text-center leading-tight">
                * Ces résultats sont basés sur les critères d'admission 2026. <br/>
                Présente-toi école pour une validation officielle.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};