// src/store/chatStore.ts
'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message } from '@/types/message';

interface ChatState {
  currentConversationId: string | null;
  messages:              Message[];
  isTyping:              boolean;

  addMessage:       (message: Message)            => void;
  setTyping:        (status: boolean)             => void;
  startNewChat:     ()                            => void;
  clearChat:        ()                            => void;
  loadConversation: (id: string, msgs: Message[]) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      currentConversationId: null,
      messages:              [],
      isTyping:              false,

      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),

      setTyping: (status) => set({ isTyping: status }),

      startNewChat: () =>
        set({ messages: [], currentConversationId: Date.now().toString() }),

      clearChat: () =>
        set({ messages: [], currentConversationId: Date.now().toString() }),

      loadConversation: (id, msgs) =>
        set({ currentConversationId: id, messages: msgs }),
    }),
    { name: 'supmti-chat-memory' }
  )
);