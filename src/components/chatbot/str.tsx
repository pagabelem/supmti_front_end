/* eslint-disable react/no-unescaped-entities */
'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { X, Send, Zap, Mic, MicOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import chatbotService from '@/services/chatbotService';
import { useChatStore }    from '@/store/chatStore';
import { useSessionStore } from '@/store/sessionStore';
import { usePanelStore }   from '@/store/panelStore';

// ── Types ─────────────────────────────────────────────────────────────────────
interface LiveMessage {
  id:       string;
  role:     'user' | 'ai';
  content:  string;
  done:     boolean;
}

interface LiveModeModalProps {
  onClose: () => void;
}

// ── Curseur clignotant ────────────────────────────────────────────────────────
const BlinkCursor = () => (
  <span className="inline-block w-[2px] h-[1.1em] bg-orange-400 ml-0.5 align-middle animate-[blink_0.9s_step-end_infinite]" />
);

// ── Bulle message ─────────────────────────────────────────────────────────────
const LiveBubble = ({ msg }: { msg: LiveMessage }) => {
  const isUser = msg.role === 'user';
  return (
    <div className={cn(
      'flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300',
      isUser ? 'flex-row-reverse' : 'flex-row'
    )}>
      {/* Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-xs font-black shrink-0 shadow-lg shadow-orange-500/20 mt-1">
          S
        </div>
      )}

      <div className={cn(
        'max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm',
        isUser
          ? 'bg-[#006666] text-white rounded-tr-sm'
          : 'bg-white/8 text-slate-100 rounded-tl-sm border border-white/10 backdrop-blur-sm'
      )}>
        <span className="whitespace-pre-wrap">{msg.content}</span>
        {!isUser && !msg.done && <BlinkCursor />}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-slate-700 flex items-center justify-center text-white text-xs font-black shrink-0 mt-1">
          T
        </div>
      )}
    </div>
  );
};

// ── Composant principal ───────────────────────────────────────────────────────
export const LiveModeModal = ({ onClose }: LiveModeModalProps) => {
  const [messages,  setMessages]  = useState<LiveMessage[]>([]);
  const [input,     setInput]     = useState('');
  const [isBusy,    setIsBusy]    = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const scrollRef   = useRef<HTMLDivElement>(null);
  const inputRef    = useRef<HTMLTextAreaElement>(null);
  const bottomRef   = useRef<HTMLDivElement>(null);

  const { addMessage, appendToLastMessage: appendToStore } = useChatStore();
  const { setProfil }   = useSessionStore();
  const { setPeerBadge } = usePanelStore();

  // Animation d'entrée
  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  // Focus sur l'input à l'ouverture
  useEffect(() => {
    if (isVisible) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isVisible]);

  // Scroll automatique
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fermeture avec animation
  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  // Échap pour fermer
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleClose]);

  // ── Envoi message ───────────────────────────────────────────────────────────
  const send = useCallback(async (text: string) => {
    if (!text.trim() || isBusy) return;
    setInput('');
    setIsBusy(true);

    // Message utilisateur dans le modal
    const userMsg: LiveMessage = { id: uuidv4(), role: 'user', content: text, done: true };
    setMessages(prev => [...prev, userMsg]);

    // Aussi dans le store global (sidebar / historique)
    addMessage({ id: userMsg.id, content: text, sender: 'user', created_at: new Date().toISOString() });

    // Message AI vide
    const aiId = uuidv4();
    const aiMsg: LiveMessage = { id: aiId, role: 'ai', content: '', done: false };
    setMessages(prev => [...prev, aiMsg]);

    // Aussi dans le store global
    addMessage({ id: aiId, content: '', sender: 'ai', created_at: new Date().toISOString() });

    let firstToken = true;
    await chatbotService.sendMessageStream(
      text,
      // onToken
      (token) => {
        if (firstToken) { firstToken = false; }
        // Mettre à jour le message dans le modal
        setMessages(prev => prev.map(m =>
          m.id === aiId ? { ...m, content: m.content + token } : m
        ));
        // Mettre à jour le store global
        appendToStore(token);
      },
      // onDone
      async ({ profil, peer_match }) => {
        setMessages(prev => prev.map(m => m.id === aiId ? { ...m, done: true } : m));
        if (profil) {
          setProfil(profil as Parameters<typeof setProfil>[0]);
          window.dispatchEvent(new CustomEvent('sami:profile-updated'));
        }
        if (peer_match) setPeerBadge(true);
        setIsBusy(false);
      },
      // onError
      (err) => {
        setMessages(prev => prev.map(m =>
          m.id === aiId ? { ...m, content: `⚠️ ${err}`, done: true } : m
        ));
        appendToStore(`⚠️ ${err}`);
        setIsBusy(false);
      }
    );
    setIsBusy(false);
  }, [isBusy, addMessage, appendToStore, setProfil, setPeerBadge]);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        className={cn(
          'fixed inset-0 z-50 transition-all duration-300',
          isVisible ? 'opacity-100' : 'opacity-0'
        )}
        onClick={handleClose}
      >
        {/* Fond sombre avec grain */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
        {/* Grain texture */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")` }}
        />
      </div>

      {/* ── Panel principal ── */}
      <div
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none',
        )}
      >
        <div
          onClick={e => e.stopPropagation()}
          className={cn(
            'pointer-events-auto relative w-full max-w-2xl flex flex-col',
            'rounded-3xl overflow-hidden',
            'transition-all duration-300 ease-out',
            isVisible
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-8 scale-95'
          )}
          style={{
            height: 'min(700px, 90vh)',
            background: 'linear-gradient(145deg, #0f1117 0%, #131820 40%, #0a0f16 100%)',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 40px 80px -20px rgba(0,0,0,0.8), 0 0 100px -30px rgba(249,115,22,0.15)',
          }}
        >
          {/* ── Lueur décorative ── */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-20 bg-orange-500/5 blur-3xl pointer-events-none" />

          {/* ── Header ── */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              {/* Indicateur live pulsant */}
              <div className="relative flex items-center">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500" />
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-orange-400 fill-orange-400" />
                  <span className="text-[11px] font-black text-orange-400 uppercase tracking-[0.2em]">
                    Mode Live
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Réponse en temps réel · token par token
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] text-slate-600 uppercase tracking-wider">Messages</p>
                <p className="text-sm font-black text-slate-300">{messages.length}</p>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all group"
              >
                <X size={16} className="group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>
          </div>

          {/* ── Zone messages ── */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-6 py-5 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
          >
            {/* État vide */}
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-4 py-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-600/10 border border-orange-500/20 flex items-center justify-center">
                  <Zap size={28} className="text-orange-400" />
                </div>
                <div className="text-center">
                  <p className="text-slate-300 font-bold text-sm mb-1">
                    Conversation Live activée
                  </p>
                  <p className="text-slate-600 text-xs max-w-[280px] leading-relaxed">
                    Pose ta question — la réponse s'affiche mot par mot en temps réel
                  </p>
                </div>
                {/* Suggestions rapides */}
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  {[
                    'Parle-moi des filières',
                    'Calcule mon FitScore',
                    'Frais et bourses ?',
                  ].map(s => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-medium
                        bg-white/[0.04] border border-white/[0.08] text-slate-400
                        hover:bg-white/[0.08] hover:text-slate-200 hover:border-orange-500/30
                        transition-all duration-200"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map(msg => (
              <LiveBubble key={msg.id} msg={msg} />
            ))}

            {/* Typing indicator (avant le 1er token) */}
            {isBusy && messages[messages.length - 1]?.role === 'ai' && messages[messages.length - 1]?.content === '' && (
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-xs font-black shrink-0 shadow-lg shadow-orange-500/20">
                  S
                </div>
                <div className="flex gap-1 px-4 py-3 rounded-2xl rounded-tl-sm bg-white/8 border border-white/10">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* ── Input ── */}
          <div className="px-4 pb-4 pt-3 border-t border-white/[0.05]">
            <div className={cn(
              'flex items-end gap-3 px-4 py-3 rounded-2xl transition-all duration-200',
              'bg-white/[0.04] border',
              isBusy
                ? 'border-orange-500/20'
                : 'border-white/[0.08] focus-within:border-orange-500/30'
            )}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                disabled={isBusy}
                placeholder={isBusy ? 'SAMI répond en direct…' : 'Écris ta question… (Entrée pour envoyer)'}
                rows={1}
                className="flex-1 resize-none bg-transparent border-none outline-none text-sm text-slate-100 placeholder:text-slate-600 max-h-[100px] leading-relaxed"
                style={{ scrollbarWidth: 'none' }}
                onInput={e => {
                  const el = e.currentTarget;
                  el.style.height = 'auto';
                  el.style.height = Math.min(el.scrollHeight, 100) + 'px';
                }}
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || isBusy}
                className={cn(
                  'w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0',
                  input.trim() && !isBusy
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 hover:scale-105 hover:bg-orange-400'
                    : 'bg-white/[0.04] text-slate-600 cursor-not-allowed'
                )}
              >
                {isBusy
                  ? <Loader2 size={16} className="animate-spin text-orange-400" />
                  : <Send size={15} />
                }
              </button>
            </div>

            {/* Footer hint */}
            <p className="text-center text-[10px] text-slate-700 mt-2">
              Mode Live · <kbd className="px-1 py-0.5 rounded bg-white/5 text-slate-600 text-[9px]">Entrée</kbd> pour envoyer ·
              <kbd className="px-1 py-0.5 rounded bg-white/5 text-slate-600 text-[9px] ml-1">Échap</kbd> pour fermer
            </p>
          </div>
        </div>
      </div>

      {/* CSS blink */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </>
  );
};