// src/app/admin/conversations/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { MessageSquare, Search, X, Loader2, Bot, User, SmilePlus, Meh, Frown } from 'lucide-react';
import { cn } from '@/lib/utils';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
function getUid() { try { return JSON.parse(localStorage.getItem('supmti-auth')||'{}')?.state?.user?.id||''; } catch { return ''; } }

interface Conv { id:string; titre?:string; started_at?:string; nb_messages?:number; student_name?:string; }
interface Msg  { role:string; content:string; }

// ── Analyse de sentiment basée sur mots-clés ─────────────────
const POSITIVE_WORDS = ['merci','super','excellent','parfait','génial','content','heureux','bien','top','bravo','sympa','utile','clair','comprends','intéressant','motivé','décidé','choisi'];
const NEGATIVE_WORDS = ['problème','difficile','confus','perdu','inquiet','stressé','hésit','sais pas','pas sûr','compliqué','peur','angoiss','déçu','nul','mauvais','impossible','jamais'];
const NEUTRAL_WORDS  = ['information','question','comment','quoi','quand','filière','étude','bac','moyenne'];

function analyzeSentiment(messages: Msg[]): { label:string; color:string; bg:string; icon:any; score:number } {
  const text = messages.filter(m=>m.role==='user').map(m=>m.content.toLowerCase()).join(' ');
  let pos = 0, neg = 0;
  POSITIVE_WORDS.forEach(w => { if (text.includes(w)) pos++; });
  NEGATIVE_WORDS.forEach(w => { if (text.includes(w)) neg++; });

  if (pos === 0 && neg === 0) return { label:'Neutre',   color:'text-slate-400',   bg:'bg-gray-200 dark:bg-slate-700',        icon:Meh,      score:0   };
  if (pos > neg)              return { label:'Positif',  color:'text-emerald-400', bg:'bg-emerald-500/10',   icon:SmilePlus, score:pos };
  if (neg > pos)              return { label:'Négatif',  color:'text-red-400',     bg:'bg-red-500/10',       icon:Frown,    score:-neg };
  return                             { label:'Mitigé',   color:'text-yellow-400',  bg:'bg-yellow-500/10',    icon:Meh,      score:0   };
}

// Sentiment d'une conversation (titre uniquement, sans messages chargés)
function quickSentiment(titre: string): { label:string; color:string; bg:string } {
  const t = (titre||'').toLowerCase();
  const pos = POSITIVE_WORDS.filter(w=>t.includes(w)).length;
  const neg = NEGATIVE_WORDS.filter(w=>t.includes(w)).length;
  if (pos > neg) return { label:'Positif', color:'text-emerald-400', bg:'bg-emerald-500/10' };
  if (neg > pos) return { label:'Négatif', color:'text-red-400',     bg:'bg-red-500/10'     };
  return              { label:'Neutre',  color:'text-slate-400',   bg:'bg-gray-200 dark:bg-slate-700'      };
}

export default function AdminConversations() {
  const [convs,       setConvs]       = useState<Conv[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState('');
  const [filterSent,  setFilterSent]  = useState('');
  const [selected,    setSelected]    = useState<Conv|null>(null);
  const [messages,    setMessages]    = useState<Msg[]>([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  useEffect(() => {
    const uid = getUid();
    fetch(`${API}/api/admin/conversations`, { credentials:'include', headers:uid?{'X-User-Id':uid}:{} })
      .then(r=>r.json())
      .then(d=>setConvs(d.conversations||d||[]))
      .catch(()=>setConvs([
        { id:'c1', titre:'Comment calculer mon FitScore ?',  started_at:'2026-03-14', nb_messages:6,  student_name:'Yassine M.' },
        { id:'c2', titre:'Je suis stressé pour l\'admission',started_at:'2026-03-13', nb_messages:12, student_name:'Sarah B.'   },
        { id:'c3', titre:'Filières disponibles SUPMTI',      started_at:'2026-03-12', nb_messages:4,  student_name:'Omar I.'    },
        { id:'c4', titre:'Merci SAMI tu m\'as bien orienté', started_at:'2026-03-11', nb_messages:8,  student_name:'Laila R.'   },
      ]))
      .finally(()=>setLoading(false));
  }, []);

  const openConv = async (conv: Conv) => {
    setSelected(conv); setLoadingMsgs(true);
    try {
      const uid = getUid();
      const res = await fetch(`${API}/api/historique/${conv.id}`, { credentials:'include', headers:uid?{'X-User-Id':uid}:{} });
      const data= await res.json();
      setMessages(data.messages||[
        { role:'user',      content:'Bonjour, j\'aimerais savoir quelle filière me correspond.' },
        { role:'assistant', content:'Bonjour ! Je suis SAMI. Pour vous orienter, j\'ai besoin de votre BAC et moyenne.' },
        { role:'user',      content:'J\'ai un BAC SM avec 15.5/20.' },
        { role:'assistant', content:'Excellent ! Avec BAC SM et 15.5/20, vous êtes éligible à toutes nos filières.' },
      ]);
    } finally { setLoadingMsgs(false); }
  };

  // Filtrage avec sentiment
  const filtered = convs.filter(c => {
    const matchSearch = !search ||
      (c.titre||'').toLowerCase().includes(search.toLowerCase()) ||
      (c.student_name||'').toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (!filterSent) return true;
    const sent = quickSentiment(c.titre||'');
    return sent.label.toLowerCase() === filterSent.toLowerCase();
  });

  // Calcul sentiments pour les compteurs
  const sentimentCounts = {
    positif: convs.filter(c=>quickSentiment(c.titre||'').label==='Positif').length,
    neutre:  convs.filter(c=>quickSentiment(c.titre||'').label==='Neutre').length,
    negatif: convs.filter(c=>quickSentiment(c.titre||'').label==='Négatif').length,
  };

  const sentiment = messages.length > 0 ? analyzeSentiment(messages) : null;
  const SentIcon  = sentiment?.icon;

  return (
    <div className="p-8 h-full bg-gray-50 dark:bg-slate-900">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-6 bg-emerald-500 rounded-full" />
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Conversations</h1>
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">{convs.length}</span>
      </div>

      {/* Filtres sentiment */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { val:'',         label:'Toutes',   color:'text-slate-300',   bg:'bg-slate-800',       count:convs.length            },
          { val:'Positif',  label:'😊 Positif',color:'text-emerald-400', bg:'bg-emerald-500/10', count:sentimentCounts.positif },
          { val:'Neutre',   label:'😐 Neutre', color:'text-slate-400',   bg:'bg-gray-200 dark:bg-slate-700',       count:sentimentCounts.neutre  },
          { val:'Négatif',  label:'😟 Négatif',color:'text-red-400',     bg:'bg-red-500/10',      count:sentimentCounts.negatif },
        ].map(({ val, label, color, bg, count }) => (
          <button key={val} onClick={() => setFilterSent(val)}
            className={cn(`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all`, bg,
              filterSent===val ? 'border-white/20 scale-105' : 'border-slate-700 hover:opacity-80')}>
            <span className={`font-black mr-1 ${color}`}>{count}</span>
            <span className="text-gray-400 dark:text-slate-400">{label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-280px)]">

        {/* Liste */}
        <div className="flex flex-col">
          <div className="relative mb-3">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher…"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-slate-500 outline-none focus:border-[#006666] transition-all" />
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-48 gap-3 text-gray-400 dark:text-slate-400">
              <Loader2 size={20} className="animate-spin" />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filtered.map(conv => {
                const sent = quickSentiment(conv.titre||'');
                return (
                  <button key={conv.id} onClick={() => openConv(conv)}
                    className={cn("w-full text-left p-4 rounded-2xl border transition-all hover:border-[#006666]/40",
                      selected?.id===conv.id ? "bg-[#006666]/10 border-[#006666]/40" : "bg-white dark:bg-slate-800/50 border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800")}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1 flex-1">{conv.titre||'Conversation'}</p>
                      <span className={cn("text-[9px] px-2 py-0.5 rounded-full font-black border shrink-0", sent.bg, sent.color, "border-current/20")}>
                        {sent.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      {conv.student_name && <span className="text-xs text-gray-500 dark:text-gray-400 dark:text-slate-400">{conv.student_name}</span>}
                      <span className="text-[10px] text-gray-400 dark:text-slate-500">{conv.started_at?.slice(0,10)}</span>
                      {conv.nb_messages && <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 text-[10px]">{conv.nb_messages} msg</span>}
                    </div>
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <MessageSquare size={24} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Aucune conversation trouvée</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Détail conversation */}
        <div className="flex flex-col rounded-2xl bg-white dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 overflow-hidden">
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-3">
              <MessageSquare size={32} className="opacity-30" />
              <p className="text-sm text-gray-400 dark:text-slate-500">Sélectionne une conversation</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-700">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1">{selected.titre||'Conversation'}</p>
                  {selected.student_name && <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-slate-400">{selected.student_name}</p>}
                </div>
                {/* Badge sentiment de la conversation */}
                {sentiment && SentIcon && (
                  <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black mr-3", sentiment.bg, sentiment.color, "border-current/20")}>
                    <SentIcon size={13} />
                    {sentiment.label}
                  </div>
                )}
                <button onClick={() => { setSelected(null); setMessages([]); }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all">
                  <X size={16} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loadingMsgs ? (
                  <div className="flex items-center justify-center h-full gap-2 text-gray-400 dark:text-slate-400">
                    <Loader2 size={18} className="animate-spin" />
                  </div>
                ) : messages.map((msg, i) => (
                  <div key={i} className={cn("flex gap-2.5", msg.role==='user'?"justify-end":"justify-start")}>
                    {msg.role!=='user' && (
                      <div className="w-7 h-7 rounded-lg bg-[#006666]/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot size={12} className="text-[#006666]" />
                      </div>
                    )}
                    <div className={cn("max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                      msg.role==='user'
                        ? "bg-[#006666] text-white rounded-tr-sm"
                        : "bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-200 rounded-tl-sm")}>
                      {msg.content}
                    </div>
                    {msg.role==='user' && (
                      <div className="w-7 h-7 rounded-lg bg-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                        <User size={12} className="text-slate-300" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}