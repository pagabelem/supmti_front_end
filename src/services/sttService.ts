// src/services/sttService.ts
// Transcrit l'audio via /test-stt/transcribe puis envoie le texte à SAMI

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

function getUserId(): string {
  try {
    const raw = localStorage.getItem('supmti-auth');
    if (!raw) return '';
    return JSON.parse(raw)?.state?.user?.id || '';
  } catch { return ''; }
}

export interface TranscribeResult {
  success: boolean;
  text?:   string;
  language?: string;
  error?:  string;
}

export async function transcribeAudio(blob: Blob): Promise<TranscribeResult> {
  const formData = new FormData();
  formData.append('file', blob, 'audio.webm');

  const uid = getUserId();
  const res = await fetch(`${API}/test-stt/transcribe`, {
    method:      'POST',
    credentials: 'include',
    headers:     uid ? { 'X-User-Id': uid } : {},
    body:        formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return { success: false, error: err.detail || `Erreur ${res.status}` };
  }

  const data = await res.json();

  // La route /test-stt/transcribe renvoie directement le résultat de transcribe_with_detection
  // { text, language, source, ... }
  if (data.source === 'error' || !data.text) {
    return { success: false, error: data.text || 'Transcription vide' };
  }

  return {
    success:  true,
    text:     data.text,
    language: data.language,
  };
}

export async function extractOcr(file: File): Promise<{
  success: boolean;
  grades?: { grade: number; subject: string }[];
  full_text?: string;
  error?: string;
}> {
  const formData = new FormData();
  formData.append('file', file);

  const uid = getUserId();
  const res = await fetch(`${API}/ocr/bulletin`, {
    method:      'POST',
    credentials: 'include',
    headers:     uid ? { 'X-User-Id': uid } : {},
    body:        formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return { success: false, error: err.detail || `Erreur ${res.status}` };
  }

  return res.json();
}

// ── TTS : synthèse vocale via backend gTTS ────────────────────
export async function synthesizeSpeech(text: string, lang = 'fr'): Promise<Blob | null> {
  try {
    const uid = getUserId();
    const res = await fetch(`${API}/api/tts`, {
      method:      'POST',
      headers:     {
        'Content-Type': 'application/json',
        ...(uid ? { 'X-User-Id': uid } : {}),
      },
      credentials: 'include',
      body:        JSON.stringify({ text, lang }),
    });
    if (!res.ok) return null;
    return await res.blob();
  } catch {
    return null;
  }
}