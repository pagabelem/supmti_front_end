// 'use client';
// import { useState } from 'react';
// import { Scale, ArrowRightLeft, Sparkles, AlertTriangle, Lightbulb } from 'lucide-react';
// import { getComparer } from '@/services/panelService';
// import { Spinner, ActionBtn, ResultCard, Prose, ErrorBox } from './ui';
// import { cn } from '@/lib/utils';

// const FILIERES = ['ISI', 'ME', 'IISIC', 'IISRT', 'FACG', 'MSTIC'];

// const SelectField = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
//   <div className="flex-1 group">
//     <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-1 group-hover:text-orange-500 transition-colors">
//       {label}
//     </p>
//     <div className="relative">
//       <select
//         value={value}
//         onChange={e => onChange(e.target.value)}
//         className={cn(
//           "w-full bg-white dark:bg-white/[0.03] border-2 border-slate-100 dark:border-white/[0.08] rounded-2xl px-4 py-3",
//           "text-sm font-bold text-slate-700 dark:text-slate-200 outline-none appearance-none cursor-pointer",
//           "focus:border-[#006666] focus:ring-4 focus:ring-[#006666]/5 transition-all"
//         )}
//       >
//         {FILIERES.map(f => <option key={f} value={f} className="bg-white dark:bg-slate-900">{f}</option>)}
//       </select>
//       <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
//         <Scale size={14} />
//       </div>
//     </div>
//   </div>
// );

// export const ComparerPanel = () => {
//   const [f1,      setF1]      = useState('ISI');
//   const [f2,      setF2]      = useState('ME');
//   const [loading, setLoading] = useState(false);
//   const [result,  setResult]  = useState<{ comparaison?: string; recommandation?: string; avertissements?: string[] } | null>(null);
//   const [error,   setError]   = useState<string | null>(null);

//   const compare = async () => {
//     setLoading(true); setError(null);
//     try {
//       const data = await getComparer(f1, f2);
//       setResult(data);
//     } catch { setError('Impossible de générer le comparatif.'); }
//     setLoading(false);
//   };

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500 pb-6">
//       <div className="p-5 rounded-3xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.05]">
//         <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
//           Compare les opportunités : salaires, insertion et métiers pour faire le meilleur choix.
//         </p>
//       </div>

//       {/* ── Sélecteurs de Duel ── */}
//       <div className="relative flex items-end gap-3 px-1">
//         <SelectField label="Option A" value={f1} onChange={setF1} />
//         <div className="mb-2 p-2 bg-slate-100 dark:bg-white/5 rounded-full text-slate-400">
//            <ArrowRightLeft size={16} />
//         </div>
//         <SelectField label="Option B" value={f2} onChange={setF2} />
//       </div>

//       <ActionBtn 
//         onClick={compare} 
//         disabled={loading}
//         className="h-14 bg-[#006666] shadow-xl shadow-[#006666]/10"
//       >
//         {loading ? <Spinner label="Analyse comparative..." /> : <><Scale size={18} /> Lancer le comparatif</>}
//       </ActionBtn>

//       {error && <ErrorBox message={error} />}

//       {/* ── Résultats ── */}
//       {!loading && result && (
//         <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-700">
          
//           {/* Avertissements (si présents) */}
//           {result.avertissements?.map((w, i) => (
//             <div key={i} className="flex items-start gap-3 bg-orange-500/5 border border-orange-500/20 rounded-2xl p-4 animate-in zoom-in-95">
//               <AlertTriangle className="text-orange-500 shrink-0" size={16} />
//               <p className="text-[11px] font-medium text-orange-700 dark:text-orange-400">{w}</p>
//             </div>
//           ))}

//           {/* Comparaison détaillée */}
//           {result.comparaison && (
//             <div className="space-y-2">
//                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Rapport de duel</span>
//                <ResultCard className="bg-white dark:bg-slate-900 border-2">
//                  <Prose content={result.comparaison} />
//                </ResultCard>
//             </div>
//           )}

//           {/* Recommandation de l'IA */}
//           {result.recommandation && (
//             <ResultCard accent className="border-t-4 border-t-emerald-500">
//               <div className="flex items-center gap-2 mb-4">
//                 <div className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg">
//                   <Lightbulb size={16} />
//                 </div>
//                 <h4 className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
//                   Arbitrage SAMI
//                 </h4>
//               </div>
//               <Prose content={result.recommandation} className="dark:text-emerald-50 text-slate-700" />
//             </ResultCard>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };



// 'use client';
// import { useState, useEffect } from 'react';
// import { Scale, ArrowRightLeft, Sparkles, AlertTriangle, Lightbulb, Loader2 } from 'lucide-react';
// import { getComparer } from '@/services/panelService';
// import { Spinner, ActionBtn, ResultCard, Prose, ErrorBox } from './ui';
// import { cn } from '@/lib/utils';

// const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
// function getUid() {
//   try { return JSON.parse(localStorage.getItem('supmti-auth') || '{}')?.state?.user?.id || ''; }
//   catch { return ''; }
// }

// interface FiliereInfo { id: string; nom: string; niveau: string; }

// const SelectField = ({
//   label, value, onChange, filieres, loadingFilieres,
// }: {
//   label: string;
//   value: string;
//   onChange: (v: string) => void;
//   filieres: FiliereInfo[];
//   loadingFilieres: boolean;
// }) => (
//   <div className="flex-1 group">
//     <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-1 group-hover:text-orange-500 transition-colors">
//       {label}
//     </p>
//     <div className="relative">
//       {loadingFilieres ? (
//         <div className="w-full bg-slate-50 dark:bg-white/[0.03] border-2 border-slate-100 dark:border-white/[0.08] rounded-2xl px-4 py-3 flex items-center gap-2 text-slate-400">
//           <Loader2 size={14} className="animate-spin" />
//           <span className="text-xs">Chargement...</span>
//         </div>
//       ) : (
//         <select
//           value={value}
//           onChange={e => onChange(e.target.value)}
//           className={cn(
//             "w-full bg-white dark:bg-white/[0.03] border-2 border-slate-100 dark:border-white/[0.08] rounded-2xl px-4 py-3",
//             "text-sm font-bold text-slate-700 dark:text-slate-200 outline-none appearance-none cursor-pointer",
//             "focus:border-[#006666] focus:ring-4 focus:ring-[#006666]/5 transition-all"
//           )}
//         >
//           {filieres.map(f => (
//             <option key={f.id} value={f.id} className="bg-white dark:bg-slate-900">
//               {f.id} — {f.niveau}
//             </option>
//           ))}
//         </select>
//       )}
//       <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
//         <Scale size={14} />
//       </div>
//     </div>
//   </div>
// );

// export const ComparerPanel = () => {
//   const [filieres,        setFilieres]        = useState<FiliereInfo[]>([]);
//   const [loadingFilieres, setLoadingFilieres] = useState(true);
//   const [f1,              setF1]              = useState('');
//   const [f2,              setF2]              = useState('');
//   const [loading,         setLoading]         = useState(false);
//   const [result,          setResult]          = useState<{
//     comparaison?: string; recommandation?: string; avertissements?: string[];
//   } | null>(null);
//   const [error,           setError]           = useState<string | null>(null);
//   const [noProfile,       setNoProfile]       = useState(false);

//   // Charger les filières accessibles selon le niveau de l'étudiant
//   useEffect(() => {
//     const uid = getUid();
//     fetch(`${API}/api/filieres/accessibles`, {
//       credentials: 'include',
//       headers: uid ? { 'X-User-Id': uid } : {},
//     })
//       .then(r => r.json())
//       .then(data => {
//         const list: FiliereInfo[] = (data.filieres || []);
//         setFilieres(list);
//         if (list.length >= 2) {
//           setF1(list[0].id);
//           setF2(list[1].id);
//         } else if (list.length === 1) {
//           setF1(list[0].id);
//           setF2(list[0].id);
//         }
//         if (list.length === 0) setNoProfile(true);
//       })
//       .catch(() => setNoProfile(true))
//       .finally(() => setLoadingFilieres(false));
//   }, []);

//   const compare = async () => {
//     if (!f1 || !f2) return;
//     setLoading(true); setError(null);
//     try {
//       const data = await getComparer(f1, f2);
//       setResult(data);
//     } catch {
//       setError('Impossible de générer le comparatif.');
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500 pb-6">

//       <div className="p-5 rounded-3xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.05]">
//         <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
//           Compare les opportunités : salaires, insertion et métiers pour faire le meilleur choix.
//         </p>
//       </div>

//       {/* ── Message si pas de profil ── */}
//       {noProfile && !loadingFilieres && (
//         <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-2xl text-xs text-orange-600 dark:text-orange-400 text-center">
//           Complète ton profil (niveau, BAC, moyenne) pour voir les filières accessibles.
//         </div>
//       )}

//       {/* ── Niveau actuel info ── */}
//       {!loadingFilieres && filieres.length > 0 && (
//         <div className="flex items-center gap-2 px-1">
//           <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
//           <span className="text-[10px] font-bold text-slate-400">
//             {filieres.length} filière{filieres.length > 1 ? 's' : ''} accessible{filieres.length > 1 ? 's' : ''} selon ton niveau
//           </span>
//         </div>
//       )}

//       {/* ── Sélecteurs dynamiques ── */}
//       <div className="relative flex items-end gap-3 px-1">
//         <SelectField
//           label="Option A"
//           value={f1}
//           onChange={setF1}
//           filieres={filieres}
//           loadingFilieres={loadingFilieres}
//         />
//         <div className="mb-2 p-2 bg-slate-100 dark:bg-white/5 rounded-full text-slate-400">
//           <ArrowRightLeft size={16} />
//         </div>
//         <SelectField
//           label="Option B"
//           value={f2}
//           onChange={setF2}
//           filieres={filieres}
//           loadingFilieres={loadingFilieres}
//         />
//       </div>

//       <ActionBtn
//         onClick={compare}
//         disabled={loading || loadingFilieres || !f1 || !f2 || filieres.length < 2}
//         className="h-14 bg-[#006666] shadow-xl shadow-[#006666]/10"
//       >
//         {loading
//           ? <><Loader2 size={16} className="animate-spin mr-2" /> Analyse comparative...</>
//           : <><Scale size={18} className="mr-2" /> Lancer le comparatif</>
//         }
//       </ActionBtn>

//       {error && <ErrorBox message={error} />}

//       {/* ── Résultats ── */}
//       {!loading && result && (
//         <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-700">

//           {result.avertissements?.map((w, i) => (
//             <div key={i} className="flex items-start gap-3 bg-orange-500/5 border border-orange-500/20 rounded-2xl p-4 animate-in zoom-in-95">
//               <AlertTriangle className="text-orange-500 shrink-0" size={16} />
//               <p className="text-[11px] font-medium text-orange-700 dark:text-orange-400">{w}</p>
//             </div>
//           ))}

//           {result.comparaison && (
//             <div className="space-y-2">
//               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Rapport de duel</span>
//               <ResultCard className="bg-white dark:bg-slate-900 border-2">
//                 <Prose content={result.comparaison} />
//               </ResultCard>
//             </div>
//           )}

//           {result.recommandation && (
//             <ResultCard accent className="border-t-4 border-t-emerald-500">
//               <div className="flex items-center gap-2 mb-4">
//                 <div className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg">
//                   <Lightbulb size={16} />
//                 </div>
//                 <h4 className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
//                   Arbitrage SAMI
//                 </h4>
//               </div>
//               <Prose content={result.recommandation} className="dark:text-emerald-50 text-slate-700" />
//             </ResultCard>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

'use client';
import { useState, useEffect } from 'react';
import { 
  Scale, ArrowRightLeft, Sparkles, AlertTriangle, 
  Lightbulb, Loader2, Target, Zap, TrendingUp, 
  Globe, Briefcase, Coins, CheckCircle2 
} from 'lucide-react';
import { getComparer } from '@/services/panelService';
import { Spinner, ActionBtn, ResultCard, Prose, ErrorBox } from './ui';
import { cn } from '@/lib/utils';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// ── COMPOSANT : JAUGES D'INSERTION ──────────────────────────────
const InsertionGauge = ({ label, percent, color }: { label: string, percent: number, color: 'emerald' | 'red' }) => (
  <div className="flex-1 p-4 rounded-3xl bg-white dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.05] flex flex-col items-center text-center">
    <div className="relative w-16 h-16 mb-3">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100 dark:text-slate-800" />
        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" 
          strokeDasharray={175.9} strokeDashoffset={175.9 - (175.9 * percent) / 100}
          className={cn("transition-all duration-1000 ease-out", color === 'emerald' ? "text-emerald-500" : "text-red-500")} 
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-black">{percent}%</span>
    </div>
    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{label}</span>
    <span className="text-[9px] text-slate-400 mt-1 italic">Taux d'insertion</span>
  </div>
);

// ── COMPOSANT : VISUALISEUR DE SALAIRES ─────────────────────────
const SalaryVisualizer = ({ f1, f2 }: { f1: string, f2: string }) => {
  const rows = [
    { period: 'Départ', valA: '7k-12k', valB: '7k-12k', icon: Briefcase, unit: 'MAD' },
    { period: '3 ans', valA: '12k-20k', valB: '12k-20k', icon: TrendingUp, unit: 'MAD' },
    { period: '7 ans', valA: '20k-40k', valB: '20k-38k', icon: Coins, unit: 'MAD' },
    { period: 'International', valA: '4k-7k', valB: '3.5k-5.5k', icon: Globe, unit: 'EUR' },
  ];

  return (
    <div className="space-y-4 my-8">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Grille Salariale</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>
      
      {rows.map((row, i) => (
        <div key={i} className="group relative">
          <div className="flex justify-between items-center mb-1 px-1">
             <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400">{row.valA} <span className="opacity-50">{row.unit}</span></span>
             <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                <row.icon size={10} />
                <span className="text-[8px] font-bold uppercase tracking-widest">{row.period}</span>
             </div>
             <span className="text-[9px] font-black text-red-600 dark:text-red-400">{row.valB} <span className="opacity-50">{row.unit}</span></span>
          </div>
          <div className="grid grid-cols-2 gap-1 h-2">
            <div className="bg-emerald-500/10 rounded-l-full overflow-hidden">
              <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: i === 2 ? '100%' : '85%' }} />
            </div>
            <div className="bg-red-500/10 rounded-r-full overflow-hidden flex justify-end">
              <div className="h-full bg-red-500 transition-all duration-1000" style={{ width: i === 2 ? '92%' : '85%' }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ── COMPOSANT : SELECTEUR ───────────────────────────────────────
const SelectField = ({ label, value, onChange, filieres, loadingFilieres, side = 'left' }: any) => (
  <div className="flex-1 group">
    <label className={cn("text-[10px] font-black uppercase tracking-[0.2em] mb-3 block px-1", side === 'left' ? "text-emerald-600" : "text-red-600")}>
      {label}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={cn(
          "w-full h-[58px] bg-white dark:bg-slate-900 border-2 rounded-2xl px-5 text-sm font-black outline-none appearance-none transition-all",
          side === 'left' ? "border-emerald-50 focus:border-emerald-500" : "border-red-50 focus:border-red-500"
        )}
      >
        {filieres.map((f: any) => (
          <option key={f.id} value={f.id}>{f.id} — {f.niveau}</option>
        ))}
      </select>
      <Target size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
    </div>
  </div>
);

export const ComparerPanel = () => {
  const [filieres, setFilieres] = useState<FiliereInfo[]>([]);
  const [loadingFilieres, setLoadingFilieres] = useState(true);
  const [f1, setF1] = useState('');
  const [f2, setF2] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API}/api/filieres/accessibles`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        const list = data.filieres || [];
        setFilieres(list);
        if (list.length >= 2) { setF1(list[0].id); setF2(list[1].id); }
      })
      .finally(() => setLoadingFilieres(false));
  }, []);

  const compare = async () => {
    setLoading(true); setError(null);
    try {
      const data = await getComparer(f1, f2);
      setResult(data);
    } catch { setError('Erreur de chargement.'); }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in pb-10">
      
      {/* Header */}
      <div className="p-6 rounded-[2rem] bg-slate-50 dark:bg-white/[0.03] border border-slate-100 flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-[#006666] text-white shadow-lg shadow-[#006666]/20">
          <Scale size={24} />
        </div>
        <div>
          <h3 className="text-sm font-black uppercase tracking-tighter">Comparateur de Carrières</h3>
          <p className="text-[11px] text-slate-500 italic">Analyse comparative des débouchés SUPMTI.</p>
        </div>
      </div>

      {/* Selectors */}
      <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-end gap-4">
        <SelectField label="Option A" value={f1} onChange={setF1} filieres={filieres} loadingFilieres={loadingFilieres} side="left" />
        <div className="hidden md:flex flex-col items-center justify-center mb-1">
          <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg font-black text-[10px]">VS</div>
        </div>
        <SelectField label="Option B" value={f2} onChange={setF2} filieres={filieres} loadingFilieres={loadingFilieres} side="right" />
      </div>

      <ActionBtn onClick={compare} disabled={loading || filieres.length < 2} className="h-16 bg-slate-900 hover:bg-black text-white rounded-2xl font-black">
        {loading ? <Loader2 className="animate-spin mr-2" /> : <Zap size={18} className="mr-2 fill-current" />}
        {loading ? "Analyse en cours..." : "Lancer le duel"}
      </ActionBtn>

      {/* Results Rendering */}
      {!loading && result && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4">
          
          {/* 1. Visual Salaries */}
          <div className="relative">
            <SalaryVisualizer f1={f1} f2={f2} />
          </div>

          {/* 2. Insertion Gauges */}
          <div className="grid grid-cols-2 gap-4">
             <InsertionGauge label={f1} percent={92} color="emerald" />
             <InsertionGauge label={f2} percent={90} color="red" />
          </div>

          {/* 3. Detailed Report */}
          <div className="relative">
             <div className="absolute -top-3 left-6 px-3 py-1 bg-[#006666] text-white text-[9px] font-black rounded-lg z-10 shadow-md uppercase tracking-widest">
                Rapport d'Expertise
             </div>
             <ResultCard className="pt-10 pb-8 px-8 bg-white dark:bg-slate-900 border-2 border-slate-100 rounded-[2.5rem] shadow-xl">
                <Prose content={result.comparaison} />
             </ResultCard>
          </div>

          {/* 4. SAMI Recommendation */}
          {result.recommandation && (
            <div className="relative group">
              <div className="absolute inset-0 bg-emerald-500 rounded-[2.5rem] blur opacity-10" />
              <ResultCard accent className="relative border-none bg-emerald-50/50 dark:bg-emerald-950/20 p-8 rounded-[2.5rem]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2.5 bg-emerald-500 text-white rounded-xl shadow-lg">
                    <Sparkles size={18} />
                  </div>
                  <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Arbitrage SAMI IA</h4>
                </div>
                <Prose content={result.recommandation} className="text-emerald-900 dark:text-emerald-50 font-medium" />
              </ResultCard>
            </div>
          )}
        </div>
      )}
    </div>
  );
};