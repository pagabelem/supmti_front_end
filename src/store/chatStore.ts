'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message } from '@/types/message';

interface ChatState {
  currentConversationId: string | null;
  messages: Message[];
  isTyping: boolean;
  addMessage: (message: Message) => void;
  setTyping: (status: boolean) => void;
  startNewChat: () => void;
  loadConversation: (id: string, history: Message[]) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      currentConversationId: null,
      messages: [],
      isTyping: false,
      addMessage: (message) => 
        set((state) => ({ messages: [...state.messages, message] })),
      setTyping: (status) => set({ isTyping: status }),
      startNewChat: () => set({ messages: [], currentConversationId: Date.now().toString() }),
      loadConversation: (id, history) => set({ currentConversationId: id, messages: history }),
    }),
    { name: 'supmti-chat-memory' } // Stockage local automatique
  )
);