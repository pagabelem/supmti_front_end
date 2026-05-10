// // src/components/AdminLayoutWrapper.tsx
// 'use client';
// import { usePathname } from 'next/navigation';
// import { Sidebar } from '@/components/layout/Sidebar';
// import { Navbar }  from '@/components/layout/Navbar';

// // Pages qui ont besoin de scroll libre (pas overflow-hidden)
// const SCROLL_PAGES = [
//   '/settings', '/profile', '/dashboard', '/history',
// ];

// // Pages qui doivent être height-locked (pas de scroll global, scroll interne uniquement)
// const LOCKED_PAGES = ['/chatbot'];

// export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
//   const pathname  = usePathname();
//   const isAdmin   = pathname.startsWith('/admin');
//   const isLanding = pathname === '/';
//   const isAuth    = pathname === '/login' || pathname === '/register';

//   if (isAdmin || isLanding || isAuth) {
//     return <>{children}</>;
//   }

//   const isLocked = LOCKED_PAGES.some(p => pathname.startsWith(p));

//   return (
//     <div className={`flex w-full bg-background text-foreground ${isLocked ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
//       <Sidebar />
//       <div className={`flex-1 flex flex-col bg-gray-50 dark:bg-slate-900 transition-colors duration-300 ${isLocked ? 'overflow-hidden' : 'overflow-y-auto'}`}>
//         <Navbar />
//         <main className={`flex-1 flex flex-col ${isLocked ? 'overflow-hidden' : ''}`}>
//           {children}
//         </main>
//         <footer className="flex-shrink-0 p-4 text-center text-[10px] text-gray-400 dark:text-gray-500 bg-white dark:bg-slate-950 border-t dark:border-slate-800 uppercase tracking-widest transition-colors duration-300">
//           &copy; 2026 SUPMTI - Projet Assistant IA Multimodal
//         </footer>
//       </div>
//     </div>
//   );
// }




// ============================================================
// AdminLayoutWrapper.tsx
// ============================================================
// src/components/AdminLayoutWrapper.tsx
'use client';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar }  from '@/components/layout/Navbar';
import { useLang } from '@/i18n/LanguageContext';

const SCROLL_PAGES = ['/settings', '/profile', '/dashboard', '/history'];
const LOCKED_PAGES = ['/chatbot'];

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname();
  const { t } = useLang();
  const isAdmin   = pathname.startsWith('/admin');
  const isLanding = pathname === '/';
  const isAuth    = pathname === '/login' || pathname === '/register';

  if (isAdmin || isLanding || isAuth) {
    return <>{children}</>;
  }

  const isLocked = LOCKED_PAGES.some(p => pathname.startsWith(p));

  return (
    <div className={`flex w-full bg-background text-foreground ${isLocked ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <Sidebar />
      <div className={`flex-1 flex flex-col bg-gray-50 dark:bg-slate-900 transition-colors duration-300 ${isLocked ? 'overflow-hidden' : 'overflow-y-auto'}`}>
        <Navbar />
        <main className={`flex-1 flex flex-col ${isLocked ? 'overflow-hidden' : ''}`}>
          {children}
        </main>
        <footer className="flex-shrink-0 p-4 text-center text-[10px] text-gray-400 dark:text-gray-500 bg-white dark:bg-slate-950 border-t dark:border-slate-800 uppercase tracking-widest transition-colors duration-300">
          {t('admin_layout', 'footer_copy')}
        </footer>
      </div>
    </div>
  );
}