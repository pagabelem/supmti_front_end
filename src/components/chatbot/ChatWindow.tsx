// // src/components/chatbot/ChatWindow.tsx
// 'use client';
// import { useChatStore }    from '@/store/chatStore';
// import { useSessionStore } from '@/store/sessionStore';
// import { MessageBubble }   from './MessageBubble';
// import { useEffect, useRef } from 'react';
// import { v4 as uuidv4 }   from 'uuid';
// import { Message }         from '@/types/message';

// const SUGGESTIONS = [
//   { icon: '📚', title: 'Les filières',    desc: 'Découvre toutes les formations disponibles',   msg: 'Parle-moi des filières de SUPMTI' },
//   { icon: '💰', title: 'Frais & Bourses', desc: "Tarifs et bourses d'excellence",               msg: 'Quels sont les frais de scolarité et les bourses ?' },
//   { icon: '🎯', title: 'Admission',       desc: "Conditions et procédure d'inscription",        msg: "Comment se passe l'admission à SUPMTI ?" },
//   { icon: '📊', title: 'Mon FitScore',    desc: 'Calcule ta compatibilité avec chaque filière', msg: 'Comment calculer mon FitScore SUPMTI ?' },
//   { icon: '🚀', title: 'Ma Carrière',     desc: 'Simule ton avenir professionnel',              msg: 'Simule ma carrière après SUPMTI' },
//   { icon: '🧠', title: 'Test Psycho',     desc: 'Découvre ton profil académique',               msg: 'Je veux faire le test psychométrique' },
// ];

// export const ChatWindow = () => {
//   const { messages, isTyping, addMessage, clearChat, loadConversation } = useChatStore();
//   const { loadSession, loadChat }                                        = useSessionStore();
//   const scrollRef = useRef<HTMLDivElement>(null);

//   /* ── Scroll automatique ── */
//   useEffect(() => {
//     scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
//   }, [messages, isTyping]);

//   /* ── Charge la session au démarrage (avec X-User-Id via sessionStore) ── */
//   useEffect(() => {
//     loadSession();
//   }, []); // eslint-disable-line

//   /* ── Charger une conversation passée depuis la Sidebar ── */
//   useEffect(() => {
//     const handler = async (e: Event) => {
//       const chatId = (e as CustomEvent<string>).detail;
//       if (!chatId) return;
//       try {
//         const msgs = await loadChat(chatId);
//         if (msgs.length === 0) return;
//         const converted: Message[] = msgs.map((m) => ({
//           id:         uuidv4(),
//           content:    m.content,
//           // Le backend stocke 'user' ou 'assistant' dans sender
//           sender:     m.role === 'user' ? 'user' : 'ai',
//           created_at: new Date().toISOString(),
//         }));
//         loadConversation(chatId, converted);
//       } catch (err) {
//         console.error('Erreur chargement chat:', err);
//       }
//     };
//     window.addEventListener('sami:load-chat', handler);
//     return () => window.removeEventListener('sami:load-chat', handler);
//   }, [loadChat, loadConversation]);

//   /* ── Nouveau chat → vider les messages ── */
//   useEffect(() => {
//     const handler = () => clearChat();
//     window.addEventListener('sami:new-chat', handler);
//     return () => window.removeEventListener('sami:new-chat', handler);
//   }, [clearChat]);

//   return (
//     <div
//       ref={scrollRef}
//       className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-900 pb-36"
//     >
//       {/* ── Écran d'accueil ── */}
//       {messages.length === 0 && (
//         <div className="flex flex-col items-center text-center px-4 pt-10 pb-6 animate-in fade-in duration-500">
//           <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-[24px] flex items-center justify-center text-4xl mb-5 shadow-2xl shadow-orange-500/30">
//             🎓
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
//             Bonjour, je suis <span className="text-orange-500">Sami</span> !
//           </h1>
//           <p className="text-sm text-gray-500 dark:text-slate-400 max-w-md leading-relaxed mb-8">
//             Ton conseiller académique personnel de SUPMTI Meknès. Parle-moi de ton profil,
//             pose tes questions ou utilise les fonctionnalités dans le menu à gauche.
//           </p>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl">
//             {SUGGESTIONS.map(({ icon, title, desc, msg }) => (
//               <button
//                 key={title}
//                 onClick={() => window.dispatchEvent(new CustomEvent('sami:suggestion', { detail: msg }))}
//                 className="group flex flex-col items-start gap-2 p-4 rounded-2xl text-left
//                   bg-white dark:bg-slate-800
//                   border border-gray-100 dark:border-slate-700
//                   hover:border-orange-300 dark:hover:border-orange-500/40
//                   hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/10
//                   transition-all duration-200"
//               >
//                 <span className="text-2xl">{icon}</span>
//                 <div>
//                   <p className="text-sm font-bold text-gray-800 dark:text-slate-100 mb-0.5">{title}</p>
//                   <p className="text-[12px] text-gray-400 dark:text-slate-500 leading-snug">{desc}</p>
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* ── Messages ── */}
//       {messages.map((msg) => (
//         <MessageBubble key={msg.id} message={msg} />
//       ))}

//       {/* ── Typing indicator ── */}
//       {isTyping && (
//         <div className="flex gap-3 items-center px-1">
//           <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-xs flex-shrink-0">
//             S
//           </div>
//           <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
//             <div className="flex gap-1 items-center">
//               {[0, 1, 2].map((i) => (
//                 <span
//                   key={i}
//                   className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-slate-500 animate-bounce"
//                   style={{ animationDelay: `${i * 0.18}s` }}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };




// src/components/chatbot/ChatWindow.tsx
'use client';
import { useChatStore }    from '@/store/chatStore';
import { useSessionStore } from '@/store/sessionStore';
import { MessageBubble }   from './MessageBubble';
import { useEffect, useRef } from 'react';
import { v4 as uuidv4 }   from 'uuid';
import { Message }         from '@/types/message';

const SUGGESTIONS = [
  { icon: '📚', title: 'Les filières',    desc: 'Découvre toutes les formations disponibles',   msg: 'Parle-moi des filières de SUPMTI' },
  { icon: '💰', title: 'Frais & Bourses', desc: "Tarifs et bourses d'excellence",               msg: 'Quels sont les frais de scolarité et les bourses ?' },
  { icon: '🎯', title: 'Admission',       desc: "Conditions et procédure d'inscription",        msg: "Comment se passe l'admission à SUPMTI ?" },
  { icon: '📊', title: 'Mon FitScore',    desc: 'Calcule ta compatibilité avec chaque filière', msg: 'Comment calculer mon FitScore SUPMTI ?' },
  { icon: '🚀', title: 'Ma Carrière',     desc: 'Simule ton avenir professionnel',              msg: 'Simule ma carrière après SUPMTI' },
  { icon: '🧠', title: 'Test Psycho',     desc: 'Découvre ton profil académique',               msg: 'Je veux faire le test psychométrique' },
];

export const ChatWindow = () => {
  const { messages, isTyping, clearChat, loadConversation } = useChatStore();
  const { loadSession, loadChat }                           = useSessionStore();
  const scrollRef    = useRef<HTMLDivElement>(null);
  const bottomRef    = useRef<HTMLDivElement>(null);

  /* ── Scroll automatique au dernier message ── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  /* ── Charge la session au démarrage ── */
  useEffect(() => {
    loadSession();
  }, []); // eslint-disable-line

  /* ── Charger une conversation passée depuis la Sidebar ── */
  useEffect(() => {
    const handler = async (e: Event) => {
      const chatId = (e as CustomEvent<string>).detail;
      if (!chatId) return;
      try {
        const msgs = await loadChat(chatId);
        if (msgs.length === 0) return;
        const converted: Message[] = msgs.map((m) => ({
          id:         uuidv4(),
          content:    m.content,
          sender:     m.role === 'user' ? 'user' : 'ai',
          created_at: new Date().toISOString(),
        }));
        loadConversation(chatId, converted);
      } catch (err) {
        console.error('Erreur chargement chat:', err);
      }
    };
    window.addEventListener('sami:load-chat', handler);
    return () => window.removeEventListener('sami:load-chat', handler);
  }, [loadChat, loadConversation]);

  /* ── Nouveau chat ── */
  useEffect(() => {
    const handler = () => clearChat();
    window.addEventListener('sami:new-chat', handler);
    return () => window.removeEventListener('sami:new-chat', handler);
  }, [clearChat]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-900 pb-36"
    >
      {/* ── Écran d'accueil ── */}
      {messages.length === 0 && (
        <div className="flex flex-col items-center text-center px-4 pt-10 pb-6 animate-in fade-in duration-500">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-[24px] flex items-center justify-center text-4xl mb-5 shadow-2xl shadow-orange-500/30">
            🎓
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Bonjour, je suis <span className="text-orange-500">Sami</span> !
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 max-w-md leading-relaxed mb-8">
            Ton conseiller académique personnel de SUPMTI Meknès. Parle-moi de ton profil,
            pose tes questions ou utilise les fonctionnalités dans le menu à gauche.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl">
            {SUGGESTIONS.map(({ icon, title, desc, msg }) => (
              <button
                key={title}
                onClick={() => window.dispatchEvent(new CustomEvent('sami:suggestion', { detail: msg }))}
                className="group flex flex-col items-start gap-2 p-4 rounded-2xl text-left
                  bg-white dark:bg-slate-800
                  border border-gray-100 dark:border-slate-700
                  hover:border-orange-300 dark:hover:border-orange-500/40
                  hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/10
                  transition-all duration-200"
              >
                <span className="text-2xl">{icon}</span>
                <div>
                  <p className="text-sm font-bold text-gray-800 dark:text-slate-100 mb-0.5">{title}</p>
                  <p className="text-[12px] text-gray-400 dark:text-slate-500 leading-snug">{desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Messages ── */}
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      {/* ── Typing indicator — affiché uniquement si streaming pas encore démarré ── */}
      {isTyping && (
        <div className="flex gap-3 items-center px-1">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-xs flex-shrink-0">
            S
          </div>
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
            <div className="flex gap-1 items-center">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-slate-500 animate-bounce"
                  style={{ animationDelay: `${i * 0.18}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Ancre invisible pour le scroll automatique */}
      <div ref={bottomRef} />
    </div>
  );
};