// src/app/chatbot/page.tsx
'use client';
import { useEffect, Suspense } from 'react';
import { useSearchParams }     from 'next/navigation';
import { ChatWindow }          from '@/components/chatbot/ChatWindow';
import ChatInput               from '@/components/chatbot/ChatInput';
import { PanelRenderer }       from '@/components/chatbot/PanelRenderer';
import { usePanelStore, PanelType } from '@/store/panelStore';

const VALID_PANELS: PanelType[] = [
  'fitscore', 'admission', 'carriere', 'comparer',
  'psycho', 'coach', 'peermatch', 'profil'
];

// Composant interne qui lit les searchParams
function ChatbotInner() {
  const searchParams      = useSearchParams();
  const { openPanel }     = usePanelStore();

  useEffect(() => {
    const panel = searchParams.get('panel') as PanelType | null;
    if (panel && VALID_PANELS.includes(panel)) {
      setTimeout(() => openPanel(panel), 300);
    }
  }, [searchParams]);

  return null;
}

export default function ChatbotPage() {
  return (
    <div className="h-full flex flex-col overflow-hidden">

      {/* Lire ?panel= sans bloquer le rendu */}
      <Suspense fallback={null}>
        <ChatbotInner />
      </Suspense>

      {/* Header */}
      <header className="flex-shrink-0 px-6 pt-5 pb-3 bg-gray-50 dark:bg-slate-900">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Conseiller Virtuel Intelligent
        </h1>
        <p className="text-xs text-gray-500 italic mt-0.5">
          Supporte Français, Anglais et Darija
        </p>
      </header>

      <div className="flex-1 overflow-hidden relative flex flex-col bg-gray-50 dark:bg-slate-900">
        <ChatWindow />
        <ChatInput />
      </div>

      <PanelRenderer />
    </div>
  );
}