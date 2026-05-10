// // src/app/chatbot/page.tsx
// 'use client';
// import { useEffect, Suspense } from 'react';
// import { useSearchParams }     from 'next/navigation';
// import { ChatWindow }          from '@/components/chatbot/ChatWindow';
// import ChatInput               from '@/components/chatbot/ChatInput';
// import { PanelRenderer }       from '@/components/chatbot/PanelRenderer';
// import { usePanelStore, PanelType } from '@/store/panelStore';

// const VALID_PANELS: PanelType[] = [
//   'fitscore', 'admission', 'carriere', 'comparer',
//   'psycho', 'coach', 'peermatch', 'profil'
// ];

// // Composant interne qui lit les searchParams
// function ChatbotInner() {
//   const searchParams      = useSearchParams();
//   const { openPanel }     = usePanelStore();

//   useEffect(() => {
//     const panel = searchParams.get('panel') as PanelType | null;
//     if (panel && VALID_PANELS.includes(panel)) {
//       setTimeout(() => openPanel(panel), 300);
//     }
//   }, [searchParams]);

//   return null;
// }

// export default function ChatbotPage() {
//   return (
//     <div className="h-full flex flex-col overflow-hidden">

//       {/* Lire ?panel= sans bloquer le rendu */}
//       <Suspense fallback={null}>
//         <ChatbotInner />
//       </Suspense>

//       {/* Header */}
//       <header className="flex-shrink-0 px-6 pt-5 pb-3 bg-gray-50 dark:bg-slate-900">
//         <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
//           Conseiller Virtuel Intelligent
//         </h1>
//         <p className="text-xs text-gray-500 italic mt-0.5">
//           Supporte Français, Anglais et Darija
//         </p>
//       </header>

//       <div className="flex-1 overflow-hidden relative flex flex-col bg-gray-50 dark:bg-slate-900">
//         <ChatWindow />
//         <ChatInput />
//       </div>

//       <PanelRenderer />
//     </div>
//   );
// }


'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Bot, Sparkles } from 'lucide-react';
import { ChatWindow } from '@/components/chatbot/ChatWindow';
import ChatInput from '@/components/chatbot/ChatInput';
import { PanelRenderer } from '@/components/chatbot/PanelRenderer';
import { usePanelStore, PanelType } from '@/store/panelStore';
import { useLang } from '@/i18n/LanguageContext';

const VALID_PANELS: PanelType[] = [
  'fitscore',
  'admission',
  'carriere',
  'comparer',
  'psycho',
  'coach',
  'peermatch',
  'profil',
];

function ChatbotInner() {
  const searchParams = useSearchParams();
  const { openPanel } = usePanelStore();

  useEffect(() => {
    const panel = searchParams.get('panel') as PanelType | null;

    if (panel && VALID_PANELS.includes(panel)) {
      const timer = window.setTimeout(() => openPanel(panel), 300);
      return () => window.clearTimeout(timer);
    }
  }, [searchParams, openPanel]);

  return null;
}

export default function ChatbotPage() {
  const { t, isRTL } = useLang();

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="h-full flex flex-col overflow-hidden bg-gray-50 dark:bg-slate-900"
    >
      <Suspense fallback={null}>
        <ChatbotInner />
      </Suspense>

      {/* Header premium */}
      <header className="flex-shrink-0 px-6 pt-5 pb-4 bg-gray-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
        <div className="rounded-3xl border border-[#006666]/10 bg-gradient-to-br from-[#006666]/5 via-emerald-500/[0.04] to-blue-500/[0.05] px-5 py-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-2xl bg-[#006666] text-white flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <Bot size={20} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <Sparkles size={12} className="text-[#006666]" />
                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#006666]">
                  {t('chatbot', 'badge')}
                </span>
              </div>

              <h1 className="text-xl font-black tracking-tight text-gray-800 dark:text-gray-100">
                {t('chatbot', 'title')}
              </h1>
            </div>
          </div>

          <p className="text-xs text-gray-500 dark:text-slate-400 italic leading-relaxed">
            {t('chatbot', 'subtitle')}
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-hidden relative flex flex-col bg-gray-50 dark:bg-slate-900">
        <ChatWindow />
        <ChatInput />
      </div>

      <PanelRenderer />
    </div>
  );
}