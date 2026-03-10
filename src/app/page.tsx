import Link from 'next/link';
import { Bot, UserCircle, GraduationCap, Sparkles, ChevronRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-8 bg-background overflow-hidden transition-colors duration-500">
      
      {/* --- LES BOULES ANIMÉES (BLOBS) --- */}
      <div className="absolute inset-0 pointer-events-none">
        {/* On change mix-blend en mode sombre pour que les couleurs "sortent" du noir */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-supmti-blue/20 dark:bg-supmti-blue/30 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-400/20 dark:bg-purple-600/30 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-pink-300/20 dark:bg-pink-500/30 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl animate-blob" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* --- CONTENU PRINCIPAL --- */}
      <div className="relative z-10 flex flex-col items-center text-center">
        
        {/* Badge flottant avec glassmorphism adaptatif */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-slate-800/50 border border-blue-100 dark:border-slate-700 text-supmti-blue dark:text-blue-400 text-xs font-bold mb-8 shadow-sm backdrop-blur-sm">
          <Sparkles size={14} className="animate-pulse" /> 
          Assistant IA Multimodal 2026
        </div>

        {/* Conteneur de l'icône */}
        <div className="bg-blue-100 dark:bg-slate-800 p-4 rounded-3xl text-supmti-blue dark:text-blue-400 mb-6 shadow-inner transition-colors">
          <GraduationCap size={64} />
        </div>

        {/* Titres adaptatifs */}
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight max-w-4xl transition-colors">
          L'Orientation Académique <br /> 
          <span className="text-supmti-blue dark:text-blue-500">Redéfinie par l'IA</span>
        </h1>

        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mb-10 leading-relaxed transition-colors">
          Propulsé par <strong className="text-gray-900 dark:text-gray-100">SUPMTI Meknès</strong>, notre conseiller virtuel analyse votre 
          profil unique pour vous guider vers la réussite.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/login" className="flex items-center justify-center gap-2 bg-supmti-blue dark:bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-xl dark:shadow-blue-900/20 hover:scale-105 transition-all group">
            <UserCircle size={20} /> 
            Espace Étudiant
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link href="/chatbot" className="flex items-center justify-center gap-2 border-2 border-supmti-blue/20 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md text-supmti-blue dark:text-blue-400 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 dark:hover:bg-slate-800 transition-all">
            <Bot size={20} /> 
            Essayer le Chatbot
          </Link>
        </div>

        {/* Pied de page de la landing */}
        <div className="mt-16 pt-8 border-t border-gray-100 dark:border-slate-800 w-full">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-bold mb-4">Analyse basée sur</p>
          <div className="flex justify-center gap-8 grayscale dark:invert opacity-50 transition-all">
              <span className="font-black text-xl italic dark:text-white">FitScore™</span>
              <span className="font-black text-xl italic dark:text-white">RAG Knowledge</span>
              <span className="font-black text-xl italic dark:text-white">EmotionSense</span>
          </div>
        </div>
      </div>
    </div>
  );
}