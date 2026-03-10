'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  UserCheck, 
  UserX, 
  Mail,
  ArrowUpRight
} from 'lucide-react';

// Données fictives (Mock Data) conformes au profil étudiant
const mockUsers = [
  { id: 1, name: 'Ahmed El Amrani', email: 'ahmed@example.com', bac: 'SM', average: 17.20, fitScore: 94, status: 'active' },
  { id: 2, name: 'Sara Bennani', email: 'sara@example.com', bac: 'PC', average: 15.45, fitScore: 82, status: 'active' },
  { id: 3, name: 'Youssef Alami', email: 'youssef@example.com', bac: 'Eco', average: 12.00, fitScore: 45, status: 'pending' },
  { id: 4, name: 'Laila Rouissi', email: 'laila@example.com', bac: 'SVT', average: 14.10, fitScore: 78, status: 'active' },
];

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      {/* Header avec Statistiques Rapides */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="text-supmti-blue" /> Gestion des Étudiants
          </h1>
          <p className="text-sm text-gray-500 font-medium">Surveillance des profils et analyses d'orientation</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
            <p className="text-[10px] uppercase text-blue-600 font-bold">Moyenne FitScore</p>
            <p className="text-xl font-black text-supmti-blue">74.8%</p>
          </div>
        </div>
      </div>

      {/* Barre d'outils (Recherche et Filtres) */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Rechercher un étudiant par nom ou email..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-supmti-blue/20 transition"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border rounded-xl hover:bg-gray-50 transition text-sm font-medium">
          <Filter size={18} /> Filtrer par Bac
        </button>
      </div>

      {/* Tableau des Utilisateurs */}
      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Étudiant</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">Bac / Moyenne</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">FitScore IA</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">Statut</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockUsers.map((user) => (
              <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-supmti-blue to-blue-400 flex items-center justify-center text-white font-bold shadow-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600 mr-2">{user.bac}</span>
                  <span className="text-sm font-medium text-gray-700">{user.average.toFixed(2)}</span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex flex-col items-center">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[11px] font-black",
                      user.fitScore >= 80 ? "bg-green-100 text-green-700" : 
                      user.fitScore >= 60 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                    )}>
                      {user.fitScore}%
                    </span>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-1 rounded uppercase",
                    user.status === 'active' ? "text-green-500" : "text-orange-500"
                  )}>
                    {user.status === 'active' ? '● Actif' : '● En attente'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-1">
                    <button className="p-2 text-gray-400 hover:text-supmti-blue transition-colors" title="Envoyer un email">
                      <Mail size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Désactiver">
                      <UserX size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer de pagination ou Info */}
      <div className="flex justify-between items-center text-xs text-gray-400 font-medium">
        <p>Affichage de {mockUsers.length} étudiants</p>
        <button className="flex items-center gap-1 text-supmti-blue hover:underline">
          Exporter les données (CSV) <ArrowUpRight size={12} />
        </button>
      </div>
    </div>
  );
}