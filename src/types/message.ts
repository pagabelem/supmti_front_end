export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  created_at: string;
  
  // Champs optionnels pour l'IA Multimodale et EmotionSense
  emotion?: string; 
  audioUrl?: string; 
  suggestions?: string[]; // Boutons de réponse rapide
}