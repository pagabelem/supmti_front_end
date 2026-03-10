'use client';
import { Upload, FileText, Trash2, CheckCircle } from 'lucide-react';

export default function KnowledgeBase() {
  return (
    <div className="space-y-6">
      <div className="bg-blue-700 text-white p-8 rounded-3xl shadow-xl">
        <h1 className="text-2xl font-bold">Base de Connaissances IA (RAG)</h1>
        <p className="opacity-80">Importez les PDF des filières pour mettre à jour le cerveau du Chatbot.</p>
        <button className="mt-6 flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition">
          <Upload size={20} /> Télécharger un PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['Brochure_Genie_Info.pdf', 'Reglement_Interieur.pdf', 'Guide_Orientation_2026.pdf'].map((doc, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-white border rounded-2xl">
            <div className="flex items-center gap-3">
              <FileText className="text-red-500" />
              <div>
                <p className="font-medium text-sm">{doc}</p>
                <p className="text-[10px] text-green-600 flex items-center gap-1">
                  <CheckCircle size={10} /> Indexé dans la base vectorielle
                </p>
              </div>
            </div>
            <button className="text-gray-300 hover:text-red-500">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}