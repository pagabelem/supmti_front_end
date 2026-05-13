'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  CheckCircle2, XCircle, RefreshCw,
  Loader2, ChevronDown, ChevronUp, Send, Trash2,
  RotateCcw, Download, AlertTriangle, TrendingUp,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// ── Helper headers — toujours Record<string, string> ──────────
function getHeaders(): Record<string, string> {
  try {
    const uid = JSON.parse(localStorage.getItem('supmti-auth') || '{}')?.state?.user?.id || '';
    if (uid) return { 'X-User-Id': String(uid) };
  } catch {}
  return {};
}

// ── Types ──────────────────────────────────────────────────────
interface Question {
  id:            string;
  question:      string;
  langue:        string;
  nb_fois:       number;
  statut:        'non_traitee' | 'reponse_ajoutee' | 'ignoree';
  reponse_admin: string | null;
  premiere_vue:  string;
  derniere_vue:  string;
}

interface Stats {
  total:          number;
  non_traitees:   number;
  traitees:       number;
  top5_questions: { question: string; nb_fois: number }[];
}

// ── Badge statut ───────────────────────────────────────────────
const StatutBadge = ({ statut }: { statut: Question['statut'] }) => {
  const cfg = {
    non_traitee:     { label: 'Non traitée',     cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'     },
    reponse_ajoutee: { label: 'Réponse ajoutée', cls: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    ignoree:         { label: 'Ignorée',          cls: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'    },
  }[statut];
  return (
    <span className={cn('text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full', cfg.cls)}>
      {cfg.label}
    </span>
  );
};

const LangBadge = ({ lang }: { lang: string }) => {
  const flags: Record<string, string> = { fr: '🇫🇷', en: '🇬🇧', ar: '🇲🇦' };
  return <span className="text-sm">{flags[lang] || '🌐'}</span>;
};

// ── Carte Question ─────────────────────────────────────────────
const QuestionCard = ({
  q,
  onRepondre,
  onIgnorer,
  onSupprimer,
  onReouvrir,
}: {
  q:           Question;
  onRepondre:  (id: string, rep: string, injectRag: boolean) => Promise<void>;
  onIgnorer:   (id: string) => Promise<void>;
  onSupprimer: (id: string) => Promise<void>;
  onReouvrir:  (id: string) => Promise<void>;
}) => {
  const [open,        setOpen]        = useState(false);
  const [reponse,     setReponse]     = useState(q.reponse_admin || '');
  const [injectRag,   setInjectRag]   = useState(true);
  const [loading,     setLoading]     = useState(false);
  const [localStatut, setLocalStatut] = useState(q.statut);

  const handleRepondre = async () => {
    if (!reponse.trim() || reponse.trim().length < 10) return;
    setLoading(true);
    await onRepondre(q.id, reponse, injectRag);
    setLocalStatut('reponse_ajoutee');
    setLoading(false);
    setOpen(false);
  };

  const handleIgnorer = async () => {
    setLoading(true);
    await onIgnorer(q.id);
    setLocalStatut('ignoree');
    setLoading(false);
  };

  const handleReouvrir = async () => {
    setLoading(true);
    await onReouvrir(q.id);
    setLocalStatut('non_traitee');
    setLoading(false);
  };

  return (
    <div className={cn(
      'bg-white dark:bg-slate-900 border rounded-2xl overflow-hidden transition-all duration-200',
      localStatut === 'non_traitee'     ? 'border-red-200 dark:border-red-800/50'     :
      localStatut === 'reponse_ajoutee' ? 'border-green-200 dark:border-green-800/50' :
                                          'border-slate-200 dark:border-slate-700'
    )}>
      <div className="flex items-start gap-3 p-4">
        {/* Fréquence */}
        <div className={cn(
          'shrink-0 w-10 h-10 rounded-xl flex flex-col items-center justify-center text-xs font-black',
          q.nb_fois >= 5 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'       :
          q.nb_fois >= 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                           'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
        )}>
          <span className="text-lg leading-none">{q.nb_fois}</span>
          <span className="text-[8px] leading-none opacity-70">fois</span>
        </div>

        {/* Contenu */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <LangBadge lang={q.langue} />
            <StatutBadge statut={localStatut} />
            {q.nb_fois >= 5 && (
              <span className="text-[10px] font-black text-red-500 flex items-center gap-1">
                <TrendingUp size={10} /> Très demandée
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">{q.question}</p>
          <p className="text-[10px] text-slate-400 mt-1">
            1ère fois : {q.premiere_vue} · Dernière : {q.derniere_vue}
          </p>
        </div>

        {/* Actions rapides */}
        <div className="flex items-center gap-1 shrink-0">
          {localStatut !== 'non_traitee' && (
            <button onClick={handleReouvrir} disabled={loading}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
              title="Rouvrir">
              <RotateCcw size={14} />
            </button>
          )}
          <button onClick={() => onSupprimer(q.id)} disabled={loading}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
            title="Supprimer">
            <Trash2 size={14} />
          </button>
          <button onClick={() => setOpen(!open)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
            title={open ? 'Replier' : 'Répondre'}>
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Accordéon réponse */}
      {open && (
        <div className="border-t border-slate-100 dark:border-slate-800 p-4 space-y-3 bg-slate-50/50 dark:bg-slate-800/30 animate-in slide-in-from-top-2 duration-200">
          {q.reponse_admin && (
            <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30">
              <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest mb-1">Réponse actuelle</p>
              <p className="text-sm text-slate-700 dark:text-slate-200">{q.reponse_admin}</p>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              {q.reponse_admin ? 'Modifier la réponse' : 'Rédiger la réponse'}
            </label>
            <textarea
              value={reponse}
              onChange={e => setReponse(e.target.value)}
              rows={4}
              placeholder="Rédige ici la réponse précise que SAMI devra donner à cette question..."
              className="w-full px-3 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#006666] dark:focus:border-emerald-500 transition-colors text-slate-800 dark:text-slate-100 resize-none"
            />
            <p className="text-[10px] text-slate-400 mt-1">{reponse.length} caractères · minimum 10</p>
          </div>

          {/* Toggle RAG */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setInjectRag(!injectRag)}>
            <div className={cn(
              'w-10 h-6 rounded-full transition-all duration-300 relative shrink-0',
              injectRag ? 'bg-[#006666]' : 'bg-slate-200 dark:bg-slate-700'
            )}>
              <div className={cn(
                'absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm',
                injectRag ? 'left-5' : 'left-1'
              )} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Injecter dans la base RAG</p>
              <p className="text-[10px] text-slate-400">SAMI utilisera cette réponse immédiatement après sauvegarde</p>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            {localStatut === 'non_traitee' && (
              <button onClick={handleIgnorer} disabled={loading}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all disabled:opacity-50">
                <XCircle size={14} /> Ignorer
              </button>
            )}
            <button onClick={handleRepondre} disabled={loading || reponse.trim().length < 10}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-black text-white bg-[#006666] rounded-xl hover:bg-[#004d4d] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-1 justify-center">
              {loading
                ? <><Loader2 size={14} className="animate-spin" /> Sauvegarde…</>
                : <><Send size={14} /> {injectRag ? 'Sauvegarder & Injecter RAG' : 'Sauvegarder'}</>
              }
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// PAGE PRINCIPALE
// ═══════════════════════════════════════════════════════════════
export default function AdminFAQPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [stats,     setStats]     = useState<Stats | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [statut,    setStatut]    = useState<string>('');
  const [search,    setSearch]    = useState('');
  const [toastMsg,  setToastMsg]  = useState<string | null>(null);

  const toast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const charger = useCallback(async () => {
    setLoading(true);
    try {
      const h = getHeaders();
      const params = statut ? `?statut=${statut}` : '';
      const [qRes, sRes] = await Promise.all([
        fetch(`${API}/api/admin/faq${params}`, { credentials: 'include', headers: h }),
        fetch(`${API}/api/admin/faq/stats`,    { credentials: 'include', headers: h }),
      ]);
      const qData = await qRes.json();
      const sData = await sRes.json();
      setQuestions(qData.questions || []);
      setStats(sData);
    } catch (e) {
      console.error('[FAQ]', e);
    } finally {
      setLoading(false);
    }
  }, [statut]);

  useEffect(() => { charger(); }, [charger]);

  const handleRepondre = async (id: string, rep: string, injectRag: boolean) => {
    try {
      const h = getHeaders();
      const res = await fetch(`${API}/api/admin/faq/${id}/reponse`, {
        method:      'POST',
        credentials: 'include',
        headers:     { 'Content-Type': 'application/json', ...h },
        body:        JSON.stringify({ reponse: rep, injecter_rag: injectRag }),
      });
      const data = await res.json();
      if (data.success) toast(injectRag ? '✅ Réponse sauvegardée et injectée dans la RAG !' : '✅ Réponse sauvegardée.');
      else              toast('❌ Erreur : ' + (data.error || 'inconnue'));
    } catch { toast('❌ Erreur de connexion.'); }
  };

  const handleIgnorer = async (id: string) => {
    try {
      await fetch(`${API}/api/admin/faq/${id}/ignorer`, {
        method: 'PATCH', credentials: 'include', headers: getHeaders(),
      });
      toast('Question ignorée.');
    } catch { toast('❌ Erreur.'); }
  };

  const handleSupprimer = async (id: string) => {
    if (!confirm('Supprimer définitivement cette question ?')) return;
    try {
      await fetch(`${API}/api/admin/faq/${id}`, {
        method: 'DELETE', credentials: 'include', headers: getHeaders(),
      });
      setQuestions(prev => prev.filter(q => q.id !== id));
      toast('Question supprimée.');
    } catch { toast('❌ Erreur.'); }
  };

  const handleReouvrir = async (id: string) => {
    try {
      await fetch(`${API}/api/admin/faq/${id}/reouvrir`, {
        method: 'PATCH', credentials: 'include', headers: getHeaders(),
      });
      toast('Question rouverte.');
    } catch { toast('❌ Erreur.'); }
  };

  const handleExport = () => { window.open(`${API}/api/admin/faq/export`, '_blank'); };

  const filtered    = questions.filter(q => !search || q.question.toLowerCase().includes(search.toLowerCase()));
  const nonTraitees = filtered.filter(q => q.statut === 'non_traitee');
  const traitees    = filtered.filter(q => q.statut === 'reponse_ajoutee');
  const ignorees    = filtered.filter(q => q.statut === 'ignoree');

  return (
    <div className="space-y-6 relative">

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-2xl text-sm font-bold animate-in slide-in-from-bottom-4 duration-300">
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle size={22} className="text-orange-500" />
            Questions sans réponse
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Questions pour lesquelles SAMI a répondu &quot;Je n&apos;ai pas cette information&quot;.
            Rédige la réponse → elle sera injectée dans la base RAG immédiatement.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm font-bold">
            <Download size={15} /> Exporter CSV
          </button>
          <button onClick={charger} disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#006666] text-white hover:bg-[#004d4d] disabled:opacity-60 transition-all text-sm font-bold">
            {loading ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
            Actualiser
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total loggées',     value: stats.total,        color: 'text-slate-700 dark:text-slate-200', bg: 'bg-slate-100 dark:bg-slate-800'   },
            { label: 'Non traitées',      value: stats.non_traitees, color: 'text-red-700 dark:text-red-400',     bg: 'bg-red-50 dark:bg-red-900/20'     },
            { label: 'Réponses ajoutées', value: stats.traitees,     color: 'text-green-700 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
            {
              label: 'Taux traitement',
              value: stats.total > 0 ? `${Math.round((stats.traitees / stats.total) * 100)}%` : '0%',
              color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20',
            },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={cn('p-4 rounded-2xl border border-slate-100 dark:border-slate-800', bg)}>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{label}</p>
              <p className={cn('text-3xl font-black', color)}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Top 5 */}
      {stats?.top5_questions && stats.top5_questions.length > 0 && (
        <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800/30 rounded-2xl p-4">
          <p className="text-xs font-black text-orange-700 dark:text-orange-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <TrendingUp size={12} /> Top questions les plus posées
          </p>
          <div className="space-y-2">
            {stats.top5_questions.map((q, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-black text-orange-500 w-4">{i + 1}.</span>
                <p className="flex-1 text-sm text-slate-700 dark:text-slate-200 truncate">{q.question}</p>
                <span className="shrink-0 text-xs font-black text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 rounded-full">
                  ×{q.nb_fois}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher dans les questions…"
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#006666] transition-colors text-slate-800 dark:text-slate-100"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            { val: '',                label: 'Tous'         },
            { val: 'non_traitee',     label: 'Non traitées' },
            { val: 'reponse_ajoutee', label: 'Traitées'     },
            { val: 'ignoree',         label: 'Ignorées'     },
          ].map(({ val, label }) => (
            <button key={val} onClick={() => setStatut(val)}
              className={cn(
                'px-3 py-2 text-xs font-bold rounded-xl border transition-all whitespace-nowrap',
                statut === val
                  ? 'bg-[#006666] text-white border-[#006666]'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              )}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16 gap-3 text-slate-400">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm">Chargement des questions…</span>
        </div>
      )}

      {/* Vide */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
            <CheckCircle2 size={32} className="text-green-500" />
          </div>
          <p className="font-bold text-slate-700 dark:text-slate-200">Tout est traité !</p>
          <p className="text-sm text-slate-500">
            {search ? `Aucune question correspondant à "${search}"` : 'Aucune question sans réponse pour ce filtre.'}
          </p>
        </div>
      )}

      {/* Liste */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-6">
          {(!statut || statut === 'non_traitee') && nonTraitees.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <h2 className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">
                  Non traitées ({nonTraitees.length})
                </h2>
              </div>
              {nonTraitees.map(q => (
                <QuestionCard key={q.id} q={q}
                  onRepondre={handleRepondre} onIgnorer={handleIgnorer}
                  onSupprimer={handleSupprimer} onReouvrir={handleReouvrir} />
              ))}
            </div>
          )}

          {(!statut || statut === 'reponse_ajoutee') && traitees.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <h2 className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">
                  Réponses ajoutées ({traitees.length})
                </h2>
              </div>
              {traitees.map(q => (
                <QuestionCard key={q.id} q={q}
                  onRepondre={handleRepondre} onIgnorer={handleIgnorer}
                  onSupprimer={handleSupprimer} onReouvrir={handleReouvrir} />
              ))}
            </div>
          )}

          {(!statut || statut === 'ignoree') && ignorees.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-400" />
                <h2 className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">
                  Ignorées ({ignorees.length})
                </h2>
              </div>
              {ignorees.map(q => (
                <QuestionCard key={q.id} q={q}
                  onRepondre={handleRepondre} onIgnorer={handleIgnorer}
                  onSupprimer={handleSupprimer} onReouvrir={handleReouvrir} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}