// src/services/panelService.ts
'use client';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// ─── Récupère le user_id depuis le localStorage (authStore Zustand) ──────────
function getUserId(): string {
  try {
    const raw = localStorage.getItem('supmti-auth');
    if (!raw) return '';
    return JSON.parse(raw)?.state?.user?.id || '';
  } catch {
    return '';
  }
}

// ─── Headers communs ─────────────────────────────────────────────────────────
function authHeaders(): HeadersInit {
  const uid = getUserId();
  return {
    'Content-Type': 'application/json',
    ...(uid ? { 'X-User-Id': uid } : {}),
  };
}

// ─── Helper POST / GET ────────────────────────────────────────────────────────
const post = async (path: string, body?: object) => {
  const res = await fetch(`${API}${path}`, {
    method:      'POST',
    headers:     authHeaders(),
    credentials: 'include',
    body:        body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (res.status >= 500) throw new Error(data.message || `Erreur serveur ${res.status}`);
  return data;
};

const get = async (path: string) => {
  const res = await fetch(`${API}${path}`, {
    headers:     authHeaders(),
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiError {
  error?:   boolean;
  message?: string;
}

export interface ProfilData {
  informations_personnelles?: { prenom?: string; pays?: string; ville?: string };
  parcours_academique?: {
    type_bac?: string; label_bac?: string; moyenne_generale?: number;
    mention?: string; niveau_actuel?: string; diplome_actuel?: string;
    notes_matieres?: Record<string, number>;
  };
  preferences?: { centres_interet?: string[]; ambition_professionnelle?: string };
  profil_psychometrique?: { scores?: Record<string, number>; points_forts?: string[] };
  statut_profil?: string;
}

export interface FitscoreResponse extends ApiError {
  rapport?:           string;
  classement?:        { filiere_id: string; filiere_nom: string; score_total: number }[];
  meilleure_filiere?: string;
  profil?:            ProfilData;
}

export interface AdmissionResponse extends ApiError {
  rapport?: string;
  profil?:  ProfilData;
}

export interface CarriereResponse extends ApiError {
  filieres_disponibles?: string[];
  explication?:          string;
  annee_entree?:         string;
  scenario?:             string;
  filiere_nom?:          string;
  donnees_cles?: {
    salaire_depart?: string; salaire_3ans?: string;
    salaire_7ans?:   string; taux_insertion?: string;
  };
}

export interface ComparerResponse extends ApiError {
  comparaison?:    string;
  recommandation?: string;
  avertissements?: string[];
}

export interface PsychoStartResponse {
  message:           string;
  question_actuelle: number;
  total_questions:   number;
}

export interface PsychoAnswerResponse extends ApiError {
  complete?:          boolean;
  message?:           string;
  question_actuelle?: number;
  total_questions?:   number;
  rapport?:           string;
  scores?:            Record<string, number>;
  points_forts?:      string[];
}

export interface CoachResponse extends ApiError {
  rapport?: string;
  profil?:  ProfilData;
}

export interface PeerMatchResponse extends ApiError {
  success?:       boolean;
  ambassadeur?:   string;
  contact_email?: string;
  contact_wa?:    string;
  message?:       string;
}

// ─── Fonctions exportées ──────────────────────────────────────────────────────

export const getProfil    = (): Promise<{ profil: ProfilData }> => get('/api/profil');
export const getFitscore  = (): Promise<FitscoreResponse>       => post('/api/fitscore');
export const getAdmission = (): Promise<AdmissionResponse>      => post('/api/admission');
export const getCoach     = (): Promise<CoachResponse>          => post('/api/coach');

export const getCarriere  = (filiere_id?: string): Promise<CarriereResponse> =>
  post('/api/carriere', filiere_id ? { filiere_id } : {});

export const getComparer  = (filiere_1: string, filiere_2: string): Promise<ComparerResponse> =>
  post('/api/comparer', { filiere_1, filiere_2 });

export const startPsycho  = (): Promise<PsychoStartResponse>     => post('/api/psycho/start');

export const answerPsycho = (reponse: string): Promise<PsychoAnswerResponse> =>
  post('/api/psycho/answer', { reponse });

export const getFilieres  = () => get('/api/filieres');

export const sendPeerMatch = (
  prenom: string, email: string, filiere: string, message: string,
): Promise<PeerMatchResponse> =>
  post('/api/peermatch', { prenom, email, filiere, message });