// // src/store/chatStore.ts
// 'use client';
// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import { Message } from '@/types/message';

// interface ChatState {
//   currentConversationId: string | null;
//   messages:              Message[];
//   isTyping:              boolean;

//   addMessage:       (message: Message)            => void;
//   setTyping:        (status: boolean)             => void;
//   startNewChat:     ()                            => void;
//   clearChat:        ()                            => void;
//   loadConversation: (id: string, msgs: Message[]) => void;
// }

// export const useChatStore = create<ChatState>()(
//   persist(
//     (set) => ({
//       currentConversationId: null,
//       messages:              [],
//       isTyping:              false,

//       addMessage: (message) =>
//         set((state) => ({ messages: [...state.messages, message] })),

//       setTyping: (status) => set({ isTyping: status }),

//       startNewChat: () =>
//         set({ messages: [], currentConversationId: Date.now().toString() }),

//       clearChat: () =>
//         set({ messages: [], currentConversationId: Date.now().toString() }),

//       loadConversation: (id, msgs) =>
//         set({ currentConversationId: id, messages: msgs }),
//     }),
//     { name: 'supmti-chat-memory' }
//   )
// );


// src/store/chatStore.ts
'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message } from '@/types/message';

interface ChatState {
  currentConversationId: string | null;
  messages:              Message[];
  isTyping:              boolean;

  addMessage:          (message: Message)            => void;
  setTyping:           (status: boolean)             => void;
  startNewChat:        ()                            => void;
  clearChat:           ()                            => void;
  loadConversation:    (id: string, msgs: Message[]) => void;
  appendToLastMessage: (token: string)               => void;   // ← streaming
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

      // ── Streaming : ajoute un token au dernier message (assistant) ──────
      appendToLastMessage: (token) =>
        set((state) => {
          if (state.messages.length === 0) return state;
          const msgs = [...state.messages];
          const last = msgs[msgs.length - 1];
          msgs[msgs.length - 1] = {
            ...last,
            content: last.content + token,
          };
          return { messages: msgs };
        }),
    }),
    { name: 'supmti-chat-memory' }
  )
);