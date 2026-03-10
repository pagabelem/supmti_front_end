'use client';
import { useState } from 'react';
import { 
  Settings2, 
  Cpu, 
  Activity, 
  Save, 
  RefreshCcw, 
  ShieldAlert, 
  BrainCircuit,
  Zap
} from 'lucide-react';


export default function AIConfigPage() {
  const [temp, setTemp] = useState(0.7);
  const [systemPrompt, setSystemPrompt] = useState(
    "Tu es l'assistant intelligent de SUPMTI Meknès. Ton rôle est d'orienter les étudiants en fonction de leur FitScore et de leurs centres d'intérêt..."
  );

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BrainCircuit className="text-supmti-blue" /> Configuration du Moteur IA
          </h1>
          <p className="text-sm text-gray-500">Ajustez les paramètres du RAG et du modèle LLM</p>
        </div>
        <button className="flex items-center gap-2 bg-supmti-blue text-white px-6 py-2 rounded-xl font-bold hover:shadow-lg transition">
          <Save size={18} /> Appliquer les changements
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Colonne Gauche: Paramètres du Modèle */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-6 rounded-2xl border shadow-sm">
            <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
              <Settings2 size={18} /> Prompt Système (Personnalité de l'IA)
            </h2>
            <textarea 
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={6}
              className="w-full p-4 bg-gray-50 border rounded-xl text-sm text-gray-600 focus:ring-2 focus:ring-supmti-blue/20 outline-none"
            />
            <p className="text-[10px] text-gray-400 mt-2 italic">
              * Ce prompt définit comment l'IA interagit avec les étudiants de SUPMTI.
            </p>
          </section>

          <section className="bg-white p-6 rounded-2xl border shadow-sm">
            <h2 className="font-bold text-gray-700 mb-4">Paramètres Avancés</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Température (Créativité : {temp})</label>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.1" 
                  value={temp} onChange={(e) => setTemp(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-supmti-blue" 
                />
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                <div>
                  <p className="text-sm font-bold text-supmti-blue">Mode RAG Hybrid</p>
                  <p className="text-[10px] text-blue-600">Recherche vectorielle + sémantique activée</p>
                </div>
                <div className="w-10 h-5 bg-supmti-blue rounded-full relative">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Colonne Droite: Status & Logs */}
        <div className="space-y-6">
          <section className="bg-white p-6 rounded-2xl border shadow-sm">
            <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
              <Activity size={18} /> État des Services
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">OpenAI API</span>
                <span className="flex items-center gap-1 text-green-500 font-bold">
                  <Zap size={14} /> Opérationnel
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Pinecone (Vecteurs)</span>
                <span className="flex items-center gap-1 text-green-500 font-bold">
                  <Zap size={14} /> Opérationnel
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Analyse Émotionnelle</span>
                <span className="flex items-center gap-1 text-orange-500 font-bold">
                  <RefreshCcw size={14} className="animate-spin" /> Latence élevée
                </span>
              </div>
            </div>
          </section>

          <section className="bg-gray-900 p-6 rounded-2xl shadow-xl text-green-400 font-mono text-[10px]">
            <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
              <span className="text-gray-500 uppercase tracking-widest">Logs Temps Réel</span>
              <ShieldAlert size={14} className="text-red-500" />
            </div>
            <div className="space-y-1">
              <p>[15:10:22] - Analyse FitScore calculée pour ID_4402</p>
              <p>[15:11:05] - Requête RAG : "Filières Ingénierie"</p>
              <p className="text-yellow-500">[15:12:40] - Attention : Token limit proche (85%)</p>
              <p>[15:13:01] - Message envoyé : "Bonjour Ahmed..."</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}