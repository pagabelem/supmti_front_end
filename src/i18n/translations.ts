// ============================================================
// src/i18n/translations.ts
// Dictionnaire complet FR / EN / Darija (AR écrit en latin + arabe)
// ============================================================

export type Lang = 'fr' | 'en' | 'ar';

export const TRANSLATIONS = {
  // ── Navigation / Sidebar ────────────────────────────────────
  nav: {
    chat:       { fr: 'Discussions',        en: 'Conversations',    ar: 'المحادثات' },
    new_chat:   { fr: 'Nouveau chat',       en: 'New chat',         ar: 'محادثة جديدة' },
    history:    { fr: 'Historique',         en: 'History',          ar: 'السجل' },
    fitscore:   { fr: 'FitScore IA',        en: 'AI FitScore',      ar: 'FitScore' },
    admission:  { fr: 'Simulation Admission', en: 'Admission Sim.',  ar: 'محاكاة القبول' },
    carriere:   { fr: 'Simulation Carrière', en: 'Career Sim.',     ar: 'محاكاة المهنة' },
    comparer:   { fr: 'Comparer Filières',  en: 'Compare Programs', ar: 'مقارنة الشعب' },
    psycho:     { fr: 'Test Psycho',        en: 'Psycho Test',      ar: 'الاختبار النفسي' },
    coach:      { fr: 'Coach Académique',   en: 'Academic Coach',   ar: 'المرشد الأكاديمي' },
    peermatch:  { fr: 'Peer Match',         en: 'Peer Match',       ar: 'مطابقة الأقران' },
    settings:   { fr: 'Paramètres',        en: 'Settings',         ar: 'الإعدادات' },
    logout:     { fr: 'Déconnexion',       en: 'Logout',           ar: 'تسجيل الخروج' },
    profil:     { fr: 'Mon Profil',        en: 'My Profile',       ar: 'ملفي' },
  },

  // ── Chat ─────────────────────────────────────────────────────
  chat: {
    placeholder:    { fr: 'Pose ta question à SAMI…',  en: 'Ask SAMI a question…', ar: 'اسأل سامي…' },
    send:           { fr: 'Envoyer',                   en: 'Send',                 ar: 'إرسال' },
    live_mode:      { fr: 'Mode Live',                 en: 'Live Mode',            ar: 'البث المباشر' },
    live_hint:      { fr: 'Activer le Mode Live',      en: 'Activate Live Mode',   ar: 'تفعيل البث' },
    typing:         { fr: 'SAMI est en train d\'écrire…', en: 'SAMI is typing…',  ar: 'سامي يكتب…' },
    empty_title:    { fr: 'Bonjour, je suis Sami !',  en: 'Hello, I am Sami!',    ar: 'مرحباً، أنا سامي!' },
    empty_subtitle: {
      fr: 'Ton conseiller académique personnel de SUPMTI Meknès.',
      en: 'Your personal academic advisor at SUPMTI Meknes.',
      ar: 'مستشارك الأكاديمي الشخصي في SUPMTI مكناس.',
    },
    suggestions: {
      filieres:   { fr: 'Les filières',     en: 'Programs',           ar: 'الشعب' },
      frais:      { fr: 'Frais & Bourses',  en: 'Fees & Scholarships', ar: 'الرسوم والمنح' },
      admission:  { fr: 'Admission',        en: 'Admission',           ar: 'القبول' },
      fitscore:   { fr: 'Mon FitScore',     en: 'My FitScore',         ar: 'FitScore الخاص بي' },
      carriere:   { fr: 'Ma Carrière',      en: 'My Career',           ar: 'مسيرتي المهنية' },
      psycho:     { fr: 'Test Psycho',      en: 'Psycho Test',         ar: 'الاختبار النفسي' },
    },
    error: {
      fr: 'Une erreur est survenue. Réessaie.',
      en: 'An error occurred. Please try again.',
      ar: 'حدث خطأ. حاول مرة أخرى.',
    },
  },

  // ── Settings page ────────────────────────────────────────────
  settings: {
    title:          { fr: 'Paramètres',        en: 'Settings',         ar: 'الإعدادات' },
    subtitle:       { fr: 'Personnalisez votre expérience', en: 'Customize your experience', ar: 'خصص تجربتك' },
    save:           { fr: 'Sauvegarder',       en: 'Save',             ar: 'حفظ' },
    saving:         { fr: 'Sauvegarde…',       en: 'Saving…',          ar: 'جاري الحفظ…' },
    cancel:         { fr: 'Annuler',           en: 'Cancel',           ar: 'إلغاء' },
    saved:          { fr: 'Préférences sauvegardées !', en: 'Preferences saved!', ar: 'تم حفظ الإعدادات!' },
    // Langue
    lang_section:   { fr: 'Langue et Région', en: 'Language & Region', ar: 'اللغة والمنطقة' },
    lang_label:     { fr: 'Langue de la plateforme', en: 'Platform language', ar: 'لغة المنصة' },
    lang_desc:      { fr: 'SAMI et l\'interface s\'adapteront à votre choix.', en: 'SAMI and the interface will adapt to your choice.', ar: 'ستتكيف سامي والواجهة مع اختيارك.' },
    lang_fr:        { fr: '🇫🇷 Français',      en: '🇫🇷 French',       ar: '🇫🇷 الفرنسية' },
    lang_en:        { fr: '🇬🇧 Anglais',       en: '🇬🇧 English',      ar: '🇬🇧 الإنجليزية' },
    lang_ar:        { fr: '🇲🇦 Darija',        en: '🇲🇦 Darija',       ar: '🇲🇦 الدارجة' },
    // Audio
    audio_section:  { fr: 'Multimodalité Audio', en: 'Audio Settings', ar: 'إعدادات الصوت' },
    tts_label:      { fr: 'Lecture automatique (TTS)', en: 'Auto voice reading (TTS)', ar: 'القراءة التلقائية' },
    tts_desc:       { fr: 'SAMI lira ses réponses à haute voix.', en: 'SAMI will read responses aloud.', ar: 'سيقرأ سامي الردود بصوت عالٍ.' },
    // Apparence
    appearance:     { fr: 'Apparence',        en: 'Appearance',       ar: 'المظهر' },
    light:          { fr: 'Mode Clair',        en: 'Light Mode',       ar: 'الوضع الفاتح' },
    dark:           { fr: 'Mode Sombre',       en: 'Dark Mode',        ar: 'الوضع الداكن' },
    system:         { fr: 'Système',           en: 'System',           ar: 'النظام' },
    // Sécurité
    security:       { fr: 'Sécurité',         en: 'Security',         ar: 'الأمان' },
    change_pwd:     { fr: 'Modifier le mot de passe', en: 'Change password', ar: 'تغيير كلمة المرور' },
    delete_history: { fr: 'Supprimer l\'historique', en: 'Delete history',   ar: 'حذف السجل' },
    // Notifications
    notif_section:  { fr: 'Alertes',          en: 'Notifications',    ar: 'التنبيهات' },
    notif_label:    { fr: 'Notifications FitScore', en: 'FitScore alerts', ar: 'تنبيهات FitScore' },
    notif_desc:     { fr: 'Recevez des alertes pour vos recommandations.', en: 'Receive alerts for your recommendations.', ar: 'تلقَّ تنبيهات لتوصياتك.' },
  },

  // ── Panels ───────────────────────────────────────────────────
  panels: {
    // FitScore
    fitscore_title:   { fr: 'FitScore IA',          en: 'AI FitScore',         ar: 'FitScore' },
    fitscore_btn:     { fr: 'Calculer mon FitScore', en: 'Calculate my FitScore', ar: 'احسب FitScore الخاص بي' },
    fitscore_recalc:  { fr: 'Recalculer',           en: 'Recalculate',          ar: 'إعادة الحساب' },
    fitscore_top:     { fr: 'TOP MATCH',            en: 'TOP MATCH',            ar: 'الأنسب' },
    fitscore_eligible:{ fr: 'Filières accessibles', en: 'Accessible programs',  ar: 'الشعب المتاحة' },
    fitscore_no_elig: { fr: 'Non accessibles',      en: 'Not accessible',       ar: 'غير متاحة' },
    // Admission
    admission_title:  { fr: 'Vérificateur d\'Éligibilité', en: 'Eligibility Check', ar: 'التحقق من الأهلية' },
    admission_btn:    { fr: 'Simuler mon admission', en: 'Simulate my admission', ar: 'محاكاة قبولي' },
    admission_rerun:  { fr: 'Relancer la simulation', en: 'Re-run simulation',  ar: 'إعادة المحاكاة' },
    // Carrière
    carriere_title:   { fr: 'Simulation Carrière',  en: 'Career Simulation',    ar: 'محاكاة المهنة' },
    carriere_btn:     { fr: 'Simuler ma carrière',  en: 'Simulate my career',   ar: 'حاكِ مسيرتي' },
    // Comparer
    comparer_title:   { fr: 'Comparer Filières',    en: 'Compare Programs',     ar: 'مقارنة الشعب' },
    comparer_btn:     { fr: 'Lancer le comparatif', en: 'Start comparison',     ar: 'ابدأ المقارنة' },
    // Coach
    coach_title:      { fr: 'Coach Académique',     en: 'Academic Coach',       ar: 'المرشد الأكاديمي' },
    coach_btn:        { fr: 'Générer mon rapport',  en: 'Generate my report',   ar: 'إنشاء تقريري' },
    // PeerMatch
    peer_title:       { fr: 'Peer Match',           en: 'Peer Match',           ar: 'مطابقة الأقران' },
    peer_btn:         { fr: 'Envoyer la demande',   en: 'Send request',         ar: 'إرسال الطلب' },
    // Psycho
    psycho_title:     { fr: 'Test Psychométrique',  en: 'Psychometric Test',    ar: 'الاختبار النفسي' },
    psycho_btn:       { fr: 'Démarrer l\'analyse',  en: 'Start analysis',       ar: 'ابدأ التحليل' },
    // Communs
    loading:          { fr: 'Analyse en cours…',    en: 'Analysing…',           ar: 'جارٍ التحليل…' },
    error_connection: { fr: 'Erreur de connexion.', en: 'Connection error.',    ar: 'خطأ في الاتصال.' },
    complete_profile: { fr: 'Complète ton profil pour accéder à cette fonctionnalité.', en: 'Complete your profile to access this feature.', ar: 'أكمل ملفك للوصول لهذه الميزة.' },
  },

  // ── Auth ─────────────────────────────────────────────────────
  auth: {
    login:        { fr: 'Se connecter',    en: 'Log in',       ar: 'تسجيل الدخول' },
    register:     { fr: 'S\'inscrire',     en: 'Register',     ar: 'إنشاء حساب' },
    email:        { fr: 'Email',           en: 'Email',        ar: 'البريد الإلكتروني' },
    password:     { fr: 'Mot de passe',    en: 'Password',     ar: 'كلمة المرور' },
    name:         { fr: 'Nom complet',     en: 'Full name',    ar: 'الاسم الكامل' },
    logout:       { fr: 'Déconnexion',     en: 'Logout',       ar: 'تسجيل الخروج' },
    no_account:   { fr: 'Pas de compte ?', en: 'No account?',  ar: 'ليس لديك حساب؟' },
    has_account:  { fr: 'Déjà un compte ?', en: 'Have an account?', ar: 'لديك حساب؟' },
  },

  // ── Communs ──────────────────────────────────────────────────
  common: {
    close:         { fr: 'Fermer',          en: 'Close',         ar: 'إغلاق' },
    confirm:       { fr: 'Confirmer',       en: 'Confirm',       ar: 'تأكيد' },
    back:          { fr: 'Retour',          en: 'Back',          ar: 'رجوع' },
    next:          { fr: 'Suivant',         en: 'Next',          ar: 'التالي' },
    yes:           { fr: 'Oui',             en: 'Yes',           ar: 'نعم' },
    no:            { fr: 'Non',             en: 'No',            ar: 'لا' },
    loading:       { fr: 'Chargement…',     en: 'Loading…',      ar: 'جارٍ التحميل…' },
    error:         { fr: 'Erreur',          en: 'Error',         ar: 'خطأ' },
    success:       { fr: 'Succès',          en: 'Success',       ar: 'نجاح' },
    bac_plus_3:    { fr: 'BAC+3',           en: 'BAC+3',         ar: 'BAC+3' },
    bac_plus_5:    { fr: 'BAC+5',           en: 'BAC+5',         ar: 'BAC+5' },
    module_sami:   { fr: 'Module Intelligent SAMI', en: 'SAMI Smart Module', ar: 'وحدة سامي الذكية' },
  },


// À ajouter dans TRANSLATIONS dans src/i18n/translations.ts
  history: {
    title:           { fr: 'Mémoire de l\'Assistant', en: 'Assistant Memory',     ar: 'ذاكرة المساعد' },
    subtitle_empty:  { fr: 'Aucune conversation pour le moment', en: 'No conversations yet', ar: 'لا توجد محادثات بعد' },
    subtitle_count:  { fr: 'conversation(s) enregistrée(s)', en: 'recorded conversation(s)', ar: 'محادثة (محادثات) مسجلة' },
    refresh:         { fr: 'Actualiser',            en: 'Refresh',               ar: 'تحديث' },
    empty_msg:       { fr: 'Tes conversations avec Sami apparaîtront ici.', en: 'Your conversations with Sami will appear here.', ar: 'ستظهر محادثاتك مع سامي هنا.' },
    empty_hint:      { fr: 'Les conversations sont sauvegardées automatiquement.', en: 'Conversations are saved automatically.', ar: 'يتم حفظ المحادثات تلقائيًا.' },
    start_chat:      { fr: 'Démarrer une conversation', en: 'Start a conversation', ar: 'بدء محادثة' },
    resume:          { fr: 'Reprendre',             en: 'Resume',                ar: 'استئناف' },
    loading:         { fr: 'Chargement de l\'historique…', en: 'Loading history…', ar: 'جارٍ تحميل السجل...' },
    in_progress:     { fr: 'En cours',              en: 'In progress',           ar: 'قيد التنفيذ' },
    delete:          { fr: 'Supprimer',             en: 'Delete',                ar: 'حذف' },
  },




} as const;

// Type helper pour extraire les clés imbriquées
export type TranslationKey = {
  [Section in keyof typeof TRANSLATIONS]: {
    [Key in keyof (typeof TRANSLATIONS)[Section]]: `${Section}.${string & Key}`;
  }[keyof (typeof TRANSLATIONS)[Section]];
}[keyof typeof TRANSLATIONS];