export type Role = 'admin' | 'student';

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: Role;
  is_active: boolean;
  created_at: string;
  // Propriétés optionnelles pour que l'admin et l'étudiant 
  // partagent la même interface dans le tableau users[]
  average?: number; 
  level?: string;
  bac_type?: string;
  city?: string;
  interests?: string[];
}

export interface Student extends User {
  average: number; // Pour le FitScore
  level: string;
  bac_type: string;
  city: string;
  interests?: string[]; // Pour Peer Match et recommandations
}