// // ============================================================
// // src/i18n/translations.ts
// // Dictionnaire complet FR / EN / Darija (AR écrit en latin + arabe)
// // ============================================================

// export type Lang = 'fr' | 'en' | 'ar';

// export const TRANSLATIONS = {
//   // ── Navigation / Sidebar ────────────────────────────────────
//   nav: {
//     chat:       { fr: 'Discussions',        en: 'Conversations',    ar: 'المحادثات' },
//     new_chat:   { fr: 'Nouveau chat',       en: 'New chat',         ar: 'محادثة جديدة' },
//     history:    { fr: 'Historique',         en: 'History',          ar: 'السجل' },
//     fitscore:   { fr: 'FitScore IA',        en: 'AI FitScore',      ar: 'FitScore' },
//     admission:  { fr: 'Simulation Admission', en: 'Admission Sim.',  ar: 'محاكاة القبول' },
//     carriere:   { fr: 'Simulation Carrière', en: 'Career Sim.',     ar: 'محاكاة المهنة' },
//     comparer:   { fr: 'Comparer Filières',  en: 'Compare Programs', ar: 'مقارنة الشعب' },
//     psycho:     { fr: 'Test Psycho',        en: 'Psycho Test',      ar: 'الاختبار النفسي' },
//     coach:      { fr: 'Coach Académique',   en: 'Academic Coach',   ar: 'المرشد الأكاديمي' },
//     peermatch:  { fr: 'Peer Match',         en: 'Peer Match',       ar: 'مطابقة الأقران' },
//     settings:   { fr: 'Paramètres',        en: 'Settings',         ar: 'الإعدادات' },
//     logout:     { fr: 'Déconnexion',       en: 'Logout',           ar: 'تسجيل الخروج' },
//     profil:     { fr: 'Mon Profil',        en: 'My Profile',       ar: 'ملفي' },
//     dashboard:        { fr: 'Tableau de bord',    en: 'Dashboard',       ar: 'لوحة القيادة' },
//     navigation_title: { fr: 'Navigation',         en: 'Navigation',      ar: 'التنقل' },
//   },

//   // ── Chat ─────────────────────────────────────────────────────
//   chat: {
//     placeholder:    { fr: 'Pose ta question à SAMI…',  en: 'Ask SAMI a question…', ar: 'اسأل سامي…' },
//     send:           { fr: 'Envoyer',                   en: 'Send',                 ar: 'إرسال' },
//     live_mode:      { fr: 'Mode Live',                 en: 'Live Mode',            ar: 'البث المباشر' },
//     live_hint:      { fr: 'Activer le Mode Live',      en: 'Activate Live Mode',   ar: 'تفعيل البث' },
//     typing:         { fr: 'SAMI est en train d\'écrire…', en: 'SAMI is typing…',  ar: 'سامي يكتب…' },
//     empty_title:    { fr: 'Bonjour, je suis Sami !',  en: 'Hello, I am Sami!',    ar: 'مرحباً، أنا سامي!' },
//     empty_subtitle: {
//       fr: 'Ton conseiller académique personnel de SUPMTI Meknès.',
//       en: 'Your personal academic advisor at SUPMTI Meknes.',
//       ar: 'مستشارك الأكاديمي الشخصي في SUPMTI مكناس.',
//     },
//     suggestions: {
//       filieres:   { fr: 'Les filières',     en: 'Programs',           ar: 'الشعب' },
//       frais:      { fr: 'Frais & Bourses',  en: 'Fees & Scholarships', ar: 'الرسوم والمنح' },
//       admission:  { fr: 'Admission',        en: 'Admission',           ar: 'القبول' },
//       fitscore:   { fr: 'Mon FitScore',     en: 'My FitScore',         ar: 'FitScore الخاص بي' },
//       carriere:   { fr: 'Ma Carrière',      en: 'My Career',           ar: 'مسيرتي المهنية' },
//       psycho:     { fr: 'Test Psycho',      en: 'Psycho Test',         ar: 'الاختبار النفسي' },
//     },
//     error: {
//       fr: 'Une erreur est survenue. Réessaie.',
//       en: 'An error occurred. Please try again.',
//       ar: 'حدث خطأ. حاول مرة أخرى.',
//     },
//   },

//   // ── Settings page ────────────────────────────────────────────
//   settings: {
//     title:          { fr: 'Paramètres',        en: 'Settings',         ar: 'الإعدادات' },
//     subtitle:       { fr: 'Personnalisez votre expérience', en: 'Customize your experience', ar: 'خصص تجربتك' },
//     save:           { fr: 'Sauvegarder',       en: 'Save',             ar: 'حفظ' },
//     saving:         { fr: 'Sauvegarde…',       en: 'Saving…',          ar: 'جاري الحفظ…' },
//     cancel:         { fr: 'Annuler',           en: 'Cancel',           ar: 'إلغاء' },
//     saved:          { fr: 'Préférences sauvegardées !', en: 'Preferences saved!', ar: 'تم حفظ الإعدادات!' },
//     // Langue
//     lang_section:   { fr: 'Langue et Région', en: 'Language & Region', ar: 'اللغة والمنطقة' },
//     lang_label:     { fr: 'Langue de la plateforme', en: 'Platform language', ar: 'لغة المنصة' },
//     lang_desc:      { fr: 'SAMI et l\'interface s\'adapteront à votre choix.', en: 'SAMI and the interface will adapt to your choice.', ar: 'ستتكيف سامي والواجهة مع اختيارك.' },
//     lang_fr:        { fr: '🇫🇷 Français',      en: '🇫🇷 French',       ar: '🇫🇷 الفرنسية' },
//     lang_en:        { fr: '🇬🇧 Anglais',       en: '🇬🇧 English',      ar: '🇬🇧 الإنجليزية' },
//     lang_ar:        { fr: '🇲🇦 Darija',        en: '🇲🇦 Darija',       ar: '🇲🇦 الدارجة' },
//     // Audio
//     audio_section:  { fr: 'Multimodalité Audio', en: 'Audio Settings', ar: 'إعدادات الصوت' },
//     tts_label:      { fr: 'Lecture automatique (TTS)', en: 'Auto voice reading (TTS)', ar: 'القراءة التلقائية' },
//     tts_desc:       { fr: 'SAMI lira ses réponses à haute voix.', en: 'SAMI will read responses aloud.', ar: 'سيقرأ سامي الردود بصوت عالٍ.' },
//     // Apparence
//     appearance:     { fr: 'Apparence',        en: 'Appearance',       ar: 'المظهر' },
//     light:          { fr: 'Mode Clair',        en: 'Light Mode',       ar: 'الوضع الفاتح' },
//     dark:           { fr: 'Mode Sombre',       en: 'Dark Mode',        ar: 'الوضع الداكن' },
//     system:         { fr: 'Système',           en: 'System',           ar: 'النظام' },
//     // Sécurité
//     security:       { fr: 'Sécurité',         en: 'Security',         ar: 'الأمان' },
//     change_pwd:     { fr: 'Modifier le mot de passe', en: 'Change password', ar: 'تغيير كلمة المرور' },
//     delete_history: { fr: 'Supprimer l\'historique', en: 'Delete history',   ar: 'حذف السجل' },
//     // Notifications
//     notif_section:  { fr: 'Alertes',          en: 'Notifications',    ar: 'التنبيهات' },
//     notif_label:    { fr: 'Notifications FitScore', en: 'FitScore alerts', ar: 'تنبيهات FitScore' },
//     notif_desc:     { fr: 'Recevez des alertes pour vos recommandations.', en: 'Receive alerts for your recommendations.', ar: 'تلقَّ تنبيهات لتوصياتك.' },
//   },

//   // ── Panels ───────────────────────────────────────────────────
//   panels: {
//     // FitScore
//     fitscore_title:   { fr: 'FitScore IA',          en: 'AI FitScore',         ar: 'FitScore' },
//     fitscore_btn:     { fr: 'Calculer mon FitScore', en: 'Calculate my FitScore', ar: 'احسب FitScore الخاص بي' },
//     fitscore_recalc:  { fr: 'Recalculer',           en: 'Recalculate',          ar: 'إعادة الحساب' },
//     fitscore_top:     { fr: 'TOP MATCH',            en: 'TOP MATCH',            ar: 'الأنسب' },
//     fitscore_eligible:{ fr: 'Filières accessibles', en: 'Accessible programs',  ar: 'الشعب المتاحة' },
//     fitscore_no_elig: { fr: 'Non accessibles',      en: 'Not accessible',       ar: 'غير متاحة' },
//     // Admission
//     admission_title:  { fr: 'Vérificateur d\'Éligibilité', en: 'Eligibility Check', ar: 'التحقق من الأهلية' },
//     admission_btn:    { fr: 'Simuler mon admission', en: 'Simulate my admission', ar: 'محاكاة قبولي' },
//     admission_rerun:  { fr: 'Relancer la simulation', en: 'Re-run simulation',  ar: 'إعادة المحاكاة' },
//     // Carrière
//     carriere_title:   { fr: 'Simulation Carrière',  en: 'Career Simulation',    ar: 'محاكاة المهنة' },
//     carriere_btn:     { fr: 'Simuler ma carrière',  en: 'Simulate my career',   ar: 'حاكِ مسيرتي' },
//     // Comparer
//     comparer_title:   { fr: 'Comparer Filières',    en: 'Compare Programs',     ar: 'مقارنة الشعب' },
//     comparer_btn:     { fr: 'Lancer le comparatif', en: 'Start comparison',     ar: 'ابدأ المقارنة' },
//     // Coach
//     coach_title:      { fr: 'Coach Académique',     en: 'Academic Coach',       ar: 'المرشد الأكاديمي' },
//     coach_btn:        { fr: 'Générer mon rapport',  en: 'Generate my report',   ar: 'إنشاء تقريري' },
//     // PeerMatch
//     peer_title:       { fr: 'Peer Match',           en: 'Peer Match',           ar: 'مطابقة الأقران' },
//     peer_btn:         { fr: 'Envoyer la demande',   en: 'Send request',         ar: 'إرسال الطلب' },
//     // Psycho
//     psycho_title:     { fr: 'Test Psychométrique',  en: 'Psychometric Test',    ar: 'الاختبار النفسي' },
//     psycho_btn:       { fr: 'Démarrer l\'analyse',  en: 'Start analysis',       ar: 'ابدأ التحليل' },
//     // Communs
//     loading:          { fr: 'Analyse en cours…',    en: 'Analysing…',           ar: 'جارٍ التحليل…' },
//     error_connection: { fr: 'Erreur de connexion.', en: 'Connection error.',    ar: 'خطأ في الاتصال.' },
//     complete_profile: { fr: 'Complète ton profil pour accéder à cette fonctionnalité.', en: 'Complete your profile to access this feature.', ar: 'أكمل ملفك للوصول لهذه الميزة.' },
//   },

//   // ── Auth ─────────────────────────────────────────────────────
//   auth: {
//     login:        { fr: 'Se connecter',    en: 'Log in',       ar: 'تسجيل الدخول' },
//     register:     { fr: 'S\'inscrire',     en: 'Register',     ar: 'إنشاء حساب' },
//     email:        { fr: 'Email',           en: 'Email',        ar: 'البريد الإلكتروني' },
//     password:     { fr: 'Mot de passe',    en: 'Password',     ar: 'كلمة المرور' },
//     name:         { fr: 'Nom complet',     en: 'Full name',    ar: 'الاسم الكامل' },
//     logout:       { fr: 'Déconnexion',     en: 'Logout',       ar: 'تسجيل الخروج' },
//     no_account:   { fr: 'Pas de compte ?', en: 'No account?',  ar: 'ليس لديك حساب؟' },
//     has_account:  { fr: 'Déjà un compte ?', en: 'Have an account?', ar: 'لديك حساب؟' },
//     submit:       { fr: 'Valider',         en: 'Submit',       ar: 'تأكيد' },
//     success_login: { fr: 'Connecté avec succès !', en: 'Successfully logged in!', ar: 'تم تسجيل الدخول بنجاح!' },
//     success_reg:   { fr: 'Compte créé avec succès !', en: 'Account successfully created!', ar: 'تم إنشاء الحساب بنجاح!' },
//     error:         { fr: 'Une erreur est survenue. Réessaie.', en: 'An error occurred. Please try again.', ar: 'حدث خطأ. حاول مرة أخرى.' },
//     error_invalid: { fr: 'Identifiants invalides.', en: 'Invalid credentials.', ar: 'بيانات اعتماد غير صالحة.' },
//     error_exists:  { fr: 'Un compte avec cet email existe déjà.', en: 'An account with this email already exists.', ar: 'يوجد حساب بهذا البريد الإلكتروني بالفعل.' },
//     error_fields:  { fr: 'Tous les champs sont requis.', en: 'All fields are required.', ar: 'جميع الحقول مطلوبة.' },
//     forgot_pwd:   { fr: 'Mot de passe oublié ?', en: 'Forgot password?', ar: 'نسيت كلمة المرور؟' },
//   },

//   // ── Communs ──────────────────────────────────────────────────
//   common: {
//     close:         { fr: 'Fermer',          en: 'Close',         ar: 'إغلاق' },
//     confirm:       { fr: 'Confirmer',       en: 'Confirm',       ar: 'تأكيد' },
//     back:          { fr: 'Retour',          en: 'Back',          ar: 'رجوع' },
//     next:          { fr: 'Suivant',         en: 'Next',          ar: 'التالي' },
//     yes:           { fr: 'Oui',             en: 'Yes',           ar: 'نعم' },
//     no:            { fr: 'Non',             en: 'No',            ar: 'لا' },
//     loading:       { fr: 'Chargement…',     en: 'Loading…',      ar: 'جارٍ التحميل…' },
//     error:         { fr: 'Erreur',          en: 'Error',         ar: 'خطأ' },
//     success:       { fr: 'Succès',          en: 'Success',       ar: 'نجاح' },
//     bac_plus_3:    { fr: 'BAC+3',           en: 'BAC+3',         ar: 'BAC+3' },
//     bac_plus_5:    { fr: 'BAC+5',           en: 'BAC+5',         ar: 'BAC+5' },
//     module_sami:   { fr: 'Module Intelligent SAMI', en: 'SAMI Smart Module', ar: 'وحدة سامي الذكية' },
//   } ,




















// // À ajouter dans TRANSLATIONS dans src/i18n/translations.ts
//   history: {
//     title:           { fr: 'Mémoire de l\'Assistant', en: 'Assistant Memory',     ar: 'ذاكرة المساعد' },
//     subtitle_empty:  { fr: 'Aucune conversation pour le moment', en: 'No conversations yet', ar: 'لا توجد محادثات بعد' },
//     subtitle_count:  { fr: 'conversation(s) enregistrée(s)', en: 'recorded conversation(s)', ar: 'محادثة (محادثات) مسجلة' },
//     refresh:         { fr: 'Actualiser',            en: 'Refresh',               ar: 'تحديث' },
//     empty_msg:       { fr: 'Tes conversations avec Sami apparaîtront ici.', en: 'Your conversations with Sami will appear here.', ar: 'ستظهر محادثاتك مع سامي هنا.' },
//     empty_hint:      { fr: 'Les conversations sont sauvegardées automatiquement.', en: 'Conversations are saved automatically.', ar: 'يتم حفظ المحادثات تلقائيًا.' },
//     start_chat:      { fr: 'Démarrer une conversation', en: 'Start a conversation', ar: 'بدء محادثة' },
//     resume:          { fr: 'Reprendre',             en: 'Resume',                ar: 'استئناف' },
//     loading:         { fr: 'Chargement de l\'historique…', en: 'Loading history…', ar: 'جارٍ تحميل السجل...' },
//     in_progress:     { fr: 'En cours',              en: 'In progress',           ar: 'قيد التنفيذ' },
//     delete:          { fr: 'Supprimer',             en: 'Delete',                ar: 'حذف' },
//   },



//   // À ajouter dans TRANSLATIONS
//   profile: {
//     title:           { fr: 'Mon Profil',           en: 'My Profile',         ar: 'ملفي الشخصي' },
//     saved:           { fr: 'Enregistré',           en: 'Saved',              ar: 'تم الحفظ' },
//     sami_alert:      { fr: 'SAMI a détecté de nouvelles informations !', en: 'SAMI detected new info!', ar: 'سامي اكتشف معلومات جديدة!' },
//     sami_hint:       { fr: 'Pense à sauvegarder pour confirmer.', en: 'Remember to save to confirm.', ar: 'تذكر الحفظ للتأكيد.' },
//     syncing:         { fr: 'Synchronisation...',   en: 'Syncing...',         ar: 'جاري المزامنة...' },
//     // Stats
//     stat_avg:        { fr: 'Moyenne',              en: 'Average',            ar: 'المعدل' },
//     stat_bac:        { fr: 'Série BAC',            en: 'BAC Series',         ar: 'شعبة الباك' },
//     // Form labels
//     label_id:        { fr: 'Identité',             en: 'Identity',           ar: 'الهوية' },
//     label_avg:       { fr: 'Moyenne',              en: 'Average',            ar: 'المعدل' },
//     label_loc:       { fr: 'Localisation',         en: 'Location',           ar: 'الموقع' },
//     label_bac:       { fr: 'Diplôme de base',      en: 'Base Degree',        ar: 'الشهادة الأساسية' },
//     label_status:    { fr: 'Situation Actuelle',    en: 'Current Status',     ar: 'الوضعية الحالية' },
//     label_interests: { fr: 'Passions & Intérêts',  en: 'Passions & Interests', ar: 'الاهتمامات' },
//     // Placeholders
//     ph_name:         { fr: 'Nom et Prénom',        en: 'Full Name',          ar: 'الاسم الكامل' },
//     ph_city:         { fr: 'Ville',                en: 'City',               ar: 'المدينة' },
//     ph_bac:          { fr: 'Choisir ton BAC...',   en: 'Choose your BAC...', ar: 'اختر الباك الخاص بك...' },
//     ph_bac_other:    { fr: 'Précisez votre diplôme...', en: 'Specify your degree...', ar: 'حدد شهادتك...' },
//     ph_level:        { fr: 'Ex: Terminale, BAC+2...', en: 'e.g. Senior, BAC+2...', ar: 'مثال: ثانية باك، BAC+2...' },
//     ph_interests:    { fr: 'IA, Finance, Web...',  en: 'AI, Finance, Web...', ar: 'الذكاء الاصطناعي، المالية...' },
//     // Button
//     btn_save:        { fr: 'Enregistrer les modifications', en: 'Save changes', ar: 'حفظ التغييرات' },
//     btn_up_to_date:  { fr: 'Profil à jour',         en: 'Profile up to date', ar: 'الملف محين' },
//   },


// } as const;

// // Type helper pour extraire les clés imbriquées
// export type TranslationKey = {
//   [Section in keyof typeof TRANSLATIONS]: {
//     [Key in keyof (typeof TRANSLATIONS)[Section]]: `${Section}.${string & Key}`;
//   }[keyof (typeof TRANSLATIONS)[Section]];
// }[keyof typeof TRANSLATIONS];





// ============================================================
// src/i18n/translations.ts
// Dictionnaire complet FR / EN / Darija (AR écrit en latin + arabe)
// ============================================================

export type Lang = 'fr' | 'en' | 'ar';

export const TRANSLATIONS = {
  // ── Navigation / Sidebar ────────────────────────────────────
//   nav: {
//     chat:             { fr: 'Discussions',          en: 'Conversations',      ar: 'المحادثات' },
//     new_chat:         { fr: 'Nouveau chat',         en: 'New chat',           ar: 'محادثة جديدة' },
//     history:          { fr: 'Historique',           en: 'History',            ar: 'السجل' },
//     fitscore:         { fr: 'FitScore IA',          en: 'AI FitScore',        ar: 'FitScore' },
//     admission:        { fr: 'Simulation Admission', en: 'Admission Sim.',     ar: 'محاكاة القبول' },
//     carriere:         { fr: 'Simulation Carrière',  en: 'Career Sim.',        ar: 'محاكاة المهنة' },
//     comparer:         { fr: 'Comparer Filières',    en: 'Compare Programs',   ar: 'مقارنة الشعب' },
//     psycho:           { fr: 'Test Psycho',          en: 'Psycho Test',        ar: 'الاختبار النفسي' },
//     coach:            { fr: 'Coach Académique',     en: 'Academic Coach',     ar: 'المرشد الأكاديمي' },
//     peermatch:        { fr: 'Peer Match',           en: 'Peer Match',         ar: 'مطابقة الأقران' },
//     settings:         { fr: 'Paramètres',           en: 'Settings',           ar: 'الإعدادات' },
//     logout:           { fr: 'Déconnexion',          en: 'Logout',             ar: 'تسجيل الخروج' },
//     profil:           { fr: 'Mon Profil',           en: 'My Profile',         ar: 'ملفي' },
//     dashboard:        { fr: 'Tableau de bord',      en: 'Dashboard',          ar: 'لوحة القيادة' },
//     navigation_title: { fr: 'Navigation',           en: 'Navigation',         ar: 'التنقل' },
//     new_session:      { fr: 'Nouvelle Session',     en: 'New Session',        ar: 'جلسة جديدة' },
//     ai_capabilities:  { fr: 'Capacités IA',         en: 'AI Capabilities',    ar: 'قدرات الذكاء الاصطناعي' },
//     chronologie:      { fr: 'Chronologie',          en: 'Timeline',           ar: 'الجدول الزمني' },
//     no_exchange:      { fr: 'Aucun échange',        en: 'No exchanges yet',   ar: 'لا توجد محادثات' },
//     in_progress:      { fr: '● en cours',           en: '● in progress',      ar: '● جاري' },
//   },




  app: {
    title: { fr: 'SAMI Smart Module', en: 'SAMI Smart Module', ar: 'موديل SAMI الذكي' },
  },

nav: {
    dashboard:        { fr: 'Dashboard',            en: 'Dashboard',            ar: 'لوحة التحكم' },
    chat:             { fr: 'Chatbot IA',           en: 'AI Chatbot',           ar: 'الدردشة الذكية' },
    profil:           { fr: 'Mon Profil',           en: 'My Profile',           ar: 'ملفي الشخصي' },
    history:          { fr: 'Historique',           en: 'History',              ar: 'السجل' },
    settings:         { fr: 'Paramètres',           en: 'Settings',             ar: 'الإعدادات' },

    fitscore:         { fr: 'FitScore IA',          en: 'AI FitScore',          ar: 'فيت سكور الذكي' },
    admission:        { fr: 'Simulation Admission', en: 'Admission Simulation', ar: 'محاكاة القبول' },
    carriere:         { fr: 'Simulation Carrière',  en: 'Career Simulation',    ar: 'محاكاة المسار المهني' },
    comparer:         { fr: 'Comparer Filières',    en: 'Compare Programs',     ar: 'مقارنة التخصصات' },
    psycho:           { fr: 'Test Psycho',          en: 'Psycho Test',          ar: 'الاختبار النفسي' },
    coach:            { fr: 'Coach Académique',     en: 'Academic Coach',       ar: 'المدرب الأكاديمي' },
    peermatch:        { fr: 'Peer Match',           en: 'Peer Match',           ar: 'مطابقة الأقران' },

    new_session:      { fr: 'Nouvelle Session',     en: 'New Session',          ar: 'جلسة جديدة' },
    ai_capabilities:  { fr: 'Capacités IA',         en: 'AI Capabilities',      ar: 'قدرات الذكاء الاصطناعي' },
    navigation_title: { fr: 'Navigation',           en: 'Navigation',           ar: 'التنقل' },
    chronologie:      { fr: 'Chronologie',          en: 'Timeline',             ar: 'التسلسل الزمني' },
    no_exchange:      { fr: 'Aucun échange',        en: 'No conversation yet',  ar: 'لا توجد محادثات بعد' },
    in_progress:      { fr: '● en cours',           en: '● in progress',        ar: '● قيد التنفيذ' },
    logout:           { fr: 'Déconnexion',          en: 'Logout',               ar: 'تسجيل الخروج' },
    student_profile:  { fr: 'Profil étudiant',      en: 'Student Profile',      ar: 'الملف الطلابي' },
},




  // ── Chat ─────────────────────────────────────────────────────
  chat: {
    placeholder:    { fr: 'Pose ta question à SAMI…',        en: 'Ask SAMI a question…',   ar: 'اسأل سامي…' },
    send:           { fr: 'Envoyer',                          en: 'Send',                   ar: 'إرسال' },
    live_mode:      { fr: 'Mode Live',                        en: 'Live Mode',              ar: 'البث المباشر' },
    live_hint:      { fr: 'Activer le Mode Live',             en: 'Activate Live Mode',     ar: 'تفعيل البث' },
    typing:         { fr: 'SAMI est en train d\'écrire…',     en: 'SAMI is typing…',        ar: 'سامي يكتب…' },
    empty_title:    { fr: 'Bonjour, je suis Sami !',         en: 'Hello, I am Sami!',       ar: 'مرحباً، أنا سامي!' },
    empty_subtitle: {
      fr: 'Ton conseiller académique personnel de SUPMTI Meknès.',
      en: 'Your personal academic advisor at SUPMTI Meknes.',
      ar: 'مستشارك الأكاديمي الشخصي في SUPMTI مكناس.',
    },
    suggestions: {
      filieres:   { fr: 'Les filières',     en: 'Programs',            ar: 'الشعب' },
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






  settings: {
  title: {
    fr: 'Paramètres',
    en: 'Settings',
    ar: 'الإعدادات',
  },
  subtitle: {
    fr: 'Personnalisez votre expérience',
    en: 'Customize your experience',
    ar: 'خصص تجربتك',
  },

  save: {
    fr: 'Sauvegarder',
    en: 'Save',
    ar: 'حفظ',
  },
  saving: {
    fr: 'Sauvegarde…',
    en: 'Saving…',
    ar: 'جاري الحفظ…',
  },
  cancel: {
    fr: 'Annuler',
    en: 'Cancel',
    ar: 'إلغاء',
  },
  saved: {
    fr: 'Préférences sauvegardées !',
    en: 'Preferences saved!',
    ar: 'تم حفظ الإعدادات!',
  },

  lang_section: {
    fr: 'Langue et Région',
    en: 'Language & Region',
    ar: 'اللغة والمنطقة',
  },
  lang_label: {
    fr: 'Langue de la plateforme',
    en: 'Platform language',
    ar: 'لغة المنصة',
  },
  lang_desc: {
    fr: "SAMI et l'interface s'adapteront à votre choix.",
    en: 'SAMI and the interface will adapt to your choice.',
    ar: 'ستتكيف سامي والواجهة مع اختيارك.',
  },
  lang_fr: {
    fr: '🇫🇷 Français',
    en: '🇫🇷 French',
    ar: '🇫🇷 الفرنسية',
  },
  lang_en: {
    fr: '🇬🇧 Anglais',
    en: '🇬🇧 English',
    ar: '🇬🇧 الإنجليزية',
  },
  lang_ar: {
    fr: '🇲🇦 Darija',
    en: '🇲🇦 Darija',
    ar: '🇲🇦 الدارجة',
  },
  lang_after_save_fr: {
    fr: 'La langue passera au français après sauvegarde.',
    en: 'Language will switch to French after saving.',
    ar: 'ستتغير اللغة إلى الفرنسية بعد الحفظ.',
  },
  lang_after_save_en: {
    fr: "La langue passera à l'anglais après sauvegarde.",
    en: 'Language will switch to English after saving.',
    ar: 'ستتغير اللغة إلى الإنجليزية بعد الحفظ.',
  },
  lang_after_save_ar: {
    fr: 'La langue passera à la darija après sauvegarde.',
    en: 'Language will switch to Darija after saving.',
    ar: 'ستتغير اللغة إلى الدارجة بعد الحفظ.',
  },
  active_language: {
    fr: 'Langue active',
    en: 'Active language',
    ar: 'اللغة النشطة',
  },

  audio_section: {
    fr: 'Multimodalité Audio',
    en: 'Audio Settings',
    ar: 'إعدادات الصوت',
  },
  tts_label: {
    fr: 'Lecture automatique (TTS)',
    en: 'Auto voice reading (TTS)',
    ar: 'القراءة التلقائية',
  },
  tts_desc: {
    fr: 'SAMI lira ses réponses à haute voix.',
    en: 'SAMI will read responses aloud.',
    ar: 'سيقرأ سامي الردود بصوت عالٍ.',
  },

  appearance: {
    fr: 'Apparence',
    en: 'Appearance',
    ar: 'المظهر',
  },
  light: {
    fr: 'Mode Clair',
    en: 'Light Mode',
    ar: 'الوضع الفاتح',
  },
  dark: {
    fr: 'Mode Sombre',
    en: 'Dark Mode',
    ar: 'الوضع الداكن',
  },
  system: {
    fr: 'Système',
    en: 'System',
    ar: 'النظام',
  },
  app_version: {
    fr: 'Version App',
    en: 'App Version',
    ar: 'إصدار التطبيق',
  },
  rtl_supported: {
    fr: 'Interface compatible RTL ✓',
    en: 'RTL interface supported ✓',
    ar: 'الواجهة تدعم RTL ✓',
  },

  security: {
    fr: 'Sécurité',
    en: 'Security',
    ar: 'الأمان',
  },
  change_pwd: {
    fr: 'Modifier le mot de passe',
    en: 'Change password',
    ar: 'تغيير كلمة المرور',
  },
  password_secure_hint: {
    fr: 'Choisissez un mot de passe sécurisé',
    en: 'Choose a secure password',
    ar: 'اختار كلمة سر آمنة',
  },
  password_changed: {
    fr: 'Mot de passe modifié !',
    en: 'Password changed!',
    ar: 'تم تغيير كلمة المرور!',
  },
  auto_close: {
    fr: 'Fermeture automatique…',
    en: 'Closing automatically…',
    ar: 'سيتم الإغلاق تلقائياً…',
  },
  current_password: {
    fr: 'Mot de passe actuel',
    en: 'Current password',
    ar: 'كلمة المرور الحالية',
  },
  new_password: {
    fr: 'Nouveau mot de passe',
    en: 'New password',
    ar: 'كلمة المرور الجديدة',
  },
  confirm_password: {
    fr: 'Confirmer',
    en: 'Confirm',
    ar: 'تأكيد',
  },
  edit: {
    fr: 'Modifier',
    en: 'Update',
    ar: 'تحديث',
  },
  updating: {
    fr: 'Modification…',
    en: 'Updating…',
    ar: 'جاري التحديث…',
  },

  delete_history: {
    fr: "Supprimer l'historique",
    en: 'Delete history',
    ar: 'حذف السجل',
  },
  delete_history_confirm: {
    fr: "Supprimer tout l'historique ? Action irréversible.",
    en: 'Delete all history? This action cannot be undone.',
    ar: 'هل تريد حذف كل السجل؟ هذا الإجراء لا يمكن التراجع عنه.',
  },
  delete_history_success: {
    fr: 'Historique supprimé.',
    en: 'History deleted.',
    ar: 'تم حذف السجل.',
  },
  delete_history_error: {
    fr: 'Erreur.',
    en: 'Error.',
    ar: 'خطأ.',
  },

  notif_section: {
    fr: 'Alertes',
    en: 'Notifications',
    ar: 'التنبيهات',
  },
  notif_label: {
    fr: 'Notifications FitScore',
    en: 'FitScore alerts',
    ar: 'تنبيهات FitScore',
  },
  notif_desc: {
    fr: 'Recevez des alertes pour vos recommandations.',
    en: 'Receive alerts for your recommendations.',
    ar: 'تلقَّ تنبيهات لتوصياتك.',
  },

  weak: {
    fr: 'Faible',
    en: 'Weak',
    ar: 'ضعيف',
  },
  medium: {
    fr: 'Moyen',
    en: 'Medium',
    ar: 'متوسط',
  },
  good: {
    fr: 'Bon',
    en: 'Good',
    ar: 'جيد',
  },
  strong: {
    fr: 'Fort',
    en: 'Strong',
    ar: 'قوي',
  },
} ,





  // ── Panels ───────────────────────────────────────────────────
  panels: {
    fitscore_title:    { fr: 'FitScore IA',                    en: 'AI FitScore',                  ar: 'FitScore' },
    fitscore_btn:      { fr: 'Calculer mon FitScore',          en: 'Calculate my FitScore',        ar: 'احسب FitScore الخاص بي' },
    fitscore_recalc:   { fr: 'Recalculer',                     en: 'Recalculate',                  ar: 'إعادة الحساب' },
    fitscore_top:      { fr: 'TOP MATCH',                      en: 'TOP MATCH',                    ar: 'الأنسب' },
    fitscore_eligible: { fr: 'Filières accessibles',           en: 'Accessible programs',          ar: 'الشعب المتاحة' },
    fitscore_no_elig:  { fr: 'Non accessibles',                en: 'Not accessible',               ar: 'غير متاحة' },
    admission_title:   { fr: 'Vérificateur d\'Éligibilité',    en: 'Eligibility Check',            ar: 'التحقق من الأهلية' },
    admission_btn:     { fr: 'Simuler mon admission',          en: 'Simulate my admission',        ar: 'محاكاة قبولي' },
    admission_rerun:   { fr: 'Relancer la simulation',         en: 'Re-run simulation',            ar: 'إعادة المحاكاة' },
    carriere_title:    { fr: 'Simulation Carrière',            en: 'Career Simulation',            ar: 'محاكاة المهنة' },
    carriere_btn:      { fr: 'Simuler ma carrière',            en: 'Simulate my career',           ar: 'حاكِ مسيرتي' },
    comparer_title:    { fr: 'Comparer Filières',              en: 'Compare Programs',             ar: 'مقارنة الشعب' },
    comparer_btn:      { fr: 'Lancer le comparatif',           en: 'Start comparison',             ar: 'ابدأ المقارنة' },
    coach_title:       { fr: 'Coach Académique',               en: 'Academic Coach',               ar: 'المرشد الأكاديمي' },
    coach_btn:         { fr: 'Générer mon rapport',            en: 'Generate my report',           ar: 'إنشاء تقريري' },
    peer_title:        { fr: 'Peer Match',                     en: 'Peer Match',                   ar: 'مطابقة الأقران' },
    peer_btn:          { fr: 'Envoyer la demande',             en: 'Send request',                 ar: 'إرسال الطلب' },
    psycho_title:      { fr: 'Test Psychométrique',            en: 'Psychometric Test',            ar: 'الاختبار النفسي' },
    psycho_btn:        { fr: 'Démarrer l\'analyse',            en: 'Start analysis',               ar: 'ابدأ التحليل' },
    loading:           { fr: 'Analyse en cours…',              en: 'Analysing…',                   ar: 'جارٍ التحليل…' },
    error_connection:  { fr: 'Erreur de connexion.',           en: 'Connection error.',            ar: 'خطأ في الاتصال.' },
    complete_profile:  { fr: 'Complète ton profil pour accéder à cette fonctionnalité.', en: 'Complete your profile to access this feature.', ar: 'أكمل ملفك للوصول لهذه الميزة.' },
    module_sami:       { fr: 'Module Intelligent SAMI',        en: 'SAMI Smart Module',            ar: 'وحدة سامي الذكية' },
    supmti_ai:         { fr: 'SUPMTI AI Division',             en: 'SUPMTI AI Division',           ar: 'قسم الذكاء الاصطناعي SUPMTI' },
    version_beta:      { fr: 'v2.0 Beta',                      en: 'v2.0 Beta',                    ar: 'v2.0 تجريبي' },
  },

  // ── Auth ─────────────────────────────────────────────────────
  auth: {
    login:         { fr: 'Se connecter',     en: 'Log in',        ar: 'تسجيل الدخول' },
    register:      { fr: 'S\'inscrire',      en: 'Register',      ar: 'إنشاء حساب' },
    email:         { fr: 'Email',            en: 'Email',         ar: 'البريد الإلكتروني' },
    password:      { fr: 'Mot de passe',     en: 'Password',      ar: 'كلمة المرور' },
    name:          { fr: 'Nom complet',      en: 'Full name',     ar: 'الاسم الكامل' },
    logout:        { fr: 'Déconnexion',      en: 'Logout',        ar: 'تسجيل الخروج' },
    no_account:    { fr: 'Pas de compte ?',  en: 'No account?',   ar: 'ليس لديك حساب؟' },
    has_account:   { fr: 'Déjà un compte ?', en: 'Have an account?', ar: 'لديك حساب؟' },
    submit:        { fr: 'Valider',          en: 'Submit',        ar: 'تأكيد' },
    success_login: { fr: 'Connecté avec succès !',       en: 'Successfully logged in!',          ar: 'تم تسجيل الدخول بنجاح!' },
    success_reg:   { fr: 'Compte créé avec succès !',    en: 'Account successfully created!',    ar: 'تم إنشاء الحساب بنجاح!' },
    error:         { fr: 'Une erreur est survenue. Réessaie.', en: 'An error occurred. Please try again.', ar: 'حدث خطأ. حاول مرة أخرى.' },
    error_invalid: { fr: 'Identifiants invalides.',      en: 'Invalid credentials.',             ar: 'بيانات اعتماد غير صالحة.' },
    error_exists:  { fr: 'Un compte avec cet email existe déjà.', en: 'An account with this email already exists.', ar: 'يوجد حساب بهذا البريد الإلكتروني بالفعل.' },
    error_fields:  { fr: 'Tous les champs sont requis.', en: 'All fields are required.',         ar: 'جميع الحقول مطلوبة.' },
    forgot_pwd:    { fr: 'Mot de passe oublié ?',        en: 'Forgot password?',                 ar: 'نسيت كلمة المرور؟' },
  },

  // ── Communs ──────────────────────────────────────────────────
  common: {
    close:       { fr: 'Fermer',    en: 'Close',   ar: 'إغلاق' },
    confirm:     { fr: 'Confirmer', en: 'Confirm', ar: 'تأكيد' },
    back:        { fr: 'Retour',    en: 'Back',    ar: 'رجوع' },
    next:        { fr: 'Suivant',   en: 'Next',    ar: 'التالي' },
    yes:         { fr: 'Oui',       en: 'Yes',     ar: 'نعم' },
    no:          { fr: 'Non',       en: 'No',      ar: 'لا' },
    loading:     { fr: 'Chargement…', en: 'Loading…', ar: 'جارٍ التحميل…' },
    error:       { fr: 'Erreur',    en: 'Error',   ar: 'خطأ' },
    success:     { fr: 'Succès',    en: 'Success', ar: 'نجاح' },
    bac_plus_3:  { fr: 'BAC+3',    en: 'BAC+3',   ar: 'BAC+3' },
    bac_plus_5:  { fr: 'BAC+5',    en: 'BAC+5',   ar: 'BAC+5' },
    module_sami: { fr: 'Module Intelligent SAMI', en: 'SAMI Smart Module', ar: 'وحدة سامي الذكية' },
  },

  // ── Historique ────────────────────────────────────────────────
  history: {
    title:          { fr: 'Mémoire de l\'Assistant',      en: 'Assistant Memory',       ar: 'ذاكرة المساعد' },
    subtitle_empty: { fr: 'Aucune conversation pour le moment', en: 'No conversations yet', ar: 'لا توجد محادثات بعد' },
    subtitle_count: { fr: 'conversation(s) enregistrée(s)', en: 'recorded conversation(s)', ar: 'محادثة (محادثات) مسجلة' },
    refresh:        { fr: 'Actualiser',                   en: 'Refresh',                ar: 'تحديث' },
    empty_msg:      { fr: 'Tes conversations avec Sami apparaîtront ici.', en: 'Your conversations with Sami will appear here.', ar: 'ستظهر محادثاتك مع سامي هنا.' },
    empty_hint:     { fr: 'Les conversations sont sauvegardées automatiquement.', en: 'Conversations are saved automatically.', ar: 'يتم حفظ المحادثات تلقائيًا.' },
    start_chat:     { fr: 'Démarrer une conversation',    en: 'Start a conversation',   ar: 'بدء محادثة' },
    resume:         { fr: 'Reprendre',                    en: 'Resume',                 ar: 'استئناف' },
    loading:        { fr: 'Chargement de l\'historique…', en: 'Loading history…',       ar: 'جارٍ تحميل السجل...' },
    in_progress:    { fr: 'En cours',                     en: 'In progress',            ar: 'قيد التنفيذ' },
    delete:         { fr: 'Supprimer',                    en: 'Delete',                 ar: 'حذف' },
  },

//   // ── Profil ────────────────────────────────────────────────────
//   profile: {
//     title:           { fr: 'Mon Profil',                en: 'My Profile',           ar: 'ملفي الشخصي' },
//     saved:           { fr: 'Enregistré',                en: 'Saved',                ar: 'تم الحفظ' },
//     sami_alert:      { fr: 'SAMI a détecté de nouvelles informations !', en: 'SAMI detected new info!', ar: 'سامي اكتشف معلومات جديدة!' },
//     sami_hint:       { fr: 'Pense à sauvegarder pour confirmer.', en: 'Remember to save to confirm.', ar: 'تذكر الحفظ للتأكيد.' },
//     syncing:         { fr: 'Synchronisation...',        en: 'Syncing...',           ar: 'جاري المزامنة...' },
//     stat_avg:        { fr: 'Moyenne',                   en: 'Average',              ar: 'المعدل' },
//     stat_bac:        { fr: 'Série BAC',                 en: 'BAC Series',           ar: 'شعبة الباك' },
//     label_id:        { fr: 'Identité',                  en: 'Identity',             ar: 'الهوية' },
//     label_avg:       { fr: 'Moyenne',                   en: 'Average',              ar: 'المعدل' },
//     label_loc:       { fr: 'Localisation',              en: 'Location',             ar: 'الموقع' },
//     label_bac:       { fr: 'Diplôme de base',           en: 'Base Degree',          ar: 'الشهادة الأساسية' },
//     label_status:    { fr: 'Situation Actuelle',        en: 'Current Status',       ar: 'الوضعية الحالية' },
//     label_interests: { fr: 'Passions & Intérêts',       en: 'Passions & Interests', ar: 'الاهتمامات' },
//     ph_name:         { fr: 'Nom et Prénom',             en: 'Full Name',            ar: 'الاسم الكامل' },
//     ph_city:         { fr: 'Ville',                     en: 'City',                 ar: 'المدينة' },
//     ph_bac:          { fr: 'Choisir ton BAC...',        en: 'Choose your BAC...',   ar: 'اختر الباك الخاص بك...' },
//     ph_bac_other:    { fr: 'Précisez votre diplôme...', en: 'Specify your degree...', ar: 'حدد شهادتك...' },
//     ph_level:        { fr: 'Ex: Terminale, BAC+2...',   en: 'e.g. Senior, BAC+2...', ar: 'مثال: ثانية باك، BAC+2...' },
//     ph_interests:    { fr: 'IA, Finance, Web...',       en: 'AI, Finance, Web...',  ar: 'الذكاء الاصطناعي، المالية...' },
//     btn_save:        { fr: 'Enregistrer les modifications', en: 'Save changes',     ar: 'حفظ التغييرات' },
//     btn_up_to_date:  { fr: 'Profil à jour',             en: 'Profile up to date',   ar: 'الملف محين' },
//   },



profile: {
    first_name: { fr: 'Prénom', en: 'First name', ar: 'الاسم الأول' },
    city: { fr: 'Ville', en: 'City', ar: 'المدينة' },
    degree: { fr: 'Diplôme / Type de BAC', en: 'Degree / BAC Type', ar: 'الشهادة / نوع الباك' },
    current_level: { fr: 'Niveau actuel', en: 'Current level', ar: 'المستوى الحالي' },
    average: { fr: 'Moyenne générale (/20)', en: 'Average (/20)', ar: 'المعدل (/20)' },
    interests: { fr: 'Centres d\'intérêt', en: 'Interests', ar: 'الاهتمامات' },
    save_button: { fr: 'Sauvegarder le profil', en: 'Save profile', ar: 'حفظ الملف' },
    saving: { fr: 'Sauvegarde…', en: 'Saving…', ar: 'جارٍ الحفظ…' },
    saved: { fr: 'Profil sauvegardé !', en: 'Profile saved!', ar: 'تم حفظ الملف!' },
    save_error: { fr: 'Erreur sauvegarde', en: 'Save error', ar: 'خطأ في الحفظ' },
    unknown_error: { fr: 'Erreur inconnue', en: 'Unknown error', ar: 'خطأ غير معروف' },
    post_bac_detected: { fr: '✓ Diplôme post-BAC détecté → niveau auto :', en: '✓ Post-BAC degree detected → auto level:', ar: '✓ تم اكتشاف شهادة ما بعد الباك → المستوى التلقائي:' },
    
    placeholders: {
      first_name: { fr: 'Votre prénom', en: 'Your first name', ar: 'اسمك الأول' },
      city: { fr: 'Votre ville', en: 'Your city', ar: 'مدينتك' },
      degree: { fr: 'ex: BAC Sciences, DUT Informatique, Licence Web…', en: 'e.g.: BAC Sciences, DUT IT, Web License…', ar: 'مثال: باك علوم، DUT معلوماتية، إجازة ويب…' },
      average: { fr: 'ex: 14.5', en: 'e.g.: 14.5', ar: 'مثال: 14.5' },
      interests: { fr: 'informatique, IA, management, finance…', en: 'IT, AI, management, finance…', ar: 'معلوماتية، ذكاء اصطناعي، إدارة، مالية…' },
    },

      footer: {
    division: { fr: 'SUPMTI AI Division', en: 'SUPMTI AI Division', ar: 'قسم الذكاء الاصطناعي SUPMTI' },
    version: { fr: 'v2.0 Beta', en: 'v2.0 Beta', ar: 'v2.0 بيتا' },
    copyright: { fr: '© 2026 SUPMTI - Multimodal AI Assistant Project', en: '© 2026 SUPMTI - Multimodal AI Assistant Project', ar: '© 2026 SUPMTI - مشروع المساعد الذكي متعدد الوسائط' },
  },

    levels: {
      post_bac: { fr: 'Bachelier / Terminale', en: 'High school graduate', ar: 'بكالوريا / ثانوية' },
      bac1: { fr: 'BAC+1', en: 'BAC+1', ar: 'باك+1' },
      bac2: { fr: 'BAC+2 (DUT / BTS / DEUG)', en: 'BAC+2 (DUT / BTS / DEUG)', ar: 'باك+2 (DUT / BTS / DEUG)' },
      bac3: { fr: 'BAC+3 (Licence / Bachelor)', en: 'BAC+3 (License / Bachelor)', ar: 'باك+3 (إجازة / بكالوريوس)' },
      bac4: { fr: 'BAC+4/5 (Master / Ingénieur)', en: 'BAC+4/5 (Master / Engineer)', ar: 'باك+4/5 (ماستر / مهندس)' },
    },

    grade_evaluation: {
      excellent: { fr: '🏆 Très Bien', en: '🏆 Excellent', ar: '🏆 ممتاز' },
      good: { fr: '⭐ Bien', en: '⭐ Good', ar: '⭐ جيد' },
      fair: { fr: '✅ Assez Bien', en: '✅ Fair', ar: '✅ مقبول' },
      pass: { fr: '📚 Passable', en: '📚 Pass', ar: '📚 ناجح' },
      fail: { fr: '⚠️ Insuffisant', en: '⚠️ Fail', ar: '⚠️ غير كاف' },
    }
  } ,

  // ── Landing page ──────────────────────────────────────────────
  landing: {
    badge:           { fr: 'SAMI v2.0 • IA Orientation SUPMTI',  en: 'SAMI v2.0 • AI Academic Advisor', ar: 'SAMI v2.0 • مساعد توجيه سوبمتي' },
    hero_title_1:    { fr: 'Ton futur est',                       en: 'Your future is',                  ar: 'مستقبلك' },
    hero_title_2:    { fr: 'déjà écrit.',                         en: 'already written.',                ar: 'مكتوب بالفعل.' },
    hero_subtitle:   {
      fr: "L'intelligence artificielle qui décode ton potentiel pour t'orienter vers les métiers de demain à SUPMTI Meknès.",
      en: "The artificial intelligence that decodes your potential to guide you toward tomorrow's careers at SUPMTI Meknes.",
      ar: "الذكاء الاصطناعي الذي يفك شفرة إمكاناتك لتوجيهك نحو مهن المستقبل في SUPMTI مكناس.",
    },
    cta_fitscore:    { fr: 'Calculer mon FitScore',               en: 'Calculate my FitScore',           ar: 'احسب FitScore الخاص بي' },
    cta_try_sami:    { fr: 'Essayer SAMI',                        en: 'Try SAMI',                        ar: 'جرّب سامي' },
    stats_filieres:  { fr: "Filières d'excellence",               en: 'Excellence Programs',             ar: 'شعب متميزة' },
    stats_students:  { fr: 'Étudiants orientés',                  en: 'Oriented students',               ar: 'طلاب موجَّهون' },
    stats_satisf:    { fr: 'Taux de satisfaction',                en: 'Satisfaction rate',               ar: 'معدل الرضا' },
    stats_faster:    { fr: "Plus rapide qu'un conseiller",        en: "Faster than an advisor",          ar: 'أسرع من مستشار بشري' },
    tech_title:      { fr: "Technologie d'Orientation",           en: 'Guidance Technology',             ar: 'تكنولوجيا التوجيه' },
    programs_label:  { fr: 'Parcours Académiques',                en: 'Academic Tracks',                 ar: 'المسارات الأكاديمية' },
    programs_title:  { fr: '7 Filières, 2 Départements.',         en: '7 Programs, 2 Departments.',      ar: '7 شعب، قسمان.' },
    footer_copy:     { fr: '© 2026 SAMI PROJECT • ALL RIGHTS RESERVED', en: '© 2026 SAMI PROJECT • ALL RIGHTS RESERVED', ar: '© 2026 مشروع سامي • جميع الحقوق محفوظة' },
    secure_access:   { fr: 'SECURE_ACCESS_ADMIN',                 en: 'SECURE_ACCESS_ADMIN',             ar: 'دخول آمن للمسؤول' },
    platform_label:  { fr: 'Plateforme IA Multimodale',           en: 'Multimodal AI Platform',          ar: 'منصة الذكاء الاصطناعي متعددة الوسائط' },
  },

  // ── Navbar ────────────────────────────────────────────────────
  navbar: {
    assistant_ia:    { fr: 'Assistant IA',      en: 'AI Assistant',    ar: 'المساعد الذكي' },
    toggle_dark:     { fr: 'Mode sombre',       en: 'Dark mode',       ar: 'الوضع الداكن' },
    toggle_light:    { fr: 'Mode clair',        en: 'Light mode',      ar: 'الوضع الفاتح' },
  },

  // ── Layout / Footer ───────────────────────────────────────────
  layout: {
    footer_copy: { fr: '© 2026 SUPMTI - Projet Assistant IA Multimodal', en: '© 2026 SUPMTI - Multimodal AI Assistant Project', ar: '© 2026 سوبمتي - مشروع المساعد الذكي متعدد الوسائط' },
  },

  // ── Admission Panel ───────────────────────────────────────────
  admission: {
    header_title:     { fr: "Vérificateur d'Éligibilité",          en: 'Eligibility Checker',           ar: 'التحقق من الأهلية' },
    header_desc:      {
      fr: "SAMI analyse ton dossier pour calculer tes chances d'admission et ton éligibilité aux bourses d'excellence.",
      en: "SAMI analyses your file to calculate your admission chances and eligibility for excellence scholarships.",
      ar: "يحلل سامي ملفك لحساب فرص قبولك وأهليتك للمنح الدراسية.",
    },
    btn_simulate:     { fr: 'Simuler mon admission',               en: 'Simulate my admission',         ar: 'محاكاة قبولي' },
    btn_rerun:        { fr: 'Relancer la simulation',              en: 'Re-run simulation',             ar: 'إعادة المحاكاة' },
    btn_loading:      { fr: 'Exploration du dossier...',           en: 'Analysing file...',             ar: 'جارٍ تحليل الملف...' },
    algo_label:       { fr: 'Rapport SAMI Intelligence',           en: 'SAMI Intelligence Report',      ar: 'تقرير سامي الذكي' },
    entrance_label:   { fr: 'Entrée en',                           en: 'Entry in',                      ar: 'الدخول في' },
    eligible_label:   { fr: 'Filières accessibles',                en: 'Accessible programs',           ar: 'الشعب المتاحة' },
    not_eligible:     { fr: 'Non éligible',                        en: 'Not eligible',                  ar: 'غير مؤهل' },
    not_eligible_label: { fr: 'Filières non accessibles à ton niveau', en: 'Programs not accessible at your level', ar: 'الشعب غير المتاحة لمستواك' },
    scholarship:      { fr: 'Bourse estimée',                      en: 'Estimated scholarship',         ar: 'المنحة المقدرة' },
    council_label:    { fr: 'Conseil personnalisé',                en: 'Personalized advice',           ar: 'نصيحة شخصية' },
    footer_note:      {
      fr: "* Ces résultats sont basés sur les critères d'admission 2026.\nPrésente-toi à l'école pour une validation officielle.",
      en: "* These results are based on 2026 admission criteria.\nVisit the school for official validation.",
      ar: "* هذه النتائج مبنية على معايير القبول لعام 2026.\nقم بزيارة المدرسة للتحقق الرسمي.",
    },
    error_incomplete:  { fr: 'Complète ton profil avec tes notes de BAC pour débloquer cette fonctionnalité.', en: 'Complete your profile with your BAC grades to unlock this feature.', ar: 'أكمل ملفك بدرجات الباك لفتح هذه الميزة.' },
    spinner_label:     { fr: 'Analyse Algorithmique',              en: 'Algorithmic Analysis',          ar: 'التحليل الخوارزمي' },
  },



fitscore: {
  matching_algorithm: {
    fr: 'Algorithme de Matching',
    en: 'Matching Algorithm',
    ar: 'خوارزمية المطابقة',
  },

  intro_before: {
    fr: 'SAMI croise ton',
    en: 'SAMI analyzes your',
    ar: 'يقوم SAMI بتحليل',
  },
  current_curriculum: {
    fr: 'cursus actuel',
    en: 'current academic path',
    ar: 'مسارك الدراسي الحالي',
  },
  intro_middle: {
    fr: 'tes',
    en: 'your',
    ar: 'و',
  },
  bac_performance: {
    fr: 'performances au BAC',
    en: 'BAC performance',
    ar: 'أدائك في البكالوريا',
  },
  intro_and: {
    fr: 'et ton',
    en: 'and your',
    ar: 'و',
  },
  psycho_profile: {
    fr: 'profil psycho',
    en: 'psychological profile',
    ar: 'ملفك النفسي',
  },
  intro_after: {
    fr: 'pour identifier ta voie idéale.',
    en: 'to identify your best-fit path.',
    ar: 'لتحديد المسار الأنسب لك.',
  },

  calculate: {
    fr: 'Calculer mon FitScore',
    en: 'Calculate my FitScore',
    ar: 'احسب FitScore الخاص بي',
  },
  recalculate: {
    fr: 'Recalculer mon FitScore',
    en: 'Recalculate my FitScore',
    ar: 'إعادة حساب FitScore',
  },
  syncing_data: {
    fr: 'Synchronisation des données...',
    en: 'Synchronizing data...',
    ar: 'جارٍ مزامنة البيانات...',
  },
  calculating_probabilities: {
    fr: 'Calcul de probabilités...',
    en: 'Calculating probabilities...',
    ar: 'جارٍ حساب الاحتمالات...',
  },

  insufficient_data: {
    fr: 'Données insuffisantes',
    en: 'Insufficient data',
    ar: 'المعطيات غير كافية',
  },
  engine_error: {
    fr: 'Lien avec le moteur de calcul interrompu.',
    en: 'Connection to the scoring engine was interrupted.',
    ar: 'انقطع الاتصال بمحرك الحساب.',
  },
  missing_info_help: {
    fr: 'Il manque des informations sur tes notes ou tes intérêts pour un calcul précis.',
    en: 'Some information about your grades or interests is missing for an accurate calculation.',
    ar: 'تنقص بعض المعلومات حول معدلاتك أو اهتماماتك لإجراء حساب دقيق.',
  },
  talk_with_sami: {
    fr: 'Discuter avec SAMI',
    en: 'Talk with SAMI',
    ar: 'تحدث مع SAMI',
  },

  eligible_title: {
    fr: 'Classement — Filières accessibles',
    en: 'Ranking — Eligible programs',
    ar: 'الترتيب — التخصصات المتاحة',
  },
  top_match: {
    fr: 'TOP MATCH',
    en: 'TOP MATCH',
    ar: 'الأفضل',
  },

  non_eligible_title: {
    fr: 'Non accessibles à ton niveau',
    en: 'Not accessible at your level',
    ar: 'غير متاحة حسب مستواك',
  },

  profile_analysis: {
    fr: 'Analyse du profil',
    en: 'Profile analysis',
    ar: 'تحليل الملف',
  },

  precision_plus: {
    fr: 'Précision +25%',
    en: 'Accuracy +25%',
    ar: 'دقة +25%',
  },
  take_psycho_test: {
    fr: 'Passer le test psychométrique',
    en: 'Take the psychometric test',
    ar: 'اجتياز الاختبار النفسي',
  },
},



  // ── Carrière Panel ────────────────────────────────────────────
//   carriere: {
//     context_quote:    { fr: 'Contexte de niveau',                  en: 'Level context',                 ar: 'سياق المستوى' },
//     filieres_label:   { fr: 'Filières accessibles',                en: 'Accessible programs',           ar: 'الشعب المتاحة' },
//     loading_filieres: { fr: 'Chargement des filières...',          en: 'Loading programs...',           ar: 'جارٍ تحميل الشعب...' },
//     no_filieres:      { fr: 'Complète ton profil (niveau, BAC, moyenne) pour voir les filières disponibles.', en: 'Complete your profile (level, BAC, average) to see available programs.', ar: 'أكمل ملفك لرؤية الشعب المتاحة.' },
//     btn_simulate:     { fr: 'Simuler ma carrière',                 en: 'Simulate my career',            ar: 'حاكِ مسيرتي' },
//     btn_loading:      { fr: 'Simulation en cours...',              en: 'Simulating...',                 ar: 'جارٍ المحاكاة...' },
//     btn_disabled:     { fr: 'Choisir une filière',                 en: 'Choose a program',              ar: 'اختر شعبة' },
//     result_title:     { fr: 'Perspectives',                        en: 'Perspectives',                  ar: 'آفاق' },
//     salary_start:     { fr: 'Salaire départ',                      en: 'Starting salary',               ar: 'الراتب الابتدائي' },
//     salary_3:         { fr: 'Après 3 ans',                         en: 'After 3 years',                 ar: 'بعد 3 سنوات' },
//     salary_7:         { fr: 'Après 7 ans',                         en: 'After 7 years',                 ar: 'بعد 7 سنوات' },
//     insertion:        { fr: 'Taux insertion',                      en: 'Insertion rate',                ar: 'معدل الإدماج' },
//     projection_title: { fr: 'Projection de Vie',                   en: 'Life Projection',               ar: 'إسقاط الحياة المهنية' },
//   },



carriere: {
  header_badge: {
    fr: 'Projection carrière',
    en: 'Career projection',
    ar: 'التوقع المهني',
  },
  header_intro: {
    fr: 'Explore les débouchés, le niveau de salaire et les perspectives d’évolution selon la filière choisie.',
    en: 'Explore career paths, salary levels, and growth prospects based on the selected program.',
    ar: 'اكتشف الفرص المهنية ومستويات الرواتب وآفاق التطور حسب التخصص المختار.',
  },
  context_quote: {
    fr: 'Contexte',
    en: 'Context',
    ar: 'السياق',
  },
  filieres_label: {
    fr: 'Filières disponibles',
    en: 'Available programs',
    ar: 'التخصصات المتاحة',
  },
  filieres_hint: {
    fr: 'Choisis une filière pour simuler ton avenir professionnel.',
    en: 'Choose a program to simulate your professional future.',
    ar: 'اختر تخصصًا لمحاكاة مستقبلك المهني.',
  },
  loading_filieres: {
    fr: 'Chargement des filières...',
    en: 'Loading programs...',
    ar: 'جارٍ تحميل التخصصات...',
  },
  no_filieres: {
    fr: 'Aucune filière disponible',
    en: 'No program available',
    ar: 'لا توجد تخصصات متاحة',
  },
  btn_disabled: {
    fr: 'Sélection requise',
    en: 'Selection required',
    ar: 'يلزم اختيار تخصص',
  },
  btn_loading: {
    fr: 'Simulation en cours...',
    en: 'Simulation in progress...',
    ar: 'جارٍ تنفيذ المحاكاة...',
  },
  btn_simulate: {
    fr: 'Simuler ma carrière',
    en: 'Simulate my career',
    ar: 'محاكاة مساري المهني',
  },
  selected_program: {
    fr: 'Filière sélectionnée',
    en: 'Selected program',
    ar: 'التخصص المختار',
  },
  result_title: {
    fr: 'Indicateurs clés',
    en: 'Key indicators',
    ar: 'المؤشرات الرئيسية',
  },
  salary_start: {
    fr: 'Salaire de départ',
    en: 'Starting salary',
    ar: 'الراتب عند البداية',
  },
  salary_3: {
    fr: 'Salaire à 3 ans',
    en: 'Salary after 3 years',
    ar: 'الراتب بعد 3 سنوات',
  },
  salary_7: {
    fr: 'Salaire à 7 ans',
    en: 'Salary after 7 years',
    ar: 'الراتب بعد 7 سنوات',
  },
  insertion: {
    fr: "Taux d'insertion",
    en: 'Employment rate',
    ar: 'معدل الإدماج',
  },
  projection_title: {
    fr: 'Projection de carrière',
    en: 'Career projection',
    ar: 'التوقع المهني',
  },
},


chatbot: {
  badge: {
    fr: 'Assistant intelligent',
    en: 'Intelligent assistant',
    ar: 'مساعد ذكي',
  },
  title: {
    fr: 'Conseiller Virtuel Intelligent',
    en: 'Intelligent Virtual Advisor',
    ar: 'المستشار الافتراضي الذكي',
  },
  subtitle: {
    fr: 'Supporte Français, Anglais et Darija',
    en: 'Supports French, English and Darija',
    ar: 'يدعم الفرنسية والإنجليزية والدارجة',
  },
},

  // ── Coach Panel ───────────────────────────────────────────────
  coach: {
    header_tag:       { fr: 'SAMI Mentor',                         en: 'SAMI Mentor',                   ar: 'مرشد سامي' },
    header_desc:      {
      fr: "Obtiens ton plan d'action personnalisé : objectifs académiques, soft skills et focus de la semaine.",
      en: "Get your personalized action plan: academic goals, soft skills, and weekly focus.",
      ar: "احصل على خطة عمل شخصية: أهداف أكاديمية، مهارات ناعمة، وتركيز الأسبوع.",
    },
    btn_generate:     { fr: 'Générer mon rapport coach',           en: 'Generate my coaching report',   ar: 'إنشاء تقرير التوجيه' },
    btn_refresh:      { fr: "Actualiser mon plan d'action",        en: 'Refresh my action plan',        ar: 'تحديث خطة العمل' },
    btn_loading:      { fr: 'Analyse des performances...',         en: 'Analysing performance...',      ar: 'جارٍ تحليل الأداء...' },
    badge_objectives: { fr: 'Objectifs Prêts',                     en: 'Objectives Ready',              ar: 'الأهداف جاهزة' },
    badge_week:       { fr: 'Semaine en cours',                    en: 'Current week',                  ar: 'الأسبوع الحالي' },
    advice_label:     { fr: 'Conseils Stratégiques',               en: 'Strategic Advice',              ar: 'نصائح استراتيجية' },
    download_title:   { fr: 'Télécharger ce rapport',              en: 'Download this report',          ar: 'تحميل هذا التقرير' },
    dl_pdf:           { fr: 'PDF',                                  en: 'PDF',                           ar: 'PDF' },
    dl_word:          { fr: 'Word',                                 en: 'Word',                          ar: 'Word' },
    quote:            {
      fr: '"Le succès est la somme de petits efforts répétés jour après jour."',
      en: '"Success is the sum of small efforts repeated day after day."',
      ar: '"النجاح هو مجموع الجهود الصغيرة المتكررة يوما بعد يوم."',
    },
    error_profile:    { fr: "Profil insuffisant pour établir un plan.", en: "Insufficient profile to establish a plan.", ar: "الملف غير كافٍ لإنشاء خطة." },
    error_connection: { fr: "Impossible de joindre ton coach IA.",      en: "Unable to reach your AI coach.",           ar: "تعذر الوصول إلى مرشدك الذكي." },
    error_dl:         { fr: 'Erreur lors de la génération.',            en: 'Generation error.',                        ar: 'خطأ أثناء الإنشاء.' },
  },

  // ── Comparer Panel ────────────────────────────────────────────
  comparer: {
    header_title:    { fr: 'Comparateur de Carrières',             en: 'Career Comparator',             ar: 'مقارنة المسارات المهنية' },
    header_desc:     { fr: 'Analyse comparative des débouchés SUPMTI.', en: 'Comparative analysis of SUPMTI outcomes.', ar: 'تحليل مقارن لفرص SUPMTI.' },
    option_a:        { fr: 'Option A',                             en: 'Option A',                      ar: 'الخيار أ' },
    option_b:        { fr: 'Option B',                             en: 'Option B',                      ar: 'الخيار ب' },
    btn_duel:        { fr: 'Lancer le duel',                       en: 'Start the duel',                ar: 'ابدأ المقارنة' },
    btn_loading:     { fr: 'Analyse en cours...',                  en: 'Analysing...',                  ar: 'جارٍ التحليل...' },
    salary_title:    { fr: 'Grille Salariale',                     en: 'Salary Grid',                   ar: 'جدول الرواتب' },
    salary_start:    { fr: 'Départ',                               en: 'Starting',                      ar: 'الابتداء' },
    salary_3:        { fr: '3 ans',                                en: '3 years',                       ar: '3 سنوات' },
    salary_7:        { fr: '7 ans',                                en: '7 years',                       ar: '7 سنوات' },
    salary_intl:     { fr: 'International',                        en: 'International',                 ar: 'الدولي' },
    insertion:       { fr: "Taux d'insertion",                     en: 'Insertion rate',                ar: 'معدل الإدماج' },
    report_label:    { fr: "Rapport d'Expertise",                  en: 'Expert Report',                 ar: 'تقرير الخبراء' },
    sami_arb:        { fr: 'Arbitrage SAMI IA',                    en: 'SAMI AI Arbitration',           ar: 'تحكيم سامي الذكي' },
    error_load:      { fr: 'Erreur de chargement.',                en: 'Loading error.',                ar: 'خطأ في التحميل.' },
  },

  // ── FitScore Panel ────────────────────────────────────────────
//   fitscore: {
//     algo_label:       { fr: 'Algorithme de Matching',              en: 'Matching Algorithm',            ar: 'خوارزمية المطابقة' },
//     algo_desc:        {
//       fr: "SAMI croise ton cursus actuel, tes performances au BAC et ton profil psycho pour identifier ta voie idéale.",
//       en: "SAMI cross-references your current curriculum, BAC performance, and psycho profile to identify your ideal path.",
//       ar: "يقاطع سامي مسارك الدراسي وأداءك في الباك وملفك النفسي لتحديد مسارك المثالي.",
//     },
//     btn_calculate:    { fr: 'Calculer mon FitScore',               en: 'Calculate my FitScore',         ar: 'احسب FitScore الخاص بي' },
//     btn_recalculate:  { fr: 'Recalculer mon FitScore',             en: 'Recalculate my FitScore',       ar: 'إعادة حساب FitScore' },
//     btn_loading:      { fr: 'Synchronisation des données...',      en: 'Synchronising data...',         ar: 'جارٍ مزامنة البيانات...' },
//     calc_label:       { fr: 'Calcul de probabilités...',           en: 'Calculating probabilities...',  ar: 'جارٍ حساب الاحتمالات...' },
//     ranking_label:    { fr: 'Classement — Filières accessibles',   en: 'Ranking — Accessible programs', ar: 'الترتيب — الشعب المتاحة' },
//     top_match:        { fr: 'TOP MATCH',                           en: 'TOP MATCH',                     ar: 'الأنسب' },
//     not_eligible:     { fr: 'Non accessibles à ton niveau',        en: 'Not accessible at your level',  ar: 'غير متاحة لمستواك' },
//     profile_analysis: { fr: 'Analyse du profil',                   en: 'Profile analysis',              ar: 'تحليل الملف' },
//     psycho_cta:       { fr: 'Passer le test psychométrique',       en: 'Take the psychometric test',    ar: 'إجراء الاختبار النفسي' },
//     psycho_precision: { fr: 'Précision +25%',                      en: 'Precision +25%',                ar: 'دقة +25%' },
//     error_data:       { fr: 'Données insuffisantes',               en: 'Insufficient data',             ar: 'بيانات غير كافية' },
//     error_engine:     { fr: 'Lien avec le moteur de calcul interrompu.', en: 'Connection to calculation engine lost.', ar: 'تعذر الاتصال بمحرك الحساب.' },
//     error_hint:       { fr: 'Il manque des informations sur tes notes ou tes intérêts pour un calcul précis.', en: 'Missing information on grades or interests for a precise calculation.', ar: 'تنقص معلومات حول درجاتك أو اهتماماتك.' },
//     discuss_sami:     { fr: 'Discuter avec SAMI',                  en: 'Discuss with SAMI',             ar: 'تحدث مع سامي' },
//   },

  // ── PanelOverlay ─────────────────────────────────────────────
  panel_overlay: {
    close_btn:   { fr: 'Fermer',              en: 'Close',                ar: 'إغلاق' },
  },

  // ── PeerMatch Panel ──────────────────────────────────────────
  peermatch: {
    header_title:    { fr: 'Échange avec un Ambassadeur',         en: 'Connect with an Ambassador',    ar: 'التواصل مع سفير' },
    header_quote:    {
      fr: '"Rien ne remplace le vécu. Pose tes questions à un étudiant qui suit déjà ce cursus."',
      en: '"Nothing replaces experience. Ask questions to a student already in this program."',
      ar: '"لا شيء يعوض التجربة. اطرح أسئلتك على طالب يدرس بالفعل في هذا المسار."',
    },
    sami_rec:        { fr: 'Recommandation SAMI',                 en: 'SAMI Recommendation',           ar: 'توصية سامي' },
    sami_rec_suffix: { fr: '— un ambassadeur peut te répondre.',  en: '— an ambassador can reply.',    ar: '— يمكن لسفير الرد عليك.' },
    choose_program:  { fr: 'Choisir une filière',                 en: 'Choose a program',              ar: 'اختر شعبة' },
    loading_filieres:{ fr: 'Chargement des filières...',          en: 'Loading programs...',           ar: 'جارٍ تحميل الشعب...' },
    no_filieres:     { fr: 'Complète ton profil pour voir les filières disponibles.', en: 'Complete your profile to see available programs.', ar: 'أكمل ملفك لرؤية الشعب المتاحة.' },
    btn_send:        { fr: 'Envoyer la demande',                  en: 'Send the request',              ar: 'إرسال الطلب' },
    btn_sending:     { fr: 'Envoi de la demande...',              en: 'Sending request...',            ar: 'جارٍ إرسال الطلب...' },
    status_treated:  { fr: '✅ Demande traitée — Ambassadeur assigné !', en: '✅ Request processed — Ambassador assigned!', ar: '✅ تمت معالجة الطلب — تم تعيين سفير!' },
    status_cancelled:{ fr: '❌ Demande annulée',                  en: '❌ Request cancelled',          ar: '❌ تم إلغاء الطلب' },
    status_pending:  { fr: '⏳ Demande en attente de traitement', en: '⏳ Request pending processing', ar: '⏳ الطلب في انتظار المعالجة' },
    desc_treated:    { fr: "L'équipe SUPMTI a validé ta demande.", en: "SUPMTI team has validated your request.", ar: "صادق فريق SUPMTI على طلبك." },
    desc_cancelled:  { fr: 'Contacte directement SUPMTI.',        en: 'Contact SUPMTI directly.',      ar: 'تواصل مع SUPMTI مباشرة.' },
    desc_pending:    { fr: "L'équipe SUPMTI traitera ta demande sous 24-48h.", en: "SUPMTI team will process your request within 24-48h.", ar: "سيعالج فريق SUPMTI طلبك خلال 24-48 ساعة." },
    refresh:         { fr: 'Actualiser',                          en: 'Refresh',                       ar: 'تحديث' },
    ambassador_label:{ fr: 'Ton ambassadeur',                     en: 'Your ambassador',               ar: 'سفيرك' },
    wa_contact:      { fr: 'Contacter via WhatsApp',              en: 'Contact via WhatsApp',          ar: 'التواصل عبر واتساب' },
    email_contact:   { fr: 'Envoyer un Email',                    en: 'Send an Email',                 ar: 'إرسال بريد إلكتروني' },
    waiting_title:   { fr: 'En attendant, contacte SUPMTI',       en: 'Meanwhile, contact SUPMTI',     ar: 'في انتظار ذلك، تواصل مع SUPMTI' },
    new_request:     { fr: 'Faire une nouvelle demande',          en: 'Make a new request',            ar: 'تقديم طلب جديد' },
    support_title:   { fr: 'Support SUPMTI Meknès',               en: 'SUPMTI Meknes Support',         ar: 'دعم SUPMTI مكناس' },
    standard:        { fr: 'Standard',                            en: 'Standard',                      ar: 'الهاتف' },
    email_direct:    { fr: 'Email Direct',                        en: 'Direct Email',                  ar: 'البريد المباشر' },
    schedule:        { fr: 'Lun-Ven : 08:30 – 18:00 · Sam : 08:30 – 12:00', en: 'Mon-Fri: 08:30 – 18:00 · Sat: 08:30 – 12:00', ar: 'الاثنين-الجمعة: 08:30-18:00 · السبت: 08:30-12:00' },
    error_send:      { fr: 'Connexion au serveur impossible. Réessaie dans un instant.', en: 'Unable to connect to server. Try again shortly.', ar: 'تعذر الاتصال بالخادم. حاول مجددًا.' },
  },

  // ── ProfilPanel ───────────────────────────────────────────────
  profil_panel: {
    unknown_identity: { fr: 'Identité inconnue',                 en: 'Unknown identity',              ar: 'هوية مجهولة' },
    unknown_desc:     {
      fr: "SAMI n'a pas encore assez de données pour dresser ton profil. Parle-lui de ton parcours ou de tes ambitions.",
      en: "SAMI doesn't have enough data to build your profile yet. Talk to SAMI about your background or ambitions.",
      ar: "لا يمتلك سامي بيانات كافية بعد لبناء ملفك. حدّثه عن مسارك وطموحاتك.",
    },
    example_msg:      { fr: '"Je m\'appelle Corneil, j\'ai un BAC Info et je vise un Master en IA."', en: '"My name is Corneil, I have a CS BAC and I\'m aiming for an AI Master\'s."', ar: '"اسمي كورنيل، حصلت على باكالوريا معلوميات وأطمح للحصول على ماستر في الذكاء الاصطناعي."' },
    btn_complete:     { fr: 'Compléter mon profil',              en: 'Complete my profile',           ar: 'إكمال ملفي' },
    section_info:     { fr: 'Informations',                      en: 'Information',                   ar: 'المعلومات' },
    section_cursus:   { fr: 'Cursus',                            en: 'Curriculum',                    ar: 'المسار الدراسي' },
    section_goals:    { fr: 'Objectifs',                         en: 'Goals',                         ar: 'الأهداف' },
    label_prenom:     { fr: 'Prénom',                            en: 'First name',                    ar: 'الاسم الأول' },
    label_location:   { fr: 'Localisation',                      en: 'Location',                      ar: 'الموقع' },
    label_bac:        { fr: 'Diplôme BAC',                       en: 'BAC Degree',                    ar: 'شهادة الباكالوريا' },
    label_performance:{ fr: 'Performance',                       en: 'Performance',                   ar: 'الأداء' },
    label_level:      { fr: 'Niveau actuel',                     en: 'Current level',                 ar: 'المستوى الحالي' },
    label_notes:      { fr: 'Relevé partiel',                    en: 'Partial transcript',            ar: 'كشف جزئي للدرجات' },
    label_interests:  { fr: "Centres d'intérêt",                 en: 'Interests',                     ar: 'الاهتمامات' },
    label_ambition:   { fr: 'Ambition',                          en: 'Ambition',                      ar: 'الطموح' },
    last_update:      { fr: 'Dernière mise à jour :',            en: 'Last updated:',                 ar: 'آخر تحديث:' },
    profile_status:   { fr: 'Profil',                            en: 'Profile',                       ar: 'الملف' },
  },



  psycho: {
  adaptive_badge: {
    fr: 'Évaluation adaptive',
    en: 'Adaptive assessment',
    ar: 'تقييم تكيّفي',
  },
  intro_before: {
    fr: 'Ce test de',
    en: 'This',
    ar: 'هذا الاختبار المكوّن من',
  },
  intro_after: {
    fr: 'questions utilise l’IA pour dresser ton profil psychologique académique. Réponds spontanément.',
    en: 'question test uses AI to build your academic psychological profile. Answer spontaneously.',
    ar: 'أسئلة يستخدم الذكاء الاصطناعي لبناء ملفك النفسي الأكاديمي. أجب بعفوية.',
  },

  start_button: {
    fr: "Démarrer l'analyse",
    en: 'Start analysis',
    ar: 'ابدأ التحليل',
  },

  progress: {
    fr: 'Progression',
    en: 'Progress',
    ar: 'التقدم',
  },
  current_question: {
    fr: 'Question actuelle',
    en: 'Current question',
    ar: 'السؤال الحالي',
  },
  your_answer: {
    fr: 'Ta réponse',
    en: 'Your answer',
    ar: 'إجابتك',
  },
  answer_placeholder: {
    fr: 'Écris librement ici...',
    en: 'Write freely here...',
    ar: 'اكتب بحرية هنا...',
  },
  submit_answer: {
    fr: 'Valider ma réponse',
    en: 'Submit my answer',
    ar: 'تأكيد إجابتي',
  },

  done_title: {
    fr: 'Analyse terminée',
    en: 'Analysis completed',
    ar: 'اكتمل التحليل',
  },
  matrix_title: {
    fr: 'Matrice de personnalité',
    en: 'Personality matrix',
    ar: 'مصفوفة الشخصية',
  },
  goto_fitscore: {
    fr: 'Voir mon FitScore enrichi',
    en: 'See my enriched FitScore',
    ar: 'عرض FitScore المحسّن',
  },

  trait_logic: {
    fr: 'Logique',
    en: 'Logic',
    ar: 'المنطق',
  },
  trait_creativity: {
    fr: 'Créativité',
    en: 'Creativity',
    ar: 'الإبداع',
  },
  trait_leadership: {
    fr: 'Leadership',
    en: 'Leadership',
    ar: 'القيادة',
  },
  trait_stress: {
    fr: 'Gestion du stress',
    en: 'Stress management',
    ar: 'إدارة الضغط',
  },
  trait_teamwork: {
    fr: 'Travail en équipe',
    en: 'Teamwork',
    ar: 'العمل الجماعي',
  },
  trait_style: {
    fr: 'Style analytique',
    en: 'Analytical style',
    ar: 'الأسلوب التحليلي',
  },

  error_start: {
    fr: 'Connexion au moteur psycho interrompue.',
    en: 'Connection to the psycho engine was interrupted.',
    ar: 'انقطع الاتصال بمحرك التحليل النفسي.',
  },
  error_submit: {
    fr: 'Erreur de transmission. Réessaie.',
    en: 'Transmission error. Please try again.',
    ar: 'خطأ في الإرسال. حاول مرة أخرى.',
  },
},

  // ── PsychoPanel ───────────────────────────────────────────────
//   psycho: {
//     eval_label:       { fr: 'Évaluation Adaptive',               en: 'Adaptive Evaluation',           ar: 'التقييم التكيفي' },
//     intro_desc:       {
//       fr: "Ce test de 10 questions utilise l'IA pour dresser ton profil psychologique académique. Réponds spontanément.",
//       en: "This 10-question test uses AI to build your academic psychological profile. Answer spontaneously.",
//       ar: "يستخدم هذا الاختبار المكون من 10 أسئلة الذكاء الاصطناعي لرسم ملفك النفسي الأكاديمي. أجب بشكل عفوي.",
//     },
//     btn_start:        { fr: "Démarrer l'analyse",                en: 'Start the analysis',            ar: 'ابدأ التحليل' },
//     btn_start_loading:{ fr: 'Connexion au moteur psycho...',     en: 'Connecting to psycho engine...', ar: 'جارٍ الاتصال بالمحرك النفسي...' },
//     progress_label:   { fr: 'Progression',                       en: 'Progress',                      ar: 'التقدم' },
//     answer_placeholder: { fr: 'Écris librement ici...',          en: 'Write freely here...',          ar: 'اكتب بحرية هنا...' },
//     btn_validate:     { fr: 'Valider ma réponse',                en: 'Validate my answer',            ar: 'تأكيد إجابتي' },
//     result_title:     { fr: 'Analyse Terminée',                  en: 'Analysis Complete',             ar: 'اكتمل التحليل' },
//     personality_label:{ fr: 'Matrice de personnalité',           en: 'Personality matrix',            ar: 'مصفوفة الشخصية' },
//     fitscore_cta:     { fr: 'Voir mon FitScore enrichi',         en: 'See my enriched FitScore',      ar: 'عرض FitScore الغني' },
//     error_connection: { fr: 'Connexion au moteur psycho interrompue.', en: 'Connection to psycho engine interrupted.', ar: 'انقطع الاتصال بالمحرك النفسي.' },
//     error_transmit:   { fr: 'Erreur de transmission. Réessaie.', en: 'Transmission error. Try again.', ar: 'خطأ في الإرسال. حاول مجددًا.' },
//   },

  // ── AdminLayoutWrapper ────────────────────────────────────────
  admin_layout: {
    footer_copy: { fr: '© 2026 SUPMTI - Projet Assistant IA Multimodal', en: '© 2026 SUPMTI - Multimodal AI Assistant Project', ar: '© 2026 سوبمتي - مشروع المساعد الذكي' },
  },

} as const;

// Type helper pour extraire les clés imbriquées
export type TranslationKey = {
  [Section in keyof typeof TRANSLATIONS]: {
    [Key in keyof (typeof TRANSLATIONS)[Section]]: `${Section}.${string & Key}`;
  }[keyof (typeof TRANSLATIONS)[Section]];
}[keyof typeof TRANSLATIONS];