// export interface StudentProfile {
//   informations_personnelles: { prenom: string; pays?: string; ville?: string; };
//   parcours_academique: { type_bac?: string; label_bac?: string; moyenne_generale: number; mention?: string; niveau_actuel?: string; diplome_actuel?: string; notes_matieres?: Record<string, number>; };
//   preferences: { centres_interet?: string[]; ambition_professionnelle?: string; };
//   profil_psychometrique?: { scores: Record<string, number>; points_forts: string[]; };
//   statut_profil: 'incomplet' | 'partiel' | 'complet';
// }
// export interface FitscoreFiliere { filiere_id: string; filiere_nom: string; score_total: number; }
// export interface FitscoreResult { classement: FitscoreFiliere[]; meilleure_filiere: string; rapport: string; error?: boolean; message?: string; }
// export interface HistoriqueChat  { id: string; titre: string; date: string; nb_messages: number; }
// export interface SessionData     { session_id: string; profil: StudentProfile | null; fitscore: FitscoreResult | null; test_psycho_en_cours: boolean; historique_chats: HistoriqueChat[]; chat_actuel_id: string; nb_messages: number; }
// export interface CarriereResult  { scenario: string; filiere_nom: string; filieres_disponibles?: string[]; explication?: string; annee_entree?: string; error?: boolean; donnees_cles: { salaire_depart: string; salaire_3ans: string; salaire_7ans: string; taux_insertion: string; }; }
// export interface ComparaisonResult { comparaison: string; recommandation?: string; avertissements?: string[]; error?: boolean; message?: string; }
// export interface AdmissionResult { rapport: string; error?: boolean; message?: string; }
// export interface CoachResult     { rapport: string; error?: boolean; message?: string; }
// export interface PsychoStartResult  { message: string; numero: number; total: number; }
// export interface PsychoAnswerResult { complete?: boolean; message?: string; question_actuelle?: number; scores?: Record<string, number>; rapport?: string; error?: boolean; }