'use client';
import { History as HistoryIcon, MessageSquare, ArrowRight, Trash2 } from 'lucide-react';
import Link from 'next/link';

// 1. Définition du type localement (ou import-le si tu as créé src/types/chat.ts)
interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  date: string;
  category: 'Orientation' | 'FitScore' | 'Carrière';
}

// 2. Utilisation du type pour les données fictives
const mockHistory: Conversation[] = [
  { 
    id: '1', 
    title: 'Analyse Bac SM - Génie Civil', 
    lastMessage: 'Quels sont les débouchés...', 
    date: '02 Mars 2026', 
    category: 'Orientation' 
  },
  { 
    id: '2', 
    title: 'Calcul FitScore Informatique', 
    lastMessage: 'Votre score est de 85%...', 
    date: '28 Fév 2026', 
    category: 'FitScore' 
  },
];

export default function HistoryPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="p-2 bg-blue-100 text-supmti-blue rounded-lg">
          <HistoryIcon size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mémoire de l'Assistant</h1>
          <p className="text-sm text-gray-500">Retrouvez vos échanges et analyses passés</p>
        </div>
      </div>

      <div className="grid gap-4">
        {mockHistory.map((chat) => (
          <div key={chat.id} className="group bg-white border border-gray-100 p-5 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-full text-gray-400 group-hover:text-supmti-blue transition-colors">
                <MessageSquare size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-800">{chat.title}</h3>
                  <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full uppercase font-bold">
                    {chat.category}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate max-w-md">{chat.lastMessage}</p>
                <p className="text-[10px] text-gray-400 mt-1">{chat.date}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                <Trash2 size={18} />
              </button>
              <Link 
                href={`/chatbot?id=${chat.id}`}
                className="flex items-center gap-2 bg-gray-50 text-supmti-blue px-4 py-2 rounded-xl font-medium group-hover:bg-supmti-blue group-hover:text-white transition-all"
              >
                Reprendre <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}