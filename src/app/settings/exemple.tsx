// ============================================================
// EXEMPLE D'UTILISATION de useLang dans n'importe quel composant
// ============================================================

// 1. Import du hook
import { useLang } from '@/i18n/LanguageContext';

// 2. Dans le composant
export function MonComposant() {
  const { t, lang, isRTL } = useLang();

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Traduire un texte */}
      <button>{t('chat', 'send')}</button>           {/* → "Envoyer" / "Send" / "إرسال" */}
      <p>{t('nav', 'fitscore')}</p>                  {/* → "FitScore IA" / "AI FitScore" / "FitScore" */}
      <p>{t('panels', 'loading')}</p>                {/* → "Analyse en cours…" */}
      <p>{t('settings', 'lang_section')}</p>         {/* → "Langue et Région" */}

      {/* Utiliser la langue pour appels backend */}
      <button onClick={async () => {
        await fetch('/api/voice/chat', {
          method: 'POST',
          body: JSON.stringify({ message: 'Bonjour', lang })  // ← passer lang directement
        });
      }}>
        Parler à SAMI
      </button>
    </div>
  );
}

// 3. Exemple Sidebar traduite
export function Sidebar() {
  const { t } = useLang();
  return (
    <nav>
      <a href="/chat">{t('nav', 'chat')}</a>
      <a href="/settings">{t('nav', 'settings')}</a>
    </nav>
  );
}