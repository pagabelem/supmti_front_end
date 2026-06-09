/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
'use client';
import { useEffect, useRef } from 'react';
import { useChatStore } from '@/store/chatStore';
import {MessageBubble} from './MessageBubble';
import { Bot, Sparkles, GraduationCap, BarChart2, Users, Brain } from 'lucide-react';

// ── Écran d'accueil affiché quand aucun message ──────────────
const WelcomeScreen = () => (
  <div className="flex flex-col items-center justify-center h-full px-6 py-16 text-center select-none">

    {/* Avatar SAMI */}
    <div className="relative mb-8">
      <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full scale-150" />
      <div className="relative w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-green-500/30">
        <span className="text-white font-black text-3xl">S</span>
      </div>
      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
        <Sparkles size={10} className="text-white" />
      </div>
    </div>

    <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
      Bonjour, je suis <span className="text-green-600 dark:text-green-400">SAMI</span> 👋
    </h2>
    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed mb-10">
      Ton conseiller IA personnel pour l'orientation à <strong className="text-gray-700 dark:text-gray-300">SUPMTI Meknès</strong>.
      Dis-moi qui tu es, je m'occupe du reste.
    </p>

    {/* Suggestions */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
      {[
        { icon: GraduationCap, text: "Quelle filière me correspond ?",    color: "bg-blue-50 dark:bg-blue-950/30   border-blue-100 dark:border-blue-900/40   text-blue-700 dark:text-blue-300" },
        { icon: BarChart2,     text: "Calcule mon FitScore",              color: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-300" },
        { icon: Brain,         text: "Passe-moi le test psychométrique",  color: "bg-purple-50 dark:bg-purple-950/30  border-purple-100 dark:border-purple-900/40  text-purple-700 dark:text-purple-300" },
        { icon: Users,         text: "Connecte-moi à un ambassadeur",     color: "bg-orange-50 dark:bg-orange-950/30  border-orange-100 dark:border-orange-900/40  text-orange-700 dark:text-orange-300" },
      ].map(({ icon: Icon, text, color }) => (
        <button
          key={text}
          onClick={() => {
            // Déclenche l'envoi comme si l'utilisateur avait tapé le message
            window.dispatchEvent(new CustomEvent('sami:suggestion', { detail: text }));
          }}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-left text-sm font-semibold transition-all hover:scale-[1.02] active:scale-95 ${color}`}
        >
          <Icon size={16} className="shrink-0" />
          {text}
        </button>
      ))}
    </div>
  </div>
);

// ── Indicateur "SAMI est en train d'écrire…" ─────────────────
const TypingIndicator = () => (
  <div className="flex items-end gap-2 px-4 py-2">
    <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-500 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
      <Bot size={14} className="text-white" />
    </div>
    <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
    </div>
  </div>
);

// ── Séparateur de date ────────────────────────────────────────
const DateSeparator = ({ date }: { date: string }) => (
  <div className="flex items-center gap-3 px-4 py-2 my-2">
    <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
    <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap">
      {date}
    </span>
    <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
  </div>
);

// ── Composant principal ───────────────────────────────────────
export default function MessageList() {
  const { messages, isTyping } = useChatStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll automatique vers le bas à chaque nouveau message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Écran d'accueil si aucun message
  if (messages.length === 0) {
    return <WelcomeScreen />;
  }

  // Pré-calculer les dates des messages pour déterminer où afficher les séparateurs
  // Support multiple possible timestamp fields on Message (timestamp, createdAt, date)
  const messageDates = messages.map((msg) => {
    const raw = (msg as any).timestamp ?? (msg as any).createdAt ?? (msg as any).date ?? '';
    if (!raw) return '';
    try {
      return new Date(raw).toLocaleDateString('fr-FR', {
        weekday: 'long', day: 'numeric', month: 'long',
      });
    } catch {
      return '';
    }
  });

  return (
    <div className="flex flex-col gap-1 px-2 py-4 md:px-6">
      {messages.map((msg, i) => {
        const msgDate = messageDates[i];

        // Show a date separator for the first message or when the date differs from the previous
        const showDate = msgDate && (i === 0 || msgDate !== messageDates[i - 1]);

        return (
          <div key={msg.id ?? i}>
            {showDate && <DateSeparator date={msgDate} />}
            <MessageBubble message={msg} />
          </div>
        );
      })}

      {/* Indicateur de frappe */}
      {isTyping && <TypingIndicator />}

      {/* Ancre de scroll */}
      <div ref={bottomRef} className="h-2" />
    </div>
  );
}