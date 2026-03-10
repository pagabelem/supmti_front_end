'use client';
import { Users, BookOpen, BarChart3, AlertCircle } from 'lucide-react';

const stats = [
  { label: 'Étudiants Inscrits', value: '1,254', icon: Users, color: 'text-blue-600' },
  { label: 'Filière la plus demandée', value: 'Génie Info', icon: BarChart3, color: 'text-purple-600' },
  { label: 'Documents RAG', value: '45', icon: BookOpen, color: 'text-green-600' },
  { label: 'Alertes Système', value: '0', icon: AlertCircle, color: 'text-gray-400' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold italic">Tableau de Bord Administrateur</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-gray-50 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{stat.label}</p>
              <p className="text-xl font-black">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <h2 className="font-bold mb-4">Dernières Orientations (Analyse FitScore)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3">Étudiant</th>
                <th className="p-3">Moyenne</th>
                <th className="p-3">Filière Suggérée</th>
                <th className="p-3">Score</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-3 font-medium">Ahmed El Amrani</td>
                <td className="p-3">16.50</td>
                <td className="p-3">Intelligence Artificielle</td>
                <td className="p-3 font-bold text-green-600">92%</td>
              </tr>
              {/* Autres lignes... */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}