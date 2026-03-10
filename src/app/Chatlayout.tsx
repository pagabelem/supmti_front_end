// import type { Metadata } from "next";
// import "./globals.css";
// import Sidebar  from "@/components/layout/Sidebar";
// import { Navbar } from "@/components/layout/Navbar";
// import { ThemeProvider } from "@/components/ThemeProvider"; // Import du provider

// export const metadata: Metadata = {
//   title: "SUPMTI - Orientation IA",
//   description: "Plateforme intelligente d'aide à l'orientation académique",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     // suppressHydrationWarning est indispensable ici
//     <html lang="fr" suppressHydrationWarning> 
//       <body className="antialiased transition-colors duration-300">
//         <ThemeProvider>
//           {/* Ce conteneur devient la base de ton application */}
//           <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
            
//             {/* 1. Sidebar fixe à gauche */}
//             <Sidebar />

//             {/* 2. Conteneur principal à droite */}
//             <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
              
//               {/* 3. Navbar en haut */}
//               <Navbar /> 

//               {/* 4. Zone de contenu dynamique */}
//               <main className="flex-1 overflow-y-auto p-4 md:p-8">
//                 {children}
//               </main>

//               {/* 5. Footer */}
//               <footer className="p-4 text-center text-[10px] text-gray-400 dark:text-gray-500 bg-white dark:bg-slate-950 border-t dark:border-slate-800 uppercase tracking-widest transition-colors duration-300">
//                 &copy; 2026 SUPMTI - Projet Assistant IA Multimodal
//               </footer>
//             </div>
//           </div>
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }