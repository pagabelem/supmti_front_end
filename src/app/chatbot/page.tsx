'use client';
import { useState } from 'react';
import { ChatWindow } from '@/components/chatbot/ChatWindow';
import  ChatInput  from '@/components/chatbot/ChatInput';

export default function ChatbotPage() {
  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-80px)] flex flex-col p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Conseiller Virtuel Intelligent</h1>
        <p className="text-sm text-gray-500 italic">Supporte Français, Anglais et Darija [cite: 83]</p>
      </header>
      
      <div className="flex-1 overflow-hidden border rounded-xl bg-white shadow-lg flex flex-col">
        <ChatWindow />
        <ChatInput />
      </div>
    </div>
  );
}