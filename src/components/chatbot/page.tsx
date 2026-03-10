// 'use client';
// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuthStore } from '@/store/authStore';
// import { Navbar }       from '@/components/layout/Navbar';
// import { Sidebar }      from '@/components/layout/Sidebar';
// import ChatWindow       from '@/components/chatbot/ChatWindow';

// export default function ChatbotPage() {
//   const router = useRouter();
//   const user   = useAuthStore(s => s.user);

//   useEffect(() => { if (!user) router.replace('/login'); }, [user, router]);
//   if (!user) return null;

//   return (
//     <div className="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-slate-950">
//       {/* Navbar existante */}
//       <Navbar />

//       <div className="flex flex-1 overflow-hidden">
//         {/* Sidebar existante */}
//         <Sidebar />

//         {/* Zone de chat complète (feature bar + messages + panels) */}
//         <main className="flex-1 overflow-hidden">
//           <ChatWindow />
//         </main>
//       </div>
//     </div>
//   );
// }