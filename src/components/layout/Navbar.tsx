'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, Bot, LogOut, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from 'next-themes';

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <nav className="h-[64px] flex justify-between items-center px-6 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 shadow-sm sticky top-0 z-40 transition-all duration-300">
      
      {/* Côté Gauche : Logo */}
      <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
        <Image 
          src="/images/logo-supmti.png" 
          alt="Logo" 
          width={100} 
          height={32}  
          className="object-contain dark:brightness-0 dark:invert"
          priority
        />
        <span className="font-bold text-lg text-supmti-blue dark:text-blue-400 border-l border-gray-200 dark:border-slate-700 pl-3 hidden md:block transition-colors">
          Assistant <span className="text-red-600">IA</span>
        </span>
      </Link>

      {/* Côté Droit : Actions */}
      <div className="flex gap-4 items-center">
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-yellow-400 transition-all"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        )}

        {user && (
          <div className="flex items-center gap-4">
            {/* <div className="hidden sm:flex items-center gap-3 mr-2 border-r dark:border-slate-800 pr-4">
              <Link href="/chatbot" className="text-gray-500 dark:text-gray-400 hover:text-supmti-blue text-sm font-bold">Chatbot</Link>
            </div> */}
            {/* <button 
              onClick={logout} 
              className="p-2 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-500 hover:bg-red-500 hover:text-white transition-all"
            >
              <LogOut size={18} />
            </button> */}
          </div>
        )}
      </div>
    </nav>
  );
};