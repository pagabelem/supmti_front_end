// 'use client';
// import ReactMarkdown from 'react-markdown';
// import { Message }   from '@/types/message';
// import { Volume2, VolumeX, User, Bot, Sparkles, Copy, Check, Loader2 } from 'lucide-react';
// import { useState, useRef } from 'react';
// import { cn } from '@/lib/utils';
// import { synthesizeSpeech } from '@/services/sttService';

// export const MessageBubble = ({ message }: { message: Message }) => {
//   const isAi = message.sender === 'ai';
//   const [copied,     setCopied]     = useState(false);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [ttsLoading, setTtsLoading] = useState(false);
//   const audioRef = useRef<HTMLAudioElement | null>(null);

//   const handleCopy = () => {
//     navigator.clipboard.writeText(message.content);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const handleSpeak = async () => {
//     // Si en train de jouer → stopper
//     if (isSpeaking) {
//       audioRef.current?.pause();
//       if (audioRef.current) audioRef.current.currentTime = 0;
//       setIsSpeaking(false);
//       return;
//     }

//     setTtsLoading(true);
//     try {
//       // Nettoyer le markdown pour le TTS (supprimer **, *, #, etc.)
//       const clean = message.content
//         .replace(/\*\*(.+?)\*\*/g, '$1')
//         .replace(/\*(.+?)\*/g, '$1')
//         .replace(/#+\s/g, '')
//         .replace(/`(.+?)`/g, '$1')
//         .replace(/\[(.+?)\]\(.+?\)/g, '$1')
//         .slice(0, 500);

//       const blob = await synthesizeSpeech(clean, 'fr');
//       if (!blob) throw new Error('Pas de réponse audio');

//       const url   = URL.createObjectURL(blob);
//       const audio = new Audio(url);
//       audioRef.current = audio;

//       audio.onended = () => {
//         setIsSpeaking(false);
//         URL.revokeObjectURL(url);
//       };
//       audio.onerror = () => {
//         setIsSpeaking(false);
//         URL.revokeObjectURL(url);
//       };

//       await audio.play();
//       setIsSpeaking(true);
//     } catch {
//       // Fallback : Web Speech API
//       const utterance = new SpeechSynthesisUtterance(message.content.slice(0, 300));
//       utterance.lang = 'fr-FR';
//       utterance.onend = () => setIsSpeaking(false);
//       window.speechSynthesis.speak(utterance);
//       setIsSpeaking(true);
//     } finally {
//       setTtsLoading(false);
//     }
//   };

//   return (
//     <div className={cn(
//       "flex w-full mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500",
//       isAi ? "justify-start" : "justify-end"
//     )}>
//       <div className={cn(
//         "flex max-w-[85%] md:max-w-[80%] gap-4",
//         isAi ? "flex-row" : "flex-row-reverse"
//       )}>

//         {/* Avatar */}
//         <div className="relative flex-shrink-0">
//           <div className={cn(
//             "h-10 w-10 rounded-2xl flex items-center justify-center border-2 shadow-2xl transition-transform hover:scale-110",
//             isAi
//               ? "bg-slate-900 border-[#006666] text-[#006666] shadow-[#006666]/20"
//               : "bg-[#006666] border-white/20 text-white"
//           )}>
//             {isAi ? <Bot size={22} /> : <User size={22} />}
//           </div>
//           {isAi && (
//             <span className="absolute -top-1 -right-1 flex h-3 w-3">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
//               <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
//             </span>
//           )}
//         </div>

//         {/* Bulle */}
//         <div className={cn("flex flex-col gap-2", isAi ? "items-start" : "items-end")}>
//           <div className={cn(
//             "group relative p-5 rounded-[24px] transition-all duration-300",
//             isAi
//               ? "bg-white dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-none shadow-xl hover:shadow-[#006666]/5"
//               : "bg-gradient-to-br from-[#006666] to-[#004d4d] text-white rounded-tr-none shadow-lg shadow-[#006666]/20"
//           )}>

//             {/* Header AI */}
//             {isAi && (
//               <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-700/50 pb-2">
//                 <div className="flex items-center gap-2">
//                   <div className="p-1 bg-[#006666]/10 rounded-md">
//                     <Sparkles size={12} className="text-[#006666]" />
//                   </div>
//                   <span className="text-[11px] font-bold uppercase tracking-widest text-[#006666]">SAMI AI</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   {/* Copier */}
//                   <button
//                     onClick={handleCopy}
//                     className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-400"
//                     title="Copier"
//                   >
//                     {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
//                   </button>

//                   {/* TTS */}
//                   <button
//                     onClick={handleSpeak}
//                     disabled={ttsLoading}
//                     title={isSpeaking ? 'Arrêter' : 'Écouter'}
//                     className={cn(
//                       "p-1.5 rounded-md transition-colors",
//                       isSpeaking
//                         ? "bg-[#006666]/10 text-[#006666]"
//                         : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400",
//                       ttsLoading && "opacity-50 cursor-not-allowed"
//                     )}
//                   >
//                     {ttsLoading
//                       ? <Loader2 size={14} className="animate-spin" />
//                       : isSpeaking
//                         ? <VolumeX size={14} />
//                         : <Volume2 size={14} />
//                     }
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Contenu Markdown */}
//             <div className={cn(
//               "prose prose-sm max-w-none leading-relaxed font-normal",
//               isAi ? "dark:prose-invert prose-slate" : "prose-invert"
//             )}>
//               <ReactMarkdown>{message.content}</ReactMarkdown>
//             </div>

//             {/* Timestamp */}
//             <div className={cn(
//               "mt-3 text-[10px] font-medium opacity-40 flex items-center gap-1",
//               !isAi && "justify-end"
//             )}>
//               {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//             </div>
//           </div>

//           {/* Badge émotion */}
//           {message.emotion && (
//             <div className={cn(
//               "px-3 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 animate-in slide-in-from-top-1",
//               isAi
//                 ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/30 text-[#006666]"
//                 : "bg-slate-50 border-slate-100 text-slate-400"
//             )}>
//               <div className="w-1.5 h-1.5 rounded-full bg-[#CC0000] animate-pulse" />
//               ANALYSE : {message.emotion.toUpperCase()}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };


'use client';
import ReactMarkdown from 'react-markdown';
import { Message } from '@/types/message';
import { Volume2, User, Bot, Sparkles, Copy, Check, Square } from 'lucide-react';
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// ── Détection de langue pour le TTS ──────────────────────────
function detectLangForTTS(text: string): { lang: string; voice: string; bcp47: string } {
  // Caractères arabes
  const arabicChars   = (text.match(/[\u0600-\u06FF]/g) || []).length;
  const totalLetters  = (text.match(/[a-zA-Z\u0600-\u06FF]/g) || []).length;
  const arabicRatio   = totalLetters > 0 ? arabicChars / totalLetters : 0;

  // Mots darija latins
  const darijaWords = ['wach', 'bghit', 'kayn', 'kayna', 'mzyan', 'zwina', 'wakha',
    'khoya', 'khti', 'dyal', '3ndek', '3ndi', 'machi', 'safi', 'labas', 'bzzaf',
    'daba', 'ndkhol', 'dial', 'hnouma', 'iyeh', 'chno', 'fin', 'bch7al'];
  const textLower    = text.toLowerCase();
  const isDarijLatin = darijaWords.some(w => textLower.includes(w));

  // Mots anglais
  const englishWords = ['the', 'is', 'are', 'you', 'your', 'this', 'that', 'with',
    'have', 'will', 'can', 'for', 'not', 'but', 'and', 'what', 'how'];
  const isEnglish = englishWords.filter(w => textLower.split(/\b/).includes(w)).length >= 2;

  if (arabicRatio > 0.3) {
    // Darija écrite en arabe → TTS arabe
    return { lang: 'ar', voice: 'onyx', bcp47: 'ar-MA' };
  }
  if (isDarijLatin) {
    // Darija latine → TTS français (le plus proche) avec voix nova
    return { lang: 'fr', voice: 'nova', bcp47: 'fr-FR' };
  }
  if (isEnglish) {
    return { lang: 'en', voice: 'alloy', bcp47: 'en-US' };
  }
  return { lang: 'fr', voice: 'nova', bcp47: 'fr-FR' };
}

// ── Nettoyage texte pour TTS ──────────────────────────────────
function cleanForTTS(text: string): string {
  return text
    .replace(/#{1,6}\s*/g, '')
    .replace(/\*{1,3}(.*?)\*{1,3}/g, '$1')
    .replace(/^\s*[-•►]\s*/gm, '')
    .replace(/`{1,3}.*?`{1,3}/gs, '')
    .replace(/[─═━┄]+/g, '')
    .replace(/[\u2600-\u27BF]/g, '')
    .replace(/[\uD83C-\uDBFF][\uDC00-\uDFFF]/g, '')
    .replace(/\n{2,}/g, '. ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 4000);
}

export const MessageBubble = ({ message }: { message: Message }) => {
  const isAi = message.sender === 'ai';
  const [copied,    setCopied]    = useState(false);
  const [ttsState,  setTtsState]  = useState<'idle' | 'loading' | 'playing'>('idle');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── TTS multi-langue via API backend ─────────────────────
  const handleTTS = async () => {
    // Si audio en cours → stop
    if (ttsState === 'playing') {
      audioRef.current?.pause();
      audioRef.current = null;
      setTtsState('idle');
      return;
    }

    setTtsState('loading');

    const cleanText = cleanForTTS(message.content);
    const { voice }   = detectLangForTTS(message.content);

    try {
      // Appel API backend TTS (gère toutes les langues)
      const res = await fetch(`${API}/api/voice/tts`, {
        method:      'POST',
        credentials: 'include',
        headers:     { 'Content-Type': 'application/json' },
        body:        JSON.stringify({ text: cleanText, voice }),
      });

      if (!res.ok) throw new Error(`TTS HTTP ${res.status}`);
      const data = await res.json();

      if (data.audio) {
        const audio = new Audio('data:audio/mp3;base64,' + data.audio);
        audioRef.current = audio;
        setTtsState('playing');
        audio.onended = () => { audioRef.current = null; setTtsState('idle'); };
        audio.onerror = () => { audioRef.current = null; setTtsState('idle'); };
        await audio.play();
      } else {
        setTtsState('idle');
      }
    } catch (e) {
      console.warn('[TTS]', e);
      // Fallback : SpeechSynthesis navigateur si API échoue
      const { bcp47 } = detectLangForTTS(message.content);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang  = bcp47;
      utterance.onend = () => setTtsState('idle');
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      setTtsState('playing');
    }
  };

  return (
    <div className={cn(
      'flex w-full mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500',
      isAi ? 'justify-start' : 'justify-end'
    )}>
      <div className={cn('flex max-w-[85%] md:max-w-[80%] gap-4', isAi ? 'flex-row' : 'flex-row-reverse')}>

        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className={cn(
            'h-10 w-10 rounded-2xl flex items-center justify-center border-2 shadow-2xl transition-transform hover:scale-110',
            isAi ? 'bg-slate-900 border-[#006666] text-[#006666] shadow-[#006666]/20' : 'bg-[#006666] border-white/20 text-white'
          )}>
            {isAi ? <Bot size={22} /> : <User size={22} />}
          </div>
          {isAi && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
          )}
        </div>

        {/* Bulle */}
        <div className={cn('flex flex-col gap-2', isAi ? 'items-start' : 'items-end')}>
          <div className={cn(
            'group relative p-5 rounded-[24px] transition-all duration-300',
            isAi
              ? 'bg-white dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-none shadow-xl'
              : 'bg-gradient-to-br from-[#006666] to-[#004d4d] text-white rounded-tr-none shadow-lg shadow-[#006666]/20'
          )}>

            {/* Header SAMI */}
            {isAi && (
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-700/50 pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-[#006666]/10 rounded-md">
                    <Sparkles size={12} className="text-[#006666]" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#006666]">SAMI AI</span>
                </div>
                <div className="flex items-center gap-1">
                  {/* Copier */}
                  <button onClick={handleCopy}
                    className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-400"
                    title="Copier">
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                  {/* TTS — fonctionne en fr, en, ar, darija */}
                  <button onClick={handleTTS}
                    className={cn(
                      'p-1.5 rounded-md transition-colors',
                      ttsState === 'playing'
                        ? 'bg-[#006666]/10 text-[#006666]'
                        : ttsState === 'loading'
                        ? 'text-slate-300 cursor-wait'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-[#006666]'
                    )}
                    title={ttsState === 'playing' ? 'Arrêter la lecture' : 'Lire à voix haute'}>
                    {ttsState === 'loading' ? (
                      <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-[#006666] rounded-full animate-spin" />
                    ) : ttsState === 'playing' ? (
                      <Square size={13} className="fill-[#006666]" />
                    ) : (
                      <Volume2 size={14} />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Contenu */}
            <div className={cn(
              'prose prose-sm max-w-none leading-relaxed',
              isAi ? 'dark:prose-invert prose-slate' : 'prose-invert'
            )}>
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>

            {/* Timestamp */}
            <div className={cn('mt-3 text-[10px] font-medium opacity-40 flex items-center gap-1', !isAi && 'justify-end')}>
              {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          {/* Émotion */}
          {(message as any).emotion && (
            <div className={cn('px-3 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5',
              isAi ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/30 text-[#006666]'
                   : 'bg-slate-50 border-slate-100 text-slate-400')}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#CC0000] animate-pulse" />
              ANALYSE : {(message as any).emotion.toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};