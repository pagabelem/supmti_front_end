// 'use client';
// import { useState } from 'react';
// import { Medal, Trophy, Calendar, CheckCircle2, Lightbulb, FileDown, Loader2 } from 'lucide-react';
// import { getCoach } from '@/services/panelService';
// import { Spinner, ActionBtn, ResultCard, Prose, ErrorBox } from './ui';
// import { cn } from '@/lib/utils';

// const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// function getUserId(): string {
//   try {
//     const raw = localStorage.getItem('supmti-auth');
//     if (!raw) return '';
//     return JSON.parse(raw)?.state?.user?.id || '';
//   } catch { return ''; }
// }

// async function downloadRapport(format: 'pdf' | 'word'): Promise<string | null> {
//   const uid = getUserId();
//   const res = await fetch(`${API}/api/rapport/${format}`, {
//     credentials: 'include',
//     headers: uid ? { 'X-User-Id': uid } : {},
//   });
//   if (!res.ok) {
//     const json = await res.json().catch(() => ({}));
//     return json.error || 'Erreur lors de la génération.';
//   }
//   const blob = await res.blob();
//   const url  = URL.createObjectURL(blob);
//   const a    = document.createElement('a');
//   a.href     = url;
//   a.download = format === 'pdf' ? 'rapport_coach_sami.pdf' : 'rapport_coach_sami.docx';
//   document.body.appendChild(a);
//   a.click();
//   document.body.removeChild(a);
//   URL.revokeObjectURL(url);
//   return null;
// }

// export const CoachPanel = () => {
//   const [loading,      setLoading]      = useState(false);
//   const [result,       setResult]       = useState<string | null>(null);
//   const [error,        setError]        = useState<string | null>(null);
//   const [dlLoading,    setDlLoading]    = useState<'pdf'|'word'|null>(null);
//   const [dlError,      setDlError]      = useState<string | null>(null);

//   const fetchCoach = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await getCoach();
//       if (data.error) {
//         setError(data.message || 'Profil insuffisant pour établir un plan.');
//       } else {
//         setResult(data.rapport || '');
//       }
//     } catch {
//       setError('Impossible de joindre ton coach IA.');
//     }
//     setLoading(false);
//   };

//   const handleDownload = async (format: 'pdf' | 'word') => {
//     setDlLoading(format);
//     setDlError(null);
//     const err = await downloadRapport(format);
//     if (err) setDlError(err);
//     setDlLoading(null);
//   };

//   return (
//     <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

//       {/* ── Header ── */}
//       <div className="bg-slate-900 dark:bg-emerald-950/20 rounded-2xl p-5 border border-slate-800 dark:border-emerald-900/30 relative overflow-hidden">
//         <div className="relative z-10">
//           <div className="flex items-center gap-2 mb-2">
//             <Trophy size={16} className="text-emerald-500" />
//             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">SAMI Mentor</span>
//           </div>
//           <p className="text-xs text-slate-300 dark:text-slate-400 leading-relaxed font-medium">
//             Obtiens ton plan d'action personnalisé : <span className="text-white">objectifs académiques, soft skills et focus de la semaine.</span>
//           </p>
//         </div>
//         <Medal size={60} className="absolute -right-4 -bottom-4 text-white/5 rotate-12" />
//       </div>

//       {/* ── Bouton Générer ── */}
//       <div className="relative group">
//         {!result && (
//           <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
//         )}
//         <ActionBtn
//           onClick={fetchCoach}
//           disabled={loading}
//           className={cn(
//             "relative w-full py-4 rounded-xl font-bold tracking-tight shadow-xl transition-all active:scale-95",
//             result
//               ? "bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent shadow-none"
//               : "bg-[#006666] text-white"
//           )}
//         >
//           {loading ? (
//             <span className="flex items-center gap-2 italic">Analyse des performances...</span>
//           ) : (
//             <span className="flex items-center justify-center gap-2">
//               <Medal size={18} className={cn(!result && "animate-bounce")} />
//               {result ? "Actualiser mon plan d'action" : "Générer mon rapport coach"}
//             </span>
//           )}
//         </ActionBtn>
//       </div>

//       {/* ── Résultat ── */}
//       <div className="min-h-[60px]">
//         {loading && (
//           <div className="flex flex-col items-center gap-4 py-8">
//             <Spinner />
//             <div className="flex gap-1">
//               {["-0.3s","-0.15s","0s"].map((d) => (
//                 <span key={d} className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: d }} />
//               ))}
//             </div>
//           </div>
//         )}

//         {error && <div className="animate-in zoom-in-95"><ErrorBox message={error} /></div>}

//         {!loading && result && (
//           <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">

//             {/* Badges */}
//             <div className="flex gap-2 px-1">
//               <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tighter">
//                 <CheckCircle2 size={10} /> Objectifs Prêts
//               </div>
//               <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tighter">
//                 <Calendar size={10} /> Semaine en cours
//               </div>
//             </div>

//             {/* Rapport */}
//             <ResultCard accent className="border-t-4 border-t-emerald-500 shadow-2xl shadow-emerald-500/5 bg-white dark:bg-slate-900/50">
//               <div className="flex items-center gap-2 mb-4 opacity-70">
//                 <Lightbulb size={14} className="text-yellow-500" />
//                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Conseils Stratégiques</span>
//               </div>
//               <Prose content={result} />
//             </ResultCard>

//             {/* ── Boutons Téléchargement ── */}
//             <div className="pt-2 space-y-2">
//               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-3">
//                 Télécharger ce rapport
//               </p>

//               <div className="grid grid-cols-2 gap-3">
//                 {/* PDF */}
//                 <button
//                   onClick={() => handleDownload('pdf')}
//                   disabled={!!dlLoading}
//                   className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl
//                     bg-red-50 dark:bg-red-950/20
//                     border border-red-100 dark:border-red-900/30
//                     text-red-600 dark:text-red-400
//                     hover:bg-red-100 dark:hover:bg-red-950/40
//                     transition-all active:scale-95 disabled:opacity-50 font-bold text-sm"
//                 >
//                   {dlLoading === 'pdf'
//                     ? <Loader2 size={16} className="animate-spin" />
//                     : <FileDown size={16} />
//                   }
//                   PDF
//                 </button>

//                 {/* Word */}
//                 <button
//                   onClick={() => handleDownload('word')}
//                   disabled={!!dlLoading}
//                   className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl
//                     bg-blue-50 dark:bg-blue-950/20
//                     border border-blue-100 dark:border-blue-900/30
//                     text-blue-600 dark:text-blue-400
//                     hover:bg-blue-100 dark:hover:bg-blue-950/40
//                     transition-all active:scale-95 disabled:opacity-50 font-bold text-sm"
//                 >
//                   {dlLoading === 'word'
//                     ? <Loader2 size={16} className="animate-spin" />
//                     : <FileDown size={16} />
//                   }
//                   Word
//                 </button>
//               </div>

//               {dlError && (
//                 <p className="text-xs text-red-500 text-center mt-2">{dlError}</p>
//               )}
//             </div>

//             <p className="text-[10px] text-center text-slate-400 italic px-4">
//               "Le succès est la somme de petits efforts répétés jour après jour."
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
















// ============================================================
// CoachPanel.tsx — avec i18n
// ============================================================
'use client';
import { useState } from 'react';
import { Medal, Trophy, Calendar, CheckCircle2, Lightbulb, FileDown, Loader2 } from 'lucide-react';
import { getCoach } from '@/services/panelService';
import { Spinner, ActionBtn, ResultCard, Prose, ErrorBox } from './ui';
import { useLang } from '@/i18n/LanguageContext';
import { cn } from '@/lib/utils';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
function getUserId(): string {
  try { const raw = localStorage.getItem('supmti-auth'); if (!raw) return ''; return JSON.parse(raw)?.state?.user?.id || ''; }
  catch { return ''; }
}

async function downloadRapport(format: 'pdf' | 'word', errorMsg: string): Promise<string | null> {
  const uid = getUserId();
  const res = await fetch(`${API}/api/rapport/${format}`, { credentials: 'include', headers: uid ? { 'X-User-Id': uid } : {} });
  if (!res.ok) { const json = await res.json().catch(() => ({})); return json.error || errorMsg; }
  const blob = await res.blob();
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = format === 'pdf' ? 'rapport_coach_sami.pdf' : 'rapport_coach_sami.docx';
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  return null;
}

export const CoachPanel = () => {
  const { t } = useLang();
  const [loading,   setLoading]   = useState(false);
  const [result,    setResult]    = useState<string | null>(null);
  const [error,     setError]     = useState<string | null>(null);
  const [dlLoading, setDlLoading] = useState<'pdf'|'word'|null>(null);
  const [dlError,   setDlError]   = useState<string | null>(null);

  const fetchCoach = async () => {
    setLoading(true); setError(null);
    try {
      const data = await getCoach();
      if (data.error) setError(data.message || t('coach','error_profile'));
      else setResult(data.rapport || '');
    } catch { setError(t('coach','error_connection')); }
    setLoading(false);
  };

  const handleDownload = async (format: 'pdf' | 'word') => {
    setDlLoading(format); setDlError(null);
    const err = await downloadRapport(format, t('coach','error_dl'));
    if (err) setDlError(err);
    setDlLoading(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

      {/* Header */}
      <div className="bg-slate-900 dark:bg-emerald-950/20 rounded-2xl p-5 border border-slate-800 dark:border-emerald-900/30 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={16} className="text-emerald-500" />
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">{t('coach','header_tag')}</span>
          </div>
          <p className="text-xs text-slate-300 dark:text-slate-400 leading-relaxed font-medium">{t('coach','header_desc')}</p>
        </div>
        <Medal size={60} className="absolute -right-4 -bottom-4 text-white/5 rotate-12" />
      </div>

      {/* Bouton */}
      <div className="relative group">
        {!result && <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />}
        <ActionBtn onClick={fetchCoach} disabled={loading}
          className={cn("relative w-full py-4 rounded-xl font-bold tracking-tight shadow-xl transition-all active:scale-95",
            result ? "bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent shadow-none" : "bg-[#006666] text-white"
          )}>
          {loading ? (
            <span className="flex items-center gap-2 italic">{t('coach','btn_loading')}</span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Medal size={18} className={cn(!result && "animate-bounce")} />
              {result ? t('coach','btn_refresh') : t('coach','btn_generate')}
            </span>
          )}
        </ActionBtn>
      </div>

      <div className="min-h-[60px]">
        {loading && (
          <div className="flex flex-col items-center gap-4 py-8">
            <Spinner />
            <div className="flex gap-1">
              {["-0.3s","-0.15s","0s"].map((d) => (
                <span key={d} className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: d }} />
              ))}
            </div>
          </div>
        )}

        {error && <div className="animate-in zoom-in-95"><ErrorBox message={error} /></div>}

        {!loading && result && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex gap-2 px-1">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tighter">
                <CheckCircle2 size={10} /> {t('coach','badge_objectives')}
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tighter">
                <Calendar size={10} /> {t('coach','badge_week')}
              </div>
            </div>

            <ResultCard accent className="border-t-4 border-t-emerald-500 shadow-2xl shadow-emerald-500/5 bg-white dark:bg-slate-900/50">
              <div className="flex items-center gap-2 mb-4 opacity-70">
                <Lightbulb size={14} className="text-yellow-500" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('coach','advice_label')}</span>
              </div>
              <Prose content={result} />
            </ResultCard>

            {/* Téléchargement */}
            <div className="pt-2 space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-3">{t('coach','download_title')}</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => handleDownload('pdf')} disabled={!!dlLoading}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40 transition-all active:scale-95 disabled:opacity-50 font-bold text-sm">
                  {dlLoading === 'pdf' ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} />}
                  {t('coach','dl_pdf')}
                </button>
                <button onClick={() => handleDownload('word')} disabled={!!dlLoading}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/40 transition-all active:scale-95 disabled:opacity-50 font-bold text-sm">
                  {dlLoading === 'word' ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} />}
                  {t('coach','dl_word')}
                </button>
              </div>
              {dlError && <p className="text-xs text-red-500 text-center mt-2">{dlError}</p>}
            </div>

            <p className="text-[10px] text-center text-slate-400 italic px-4">{t('coach','quote')}</p>
          </div>
        )}
      </div>
    </div>
  );
};