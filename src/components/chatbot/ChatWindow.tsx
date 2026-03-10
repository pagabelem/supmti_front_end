'use client';
import { useChatStore } from '@/store/chatStore';
import { MessageBubble } from './MessageBubble';
import { useEffect, useRef } from 'react';

export const ChatWindow = () => {
  const { messages, isTyping } = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      {isTyping && (
        <div className="text-sm text-gray-400 animate-pulse">L'IA réfléchit...</div>
      )}
    </div>
  );
};