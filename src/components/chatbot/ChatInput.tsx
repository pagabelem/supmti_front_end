'use client';
import { useState } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import chatbotService from '@/services/chatbotService';
import { useChatStore } from '@/store/chatStore';
import { v4 as uuidv4 } from 'uuid';

// Ajoutez "default" ici
export default function ChatInput() {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const { addMessage, setTyping } = useChatStore();

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = { 
      id: uuidv4(), 
      content: input, 
      sender: 'user' as const, 
      created_at: new Date().toISOString() 
    };
    
    addMessage(userMsg);
    setInput('');
    setTyping(true);

    try {
      const response = await chatbotService.sendMessage(input);
addMessage({
  id: uuidv4(),
  content: response.ai_response,
  sender: 'ai',
  created_at: new Date().toISOString()
});
    } catch (error) {
      console.error("Erreur d'envoi:", error);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="p-4 border-t bg-white flex gap-2 items-center">
      <button 
        onClick={() => setIsListening(!isListening)}
        className={`p-2 rounded-full transition ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-gray-500 hover:bg-gray-100'}`}
      >
        {isListening ? <MicOff size={22} /> : <Mic size={22} />}
      </button>
      
      <input 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Posez votre question (Français, Darija...)"
        className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />
      
      <button 
        onClick={handleSend}
        disabled={!input.trim()}
        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 transition"
      >
        <Send size={20} />
      </button>
    </div>
  );
}