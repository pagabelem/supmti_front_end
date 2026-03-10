'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, MessageSquare, UserCircle, Settings, 
  ChevronLeft, ChevronRight, GraduationCap, History,
  ShieldCheck, Database, BrainCircuit, Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

const studentItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Chatbot IA', href: '/chatbot', icon: MessageSquare },
  { name: 'Mon Profil', href: '/profile', icon: UserCircle },
  { name: 'Historique', href: '/history', icon: History },
  { name: 'Paramètres', href: '/settings', icon: Settings },
];

const adminItems = [
  { name: 'Admin Stats', href: '/admin/dashboard', icon: ShieldCheck },
  { name: 'Base RAG', href: '/admin/knowledge', icon: Database },
  { name: 'Utilisateurs', href: '/admin/users', icon: Users },
  { name: 'Configuration IA', href: '/admin/ai-config', icon: BrainCircuit },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useAuthStore();

  const renderLinks = (items: typeof studentItems) => items.map((item) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;

    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "flex items-center gap-3 p-3 rounded-xl transition-all group mb-1",
          isActive 
            ? "bg-supmti-blue text-white shadow-md dark:shadow-blue-900/20" 
            : "text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-supmti-blue dark:hover:text-blue-400",
          collapsed && "justify-center"
        )}
      >
        <Icon size={22} className={cn(isActive ? "text-white" : "group-hover:scale-110 transition-transform")} />
        {!collapsed && <span className="font-medium text-sm">{item.name}</span>}
      </Link>
    );
  });

  return (
    <aside 
      className={cn(
        "h-screen bg-white dark:bg-slate-950 border-r border-gray-200 dark:border-slate-800 transition-all duration-300 flex flex-col sticky top-0 z-[60]",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* BOUTON INTERSECTION NAVBAR/SIDEBAR */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          "absolute z-[70] flex items-center justify-center transition-all duration-300",
          "bg-supmti-blue dark:bg-blue-600 text-white shadow-lg hover:scale-110 active:scale-90",
          "rounded-full border-4 border-gray-50 dark:border-slate-900", // Bordure épaisse pour l'effet d'encastrement
          "h-8 w-8",
          "-right-4 top-[64px] -translate-y-1/2" // Aligné pile sur la bordure de la Navbar
        )}
      >
        {collapsed ? <ChevronRight size={14} strokeWidth={3} /> : <ChevronLeft size={14} strokeWidth={3} />}
      </button>

      {/* Header Logo */}
      <div className={cn("h-[64px] px-6 flex items-center gap-3 border-b border-transparent", collapsed && "justify-center")}>
        <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-lg text-supmti-blue dark:text-blue-400 shrink-0">
          <GraduationCap size={24} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h2 className="font-bold text-gray-800 dark:text-gray-100 truncate text-xs leading-none">SUPMTI</h2>
            <p className="text-[9px] text-gray-400 uppercase font-black tracking-tighter">AI Assistant</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 mt-6 overflow-y-auto custom-scrollbar">
        <div className="mb-4">
          {!collapsed && <p className="text-[10px] font-bold text-gray-400 dark:text-gray-600 px-3 mb-2 uppercase tracking-widest">Menu</p>}
          {renderLinks(studentItems)}
        </div>

        {user?.role === 'admin' && (
          <div className="pt-4 mt-4 border-t border-gray-100 dark:border-slate-800">
            {renderLinks(adminItems)}
          </div>
        )}
      </nav>

      {/* Info Role */}
      {!collapsed && (
        <div className="p-3 m-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-800">
          <p className="text-[10px] text-gray-500 dark:text-gray-400 text-center font-bold uppercase">
            {user?.role}
          </p>
        </div>
      )}
    </aside>
  );
};