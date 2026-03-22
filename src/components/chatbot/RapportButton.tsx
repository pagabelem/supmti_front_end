// src/components/chatbot/RapportButton.tsx
// Bouton à placer dans la Sidebar ou le header du chatbot
'use client';
import { useState }       from 'react';
import { FileText, FileDown, Loader2, ChevronDown } from 'lucide-react';
import { cn }             from '@/lib/utils';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

function getUserId(): string {
  try {
    const raw = localStorage.getItem('supmti-auth');
    if (!raw) return '';
    return JSON.parse(raw)?.state?.user?.id || '';
  } catch { return ''; }
}

export default function RapportButton() {
  const [loading, setLoading] = useState<'pdf'|'word'|null>(null);
  const [open,    setOpen]    = useState(false);
  const [error,   setError]   = useState<string|null>(null);

  const download = async (format: 'pdf' | 'word') => {
    setLoading(format);
    setError(null);
    setOpen(false);

    try {
      const uid = getUserId();
      const res = await fetch(`${API}/api/rapport/${format}`, {
        credentials: 'include',
        headers:     uid ? { 'X-User-Id': uid } : {},
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json.error || 'Erreur lors de la génération.');
        return;
      }

      const blob     = await res.blob();
      const url      = URL.createObjectURL(blob);
      const a        = document.createElement('a');
      a.href         = url;
      a.download     = format === 'pdf' ? 'rapport_sami.pdf' : 'rapport_sami.docx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch {
      setError('Impossible de joindre le serveur.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="relative">
      {/* Bouton principal */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl
          bg-[#006666]/10 hover:bg-[#006666]/20 dark:bg-[#006666]/20 dark:hover:bg-[#006666]/30
          text-[#006666] dark:text-emerald-400
          transition-all text-sm font-semibold"
      >
        <FileDown size={16} />
        <span className="flex-1 text-left">Télécharger le rapport</span>
        <ChevronDown size={14} className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute bottom-full mb-2 left-0 right-0 z-50
          bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700
          rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">

          <button
            onClick={() => download('pdf')}
            disabled={!!loading}
            className="flex items-center gap-3 w-full px-4 py-3
              hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors
              text-sm text-gray-700 dark:text-gray-200 disabled:opacity-50"
          >
            {loading === 'pdf'
              ? <Loader2 size={16} className="animate-spin text-[#006666]" />
              : <span className="text-red-500 font-bold text-xs">PDF</span>
            }
            <span>Rapport PDF</span>
          </button>

          <div className="h-px bg-gray-100 dark:bg-slate-700" />

          <button
            onClick={() => download('word')}
            disabled={!!loading}
            className="flex items-center gap-3 w-full px-4 py-3
              hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors
              text-sm text-gray-700 dark:text-gray-200 disabled:opacity-50"
          >
            {loading === 'word'
              ? <Loader2 size={16} className="animate-spin text-blue-500" />
              : <span className="text-blue-600 font-bold text-xs">DOCX</span>
            }
            <span>Rapport Word</span>
          </button>
        </div>
      )}

      {/* Erreur */}
      {error && (
        <p className="mt-2 text-xs text-red-500 text-center">{error}</p>
      )}
    </div>
  );
}