'use client';
import { useAuthStore } from '@/store/authStore';
import { GraduationCap, TrendingUp, BookOpen, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Tableau de Bord</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Carte FitScore */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <TrendingUp size={24} />
            <span className="bg-white/20 px-2 py-1 rounded text-xs italic text-white">IA Predictor</span>
          </div>
          <p className="text-blue-100 text-sm">Compatibilité Filière (Ingénierie)</p>
          <h2 className="text-4xl font-black mt-1">87%</h2>
        </div>

        {/* Carte Statut */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <BookOpen className="text-blue-600 mb-4" size={24} />
          <p className="text-gray-500 text-sm">Baccalauréat</p>
          <h2 className="text-xl font-bold text-gray-800">{ (user as any)?.bac_type || "Non renseigné" }</h2>
        </div>

        {/* Carte Chatbot */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <MessageSquare className="text-green-500 mb-4" size={24} />
          <p className="text-gray-500 text-sm">Dernière session IA</p>
          <h2 className="text-xl font-bold text-gray-800 italic">"Conseils en cours..."</h2>
        </div>
      </div>

      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-bold mb-4">Actions recommandées</h3>
        <div className="flex flex-wrap gap-4">
          <Link href="/chatbot" className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition">
            Lancer une simulation de carrière
          </Link>
          <Link href="/profile" className="bg-gray-50 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition">
            Mettre à jour mes notes (FitScore)
          </Link>
        </div>
      </div>
    </div>
  );
}