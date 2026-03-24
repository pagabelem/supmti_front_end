// ============================================================
// src/i18n/LanguageContext.tsx
// Context global pour la langue de la plateforme
// ============================================================
'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { TRANSLATIONS, Lang } from './translations';

const STORAGE_KEY = 'supmti-lang';
const DEFAULT_LANG: Lang = 'fr';

// ── Types ─────────────────────────────────────────────────────
interface LangContextType {
  lang:      Lang;
  setLang:   (l: Lang) => void;
  t:         (section: string, key: string) => string;
  isRTL:     boolean;
}

// ── Context ───────────────────────────────────────────────────
const LangContext = createContext<LangContextType>({
  lang:    DEFAULT_LANG,
  setLang: () => {},
  t:       () => '',
  isRTL:   false,
});

// ── Provider ─────────────────────────────────────────────────
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  // Charger depuis localStorage au montage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (stored && ['fr', 'en', 'ar'].includes(stored)) {
        setLangState(stored);
        applyLangToDOM(stored);
      }
    } catch {}
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch {}
    applyLangToDOM(l);
  }, []);

  // t('nav', 'chat') → traduit nav.chat dans la langue courante
  const t = useCallback((section: string, key: string): string => {
    const sec = (TRANSLATIONS as any)[section];
    if (!sec) return key;
    const entry = sec[key];
    if (!entry) return key;
    return entry[lang] || entry['fr'] || key;
  }, [lang]);

  const isRTL = lang === 'ar';

  return (
    <LangContext.Provider value={{ lang, setLang, t, isRTL }}>
      {children}
    </LangContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────
export function useLang() {
  return useContext(LangContext);
}

// ── Appliquer la langue au DOM ────────────────────────────────
function applyLangToDOM(lang: Lang) {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = lang;
  document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';
  // Classe CSS pour cibler la direction dans Tailwind
  document.documentElement.classList.toggle('rtl', lang === 'ar');
}