// src/components/chatbot/ChatInput.tsx
'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Mic, Paperclip, X, Loader2, FileText, Image as ImageIcon, Square } from 'lucide-react';
import { cn }        from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';

import chatbotService      from '@/services/chatbotService';
import { useChatStore }    from '@/store/chatStore';
import { useSessionStore } from '@/store/sessionStore';
import { usePanelStore }   from '@/store/panelStore';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

function getUserId(): string {
  try {
    const raw = localStorage.getItem('supmti-auth');
    if (!raw) return '';
    return JSON.parse(raw)?.state?.user?.id || '';
  } catch { return ''; }
}

export default function ChatInput() {
  const [input,         setInput]         = useState('');
  const [isRecording,   setIsRecording]   = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing,  setIsProcessing]  = useState(false);
  const [uploadedFile,  setUploadedFile]  = useState<File | null>(null);
  const [isOcrLoading,  setIsOcrLoading]  = useState(false);
  // Blob audio enregistré, prêt à être écouté/envoyé
  const [pendingAudio,  setPendingAudio]  = useState<Blob | null>(null);
  const [audioUrl,      setAudioUrl]      = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef         = useRef<NodeJS.Timeout | null>(null);
  const textareaRef      = useRef<HTMLTextAreaElement>(null);
  const fileInputRef     = useRef<HTMLInputElement>(null);

  const { addMessage, setTyping, isTyping } = useChatStore();
  const { setProfil }                       = useSessionStore();
  const { setPeerBadge }                    = usePanelStore();

  const isBusy = isTyping || isProcessing || isOcrLoading;

  // Nettoyer l'URL audio quand le composant est démonté
  useEffect(() => {
    return () => { if (audioUrl) URL.revokeObjectURL(audioUrl); };
  }, [audioUrl]);

  /* ── Auto-resize textarea ── */
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  }, [input]);

  /* ── Envoi texte ── */
  const sendText = useCallback(async (text: string) => {
    if (!text.trim() || isBusy) return;
    addMessage({ id: uuidv4(), content: text, sender: 'user', created_at: new Date().toISOString() });
    setInput('');
    setTyping(true);
    try {
      const data    = await chatbotService.sendMessage(text);
      const contenu = data.reponse ?? data.response ?? '⚠️ Réponse vide.';
      addMessage({ id: uuidv4(), content: contenu, sender: 'ai', created_at: new Date().toISOString() });
      if (data.profil) { setProfil(data.profil as any); window.dispatchEvent(new CustomEvent('sami:profile-updated')); }
      if (data.peer_match) setPeerBadge();
    } catch {
      addMessage({ id: uuidv4(), content: '⚠️ Une erreur est survenue.', sender: 'ai', created_at: new Date().toISOString() });
    } finally {
      setTyping(false);
    }
  }, [isBusy, addMessage, setTyping, setProfil, setPeerBadge]);

  /* ── Envoi audio → STT → SAMI ── */
  const sendAudio = useCallback(async (blob: Blob) => {
    // Effacer le preview audio
    if (audioUrl) { URL.revokeObjectURL(audioUrl); setAudioUrl(null); }
    setPendingAudio(null);
    setIsProcessing(true);

    addMessage({ id: uuidv4(), content: '🎤 *Transcription en cours…*', sender: 'user', created_at: new Date().toISOString() });

    try {
      const formData = new FormData();
      formData.append('file', blob, 'audio.webm');
      const uid = getUserId();
      const res = await fetch(`${API}/test-stt/transcribe`, {
        method: 'POST', credentials: 'include',
        headers: uid ? { 'X-User-Id': uid } : {},
        body: formData,
      });
      const data = await res.json();

      if (data.source === 'error' || !data.text) {
        addMessage({ id: uuidv4(), content: `⚠️ Transcription échouée : ${data.text || 'Texte vide'}`, sender: 'ai', created_at: new Date().toISOString() });
        return;
      }

      addMessage({ id: uuidv4(), content: `🎤 *"${data.text}"*`, sender: 'user', created_at: new Date().toISOString() });
      setIsProcessing(false);

      // Envoyer à SAMI
      setTyping(true);
      const chatData = await chatbotService.sendMessage(data.text);
      const contenu  = chatData.reponse ?? chatData.response ?? '⚠️ Réponse vide.';
      addMessage({ id: uuidv4(), content: contenu, sender: 'ai', created_at: new Date().toISOString() });
      if (chatData.profil) { setProfil(chatData.profil as any); window.dispatchEvent(new CustomEvent('sami:profile-updated')); }
      if (chatData.peer_match) setPeerBadge();

    } catch {
      addMessage({ id: uuidv4(), content: '⚠️ Impossible de traiter le message vocal.', sender: 'ai', created_at: new Date().toISOString() });
    } finally {
      setIsProcessing(false);
      setTyping(false);
    }
  }, [audioUrl, addMessage, setTyping, setProfil, setPeerBadge]);

  /* ── OCR ── */
  const handleFileUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      addMessage({ id: uuidv4(), content: '⚠️ Format non supporté. Envoie une image (JPG, PNG) ou un PDF.', sender: 'ai', created_at: new Date().toISOString() });
      return;
    }
    setUploadedFile(file);
    setIsOcrLoading(true);
    addMessage({ id: uuidv4(), content: `📎 **${file.name}** — Analyse en cours…`, sender: 'user', created_at: new Date().toISOString() });
    try {
      const formData = new FormData();
      formData.append('file', file);
      const uid = getUserId();
      const res = await fetch(`${API}/ocr/bulletin`, {
        method: 'POST', credentials: 'include',
        headers: uid ? { 'X-User-Id': uid } : {},
        body: formData,
      });
      const data = await res.json();
      if (!data.success) {
        addMessage({ id: uuidv4(), content: `⚠️ Impossible de lire le fichier : ${data.error || 'Erreur OCR'}`, sender: 'ai', created_at: new Date().toISOString() });
        return;
      }
      const grades  = data.grades || [];
      const avgCalc = grades.length > 0 ? (grades.reduce((s: number, g: any) => s + g.grade, 0) / grades.length).toFixed(2) : null;
      let summary   = `📄 **Document analysé !**\n\n`;
      if (grades.length > 0) {
        summary += `📊 **${grades.length} note(s) :**\n`;
        grades.slice(0, 8).forEach((g: any) => { summary += `• ${g.subject !== 'Inconnue' ? g.subject : 'Matière'} : **${g.grade}/20**\n`; });
        if (avgCalc) summary += `\n🎯 **Moyenne : ${avgCalc}/20**`;
      } else {
        summary += `📝 ${(data.full_text || '').slice(0, 300)}`;
      }
      addMessage({ id: uuidv4(), content: summary, sender: 'ai', created_at: new Date().toISOString() });
      if (avgCalc) {
        setIsOcrLoading(false);
        setTyping(true);
        const chatData = await chatbotService.sendMessage(`Ma moyenne est ${avgCalc}/20. Mets à jour mon profil.`);
        const contenu  = chatData.reponse ?? chatData.response ?? '';
        if (contenu) addMessage({ id: uuidv4(), content: contenu, sender: 'ai', created_at: new Date().toISOString() });
        if (chatData.profil) { setProfil(chatData.profil as any); window.dispatchEvent(new CustomEvent('sami:profile-updated')); }
        setTyping(false);
      }
    } catch {
      addMessage({ id: uuidv4(), content: "⚠️ Erreur lors de l'analyse.", sender: 'ai', created_at: new Date().toISOString() });
    } finally {
      setIsOcrLoading(false);
      setUploadedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [addMessage, setTyping, setProfil]);

  /* ── Suggestions ── */
  useEffect(() => {
    const handler = (e: Event) => { const msg = (e as CustomEvent<string>).detail; if (msg) sendText(msg); };
    window.addEventListener('sami:suggestion', handler);
    return () => window.removeEventListener('sami:suggestion', handler);
  }, [sendText]);

  /* ── Chrono ── */
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => setRecordingTime((p) => p + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingTime(0);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream   = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        stream.getTracks().forEach((t) => t.stop());
        // Créer URL pour preview, stocker le blob
        const url = URL.createObjectURL(blob);
        setPendingAudio(blob);
        setAudioUrl(url);
      };
      recorder.start();
      setIsRecording(true);
    } catch {
      alert("Impossible d'accéder au microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const cancelAudio = () => {
    if (audioUrl) { URL.revokeObjectURL(audioUrl); setAudioUrl(null); }
    setPendingAudio(null);
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="sticky bottom-0 left-0 right-0 px-4 pb-6 pt-10 bg-gradient-to-t from-white dark:from-slate-900 to-transparent">
      <div className="max-w-4xl mx-auto">

        {/* Badge STT */}
        {isProcessing && (
          <div className="flex items-center gap-2 mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl w-fit animate-in fade-in">
            <Loader2 size={13} className="animate-spin text-blue-500" />
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Transcription vocale…</span>
          </div>
        )}

        {/* Badge OCR */}
        {isOcrLoading && (
          <div className="flex items-center gap-2 mb-3 p-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl w-fit animate-in fade-in">
            <Loader2 size={13} className="animate-spin text-purple-500" />
            <span className="text-xs font-medium text-purple-600 dark:text-purple-400">Analyse du document…</span>
          </div>
        )}

        {/* ── Preview audio avant envoi ── */}
        {pendingAudio && audioUrl && !isRecording && (
          <div className="mb-3 p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#006666]/10 flex items-center justify-center shrink-0">
                <Mic size={14} className="text-[#006666]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Message vocal enregistré</p>
                {/* Lecteur audio natif */}
                <audio
                  src={audioUrl}
                  controls
                  className="w-full h-8"
                  style={{ accentColor: '#006666' }}
                />
              </div>
              {/* Annuler */}
              <button
                onClick={cancelAudio}
                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                title="Annuler"
              >
                <X size={16} />
              </button>
            </div>
            {/* Bouton envoyer */}
            <button
              onClick={() => sendAudio(pendingAudio)}
              disabled={isBusy}
              className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#006666] text-white font-bold text-sm hover:bg-[#004d4d] transition-all active:scale-95 disabled:opacity-50"
            >
              <Send size={15} />
              Envoyer ce message vocal
            </button>
          </div>
        )}

        <div className={cn(
          "relative bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 rounded-[24px] shadow-2xl transition-all duration-300",
          isRecording && "border-red-500/50 ring-4 ring-red-500/10",
        )}>
          <div className="flex items-end gap-2 px-4 py-3">

            {!isRecording ? (
              <>
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isBusy}
                  title="Envoyer une image ou PDF" className="p-2 text-gray-400 hover:text-[#006666] transition-colors mb-1 disabled:opacity-40">
                  <Paperclip size={22} />
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/jpeg,image/png,image/jpg,application/pdf"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }} />

                <textarea ref={textareaRef} value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendText(input); } }}
                  placeholder={isBusy ? 'Traitement en cours…' : 'Posez votre question à SAMI…'}
                  disabled={isBusy}
                  className="flex-1 resize-none bg-transparent border-none outline-none text-[15px] py-2.5 max-h-[160px] text-gray-800 dark:text-slate-100 disabled:opacity-60"
                  rows={1} />
              </>
            ) : (
              <div className="flex-1 flex items-center gap-4 py-3 px-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
                </span>
                <span className="text-sm font-mono font-bold text-red-600">{fmt(recordingTime)}</span>
                <div className="flex-1 h-1 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 animate-pulse w-full" />
                </div>
                <button onClick={stopRecording}
                  className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors border border-red-200">
                  <Square size={12} fill="currentColor" /> Arrêter
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 mb-1">
              {!isRecording && (
                <button type="button" onClick={startRecording} disabled={isBusy || !!pendingAudio}
                  title="Enregistrer un message vocal"
                  className="p-2.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-all disabled:opacity-40">
                  {isProcessing ? <Loader2 size={22} className="animate-spin text-blue-500" /> : <Mic size={22} />}
                </button>
              )}
              <button type="button" onClick={() => sendText(input)}
                disabled={!input.trim() || isBusy || isRecording}
                className={cn(
                  "w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300",
                  input.trim() && !isBusy && !isRecording
                    ? "bg-[#006666] text-white shadow-lg hover:scale-105"
                    : "bg-gray-100 dark:bg-slate-700 text-gray-300 dark:text-slate-600 cursor-not-allowed"
                )}>
                <Send size={18} />
              </button>
            </div>
          </div>

          <div className="px-5 pb-2">
            <span className="text-[10px] text-gray-300 dark:text-slate-600">
              📎 Image / PDF &nbsp;·&nbsp; 🎤 Vocal
            </span>
          </div>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[3px] flex">
            <div className="flex-1 bg-[#006666] rounded-l-full" />
            <div className="flex-1 bg-[#CC0000] rounded-r-full" />
          </div>
        </div>
      </div>
    </div>
  );
}