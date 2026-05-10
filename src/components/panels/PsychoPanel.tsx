// 'use client';
// import { useState } from 'react';
// import { Brain, ArrowRight, Sparkles, CheckCircle2, LayoutDashboard, Send } from 'lucide-react';
// import { startPsycho, answerPsycho } from '@/services/panelService';
// import { Spinner, ActionBtn, ResultCard, ScoreBar, Prose, ErrorBox } from './ui';
// import { usePanelStore } from '@/store/panelStore';
// import { cn } from '@/lib/utils';

// const PSYCHO_ICONS: Record<string, string> = {
//   logique: '🧠', creativite: '💡', leadership: '👑',
//   gestion_stress: '💪', travail_equipe: '🤝', style_cognitif: '🔍',
// };
// const PSYCHO_LABELS: Record<string, string> = {
//   logique: 'Logique', creativite: 'Créativité', leadership: 'Leadership',
//   gestion_stress: 'Gestion du stress', travail_equipe: 'Travail en équipe', style_cognitif: 'Style analytique',
// };

// type Phase = 'intro' | 'question' | 'result';

// export const PsychoPanel = () => {
//   const [phase,    setPhase]   = useState<Phase>('intro');
//   const [loading, setLoading] = useState(false);
//   const [error,    setError]   = useState<string | null>(null);
//   const [question, setQuestion] = useState('');
//   const [current,  setCurrent]  = useState(0);
//   const [total]                 = useState(10);
//   const [answer,   setAnswer]   = useState('');
//   const [scores,   setScores]   = useState<Record<string, number> | null>(null);
//   const [rapport,  setRapport]  = useState('');
//   const { openPanel } = usePanelStore();

//   const start = async () => {
//     setLoading(true); setError(null);
//     try {
//       const data = await startPsycho();
//       setQuestion(data.message || '');
//       setCurrent(1);
//       setPhase('question');
//     } catch { setError('Connexion au moteur psycho interrompue.'); }
//     setLoading(false);
//   };

//   const submit = async () => {
//     if (!answer.trim()) return;
//     setLoading(true);
//     try {
//       const data = await answerPsycho(answer);
//       setAnswer('');
//       if (data.complete) {
//         setScores(data.scores || null);
//         setRapport(data.rapport || '');
//         setPhase('result');
//       } else {
//         setQuestion(data.message || '');
//         setCurrent(data.question_actuelle || current + 1);
//       }
//     } catch { setError('Erreur de transmission. Réessaie.'); }
//     setLoading(false);
//   };

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500">
      
//       {/* ── PHASE : INTRO ── */}
//       {phase === 'intro' && (
//         <div className="space-y-6">
//           <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/5 to-orange-500/5 border border-slate-100 dark:border-white/5">
//             <div className="flex items-center gap-2 mb-3 text-purple-500">
//               <Sparkles size={18} />
//               <span className="text-[10px] font-black uppercase tracking-[0.2em]">Évaluation Adaptive</span>
//             </div>
//             <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
//               Ce test de <span className="text-slate-900 dark:text-white">{total} questions</span> utilise l'IA pour dresser ton profil psychologique académique. Réponds spontanément.
//             </p>
//           </div>

//           <div className="grid grid-cols-2 gap-2">
//             {Object.entries(PSYCHO_ICONS).map(([k, icon]) => (
//               <div key={k} className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.05] rounded-xl">
//                 <span className="text-sm">{icon}</span>
//                 <span className="text-[10px] font-bold text-slate-500 truncate">{PSYCHO_LABELS[k]}</span>
//               </div>
//             ))}
//           </div>

//           {error && <ErrorBox message={error} />}
//           <ActionBtn onClick={start} disabled={loading} className="w-full bg-[#006666] text-white py-4 font-bold shadow-xl">
//              {loading ? <Spinner /> : <><Brain size={18} className="mr-2" /> Démarrer l'analyse</>}
//           </ActionBtn>
//         </div>
//       )}

//       {/* ── PHASE : QUESTION ── */}
//       {phase === 'question' && (
//         <div className="space-y-6 animate-in slide-in-from-right-4">
//           <div className="space-y-2">
//             <div className="flex justify-between items-end">
//               <div className="flex flex-col">
//                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progression</span>
//                 <span className="text-lg font-black text-slate-800 dark:text-white">{current} <span className="text-slate-400 text-sm">/ {total}</span></span>
//               </div>
//               <span className="text-xs font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full">
//                 {Math.round((current / total) * 100)}%
//               </span>
//             </div>
//             <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
//               <div
//                 className="h-full bg-gradient-to-r from-orange-500 to-rose-500 transition-all duration-700 ease-out"
//                 style={{ width: `${(current / total) * 100}%` }}
//               />
//             </div>
//           </div>

//           <div className="relative group">
//             <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-2xl blur-md opacity-50"></div>
//             <div className="relative bg-white dark:bg-slate-900 border-2 border-orange-500/20 rounded-2xl p-5 shadow-sm">
//                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-relaxed italic">
//                 "{question}"
//                </p>
//             </div>
//           </div>

//           <div className="space-y-3">
//             <textarea
//               value={answer}
//               onChange={e => setAnswer(e.target.value)}
//               placeholder="Écris librement ici..."
//               rows={4}
//               className={cn(
//                 "w-full bg-slate-50 dark:bg-white/[0.03] border-2 border-slate-100 dark:border-white/[0.08] rounded-2xl p-4",
//                 "text-sm text-slate-700 dark:text-slate-200 outline-none focus:border-orange-500/40 transition-all resize-none shadow-inner"
//               )}
//             />
//             {error && <ErrorBox message={error} />}
//             <ActionBtn onClick={submit} disabled={!answer.trim() || loading} className="w-full bg-slate-900 text-white h-12 rounded-xl">
//               {loading ? <Spinner /> : <><Send size={16} className="mr-2" /> Valider ma réponse</>}
//             </ActionBtn>
//           </div>
//         </div>
//       )}

//       {/* ── PHASE : RESULT ── */}
//       {phase === 'result' && scores && (
//         <div className="space-y-6 animate-in slide-in-from-bottom-4">
//           <div className="text-center">
//             <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-xl shadow-emerald-500/20 text-white">
//               <CheckCircle2 size={32} />
//             </div>
//             <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Analyse Terminée</h3>
//           </div>

//           <ResultCard className="border-t-4 border-t-orange-500 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-200/50 dark:shadow-none">
//             <div className="flex items-center gap-2 mb-5">
//                <LayoutDashboard size={14} className="text-slate-400" />
//                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Matrice de personnalité</span>
//             </div>
//             <div className="space-y-5">
//               {Object.entries(scores).map(([k, v]) => (
//                 <div key={k} className="space-y-1.5">
//                   <div className="flex justify-between items-center px-1">
//                     <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-2">
//                       <span className="text-base grayscale group-hover:grayscale-0">{PSYCHO_ICONS[k]}</span> {PSYCHO_LABELS[k] || k}
//                     </span>
//                     <span className="text-xs font-black text-orange-500">{v}%</span>
//                   </div>
//                   <div className="h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
//                     <div 
//                       className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-1000" 
//                       style={{ width: `${v}%` }} 
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </ResultCard>

//           {rapport && (
//             <ResultCard className="bg-slate-50 dark:bg-white/[0.02] border-dashed">
//               <Prose content={rapport} className="text-sm italic" />
//             </ResultCard>
//           )}

//           <ActionBtn onClick={() => openPanel('fitscore')} className="w-full bg-[#006666] text-white py-4 font-bold shadow-emerald-500/10">
//             <Sparkles size={18} className="mr-2" /> Voir mon FitScore enrichi
//           </ActionBtn>
//         </div>
//       )}
//     </div>
//   );
// };




'use client';

import { useState } from 'react';
import {
  Brain,
  Send,
  Sparkles,
  CheckCircle2,
  LayoutDashboard,
  BrainCircuit,
  ArrowRight,
  MessageSquareQuote,
} from 'lucide-react';
import { startPsycho, answerPsycho } from '@/services/panelService';
import { Spinner, ActionBtn, ResultCard, Prose, ErrorBox } from './ui';
import { usePanelStore } from '@/store/panelStore';
import { useLang } from '@/i18n/LanguageContext';
import { cn } from '@/lib/utils';

const PSYCHO_ICONS: Record<string, string> = {
  logique: '🧠',
  creativite: '💡',
  leadership: '👑',
  gestion_stress: '💪',
  travail_equipe: '🤝',
  style_cognitif: '🔍',
};

type Phase = 'intro' | 'question' | 'result';

export const PsychoPanel = () => {
  const { t } = useLang();
  const { openPanel } = usePanelStore();

  const PSYCHO_LABELS: Record<string, string> = {
    logique: t('psycho', 'trait_logic'),
    creativite: t('psycho', 'trait_creativity'),
    leadership: t('psycho', 'trait_leadership'),
    gestion_stress: t('psycho', 'trait_stress'),
    travail_equipe: t('psycho', 'trait_teamwork'),
    style_cognitif: t('psycho', 'trait_style'),
  };

  const [phase, setPhase] = useState<Phase>('intro');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [current, setCurrent] = useState(0);
  const [total] = useState(10);
  const [answer, setAnswer] = useState('');
  const [scores, setScores] = useState<Record<string, number> | null>(null);
  const [rapport, setRapport] = useState('');

  const progress = Math.round((current / total) * 100);

  const start = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await startPsycho();
      setQuestion(data.message || '');
      setCurrent(1);
      setPhase('question');
    } catch {
      setError(t('psycho', 'error_start'));
    }

    setLoading(false);
  };

  const submit = async () => {
    if (!answer.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await answerPsycho(answer);
      setAnswer('');

      if (data.complete) {
        setScores(data.scores || null);
        setRapport(data.rapport || '');
        setPhase('result');
      } else {
        setQuestion(data.message || '');
        setCurrent(data.question_actuelle || current + 1);
      }
    } catch {
      setError(t('psycho', 'error_submit'));
    }

    setLoading(false);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      {/* INTRO */}
      {phase === 'intro' && (
        <div className="space-y-5">
          <div className="rounded-3xl border border-purple-500/10 bg-gradient-to-br from-purple-500/5 via-orange-500/[0.04] to-pink-500/[0.05] p-4">
            <div className="mb-3 flex items-center gap-2">
              <BrainCircuit size={16} className="text-purple-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-purple-500">
                {t('psycho', 'adaptive_badge')}
              </span>
            </div>

            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {t('psycho', 'intro_before')}{' '}
              <span className="font-bold text-slate-800 dark:text-slate-100">{total}</span>{' '}
              {t('psycho', 'intro_after')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {Object.entries(PSYCHO_ICONS).map(([k, icon]) => (
              <div
                key={k}
                className="rounded-2xl border border-slate-200/70 bg-white/80 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/70"
              >
                <div className="mb-2 text-xl">{icon}</div>
                <p className="text-[11px] font-black text-slate-700 dark:text-slate-200">
                  {PSYCHO_LABELS[k]}
                </p>
              </div>
            ))}
          </div>

          {error && <ErrorBox message={error} />}

          <button
            onClick={start}
            disabled={loading}
            className={cn(
              'group w-full rounded-2xl py-4 text-sm font-black text-white shadow-xl transition-all active:scale-[0.98]',
              loading ? 'cursor-not-allowed bg-slate-400' : 'bg-[#006666] hover:bg-[#005555]'
            )}
          >
            <span className="flex items-center justify-center gap-2">
              {loading ? (
                <Spinner />
              ) : (
                <>
                  <Brain size={18} className="transition-transform group-hover:scale-110" />
                  {t('psycho', 'start_button')}
                </>
              )}
            </span>
          </button>
        </div>
      )}

      {/* QUESTION */}
      {phase === 'question' && (
        <div className="space-y-5 animate-in slide-in-from-right-4">
          <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
            <div className="mb-3 flex items-end justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                  {t('psycho', 'progress')}
                </p>
                <p className="mt-1 text-lg font-black text-slate-800 dark:text-white">
                  {current} <span className="text-sm text-slate-400">/ {total}</span>
                </p>
              </div>

              <span className="rounded-full bg-orange-500/10 px-2.5 py-1 text-[10px] font-black text-orange-500">
                {progress}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700/60">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-rose-500 transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="relative rounded-3xl border border-orange-500/20 bg-white p-5 shadow-sm dark:bg-slate-900">
            <div className="mb-3 flex items-center gap-2">
              <MessageSquareQuote size={14} className="text-orange-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-500">
                {t('psycho', 'current_question')}
              </span>
            </div>

            <p className="text-sm font-bold italic leading-relaxed text-slate-700 dark:text-slate-200">
              “{question}”
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
            <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
              {t('psycho', 'your_answer')}
            </label>

            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={t('psycho', 'answer_placeholder')}
              rows={4}
              className={cn(
                'w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3',
                'text-sm text-slate-700 dark:text-slate-200 outline-none transition-all resize-none',
                'placeholder:text-slate-400 focus:border-orange-500/40 focus:ring-4 focus:ring-orange-500/10'
              )}
            />

            {error && <div className="mt-3"><ErrorBox message={error} /></div>}

            <button
              onClick={submit}
              disabled={!answer.trim() || loading}
              className={cn(
                'group mt-4 w-full rounded-2xl py-4 text-sm font-black text-white shadow-xl transition-all active:scale-[0.98]',
                !answer.trim() || loading
                  ? 'cursor-not-allowed bg-slate-400'
                  : 'bg-slate-900 hover:bg-black'
              )}
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? (
                  <Spinner />
                ) : (
                  <>
                    <Send size={16} className="transition-transform group-hover:translate-x-0.5" />
                    {t('psycho', 'submit_answer')}
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* RESULT */}
      {phase === 'result' && scores && (
        <div className="space-y-5 animate-in slide-in-from-bottom-4">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl shadow-emerald-500/20">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-base font-black uppercase tracking-tight text-slate-800 dark:text-white">
              {t('psycho', 'done_title')}
            </h3>
          </div>

          <ResultCard className="border-t-4 border-t-orange-500 bg-white shadow-2xl shadow-slate-200/50 dark:bg-slate-900 dark:shadow-none">
            <div className="mb-5 flex items-center gap-2">
              <LayoutDashboard size={14} className="text-slate-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {t('psycho', 'matrix_title')}
              </span>
            </div>

            <div className="space-y-5">
              {Object.entries(scores).map(([k, v]) => (
                <div key={k} className="space-y-1.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                      <span className="text-base">{PSYCHO_ICONS[k]}</span>
                      {PSYCHO_LABELS[k] || k}
                    </span>
                    <span className="text-xs font-black text-orange-500">{v}%</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-1000"
                      style={{ width: `${v}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ResultCard>

          {rapport && (
            <ResultCard className="border-dashed bg-slate-50 dark:bg-white/[0.02]">
              <Prose content={rapport} className="text-sm italic leading-relaxed" />
            </ResultCard>
          )}

          <button
            onClick={() => openPanel('fitscore')}
            className="group w-full rounded-2xl bg-[#006666] py-4 text-sm font-black text-white shadow-xl transition-all hover:bg-[#005555] active:scale-[0.98]"
          >
            <span className="flex items-center justify-center gap-2">
              <Sparkles size={18} className="transition-transform group-hover:scale-110" />
              {t('psycho', 'goto_fitscore')}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </button>
        </div>
      )}
    </div>
  );
};