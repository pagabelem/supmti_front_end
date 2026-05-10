// 'use client';
// import ChatInput from './ChatInput';
// import MessageList from './MessageList';

// export default function ChatLayout() {
//   return (
//     /* h-full w-full : occupe 100% de l'espace à droite de la Sidebar */
// <div className="flex flex-col h-full w-full min-h-0 bg-[#f8fafc] dark:bg-slate-950">      
//       {/* Header Interne SAMI */}
//       <header className="h-16 border-b bg-white dark:bg-slate-900 flex items-center justify-between px-6 shrink-0 shadow-sm">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
//             S
//           </div>
//           <div>
//             <h1 className="font-bold text-gray-800 dark:text-white text-sm md:text-base">SAMI — Assistant SUPMTI</h1>
//             <div className="flex items-center gap-1.5">
//               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
//               <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">En ligne</span>
//             </div>
//           </div>
//         </div>
        
//         {/* Accent visuel (Drapeau/École) */}
//         <div className="flex h-1 w-20 rounded-full overflow-hidden opacity-80">
//            <div className="flex-1 bg-red-600"></div>
//            <div className="flex-1 bg-white border-x border-gray-100"></div>
//            <div className="flex-1 bg-green-600"></div>
//         </div>
//       </header>

//       {/* Zone des messages (occupe toute la largeur restante) */}
// <div className="flex-1 min-h-0 overflow-y-auto scroll-smooth bg-[#f1f5f9]/30 dark:bg-slate-900/50">
//   <MessageList />
// </div>

//       {/* Barre d'envoi en bas */}
//       <div className="shrink-0 bg-white dark:bg-slate-900 border-t dark:border-slate-800 p-2">
//         <ChatInput />
//       </div>
//     </div>
//   );
// }


'use client';
import ChatInput from './ChatInput';
import MessageList from './MessageList';
import { useLang } from '@/i18n/LanguageContext';

export default function ChatLayout() {
  const { t } = useLang();

  return (
    <div className="flex flex-col h-full w-full min-h-0 bg-[#f8fafc] dark:bg-slate-950">
      {/* Header Interne SAMI */}
      <header className="h-16 border-b bg-white dark:bg-slate-900 flex items-center justify-between px-6 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
            S
          </div>
          <div>
            <h1 className="font-bold text-gray-800 dark:text-white text-sm md:text-base">
              {/* "SAMI — Assistant SUPMTI" */}
              SAMI — {t('nav', 'chat')}
            </h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
                {/* "En ligne" */}
                {t('chat', 'typing').split('…')[0].replace('SAMI est en train d\'écrire','En ligne').replace('SAMI is typing','Online').replace('سامي يكتب','متصل')}
              </span>
            </div>
          </div>
        </div>

        {/* Accent visuel */}
        <div className="flex h-1 w-20 rounded-full overflow-hidden opacity-80">
          <div className="flex-1 bg-red-600"></div>
          <div className="flex-1 bg-white border-x border-gray-100"></div>
          <div className="flex-1 bg-green-600"></div>
        </div>
      </header>

      {/* Zone des messages */}
      <div className="flex-1 min-h-0 overflow-y-auto scroll-smooth bg-[#f1f5f9]/30 dark:bg-slate-900/50">
        <MessageList />
      </div>

      {/* Barre d'envoi */}
      <div className="shrink-0 bg-white dark:bg-slate-900 border-t dark:border-slate-800 p-2">
        <ChatInput />
      </div>
    </div>
  );
}