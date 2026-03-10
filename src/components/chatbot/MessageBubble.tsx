'use client';
import ReactMarkdown from 'react-markdown';
import { Message } from '@/types/message';
import { Volume2, User, Bot } from 'lucide-react';

export const MessageBubble = ({ message }: { message: Message }) => {
  const isAi = message.sender === 'ai';

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR'; // Peut être dynamisé selon la détection de langue [cite: 93]
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={`flex ${isAi ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`flex max-w-[80%] ${isAi ? 'flex-row' : 'flex-row-reverse'} gap-2`}>
        <div className={`p-2 rounded-full h-8 w-8 flex items-center justify-center ${isAi ? 'bg-blue-100 text-blue-600' : 'bg-gray-200'}`}>
          {isAi ? <Bot size={18} /> : <User size={18} />}
        </div>
        
        <div className={`relative p-3 rounded-2xl shadow-sm ${isAi ? 'bg-white border text-gray-800' : 'bg-blue-600 text-white'}`}>
          <div className="prose prose-sm">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
          
          {isAi && (
            <button 
              onClick={() => speak(message.content)}
              className="mt-2 text-gray-400 hover:text-blue-500 transition"
              title="Écouter la réponse"
            >
              <Volume2 size={14} />
            </button>
          )}
          
          {message.emotion && (
            <span className="absolute -bottom-5 right-0 text-[10px] text-gray-400 italic">
              Sentiment détecté : {message.emotion} 
            </span>
          )}
        </div>
      </div>
    </div>
  );
};