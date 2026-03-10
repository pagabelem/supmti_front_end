export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  date: string;
  category: 'Orientation' | 'FitScore' | 'Carrière';
}