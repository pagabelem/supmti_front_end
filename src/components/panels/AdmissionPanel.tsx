// 'use client';
// import { useState } from 'react';
// import { DoorOpen, ShieldCheck, Sparkles, GraduationCap } from 'lucide-react';
// import { getAdmission } from '@/services/panelService';
// import { Spinner, ActionBtn, ResultCard, Prose, ErrorBox } from './ui';
// import { cn } from '@/lib/utils';

// export const AdmissionPanel = () => {
//   const [loading, setLoading] = useState(false);
//   const [result,  setResult]  = useState<string | null>(null);
//   const [error,   setError]   = useState<string | null>(null);

//   const calc = async () => {
//     setLoading(true); 
//     setError(null);
//     try {
//       const data = await getAdmission();
//       if (data.error) { 
//         setError(data.message || 'Profil insuffisant pour une simulation précise.'); 
//       }
//       else { 
//         setResult(data.rapport || ''); 
//       }
//     } catch { 
//       setError('Erreur de connexion au moteur de calcul.'); 
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
//       {/* ── Header Iconographique ── */}
//       <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950/30 p-5 border border-blue-100/50 dark:border-blue-900/20">
//         <div className="relative z-10">
//           <div className="flex items-center gap-3 mb-3">
//             <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
//               <ShieldCheck size={20} />
//             </div>
//             <h3 className="font-bold text-slate-800 dark:text-slate-100 tracking-tight">Vérificateur d'Éligibilité</h3>
//           </div>
//           <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-[240px]">
//             SAMI analyse ton dossier pour calculer tes chances d'admission et ton éligibilité aux <span className="text-blue-600 dark:text-blue-400 font-bold">bourses d'excellence</span>.
//           </p>
//         </div>
//         {/* Décoration en arrière-plan */}
//         <GraduationCap size={80} className="absolute -right-4 -bottom-4 text-blue-500/5 dark:text-blue-400/5 -rotate-12" />
//       </div>

//       {/* ── Bouton d'Action Premium ── */}
//       <div className="relative group">
//         {!loading && !result && (
//            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-[#006666] rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
//         )}
//         <ActionBtn 
//           onClick={calc} 
//           disabled={loading}
//           className={cn(
//             "relative w-full py-4 font-bold tracking-tight shadow-xl transition-all active:scale-95",
//             result ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-none border-transparent" : "bg-[#006666] text-white"
//           )}
//         >
//           {loading ? (
//             <span className="flex items-center gap-2">Exploration du dossier...</span>
//           ) : (
//             <span className="flex items-center justify-center gap-2">
//               <DoorOpen size={18} className={cn(result ? "text-slate-400" : "animate-pulse")} />
//               {result ? "Relancer la simulation" : "Simuler mon admission"}
//             </span>
//           )}
//         </ActionBtn>
//       </div>

//       {/* ── Zone de Résultats ── */}
//       <div className="min-h-[100px] flex flex-col items-center justify-center">
//         {loading && (
//           <div className="flex flex-col items-center gap-4 py-10 animate-pulse">
//             <Spinner />
//             <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Analyse Algorithmique</p>
//           </div>
//         )}

//         {error && (
//           <div className="w-full animate-in zoom-in-95 duration-300">
//             <ErrorBox message={error} />
//             <p className="text-[10px] text-center text-slate-400 mt-4 px-6 italic">
//               Complète ton profil avec tes notes de BAC pour débloquer cette fonctionnalité.
//             </p>
//           </div>
//         )}

//         {!loading && result && (
//           <div className="w-full animate-in fade-in slide-in-from-top-4 duration-700">
//             <div className="flex items-center gap-2 mb-3 px-1">
//               <Sparkles size={14} className="text-orange-500" />
//               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-xs">Rapport SAMI Intelligence</span>
//             </div>
//             <ResultCard className="border-t-4 border-t-[#006666] shadow-2xl shadow-blue-500/5">
//               <Prose content={result} />
//             </ResultCard>
            
//             {/* Petit Footer de réassurance */}
//             <div className="mt-6 p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
//               <p className="text-[10px] text-slate-400 text-center leading-tight">
//                 * Ces résultats sont basés sur les critères d'admission 2026. <br/>
//                 Présente-toi école pour une validation officielle.
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

'use client';
import { useState } from 'react';
import { DoorOpen, ShieldCheck, Sparkles, GraduationCap, TrendingUp, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { getAdmission } from '@/services/panelService';
import { Spinner, ActionBtn, ResultCard, Prose, ErrorBox } from './ui';
import { cn } from '@/lib/utils';

// ── Types correspondant à ce que retourne le backend ─────────
interface BourseEstimee {
  eligible:    boolean;
  pourcentage?: number;
  label?:       string;
  a_payer?:     number;
  message?:     string;
}

interface AdmissionItem {
  filiere_id:           string;
  filiere_nom:          string;
  filiere_niveau?:      string;
  probabilite:          number;
  categorie:            string;
  eligible:             boolean;
  raison_ineligibilite?: string;
  bourse_estimee?:      BourseEstimee | null;
  points_forts?:        string[];
  points_faibles?:      string[];
  conseils?:            string;
}

interface AdmissionRapport {
  classement?:     AdmissionItem[];
  message_niveau?: string;
  annee_entree?:   string;
  conseil?:        string;
}

// ── Barre de probabilité ──────────────────────────────────────
const ProbBar = ({ item }: { item: AdmissionItem }) => {
  const pct   = item.probabilite || 0;
  const color = pct >= 70 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-400';
  const badge = pct >= 70 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
              : pct >= 50 ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
              :             'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';

  return (
    <div className="p-4 rounded-2xl border border-slate-100 dark:border-white/[0.06] bg-white dark:bg-slate-900/50 space-y-3">
      {/* Header filière */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-black text-[13px] text-slate-800 dark:text-slate-100">
              {item.filiere_nom}
            </span>
            {item.filiere_niveau && (
              <span className={cn(
                "text-[9px] font-black px-1.5 py-0.5 rounded-full border",
                item.filiere_niveau === 'BAC+5'
                  ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
                  : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
              )}>
                {item.filiere_niveau}
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">{item.categorie}</p>
        </div>

        {/* Badge probabilité ou non-éligible */}
        {item.eligible ? (
          <span className={cn("text-[11px] font-black px-2 py-1 rounded-lg border shrink-0", badge)}>
            {pct}%
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-500/5 border border-red-500/20 px-2 py-1 rounded-lg shrink-0">
            <XCircle size={10} /> Non éligible
          </span>
        )}
      </div>

      {/* Barre de progression */}
      {item.eligible && (
        <div className="h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-700", color)}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}

      {/* Raison non-éligible */}
      {!item.eligible && item.raison_ineligibilite && (
        <div className="flex items-start gap-2 text-[10px] text-slate-500 bg-slate-50 dark:bg-white/[0.02] rounded-xl p-2">
          <AlertCircle size={12} className="text-orange-400 shrink-0 mt-0.5" />
          <span>{item.raison_ineligibilite}</span>
        </div>
      )}

      {/* Bourse estimée */}
      {item.eligible && item.bourse_estimee?.eligible && item.bourse_estimee.pourcentage && (
        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
          <Sparkles size={11} />
          Bourse estimée {item.bourse_estimee.pourcentage}% → {item.bourse_estimee.a_payer?.toLocaleString()} DH/an
        </div>
      )}
    </div>
  );
};

// ── Panel principal ───────────────────────────────────────────
export const AdmissionPanel = () => {
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<AdmissionRapport | null>(null);
  const [error,   setError]   = useState<string | null>(null);

  const calc = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdmission();

      if (data.error) {
        setError(data.message || 'Profil insuffisant pour une simulation précise.');
        setLoading(false);
        return;
      }

      // Le backend retourne { rapport: {...} } ou { rapport: "string" }
      const rapport = data.rapport;

      if (typeof rapport === 'string') {
        // Ancienne version — string brute
        setResult({ conseil: rapport });
      } else if (rapport && typeof rapport === 'object') {
        // Nouvelle version — dict structuré
        setResult(rapport as AdmissionRapport);
      } else {
        setError('Résultat inattendu du serveur.');
      }
    } catch {
      setError('Erreur de connexion au moteur de calcul.');
    }
    setLoading(false);
  };

  // Séparer éligibles / non-éligibles
  const eligibles    = result?.classement?.filter(i => i.eligible)    ?? [];
  const nonEligibles = result?.classement?.filter(i => !i.eligible)   ?? [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

      {/* ── Header ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950/30 p-5 border border-blue-100/50 dark:border-blue-900/20">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              Vérificateur d'Éligibilité
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-[240px]">
            SAMI analyse ton dossier pour calculer tes chances d'admission et ton éligibilité aux{' '}
            <span className="text-blue-600 dark:text-blue-400 font-bold">bourses d'excellence</span>.
          </p>
        </div>
        <GraduationCap size={80} className="absolute -right-4 -bottom-4 text-blue-500/5 dark:text-blue-400/5 -rotate-12" />
      </div>

      {/* ── Bouton ── */}
      <div className="relative group">
        {!loading && !result && (
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-[#006666] rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
        )}
        <ActionBtn
          onClick={calc}
          disabled={loading}
          className={cn(
            "relative w-full py-4 font-bold tracking-tight shadow-xl transition-all active:scale-95",
            result
              ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-none border-transparent"
              : "bg-[#006666] text-white"
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

      {/* ── Résultats ── */}
      <div className="min-h-[100px]">
        {loading && (
          <div className="flex flex-col items-center gap-4 py-10">
            <Spinner label="Analyse Algorithmique" />
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
          <div className="w-full animate-in fade-in slide-in-from-top-4 duration-700 space-y-4">

            {/* Badge rapport */}
            <div className="flex items-center gap-2 px-1">
              <Sparkles size={14} className="text-orange-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Rapport SAMI Intelligence
              </span>
            </div>

            {/* Message niveau + année d'entrée */}
            {(result.message_niveau || result.annee_entree) && (
              <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                {result.annee_entree && (
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp size={12} className="text-blue-500" />
                    <span className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      Entrée en {result.annee_entree}
                    </span>
                  </div>
                )}
                {result.message_niveau && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {result.message_niveau}
                  </p>
                )}
              </div>
            )}

            {/* Filières éligibles */}
            {eligibles.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <CheckCircle2 size={12} className="text-emerald-500" />
                  <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                    Filières accessibles ({eligibles.length})
                  </span>
                </div>
                {eligibles.map(item => (
                  <ProbBar key={item.filiere_id} item={item} />
                ))}
              </div>
            )}

            {/* Filières non éligibles */}
            {nonEligibles.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <XCircle size={12} className="text-red-400" />
                  <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">
                    Filières non accessibles à ton niveau ({nonEligibles.length})
                  </span>
                </div>
                {nonEligibles.map(item => (
                  <ProbBar key={item.filiere_id} item={item} />
                ))}
              </div>
            )}

            {/* Conseil global */}
            {result.conseil && (
              <ResultCard accent className="border-t-4 border-t-[#006666] shadow-2xl shadow-blue-500/5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={13} className="text-orange-500" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Conseil personnalisé</span>
                </div>
                <Prose content={result.conseil} />
              </ResultCard>
            )}

            {/* Cas fallback : string brute */}
            {!result.classement && result.conseil && (
              <ResultCard className="border-t-4 border-t-[#006666]">
                <Prose content={result.conseil} />
              </ResultCard>
            )}

            {/* Footer */}
            <div className="mt-4 p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-[10px] text-slate-400 text-center leading-tight">
                * Ces résultats sont basés sur les critères d'admission 2026.<br />
                Présente-toi à l'école pour une validation officielle.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};