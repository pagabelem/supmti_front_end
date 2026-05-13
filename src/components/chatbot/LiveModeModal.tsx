// 'use client';
// import { useEffect, useRef, useState, useCallback } from 'react';
// import { X, Mic, Volume2, Loader2, MessageSquare, Play } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { v4 as uuidv4 } from 'uuid';
// import { useChatStore }    from '@/store/chatStore';
// import { useSessionStore } from '@/store/sessionStore';

// const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// // ── Voix disponibles par langue ───────────────────────────────────────────────
// const VOICES_BY_LANG: Record<string, { id: string; label: string; desc: string }[]> = {
//   fr: [
//     { id: 'nova',    label: 'Nova',    desc: 'Chaleureuse & naturelle' },
//     { id: 'shimmer', label: 'Shimmer', desc: 'Douce & expressive' },
//     { id: 'echo',    label: 'Echo',    desc: 'Claire & posée' },
//   ],
//   en: [
//     { id: 'alloy',   label: 'Alloy',   desc: 'Balanced & professional' },
//     { id: 'fable',   label: 'Fable',   desc: 'Warm & engaging' },
//     { id: 'onyx',    label: 'Onyx',    desc: 'Deep & authoritative' },
//   ],
//   ar: [
//     { id: 'nova',    label: 'Nova',    desc: 'دافئة وطبيعية' },
//     { id: 'shimmer', label: 'Shimmer', desc: 'ناعمة ومعبرة' },
//     { id: 'echo',    label: 'Echo',    desc: 'واضحة وهادئة' },
//   ],
// };

// const LANG_LABELS: Record<string, { flag: string; label: string }> = {
//   fr: { flag: '🇫🇷', label: 'Français' },
//   en: { flag: '🇬🇧', label: 'English'  },
//   ar: { flag: '🇲🇦', label: 'Darija'   },
// };

// // ── Anti-hallucination Whisper (étendu) ──────────────────────────────────────
// const HALLUCINATION_PATTERNS = [
//   'sous-titres réalisés', 'sous-titres para', 'sous titres',
//   'communauté d\'amara', 'amara.org',
//   'abonnez-vous', 'abonnez vous', 'merci d\'avoir regardé',
//   'merci de regarder', 'thanks for watching', 'n\'hésitez pas à vous abonner',
//   'transcription by', 'droits réservés', 'tous droits',
//   'sous-titrage st', 'st\' 501', 'st 501',
//   'bonne journée. merci. merci. merci',
//   'conversation sur l\'orientation', 'academic orientation conversation',
//   'mots courants', 'filières: mge',
// ];

// function isHallucination(text: string): boolean {
//   if (!text || text.length < 1) return true;
//   const lower = text.toLowerCase();
//   if (HALLUCINATION_PATTERNS.some(p => lower.includes(p))) return true;
//   const words = text.trim().split(/\s+/);
//   if (words.length > 120) return true;
//   // Répétitions (ex: "Merci. Merci. Merci.")
//   if (words.length >= 6) {
//     const half  = Math.floor(words.length / 2);
//     const first = words.slice(0, half).join(' ').toLowerCase();
//     const sec   = words.slice(half).join(' ').toLowerCase();
//     if (sec.startsWith(first.substring(0, Math.min(15, first.length)))) return true;
//   }
//   return false;
// }

// function detectLang(text: string): string {
//   const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
//   const totalLetters = (text.match(/[a-zA-Z\u0600-\u06FF]/g) || []).length;
//   if (totalLetters > 0 && arabicChars / totalLetters > 0.4) return 'ar';
//   const darija = ['wach', 'bghit', 'kayn', 'mzyan', 'wakha', 'khoya', 'dyal', '3ndek'];
//   if (darija.some(w => text.toLowerCase().includes(w))) return 'ar';
//   const en = ['what', 'how', 'why', 'who', 'tell me', 'i want', 'can you', 'please'];
//   if (en.some(w => text.toLowerCase().includes(w))) return 'en';
//   return 'fr';
// }

// // ── Types ─────────────────────────────────────────────────────────────────────
// type Phase     = 'picker' | 'live';
// type VoiceState = 'idle' | 'listening' | 'thinking' | 'speaking';

// interface Line { id: string; role: 'user' | 'ai'; text: string; }

// // ─────────────────────────────────────────────────────────────────────────────
// // PICKER — Choix langue + voix
// // ─────────────────────────────────────────────────────────────────────────────
// const VoicePicker = ({
//   onStart,
//   onCancel,
// }: {
//   onStart: (lang: string, voice: string) => void;
//   onCancel: () => void;
// }) => {
//   const [lang,     setLang]     = useState('fr');
//   const [voice,    setVoice]    = useState('nova');
//   const [playing,  setPlaying]  = useState<string | null>(null);
//   const [visible,  setVisible]  = useState(false);

//   useEffect(() => { setTimeout(() => setVisible(true), 10); }, []);

//   // Mettre à jour la voix quand la langue change
//   useEffect(() => {
//     setVoice(VOICES_BY_LANG[lang]?.[0]?.id ?? 'nova');
//   }, [lang]);

//   const previewVoice = async (voiceId: string) => {
//     setPlaying(voiceId);
//     try {
//       const PREVIEW: Record<string, string> = {
//         fr: 'Bonjour, je suis Sami, votre conseiller académique à SUPMTI Meknès.',
//         en: 'Hello, I am Sami, your academic advisor at SUPMTI Meknes.',
//         ar: 'مرحبا، أنا سامي، مستشارك الأكاديمي في SUPMTI مكناس.',
//       };
//       const res  = await fetch(`${API}/api/voice/tts`, {
//         method: 'POST', credentials: 'include',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text: PREVIEW[lang], voice: voiceId, lang }),
//       });
//       const data = await res.json();
//       if (data.audio) {
//         const audio = new Audio('data:audio/mp3;base64,' + data.audio);
//         audio.onended = () => setPlaying(null);
//         await audio.play();
//       }
//     } catch { setPlaying(null); }
//   };

//   return (
//     <div className={cn(
//       'fixed inset-0 z-[300] flex items-center justify-center p-4 transition-all duration-300',
//       visible ? 'opacity-100' : 'opacity-0'
//     )}>
//       {/* Backdrop */}
//       <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />

//       {/* Modal */}
//       <div className={cn(
//         'relative w-full max-w-md rounded-3xl overflow-hidden transition-all duration-300',
//         visible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
//       )}
//         style={{ background: 'linear-gradient(145deg, #111827 0%, #0d1520 100%)',
//                  boxShadow: '0 0 0 1px rgba(255,255,255,0.07), 0 30px 60px -10px rgba(0,0,0,0.7), 0 0 60px -20px rgba(249,115,22,0.12)' }}
//       >
//         {/* Header */}
//         <div className="px-6 pt-6 pb-4 border-b border-white/[0.06]">
//           <div className="flex items-center gap-3 mb-1">
//             <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-black">S</div>
//             <div>
//               <p className="text-white font-bold text-sm">Choisir la voix de Sami</p>
//               <p className="text-slate-500 text-[11px]">Appuie sur 🔊 pour écouter un aperçu</p>
//             </div>
//           </div>
//         </div>

//         <div className="p-6 space-y-5">
//           {/* Sélection langue */}
//           <div className="flex gap-2">
//             {Object.entries(LANG_LABELS).map(([code, { flag, label }]) => (
//               <button key={code} onClick={() => setLang(code)}
//                 className={cn(
//                   'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all',
//                   lang === code
//                     ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
//                     : 'bg-white/[0.05] border border-white/[0.08] text-slate-400 hover:text-slate-200 hover:bg-white/[0.08]'
//                 )}>
//                 <span>{flag}</span> {label}
//               </button>
//             ))}
//           </div>

//           {/* Sélection voix */}
//           <div className="space-y-2">
//             {VOICES_BY_LANG[lang].map(v => (
//               <div key={v.id}
//                 onClick={() => setVoice(v.id)}
//                 className={cn(
//                   'flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all border',
//                   voice === v.id
//                     ? 'bg-orange-500/10 border-orange-500/30'
//                     : 'bg-white/[0.03] border-white/[0.07] hover:bg-white/[0.06] hover:border-white/[0.12]'
//                 )}>
//                 <div className="flex-1">
//                   <p className={cn('text-sm font-bold', voice === v.id ? 'text-orange-400' : 'text-slate-200')}>{v.label}</p>
//                   <p className="text-[11px] text-slate-500">{v.desc}</p>
//                 </div>
//                 <button
//                   onClick={e => { e.stopPropagation(); previewVoice(v.id); }}
//                   className={cn(
//                     'w-8 h-8 rounded-xl flex items-center justify-center transition-all',
//                     playing === v.id
//                       ? 'bg-orange-500/20 text-orange-400'
//                       : 'bg-white/[0.05] text-slate-400 hover:text-white hover:bg-white/[0.1]'
//                   )}>
//                   {playing === v.id
//                     ? <Volume2 size={14} className="animate-pulse" />
//                     : <Play size={12} />
//                   }
//                 </button>
//               </div>
//             ))}
//           </div>

//           {/* Actions */}
//           <div className="flex gap-3 pt-1">
//             <button onClick={onCancel}
//               className="flex-1 py-3 rounded-xl text-slate-400 text-sm font-medium bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-all">
//               Annuler
//             </button>
//             <button onClick={() => onStart(lang, voice)}
//               className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-bold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2">
//               <Mic size={16} /> Démarrer le live
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // LIVE — Conversation vocale
// // ─────────────────────────────────────────────────────────────────────────────
// const LiveSession = ({
//   lang,
//   voice,
//   onEnd,
// }: {
//   lang:  string;
//   voice: string;
//   onEnd: () => void;
// }) => {
//   const [voiceState,  setVoiceState]  = useState<VoiceState>('idle');
//   const [transcript,  setTranscript]  = useState('');
//   const [lines,       setLines]       = useState<Line[]>([]);
//   const [visible,     setVisible]     = useState(false);

//   const canvasRef    = useRef<HTMLCanvasElement>(null);
//   const activeRef    = useRef(false);
//   const speakingRef  = useRef(false);
//   const recordingRef = useRef(false);
//   const micRef       = useRef<MediaStream | null>(null);
//   const audioCtxRef  = useRef<AudioContext | null>(null);
//   const analyserRef  = useRef<AnalyserNode | null>(null);
//   const mediaRecRef  = useRef<MediaRecorder | null>(null);
//   const chunksRef    = useRef<BlobPart[]>([]);
//   const silTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const vadThreshRef = useRef(0.018);
//   const currentAudio = useRef<HTMLAudioElement | null>(null);
//   const animFrameRef = useRef<number>(0);
//   const phaseRef     = useRef(0);
//   const linesRef     = useRef<Line[]>([]);
//   const scrollRef    = useRef<HTMLDivElement>(null);

//   const { addMessage } = useChatStore();
//   const { setProfil }  = useSessionStore();

//   useEffect(() => { linesRef.current = lines; }, [lines]);
//   useEffect(() => { setTimeout(() => setVisible(true), 10); }, []);
//   useEffect(() => { scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight); }, [lines, transcript]);

//   // Waveform
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext('2d')!;
//     const W = canvas.width, H = canvas.height;
//     const BARS = 32;
//     const data = new Uint8Array(analyserRef.current?.frequencyBinCount ?? 32);

//     const draw = () => {
//       animFrameRef.current = requestAnimationFrame(draw);
//       ctx.clearRect(0, 0, W, H);
//       if (voiceState === 'listening') {
//         if (analyserRef.current) analyserRef.current.getByteFrequencyData(data);
//         const bW = (W - (BARS + 1) * 2) / BARS;
//         for (let i = 0; i < BARS; i++) {
//           const val = analyserRef.current ? data[Math.floor(i * data.length / BARS)] / 255 : (0.05 + Math.random() * 0.1);
//           const bH  = Math.max(3, val * (H - 12));
//           ctx.fillStyle = `rgba(249,115,22,${0.35 + val * 0.65})`;
//           ctx.beginPath();
//           ctx.roundRect(i * (bW + 2) + 2, (H - bH) / 2, bW, bH, Math.min(bW / 2, 3));
//           ctx.fill();
//         }
//       } else if (voiceState === 'speaking') {
//         phaseRef.current += 0.04;
//         const waves: [number, number, number, number][] = [[16, 2.2, 0, 0.9], [10, 3.5, 1.1, 0.55], [5, 5, 2.3, 0.3]];
//         waves.forEach(([amp, freq, off, a]) => {
//           ctx.globalAlpha = a; ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.5; ctx.beginPath();
//           for (let x = 0; x <= W; x += 2) {
//             const y = H / 2 + amp * Math.sin(freq * (x / W) * Math.PI * 2 + phaseRef.current + off);
//             x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
//           }
//           ctx.stroke();
//         });
//         ctx.globalAlpha = 1;
//       } else {
//         ctx.strokeStyle = 'rgba(148,163,184,0.12)'; ctx.lineWidth = 1.5; ctx.beginPath();
//         ctx.moveTo(20, H / 2); ctx.lineTo(W - 20, H / 2); ctx.stroke();
//       }
//     };
//     draw();
//     return () => cancelAnimationFrame(animFrameRef.current);
//   }, [voiceState]);

//   // Stop complet
//   const stopAll = useCallback(() => {
//     activeRef.current = false; speakingRef.current = false; recordingRef.current = false;
//     if (silTimerRef.current) clearTimeout(silTimerRef.current);
//     if (mediaRecRef.current?.state !== 'inactive') try { mediaRecRef.current?.stop(); } catch {}
//     micRef.current?.getTracks().forEach(t => t.stop()); micRef.current = null;
//     try { audioCtxRef.current?.close(); } catch {} audioCtxRef.current = null;
//     if (currentAudio.current) { currentAudio.current.pause(); currentAudio.current = null; }
//     setVoiceState('idle');
//   }, []);

//   // Jouer l'audio TTS
//   const playAudio = useCallback((b64: string): Promise<void> => new Promise(resolve => {
//     if (currentAudio.current) { currentAudio.current.pause(); currentAudio.current = null; }
//     speakingRef.current = true; setVoiceState('speaking');
//     const audio = new Audio('data:audio/mp3;base64,' + b64);
//     currentAudio.current = audio;
//     const done = () => {
//       currentAudio.current = null; speakingRef.current = false;
//       if (activeRef.current) setTimeout(() => { if (activeRef.current && !speakingRef.current) startListening(); }, 700);
//       resolve();
//     };
//     audio.onended = done;
//     audio.onerror = () => { speakingRef.current = false; if (activeRef.current) setTimeout(() => startListening(), 500); resolve(); };
//     audio.play().catch(() => { speakingRef.current = false; if (activeRef.current) setTimeout(() => startListening(), 500); resolve(); });
//   }), []); // eslint-disable-line

//   // Envoyer à SAMI
//   const sendToSami = useCallback(async (text: string) => {
//     if (!activeRef.current) return;
//     setVoiceState('thinking'); setTranscript('');

//     const uid = uuidv4();
//     addMessage({ id: uid, content: text, sender: 'user', created_at: new Date().toISOString() });
//     setLines(prev => [...prev, { id: uid, role: 'user', text }]);

//     try {
//       const res  = await fetch(`${API}/api/voice/chat`, {
//         method: 'POST', credentials: 'include',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ message: text, voice, lang }),
//       });
//       const data = await res.json();

//       const reply = data.text || '';
//       if (reply) {
//         const aid = uuidv4();
//         addMessage({ id: aid, content: reply, sender: 'ai', created_at: new Date().toISOString() });
//         setLines(prev => [...prev, { id: aid, role: 'ai', text: reply }]);
//         if (data.profil) { setProfil(data.profil as Parameters<typeof setProfil>[0]); window.dispatchEvent(new CustomEvent('sami:profile-updated')); }
//         if (data.audio && activeRef.current) await playAudio(data.audio);
//         else { speakingRef.current = false; if (activeRef.current) setTimeout(() => startListening(), 500); }
//       } else {
//         if (activeRef.current) setTimeout(() => startListening(), 400);
//       }
//     } catch (e) {
//       console.error('[Voice] Chat error:', e);
//       if (activeRef.current) setTimeout(() => startListening(), 500);
//     }
//   }, [lang, voice, addMessage, setProfil, playAudio]); // eslint-disable-line

//   // Transcrire audio
//   const transcribeAndSend = useCallback(async (blob: Blob) => {
//     if (!activeRef.current || blob.size < 600) {
//       setTimeout(() => { if (activeRef.current && !speakingRef.current) startListening(); }, 200);
//       return;
//     }
//     setVoiceState('thinking');
//     try {
//       const ext = blob.type.includes('mp4') ? 'm4a' : 'webm';
//       const fd  = new FormData();
//       fd.append('audio', blob, `voice.${ext}`);
//       fd.append('lang', lang);
//       const res  = await fetch(`${API}/api/voice/transcribe`, { method: 'POST', credentials: 'include', body: fd });
//       const data = await res.json();
//       const text = (data.text || '').trim();

//       if (isHallucination(text) || !text) {
//         if (activeRef.current && !speakingRef.current) setTimeout(() => startListening(), 200);
//         return;
//       }

//       const clean = text.replace(/^[.,!?;:\s]+|[.,!?;:\s]+$/g, '').trim();
//       if (!clean) { if (activeRef.current && !speakingRef.current) setTimeout(() => startListening(), 200); return; }

//       setTranscript(clean);
//       await sendToSami(clean);
//     } catch { if (activeRef.current && !speakingRef.current) setTimeout(() => startListening(), 500); }
//   }, [lang, sendToSami]); // eslint-disable-line

//   // VAD
//   const startVAD = useCallback(() => {
//     if (!analyserRef.current) {
//       silTimerRef.current = setTimeout(() => stopRec(), 5000);
//       return;
//     }
//     const buf = new Float32Array(analyserRef.current.fftSize);
//     const thr = vadThreshRef.current;
//     let sf = 0, silF = 0, total = 0, confirmed = false;
//     const SPEECH = 3, SIL_AFTER = 12, NO_SPEECH = 30, MAX = 100;
//     const tick = () => {
//       if (!activeRef.current || !recordingRef.current || speakingRef.current) return;
//       analyserRef.current!.getFloatTimeDomainData(buf);
//       const rms = Math.sqrt(buf.reduce((s, v) => s + v * v, 0) / buf.length);
//       total++;
//       if (rms > thr) { sf++; silF = 0; if (sf >= SPEECH) confirmed = true; }
//       else           { silF++; if (sf > 0) sf = Math.max(0, sf - 1); }
//       if (confirmed && silF >= SIL_AFTER) { stopRec(); return; }
//       if (total >= MAX && confirmed)       { stopRec(); return; }
//       if (!confirmed && total >= NO_SPEECH){ stopRec(); return; }
//       setTimeout(tick, 100);
//     };
//     tick();
//   }, []);

//   const stopRec = useCallback(() => {
//     if (silTimerRef.current) clearTimeout(silTimerRef.current);
//     if (mediaRecRef.current?.state === 'recording') try { mediaRecRef.current.stop(); } catch {}
//   }, []);

//   // Démarrer écoute
//   const startListening = useCallback(() => {
//     if (!activeRef.current || speakingRef.current || recordingRef.current) return;
//     recordingRef.current = true; chunksRef.current = [];
//     setVoiceState('listening'); setTranscript('');

//     let mime = 'audio/webm;codecs=opus';
//     if (!MediaRecorder.isTypeSupported(mime)) mime = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '';
//     try {
//       mediaRecRef.current = new MediaRecorder(micRef.current!, mime ? { mimeType: mime, audioBitsPerSecond: 128000 } : {});
//     } catch { mediaRecRef.current = new MediaRecorder(micRef.current!); }

//     mediaRecRef.current.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
//     mediaRecRef.current.onstop = async () => {
//       recordingRef.current = false;
//       if (!activeRef.current) return;
//       const blob = new Blob(chunksRef.current, { type: mediaRecRef.current!.mimeType });
//       await transcribeAndSend(blob);
//     };
//     mediaRecRef.current.start(100);
//     startVAD();
//   }, [transcribeAndSend, startVAD]); // eslint-disable-line

//   // Démarrer micro
//   useEffect(() => {
//     (async () => {
//       try {
//         micRef.current = await navigator.mediaDevices.getUserMedia({
//           audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, sampleRate: 16000, channelCount: 1 },
//         });
//       } catch { alert("Accès micro refusé."); onEnd(); return; }

//       activeRef.current = true;
//       try {
//         const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
//         const an  = ctx.createAnalyser(); an.fftSize = 128;
//         ctx.createMediaStreamSource(micRef.current!).connect(an);
//         audioCtxRef.current = ctx; analyserRef.current = an;

//         // Calibration VAD
//         const buf = new Float32Array(an.fftSize);
//         let nf = 0, nc = 0;
//         const calibrate = () => {
//           an.getFloatTimeDomainData(buf);
//           nf += Math.sqrt(buf.reduce((s, v) => s + v * v, 0) / buf.length);
//           nc++;
//           if (nc < 8) { setTimeout(calibrate, 100); return; }
//           vadThreshRef.current = Math.max((nf / nc) * 4, 0.012);
//           startListening();
//         };
//         setTimeout(calibrate, 50);
//       } catch { vadThreshRef.current = 0.018; startListening(); }
//     })();
//     return () => { stopAll(); };
//   }, []); // eslint-disable-line

//   const LABELS: Record<VoiceState, { title: string; color: string }> = {
//     idle:      { title: 'Initialisation…',              color: 'text-slate-400'  },
//     listening: { title: '🎙 Je vous écoute…',            color: 'text-orange-400' },
//     thinking:  { title: '⏳ Sami réfléchit…',            color: 'text-yellow-400' },
//     speaking:  { title: '🔊 Sami répond…',               color: 'text-sky-400'    },
//   };
//   const SUBS: Record<string, Record<VoiceState, string>> = {
//     fr: { idle: '',                              listening: 'Parlez librement — Sami répond auto', thinking: '', speaking: '' },
//     en: { idle: '',                              listening: 'Speak freely — Sami responds auto',   thinking: '', speaking: '' },
//     ar: { idle: '',                              listening: 'هضر — سامي غيوقف تلقاء',              thinking: '', speaking: '' },
//   };
//   const lbl = LABELS[voiceState];
//   const sub  = (SUBS[lang] || SUBS.fr)[voiceState];

//   return (
//     <div className={cn(
//       'fixed inset-0 z-[200] flex flex-col transition-all duration-300',
//       visible ? 'opacity-100' : 'opacity-0'
//     )}
//       style={{ background: 'radial-gradient(ellipse at 50% 0%, #0d1520 0%, #060a10 100%)' }}
//     >
//       {/* Grille déco */}
//       <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
//         style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)', backgroundSize: '44px 44px' }} />
//       <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
//         style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)' }} />

//       {/* Header */}
//       <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05] shrink-0">
//         <div className="flex items-center gap-3">
//           <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-black text-sm">S</div>
//           <div>
//             <p className="text-white font-bold text-sm leading-none">SAMI — Mode Live</p>
//             <p className="text-slate-500 text-[10px] mt-0.5">
//               {LANG_LABELS[lang]?.flag} {LANG_LABELS[lang]?.label} · {VOICES_BY_LANG[lang]?.find(v => v.id === voice)?.label}
//             </p>
//           </div>
//         </div>
//         <button onClick={() => { stopAll(); onEnd(); }}
//           className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all text-xs font-medium group">
//           <X size={13} className="group-hover:rotate-90 transition-transform duration-200" /> Fermer
//         </button>
//       </div>

//       {/* Zone centrale */}
//       <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6 py-4 overflow-hidden">

//         {/* Cercle micro */}
//         <div className="relative flex items-center justify-center">
//           {voiceState === 'listening' && [1, 2, 3].map(i => (
//             <div key={i} className="absolute rounded-full border border-orange-500/25"
//               style={{ width: `${80 + i * 48}px`, height: `${80 + i * 48}px`,
//                 animation: `ringpulse 2s ease-out ${(i - 1) * 0.55}s infinite` }} />
//           ))}
//           <div className={cn(
//             'relative z-10 w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300',
//             voiceState === 'listening' ? 'bg-gradient-to-br from-orange-500 to-red-600 shadow-orange-500/30 scale-110'
//             : voiceState === 'speaking' ? 'bg-gradient-to-br from-sky-500 to-blue-600 shadow-sky-500/30'
//             : voiceState === 'thinking' ? 'bg-gradient-to-br from-yellow-500 to-orange-500 shadow-yellow-500/20'
//             : 'bg-gradient-to-br from-slate-600 to-slate-700'
//           )}>
//             {voiceState === 'thinking' ? <Loader2 size={36} className="text-white animate-spin" />
//              : voiceState === 'speaking' ? <Volume2 size={36} className="text-white" />
//              : <Mic size={36} className="text-white" />}
//           </div>
//         </div>

//         {/* Labels */}
//         <div className="text-center" key={voiceState}>
//           <p className={cn('font-bold text-lg', lbl.color)}>{lbl.title}</p>
//           {sub && <p className="text-slate-500 text-sm mt-1">{sub}</p>}
//         </div>

//         {/* Waveform */}
//         <canvas ref={canvasRef} width={320} height={72} className="rounded-xl" style={{ maxWidth: '100%' }} />

//         {/* Transcript en cours */}
//         {transcript && (
//           <div className="px-5 py-3 rounded-2xl bg-white/[0.05] border border-white/[0.07] max-w-sm text-center">
//             <p className="text-slate-200 text-sm italic">« {transcript} »</p>
//           </div>
//         )}

//         {/* Historique */}
//         {lines.length > 0 && (
//           <div ref={scrollRef} className="w-full max-w-xl max-h-44 overflow-y-auto space-y-2 px-1"
//             style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.07) transparent' }}>
//             {lines.map(l => (
//               <div key={l.id} className={cn('flex gap-2 text-xs animate-in fade-in duration-200', l.role === 'user' ? 'justify-end' : 'justify-start')}>
//                 {l.role === 'ai' && <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] flex items-center justify-center shrink-0 mt-0.5">S</span>}
//                 <div className={cn('px-3 py-1.5 rounded-xl max-w-[80%] leading-relaxed',
//                   l.role === 'user' ? 'bg-[#006666]/50 text-slate-100 rounded-tr-sm' : 'bg-white/[0.05] text-slate-300 rounded-tl-sm border border-white/[0.06]')}>
//                   {l.text.length > 100 ? l.text.substring(0, 100) + '…' : l.text}
//                 </div>
//                 {l.role === 'user' && <span className="w-5 h-5 rounded-full bg-slate-700 text-slate-300 text-[10px] flex items-center justify-center shrink-0 mt-0.5">T</span>}
//               </div>
//             ))}
//           </div>
//         )}

//         {lines.length > 0 && (
//           <button onClick={() => { stopAll(); onEnd(); }}
//             className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07] text-slate-400 hover:text-slate-200 transition-all text-xs font-medium">
//             <MessageSquare size={13} /> Voir la conversation
//           </button>
//         )}
//       </div>

//       {/* Footer */}
//       <div className="shrink-0 text-center pb-6">
//         <button onClick={() => { stopAll(); onEnd(); }}
//           className="flex items-center gap-2 mx-auto px-6 py-2.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-white text-sm font-medium hover:bg-white/[0.1] transition-all">
//           <X size={14} className="text-red-400" /> Terminer le live
//         </button>
//       </div>

//       <style>{`
//         @keyframes ringpulse { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(1.8);opacity:0} }
//       `}</style>
//     </div>
//   );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // EXPORT PRINCIPAL
// // ─────────────────────────────────────────────────────────────────────────────
// export const LiveModeModal = ({ onClose }: { onClose: () => void }) => {
//   const [phase, setPhase] = useState<Phase>('picker');
//   const [lang,  setLang]  = useState('fr');
//   const [voice, setVoice] = useState('nova');

//   const handleStart = (l: string, v: string) => {
//     setLang(l); setVoice(v); setPhase('live');
//   };

//   if (phase === 'picker') return <VoicePicker onStart={handleStart} onCancel={onClose} />;
//   return <LiveSession lang={lang} voice={voice} onEnd={onClose} />;
// };


// 'use client';
// import { useEffect, useRef, useState, useCallback } from 'react';
// import { X, Mic, Volume2, Loader2, MessageSquare, Play, MicOff } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { v4 as uuidv4 } from 'uuid';
// import { createPortal } from 'react-dom';
// import { useChatStore }    from '@/store/chatStore';
// import { useSessionStore } from '@/store/sessionStore';

// const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// // ── getUserId ──────────────────────────────────────────────────────────────────
// function getUserId(): string {
//   try { return JSON.parse(localStorage.getItem('supmti-auth') || '{}')?.state?.user?.id || ''; }
//   catch { return ''; }
// }

// // ── persistProfilEnDB ─────────────────────────────────────────────────────────
// async function persistProfilEnDB(profil: Record<string, unknown>) {
//   const userId = getUserId();
//   if (!userId) return;
//   try {
//     const info  = (profil.informations_personnelles as any) || {};
//     const acad  = (profil.parcours_academique       as any) || {};
//     const pref  = (profil.preferences               as any) || {};
//     const payload: Record<string, unknown> = { user_id: userId };
//     if (info.prenom && info.prenom !== 'Étudiant')
//       payload.full_name = info.nom ? `${info.prenom} ${info.nom}`.trim() : info.prenom;
//     if (acad.moyenne_generale && Number(acad.moyenne_generale) > 0) payload.average  = acad.moyenne_generale;
//     if (acad.type_bac && acad.type_bac !== 'AUTRE')                 payload.bac_type = acad.label_bac || acad.type_bac;
//     if (acad.niveau_actuel)    payload.level = acad.niveau_actuel;
//     else if (acad.diplome_actuel) payload.level = acad.diplome_actuel;
//     if (info.ville) payload.city = info.ville;
//     const interets = pref.centres_interet;
//     if (Array.isArray(interets) && interets.length > 0) payload.interests = interets;
//     const hasData = ['full_name','average','bac_type','level','city','interests'].some(k => payload[k] !== undefined);
//     if (!hasData) return;
//     await fetch(`${API}/api/profil`, {
//       method: 'PUT', credentials: 'include',
//       headers: { 'Content-Type': 'application/json', 'X-User-Id': userId },
//       body: JSON.stringify(payload),
//     });
//   } catch {}
// }

// // ── Voix par langue ───────────────────────────────────────────────────────────
// const VOICES_BY_LANG: Record<string, { id: string; label: string; desc: string }[]> = {
//   fr: [
//     { id: 'nova',    label: 'Nova',    desc: 'Chaleureuse & naturelle' },
//     { id: 'shimmer', label: 'Shimmer', desc: 'Douce & expressive'      },
//     { id: 'echo',    label: 'Echo',    desc: 'Claire & posée'           },
//   ],
//   darija: [
//     { id: 'nova',    label: 'Nova',    desc: 'Darija marocaine - naturelle' },
//     { id: 'onyx',    label: 'Onyx',    desc: 'Darija marocaine - profonde'  },
//     { id: 'alloy',   label: 'Alloy',   desc: 'Darija marocaine - fluide'    },
//   ],
//   en: [
//     { id: 'alloy',   label: 'Alloy',   desc: 'Balanced & professional' },
//     { id: 'fable',   label: 'Fable',   desc: 'Warm & engaging'         },
//     { id: 'nova',    label: 'Nova',    desc: 'Warm & friendly'          },
//   ],
// };

// const LANG_LABELS: Record<string, { flag: string; label: string; whisper: string }> = {
//   fr:     { flag: '🇫🇷', label: 'Français', whisper: 'fr' },
//   darija: { flag: '🇲🇦', label: 'Darija',   whisper: 'ar' },
//   en:     { flag: '🇬🇧', label: 'English',  whisper: 'en' },
// };

// // ── Prompts Whisper spéciaux pour la darija latine ───────────────────────────
// // On force Whisper à transcrire en alphabet latin (pas arabe)
// const WHISPER_PROMPTS: Record<string, string> = {
//   fr: 'Conversation académique SUPMTI Meknès. Filières MGE MDI FACG MRI IISI IISIC IISRT.',
//   darija: 'wach kayn bghit chno 3ndek mzyan safi labas zwina dyali filiere supmti bac scolarite bourse mdrassa ndkhol IISI MGE MDI. Transcris en alphabet latin.',
//   en: 'Academic orientation SUPMTI Meknes. Programs MGE MDI FACG MRI IISI IISIC IISRT.',
// };

// // ── Anti-hallucination ────────────────────────────────────────────────────────
// const HALLUCINATION_PATTERNS = [
//   'sous-titres', 'amara.org', 'abonnez', 'merci d\'avoir regardé',
//   'thanks for watching', 'transcription by', 'mots courants',
//   'wach, kayn', 'kayn, bghit', 'filières: mge', 'conversation sur l\'orientation',
//   'academic orientation conversation', 'droits réservés',
// ];
// function isHallucination(text: string): boolean {
//   if (!text || text.length < 1) return true;
//   const lower = text.toLowerCase();
//   if (HALLUCINATION_PATTERNS.some(p => lower.includes(p))) return true;
//   if (text.trim().split(/\s+/).length > 120) return true;
//   return false;
// }

// type Phase      = 'picker' | 'live';
// type VoiceState = 'idle' | 'listening' | 'thinking' | 'speaking';
// interface Line  { id: string; role: 'user' | 'ai'; text: string; }

// // ─────────────────────────────────────────────────────────────────────────────
// // PICKER — Choix langue + voix
// // ─────────────────────────────────────────────────────────────────────────────
// const VoicePicker = ({ onStart, onCancel }: {
//   onStart: (lang: string, voice: string) => void;
//   onCancel: () => void;
// }) => {
//   const [lang,    setLang]    = useState('fr');
//   const [voice,   setVoice]   = useState('nova');
//   const [playing, setPlaying] = useState<string | null>(null);
//   const [visible, setVisible] = useState(false);

//   useEffect(() => { setTimeout(() => setVisible(true), 10); }, []);
//   useEffect(() => { setVoice(VOICES_BY_LANG[lang]?.[0]?.id ?? 'nova'); }, [lang]);

//   const previewVoice = async (voiceId: string) => {
//     setPlaying(voiceId);
//     const PREVIEW: Record<string, string> = {
//       fr:     'Bonjour, je suis Sami, votre conseiller académique à SUPMTI Meknès.',
//       darija: 'Labas, ana Sami, l-mstchar dyalek f SUPMTI Meknes. Kifach nqderha n3awnek ?',
//       en:     'Hello, I am Sami, your academic advisor at SUPMTI Meknes.',
//     };
//     try {
//       const res  = await fetch(`${API}/api/voice/tts`, {
//         method: 'POST', credentials: 'include',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text: PREVIEW[lang] || PREVIEW.fr, voice: voiceId }),
//       });
//       const data = await res.json();
//       if (data.audio) {
//         const audio = new Audio('data:audio/mp3;base64,' + data.audio);
//         audio.onended = () => setPlaying(null);
//         await audio.play();
//       }
//     } catch { setPlaying(null); }
//   };

//   return (
//     <div className={cn('fixed inset-0 z-[300] flex items-center justify-center p-4 transition-all duration-300', visible ? 'opacity-100' : 'opacity-0')}>
//       <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
//       <div className={cn('relative w-full max-w-md rounded-3xl overflow-hidden transition-all duration-300', visible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4')}
//         style={{ background: 'linear-gradient(145deg, #111827 0%, #0d1520 100%)', boxShadow: '0 0 0 1px rgba(255,255,255,0.07), 0 30px 60px -10px rgba(0,0,0,0.7)' }}>

//         <div className="px-6 pt-6 pb-4 border-b border-white/[0.06]">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-black">S</div>
//             <div>
//               <p className="text-white font-bold text-sm">Démarrer le Mode Live</p>
//               <p className="text-slate-500 text-[11px]">Conversation vocale temps réel avec SAMI</p>
//             </div>
//           </div>
//         </div>

//         <div className="p-6 space-y-5">
//           {/* Langue */}
//           <div>
//             <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold">Langue</p>
//             <div className="flex gap-2">
//               {Object.entries(LANG_LABELS).map(([code, { flag, label }]) => (
//                 <button key={code} onClick={() => setLang(code)}
//                   className={cn('flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all',
//                     lang === code ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25' : 'bg-white/[0.05] border border-white/[0.08] text-slate-400 hover:text-slate-200')}>
//                   <span>{flag}</span> {label}
//                 </button>
//               ))}
//             </div>
//             {lang === 'darija' && (
//               <p className="text-[10px] text-orange-400/80 mt-2 text-center">
//                 🇲🇦 La darija sera transcrite en alphabet latin (wach, kayn, bghit…)
//               </p>
//             )}
//           </div>

//           {/* Voix */}
//           <div>
//             <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold">Voix de SAMI</p>
//             <div className="space-y-2">
//               {VOICES_BY_LANG[lang].map(v => (
//                 <div key={v.id} onClick={() => setVoice(v.id)}
//                   className={cn('flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all border',
//                     voice === v.id ? 'bg-orange-500/10 border-orange-500/30' : 'bg-white/[0.03] border-white/[0.07] hover:bg-white/[0.06]')}>
//                   <div className="flex-1">
//                     <p className={cn('text-sm font-bold', voice === v.id ? 'text-orange-400' : 'text-slate-200')}>{v.label}</p>
//                     <p className="text-[11px] text-slate-500">{v.desc}</p>
//                   </div>
//                   <button onClick={e => { e.stopPropagation(); previewVoice(v.id); }}
//                     className={cn('w-8 h-8 rounded-xl flex items-center justify-center transition-all',
//                       playing === v.id ? 'bg-orange-500/20 text-orange-400' : 'bg-white/[0.05] text-slate-400 hover:text-white')}>
//                     {playing === v.id ? <Volume2 size={14} className="animate-pulse" /> : <Play size={12} />}
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="flex gap-3 pt-1">
//             <button onClick={onCancel} className="flex-1 py-3 rounded-xl text-slate-400 text-sm font-medium bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-all">Annuler</button>
//             <button onClick={() => onStart(lang, voice)} className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25">
//               <Mic size={16} /> Démarrer le live
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // LIVE SESSION — Conversation temps réel
// // ─────────────────────────────────────────────────────────────────────────────
// const LiveSession = ({ lang, voice, onEnd }: { lang: string; voice: string; onEnd: () => void; }) => {
//   const [voiceState, setVoiceState] = useState<VoiceState>('idle');
//   const [transcript, setTranscript] = useState('');
//   const [lines,      setLines]      = useState<Line[]>([]);
//   const [visible,    setVisible]    = useState(false);

//   const canvasRef    = useRef<HTMLCanvasElement>(null);
//   const activeRef    = useRef(false);
//   const speakingRef  = useRef(false);
//   const recordingRef = useRef(false);
//   const micRef       = useRef<MediaStream | null>(null);
//   const audioCtxRef  = useRef<AudioContext | null>(null);
//   const analyserRef  = useRef<AnalyserNode | null>(null);
//   const mediaRecRef  = useRef<MediaRecorder | null>(null);
//   const chunksRef    = useRef<BlobPart[]>([]);
//   const silTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const vadThreshRef = useRef(0.018);
//   const currentAudio = useRef<HTMLAudioElement | null>(null);
//   const animFrameRef = useRef<number>(0);
//   const phaseRef     = useRef(0);
//   const scrollRef    = useRef<HTMLDivElement>(null);

//   const { addMessage }   = useChatStore();
//   const { setProfil }    = useSessionStore();

//   useEffect(() => { setTimeout(() => setVisible(true), 10); }, []);
//   useEffect(() => { scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight); }, [lines, transcript]);

//   // ── Waveform canvas ────────────────────────────────────────
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext('2d')!;
//     const W = canvas.width, H = canvas.height, BARS = 32;
//     const data = new Uint8Array(analyserRef.current?.frequencyBinCount ?? 32);
//     const draw = () => {
//       animFrameRef.current = requestAnimationFrame(draw);
//       ctx.clearRect(0, 0, W, H);
//       if (voiceState === 'listening') {
//         if (analyserRef.current) analyserRef.current.getByteFrequencyData(data);
//         const bW = (W - (BARS + 1) * 2) / BARS;
//         for (let i = 0; i < BARS; i++) {
//           const val = analyserRef.current ? data[Math.floor(i * data.length / BARS)] / 255 : (0.05 + Math.random() * 0.08);
//           const bH  = Math.max(3, val * (H - 12));
//           ctx.fillStyle = `rgba(249,115,22,${0.35 + val * 0.65})`;
//           ctx.beginPath(); ctx.roundRect(i * (bW + 2) + 2, (H - bH) / 2, bW, bH, Math.min(bW / 2, 3)); ctx.fill();
//         }
//       } else if (voiceState === 'speaking') {
//         phaseRef.current += 0.04;
//         const waves: [number, number, number, number][] = [[16, 2.2, 0, 0.9], [10, 3.5, 1.1, 0.55], [5, 5, 2.3, 0.3]];
//         waves.forEach(([amp, freq, off, a]) => {
//           ctx.globalAlpha = a; ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.5; ctx.beginPath();
//           for (let x = 0; x <= W; x += 2) {
//             const y = H / 2 + amp * Math.sin(freq * (x / W) * Math.PI * 2 + phaseRef.current + off);
//             x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
//           }
//           ctx.stroke();
//         });
//         ctx.globalAlpha = 1;
//       } else if (voiceState === 'thinking') {
//         ctx.fillStyle = 'rgba(234,179,8,0.15)';
//         for (let i = 0; i < 3; i++) {
//           const x = W / 2 + (i - 1) * 20;
//           const y = H / 2 + Math.sin(phaseRef.current * 3 + i) * 8;
//           ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
//         }
//         phaseRef.current += 0.05;
//       } else {
//         ctx.strokeStyle = 'rgba(148,163,184,0.1)'; ctx.lineWidth = 1.5;
//         ctx.beginPath(); ctx.moveTo(20, H / 2); ctx.lineTo(W - 20, H / 2); ctx.stroke();
//       }
//     };
//     draw();
//     return () => cancelAnimationFrame(animFrameRef.current);
//   }, [voiceState]);

//   // ── Stop tout ──────────────────────────────────────────────
//   const stopAll = useCallback(() => {
//     activeRef.current = false; speakingRef.current = false; recordingRef.current = false;
//     if (silTimerRef.current) clearTimeout(silTimerRef.current);
//     if (mediaRecRef.current?.state !== 'inactive') try { mediaRecRef.current?.stop(); } catch {}
//     micRef.current?.getTracks().forEach(t => t.stop()); micRef.current = null;
//     try { audioCtxRef.current?.close(); } catch {}
//     audioCtxRef.current = null; analyserRef.current = null;
//     if (currentAudio.current) { currentAudio.current.pause(); currentAudio.current = null; }
//     setVoiceState('idle');
//   }, []);

//   // ── Lecture audio TTS ──────────────────────────────────────
//   const playAudio = useCallback((b64: string): Promise<void> => new Promise(resolve => {
//     if (currentAudio.current) { currentAudio.current.pause(); currentAudio.current = null; }
//     speakingRef.current = true; setVoiceState('speaking');
//     const audio = new Audio('data:audio/mp3;base64,' + b64);
//     currentAudio.current = audio;
//     const done = () => {
//       currentAudio.current = null; speakingRef.current = false;
//       if (activeRef.current) setTimeout(() => { if (activeRef.current && !speakingRef.current) startListening(); }, 600);
//       resolve();
//     };
//     audio.onended = done;
//     audio.onerror = () => { speakingRef.current = false; if (activeRef.current) setTimeout(() => startListening(), 400); resolve(); };
//     audio.play().catch(() => { speakingRef.current = false; if (activeRef.current) setTimeout(() => startListening(), 400); resolve(); });
//   }), []); // eslint-disable-line

//   // ── Envoyer à SAMI ─────────────────────────────────────────
//   const sendToSami = useCallback(async (text: string) => {
//     if (!activeRef.current) return;
//     setVoiceState('thinking'); setTranscript('');

//     const uid = uuidv4();
//     // Ajouter au chat principal
//     addMessage({ id: uid, content: text, sender: 'user', created_at: new Date().toISOString() });
//     setLines(prev => [...prev, { id: uid, role: 'user', text }]);

//     // Déterminer la langue backend à envoyer
//     // Pour darija → on envoie "darija_latin" au backend
//     const backendLang = lang === 'darija' ? 'darija_latin' : lang;

//     try {
//       const res = await fetch(`${API}/api/voice/chat`, {
//         method: 'POST', credentials: 'include',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ message: text, voice, lang: backendLang }),
//       });
//       const data = await res.json();
//       const reply = data.text || '';

//       if (reply) {
//         const aid = uuidv4();
//         // Ajouter au chat principal
//         addMessage({ id: aid, content: reply, sender: 'ai', created_at: new Date().toISOString() });
//         setLines(prev => [...prev, { id: aid, role: 'ai', text: reply }]);

//         // Persister profil si mis à jour
//         if (data.profil) {
//           setProfil(data.profil as Parameters<typeof setProfil>[0]);
//           await persistProfilEnDB(data.profil as Record<string, unknown>);
//           window.dispatchEvent(new CustomEvent('sami:profile-updated'));
//         }

//         // Jouer l'audio
//         if (data.audio && activeRef.current) await playAudio(data.audio);
//         else { speakingRef.current = false; if (activeRef.current) setTimeout(() => startListening(), 400); }
//       } else {
//         if (activeRef.current) setTimeout(() => startListening(), 300);
//       }
//     } catch (e) {
//       console.error('[Live] Erreur SAMI:', e);
//       if (activeRef.current) setTimeout(() => startListening(), 500);
//     }
//   }, [lang, voice, addMessage, setProfil, playAudio]); // eslint-disable-line

//   // ── Transcrire + Envoyer ───────────────────────────────────
//   const transcribeAndSend = useCallback(async (blob: Blob) => {
//     if (!activeRef.current || blob.size < 600) {
//       setTimeout(() => { if (activeRef.current && !speakingRef.current) startListening(); }, 200);
//       return;
//     }
//     setVoiceState('thinking');
//     try {
//       const ext = blob.type.includes('mp4') ? 'm4a' : 'webm';
//       const fd  = new FormData();
//       fd.append('audio', blob, `voice.${ext}`);
//       // Pour darija, on envoie lang=darija au backend pour que Whisper utilise le bon prompt
//       fd.append('lang', lang);

//       const res  = await fetch(`${API}/api/voice/transcribe`, { method: 'POST', credentials: 'include', body: fd });
//       const data = await res.json();
//       const text = (data.text || '').trim();

//       if (!text || isHallucination(text)) {
//         if (activeRef.current && !speakingRef.current) setTimeout(() => startListening(), 200);
//         return;
//       }

//       // Afficher le transcript détecté
//       const clean = text.replace(/^[.,!?;:\s]+|[.,!?;:\s]+$/g, '').trim();
//       if (!clean) { if (activeRef.current && !speakingRef.current) setTimeout(() => startListening(), 200); return; }

//       setTranscript(clean);
//       await sendToSami(clean);
//     } catch {
//       if (activeRef.current && !speakingRef.current) setTimeout(() => startListening(), 500);
//     }
//   }, [lang, sendToSami]); // eslint-disable-line

//   // ── VAD (Voice Activity Detection) ────────────────────────
//   const startVAD = useCallback(() => {
//     if (!analyserRef.current) { silTimerRef.current = setTimeout(() => stopRec(), 5000); return; }
//     const buf = new Float32Array(analyserRef.current.fftSize);
//     const thr = vadThreshRef.current;
//     let sf = 0, silF = 0, total = 0, confirmed = false;
//     const SPEECH = 3, SIL_AFTER = 20, NO_SPEECH = 40, MAX = 1200;
//     let speechDuration = 0;
//     const tick = () => {
//       if (!activeRef.current || !recordingRef.current || speakingRef.current) return;
//       analyserRef.current!.getFloatTimeDomainData(buf);
//       const rms = Math.sqrt(buf.reduce((s, v) => s + v * v, 0) / buf.length);
//       total++;
//     if (rms > thr) {
//         sf++;
//         silF = 0;
//         speechDuration++;
//         if (sf >= SPEECH) confirmed = true;}
//     else           { silF++; if (sf > 0) sf = Math.max(0, sf - 1); }
//       if (confirmed && silF >= SIL_AFTER && speechDuration > 8) {
//         stopRec();
//         return; }

//       if (total >= MAX && confirmed)       { stopRec(); return; }
//       if (!confirmed && total >= NO_SPEECH){ stopRec(); return; }
//       setTimeout(tick, 100);
//     };
//     tick();
//   }, []);

//   const stopRec = useCallback(() => {
//     if (silTimerRef.current) clearTimeout(silTimerRef.current);
//     if (mediaRecRef.current?.state === 'recording') try { mediaRecRef.current.stop(); } catch {}
//   }, []);

//   // ── Démarrer écoute ────────────────────────────────────────
//   const startListening = useCallback(() => {
//     if (!activeRef.current || speakingRef.current || recordingRef.current) return;
//     recordingRef.current = true; chunksRef.current = [];
//     setVoiceState('listening'); setTranscript('');

//     let mime = 'audio/webm;codecs=opus';
//     if (!MediaRecorder.isTypeSupported(mime)) mime = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '';
//     try { mediaRecRef.current = new MediaRecorder(micRef.current!, mime ? { mimeType: mime, audioBitsPerSecond: 128000 } : {}); }
//     catch { mediaRecRef.current = new MediaRecorder(micRef.current!); }

//     mediaRecRef.current.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
//     mediaRecRef.current.onstop = async () => {
//       recordingRef.current = false;
//       if (!activeRef.current) return;
//       const blob = new Blob(chunksRef.current, { type: mediaRecRef.current!.mimeType });
//       await transcribeAndSend(blob);
//     };
//     mediaRecRef.current.start(100);
//     startVAD();
//   }, [transcribeAndSend, startVAD]); // eslint-disable-line

//   // ── Init micro ─────────────────────────────────────────────
//   useEffect(() => {
//     (async () => {
//       try {
//         micRef.current = await navigator.mediaDevices.getUserMedia({
//           audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, sampleRate: 16000, channelCount: 1 },
//         });
//       } catch { alert('Accès micro refusé.'); onEnd(); return; }

//       activeRef.current = true;
//       try {
//         const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
//         const an  = ctx.createAnalyser(); an.fftSize = 128;
//         ctx.createMediaStreamSource(micRef.current!).connect(an);
//         audioCtxRef.current = ctx; analyserRef.current = an;

//         // Calibration VAD
//         const buf = new Float32Array(an.fftSize);
//         let nf = 0, nc = 0;
//         const calibrate = () => {
//           an.getFloatTimeDomainData(buf);
//           nf += Math.sqrt(buf.reduce((s, v) => s + v * v, 0) / buf.length);
//           nc++;
//           if (nc < 8) { setTimeout(calibrate, 100); return; }
//           vadThreshRef.current = Math.max((nf / nc) * 4, 0.012);
//           startListening();
//         };
//         setTimeout(calibrate, 50);
//       } catch { vadThreshRef.current = 0.018; startListening(); }
//     })();
//     return () => { stopAll(); };
//   }, []); // eslint-disable-line

//   const LABELS: Record<VoiceState, { title: string; sub: string; color: string }> = {
//     idle:      { title: 'Initialisation…',          sub: '',                                    color: 'text-slate-400'  },
//     listening: { title: '🎙 Je t\'écoute…',           sub: 'Parle librement — SAMI répond auto', color: 'text-orange-400' },
//     thinking:  { title: '⏳ SAMI réfléchit…',          sub: 'Traitement en cours',                color: 'text-yellow-400' },
//     speaking:  { title: '🔊 SAMI répond…',             sub: 'Lecture audio en cours',              color: 'text-sky-400'    },
//   };
//   if (lang === 'darija') {
//     LABELS.listening.title = '🎙 Hder, kan3awwd…';
//     LABELS.listening.sub   = 'Hder b-darija — SAMI ghayjaoueb';
//     LABELS.speaking.title  = '🔊 SAMI kayhder…';
//   }

//   const lbl = LABELS[voiceState];

//   // ── Fin de session : pousser tout dans le chat principal ──
//   const handleEnd = useCallback(() => {
//     stopAll();
//     // Dispatche un event pour que ChatWindow scroll en bas
//     window.dispatchEvent(new CustomEvent('sami:live-ended'));
//     onEnd();
//   }, [stopAll, onEnd]);

//   return (
//     <div className={cn('fixed inset-0 z-[200] flex flex-col transition-all duration-300', visible ? 'opacity-100' : 'opacity-0')}
//       style={{ background: 'radial-gradient(ellipse at 50% 0%, #0d1520 0%, #060a10 100%)' }}>

//       {/* Grille décorative */}
//       <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
//         style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)', backgroundSize: '44px 44px' }} />
//       <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
//         style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.05) 0%, transparent 70%)' }} />

//       {/* Header */}
//       <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05] shrink-0">
//         <div className="flex items-center gap-3">
//           <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-black text-sm">S</div>
//           <div>
//             <p className="text-white font-bold text-sm leading-none">SAMI — Mode Live</p>
//             <p className="text-slate-500 text-[10px] mt-0.5">
//               {LANG_LABELS[lang]?.flag} {LANG_LABELS[lang]?.label} · {VOICES_BY_LANG[lang]?.find(v => v.id === voice)?.label || voice}
//             </p>
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           {/* Indicateur live */}
//           <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
//             <span className="relative flex h-2 w-2">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
//               <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
//             </span>
//             <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest">Live</span>
//           </div>
//           <button onClick={handleEnd}
//             className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-400 hover:text-white transition-all text-xs font-medium group">
//             <X size={13} className="group-hover:rotate-90 transition-transform duration-200" /> Terminer
//           </button>
//         </div>
//       </div>

//       {/* Zone centrale */}
//       <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6 py-4 overflow-hidden">

//         {/* Cercle micro animé */}
//         <div className="relative flex items-center justify-center">
//           {voiceState === 'listening' && [1, 2, 3].map(i => (
//             <div key={i} className="absolute rounded-full border border-orange-500/20"
//               style={{ width: `${80 + i * 48}px`, height: `${80 + i * 48}px`,
//                 animation: `ringpulse 2s ease-out ${(i - 1) * 0.55}s infinite` }} />
//           ))}
//           <div className={cn(
//             'relative z-10 w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300',
//             voiceState === 'listening' ? 'bg-gradient-to-br from-orange-500 to-red-600 shadow-orange-500/30 scale-110'
//             : voiceState === 'speaking' ? 'bg-gradient-to-br from-sky-500 to-blue-600 shadow-sky-500/30'
//             : voiceState === 'thinking' ? 'bg-gradient-to-br from-yellow-500 to-orange-500 shadow-yellow-500/20'
//             : 'bg-gradient-to-br from-slate-600 to-slate-700'
//           )}>
//             {voiceState === 'thinking' ? <Loader2 size={36} className="text-white animate-spin" />
//              : voiceState === 'speaking' ? <Volume2 size={36} className="text-white" />
//              : voiceState === 'listening' ? <Mic size={36} className="text-white" />
//              : <MicOff size={36} className="text-slate-400" />}
//           </div>
//         </div>

//         {/* Label état */}
//         <div className="text-center" key={voiceState}>
//           <p className={cn('font-bold text-lg', lbl.color)}>{lbl.title}</p>
//           {lbl.sub && <p className="text-slate-500 text-sm mt-1">{lbl.sub}</p>}
//         </div>

//         {/* Waveform */}
//         <canvas ref={canvasRef} width={320} height={72} className="rounded-xl" style={{ maxWidth: '100%' }} />

//         {/* Transcript en cours */}
//         {transcript && (
//           <div className="px-5 py-3 rounded-2xl bg-white/[0.05] border border-white/[0.07] max-w-sm text-center animate-in fade-in duration-300">
//             <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Tu as dit</p>
//             <p className="text-slate-200 text-sm italic">« {transcript} »</p>
//           </div>
//         )}

//         {/* Historique de la session live */}
//         {lines.length > 0 && (
//           <div ref={scrollRef} className="w-full max-w-xl max-h-48 overflow-y-auto space-y-2 px-1"
//             style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.07) transparent' }}>
//             {lines.map(l => (
//               <div key={l.id} className={cn('flex gap-2 text-xs animate-in fade-in duration-200', l.role === 'user' ? 'justify-end' : 'justify-start')}>
//                 {l.role === 'ai' && (
//                   <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] flex items-center justify-center shrink-0 mt-0.5">S</span>
//                 )}
//                 <div className={cn('px-3 py-1.5 rounded-xl max-w-[80%] leading-relaxed',
//                   l.role === 'user'
//                     ? 'bg-[#006666]/50 text-slate-100 rounded-tr-sm'
//                     : 'bg-white/[0.05] text-slate-300 rounded-tl-sm border border-white/[0.06]')}>
//                   {l.text.length > 120 ? l.text.substring(0, 120) + '…' : l.text}
//                 </div>
//                 {l.role === 'user' && (
//                   <span className="w-5 h-5 rounded-full bg-slate-700 text-slate-300 text-[10px] flex items-center justify-center shrink-0 mt-0.5">T</span>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Bouton voir conversation */}
//         {lines.length > 0 && (
//           <button onClick={handleEnd}
//             className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07] text-slate-400 hover:text-slate-200 transition-all text-xs font-medium">
//             <MessageSquare size={13} /> Voir la conversation complète
//           </button>
//         )}
//       </div>

//       {/* Footer */}
//       <div className="shrink-0 text-center pb-6 px-6">
//         <p className="text-[10px] text-slate-600 mb-3">
//           Toutes les réponses sont automatiquement enregistrées dans le chat principal
//         </p>
//         <button onClick={handleEnd}
//           className="flex items-center gap-2 mx-auto px-6 py-2.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-white text-sm font-medium hover:bg-white/[0.1] transition-all">
//           <X size={14} className="text-red-400" /> Terminer le live
//         </button>
//       </div>

//       <style>{`
//         @keyframes ringpulse { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(1.8);opacity:0} }
//       `}</style>
//     </div>
//   );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // EXPORT PRINCIPAL
// // ─────────────────────────────────────────────────────────────────────────────
// export const LiveModeModal = ({ onClose }: { onClose: () => void }) => {
//   const [phase, setPhase] = useState<Phase>('picker');
//   const [lang,  setLang]  = useState('fr');
//   const [voice, setVoice] = useState('nova');

//   const handleStart = (l: string, v: string) => { setLang(l); setVoice(v); setPhase('live'); };

//   if (phase === 'picker') return <VoicePicker onStart={handleStart} onCancel={onClose} />;
//   return <LiveSession lang={lang} voice={voice} onEnd={onClose} />;
// };




// 'use client';

// import { useEffect, useRef, useState, useCallback } from 'react';
// import {
//   X,
//   Mic,
//   Volume2,
//   Loader2,
//   MessageSquare,
//   Play,
//   MicOff,
// } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { v4 as uuidv4 } from 'uuid';
// import { useChatStore } from '@/store/chatStore';

// const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// function getUserId(): string {
//   try {
//     return JSON.parse(localStorage.getItem('supmti-auth') || '{}')?.state?.user?.id || '';
//   } catch {
//     return '';
//   }
// }

// const VOICES_BY_LANG: Record<string, { id: string; label: string; desc: string }[]> = {
//   fr: [
//     { id: 'nova', label: 'Nova', desc: 'Chaleureuse & naturelle' },
//     { id: 'shimmer', label: 'Shimmer', desc: 'Douce & expressive' },
//     { id: 'echo', label: 'Echo', desc: 'Claire & posée' },
//   ],
//   darija: [
//     { id: 'nova', label: 'Nova', desc: 'Darija marocaine - naturelle' },
//     { id: 'onyx', label: 'Onyx', desc: 'Darija marocaine - profonde' },
//     { id: 'alloy', label: 'Alloy', desc: 'Darija marocaine - fluide' },
//   ],
//   en: [
//     { id: 'alloy', label: 'Alloy', desc: 'Balanced & professional' },
//     { id: 'fable', label: 'Fable', desc: 'Warm & engaging' },
//     { id: 'nova', label: 'Nova', desc: 'Warm & friendly' },
//   ],
// };

// const LANG_LABELS: Record<string, { flag: string; label: string; whisper: string }> = {
//   fr: { flag: '🇫🇷', label: 'Français', whisper: 'fr' },
//   darija: { flag: '🇲🇦', label: 'Darija', whisper: 'ar' },
//   en: { flag: '🇬🇧', label: 'English', whisper: 'en' },
// };

// const WHISPER_PROMPTS: Record<string, string> = {
//   fr: 'Conversation académique SUPMTI Meknès. Filières MGE MDI FACG MRI IISI IISIC IISRT.',
//   darija:
//     'wach kayn bghit chno 3ndek mzyan safi labas zwina dyali filiere supmti bac scolarite bourse mdrassa ndkhol IISI MGE MDI. Transcris en alphabet latin.',
//   en: 'Academic orientation SUPMTI Meknes. Programs MGE MDI FACG MRI IISI IISIC IISRT.',
// };

// const HALLUCINATION_PATTERNS = [
//   'sous-titres',
//   'amara.org',
//   'abonnez',
//   "merci d'avoir regardé",
//   'thanks for watching',
//   'transcription by',
//   'mots courants',
//   'wach, kayn',
//   'kayn, bghit',
//   'filières: mge',
//   "conversation sur l'orientation",
//   'academic orientation conversation',
//   'droits réservés',
// ];

// function isHallucination(text: string): boolean {
//   if (!text || text.length < 1) return true;
//   const lower = text.toLowerCase();
//   if (HALLUCINATION_PATTERNS.some((p) => lower.includes(p))) return true;
//   if (text.trim().split(/\s+/).length > 120) return true;
//   return false;
// }

// type Phase = 'picker' | 'live';
// type VoiceState = 'idle' | 'listening' | 'thinking' | 'speaking';

// interface Line {
//   id: string;
//   role: 'user' | 'ai';
//   text: string;
// }

// /* -------------------------------------------------------------------------- */
// /* PICKER                                                                     */
// /* -------------------------------------------------------------------------- */

// const VoicePicker = ({
//   onStart,
//   onCancel,
// }: {
//   onStart: (lang: string, voice: string) => void;
//   onCancel: () => void;
// }) => {
//   const [lang, setLang] = useState('fr');
//   const [voice, setVoice] = useState('nova');
//   const [playing, setPlaying] = useState<string | null>(null);
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     setTimeout(() => setVisible(true), 10);
//   }, []);

//   useEffect(() => {
//     setVoice(VOICES_BY_LANG[lang]?.[0]?.id ?? 'nova');
//   }, [lang]);

//   const previewVoice = async (voiceId: string) => {
//     setPlaying(voiceId);

//     const PREVIEW: Record<string, string> = {
//       fr: 'Bonjour, je suis Sami, votre conseiller académique à SUPMTI Meknès.',
//       darija: "Labas, ana Sami, l-mstchar dyalek f SUPMTI Meknes. Kifach nqder n3awnek ?",
//       en: 'Hello, I am Sami, your academic advisor at SUPMTI Meknes.',
//     };

//     try {
//       const res = await fetch(`${API}/api/voice/tts`, {
//         method: 'POST',
//         credentials: 'include',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text: PREVIEW[lang] || PREVIEW.fr, voice: voiceId }),
//       });

//       const data = await res.json();
//       if (data.audio) {
//         const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
//         audio.onended = () => setPlaying(null);
//         await audio.play();
//       } else {
//         setPlaying(null);
//       }
//     } catch {
//       setPlaying(null);
//     }
//   };

//   return (
//     <div
//       className={cn(
//         'fixed inset-0 z-[300] flex items-center justify-center p-4 transition-all duration-300',
//         visible ? 'opacity-100' : 'opacity-0'
//       )}
//     >
//       <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />

//       <div
//         className={cn(
//           'relative w-full max-w-md rounded-3xl overflow-hidden transition-all duration-300',
//           visible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
//         )}
//         style={{
//           background: 'linear-gradient(145deg, #111827 0%, #0d1520 100%)',
//           boxShadow: '0 0 0 1px rgba(255,255,255,0.07), 0 30px 60px -10px rgba(0,0,0,0.7)',
//         }}
//       >
//         <div className="px-6 pt-6 pb-4 border-b border-white/[0.06]">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-black">
//               S
//             </div>
//             <div>
//               <p className="text-white font-bold text-sm">Démarrer le Mode Live</p>
//               <p className="text-slate-500 text-[11px]">Conversation vocale temps réel avec SAMI</p>
//             </div>
//           </div>
//         </div>

//         <div className="p-6 space-y-5">
//           <div>
//             <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold">
//               Langue
//             </p>
//             <div className="flex gap-2">
//               {Object.entries(LANG_LABELS).map(([code, { flag, label }]) => (
//                 <button
//                   key={code}
//                   onClick={() => setLang(code)}
//                   className={cn(
//                     'flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all',
//                     lang === code
//                       ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
//                       : 'bg-white/[0.05] border border-white/[0.08] text-slate-400 hover:text-slate-200'
//                   )}
//                 >
//                   <span>{flag}</span>
//                   {label}
//                 </button>
//               ))}
//             </div>

//             {lang === 'darija' && (
//               <p className="text-[10px] text-orange-400/80 mt-2 text-center">
//                 🇲🇦 La darija sera transcrite en alphabet latin
//               </p>
//             )}
//           </div>

//           <div>
//             <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold">
//               Voix de SAMI
//             </p>

//             <div className="space-y-2">
//               {VOICES_BY_LANG[lang].map((v) => (
//                 <div
//                   key={v.id}
//                   onClick={() => setVoice(v.id)}
//                   className={cn(
//                     'flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all border',
//                     voice === v.id
//                       ? 'bg-orange-500/10 border-orange-500/30'
//                       : 'bg-white/[0.03] border-white/[0.07] hover:bg-white/[0.06]'
//                   )}
//                 >
//                   <div className="flex-1">
//                     <p
//                       className={cn(
//                         'text-sm font-bold',
//                         voice === v.id ? 'text-orange-400' : 'text-slate-200'
//                       )}
//                     >
//                       {v.label}
//                     </p>
//                     <p className="text-[11px] text-slate-500">{v.desc}</p>
//                   </div>

//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       previewVoice(v.id);
//                     }}
//                     className={cn(
//                       'w-8 h-8 rounded-xl flex items-center justify-center transition-all',
//                       playing === v.id
//                         ? 'bg-orange-500/20 text-orange-400'
//                         : 'bg-white/[0.05] text-slate-400 hover:text-white'
//                     )}
//                   >
//                     {playing === v.id ? (
//                       <Volume2 size={14} className="animate-pulse" />
//                     ) : (
//                       <Play size={12} />
//                     )}
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="flex gap-3 pt-1">
//             <button
//               onClick={onCancel}
//               className="flex-1 py-3 rounded-xl text-slate-400 text-sm font-medium bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-all"
//             >
//               Annuler
//             </button>

//             <button
//               onClick={() => onStart(lang, voice)}
//               className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25"
//             >
//               <Mic size={16} />
//               Démarrer le live
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* -------------------------------------------------------------------------- */
// /* LIVE SESSION                                                               */
// /* -------------------------------------------------------------------------- */

// const LiveSession = ({
//   lang,
//   voice,
//   onEnd,
// }: {
//   lang: string;
//   voice: string;
//   onEnd: () => void;
// }) => {
//   const [voiceState, setVoiceState] = useState<VoiceState>('idle');
//   const [transcript, setTranscript] = useState('');
//   const [lines, setLines] = useState<Line[]>([]);
//   const [visible, setVisible] = useState(false);

//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const activeRef = useRef(false);
//   const speakingRef = useRef(false);
//   const recordingRef = useRef(false);
//   const micRef = useRef<MediaStream | null>(null);
//   const audioCtxRef = useRef<AudioContext | null>(null);
//   const analyserRef = useRef<AnalyserNode | null>(null);
//   const mediaRecRef = useRef<MediaRecorder | null>(null);
//   const chunksRef = useRef<BlobPart[]>([]);
//   const silTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const vadThreshRef = useRef(0.018);
//   const currentAudio = useRef<HTMLAudioElement | null>(null);
//   const animFrameRef = useRef<number>(0);
//   const phaseRef = useRef(0);
//   const scrollRef = useRef<HTMLDivElement>(null);

//   const { addMessage } = useChatStore();

//   useEffect(() => {
//     setTimeout(() => setVisible(true), 10);
//   }, []);

//   useEffect(() => {
//     scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
//   }, [lines, transcript]);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d')!;
//     const W = canvas.width;
//     const H = canvas.height;
//     const BARS = 32;
//     const data = new Uint8Array(analyserRef.current?.frequencyBinCount ?? 32);

//     const draw = () => {
//       animFrameRef.current = requestAnimationFrame(draw);
//       ctx.clearRect(0, 0, W, H);

//       if (voiceState === 'listening') {
//         if (analyserRef.current) analyserRef.current.getByteFrequencyData(data);
//         const bW = (W - (BARS + 1) * 2) / BARS;

//         for (let i = 0; i < BARS; i++) {
//           const val = analyserRef.current
//             ? data[Math.floor((i * data.length) / BARS)] / 255
//             : 0.05 + Math.random() * 0.08;
//           const bH = Math.max(3, val * (H - 12));
//           ctx.fillStyle = `rgba(249,115,22,${0.35 + val * 0.65})`;
//           ctx.beginPath();
//           (ctx as any).roundRect(i * (bW + 2) + 2, (H - bH) / 2, bW, bH, Math.min(bW / 2, 3));
//           ctx.fill();
//         }
//       } else if (voiceState === 'speaking') {
//         phaseRef.current += 0.04;
//         const waves: [number, number, number, number][] = [
//           [16, 2.2, 0, 0.9],
//           [10, 3.5, 1.1, 0.55],
//           [5, 5, 2.3, 0.3],
//         ];

//         waves.forEach(([amp, freq, off, a]) => {
//           ctx.globalAlpha = a;
//           ctx.strokeStyle = '#38bdf8';
//           ctx.lineWidth = 2.5;
//           ctx.beginPath();

//           for (let x = 0; x <= W; x += 2) {
//             const y = H / 2 + amp * Math.sin(freq * (x / W) * Math.PI * 2 + phaseRef.current + off);
//             x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
//           }

//           ctx.stroke();
//         });

//         ctx.globalAlpha = 1;
//       } else if (voiceState === 'thinking') {
//         ctx.fillStyle = 'rgba(234,179,8,0.15)';
//         for (let i = 0; i < 3; i++) {
//           const x = W / 2 + (i - 1) * 20;
//           const y = H / 2 + Math.sin(phaseRef.current * 3 + i) * 8;
//           ctx.beginPath();
//           ctx.arc(x, y, 5, 0, Math.PI * 2);
//           ctx.fill();
//         }
//         phaseRef.current += 0.05;
//       } else {
//         ctx.strokeStyle = 'rgba(148,163,184,0.1)';
//         ctx.lineWidth = 1.5;
//         ctx.beginPath();
//         ctx.moveTo(20, H / 2);
//         ctx.lineTo(W - 20, H / 2);
//         ctx.stroke();
//       }
//     };

//     draw();
//     return () => cancelAnimationFrame(animFrameRef.current);
//   }, [voiceState]);

//   const stopAll = useCallback(() => {
//     activeRef.current = false;
//     speakingRef.current = false;
//     recordingRef.current = false;

//     if (silTimerRef.current) clearTimeout(silTimerRef.current);

//     if (mediaRecRef.current?.state !== 'inactive') {
//       try {
//         mediaRecRef.current?.stop();
//       } catch {}
//     }

//     micRef.current?.getTracks().forEach((t) => t.stop());
//     micRef.current = null;

//     try {
//       audioCtxRef.current?.close();
//     } catch {}

//     audioCtxRef.current = null;
//     analyserRef.current = null;

//     if (currentAudio.current) {
//       currentAudio.current.pause();
//       currentAudio.current = null;
//     }

//     setVoiceState('idle');
//   }, []);

//   const playAudio = useCallback(
//     async (b64: string) =>
//       new Promise<void>((resolve) => {
//         if (currentAudio.current) {
//           currentAudio.current.pause();
//           currentAudio.current = null;
//         }

//         speakingRef.current = true;
//         setVoiceState('speaking');

//         const audio = new Audio(`data:audio/mp3;base64,${b64}`);
//         currentAudio.current = audio;

//         const done = () => {
//           currentAudio.current = null;
//           speakingRef.current = false;
//           if (activeRef.current) {
//             setTimeout(() => {
//               if (activeRef.current && !speakingRef.current) startListening();
//             }, 600);
//           }
//           resolve();
//         };

//         audio.onended = done;
//         audio.onerror = () => {
//           speakingRef.current = false;
//           if (activeRef.current) setTimeout(() => startListening(), 400);
//           resolve();
//         };

//         audio.play().catch(() => {
//           speakingRef.current = false;
//           if (activeRef.current) setTimeout(() => startListening(), 400);
//           resolve();
//         });
//       }),
//     []
//   ); // eslint-disable-line

//   const streamChatResponse = useCallback(
//     async (text: string) => {
//       const userId = getUserId();
//       const res = await fetch(`${API}/chat/stream`, {
//         method: 'POST',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//           ...(userId ? { 'X-User-Id': userId } : {}),
//         },
//         body: JSON.stringify({
//           message: text,
//           student_id: userId || null,
//         }),
//       });

//       if (!res.ok || !res.body) {
//         throw new Error('Streaming unavailable');
//       }

//       const reader = res.body.getReader();
//       const decoder = new TextDecoder();
//       let buffer = '';
//       let full = '';
//       let aiLineId = uuidv4();
//       let aiInserted = false;

//       const upsertAiLine = (content: string) => {
//         setLines((prev) => {
//           const idx = prev.findIndex((l) => l.id === aiLineId);
//           if (idx === -1) return [...prev, { id: aiLineId, role: 'ai', text: content }];
//           const copy = [...prev];
//           copy[idx] = { ...copy[idx], text: content };
//           return copy;
//         });
//       };

//       while (true) {
//         const { value, done } = await reader.read();
//         if (done) break;

//         buffer += decoder.decode(value, { stream: true });
//         const events = buffer.split('\n\n');
//         buffer = events.pop() || '';

//         for (const evt of events) {
//           const line = evt
//             .split('\n')
//             .find((l) => l.startsWith('data:'));

//           if (!line) continue;

//           const raw = line.replace(/^data:\s*/, '');

//           try {
//             const payload = JSON.parse(raw);

//             if (payload.done) {
//               return full.trim();
//             }

//             if (typeof payload.full === 'string') {
//               full = payload.full;
//               if (!aiInserted) aiInserted = true;
//               upsertAiLine(full);
//             } else if (typeof payload.chunk === 'string') {
//               full += payload.chunk;
//               if (!aiInserted) aiInserted = true;
//               upsertAiLine(full);
//             }
//           } catch {
//             // ignore malformed chunk
//           }
//         }
//       }

//       return full.trim();
//     },
//     []
//   );

//   const requestTTS = useCallback(
//     async (text: string) => {
//       const res = await fetch(`${API}/api/voice/tts`, {
//         method: 'POST',
//         credentials: 'include',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text, voice }),
//       });

//       const data = await res.json().catch(() => ({}));
//       return data?.audio || null;
//     },
//     [voice]
//   );

//   const sendToSami = useCallback(
//     async (text: string) => {
//       if (!activeRef.current) return;

//       setVoiceState('thinking');
//       setTranscript('');

//       const uid = uuidv4();

//       addMessage({
//         id: uid,
//         content: text,
//         sender: 'user',
//         created_at: new Date().toISOString(),
//       });

//       setLines((prev) => [...prev, { id: uid, role: 'user', text }]);

//       try {
//         const reply = await streamChatResponse(text);

//         if (reply) {
//           addMessage({
//             id: uuidv4(),
//             content: reply,
//             sender: 'ai',
//             created_at: new Date().toISOString(),
//           });

//           const audioB64 = await requestTTS(reply);

//           if (audioB64 && activeRef.current) {
//             await playAudio(audioB64);
//           } else {
//             speakingRef.current = false;
//             if (activeRef.current) setTimeout(() => startListening(), 400);
//           }
//         } else {
//           if (activeRef.current) setTimeout(() => startListening(), 300);
//         }
//       } catch (e) {
//         console.error('[Live] Erreur stream SAMI:', e);
//         if (activeRef.current) setTimeout(() => startListening(), 500);
//       }
//     },
//     [addMessage, playAudio, requestTTS, streamChatResponse]
//   ); // eslint-disable-line

//   const transcribeAndSend = useCallback(
//     async (blob: Blob) => {
//       if (!activeRef.current || blob.size < 600) {
//         setTimeout(() => {
//           if (activeRef.current && !speakingRef.current) startListening();
//         }, 200);
//         return;
//       }

//       setVoiceState('thinking');

//       try {
//         const ext = blob.type.includes('mp4') ? 'm4a' : 'webm';
//         const fd = new FormData();
//         fd.append('audio', blob, `voice.${ext}`);
//         fd.append('lang', lang);
//         fd.append('prompt', WHISPER_PROMPTS[lang] || WHISPER_PROMPTS.fr);

//         const res = await fetch(`${API}/api/voice/transcribe`, {
//           method: 'POST',
//           credentials: 'include',
//           body: fd,
//         });

//         const data = await res.json();
//         const text = (data.text || '').trim();

//         if (!text || isHallucination(text)) {
//           if (activeRef.current && !speakingRef.current) {
//             setTimeout(() => startListening(), 200);
//           }
//           return;
//         }

//         const clean = text.replace(/^[.,!?;:\s]+|[.,!?;:\s]+$/g, '').trim();

//         if (!clean) {
//           if (activeRef.current && !speakingRef.current) {
//             setTimeout(() => startListening(), 200);
//           }
//           return;
//         }

//         setTranscript(clean);
//         await sendToSami(clean);
//       } catch {
//         if (activeRef.current && !speakingRef.current) {
//           setTimeout(() => startListening(), 500);
//         }
//       }
//     },
//     [lang, sendToSami]
//   ); // eslint-disable-line

//   const stopRec = useCallback(() => {
//     if (silTimerRef.current) clearTimeout(silTimerRef.current);
//     if (mediaRecRef.current?.state === 'recording') {
//       try {
//         mediaRecRef.current.stop();
//       } catch {}
//     }
//   }, []);

//   const startVAD = useCallback(() => {
//     if (!analyserRef.current) {
//       silTimerRef.current = setTimeout(() => stopRec(), 5000);
//       return;
//     }

//     const buf = new Float32Array(analyserRef.current.fftSize);
//     const thr = vadThreshRef.current;

//     let sf = 0;
//     let silF = 0;
//     let total = 0;
//     let confirmed = false;
//     let speechDuration = 0;

//     const SPEECH = 3;
//     const SIL_AFTER = 20;
//     const NO_SPEECH = 40;
//     const MAX = 1200;

//     const tick = () => {
//       if (!activeRef.current || !recordingRef.current || speakingRef.current) return;

//       analyserRef.current!.getFloatTimeDomainData(buf);
//       const rms = Math.sqrt(buf.reduce((s, v) => s + v * v, 0) / buf.length);
//       total++;

//       if (rms > thr) {
//         sf++;
//         silF = 0;
//         speechDuration++;
//         if (sf >= SPEECH) confirmed = true;
//       } else {
//         silF++;
//         if (sf > 0) sf = Math.max(0, sf - 1);
//       }

//       if (confirmed && silF >= SIL_AFTER && speechDuration > 8) {
//         stopRec();
//         return;
//       }

//       if (total >= MAX && confirmed) {
//         stopRec();
//         return;
//       }

//       if (!confirmed && total >= NO_SPEECH) {
//         stopRec();
//         return;
//       }

//       setTimeout(tick, 100);
//     };

//     tick();
//   }, [stopRec]);

//   const startListening = useCallback(() => {
//     if (!activeRef.current || speakingRef.current || recordingRef.current) return;

//     recordingRef.current = true;
//     chunksRef.current = [];
//     setVoiceState('listening');
//     setTranscript('');

//     let mime = 'audio/webm;codecs=opus';
//     if (!MediaRecorder.isTypeSupported(mime)) {
//       mime = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '';
//     }

//     try {
//       mediaRecRef.current = new MediaRecorder(
//         micRef.current!,
//         mime ? { mimeType: mime, audioBitsPerSecond: 128000 } : {}
//       );
//     } catch {
//       mediaRecRef.current = new MediaRecorder(micRef.current!);
//     }

//     mediaRecRef.current.ondataavailable = (e) => {
//       if (e.data.size > 0) chunksRef.current.push(e.data);
//     };

//     mediaRecRef.current.onstop = async () => {
//       recordingRef.current = false;
//       if (!activeRef.current) return;

//       const blob = new Blob(chunksRef.current, { type: mediaRecRef.current!.mimeType });
//       await transcribeAndSend(blob);
//     };

//     mediaRecRef.current.start(100);
//     startVAD();
//   }, [startVAD, transcribeAndSend]);

//   useEffect(() => {
//     (async () => {
//       try {
//         micRef.current = await navigator.mediaDevices.getUserMedia({
//           audio: {
//             echoCancellation: true,
//             noiseSuppression: true,
//             autoGainControl: true,
//             sampleRate: 16000,
//             channelCount: 1,
//           },
//         });
//       } catch {
//         alert('Accès micro refusé.');
//         onEnd();
//         return;
//       }

//       activeRef.current = true;

//       try {
//         const Ctx = window.AudioContext || (window as any).webkitAudioContext;
//         const ctx = new Ctx();
//         const an = ctx.createAnalyser();
//         an.fftSize = 128;

//         ctx.createMediaStreamSource(micRef.current!).connect(an);
//         audioCtxRef.current = ctx;
//         analyserRef.current = an;

//         const buf = new Float32Array(an.fftSize);
//         let nf = 0;
//         let nc = 0;

//         const calibrate = () => {
//           an.getFloatTimeDomainData(buf);
//           nf += Math.sqrt(buf.reduce((s, v) => s + v * v, 0) / buf.length);
//           nc++;

//           if (nc < 8) {
//             setTimeout(calibrate, 100);
//             return;
//           }

//           vadThreshRef.current = Math.max((nf / nc) * 4, 0.012);
//           startListening();
//         };

//         setTimeout(calibrate, 50);
//       } catch {
//         vadThreshRef.current = 0.018;
//         startListening();
//       }
//     })();

//     return () => {
//       stopAll();
//     };
//   }, [onEnd, startListening, stopAll]);

//   const LABELS: Record<VoiceState, { title: string; sub: string; color: string }> = {
//     idle: { title: 'Initialisation…', sub: '', color: 'text-slate-400' },
//     listening: {
//       title: "🎙 Je t'écoute…",
//       sub: 'Parle librement — SAMI répond auto',
//       color: 'text-orange-400',
//     },
//     thinking: {
//       title: '⏳ SAMI réfléchit…',
//       sub: 'Traitement en cours',
//       color: 'text-yellow-400',
//     },
//     speaking: {
//       title: '🔊 SAMI répond…',
//       sub: 'Lecture audio en cours',
//       color: 'text-sky-400',
//     },
//   };

//   if (lang === 'darija') {
//     LABELS.listening.title = '🎙 Hder, kan3awwd…';
//     LABELS.listening.sub = 'Hder b-darija — SAMI ghayjaoueb';
//     LABELS.speaking.title = '🔊 SAMI kayhder…';
//   }

//   const lbl = LABELS[voiceState];

//   const handleEnd = useCallback(() => {
//     stopAll();
//     window.dispatchEvent(new CustomEvent('sami:live-ended'));
//     onEnd();
//   }, [onEnd, stopAll]);

//   return (
//     <div
//       className={cn(
//         'fixed inset-0 z-[200] flex flex-col transition-all duration-300',
//         visible ? 'opacity-100' : 'opacity-0'
//       )}
//       style={{ background: 'radial-gradient(ellipse at 50% 0%, #0d1520 0%, #060a10 100%)' }}
//     >
//       <div
//         className="absolute inset-0 pointer-events-none opacity-[0.02]"
//         style={{
//           backgroundImage:
//             'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)',
//           backgroundSize: '44px 44px',
//         }}
//       />
//       <div
//         className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
//         style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.05) 0%, transparent 70%)' }}
//       />

//       <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05] shrink-0">
//         <div className="flex items-center gap-3">
//           <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-black text-sm">
//             S
//           </div>

//           <div>
//             <p className="text-white font-bold text-sm leading-none">SAMI — Mode Live</p>
//             <p className="text-slate-500 text-[10px] mt-0.5">
//               {LANG_LABELS[lang]?.flag} {LANG_LABELS[lang]?.label} ·{' '}
//               {VOICES_BY_LANG[lang]?.find((v) => v.id === voice)?.label || voice}
//             </p>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
//             <span className="relative flex h-2 w-2">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
//               <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
//             </span>
//             <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest">
//               Live
//             </span>
//           </div>

//           <button
//             onClick={handleEnd}
//             className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-400 hover:text-white transition-all text-xs font-medium group"
//           >
//             <X size={13} className="group-hover:rotate-90 transition-transform duration-200" />
//             Terminer
//           </button>
//         </div>
//       </div>

//       <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6 py-4 overflow-hidden">
//         <div className="relative flex items-center justify-center">
//           {voiceState === 'listening' &&
//             [1, 2, 3].map((i) => (
//               <div
//                 key={i}
//                 className="absolute rounded-full border border-orange-500/20"
//                 style={{
//                   width: `${80 + i * 48}px`,
//                   height: `${80 + i * 48}px`,
//                   animation: `ringpulse 2s ease-out ${(i - 1) * 0.55}s infinite`,
//                 }}
//               />
//             ))}

//           <div
//             className={cn(
//               'relative z-10 w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300',
//               voiceState === 'listening'
//                 ? 'bg-gradient-to-br from-orange-500 to-red-600 shadow-orange-500/30 scale-110'
//                 : voiceState === 'speaking'
//                 ? 'bg-gradient-to-br from-sky-500 to-blue-600 shadow-sky-500/30'
//                 : voiceState === 'thinking'
//                 ? 'bg-gradient-to-br from-yellow-500 to-orange-500 shadow-yellow-500/20'
//                 : 'bg-gradient-to-br from-slate-600 to-slate-700'
//             )}
//           >
//             {voiceState === 'thinking' ? (
//               <Loader2 size={36} className="text-white animate-spin" />
//             ) : voiceState === 'speaking' ? (
//               <Volume2 size={36} className="text-white" />
//             ) : voiceState === 'listening' ? (
//               <Mic size={36} className="text-white" />
//             ) : (
//               <MicOff size={36} className="text-slate-400" />
//             )}
//           </div>
//         </div>

//         <div className="text-center" key={voiceState}>
//           <p className={cn('font-bold text-lg', lbl.color)}>{lbl.title}</p>
//           {lbl.sub && <p className="text-slate-500 text-sm mt-1">{lbl.sub}</p>}
//         </div>

//         <canvas
//           ref={canvasRef}
//           width={320}
//           height={72}
//           className="rounded-xl"
//           style={{ maxWidth: '100%' }}
//         />

//         {transcript && (
//           <div className="px-5 py-3 rounded-2xl bg-white/[0.05] border border-white/[0.07] max-w-sm text-center animate-in fade-in duration-300">
//             <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Tu as dit</p>
//             <p className="text-slate-200 text-sm italic">« {transcript} »</p>
//           </div>
//         )}

//         {lines.length > 0 && (
//           <div
//             ref={scrollRef}
//             className="w-full max-w-xl max-h-48 overflow-y-auto space-y-2 px-1"
//             style={{
//               scrollbarWidth: 'thin',
//               scrollbarColor: 'rgba(255,255,255,0.07) transparent',
//             }}
//           >
//             {lines.map((l) => (
//               <div
//                 key={l.id}
//                 className={cn(
//                   'flex gap-2 text-xs animate-in fade-in duration-200',
//                   l.role === 'user' ? 'justify-end' : 'justify-start'
//                 )}
//               >
//                 {l.role === 'ai' && (
//                   <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] flex items-center justify-center shrink-0 mt-0.5">
//                     S
//                   </span>
//                 )}

//                 <div
//                   className={cn(
//                     'px-3 py-1.5 rounded-xl max-w-[80%] leading-relaxed',
//                     l.role === 'user'
//                       ? 'bg-[#006666]/50 text-slate-100 rounded-tr-sm'
//                       : 'bg-white/[0.05] text-slate-300 rounded-tl-sm border border-white/[0.06]'
//                   )}
//                 >
//                   {l.text.length > 220 ? `${l.text.substring(0, 220)}…` : l.text}
//                 </div>

//                 {l.role === 'user' && (
//                   <span className="w-5 h-5 rounded-full bg-slate-700 text-slate-300 text-[10px] flex items-center justify-center shrink-0 mt-0.5">
//                     T
//                   </span>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}

//         {lines.length > 0 && (
//           <button
//             onClick={handleEnd}
//             className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07] text-slate-400 hover:text-slate-200 transition-all text-xs font-medium"
//           >
//             <MessageSquare size={13} />
//             Voir la conversation complète
//           </button>
//         )}
//       </div>

//       <div className="shrink-0 text-center pb-6 px-6">
//         <p className="text-[10px] text-slate-600 mb-3">
//           Toutes les réponses sont automatiquement enregistrées dans le chat principal
//         </p>

//         <button
//           onClick={handleEnd}
//           className="flex items-center gap-2 mx-auto px-6 py-2.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-white text-sm font-medium hover:bg-white/[0.1] transition-all"
//         >
//           <X size={14} className="text-red-400" />
//           Terminer le live
//         </button>
//       </div>

//       <style>{`
//         @keyframes ringpulse {
//           0% { transform: scale(1); opacity: .6; }
//           100% { transform: scale(1.8); opacity: 0; }
//         }
//       `}</style>
//     </div>
//   );
// };

// /* -------------------------------------------------------------------------- */
// /* EXPORT PRINCIPAL                                                           */
// /* -------------------------------------------------------------------------- */

// export const LiveModeModal = ({ onClose }: { onClose: () => void }) => {
//   const [phase, setPhase] = useState<Phase>('picker');
//   const [lang, setLang] = useState('fr');
//   const [voice, setVoice] = useState('nova');

//   const handleStart = (l: string, v: string) => {
//     setLang(l);
//     setVoice(v);
//     setPhase('live');
//   };

//   if (phase === 'picker') {
//     return <VoicePicker onStart={handleStart} onCancel={onClose} />;
//   }

//   return <LiveSession lang={lang} voice={voice} onEnd={onClose} />;
// };
















'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  X,
  Mic,
  Volume2,
  Loader2,
  MessageSquare,
  Play,
  MicOff,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { useChatStore } from '@/store/chatStore';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

function getUserId(): string {
  try {
    return JSON.parse(localStorage.getItem('supmti-auth') || '{}')?.state?.user?.id || '';
  } catch {
    return '';
  }
}

const VOICES_BY_LANG: Record<string, { id: string; label: string; desc: string }[]> = {
  fr: [
    { id: 'nova', label: 'Nova', desc: 'Chaleureuse & naturelle' },
    { id: 'shimmer', label: 'Shimmer', desc: 'Douce & expressive' },
    { id: 'echo', label: 'Echo', desc: 'Claire & posée' },
  ],
  darija: [
    { id: 'nova', label: 'Nova', desc: 'Darija marocaine - naturelle' },
    { id: 'onyx', label: 'Onyx', desc: 'Darija marocaine - profonde' },
    { id: 'alloy', label: 'Alloy', desc: 'Darija marocaine - fluide' },
  ],
  en: [
    { id: 'alloy', label: 'Alloy', desc: 'Balanced & professional' },
    { id: 'fable', label: 'Fable', desc: 'Warm & engaging' },
    { id: 'nova', label: 'Nova', desc: 'Warm & friendly' },
  ],
};

const LANG_LABELS: Record<string, { flag: string; label: string; whisper: string }> = {
  fr: { flag: '🇫🇷', label: 'Français', whisper: 'fr' },
  darija: { flag: '🇲🇦', label: 'Darija', whisper: 'ar' },
  en: { flag: '🇬🇧', label: 'English', whisper: 'en' },
};

const WHISPER_PROMPTS: Record<string, string> = {
  fr: 'Conversation académique SUPMTI Meknès. Filières MGE MDI FACG MRI IISI IISIC IISRT.',
  darija:
    'wach kayn bghit chno 3ndek mzyan safi labas zwina dyali filiere supmti bac scolarite bourse mdrassa ndkhol IISI MGE MDI. Transcris en alphabet latin.',
  en: 'Academic orientation SUPMTI Meknes. Programs MGE MDI FACG MRI IISI IISIC IISRT.',
};

const HALLUCINATION_PATTERNS = [
  'sous-titres',
  'amara.org',
  'abonnez',
  "merci d'avoir regardé",
  'thanks for watching',
  'transcription by',
  'mots courants',
  'wach, kayn',
  'kayn, bghit',
  'filières: mge',
  "conversation sur l'orientation",
  'academic orientation conversation',
  'droits réservés',
];

function isHallucination(text: string): boolean {
  if (!text || text.length < 1) return true;
  const lower = text.toLowerCase();
  if (HALLUCINATION_PATTERNS.some((p) => lower.includes(p))) return true;
  if (text.trim().split(/\s+/).length > 120) return true;
  return false;
}

type Phase = 'picker' | 'live';
type VoiceState = 'idle' | 'listening' | 'thinking' | 'speaking';

interface Line {
  id: string;
  role: 'user' | 'ai';
  text: string;
}

/* -------------------------------------------------------------------------- */
/* PICKER                                                                     */
/* -------------------------------------------------------------------------- */

const VoicePicker = ({
  onStart,
  onCancel,
}: {
  onStart: (lang: string, voice: string) => void;
  onCancel: () => void;
}) => {
  const [lang, setLang] = useState('fr');
  const [voice, setVoice] = useState('nova');
  const [playing, setPlaying] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 10);
  }, []);

  useEffect(() => {
    setVoice(VOICES_BY_LANG[lang]?.[0]?.id ?? 'nova');
  }, [lang]);

  const previewVoice = async (voiceId: string) => {
    setPlaying(voiceId);

    const PREVIEW: Record<string, string> = {
      fr: 'Bonjour, je suis Sami, votre conseiller académique à SUPMTI Meknès.',
      darija: "Labas, ana Sami, l-mstchar dyalek f SUPMTI Meknes. Kifach nqder n3awnek ?",
      en: 'Hello, I am Sami, your academic advisor at SUPMTI Meknes.',
    };

    try {
      const res = await fetch(`${API}/api/voice/tts`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: PREVIEW[lang] || PREVIEW.fr, voice: voiceId }),
      });

      const data = await res.json();
      if (data.audio) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
        audio.onended = () => setPlaying(null);
        await audio.play();
      } else {
        setPlaying(null);
      }
    } catch {
      setPlaying(null);
    }
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-[300] flex items-center justify-center p-4 transition-all duration-300',
        visible ? 'opacity-100' : 'opacity-0'
      )}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />

      <div
        className={cn(
          'relative w-full max-w-md rounded-3xl overflow-hidden transition-all duration-300',
          visible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        )}
        style={{
          background: 'linear-gradient(145deg, #111827 0%, #0d1520 100%)',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.07), 0 30px 60px -10px rgba(0,0,0,0.7)',
        }}
      >
        <div className="px-6 pt-6 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-black">
              S
            </div>
            <div>
              <p className="text-white font-bold text-sm">Démarrer le Mode Live</p>
              <p className="text-slate-500 text-[11px]">Conversation vocale temps réel avec SAMI</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold">
              Langue
            </p>
            <div className="flex gap-2">
              {Object.entries(LANG_LABELS).map(([code, { flag, label }]) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all',
                    lang === code
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                      : 'bg-white/[0.05] border border-white/[0.08] text-slate-400 hover:text-slate-200'
                  )}
                >
                  <span>{flag}</span>
                  {label}
                </button>
              ))}
            </div>

            {lang === 'darija' && (
              <p className="text-[10px] text-orange-400/80 mt-2 text-center">
                🇲🇦 La darija sera transcrite en alphabet latin
              </p>
            )}
          </div>

          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold">
              Voix de SAMI
            </p>

            <div className="space-y-2">
              {VOICES_BY_LANG[lang].map((v) => (
                <div
                  key={v.id}
                  onClick={() => setVoice(v.id)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all border',
                    voice === v.id
                      ? 'bg-orange-500/10 border-orange-500/30'
                      : 'bg-white/[0.03] border-white/[0.07] hover:bg-white/[0.06]'
                  )}
                >
                  <div className="flex-1">
                    <p
                      className={cn(
                        'text-sm font-bold',
                        voice === v.id ? 'text-orange-400' : 'text-slate-200'
                      )}
                    >
                      {v.label}
                    </p>
                    <p className="text-[11px] text-slate-500">{v.desc}</p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      previewVoice(v.id);
                    }}
                    className={cn(
                      'w-8 h-8 rounded-xl flex items-center justify-center transition-all',
                      playing === v.id
                        ? 'bg-orange-500/20 text-orange-400'
                        : 'bg-white/[0.05] text-slate-400 hover:text-white'
                    )}
                  >
                    {playing === v.id ? (
                      <Volume2 size={14} className="animate-pulse" />
                    ) : (
                      <Play size={12} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl text-slate-400 text-sm font-medium bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-all"
            >
              Annuler
            </button>

            <button
              onClick={() => onStart(lang, voice)}
              className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25"
            >
              <Mic size={16} />
              Démarrer le live
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* LIVE SESSION                                                               */
/* -------------------------------------------------------------------------- */

const LiveSession = ({
  lang,
  voice,
  onEnd,
}: {
  lang: string;
  voice: string;
  onEnd: () => void;
}) => {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState('');
  const [lines, setLines] = useState<Line[]>([]);
  const [visible, setVisible] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(false);
  const speakingRef = useRef(false);
  const recordingRef = useRef(false);
  const micRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaRecRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const silTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const vadThreshRef = useRef(0.018);
  const currentAudio = useRef<HTMLAudioElement | null>(null);
  const animFrameRef = useRef<number>(0);
  const phaseRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const startListeningRef = useRef<(() => void) | null>(null);

  const { addMessage } = useChatStore();

  useEffect(() => {
    setTimeout(() => setVisible(true), 10);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [lines, transcript]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    const W = canvas.width;
    const H = canvas.height;
    const BARS = 32;
    const data = new Uint8Array(analyserRef.current?.frequencyBinCount ?? 32);

    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);

      if (voiceState === 'listening') {
        if (analyserRef.current) analyserRef.current.getByteFrequencyData(data);
        const bW = (W - (BARS + 1) * 2) / BARS;

        for (let i = 0; i < BARS; i++) {
          const val = analyserRef.current
            ? data[Math.floor((i * data.length) / BARS)] / 255
            : 0.05 + Math.random() * 0.08;
          const bH = Math.max(3, val * (H - 12));
          ctx.fillStyle = `rgba(249,115,22,${0.35 + val * 0.65})`;
          ctx.beginPath();
          (ctx as any).roundRect(i * (bW + 2) + 2, (H - bH) / 2, bW, bH, Math.min(bW / 2, 3));
          ctx.fill();
        }
      } else if (voiceState === 'speaking') {
        phaseRef.current += 0.04;
        const waves: [number, number, number, number][] = [
          [16, 2.2, 0, 0.9],
          [10, 3.5, 1.1, 0.55],
          [5, 5, 2.3, 0.3],
        ];

        waves.forEach(([amp, freq, off, a]) => {
          ctx.globalAlpha = a;
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2.5;
          ctx.beginPath();

          for (let x = 0; x <= W; x += 2) {
            const y = H / 2 + amp * Math.sin(freq * (x / W) * Math.PI * 2 + phaseRef.current + off);
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }

          ctx.stroke();
        });

        ctx.globalAlpha = 1;
      } else if (voiceState === 'thinking') {
        ctx.fillStyle = 'rgba(234,179,8,0.15)';
        for (let i = 0; i < 3; i++) {
          const x = W / 2 + (i - 1) * 20;
          const y = H / 2 + Math.sin(phaseRef.current * 3 + i) * 8;
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fill();
        }
        phaseRef.current += 0.05;
      } else {
        ctx.strokeStyle = 'rgba(148,163,184,0.1)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(20, H / 2);
        ctx.lineTo(W - 20, H / 2);
        ctx.stroke();
      }
    };

    draw();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [voiceState]);

  const stopAll = useCallback(() => {
    activeRef.current = false;
    speakingRef.current = false;
    recordingRef.current = false;

    if (silTimerRef.current) clearTimeout(silTimerRef.current);

    if (mediaRecRef.current?.state !== 'inactive') {
      try {
        mediaRecRef.current?.stop();
      } catch {}
    }

    micRef.current?.getTracks().forEach((t) => t.stop());
    micRef.current = null;

    try {
      audioCtxRef.current?.close();
    } catch {}

    audioCtxRef.current = null;
    analyserRef.current = null;

    if (currentAudio.current) {
      currentAudio.current.pause();
      currentAudio.current = null;
    }

    setVoiceState('idle');
  }, []);

 const playAudio = useCallback(
  async (b64: string) =>
    new Promise<void>((resolve) => {
      if (currentAudio.current) {
        currentAudio.current.pause();
        currentAudio.current = null;
      }

      speakingRef.current = true;
      setVoiceState('speaking');

      const audio = new Audio(`data:audio/mp3;base64,${b64}`);
      currentAudio.current = audio;

      const done = () => {
        console.log('[Live] Audio terminé, relance écoute immédiate');
        currentAudio.current = null;
        speakingRef.current = false;
        // Force l'état à listening directement
        setVoiceState('listening');
        
        // Relance l'écoute
        if (activeRef.current && startListeningRef.current) {
          // Petit délai pour laisser l'audio se fermer complètement
          setTimeout(() => {
            if (activeRef.current && !speakingRef.current) {
              console.log('[Live] startListening appelé directement');
              startListeningRef.current!();
            }
          }, 300);
        }
        resolve();
      };

      audio.onended = done;
      audio.onerror = () => {
        console.log('[Live] Erreur audio');
        speakingRef.current = false;
        setVoiceState('listening');
        if (activeRef.current && startListeningRef.current) {
          setTimeout(() => startListeningRef.current!(), 300);
        }
        resolve();
      };

      audio.play().catch((err) => {
        console.log('[Live] Audio play erreur:', err);
        speakingRef.current = false;
        setVoiceState('listening');
        if (activeRef.current && startListeningRef.current) {
          setTimeout(() => startListeningRef.current!(), 300);
        }
        resolve();
      });
    }),
  []
);

  const streamChatResponse = useCallback(
    async (text: string) => {
      const userId = getUserId();
      const res = await fetch(`${API}/chat/stream`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(userId ? { 'X-User-Id': userId } : {}),
        },
        body: JSON.stringify({
          message: text,
          student_id: userId || null,
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error('Streaming unavailable');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let full = '';
      let aiLineId = uuidv4();
      let aiInserted = false;

      const upsertAiLine = (content: string) => {
        setLines((prev) => {
          const idx = prev.findIndex((l) => l.id === aiLineId);
          if (idx === -1) return [...prev, { id: aiLineId, role: 'ai', text: content }];
          const copy = [...prev];
          copy[idx] = { ...copy[idx], text: content };
          return copy;
        });
      };

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() || '';

        for (const evt of events) {
          const line = evt
            .split('\n')
            .find((l) => l.startsWith('data:'));

          if (!line) continue;

          const raw = line.replace(/^data:\s*/, '');

          try {
            const payload = JSON.parse(raw);

            if (payload.done) {
              return full.trim();
            }

            if (typeof payload.full === 'string') {
              full = payload.full;
              if (!aiInserted) aiInserted = true;
              upsertAiLine(full);
            } else if (typeof payload.chunk === 'string') {
              full += payload.chunk;
              if (!aiInserted) aiInserted = true;
              upsertAiLine(full);
            }
          } catch {
            // ignore malformed chunk
          }
        }
      }

      return full.trim();
    },
    []
  );

  const requestTTS = useCallback(
    async (text: string) => {
      const res = await fetch(`${API}/api/voice/tts`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice }),
      });

      const data = await res.json().catch(() => ({}));
      return data?.audio || null;
    },
    [voice]
  );

  const sendToSami = useCallback(
    async (text: string) => {
      if (!activeRef.current) return;

      setVoiceState('thinking');
      setTranscript('');

      const uid = uuidv4();

      addMessage({
        id: uid,
        content: text,
        sender: 'user',
        created_at: new Date().toISOString(),
      });

      setLines((prev) => [...prev, { id: uid, role: 'user', text }]);

      try {
        const reply = await streamChatResponse(text);

        if (reply) {
          addMessage({
            id: uuidv4(),
            content: reply,
            sender: 'ai',
            created_at: new Date().toISOString(),
          });

          const audioB64 = await requestTTS(reply);

          if (audioB64 && activeRef.current) {
            await playAudio(audioB64);
          } else {
            speakingRef.current = false;
            if (activeRef.current && startListeningRef.current) {
              setTimeout(() => startListeningRef.current!(), 400);
            }
          }
        } else {
          if (activeRef.current && startListeningRef.current) {
            setTimeout(() => startListeningRef.current!(), 300);
          }
        }
      } catch (e) {
        console.error('[Live] Erreur stream SAMI:', e);
        if (activeRef.current && startListeningRef.current) {
          setTimeout(() => startListeningRef.current!(), 500);
        }
      }
    },
    [addMessage, playAudio, requestTTS, streamChatResponse]
  );

  const transcribeAndSend = useCallback(
    async (blob: Blob) => {
      if (!activeRef.current || blob.size < 600) {
        setTimeout(() => {
          if (activeRef.current && !speakingRef.current && startListeningRef.current) {
            startListeningRef.current!();
          }
        }, 200);
        return;
      }

      setVoiceState('thinking');

      try {
        const ext = blob.type.includes('mp4') ? 'm4a' : 'webm';
        const fd = new FormData();
        fd.append('audio', blob, `voice.${ext}`);
        fd.append('lang', lang);
        fd.append('prompt', WHISPER_PROMPTS[lang] || WHISPER_PROMPTS.fr);

        const res = await fetch(`${API}/api/voice/transcribe`, {
          method: 'POST',
          credentials: 'include',
          body: fd,
        });

        const data = await res.json();
        const text = (data.text || '').trim();

        if (!text || isHallucination(text)) {
          if (activeRef.current && !speakingRef.current && startListeningRef.current) {
            setTimeout(() => startListeningRef.current!(), 200);
          }
          return;
        }

        const clean = text.replace(/^[.,!?;:\s]+|[.,!?;:\s]+$/g, '').trim();

        if (!clean) {
          if (activeRef.current && !speakingRef.current && startListeningRef.current) {
            setTimeout(() => startListeningRef.current!(), 200);
          }
          return;
        }

        setTranscript(clean);
        await sendToSami(clean);
      } catch {
        if (activeRef.current && !speakingRef.current && startListeningRef.current) {
          setTimeout(() => startListeningRef.current!(), 500);
        }
      }
    },
    [lang, sendToSami]
  );

  const stopRec = useCallback(() => {
    if (silTimerRef.current) clearTimeout(silTimerRef.current);
    if (mediaRecRef.current?.state === 'recording') {
      try {
        mediaRecRef.current.stop();
      } catch {}
    }
  }, []);

  const startVAD = useCallback(() => {
  if (!analyserRef.current) {
    silTimerRef.current = setTimeout(() => stopRec(), 5000);
    return;
  }

  const buf = new Float32Array(analyserRef.current.fftSize);
  const thr = vadThreshRef.current;

  let sf = 0;
  let silF = 0;
  let total = 0;
  let confirmed = false;
  let speechDuration = 0;

  // Ajuste ces valeurs
  const SPEECH = 2;        // Réduit de 3 à 2 (détecte plus vite le début de parole)
  const SIL_AFTER = 12;    // Réduit de 20 à 12 (arrête plus vite après silence)
  const NO_SPEECH = 25;    // Réduit de 40 à 25 (abandonne plus vite si pas de parole)
  const MAX = 800;         // Réduit de 1200 à 800 (max 80 secondes)

  const tick = () => {
    if (!activeRef.current || !recordingRef.current || speakingRef.current) return;

    analyserRef.current!.getFloatTimeDomainData(buf);
    const rms = Math.sqrt(buf.reduce((s, v) => s + v * v, 0) / buf.length);
    total++;

    if (rms > thr) {
      sf++;
      silF = 0;
      speechDuration++;
      if (sf >= SPEECH) confirmed = true;
    } else {
      silF++;
      if (sf > 0) sf = Math.max(0, sf - 1);
    }

    // Log pour déboguer
    if (total % 20 === 0) {
      console.log(`[VAD] rms: ${rms.toFixed(4)}, thr: ${thr.toFixed(4)}, silF: ${silF}, confirmed: ${confirmed}, speechDuration: ${speechDuration}`);
    }

    if (confirmed && silF >= SIL_AFTER && speechDuration > 5) {
      console.log('[VAD] Silence détecté, arrêt de l\'enregistrement');
      stopRec();
      return;
    }

    if (total >= MAX && confirmed) {
      console.log('[VAD] Temps maximum atteint');
      stopRec();
      return;
    }

    if (!confirmed && total >= NO_SPEECH) {
      console.log('[VAD] Aucune parole détectée');
      stopRec();
      return;
    }

    setTimeout(tick, 100);
  };

  tick();
}, [stopRec]);

  const startListening = useCallback(() => {
  console.log('[Live] startListening appelé', {
    active: activeRef.current,
    speaking: speakingRef.current,
    recording: recordingRef.current
  });
  
  if (!activeRef.current || speakingRef.current || recordingRef.current) return;

  recordingRef.current = true;
  chunksRef.current = [];
  setVoiceState('listening');
  setTranscript('');

  // Timeout de sécurité : si pas de parole après 15 secondes, réinitialiser
  const safetyTimeout = setTimeout(() => {
    if (recordingRef.current && !speakingRef.current) {
      console.log('[Live] Timeout sécurité: 15s sans détection, réinitialisation');
      stopRec();
    }
  }, 15000);

  let mime = 'audio/webm;codecs=opus';
  if (!MediaRecorder.isTypeSupported(mime)) {
    mime = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '';
  }

  try {
    mediaRecRef.current = new MediaRecorder(
      micRef.current!,
      mime ? { mimeType: mime, audioBitsPerSecond: 128000 } : {}
    );
  } catch {
    mediaRecRef.current = new MediaRecorder(micRef.current!);
  }

  mediaRecRef.current.ondataavailable = (e) => {
    if (e.data.size > 0) chunksRef.current.push(e.data);
  };

  mediaRecRef.current.onstop = async () => {
    clearTimeout(safetyTimeout);
    recordingRef.current = false;
    if (!activeRef.current) return;

    const blob = new Blob(chunksRef.current, { type: mediaRecRef.current!.mimeType });
    await transcribeAndSend(blob);
  };

  mediaRecRef.current.start(100);
  startVAD();
}, [startVAD, transcribeAndSend]);

  // Stocker startListening dans une ref pour l'utiliser dans playAudio
  startListeningRef.current = startListening;






// Ajoute ce useEffect vers la ligne 1900, après la définition de startListening
useEffect(() => {
  // Si on est en mode idle après avoir été en speaking, relancer l'écoute
  if (voiceState === 'idle' && activeRef.current && !speakingRef.current && !recordingRef.current) {
    console.log('[Live] idle détecté après speaking, relance');
    const timer = setTimeout(() => {
      if (activeRef.current && !speakingRef.current && !recordingRef.current) {
        startListening();
      }
    }, 300);
    return () => clearTimeout(timer);
  }
}, [voiceState]);




  // Surveiller la fin de l'état speaking pour relancer l'écoute
  useEffect(() => {
    if (voiceState === 'speaking' && !speakingRef.current) {
      console.log('[Live] voiceState speaking mais speakingRef false, relance');
      const timer = setTimeout(() => {
        if (activeRef.current && !speakingRef.current && startListeningRef.current) {
          startListeningRef.current();
        }
      }, 300);
      return () => clearTimeout(timer);
    }
    
    if (voiceState === 'idle' && activeRef.current && !speakingRef.current && !recordingRef.current && startListeningRef.current) {
      console.log('[Live] idle détecté, relance écoute');
      const timer = setTimeout(() => {
        if (activeRef.current && !speakingRef.current && !recordingRef.current && voiceState === 'idle' && startListeningRef.current) {
          startListeningRef.current();
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [voiceState]);

  useEffect(() => {
    (async () => {
      try {
        micRef.current = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: 16000,
            channelCount: 1,
          },
        });
      } catch {
        alert('Accès micro refusé.');
        onEnd();
        return;
      }

      activeRef.current = true;

      try {
        const Ctx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new Ctx();
        const an = ctx.createAnalyser();
        an.fftSize = 128;

        ctx.createMediaStreamSource(micRef.current!).connect(an);
        audioCtxRef.current = ctx;
        analyserRef.current = an;

        const buf = new Float32Array(an.fftSize);
        let nf = 0;
        let nc = 0;

        const calibrate = () => {
          an.getFloatTimeDomainData(buf);
          nf += Math.sqrt(buf.reduce((s, v) => s + v * v, 0) / buf.length);
          nc++;

          if (nc < 8) {
            setTimeout(calibrate, 100);
            return;
          }

          vadThreshRef.current = Math.max((nf / nc) * 3, 0.015);
          startListening();
        };

        setTimeout(calibrate, 50);
      } catch {
        vadThreshRef.current = 0.018;
        startListening();
      }
    })();

    return () => {
      stopAll();
    };
  }, [onEnd, startListening, stopAll]);

  const LABELS: Record<VoiceState, { title: string; sub: string; color: string }> = {
    idle: { title: 'Initialisation…', sub: '', color: 'text-slate-400' },
    listening: {
      title: "🎙 Je t'écoute…",
      sub: 'Parle librement — SAMI répond auto',
      color: 'text-orange-400',
    },
    thinking: {
      title: '⏳ SAMI réfléchit…',
      sub: 'Traitement en cours',
      color: 'text-yellow-400',
    },
    speaking: {
      title: '🔊 SAMI répond…',
      sub: 'Lecture audio en cours',
      color: 'text-sky-400',
    },
  };

  if (lang === 'darija') {
    LABELS.listening.title = '🎙 Hder, kan3awwd…';
    LABELS.listening.sub = 'Hder b-darija — SAMI ghayjaoueb';
    LABELS.speaking.title = '🔊 SAMI kayhder…';
  }

  const lbl = LABELS[voiceState];

  const handleEnd = useCallback(() => {
    stopAll();
    window.dispatchEvent(new CustomEvent('sami:live-ended'));
    onEnd();
  }, [onEnd, stopAll]);

  return (
    <div
      className={cn(
        'fixed inset-0 z-[200] flex flex-col transition-all duration-300',
        visible ? 'opacity-100' : 'opacity-0'
      )}
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #0d1520 0%, #060a10 100%)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.05) 0%, transparent 70%)' }}
      />

      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-black text-sm">
            S
          </div>

          <div>
            <p className="text-white font-bold text-sm leading-none">SAMI — Mode Live</p>
            <p className="text-slate-500 text-[10px] mt-0.5">
              {LANG_LABELS[lang]?.flag} {LANG_LABELS[lang]?.label} ·{' '}
              {VOICES_BY_LANG[lang]?.find((v) => v.id === voice)?.label || voice}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest">
              Live
            </span>
          </div>

          <button
            onClick={handleEnd}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-400 hover:text-white transition-all text-xs font-medium group"
          >
            <X size={13} className="group-hover:rotate-90 transition-transform duration-200" />
            Terminer
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6 py-4 overflow-hidden">
        <div className="relative flex items-center justify-center">
          {voiceState === 'listening' &&
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="absolute rounded-full border border-orange-500/20"
                style={{
                  width: `${80 + i * 48}px`,
                  height: `${80 + i * 48}px`,
                  animation: `ringpulse 2s ease-out ${(i - 1) * 0.55}s infinite`,
                }}
              />
            ))}

          <div
            className={cn(
              'relative z-10 w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300',
              voiceState === 'listening'
                ? 'bg-gradient-to-br from-orange-500 to-red-600 shadow-orange-500/30 scale-110'
                : voiceState === 'speaking'
                ? 'bg-gradient-to-br from-sky-500 to-blue-600 shadow-sky-500/30'
                : voiceState === 'thinking'
                ? 'bg-gradient-to-br from-yellow-500 to-orange-500 shadow-yellow-500/20'
                : 'bg-gradient-to-br from-slate-600 to-slate-700'
            )}
          >
            {voiceState === 'thinking' ? (
              <Loader2 size={36} className="text-white animate-spin" />
            ) : voiceState === 'speaking' ? (
              <Volume2 size={36} className="text-white" />
            ) : voiceState === 'listening' ? (
              <Mic size={36} className="text-white" />
            ) : (
              <MicOff size={36} className="text-slate-400" />
            )}
          </div>
        </div>

        <div className="text-center" key={voiceState}>
          <p className={cn('font-bold text-lg', lbl.color)}>{lbl.title}</p>
          {lbl.sub && <p className="text-slate-500 text-sm mt-1">{lbl.sub}</p>}
        </div>

        <canvas
          ref={canvasRef}
          width={320}
          height={72}
          className="rounded-xl"
          style={{ maxWidth: '100%' }}
        />



{voiceState === 'listening' && (
  <button
    onClick={() => {
      if (recordingRef.current) {
        stopRec();
      } else {
        startListening();
      }
    }}
    className="mt-4 px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-medium"
  >
    {recordingRef.current ? '🔴 Arrêter l\'écoute' : '🎙 Réactiver l\'écoute'}
  </button>
)}


        {transcript && (
          <div className="px-5 py-3 rounded-2xl bg-white/[0.05] border border-white/[0.07] max-w-sm text-center animate-in fade-in duration-300">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Tu as dit</p>
            <p className="text-slate-200 text-sm italic">« {transcript} »</p>
          </div>
        )}

        {lines.length > 0 && (
          <div
            ref={scrollRef}
            className="w-full max-w-xl max-h-48 overflow-y-auto space-y-2 px-1"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255,255,255,0.07) transparent',
            }}
          >
            {lines.map((l) => (
              <div
                key={l.id}
                className={cn(
                  'flex gap-2 text-xs animate-in fade-in duration-200',
                  l.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {l.role === 'ai' && (
                  <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    S
                  </span>
                )}

                <div
                  className={cn(
                    'px-3 py-1.5 rounded-xl max-w-[80%] leading-relaxed',
                    l.role === 'user'
                      ? 'bg-[#006666]/50 text-slate-100 rounded-tr-sm'
                      : 'bg-white/[0.05] text-slate-300 rounded-tl-sm border border-white/[0.06]'
                  )}
                >
                  {l.text.length > 220 ? `${l.text.substring(0, 220)}…` : l.text}
                </div>

                {l.role === 'user' && (
                  <span className="w-5 h-5 rounded-full bg-slate-700 text-slate-300 text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    T
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {lines.length > 0 && (
          <button
            onClick={handleEnd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07] text-slate-400 hover:text-slate-200 transition-all text-xs font-medium"
          >
            <MessageSquare size={13} />
            Voir la conversation complète
          </button>
        )}
      </div>

      <div className="shrink-0 text-center pb-6 px-6">
        <p className="text-[10px] text-slate-600 mb-3">
          Toutes les réponses sont automatiquement enregistrées dans le chat principal
        </p>

        <button
          onClick={handleEnd}
          className="flex items-center gap-2 mx-auto px-6 py-2.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-white text-sm font-medium hover:bg-white/[0.1] transition-all"
        >
          <X size={14} className="text-red-400" />
          Terminer le live
        </button>
      </div>

      <style>{`
        @keyframes ringpulse {
          0% { transform: scale(1); opacity: .6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* EXPORT PRINCIPAL                                                           */
/* -------------------------------------------------------------------------- */

export const LiveModeModal = ({ onClose }: { onClose: () => void }) => {
  const [phase, setPhase] = useState<Phase>('picker');
  const [lang, setLang] = useState('fr');
  const [voice, setVoice] = useState('nova');

  const handleStart = (l: string, v: string) => {
    setLang(l);
    setVoice(v);
    setPhase('live');
  };

  if (phase === 'picker') {
    return <VoicePicker onStart={handleStart} onCancel={onClose} />;
  }

  return <LiveSession lang={lang} voice={voice} onEnd={onClose} />;
};