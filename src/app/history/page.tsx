// // src/app/history/page.tsx
// 'use client';
// import { useEffect, useState } from 'react';
// import { History as HistoryIcon, MessageSquare, ArrowRight, Trash2, Loader2, RefreshCw } from 'lucide-react';
// import Link from 'next/link';
// import { useSessionStore } from '@/store/sessionStore';
// import type { HistoriqueChat } from '@/types/student';

// function detectCategory(titre: string): string {
//   const t = titre.toLowerCase();
//   if (t.includes('fitscore') || t.includes('score'))                          return 'FitScore';
//   if (t.includes('carrière') || t.includes('carrieres') || t.includes('métier')) return 'Carrière';
//   if (t.includes('admission') || t.includes('inscription'))                   return 'Admission';
//   if (t.includes('psycho') || t.includes('test'))                             return 'Psycho';
//   return 'Orientation';
// }

// const CATEGORY_COLORS: Record<string, string> = {
//   FitScore:    'bg-orange-100 text-orange-600',
//   Carrière:    'bg-purple-100 text-purple-600',
//   Admission:   'bg-blue-100   text-blue-600',
//   Psycho:      'bg-pink-100   text-pink-600',
//   Orientation: 'bg-gray-100   text-gray-500',
// };

// export default function HistoryPage() {
//   const { historique_chats, loadSession, deleteChat } = useSessionStore();
//   const [loading,    setLoading]    = useState(true);
//   const [deletingId, setDeletingId] = useState<string | null>(null);

//   const refresh = async () => {
//     setLoading(true);
//     await loadSession();
//     setLoading(false);
//   };

//   useEffect(() => {
//     refresh();
//   }, []); // eslint-disable-line

//   const handleDelete = async (e: React.MouseEvent, id: string) => {
//     e.preventDefault();
//     setDeletingId(id);
//     await deleteChat(id);
//     // Recharger après suppression pour avoir la liste à jour depuis la DB
//     await loadSession();
//     setDeletingId(null);
//   };

//   const handleReprendre = (id: string) => {
//     window.dispatchEvent(new CustomEvent('sami:load-chat', { detail: id }));
//   };

//   if (loading) return (
//     <div className="flex items-center justify-center h-64 gap-3 text-gray-400">
//       <Loader2 size={20} className="animate-spin" />
//       <span className="text-sm">Chargement de l&apos;historique…</span>
//     </div>
//   );

//   // Les conversations sont déjà triées par date DESC depuis le backend
//   // Ne pas faire .reverse() car le backend renvoie déjà du plus récent au plus ancien
//   const chats = historique_chats;

//   return (
//     <div className="max-w-5xl mx-auto space-y-6">

//       {/* ── Header ── */}
//       <div className="flex items-center justify-between border-b pb-4">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-blue-100 text-supmti-blue rounded-lg">
//             <HistoryIcon size={24} />
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Mémoire de l&apos;Assistant</h1>
//             <p className="text-sm text-gray-500">
//               {chats.length > 0
//                 ? `${chats.length} conversation${chats.length > 1 ? 's' : ''} enregistrée${chats.length > 1 ? 's' : ''}`
//                 : 'Aucune conversation pour le moment'}
//             </p>
//           </div>
//         </div>
//         {/* Bouton refresh manuel */}
//         <button
//           onClick={refresh}
//           className="p-2 text-gray-400 hover:text-supmti-blue transition-colors rounded-lg hover:bg-gray-50"
//           title="Actualiser"
//         >
//           <RefreshCw size={18} />
//         </button>
//       </div>

//       {/* ── Vide ── */}
//       {chats.length === 0 && (
//         <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
//           <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-3xl">💬</div>
//           <p className="text-gray-500 text-sm">Tes conversations avec Sami apparaîtront ici.</p>
//           <p className="text-gray-400 text-xs max-w-sm">
//             Les conversations sont sauvegardées automatiquement quand tu cliques sur &quot;Nouveau chat&quot; dans la sidebar.
//           </p>
//           <Link href="/chatbot"
//             className="mt-2 px-5 py-2.5 bg-supmti-blue text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all">
//             Démarrer une conversation
//           </Link>
//         </div>
//       )}

//       {/* ── Liste ── */}
//       <div className="grid gap-4">
//         {chats.map((chat: HistoriqueChat) => {
//           const category   = detectCategory(chat.titre);
//           const colorClass = CATEGORY_COLORS[category];
//           const isDeleting = deletingId === chat.id;

//           return (
//             <div
//               key={chat.id}
//               className={`group bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 rounded-2xl hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all flex items-center justify-between ${
//                 chat.en_cours ? 'border-l-4 border-l-supmti-blue' : ''
//               } ${isDeleting ? 'opacity-40 pointer-events-none' : ''}`}
//             >
//               <div className="flex items-center gap-4 min-w-0">
//                 <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-full text-gray-400 group-hover:text-supmti-blue transition-colors shrink-0">
//                   <MessageSquare size={20} />
//                 </div>
//                 <div className="min-w-0">
//                   <div className="flex items-center gap-2 flex-wrap">
//                     <h3 className="font-semibold text-gray-800 dark:text-white truncate max-w-xs">
//                       {chat.titre}
//                     </h3>
//                     <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold shrink-0 ${colorClass}`}>
//                       {category}
//                     </span>
//                     {chat.en_cours && (
//                       <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-600 rounded-full font-bold shrink-0">
//                         En cours
//                       </span>
//                     )}
//                   </div>
//                   <p className="text-[11px] text-gray-400 mt-1">
//                     {chat.date} · {chat.nb_messages} message{chat.nb_messages > 1 ? 's' : ''}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex gap-2 shrink-0 ml-4">
//                 {!chat.en_cours && (
//                   <button
//                     onClick={(e) => handleDelete(e, chat.id)}
//                     className="p-2 text-gray-300 hover:text-red-500 transition-colors"
//                     title="Supprimer"
//                   >
//                     {isDeleting
//                       ? <Loader2 size={18} className="animate-spin" />
//                       : <Trash2 size={18} />
//                     }
//                   </button>
//                 )}
//                 <Link
//                   href="/chatbot"
//                   onClick={() => handleReprendre(chat.id)}
//                   className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800 text-supmti-blue px-4 py-2 rounded-xl font-medium group-hover:bg-supmti-blue group-hover:text-white transition-all text-sm"
//                 >
//                   Reprendre <ArrowRight size={16} />
//                 </Link>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }


'use client';
import { useEffect, useState } from 'react';
import { History as HistoryIcon, MessageSquare, ArrowRight, Trash2, Loader2, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useSessionStore } from '@/store/sessionStore';
import { useLang } from '@/i18n/LanguageContext'; // 1. Import du hook
import type { HistoriqueChat } from '@/types/student';

function detectCategory(titre: string): string {
  const t = titre.toLowerCase();
  if (t.includes('fitscore') || t.includes('score')) return 'FitScore';
  if (t.includes('carrière') || t.includes('carrieres') || t.includes('métier')) return 'Carrière';
  if (t.includes('admission') || t.includes('inscription')) return 'Admission';
  if (t.includes('psycho') || t.includes('test')) return 'Psycho';
  return 'Orientation';
}

const CATEGORY_COLORS: Record<string, string> = {
  FitScore:    'bg-orange-100 text-orange-600',
  Carrière:    'bg-purple-100 text-purple-600',
  Admission:   'bg-blue-100   text-blue-600',
  Psycho:      'bg-pink-100   text-pink-600',
  Orientation: 'bg-gray-100   text-gray-500',
};

export default function HistoryPage() {
  const { historique_chats, loadSession, deleteChat } = useSessionStore();
  const { t, isRTL } = useLang(); // 2. Utilisation du hook
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    await loadSession();
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setDeletingId(id);
    await deleteChat(id);
    await loadSession();
    setDeletingId(null);
  };

  const handleReprendre = (id: string) => {
    window.dispatchEvent(new CustomEvent('sami:load-chat', { detail: id }));
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 gap-3 text-gray-400">
      <Loader2 size={20} className="animate-spin" />
      <span className="text-sm">{t('history', 'loading')}</span>
    </div>
  );

  const chats = historique_chats;

  return (
    <div className="max-w-5xl mx-auto space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-supmti-blue rounded-lg">
            <HistoryIcon size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {t('history', 'title')}
            </h1>
            <p className="text-sm text-gray-500">
              {chats.length > 0
                ? `${chats.length} ${t('history', 'subtitle_count')}`
                : t('history', 'subtitle_empty')}
            </p>
          </div>
        </div>
        <button
          onClick={refresh}
          className="p-2 text-gray-400 hover:text-supmti-blue transition-colors rounded-lg hover:bg-gray-50"
          title={t('history', 'refresh')}
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* ── Vide ── */}
      {chats.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-3xl">💬</div>
          <p className="text-gray-500 text-sm">{t('history', 'empty_msg')}</p>
          <p className="text-gray-400 text-xs max-w-sm">
            {t('history', 'empty_hint')}
          </p>
          <Link href="/chatbot"
            className="mt-2 px-5 py-2.5 bg-supmti-blue text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all">
            {t('history', 'start_chat')}
          </Link>
        </div>
      )}

      {/* ── Liste ── */}
      <div className="grid gap-4">
        {chats.map((chat: HistoriqueChat) => {
          const category = detectCategory(chat.titre);
          const colorClass = CATEGORY_COLORS[category];
          const isDeleting = deletingId === chat.id;

          return (
            <div
              key={chat.id}
              className={`group bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 rounded-2xl hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all flex items-center justify-between ${
                chat.en_cours ? 'border-l-4 border-l-supmti-blue' : ''
              } ${isDeleting ? 'opacity-40 pointer-events-none' : ''}`}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-full text-gray-400 group-hover:text-supmti-blue transition-colors shrink-0">
                  <MessageSquare size={20} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-800 dark:text-white truncate max-w-xs">
                      {chat.titre}
                    </h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold shrink-0 ${colorClass}`}>
                       {/* Note: La catégorie vient du backend, on peut aussi la mapper si besoin */}
                      {category}
                    </span>
                    {chat.en_cours && (
                      <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-600 rounded-full font-bold shrink-0">
                        {t('history', 'in_progress')}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    {chat.date} · {chat.nb_messages} message{chat.nb_messages > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className={`flex gap-2 shrink-0 ${isRTL ? 'mr-4' : 'ml-4'}`}>
                {!chat.en_cours && (
                  <button
                    onClick={(e) => handleDelete(e, chat.id)}
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                    title={t('history', 'delete')}
                  >
                    {isDeleting
                      ? <Loader2 size={18} className="animate-spin" />
                      : <Trash2 size={18} />
                    }
                  </button>
                )}
                <Link
                  href="/chatbot"
                  onClick={() => handleReprendre(chat.id)}
                  className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800 text-supmti-blue px-4 py-2 rounded-xl font-medium group-hover:bg-supmti-blue group-hover:text-white transition-all text-sm"
                >
                  {t('history', 'resume')} 
                  <ArrowRight size={16} className={isRTL ? 'rotate-180' : ''} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}