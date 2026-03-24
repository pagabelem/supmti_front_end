// // src/components/chatbot/ChatInput.tsx
// 'use client';
// import { useState, useRef, useEffect, useCallback } from 'react';
// import { Send, Mic, Paperclip, X, Loader2, FileText, Image as ImageIcon, Square } from 'lucide-react';
// import { cn }        from '@/lib/utils';
// import { v4 as uuidv4 } from 'uuid';

// import chatbotService      from '@/services/chatbotService';
// import { useChatStore }    from '@/store/chatStore';
// import { useSessionStore } from '@/store/sessionStore';
// import { usePanelStore }   from '@/store/panelStore';

// const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// function getUserId(): string {
//   try {
//     const raw = localStorage.getItem('supmti-auth');
//     if (!raw) return '';
//     return JSON.parse(raw)?.state?.user?.id || '';
//   } catch { return ''; }
// }

// export default function ChatInput() {
//   const [input,         setInput]         = useState('');
//   const [isRecording,   setIsRecording]   = useState(false);
//   const [recordingTime, setRecordingTime] = useState(0);
//   const [isProcessing,  setIsProcessing]  = useState(false);
//   const [uploadedFile,  setUploadedFile]  = useState<File | null>(null);
//   const [isOcrLoading,  setIsOcrLoading]  = useState(false);
//   // Blob audio enregistré, prêt à être écouté/envoyé
//   const [pendingAudio,  setPendingAudio]  = useState<Blob | null>(null);
//   const [audioUrl,      setAudioUrl]      = useState<string | null>(null);

//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const timerRef         = useRef<NodeJS.Timeout | null>(null);
//   const textareaRef      = useRef<HTMLTextAreaElement>(null);
//   const fileInputRef     = useRef<HTMLInputElement>(null);

//   const { addMessage, setTyping, isTyping } = useChatStore();
//   const { setProfil }                       = useSessionStore();
//   const { setPeerBadge }                    = usePanelStore();

//   const isBusy = isTyping || isProcessing || isOcrLoading;

//   // Nettoyer l'URL audio quand le composant est démonté
//   useEffect(() => {
//     return () => { if (audioUrl) URL.revokeObjectURL(audioUrl); };
//   }, [audioUrl]);

//   /* ── Auto-resize textarea ── */
//   useEffect(() => {
//     const el = textareaRef.current;
//     if (!el) return;
//     el.style.height = 'auto';
//     el.style.height = Math.min(el.scrollHeight, 160) + 'px';
//   }, [input]);

//   /* ── Envoi texte ── */
//   const sendText = useCallback(async (text: string) => {
//     if (!text.trim() || isBusy) return;
//     addMessage({ id: uuidv4(), content: text, sender: 'user', created_at: new Date().toISOString() });
//     setInput('');
//     setTyping(true);
//     try {
//       const data    = await chatbotService.sendMessage(text);
//       const contenu = data.reponse ?? data.response ?? '⚠️ Réponse vide.';
//       addMessage({ id: uuidv4(), content: contenu, sender: 'ai', created_at: new Date().toISOString() });
//       if (data.profil) { setProfil(data.profil as any); window.dispatchEvent(new CustomEvent('sami:profile-updated')); }
//       if (data.peer_match) setPeerBadge();
//     } catch {
//       addMessage({ id: uuidv4(), content: '⚠️ Une erreur est survenue.', sender: 'ai', created_at: new Date().toISOString() });
//     } finally {
//       setTyping(false);
//     }
//   }, [isBusy, addMessage, setTyping, setProfil, setPeerBadge]);

//   /* ── Envoi audio → STT → SAMI ── */
//   const sendAudio = useCallback(async (blob: Blob) => {
//     // Effacer le preview audio
//     if (audioUrl) { URL.revokeObjectURL(audioUrl); setAudioUrl(null); }
//     setPendingAudio(null);
//     setIsProcessing(true);

//     addMessage({ id: uuidv4(), content: '🎤 *Transcription en cours…*', sender: 'user', created_at: new Date().toISOString() });

//     try {
//       const formData = new FormData();
//       formData.append('file', blob, 'audio.webm');
//       const uid = getUserId();
//       const res = await fetch(`${API}/test-stt/transcribe`, {
//         method: 'POST', credentials: 'include',
//         headers: uid ? { 'X-User-Id': uid } : {},
//         body: formData,
//       });
//       const data = await res.json();

//       if (data.source === 'error' || !data.text) {
//         addMessage({ id: uuidv4(), content: `⚠️ Transcription échouée : ${data.text || 'Texte vide'}`, sender: 'ai', created_at: new Date().toISOString() });
//         return;
//       }

//       addMessage({ id: uuidv4(), content: `🎤 *"${data.text}"*`, sender: 'user', created_at: new Date().toISOString() });
//       setIsProcessing(false);

//       // Envoyer à SAMI
//       setTyping(true);
//       const chatData = await chatbotService.sendMessage(data.text);
//       const contenu  = chatData.reponse ?? chatData.response ?? '⚠️ Réponse vide.';
//       addMessage({ id: uuidv4(), content: contenu, sender: 'ai', created_at: new Date().toISOString() });
//       if (chatData.profil) { setProfil(chatData.profil as any); window.dispatchEvent(new CustomEvent('sami:profile-updated')); }
//       if (chatData.peer_match) setPeerBadge();

//     } catch {
//       addMessage({ id: uuidv4(), content: '⚠️ Impossible de traiter le message vocal.', sender: 'ai', created_at: new Date().toISOString() });
//     } finally {
//       setIsProcessing(false);
//       setTyping(false);
//     }
//   }, [audioUrl, addMessage, setTyping, setProfil, setPeerBadge]);

//   /* ── OCR ── */
//   const handleFileUpload = useCallback(async (file: File) => {
//     if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
//       addMessage({ id: uuidv4(), content: '⚠️ Format non supporté. Envoie une image (JPG, PNG) ou un PDF.', sender: 'ai', created_at: new Date().toISOString() });
//       return;
//     }
//     setUploadedFile(file);
//     setIsOcrLoading(true);
//     addMessage({ id: uuidv4(), content: `📎 **${file.name}** — Analyse en cours…`, sender: 'user', created_at: new Date().toISOString() });
//     try {
//       const formData = new FormData();
//       formData.append('file', file);
//       const uid = getUserId();
//       const res = await fetch(`${API}/ocr/bulletin`, {
//         method: 'POST', credentials: 'include',
//         headers: uid ? { 'X-User-Id': uid } : {},
//         body: formData,
//       });
//       const data = await res.json();
//       if (!data.success) {
//         addMessage({ id: uuidv4(), content: `⚠️ Impossible de lire le fichier : ${data.error || 'Erreur OCR'}`, sender: 'ai', created_at: new Date().toISOString() });
//         return;
//       }
//       const grades  = data.grades || [];
//       const avgCalc = grades.length > 0 ? (grades.reduce((s: number, g: any) => s + g.grade, 0) / grades.length).toFixed(2) : null;
//       let summary   = `📄 **Document analysé !**\n\n`;
//       if (grades.length > 0) {
//         summary += `📊 **${grades.length} note(s) :**\n`;
//         grades.slice(0, 8).forEach((g: any) => { summary += `• ${g.subject !== 'Inconnue' ? g.subject : 'Matière'} : **${g.grade}/20**\n`; });
//         if (avgCalc) summary += `\n🎯 **Moyenne : ${avgCalc}/20**`;
//       } else {
//         summary += `📝 ${(data.full_text || '').slice(0, 300)}`;
//       }
//       addMessage({ id: uuidv4(), content: summary, sender: 'ai', created_at: new Date().toISOString() });
//       if (avgCalc) {
//         setIsOcrLoading(false);
//         setTyping(true);
//         const chatData = await chatbotService.sendMessage(`Ma moyenne est ${avgCalc}/20. Mets à jour mon profil.`);
//         const contenu  = chatData.reponse ?? chatData.response ?? '';
//         if (contenu) addMessage({ id: uuidv4(), content: contenu, sender: 'ai', created_at: new Date().toISOString() });
//         if (chatData.profil) { setProfil(chatData.profil as any); window.dispatchEvent(new CustomEvent('sami:profile-updated')); }
//         setTyping(false);
//       }
//     } catch {
//       addMessage({ id: uuidv4(), content: "⚠️ Erreur lors de l'analyse.", sender: 'ai', created_at: new Date().toISOString() });
//     } finally {
//       setIsOcrLoading(false);
//       setUploadedFile(null);
//       if (fileInputRef.current) fileInputRef.current.value = '';
//     }
//   }, [addMessage, setTyping, setProfil]);

//   /* ── Suggestions ── */
//   useEffect(() => {
//     const handler = (e: Event) => { const msg = (e as CustomEvent<string>).detail; if (msg) sendText(msg); };
//     window.addEventListener('sami:suggestion', handler);
//     return () => window.removeEventListener('sami:suggestion', handler);
//   }, [sendText]);

//   /* ── Chrono ── */
//   useEffect(() => {
//     if (isRecording) {
//       timerRef.current = setInterval(() => setRecordingTime((p) => p + 1), 1000);
//     } else {
//       if (timerRef.current) clearInterval(timerRef.current);
//       setRecordingTime(0);
//     }
//     return () => { if (timerRef.current) clearInterval(timerRef.current); };
//   }, [isRecording]);

//   const startRecording = async () => {
//     try {
//       const stream   = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const recorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = recorder;
//       const chunks: BlobPart[] = [];
//       recorder.ondataavailable = (e) => chunks.push(e.data);
//       recorder.onstop = () => {
//         const blob = new Blob(chunks, { type: 'audio/webm' });
//         stream.getTracks().forEach((t) => t.stop());
//         // Créer URL pour preview, stocker le blob
//         const url = URL.createObjectURL(blob);
//         setPendingAudio(blob);
//         setAudioUrl(url);
//       };
//       recorder.start();
//       setIsRecording(true);
//     } catch {
//       alert("Impossible d'accéder au microphone.");
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current && isRecording) {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//     }
//   };

//   const cancelAudio = () => {
//     if (audioUrl) { URL.revokeObjectURL(audioUrl); setAudioUrl(null); }
//     setPendingAudio(null);
//   };

//   const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

//   return (
//     <div className="sticky bottom-0 left-0 right-0 px-4 pb-6 pt-10 bg-gradient-to-t from-white dark:from-slate-900 to-transparent">
//       <div className="max-w-4xl mx-auto">

//         {/* Badge STT */}
//         {isProcessing && (
//           <div className="flex items-center gap-2 mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl w-fit animate-in fade-in">
//             <Loader2 size={13} className="animate-spin text-blue-500" />
//             <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Transcription vocale…</span>
//           </div>
//         )}

//         {/* Badge OCR */}
//         {isOcrLoading && (
//           <div className="flex items-center gap-2 mb-3 p-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl w-fit animate-in fade-in">
//             <Loader2 size={13} className="animate-spin text-purple-500" />
//             <span className="text-xs font-medium text-purple-600 dark:text-purple-400">Analyse du document…</span>
//           </div>
//         )}

//         {/* ── Preview audio avant envoi ── */}
//         {pendingAudio && audioUrl && !isRecording && (
//           <div className="mb-3 p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
//             <div className="flex items-center gap-3">
//               <div className="w-8 h-8 rounded-full bg-[#006666]/10 flex items-center justify-center shrink-0">
//                 <Mic size={14} className="text-[#006666]" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Message vocal enregistré</p>
//                 {/* Lecteur audio natif */}
//                 <audio
//                   src={audioUrl}
//                   controls
//                   className="w-full h-8"
//                   style={{ accentColor: '#006666' }}
//                 />
//               </div>
//               {/* Annuler */}
//               <button
//                 onClick={cancelAudio}
//                 className="p-1.5 text-gray-400 hover:text-red-500 transition-colors shrink-0"
//                 title="Annuler"
//               >
//                 <X size={16} />
//               </button>
//             </div>
//             {/* Bouton envoyer */}
//             <button
//               onClick={() => sendAudio(pendingAudio)}
//               disabled={isBusy}
//               className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#006666] text-white font-bold text-sm hover:bg-[#004d4d] transition-all active:scale-95 disabled:opacity-50"
//             >
//               <Send size={15} />
//               Envoyer ce message vocal
//             </button>
//           </div>
//         )}

//         <div className={cn(
//           "relative bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 rounded-[24px] shadow-2xl transition-all duration-300",
//           isRecording && "border-red-500/50 ring-4 ring-red-500/10",
//         )}>
//           <div className="flex items-end gap-2 px-4 py-3">

//             {!isRecording ? (
//               <>
//                 <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isBusy}
//                   title="Envoyer une image ou PDF" className="p-2 text-gray-400 hover:text-[#006666] transition-colors mb-1 disabled:opacity-40">
//                   <Paperclip size={22} />
//                 </button>
//                 <input type="file" ref={fileInputRef} className="hidden" accept="image/jpeg,image/png,image/jpg,application/pdf"
//                   onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }} />

//                 <textarea ref={textareaRef} value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendText(input); } }}
//                   placeholder={isBusy ? 'Traitement en cours…' : 'Posez votre question à SAMI…'}
//                   disabled={isBusy}
//                   className="flex-1 resize-none bg-transparent border-none outline-none text-[15px] py-2.5 max-h-[160px] text-gray-800 dark:text-slate-100 disabled:opacity-60"
//                   rows={1} />
//               </>
//             ) : (
//               <div className="flex-1 flex items-center gap-4 py-3 px-2">
//                 <span className="relative flex h-3 w-3">
//                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
//                   <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
//                 </span>
//                 <span className="text-sm font-mono font-bold text-red-600">{fmt(recordingTime)}</span>
//                 <div className="flex-1 h-1 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
//                   <div className="h-full bg-red-500 animate-pulse w-full" />
//                 </div>
//                 <button onClick={stopRecording}
//                   className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors border border-red-200">
//                   <Square size={12} fill="currentColor" /> Arrêter
//                 </button>
//               </div>
//             )}

//             <div className="flex items-center gap-2 mb-1">
//               {!isRecording && (
//                 <button type="button" onClick={startRecording} disabled={isBusy || !!pendingAudio}
//                   title="Enregistrer un message vocal"
//                   className="p-2.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-all disabled:opacity-40">
//                   {isProcessing ? <Loader2 size={22} className="animate-spin text-blue-500" /> : <Mic size={22} />}
//                 </button>
//               )}
//               <button type="button" onClick={() => sendText(input)}
//                 disabled={!input.trim() || isBusy || isRecording}
//                 className={cn(
//                   "w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300",
//                   input.trim() && !isBusy && !isRecording
//                     ? "bg-[#006666] text-white shadow-lg hover:scale-105"
//                     : "bg-gray-100 dark:bg-slate-700 text-gray-300 dark:text-slate-600 cursor-not-allowed"
//                 )}>
//                 <Send size={18} />
//               </button>
//             </div>
//           </div>

//           <div className="px-5 pb-2">
//             <span className="text-[10px] text-gray-300 dark:text-slate-600">
//               📎 Image / PDF &nbsp;·&nbsp; 🎤 Vocal
//             </span>
//           </div>

//           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[3px] flex">
//             <div className="flex-1 bg-[#006666] rounded-l-full" />
//             <div className="flex-1 bg-[#CC0000] rounded-r-full" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// 'use client';
// import { useState, useRef, useEffect } from 'react';
// import { Send, Mic, MicOff, Paperclip, X } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { v4 as uuidv4 } from 'uuid';

// import chatbotService from '@/services/chatbotService';
// import { useChatStore }    from '@/store/chatStore';
// import { useSessionStore } from '@/store/sessionStore';
// import { usePanelStore }   from '@/store/panelStore';

// const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// // ── Récupère le user_id depuis le localStorage ───────────────
// function getUserId(): string {
//   try {
//     const raw = localStorage.getItem('supmti-auth');
//     if (!raw) return '';
//     return JSON.parse(raw)?.state?.user?.id || '';
//   } catch { return ''; }
// }

// // ── Persiste le profil SAMI en DB via PUT /api/profil ────────
// // Appelé après chaque réponse du chat si le profil a changé
// async function persistProfilEnDB(profil: Record<string, unknown>) {
//   const userId = getUserId();
//   if (!userId) return;

//   try {
//     const info  = (profil?.informations_personnelles as any) || {};
//     const acad  = (profil?.parcours_academique as any)       || {};
//     const pref  = (profil?.preferences as any)               || {};

//     const payload: Record<string, unknown> = { user_id: userId };

//     // Nom complet
//     if (info.prenom && info.prenom !== 'Étudiant') {
//       payload.full_name = info.nom
        // ? `${info.prenom} ${info.nom}`.trim()
//         : info.prenom;
//     }

//     // Moyenne
//     if (acad.moyenne_generale && acad.moyenne_generale > 0) {
//       payload.average = acad.moyenne_generale;
//     }

//     // Type de BAC — on envoie même si hors liste
//     if (acad.type_bac && acad.type_bac !== 'AUTRE') {
//       payload.bac_type = acad.label_bac || acad.type_bac;
//     }

//     // Niveau / diplôme
//     if (acad.niveau_actuel) {
//       payload.level = acad.niveau_actuel;
//     } else if (acad.diplome_actuel) {
//       payload.level = acad.diplome_actuel;
//     }

//     // Ville
//     if (info.ville) {
//       payload.city = info.ville;
//     }

//     // Centres d'intérêt
//     const interets = pref.centres_interet;
//     if (Array.isArray(interets) && interets.length > 0) {
//       payload.interests = interets;
//     }

//     // N'envoyer que si on a au moins une donnée utile
//     const champs = ['full_name', 'average', 'bac_type', 'level', 'city', 'interests'];
//     const aDesData = champs.some(c => payload[c] !== undefined);
//     if (!aDesData) return;

//     await fetch(`${API}/api/profil`, {
//       method:      'PUT',
//       credentials: 'include',
//       headers: {
//         'Content-Type': 'application/json',
//         'X-User-Id':    userId,
//       },
//       body: JSON.stringify(payload),
//     });

//     console.log('[CHAT→DB] Profil persisté :', payload);
//   } catch (e) {
//     console.warn('[CHAT→DB] Impossible de persister le profil :', e);
//   }
// }

// export default function ChatInput() {
//   const [input,         setInput]         = useState('');
//   const [isRecording,   setIsRecording]   = useState(false);
//   const [recordingTime, setRecordingTime] = useState(0);
//   const [audioBlob,     setAudioBlob]     = useState<Blob | null>(null);

//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const timerRef         = useRef<NodeJS.Timeout | null>(null);
//   const textareaRef      = useRef<HTMLTextAreaElement>(null);
//   const fileInputRef     = useRef<HTMLInputElement>(null);

//   const { addMessage, setTyping, isTyping } = useChatStore();
//   const { setProfil }                        = useSessionStore();
//   const { setPeerBadge }                     = usePanelStore();

//   // Auto-resize textarea
//   useEffect(() => {
//     const el = textareaRef.current;
//     if (!el) return;
//     el.style.height = 'auto';
//     el.style.height = Math.min(el.scrollHeight, 160) + 'px';
//   }, [input]);

//   // Écouter les suggestions (tuiles d'accueil)
//   useEffect(() => {
//     const handler = (e: Event) => {
//       const msg = (e as CustomEvent<string>).detail;
//       if (msg) sendText(msg);
//     };
//     window.addEventListener('sami:suggestion', handler);
//     return () => window.removeEventListener('sami:suggestion', handler);
//   }, []); // eslint-disable-line

//   // Chrono enregistrement
//   useEffect(() => {
//     if (isRecording) {
//       timerRef.current = setInterval(() => setRecordingTime(p => p + 1), 1000);
//     } else {
//       if (timerRef.current) clearInterval(timerRef.current);
//       setRecordingTime(0);
//     }
//     return () => { if (timerRef.current) clearInterval(timerRef.current); };
//   }, [isRecording]);

//   // ── Enregistrement audio ──────────────────────────────────
//   const startRecording = async () => {
//     try {
//       const stream       = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;
//       const chunks: BlobPart[] = [];
//       mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
//       mediaRecorder.onstop = () => {
//         const blob = new Blob(chunks, { type: 'audio/webm' });
//         setAudioBlob(blob);
//         stream.getTracks().forEach(t => t.stop());
//       };
//       mediaRecorder.start();
//       setIsRecording(true);
//     } catch {
//       alert("Impossible d'accéder au micro.");
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current && isRecording) {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//     }
//   };

//   // ── Envoi du message ──────────────────────────────────────
//   const sendText = async (text: string) => {
//     if ((!text.trim() && !audioBlob) || isTyping) return;

//     addMessage({
//       id:         uuidv4(),
//       content:    text || '🎤 Message vocal',
//       sender:     'user',
//       created_at: new Date().toISOString(),
//     });
//     setInput('');
//     setAudioBlob(null);
//     setTyping(true);

//     try {
//       const data = await chatbotService.sendMessage(text);

//       addMessage({
//         id:         uuidv4(),
//         content:    data.reponse || data.response || '',
//         sender:     'ai',
//         created_at: new Date().toISOString(),
//       });

//       // ── Mise à jour du profil ─────────────────────────────
//       if (data.profil) {
//         // 1. Mettre à jour le store Zustand (→ rafraîchit la page profil)
//         setProfil(data.profil as Parameters<typeof setProfil>[0]);

//         // 2. Persister en DB automatiquement
//         await persistProfilEnDB(data.profil as Record<string, unknown>);

//         // 3. Notifier les composants qui écoutent
//         window.dispatchEvent(new CustomEvent('sami:profile-updated'));
//       }

//       if (data.peer_match) setPeerBadge(true);

//     } catch {
//       addMessage({
//         id:         uuidv4(),
//         content:    '⚠️ Une erreur est survenue. Réessaie dans quelques secondes.',
//         sender:     'ai',
//         created_at: new Date().toISOString(),
//       });
//     } finally {
//       setTyping(false);
//     }
//   };

//   const handleSend    = () => sendText(input);
//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
//   };

//   const formatTime = (s: number) =>
//     `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

//   return (
//     <div className="sticky bottom-0 left-0 right-0 px-4 pb-6 pt-10 bg-gradient-to-t from-white dark:from-slate-900 to-transparent">
//       <div className="max-w-4xl mx-auto">

//         {/* Preview audio */}
//         {audioBlob && !isRecording && (
//           <div className="flex items-center gap-3 mb-3 p-2 bg-emerald-50 dark:bg-emerald-900/20 border border-[#006666]/20 rounded-xl w-fit animate-in fade-in slide-in-from-bottom-1">
//             <div className="flex items-center gap-2 text-sm font-medium text-[#006666]">
//               <Mic size={16}/> Audio prêt à l'envoi
//             </div>
//             <button onClick={() => setAudioBlob(null)} className="text-gray-400 hover:text-red-500">
//               <X size={16}/>
//             </button>
//           </div>
//         )}

//         {/* Conteneur principal */}
//         <div className={cn(
//           "relative bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 rounded-[24px] shadow-2xl transition-all duration-300",
//           isRecording && "border-[#CC0000]/50 ring-4 ring-[#CC0000]/5"
//         )}>
//           <div className="flex items-end gap-2 px-4 py-3">

//             {!isRecording ? (
//               <>
//                 <button
//                   type="button"
//                   onClick={() => fileInputRef.current?.click()}
//                   className="p-2 text-gray-400 hover:text-[#006666] transition-colors mb-1"
//                 >
//                   <Paperclip size={22}/>
//                 </button>
//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   className="hidden"
//                   onChange={() => {}}
//                 />
//                 <textarea
//                   ref={textareaRef}
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   onKeyDown={handleKeyDown}
//                   placeholder="Posez votre question à SAMI..."
//                   className="flex-1 resize-none bg-transparent border-none outline-none text-[15px] py-2.5 max-h-[160px] text-gray-800 dark:text-slate-100"
//                   rows={1}
//                 />
//               </>
//             ) : (
//               <div className="flex-1 flex items-center gap-4 py-3 px-2">
//                 <div className="flex items-center gap-2">
//                   <span className="relative flex h-3 w-3">
//                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"/>
//                     <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"/>
//                   </span>
//                   <span className="text-sm font-mono font-bold text-red-600">{formatTime(recordingTime)}</span>
//                 </div>
//                 <div className="flex-1 h-1 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
//                   <div className="h-full bg-red-500 animate-pulse w-full"/>
//                 </div>
//                 <button onClick={stopRecording} className="text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors">
//                   Arrêter
//                 </button>
//               </div>
//             )}

//             <div className="flex items-center gap-2 mb-1">
//               {!isRecording && (
//                 <button
//                   type="button"
//                   onClick={startRecording}
//                   className="p-2.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-all"
//                 >
//                   <Mic size={22}/>
//                 </button>
//               )}
//               <button
//                 type="button"
//                 onClick={handleSend}
//                 disabled={(!input.trim() && !audioBlob) || isTyping || isRecording}
//                 className={cn(
//                   "w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300",
//                   (input.trim() || audioBlob) && !isTyping && !isRecording
//                     ? "bg-[#006666] text-white shadow-lg hover:scale-105"
//                     : "bg-gray-100 dark:bg-slate-700 text-gray-300 dark:text-slate-600 cursor-not-allowed"
//                 )}
//               >
//                 <Send size={18}/>
//               </button>
//             </div>
//           </div>

//           {/* Bande décorative bas */}
//           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[3px] flex">
//             <div className="flex-1 bg-[#006666] rounded-l-full"/>
//             <div className="flex-1 bg-[#CC0000] rounded-r-full"/>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// 'use client';
// import { useState, useRef, useEffect } from 'react';
// import { Send, Mic, Paperclip, X, Zap, ZapOff } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { v4 as uuidv4 } from 'uuid';

// import chatbotService from '@/services/chatbotService';
// import { useChatStore }    from '@/store/chatStore';
// import { useSessionStore } from '@/store/sessionStore';
// import { usePanelStore }   from '@/store/panelStore';

// const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// // ── Récupère le user_id depuis le localStorage ───────────────────────────────
// function getUserId(): string {
//   try {
//     const raw = localStorage.getItem('supmti-auth');
//     if (!raw) return '';
//     return JSON.parse(raw)?.state?.user?.id || '';
//   } catch { return ''; }
// }

// // ── Persiste le profil SAMI en DB via PUT /api/profil ────────────────────────
// async function persistProfilEnDB(profil: Record<string, unknown>) {
//   const userId = getUserId();
//   if (!userId) return;
//   try {
//     const info  = (profil?.informations_personnelles as Record<string, unknown>) || {};
//     const acad  = (profil?.parcours_academique       as Record<string, unknown>) || {};
//     const pref  = (profil?.preferences               as Record<string, unknown>) || {};

//     const payload: Record<string, unknown> = { user_id: userId };
//     if (info['prenom'] && info['prenom'] !== 'Étudiant') {
//       payload.full_name = info['nom']
//       ? `${info['prenom']} ${info['nom']}`.trim()
//       : info['prenom'];
//     }
//     if (acad['moyenne_generale'] && Number(acad['moyenne_generale']) > 0) payload.average  = acad['moyenne_generale'];
//     if (acad['type_bac'] && acad['type_bac'] !== 'AUTRE')                 payload.bac_type = acad['label_bac'] || acad['type_bac'];
//     if (acad['niveau_actuel'])                                             payload.level    = acad['niveau_actuel'];
//     else if (acad['diplome_actuel'])                                       payload.level    = acad['diplome_actuel'];
//     if (info['ville'])                                                     payload.city     = info['ville'];
//     const interets = pref['centres_interet'];
//     if (Array.isArray(interets) && interets.length > 0)      payload.interests = interets;

//     const hasData = ['full_name','average','bac_type','level','city','interests'].some(k => payload[k] !== undefined);
//     if (!hasData) return;

//     await fetch(`${API}/api/profil`, {
//       method: 'PUT', credentials: 'include',
//       headers: { 'Content-Type': 'application/json', 'X-User-Id': userId },
//       body: JSON.stringify(payload),
//     });
//   } catch (e) {
//     console.warn('[CHAT→DB] Impossible de persister le profil :', e);
//   }
// }

// // ── Tooltip mode live ─────────────────────────────────────────────────────────
// const LiveTooltip = ({ visible }: { visible: boolean }) => (
//   <div className={cn(
//     'absolute bottom-full right-0 mb-3 w-64 p-3 rounded-2xl shadow-xl z-50 transition-all duration-200',
//     'bg-slate-900 dark:bg-slate-800 border border-slate-700 text-white text-left',
//     visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-1 pointer-events-none'
//   )}>
//     <div className="flex items-center gap-2 mb-2">
//       <Zap size={13} className="text-orange-400" />
//       <span className="text-[11px] font-black uppercase tracking-wider text-orange-400">Mode Live</span>
//     </div>
//     <p className="text-[11px] text-slate-300 leading-relaxed">
//       La réponse s'affiche <span className="text-white font-bold">mot par mot</span> en temps réel,
//       comme une vraie conversation.
//     </p>
//     <p className="text-[11px] text-slate-400 mt-2">
//       Désactiver si tu préfères recevoir la réponse complète d'un coup.
//     </p>
//     {/* Flèche */}
//     <div className="absolute -bottom-1.5 right-5 w-3 h-3 bg-slate-900 dark:bg-slate-800 border-r border-b border-slate-700 rotate-45" />
//   </div>
// );

// // ─────────────────────────────────────────────────────────────────────────────

// export default function ChatInput() {
//   const [input,         setInput]         = useState('');
//   const [isRecording,   setIsRecording]   = useState(false);
//   const [recordingTime, setRecordingTime] = useState(0);
//   const [audioBlob,     setAudioBlob]     = useState<Blob | null>(null);
//   const [liveMode,      setLiveMode]      = useState(true);    // ← mode live activé par défaut
//   const [showTooltip,   setShowTooltip]   = useState(false);   // ← tooltip au survol
//   const [firstTime,     setFirstTime]     = useState(true);    // ← tooltip auto au 1er render

//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const timerRef         = useRef<NodeJS.Timeout | null>(null);
//   const textareaRef      = useRef<HTMLTextAreaElement>(null);
//   const fileInputRef     = useRef<HTMLInputElement>(null);

//   const { addMessage, setTyping, isTyping, appendToLastMessage } = useChatStore();
//   const { setProfil }   = useSessionStore();
//   const { setPeerBadge } = usePanelStore();

//   // ── Tooltip auto à la première visite ───────────────────────────────────────
//   useEffect(() => {
//     if (firstTime) {
//       const timer = setTimeout(() => {
//         setShowTooltip(true);
//         setTimeout(() => setShowTooltip(false), 4000);
//         setFirstTime(false);
//       }, 1500);
//       return () => clearTimeout(timer);
//     }
//   }, []); // eslint-disable-line

//   // ── Auto-resize textarea ─────────────────────────────────────────────────────
//   useEffect(() => {
//     const el = textareaRef.current;
//     if (!el) return;
//     el.style.height = 'auto';
//     el.style.height = Math.min(el.scrollHeight, 160) + 'px';
//   }, [input]);

//   // ── Écouter les suggestions ──────────────────────────────────────────────────
//   useEffect(() => {
//     const handler = (e: Event) => {
//       const msg = (e as CustomEvent<string>).detail;
//       if (msg) sendText(msg);
//     };
//     window.addEventListener('sami:suggestion', handler);
//     return () => window.removeEventListener('sami:suggestion', handler);
//   }, [liveMode, isTyping]); // eslint-disable-line

//   // ── Chrono enregistrement ────────────────────────────────────────────────────
//   useEffect(() => {
//     if (isRecording) {
//       timerRef.current = setInterval(() => setRecordingTime(p => p + 1), 1000);
//     } else {
//       if (timerRef.current) clearInterval(timerRef.current);
//       setRecordingTime(0);
//     }
//     return () => { if (timerRef.current) clearInterval(timerRef.current); };
//   }, [isRecording]);

//   // ── Enregistrement audio ─────────────────────────────────────────────────────
//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mr     = new MediaRecorder(stream);
//       mediaRecorderRef.current = mr;
//       const chunks: BlobPart[] = [];
//       mr.ondataavailable = (e) => chunks.push(e.data);
//       mr.onstop = () => {
//         setAudioBlob(new Blob(chunks, { type: 'audio/webm' }));
//         stream.getTracks().forEach(t => t.stop());
//       };
//       mr.start();
//       setIsRecording(true);
//     } catch { alert("Impossible d'accéder au micro."); }
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current && isRecording) {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//     }
//   };

//   // ── Envoi ────────────────────────────────────────────────────────────────────
//   const sendText = async (text: string) => {
//     if ((!text.trim() && !audioBlob) || isTyping) return;

//     // Message utilisateur
//     addMessage({
//       id:         uuidv4(),
//       content:    text || '🎤 Message vocal',
//       sender:     'user',
//       created_at: new Date().toISOString(),
//     });
//     setInput('');
//     setAudioBlob(null);
//     setTyping(true);

//     // ── MODE LIVE (streaming SSE) ──────────────────────────────────────────────
//     if (liveMode) {
//       let firstToken = true;

//       // Créer le message assistant vide — sera rempli token par token
//       addMessage({
//         id:         uuidv4(),
//         content:    '',
//         sender:     'ai',
//         created_at: new Date().toISOString(),
//       });

//       await chatbotService.sendMessageStream(
//         text,

//         // onToken
//         (token) => {
//           if (firstToken) {
//             setTyping(false);   // cacher les 3 points dès le 1er token
//             firstToken = false;
//           }
//           appendToLastMessage(token);
//         },

//         // onDone
//         async ({ profil, peer_match }) => {
//           setTyping(false);
//           if (profil) {
//             setProfil(profil as Parameters<typeof setProfil>[0]);
//             await persistProfilEnDB(profil as Record<string, unknown>);
//             window.dispatchEvent(new CustomEvent('sami:profile-updated'));
//           }
//           if (peer_match) setPeerBadge(true);
//         },

//         // onError
//         (err) => {
//           setTyping(false);
//           appendToLastMessage(`\n\n⚠️ Erreur : ${err}`);
//         },
//       );

//       setTyping(false);
//       return;
//     }

//     // ── MODE CLASSIQUE (réponse complète) ─────────────────────────────────────
//     try {
//       const data = await chatbotService.sendMessage(text);

//       addMessage({
//         id:         uuidv4(),
//         content:    data.reponse || data.response || '',
//         sender:     'ai',
//         created_at: new Date().toISOString(),
//       });

//       if (data.profil) {
//         setProfil(data.profil as Parameters<typeof setProfil>[0]);
//         await persistProfilEnDB(data.profil as Record<string, unknown>);
//         window.dispatchEvent(new CustomEvent('sami:profile-updated'));
//       }
//       if (data.peer_match) setPeerBadge(true);

//     } catch {
//       addMessage({
//         id:         uuidv4(),
//         content:    '⚠️ Une erreur est survenue. Réessaie dans quelques secondes.',
//         sender:     'ai',
//         created_at: new Date().toISOString(),
//       });
//     } finally {
//       setTyping(false);
//     }
//   };

//   const handleSend    = () => sendText(input);
//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
//   };
//   const formatTime = (s: number) =>
//     `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

//   return (
//     <div className="sticky bottom-0 left-0 right-0 px-4 pb-6 pt-10 bg-gradient-to-t from-white dark:from-slate-900 to-transparent">
//       <div className="max-w-4xl mx-auto">

//         {/* ── Preview audio ── */}
//         {audioBlob && !isRecording && (
//           <div className="flex items-center gap-3 mb-3 p-2 bg-emerald-50 dark:bg-emerald-900/20 border border-[#006666]/20 rounded-xl w-fit animate-in fade-in slide-in-from-bottom-1">
//             <div className="flex items-center gap-2 text-sm font-medium text-[#006666]">
//               <Mic size={16}/> Audio prêt à l'envoi
//             </div>
//             <button onClick={() => setAudioBlob(null)} className="text-gray-400 hover:text-red-500">
//               <X size={16}/>
//             </button>
//           </div>
//         )}

//         {/* ── Badge mode live (au-dessus du champ) ── */}
//         <div className="flex justify-end mb-2 pr-1">
//           <div className="relative">
//             <button
//               onClick={() => setLiveMode(v => !v)}
//               onMouseEnter={() => setShowTooltip(true)}
//               onMouseLeave={() => setShowTooltip(false)}
//               className={cn(
//                 'flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all duration-200 border',
//                 liveMode
//                   ? 'bg-orange-500/10 border-orange-400/30 text-orange-500 hover:bg-orange-500/20'
//                   : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:border-slate-300'
//               )}
//             >
//               {liveMode
//                 ? <><Zap    size={12} className="fill-orange-500" /> Live</>
//                 : <><ZapOff size={12} /> Classique</>
//               }
//             </button>
//             <LiveTooltip visible={showTooltip} />
//           </div>
//         </div>

//         {/* ── Conteneur principal ── */}
//         <div className={cn(
//           'relative bg-white dark:bg-slate-800 border-2 rounded-[24px] shadow-2xl transition-all duration-300',
//           isRecording
//             ? 'border-red-400/50 ring-4 ring-red-500/5'
//             : liveMode
//               ? 'border-orange-300/40 dark:border-orange-500/20 ring-2 ring-orange-500/5'
//               : 'border-gray-100 dark:border-slate-700'
//         )}>
//           <div className="flex items-end gap-2 px-4 py-3">

//             {!isRecording ? (
//               <>
//                 <button
//                   type="button"
//                   onClick={() => fileInputRef.current?.click()}
//                   className="p-2 text-gray-400 hover:text-[#006666] transition-colors mb-1"
//                 >
//                   <Paperclip size={22}/>
//                 </button>
//                 <input type="file" ref={fileInputRef} className="hidden" onChange={() => {}} />
//                 <textarea
//                   ref={textareaRef}
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   onKeyDown={handleKeyDown}
//                   placeholder={liveMode
//                     ? 'Posez votre question — réponse en direct ⚡'
//                     : 'Posez votre question à SAMI...'}
//                   className="flex-1 resize-none bg-transparent border-none outline-none text-[15px] py-2.5 max-h-[160px] text-gray-800 dark:text-slate-100 placeholder:text-gray-400"
//                   rows={1}
//                 />
//               </>
//             ) : (
//               <div className="flex-1 flex items-center gap-4 py-3 px-2">
//                 <div className="flex items-center gap-2">
//                   <span className="relative flex h-3 w-3">
//                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"/>
//                     <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"/>
//                   </span>
//                   <span className="text-sm font-mono font-bold text-red-600">{formatTime(recordingTime)}</span>
//                 </div>
//                 <div className="flex-1 h-1 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
//                   <div className="h-full bg-red-500 animate-pulse w-full"/>
//                 </div>
//                 <button
//                   onClick={stopRecording}
//                   className="text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
//                 >
//                   Arrêter
//                 </button>
//               </div>
//             )}

//             <div className="flex items-center gap-2 mb-1">
//               {!isRecording && (
//                 <button
//                   type="button"
//                   onClick={startRecording}
//                   className="p-2.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-all"
//                 >
//                   <Mic size={22}/>
//                 </button>
//               )}
//               <button
//                 type="button"
//                 onClick={handleSend}
//                 disabled={(!input.trim() && !audioBlob) || isTyping || isRecording}
//                 className={cn(
//                   'w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300',
//                   (input.trim() || audioBlob) && !isTyping && !isRecording
//                     ? 'bg-[#006666] text-white shadow-lg hover:scale-105'
//                     : 'bg-gray-100 dark:bg-slate-700 text-gray-300 dark:text-slate-600 cursor-not-allowed'
//                 )}
//               >
//                 <Send size={18}/>
//               </button>
//             </div>
//           </div>

//           {/* Bande décorative bas */}
//           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[3px] flex">
//             <div className={cn('flex-1 rounded-l-full transition-colors', liveMode ? 'bg-orange-500' : 'bg-[#006666]')}/>
//             <div className="flex-1 bg-[#CC0000] rounded-r-full"/>
//           </div>
//         </div>

//         {/* ── Hint discret sous le champ ── */}
//         <p className="text-center text-[10px] text-slate-400 mt-2">
//           {liveMode
//             ? <>⚡ Mode <span className="font-bold text-orange-500">Live</span> activé — réponse mot par mot · <button onClick={() => setLiveMode(false)} className="underline hover:text-slate-600">Désactiver</button></>
//             : <>Mode classique · <button onClick={() => setLiveMode(true)} className="underline hover:text-orange-500">Activer le mode Live ⚡</button></>
//           }
//         </p>
//       </div>
//     </div>
//   );
// }









// 'use client';
// import { useState, useRef, useEffect } from 'react';
// import { Send, Mic, Paperclip, X, Zap } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { v4 as uuidv4 } from 'uuid';
// import { createPortal } from 'react-dom';

// import chatbotService  from '@/services/chatbotService';
// import { LiveModeModal } from './LiveModeModal';
// import { useChatStore }    from '@/store/chatStore';
// import { useSessionStore } from '@/store/sessionStore';
// import { usePanelStore }   from '@/store/panelStore';

// const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// function getUserId(): string {
//   try {
//     const raw = localStorage.getItem('supmti-auth');
//     if (!raw) return '';
//     return JSON.parse(raw)?.state?.user?.id || '';
//   } catch { return ''; }
// }

// async function persistProfilEnDB(profil: Record<string, unknown>) {
//   const userId = getUserId();
//   if (!userId) return;
//   try {
//     const info  = (profil?.informations_personnelles as Record<string, unknown>) || {};
//     const acad  = (profil?.parcours_academique       as Record<string, unknown>) || {};
//     const pref  = (profil?.preferences               as Record<string, unknown>) || {};
//     const payload: Record<string, unknown> = { user_id: userId };
//     if (info['prenom'] && info['prenom'] !== 'Étudiant')
//       payload.full_name = info['nom'] ? `${info['prenom']} ${info['nom']}`.trim() : info['prenom'];
//     if (acad['moyenne_generale'] && Number(acad['moyenne_generale']) > 0) payload.average  = acad['moyenne_generale'];
//     if (acad['type_bac'] && acad['type_bac'] !== 'AUTRE')                 payload.bac_type = acad['label_bac'] || acad['type_bac'];
//     if (acad['niveau_actuel'])                                             payload.level    = acad['niveau_actuel'];
//     else if (acad['diplome_actuel'])                                       payload.level    = acad['diplome_actuel'];
//     if (info['ville'])                                                     payload.city     = info['ville'];
//     const interets = pref['centres_interet'];
//     if (Array.isArray(interets) && interets.length > 0) payload.interests = interets;
//     const hasData = ['full_name','average','bac_type','level','city','interests'].some(k => payload[k] !== undefined);
//     if (!hasData) return;
//     await fetch(`${API}/api/profil`, {
//       method: 'PUT', credentials: 'include',
//       headers: { 'Content-Type': 'application/json', 'X-User-Id': userId },
//       body: JSON.stringify(payload),
//     });
//   } catch (e) { console.warn('[CHAT→DB]', e); }
// }

// export default function ChatInput() {
//   const [input,         setInput]         = useState('');
//   const [isRecording,   setIsRecording]   = useState(false);
//   const [recordingTime, setRecordingTime] = useState(0);
//   const [audioBlob,     setAudioBlob]     = useState<Blob | null>(null);
//   const [liveOpen,      setLiveOpen]      = useState(false);   // ← désactivé par défaut
//   const [mounted,       setMounted]       = useState(false);

//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const timerRef         = useRef<NodeJS.Timeout | null>(null);
//   const textareaRef      = useRef<HTMLTextAreaElement>(null);
//   const fileInputRef     = useRef<HTMLInputElement>(null);

//   const { addMessage, setTyping, isTyping } = useChatStore();
//   const { setProfil }   = useSessionStore();
//   const { setPeerBadge } = usePanelStore();

//   useEffect(() => { setMounted(true); }, []);

//   // Auto-resize
//   useEffect(() => {
//     const el = textareaRef.current;
//     if (!el) return;
//     el.style.height = 'auto';
//     el.style.height = Math.min(el.scrollHeight, 160) + 'px';
//   }, [input]);

//   // Suggestions
//   useEffect(() => {
//     const handler = (e: Event) => {
//       const msg = (e as CustomEvent<string>).detail;
//       if (msg) sendText(msg);
//     };
//     window.addEventListener('sami:suggestion', handler);
//     return () => window.removeEventListener('sami:suggestion', handler);
//   }, [isTyping]); // eslint-disable-line

//   // Chrono
//   useEffect(() => {
//     if (isRecording) {
//       timerRef.current = setInterval(() => setRecordingTime(p => p + 1), 1000);
//     } else {
//       if (timerRef.current) clearInterval(timerRef.current);
//       setRecordingTime(0);
//     }
//     return () => { if (timerRef.current) clearInterval(timerRef.current); };
//   }, [isRecording]);

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mr     = new MediaRecorder(stream);
//       mediaRecorderRef.current = mr;
//       const chunks: BlobPart[] = [];
//       mr.ondataavailable = e => chunks.push(e.data);
//       mr.onstop = () => {
//         setAudioBlob(new Blob(chunks, { type: 'audio/webm' }));
//         stream.getTracks().forEach(t => t.stop());
//       };
//       mr.start();
//       setIsRecording(true);
//     } catch { alert("Impossible d'accéder au microphone."); }
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current && isRecording) {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//     }
//   };

//   // ── Mode classique (sans streaming) ───────────────────────────────────────
//   const sendText = async (text: string) => {
//     if ((!text.trim() && !audioBlob) || isTyping) return;
//     addMessage({ id: uuidv4(), content: text || '🎤 Message vocal', sender: 'user', created_at: new Date().toISOString() });
//     setInput('');
//     setAudioBlob(null);
//     setTyping(true);
//     try {
//       const data = await chatbotService.sendMessage(text);
//       addMessage({ id: uuidv4(), content: data.reponse || data.response || '', sender: 'ai', created_at: new Date().toISOString() });
//       if (data.profil) {
//         setProfil(data.profil as Parameters<typeof setProfil>[0]);
//         await persistProfilEnDB(data.profil as Record<string, unknown>);
//         window.dispatchEvent(new CustomEvent('sami:profile-updated'));
//       }
//       if (data.peer_match) setPeerBadge(true);
//     } catch {
//       addMessage({ id: uuidv4(), content: '⚠️ Une erreur est survenue. Réessaie.', sender: 'ai', created_at: new Date().toISOString() });
//     } finally {
//       setTyping(false);
//     }
//   };

//   const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

//   return (
//     <>
//       {/* ── Portail modal Live ── */}
//       {mounted && liveOpen &&
//         createPortal(
//           <LiveModeModal onClose={() => setLiveOpen(false)} />,
//           document.body
//         )
//       }

//       {/* ── Barre de saisie ── */}
//       <div className="sticky bottom-0 left-0 right-0 px-4 pb-6 pt-10
//         bg-gradient-to-t from-white dark:from-slate-900 to-transparent">
//         <div className="max-w-4xl mx-auto">

//           {/* Audio preview */}
//           {audioBlob && !isRecording && (
//             <div className="flex items-center gap-3 mb-3 p-2 bg-emerald-50 dark:bg-emerald-900/20
//               border border-[#006666]/20 rounded-xl w-fit animate-in fade-in">
//               <div className="flex items-center gap-2 text-sm font-medium text-[#006666]">
//                 <Mic size={16}/> Audio prêt
//               </div>
//               <button onClick={() => setAudioBlob(null)} className="text-gray-400 hover:text-red-500">
//                 <X size={16}/>
//               </button>
//             </div>
//           )}

//           {/* Champ principal */}
//           <div className={cn(
//             'relative bg-white dark:bg-slate-800 border-2 rounded-[24px] shadow-2xl transition-all duration-300',
//             isRecording
//               ? 'border-red-400/50 ring-4 ring-red-500/5'
//               : 'border-gray-100 dark:border-slate-700'
//           )}>
//             <div className="flex items-end gap-2 px-4 py-3">

//               {!isRecording ? (
//                 <>
//                   <button
//                     type="button"
//                     onClick={() => fileInputRef.current?.click()}
//                     className="p-2 text-gray-400 hover:text-[#006666] transition-colors mb-1"
//                   >
//                     <Paperclip size={22}/>
//                   </button>
//                   <input type="file" ref={fileInputRef} className="hidden" onChange={() => {}} />

//                   <textarea
//                     ref={textareaRef}
//                     value={input}
//                     onChange={e => setInput(e.target.value)}
//                     onKeyDown={e => {
//                       if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendText(input); }
//                     }}
//                     placeholder="Posez votre question à SAMI…"
//                     className="flex-1 resize-none bg-transparent border-none outline-none
//                       text-[15px] py-2.5 max-h-[160px] text-gray-800 dark:text-slate-100
//                       placeholder:text-gray-400"
//                     rows={1}
//                   />
//                 </>
//               ) : (
//                 <div className="flex-1 flex items-center gap-4 py-3 px-2">
//                   <div className="flex items-center gap-2">
//                     <span className="relative flex h-3 w-3">
//                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"/>
//                       <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"/>
//                     </span>
//                     <span className="text-sm font-mono font-bold text-red-600">{formatTime(recordingTime)}</span>
//                   </div>
//                   <div className="flex-1 h-1 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
//                     <div className="h-full bg-red-500 animate-pulse w-full"/>
//                   </div>
//                   <button onClick={stopRecording}
//                     className="text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors">
//                     Arrêter
//                   </button>
//                 </div>
//               )}

//               <div className="flex items-center gap-2 mb-1">

//                 {/* ── Bouton LIVE — désactivé par défaut, clique pour ouvrir ── */}
//                 <button
//                   type="button"
//                   onClick={() => setLiveOpen(true)}
//                   title="Ouvrir le mode Live"
//                   className="relative group p-2.5 rounded-full transition-all duration-200
//                     text-gray-400 hover:text-orange-500
//                     hover:bg-orange-500/10
//                     border border-transparent hover:border-orange-500/20"
//                 >
//                   <Zap size={20} />
//                   {/* Tooltip */}
//                   <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2
//                     px-2 py-1 rounded-lg bg-slate-900 text-white text-[10px] font-bold whitespace-nowrap
//                     opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
//                     border border-white/10">
//                     Mode Live ⚡
//                   </span>
//                 </button>

//                 {/* Micro */}
//                 {!isRecording && (
//                   <button
//                     type="button"
//                     onClick={startRecording}
//                     className="p-2.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-all"
//                   >
//                     <Mic size={22}/>
//                   </button>
//                 )}

//                 {/* Envoyer */}
//                 <button
//                   type="button"
//                   onClick={() => sendText(input)}
//                   disabled={(!input.trim() && !audioBlob) || isTyping || isRecording}
//                   className={cn(
//                     'w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300',
//                     (input.trim() || audioBlob) && !isTyping && !isRecording
//                       ? 'bg-[#006666] text-white shadow-lg hover:scale-105'
//                       : 'bg-gray-100 dark:bg-slate-700 text-gray-300 dark:text-slate-600 cursor-not-allowed'
//                   )}
//                 >
//                   <Send size={18}/>
//                 </button>
//               </div>
//             </div>

//             {/* Barre déco */}
//             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[3px] flex">
//               <div className="flex-1 bg-[#006666] rounded-l-full"/>
//               <div className="flex-1 bg-[#CC0000] rounded-r-full"/>
//             </div>
//           </div>

//           {/* Hint discret */}
//           <p className="text-center text-[10px] text-slate-400 mt-2">
//             <button onClick={() => setLiveOpen(true)}
//               className="hover:text-orange-400 transition-colors">
//               ⚡ Essaie le mode Live pour une réponse en temps réel
//             </button>
//           </p>
//         </div>
//       </div>
//     </>
//   );
// }





// 'use client';
// import { useState, useRef, useEffect } from 'react';
// import { Send, Mic, MicOff, X, Zap, Loader2, Volume2 } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { v4 as uuidv4 } from 'uuid';
// import { createPortal } from 'react-dom';

// import chatbotService    from '@/services/chatbotService';
// import { LiveModeModal } from './LiveModeModal';
// import { useChatStore }    from '@/store/chatStore';
// import { useSessionStore } from '@/store/sessionStore';
// import { usePanelStore }   from '@/store/panelStore';

// const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// function getUserId(): string {
//   try {
//     const raw = localStorage.getItem('supmti-auth');
//     if (!raw) return '';
//     return JSON.parse(raw)?.state?.user?.id || '';
//   } catch { return ''; }
// }

// async function persistProfilEnDB(profil: Record<string, unknown>) {
//   const userId = getUserId();
//   if (!userId) return;
//   try {
//     const info = (profil?.informations_personnelles as Record<string, unknown>) || {};
//     const acad = (profil?.parcours_academique       as Record<string, unknown>) || {};
//     const pref = (profil?.preferences               as Record<string, unknown>) || {};
//     const payload: Record<string, unknown> = { user_id: userId };
//     if (info['prenom'] && info['prenom'] !== 'Étudiant') {
//       payload.full_name = info['nom'] ? `${info['prenom']} ${info['nom']}`.trim() : info['prenom'];
//     }
//     if (acad['moyenne_generale'] && Number(acad['moyenne_generale']) > 0) payload.average  = acad['moyenne_generale'];
//     if (acad['type_bac'] && acad['type_bac'] !== 'AUTRE')                 payload.bac_type = acad['label_bac'] || acad['type_bac'];
//     if (acad['niveau_actuel'])                                             payload.level    = acad['niveau_actuel'];
//     else if (acad['diplome_actuel'])                                       payload.level    = acad['diplome_actuel'];
//     if (info['ville'])                                                     payload.city     = info['ville'];
//     const interets = pref['centres_interet'];
//     if (Array.isArray(interets) && interets.length > 0) payload.interests = interets;
//     const hasData = ['full_name','average','bac_type','level','city','interests'].some(k => payload[k] !== undefined);
//     if (!hasData) return;
//     await fetch(`${API}/api/profil`, {
//       method: 'PUT', credentials: 'include',
//       headers: { 'Content-Type': 'application/json', 'X-User-Id': userId },
//       body: JSON.stringify(payload),
//     });
//   } catch (e) { console.warn('[CHAT→DB]', e); }
// }

// export default function ChatInput() {
//   const [input,        setInput]        = useState('');
//   const [isRecording,  setIsRecording]  = useState(false);
//   const [recordingTime, setRecordingTime] = useState(0);
//   const [audioBlob,    setAudioBlob]    = useState<Blob | null>(null);
//   const [audioUrl,     setAudioUrl]     = useState<string | null>(null);  // pour écoute replay
//   const [isTranscribing, setIsTranscribing] = useState(false);
//   const [liveOpen,     setLiveOpen]     = useState(false);

//   const mediaRecRef  = useRef<MediaRecorder | null>(null);
//   const timerRef     = useRef<NodeJS.Timeout | null>(null);
//   const textareaRef  = useRef<HTMLTextAreaElement>(null);

//   const { addMessage, setTyping, isTyping, appendToLastMessage } = useChatStore();
//   const { setProfil }   = useSessionStore();
//   const { setPeerBadge } = usePanelStore();

//   // Auto-resize textarea
//   useEffect(() => {
//     const el = textareaRef.current;
//     if (!el) return;
//     el.style.height = 'auto';
//     el.style.height = Math.min(el.scrollHeight, 160) + 'px';
//   }, [input]);

//   // Écouter suggestions
//   useEffect(() => {
//     const handler = (e: Event) => {
//       const msg = (e as CustomEvent<string>).detail;
//       if (msg) sendText(msg);
//     };
//     window.addEventListener('sami:suggestion', handler);
//     return () => window.removeEventListener('sami:suggestion', handler);
//   }, [isTyping]); // eslint-disable-line

//   // Chrono enregistrement
//   useEffect(() => {
//     if (isRecording) {
//       timerRef.current = setInterval(() => setRecordingTime(p => p + 1), 1000);
//     } else {
//       if (timerRef.current) clearInterval(timerRef.current);
//       setRecordingTime(0);
//     }
//     return () => { if (timerRef.current) clearInterval(timerRef.current); };
//   }, [isRecording]);

//   // ── Enregistrement micro ──────────────────────────────────
//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' });
//       mediaRecRef.current = mr;
//       const chunks: BlobPart[] = [];
//       mr.ondataavailable = e => chunks.push(e.data);
//       mr.onstop = async () => {
//         stream.getTracks().forEach(t => t.stop());
//         const blob = new Blob(chunks, { type: 'audio/webm' });
//         const url  = URL.createObjectURL(blob);
//         setAudioBlob(blob);
//         setAudioUrl(url);
//         // Transcription automatique
//         await transcribeAndFill(blob);
//       };
//       mr.start();
//       setIsRecording(true);
//     } catch {
//       alert("Impossible d'accéder au microphone.");
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecRef.current?.state === 'recording') {
//       mediaRecRef.current.stop();
//     }
//     setIsRecording(false);
//   };

//   // ── Transcription Whisper + remplissage du champ ─────────
//   const transcribeAndFill = async (blob: Blob) => {
//     if (blob.size < 600) return;
//     setIsTranscribing(true);
//     try {
//       const formData = new FormData();
//       formData.append('audio', blob, 'voice.webm');
//       formData.append('lang', 'fr');
//       const res  = await fetch(`${API}/api/voice/transcribe`, { method: 'POST', body: formData });
//       const data = await res.json();
//       if (!data.no_speech && data.text?.trim()) {
//         setInput(data.text.trim());
//         // Focus sur le textarea pour que l'utilisateur voie le texte
//         setTimeout(() => textareaRef.current?.focus(), 100);
//       }
//     } catch {
//       console.warn('[TRANSCRIBE] Erreur');
//     } finally {
//       setIsTranscribing(false);
//     }
//   };

//   // ── Envoi texte (mode classique) ─────────────────────────
//   const sendText = async (text: string) => {
//     if (!text.trim() || isTyping) return;
//     setInput('');
//     setAudioBlob(null);
//     if (audioUrl) { URL.revokeObjectURL(audioUrl); setAudioUrl(null); }
//     addMessage({ id: uuidv4(), content: text, sender: 'user', created_at: new Date().toISOString() });
//     setTyping(true);
//     try {
//       const data = await chatbotService.sendMessage(text);
//       const responseText = data.reponse || data.response || '';
//       addMessage({ id: uuidv4(), content: responseText, sender: 'ai', created_at: new Date().toISOString() });
//       if (data.profil) {
//         setProfil(data.profil as Parameters<typeof setProfil>[0]);
//         await persistProfilEnDB(data.profil as Record<string, unknown>);
//         window.dispatchEvent(new CustomEvent('sami:profile-updated'));
//       }
//       if (data.peer_match) setPeerBadge(true);
//     } catch {
//       addMessage({ id: uuidv4(), content: '⚠️ Une erreur est survenue. Réessaie.', sender: 'ai', created_at: new Date().toISOString() });
//     } finally {
//       setTyping(false);
//     }
//   };

//   const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

//   return (
//     <>
//       {/* Modal Live */}
//       {liveOpen && typeof document !== 'undefined' &&
//         createPortal(<LiveModeModal onClose={() => setLiveOpen(false)} />, document.body)
//       }

//       {/* Barre de saisie */}
//       <div className="sticky bottom-0 left-0 right-0 px-4 pb-6 pt-10 bg-gradient-to-t from-white dark:from-slate-900 to-transparent">
//         <div className="max-w-4xl mx-auto">

//           {/* Preview audio avec replay */}
//           {audioUrl && !isRecording && (
//             <div className="flex items-center gap-3 mb-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-[#006666]/20 rounded-2xl w-fit animate-in fade-in">
//               <audio controls src={audioUrl} className="h-8 w-48" />
//               <button
//                 onClick={() => { URL.revokeObjectURL(audioUrl); setAudioUrl(null); setAudioBlob(null); setInput(''); }}
//                 className="text-gray-400 hover:text-red-500 transition-colors"
//               >
//                 <X size={16} />
//               </button>
//             </div>
//           )}

//           {/* Indicateur transcription */}
//           {isTranscribing && (
//             <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-orange-50 dark:bg-orange-900/10 rounded-xl w-fit text-[12px] text-orange-600 dark:text-orange-400 animate-pulse">
//               <Loader2 size={14} className="animate-spin" />
//               Transcription en cours…
//             </div>
//           )}

//           {/* Champ principal */}
//           <div className={cn(
//             'relative bg-white dark:bg-slate-800 border-2 rounded-[24px] shadow-2xl transition-all duration-300',
//             isRecording
//               ? 'border-red-400/50 ring-4 ring-red-500/5'
//               : 'border-gray-100 dark:border-slate-700 focus-within:border-[#006666]/30'
//           )}>
//             <div className="flex items-end gap-2 px-4 py-3">
//               {!isRecording ? (
//                 <textarea
//                   ref={textareaRef}
//                   value={input}
//                   onChange={e => setInput(e.target.value)}
//                   onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendText(input); } }}
//                   placeholder={isTranscribing ? 'Transcription…' : 'Pose ta question à SAMI…'}
//                   className="flex-1 resize-none bg-transparent border-none outline-none text-[15px] py-2.5 max-h-[160px] text-gray-800 dark:text-slate-100 placeholder:text-gray-400"
//                   rows={1}
//                   disabled={isTranscribing}
//                 />
//               ) : (
//                 <div className="flex-1 flex items-center gap-4 py-3 px-2">
//                   <div className="flex items-center gap-2">
//                     <span className="relative flex h-3 w-3">
//                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
//                       <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
//                     </span>
//                     <span className="text-sm font-mono font-bold text-red-600">{formatTime(recordingTime)}</span>
//                   </div>
//                   <div className="flex-1 h-1 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
//                     <div className="h-full bg-red-500 animate-pulse w-full" />
//                   </div>
//                   <button
//                     onClick={stopRecording}
//                     className="text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
//                   >
//                     Arrêter
//                   </button>
//                 </div>
//               )}

//               <div className="flex items-center gap-2 mb-1">
//                 {/* Bouton LIVE ⚡ */}
//                 <button
//                   type="button"
//                   onClick={() => setLiveOpen(true)}
//                   title="Mode Live vocal"
//                   className="relative p-2.5 rounded-full bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 ring-1 ring-orange-500/20 hover:ring-orange-500/40 transition-all"
//                 >
//                   <Zap size={18} className="fill-orange-500" />
//                   <span className="absolute top-1 right-1 flex h-2 w-2">
//                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-60" />
//                     <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
//                   </span>
//                 </button>

//                 {/* Micro */}
//                 {!isRecording ? (
//                   <button
//                     type="button"
//                     onClick={startRecording}
//                     disabled={isTranscribing}
//                     className="p-2.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-all disabled:opacity-40"
//                     title="Enregistrer un message vocal"
//                   >
//                     <Mic size={22} />
//                   </button>
//                 ) : (
//                   <button
//                     type="button"
//                     onClick={stopRecording}
//                     className="p-2.5 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-full transition-all"
//                   >
//                     <MicOff size={22} />
//                   </button>
//                 )}

//                 {/* Envoyer */}
//                 <button
//                   type="button"
//                   onClick={() => sendText(input)}
//                   disabled={(!input.trim() && !audioBlob) || isTyping || isRecording || isTranscribing}
//                   className={cn(
//                     'w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300',
//                     (input.trim() || audioBlob) && !isTyping && !isRecording && !isTranscribing
//                       ? 'bg-[#006666] text-white shadow-lg hover:scale-105'
//                       : 'bg-gray-100 dark:bg-slate-700 text-gray-300 dark:text-slate-600 cursor-not-allowed'
//                   )}
//                 >
//                   {isTyping
//                     ? <Loader2 size={18} className="animate-spin" />
//                     : <Send size={18} />
//                   }
//                 </button>
//               </div>
//             </div>

//             {/* Hint live */}
//             <div className="px-4 pb-2">
//               <button
//                 onClick={() => setLiveOpen(true)}
//                 className="text-[10px] text-orange-400/70 hover:text-orange-400 transition-colors"
//               >
//                 ⚡ Mode Live — parler directement à SAMI en audio
//               </button>
//             </div>

//             {/* Barre décorative */}
//             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[3px] flex">
//               <div className="flex-1 bg-[#006666] rounded-l-full" />
//               <div className="flex-1 bg-[#CC0000] rounded-r-full" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }




// 'use client';
// import { useState, useRef, useEffect } from 'react';
// import { Send, Mic, MicOff, X, Zap, Loader2, Edit3 } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { v4 as uuidv4 } from 'uuid';
// import { createPortal } from 'react-dom';

// import chatbotService    from '@/services/chatbotService';
// import { LiveModeModal } from './LiveModeModal';
// import { useChatStore }    from '@/store/chatStore';
// import { useSessionStore } from '@/store/sessionStore';
// import { usePanelStore }   from '@/store/panelStore';

// const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// function getUserId(): string {
//   try { return JSON.parse(localStorage.getItem('supmti-auth') || '{}')?.state?.user?.id || ''; }
//   catch { return ''; }
// }

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
//     console.log('[CHAT→DB] Profil persisté');
//   } catch (e) { console.warn('[CHAT→DB]', e); }
// }

// export default function ChatInput() {
//   const [input,          setInput]          = useState('');
//   const [isRecording,    setIsRecording]    = useState(false);
//   const [recordingTime,  setRecordingTime]  = useState(0);
//   const [audioUrl,       setAudioUrl]       = useState<string | null>(null);
//   const [isTranscribing, setIsTranscribing] = useState(false);
//   // transcription affichée au-dessus du champ (peut être éditée)
//   const [transcribedText, setTranscribedText] = useState('');
//   const [liveOpen,       setLiveOpen]       = useState(false);

//   const mediaRecRef  = useRef<MediaRecorder | null>(null);
//   const chunksRef    = useRef<BlobPart[]>([]);
//   const timerRef     = useRef<NodeJS.Timeout | null>(null);
//   const textareaRef  = useRef<HTMLTextAreaElement>(null);

//   const { addMessage, setTyping, isTyping } = useChatStore();
//   const { setProfil }                        = useSessionStore();
//   const { setPeerBadge }                     = usePanelStore();

//   // Auto-resize textarea
//   useEffect(() => {
//     const el = textareaRef.current;
//     if (!el) return;
//     el.style.height = 'auto';
//     el.style.height = Math.min(el.scrollHeight, 160) + 'px';
//   }, [input]);

//   // Suggestions
//   useEffect(() => {
//     const handler = (e: Event) => {
//       const msg = (e as CustomEvent<string>).detail;
//       if (msg) sendText(msg);
//     };
//     window.addEventListener('sami:suggestion', handler);
//     return () => window.removeEventListener('sami:suggestion', handler);
//   }, [isTyping]); // eslint-disable-line

//   // Chrono
//   useEffect(() => {
//     if (isRecording) { timerRef.current = setInterval(() => setRecordingTime(p => p + 1), 1000); }
//     else             { if (timerRef.current) clearInterval(timerRef.current); setRecordingTime(0); }
//     return () => { if (timerRef.current) clearInterval(timerRef.current); };
//   }, [isRecording]);

//   // ── Enregistrement vocal ──────────────────────────────────
//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       chunksRef.current = [];
//       const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm';
//       const mr = new MediaRecorder(stream, { mimeType: mime });
//       mediaRecRef.current = mr;
//       mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
//       mr.onstop = async () => {
//         stream.getTracks().forEach(t => t.stop());
//         const blob = new Blob(chunksRef.current, { type: mime });
//         const url  = URL.createObjectURL(blob);
//         setAudioUrl(url);
//         setIsRecording(false);
//         // Transcription automatique — mais NE PAS envoyer, juste remplir
//         await transcribeToField(blob);
//       };
//       mr.start();
//       setIsRecording(true);
//       // Réinitialiser la transcription précédente
//       setTranscribedText('');
//       setAudioUrl(null);
//     } catch { alert("Impossible d'accéder au microphone."); }
//   };

//   const stopRecording = () => {
//     if (mediaRecRef.current?.state === 'recording') mediaRecRef.current.stop();
//   };

//   // ── Transcription → remplit le champ texte (sans envoyer) ─
//   const transcribeToField = async (blob: Blob) => {
//     if (blob.size < 600) return;
//     setIsTranscribing(true);
//     try {
//       const fd = new FormData();
//       fd.append('audio', blob, 'voice.webm');
//       fd.append('lang', 'fr');
//       const res  = await fetch(`${API}/api/voice/transcribe`, { method: 'POST', credentials: 'include', body: fd });
//       const data = await res.json();
//       if (!data.no_speech && data.text?.trim()) {
//         const text = data.text.trim();
//         setTranscribedText(text);  // affichage au-dessus
//         setInput(text);            // aussi dans le champ → modifiable
//         setTimeout(() => textareaRef.current?.focus(), 100);
//       }
//     } catch { console.warn('[TRANSCRIBE]'); }
//     finally { setIsTranscribing(false); }
//   };

//   // ── Annuler l'audio vocal ──────────────────────────────────
//   const cancelAudio = () => {
//     if (audioUrl) { URL.revokeObjectURL(audioUrl); setAudioUrl(null); }
//     setTranscribedText('');
//     setInput('');
//   };

//   // ── Envoi du message ──────────────────────────────────────
//   const sendText = async (text: string) => {
//     if (!text.trim() || isTyping) return;
//     setInput('');
//     setTranscribedText('');
//     if (audioUrl) { URL.revokeObjectURL(audioUrl); setAudioUrl(null); }
//     addMessage({ id: uuidv4(), content: text, sender: 'user', created_at: new Date().toISOString() });
//     setTyping(true);
//     try {
//       const data = await chatbotService.sendMessage(text);
//       addMessage({ id: uuidv4(), content: data.reponse || data.response || '', sender: 'ai', created_at: new Date().toISOString() });
//       if (data.profil) {
//         setProfil(data.profil as Parameters<typeof setProfil>[0]);
//         await persistProfilEnDB(data.profil as Record<string, unknown>);
//         window.dispatchEvent(new CustomEvent('sami:profile-updated'));
//       }
//       if (data.peer_match) setPeerBadge(true);
//     } catch {
//       addMessage({ id: uuidv4(), content: '⚠️ Erreur. Réessaie.', sender: 'ai', created_at: new Date().toISOString() });
//     } finally { setTyping(false); }
//   };

//   const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
//   const canSend    = (input.trim().length > 0) && !isTyping && !isRecording && !isTranscribing;

//   return (
//     <>
//       {liveOpen && typeof document !== 'undefined' &&
//         createPortal(<LiveModeModal onClose={() => setLiveOpen(false)} />, document.body)
//       }

//       <div className="sticky bottom-0 left-0 right-0 px-4 pb-6 pt-6 bg-gradient-to-t from-white dark:from-slate-900 via-white/80 dark:via-slate-900/80 to-transparent">
//         <div className="max-w-4xl mx-auto space-y-2">

//           {/* ── Preview Audio + Transcription ─────────────── */}
//           {(audioUrl || isTranscribing) && (
//             <div className="flex flex-col gap-2 p-3 bg-white dark:bg-slate-800 border border-[#006666]/20 dark:border-emerald-700/20 rounded-2xl shadow-sm animate-in slide-in-from-bottom-2 duration-200">

//               {/* Lecteur audio */}
//               {audioUrl && !isTranscribing && (
//                 <div className="flex items-center gap-3">
//                   <audio controls src={audioUrl} className="flex-1 h-8" style={{ minWidth: 0 }} />
//                   <button onClick={cancelAudio} className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
//                     <X size={15} />
//                   </button>
//                 </div>
//               )}

//               {/* Indicateur transcription */}
//               {isTranscribing && (
//                 <div className="flex items-center gap-2 text-[12px] text-orange-500 dark:text-orange-400">
//                   <Loader2 size={13} className="animate-spin shrink-0" />
//                   <span>Transcription en cours…</span>
//                 </div>
//               )}

//               {/* Texte transcrit éditable */}
//               {transcribedText && !isTranscribing && (
//                 <div className="flex items-start gap-2">
//                   <Edit3 size={13} className="text-[#006666] shrink-0 mt-1" />
//                   <div className="flex-1 min-w-0">
//                     <p className="text-[10px] text-[#006666] font-bold uppercase tracking-widest mb-1">Transcrit — tu peux modifier :</p>
//                     <textarea
//                       value={input}
//                       onChange={e => setInput(e.target.value)}
//                       rows={2}
//                       className="w-full text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 resize-none outline-none focus:border-[#006666] transition-colors"
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ── Barre principale ─────────────────────────── */}
//           <div className={cn(
//             'relative bg-white dark:bg-slate-800 border-2 rounded-[24px] shadow-xl transition-all duration-300',
//             isRecording
//               ? 'border-red-400/50 ring-4 ring-red-500/5'
//               : 'border-gray-100 dark:border-slate-700 focus-within:border-[#006666]/30 focus-within:shadow-2xl'
//           )}>
//             <div className="flex items-end gap-2 px-4 py-3">

//               {/* Textarea ou enregistrement */}
//               {!isRecording ? (
//                 <textarea
//                   ref={textareaRef}
//                   value={input}
//                   onChange={e => setInput(e.target.value)}
//                   onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendText(input); } }}
//                   placeholder={isTranscribing ? 'Transcription…' : 'Pose ta question à SAMI…'}
//                   disabled={isTranscribing}
//                   rows={1}
//                   className="flex-1 resize-none bg-transparent border-none outline-none text-[15px] py-2.5 max-h-[160px] text-gray-800 dark:text-slate-100 placeholder:text-gray-400"
//                 />
//               ) : (
//                 <div className="flex-1 flex items-center gap-4 py-3 px-2">
//                   <div className="flex items-center gap-2">
//                     <span className="relative flex h-3 w-3">
//                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
//                       <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
//                     </span>
//                     <span className="text-sm font-mono font-bold text-red-600">{formatTime(recordingTime)}</span>
//                   </div>
//                   <div className="flex-1 h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
//                     <div className="h-full bg-gradient-to-r from-red-400 to-red-600 animate-pulse w-full rounded-full" />
//                   </div>
//                   <button onClick={stopRecording} className="text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1 rounded-lg transition-colors">
//                     Arrêter
//                   </button>
//                 </div>
//               )}

//               {/* Boutons droite */}
//               <div className="flex items-center gap-1.5 mb-1">

//                 {/* Bouton LIVE */}
//                 <button type="button" onClick={() => setLiveOpen(true)} title="Mode Live — conversation vocale temps réel"
//                   className="relative p-2.5 rounded-full bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 ring-1 ring-orange-500/20 hover:ring-orange-500/40 transition-all">
//                   <Zap size={18} className="fill-orange-500" />
//                   <span className="absolute top-1 right-1 flex h-2 w-2">
//                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-60" />
//                     <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
//                   </span>
//                 </button>

//                 {/* Micro → transcription dans le champ */}
//                 {!isRecording ? (
//                   <button type="button" onClick={startRecording} disabled={isTranscribing}
//                     title="Enregistrer — la transcription sera affichée avant envoi"
//                     className="p-2.5 text-gray-400 hover:text-[#006666] hover:bg-emerald-50 dark:hover:bg-emerald-900/10 rounded-full transition-all disabled:opacity-40">
//                     <Mic size={22} />
//                   </button>
//                 ) : (
//                   <button type="button" onClick={stopRecording}
//                     className="p-2.5 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-full transition-all animate-pulse">
//                     <MicOff size={22} />
//                   </button>
//                 )}

//                 {/* Envoyer */}
//                 <button type="button" onClick={() => sendText(input)} disabled={!canSend}
//                   className={cn(
//                     'w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300',
//                     canSend
//                       ? 'bg-[#006666] text-white shadow-lg shadow-emerald-900/20 hover:scale-105 hover:shadow-xl'
//                       : 'bg-gray-100 dark:bg-slate-700 text-gray-300 dark:text-slate-600 cursor-not-allowed'
//                   )}>
//                   {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
//                 </button>
//               </div>
//             </div>

//             {/* Hint */}
//             <div className="px-5 pb-2.5 flex items-center gap-3">
//               <button onClick={() => setLiveOpen(true)} className="text-[10px] text-orange-400/60 hover:text-orange-400 transition-colors flex items-center gap-1">
//                 <Zap size={9} className="fill-current" /> Mode Live — parler directement à SAMI
//               </button>
//               <span className="text-[10px] text-gray-300 dark:text-slate-600">·</span>
//               <span className="text-[10px] text-gray-400">🎤 Micro → texte modifiable avant envoi</span>
//             </div>

//             {/* Barre déco */}
//             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[3px] flex rounded-b-full overflow-hidden">
//               <div className="flex-1 bg-[#006666]" />
//               <div className="flex-1 bg-[#CC0000]" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }





'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, X, Zap, Loader2, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { createPortal } from 'react-dom';

import chatbotService    from '@/services/chatbotService';
import { LiveModeModal } from './LiveModeModal';
import { useChatStore }    from '@/store/chatStore';
import { useSessionStore } from '@/store/sessionStore';
import { usePanelStore }   from '@/store/panelStore';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

function getUserId(): string {
  try { return JSON.parse(localStorage.getItem('supmti-auth') || '{}')?.state?.user?.id || ''; }
  catch { return ''; }
}

async function persistProfilEnDB(profil: Record<string, unknown>) {
  const userId = getUserId();
  if (!userId) return;
  try {
    const info  = (profil.informations_personnelles as any) || {};
    const acad  = (profil.parcours_academique       as any) || {};
    const pref  = (profil.preferences               as any) || {};
    const payload: Record<string, unknown> = { user_id: userId };
    if (info.prenom && info.prenom !== 'Étudiant')
      payload.full_name = info.nom ? `${info.prenom} ${info.nom}`.trim() : info.prenom;
    if (acad.moyenne_generale && Number(acad.moyenne_generale) > 0) payload.average  = acad.moyenne_generale;
    if (acad.type_bac && acad.type_bac !== 'AUTRE')                 payload.bac_type = acad.label_bac || acad.type_bac;
    if (acad.niveau_actuel)    payload.level = acad.niveau_actuel;
    else if (acad.diplome_actuel) payload.level = acad.diplome_actuel;
    if (info.ville) payload.city = info.ville;
    const interets = pref.centres_interet;
    if (Array.isArray(interets) && interets.length > 0) payload.interests = interets;
    const hasData = ['full_name','average','bac_type','level','city','interests'].some(k => payload[k] !== undefined);
    if (!hasData) return;
    await fetch(`${API}/api/profil`, {
      method: 'PUT', credentials: 'include',
      headers: { 'Content-Type': 'application/json', 'X-User-Id': userId },
      body: JSON.stringify(payload),
    });
    console.log('[CHAT→DB] Profil persisté');
  } catch (e) { console.warn('[CHAT→DB]', e); }
}

// Durée du compte à rebours avant envoi automatique (en secondes)
const AUTO_SEND_DELAY = 3;

export default function ChatInput() {
  const [input,               setInput]               = useState('');
  const [isRecording,         setIsRecording]         = useState(false);
  const [recordingTime,       setRecordingTime]       = useState(0);
  const [audioUrl,            setAudioUrl]            = useState<string | null>(null);
  const [isTranscribing,      setIsTranscribing]      = useState(false);
  const [transcribedText,     setTranscribedText]     = useState('');
  // Compte à rebours avant envoi auto (null = pas actif)
  const [autoSendCountdown,   setAutoSendCountdown]   = useState<number | null>(null);
  // true = l'étudiant a modifié la transcription → envoi manuel uniquement
  const [isManualMode,        setIsManualMode]        = useState(false);
  const [liveOpen,            setLiveOpen]            = useState(false);

  const mediaRecRef          = useRef<MediaRecorder | null>(null);
  const chunksRef            = useRef<BlobPart[]>([]);
  const timerRef             = useRef<NodeJS.Timeout | null>(null);
  const autoSendTimerRef     = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef          = useRef<HTMLTextAreaElement>(null);

  const { addMessage, setTyping, isTyping } = useChatStore();
  const { setProfil }                        = useSessionStore();
  const { setPeerBadge }                     = usePanelStore();

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  }, [input]);

  // Suggestions
  useEffect(() => {
    const handler = (e: Event) => {
      const msg = (e as CustomEvent<string>).detail;
      if (msg) sendText(msg);
    };
    window.addEventListener('sami:suggestion', handler);
    return () => window.removeEventListener('sami:suggestion', handler);
  }, [isTyping]); // eslint-disable-line

  // Chrono enregistrement
  useEffect(() => {
    if (isRecording) { timerRef.current = setInterval(() => setRecordingTime(p => p + 1), 1000); }
    else             { if (timerRef.current) clearInterval(timerRef.current); setRecordingTime(0); }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRecording]);

  // Nettoyage des timers au démontage
  useEffect(() => {
    return () => {
      clearAutoSendTimers();
    };
  }, []);

  // ── Helpers timers ────────────────────────────────────────
  const clearAutoSendTimers = () => {
    if (autoSendTimerRef.current) {
      clearTimeout(autoSendTimerRef.current);
      autoSendTimerRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  };

  // ── Enregistrement vocal ──────────────────────────────────
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm';
      const mr = new MediaRecorder(stream, { mimeType: mime });
      mediaRecRef.current = mr;
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunksRef.current, { type: mime });
        const url  = URL.createObjectURL(blob);
        setAudioUrl(url);
        setIsRecording(false);
        // Réinitialiser les états avant transcription
        setTranscribedText('');
        setIsManualMode(false);
        setAutoSendCountdown(null);
        await transcribeToField(blob);
      };
      mr.start();
      setIsRecording(true);
      setTranscribedText('');
      setAudioUrl(null);
      setIsManualMode(false);
    } catch { alert("Impossible d'accéder au microphone."); }
  };

  const stopRecording = () => {
    if (mediaRecRef.current?.state === 'recording') mediaRecRef.current.stop();
  };

  // ── Transcription → remplit le champ + auto-send ─────────
  const transcribeToField = async (blob: Blob) => {
    if (blob.size < 600) return;
    setIsTranscribing(true);
    try {
      const fd = new FormData();
      fd.append('audio', blob, 'voice.webm');
      fd.append('lang', 'fr');
      const res  = await fetch(`${API}/api/voice/transcribe`, { method: 'POST', credentials: 'include', body: fd });
      const data = await res.json();
      if (!data.no_speech && data.text?.trim()) {
        const text = data.text.trim();
        setTranscribedText(text);
        setInput(text);
        setTimeout(() => textareaRef.current?.focus(), 100);

        // ── Démarrer le compte à rebours pour envoi automatique ──
        let remaining = AUTO_SEND_DELAY;
        setAutoSendCountdown(remaining);

        countdownIntervalRef.current = setInterval(() => {
          remaining -= 1;
          setAutoSendCountdown(remaining);
          if (remaining <= 0 && countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
        }, 1000);

        // Timer principal : envoi après AUTO_SEND_DELAY secondes
        autoSendTimerRef.current = setTimeout(() => {
          setAutoSendCountdown(null);
          setTranscribedText('');
          // Lire la valeur courante de l'input via le ref du textarea
          const currentText = textareaRef.current?.value || text;
          sendText(currentText);
        }, AUTO_SEND_DELAY * 1000);
      }
    } catch { console.warn('[TRANSCRIBE]'); }
    finally { setIsTranscribing(false); }
  };

  // ── L'étudiant modifie le texte transcrit → annuler auto-send ──
  const handleTranscriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Annuler les timers d'envoi automatique
    clearAutoSendTimers();
    setAutoSendCountdown(null);
    setIsManualMode(true); // passer en mode manuel
    setInput(e.target.value);
  };

  // ── Annuler tout (audio + transcription + auto-send) ──────
  const cancelAudio = () => {
    clearAutoSendTimers();
    setAutoSendCountdown(null);
    setIsManualMode(false);
    if (audioUrl) { URL.revokeObjectURL(audioUrl); setAudioUrl(null); }
    setTranscribedText('');
    setInput('');
  };

  // ── Envoi du message ──────────────────────────────────────
  const sendText = async (text: string) => {
    if (!text.trim() || isTyping) return;
    // Annuler les timers si envoi manuel pendant le countdown
    clearAutoSendTimers();
    setAutoSendCountdown(null);
    setIsManualMode(false);
    setInput('');
    setTranscribedText('');
    if (audioUrl) { URL.revokeObjectURL(audioUrl); setAudioUrl(null); }
    addMessage({ id: uuidv4(), content: text, sender: 'user', created_at: new Date().toISOString() });
    setTyping(true);
    try {
      const data = await chatbotService.sendMessage(text);
      addMessage({ id: uuidv4(), content: data.reponse || data.response || '', sender: 'ai', created_at: new Date().toISOString() });
      if (data.profil) {
        setProfil(data.profil as Parameters<typeof setProfil>[0]);
        await persistProfilEnDB(data.profil as Record<string, unknown>);
        window.dispatchEvent(new CustomEvent('sami:profile-updated'));
      }
      if (data.peer_match) setPeerBadge(true);
    } catch {
      addMessage({ id: uuidv4(), content: '⚠️ Erreur. Réessaie.', sender: 'ai', created_at: new Date().toISOString() });
    } finally { setTyping(false); }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const canSend    = (input.trim().length > 0) && !isTyping && !isRecording && !isTranscribing;

  // ── Indicateur visuel du countdown (arc SVG) ─────────────
  const CountdownRing = ({ value }: { value: number }) => {
    const r = 10;
    const circ = 2 * Math.PI * r;
    const progress = (value / AUTO_SEND_DELAY) * circ;
    return (
      <svg width="28" height="28" viewBox="0 0 28 28" className="rotate-[-90deg]">
        <circle cx="14" cy="14" r={r} fill="none" stroke="#fed7aa" strokeWidth="3" />
        <circle
          cx="14" cy="14" r={r} fill="none"
          stroke="#f97316" strokeWidth="3"
          strokeDasharray={`${progress} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.9s linear' }}
        />
      </svg>
    );
  };

  return (
    <>
      {liveOpen && typeof document !== 'undefined' &&
        createPortal(<LiveModeModal onClose={() => setLiveOpen(false)} />, document.body)
      }

      <div className="sticky bottom-0 left-0 right-0 px-4 pb-6 pt-6 bg-gradient-to-t from-white dark:from-slate-900 via-white/80 dark:via-slate-900/80 to-transparent">
        <div className="max-w-4xl mx-auto space-y-2">

          {/* ── Preview Audio + Transcription ─────────────── */}
          {(audioUrl || isTranscribing || transcribedText) && (
            <div className="flex flex-col gap-2 p-3 bg-white dark:bg-slate-800 border border-[#006666]/20 dark:border-emerald-700/20 rounded-2xl shadow-sm animate-in slide-in-from-bottom-2 duration-200">

              {/* Lecteur audio */}
              {audioUrl && !isTranscribing && (
                <div className="flex items-center gap-3">
                  <audio controls src={audioUrl} className="flex-1 h-8" style={{ minWidth: 0 }} />
                  <button
                    onClick={cancelAudio}
                    className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                  >
                    <X size={15} />
                  </button>
                </div>
              )}

              {/* Indicateur transcription */}
              {isTranscribing && (
                <div className="flex items-center gap-2 text-[12px] text-orange-500 dark:text-orange-400">
                  <Loader2 size={13} className="animate-spin shrink-0" />
                  <span>Transcription en cours…</span>
                </div>
              )}

              {/* Texte transcrit + compte à rebours */}
              {transcribedText && !isTranscribing && (
                <div className="flex items-start gap-2">
                  <Edit3 size={13} className="text-[#006666] shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">

                    {/* En-tête : label + état (countdown ou mode manuel) */}
                    <div className="flex items-center justify-between mb-1.5 gap-2">
                      <p className="text-[10px] text-[#006666] font-bold uppercase tracking-widest shrink-0">
                        {isManualMode ? 'Modifie et envoie :' : 'Transcrit — modifie si besoin :'}
                      </p>

                      {!isManualMode && autoSendCountdown !== null ? (
                        /* ── Compte à rebours actif ── */
                        <div className="flex items-center gap-1.5 shrink-0">
                          <div className="relative flex items-center justify-center">
                            <CountdownRing value={autoSendCountdown} />
                            <span className="absolute text-[9px] font-black text-orange-500">
                              {autoSendCountdown}
                            </span>
                          </div>
                          <span className="text-[10px] text-orange-500 font-semibold">
                            envoi auto…
                          </span>
                          <button
                            onClick={cancelAudio}
                            className="text-[9px] font-bold text-red-400 hover:text-red-600 underline underline-offset-2 transition-colors ml-0.5"
                          >
                            Annuler
                          </button>
                        </div>
                      ) : isManualMode ? (
                        /* ── Mode manuel après modification ── */
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 shrink-0">
                          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Prêt — clique sur Envoyer ↗
                        </span>
                      ) : null}
                    </div>

                    {/* Textarea éditable */}
                    <textarea
                      value={input}
                      onChange={handleTranscriptChange}
                      rows={2}
                      className={cn(
                        'w-full text-sm bg-slate-50 dark:bg-slate-700 border rounded-xl px-3 py-2',
                        'text-slate-800 dark:text-slate-100 resize-none outline-none transition-colors',
                        isManualMode
                          ? 'border-[#006666] ring-1 ring-[#006666]/20'
                          : 'border-slate-200 dark:border-slate-600 focus:border-[#006666]'
                      )}
                      placeholder="Modifie le texte ici…"
                    />

                    {/* Indication subtile */}
                    {!isManualMode && autoSendCountdown !== null && (
                      <p className="text-[9px] text-gray-400 mt-1">
                        💡 Commence à modifier pour annuler l'envoi automatique
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Barre principale ─────────────────────────── */}
          <div className={cn(
            'relative bg-white dark:bg-slate-800 border-2 rounded-[24px] shadow-xl transition-all duration-300',
            isRecording
              ? 'border-red-400/50 ring-4 ring-red-500/5'
              : 'border-gray-100 dark:border-slate-700 focus-within:border-[#006666]/30 focus-within:shadow-2xl'
          )}>
            <div className="flex items-end gap-2 px-4 py-3">

              {/* Textarea principal ou état enregistrement */}
              {!isRecording ? (
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={e => {
                    // Si on modifie directement le champ principal pendant le countdown
                    if (autoSendCountdown !== null && !isManualMode) {
                      clearAutoSendTimers();
                      setAutoSendCountdown(null);
                      setIsManualMode(true);
                    }
                    setInput(e.target.value);
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendText(input);
                    }
                  }}
                  placeholder={isTranscribing ? 'Transcription…' : 'Pose ta question à SAMI…'}
                  disabled={isTranscribing}
                  rows={1}
                  className="flex-1 resize-none bg-transparent border-none outline-none text-[15px] py-2.5 max-h-[160px] text-gray-800 dark:text-slate-100 placeholder:text-gray-400"
                />
              ) : (
                <div className="flex-1 flex items-center gap-4 py-3 px-2">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
                    </span>
                    <span className="text-sm font-mono font-bold text-red-600">{formatTime(recordingTime)}</span>
                  </div>
                  <div className="flex-1 h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-400 to-red-600 animate-pulse w-full rounded-full" />
                  </div>
                  <button
                    onClick={stopRecording}
                    className="text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1 rounded-lg transition-colors"
                  >
                    Arrêter
                  </button>
                </div>
              )}

              {/* Boutons droite */}
              <div className="flex items-center gap-1.5 mb-1">

                {/* Bouton LIVE */}
                <button
                  type="button"
                  onClick={() => setLiveOpen(true)}
                  title="Mode Live — conversation vocale temps réel"
                  className="relative p-2.5 rounded-full bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 ring-1 ring-orange-500/20 hover:ring-orange-500/40 transition-all"
                >
                  <Zap size={18} className="fill-orange-500" />
                  <span className="absolute top-1 right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                  </span>
                </button>

                {/* Micro */}
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={startRecording}
                    disabled={isTranscribing}
                    title="Enregistrer — transcription affichée avant envoi automatique"
                    className="p-2.5 text-gray-400 hover:text-[#006666] hover:bg-emerald-50 dark:hover:bg-emerald-900/10 rounded-full transition-all disabled:opacity-40"
                  >
                    <Mic size={22} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="p-2.5 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-full transition-all animate-pulse"
                  >
                    <MicOff size={22} />
                  </button>
                )}

                {/* Envoyer */}
                <button
                  type="button"
                  onClick={() => sendText(input)}
                  disabled={!canSend}
                  className={cn(
                    'w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300',
                    canSend
                      ? 'bg-[#006666] text-white shadow-lg shadow-emerald-900/20 hover:scale-105 hover:shadow-xl'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-300 dark:text-slate-600 cursor-not-allowed'
                  )}
                >
                  {isTyping
                    ? <Loader2 size={18} className="animate-spin" />
                    : autoSendCountdown !== null && !isManualMode
                      /* Mini ring dans le bouton Send pendant le countdown */
                      ? (
                        <div className="relative flex items-center justify-center w-5 h-5">
                          <svg width="20" height="20" viewBox="0 0 20 20" className="absolute rotate-[-90deg]">
                            <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                            <circle
                              cx="10" cy="10" r="8" fill="none"
                              stroke="currentColor" strokeWidth="2"
                              strokeDasharray={`${(autoSendCountdown / AUTO_SEND_DELAY) * 50.3} 50.3`}
                              strokeLinecap="round"
                              style={{ transition: 'stroke-dasharray 0.9s linear' }}
                            />
                          </svg>
                          <Send size={12} />
                        </div>
                      )
                      : <Send size={18} />
                  }
                </button>
              </div>
            </div>

            {/* Hint bas */}
            <div className="px-5 pb-2.5 flex items-center gap-3">
              <button
                onClick={() => setLiveOpen(true)}
                className="text-[10px] text-orange-400/60 hover:text-orange-400 transition-colors flex items-center gap-1"
              >
                <Zap size={9} className="fill-current" /> Mode Live — parler directement à SAMI
              </button>
              <span className="text-[10px] text-gray-300 dark:text-slate-600">·</span>
              <span className="text-[10px] text-gray-400">
                🎤 Micro → envoi auto dans {AUTO_SEND_DELAY}s · modifie pour annuler
              </span>
            </div>

            {/* Barre déco */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[3px] flex rounded-b-full overflow-hidden">
              <div className="flex-1 bg-[#006666]" />
              <div className="flex-1 bg-[#CC0000]" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}