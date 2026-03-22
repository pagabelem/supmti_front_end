'use client';
import { useState } from 'react';
import { Scale, ArrowRightLeft, Sparkles, AlertTriangle, Lightbulb } from 'lucide-react';
import { getComparer } from '@/services/panelService';
import { Spinner, ActionBtn, ResultCard, Prose, ErrorBox } from './ui';
import { cn } from '@/lib/utils';

const FILIERES = ['ISI', 'ME', 'IISIC', 'IISRT', 'FACG', 'MSTIC'];

const SelectField = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div className="flex-1 group">
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-1 group-hover:text-orange-500 transition-colors">
      {label}
    </p>
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={cn(
          "w-full bg-white dark:bg-white/[0.03] border-2 border-slate-100 dark:border-white/[0.08] rounded-2xl px-4 py-3",
          "text-sm font-bold text-slate-700 dark:text-slate-200 outline-none appearance-none cursor-pointer",
          "focus:border-[#006666] focus:ring-4 focus:ring-[#006666]/5 transition-all"
        )}
      >
        {FILIERES.map(f => <option key={f} value={f} className="bg-white dark:bg-slate-900">{f}</option>)}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <Scale size={14} />
      </div>
    </div>
  </div>
);

export const ComparerPanel = () => {
  const [f1,      setF1]      = useState('ISI');
  const [f2,      setF2]      = useState('ME');
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<{ comparaison?: string; recommandation?: string; avertissements?: string[] } | null>(null);
  const [error,   setError]   = useState<string | null>(null);

  const compare = async () => {
    setLoading(true); setError(null);
    try {
      const data = await getComparer(f1, f2);
      setResult(data);
    } catch { setError('Impossible de générer le comparatif.'); }
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-6">
      <div className="p-5 rounded-3xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.05]">
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
          Compare les opportunités : salaires, insertion et métiers pour faire le meilleur choix.
        </p>
      </div>

      {/* ── Sélecteurs de Duel ── */}
      <div className="relative flex items-end gap-3 px-1">
        <SelectField label="Option A" value={f1} onChange={setF1} />
        <div className="mb-2 p-2 bg-slate-100 dark:bg-white/5 rounded-full text-slate-400">
           <ArrowRightLeft size={16} />
        </div>
        <SelectField label="Option B" value={f2} onChange={setF2} />
      </div>

      <ActionBtn 
        onClick={compare} 
        disabled={loading}
        className="h-14 bg-[#006666] shadow-xl shadow-[#006666]/10"
      >
        {loading ? <Spinner label="Analyse comparative..." /> : <><Scale size={18} /> Lancer le comparatif</>}
      </ActionBtn>

      {error && <ErrorBox message={error} />}

      {/* ── Résultats ── */}
      {!loading && result && (
        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-700">
          
          {/* Avertissements (si présents) */}
          {result.avertissements?.map((w, i) => (
            <div key={i} className="flex items-start gap-3 bg-orange-500/5 border border-orange-500/20 rounded-2xl p-4 animate-in zoom-in-95">
              <AlertTriangle className="text-orange-500 shrink-0" size={16} />
              <p className="text-[11px] font-medium text-orange-700 dark:text-orange-400">{w}</p>
            </div>
          ))}

          {/* Comparaison détaillée */}
          {result.comparaison && (
            <div className="space-y-2">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Rapport de duel</span>
               <ResultCard className="bg-white dark:bg-slate-900 border-2">
                 <Prose content={result.comparaison} />
               </ResultCard>
            </div>
          )}

          {/* Recommandation de l'IA */}
          {result.recommandation && (
            <ResultCard accent className="border-t-4 border-t-emerald-500">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg">
                  <Lightbulb size={16} />
                </div>
                <h4 className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                  Arbitrage SAMI
                </h4>
              </div>
              <Prose content={result.recommandation} className="dark:text-emerald-50 text-slate-700" />
            </ResultCard>
          )}
        </div>
      )}
    </div>
  );
};