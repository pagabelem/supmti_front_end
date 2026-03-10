'use client';
import { useState } from 'react';
import { 
  Settings, 
  Globe, 
  Volume2, 
  ShieldCheck, 
  Sparkles, 
  Languages, 
  Trash2, 
  KeyRound,
  Bell,
  Moon,
  ChevronRight,
    Bot,
  Info
} from 'lucide-react';

export default function SettingsPage() {
  const [language, setLanguage] = useState('fr');
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="relative flex flex-col min-h-screen bg-gray-50/50">
      
      {/* --- BLOBS DÉCORATIFS (STYLE LANDING) --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-supmti-blue text-white rounded-[2rem] shadow-xl shadow-blue-200">
            <Settings size={32} className="animate-[spin_4s_linear_infinite]" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">Paramètres</h1>
              <p className="text-gray-500 font-medium">Personnalisez votre expérience d'orientation IA</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-blue-100 text-supmti-blue text-xs font-bold shadow-sm backdrop-blur-md">
            <Sparkles size={14} className="animate-pulse" /> 
            Assistant Configuré pour SUPMTI 2026
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- COLONNE GAUCHE: PRÉFÉRENCES IA --- */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Langue & Région */}
            <section className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-blue-50 text-supmti-blue rounded-xl">
                  <Globe size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Langue et Région</h2>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center p-6 rounded-[2rem] bg-gray-50 border border-transparent hover:border-blue-100 transition-all">
                <div>
                  <p className="font-black text-gray-800">Langue du Chatbot</p>
                  <p className="text-xs text-gray-500 max-w-[250px]">L'IA s'adaptera automatiquement à votre choix de dialecte.</p>
                </div>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full sm:w-auto bg-white border-2 border-gray-100 rounded-2xl px-6 py-3 text-sm font-bold text-supmti-blue outline-none focus:border-supmti-blue transition-all cursor-pointer"
                >
                  <option value="fr">🇫🇷 Français (Standard)</option>
                  <option value="ar-ma">🇲🇦 Darija (Maroc)</option>
                  <option value="en">🇬🇧 English (UK)</option>
                </select>
              </div>
            </section>

            {/* Accessibilité & Audio */}
            <section className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-green-50 text-green-600 rounded-xl">
                  <Volume2 size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Multimodalité Audio</h2>
              </div>
              
              <div className="flex justify-between items-center p-6 rounded-[2rem] bg-gray-50 border border-transparent hover:border-green-100 transition-all">
                <div>
                  <p className="font-black text-gray-800">Lecture automatique (TTS)</p>
                  <p className="text-xs text-gray-500">L'IA lira ses réponses à haute voix.</p>
                </div>
                <button 
                  onClick={() => setTtsEnabled(!ttsEnabled)}
                  className={`w-14 h-8 rounded-full transition-all relative ${ttsEnabled ? 'bg-green-500 shadow-lg shadow-green-100' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${ttsEnabled ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </section>

            {/* Interface & Apparence */}
            <section className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
               <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                  <Moon size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Apparence</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => setDarkMode(false)}
                  className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${!darkMode ? 'border-supmti-blue bg-blue-50 text-supmti-blue' : 'border-gray-100 text-gray-400'}`}
                >
                  <span className="font-bold">Mode Clair</span>
                  <div className={`w-4 h-4 rounded-full border-2 ${!darkMode ? 'bg-supmti-blue border-white' : 'border-gray-200'}`} />
                </button>
                <button 
                  onClick={() => setDarkMode(true)}
                  className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${darkMode ? 'border-supmti-blue bg-blue-50 text-supmti-blue' : 'border-gray-100 text-gray-400'}`}
                >
                  <span className="font-bold">Mode Sombre</span>
                  <div className={`w-4 h-4 rounded-full border-2 ${darkMode ? 'bg-supmti-blue border-white' : 'border-gray-200'}`} />
                </button>
              </div>
            </section>
          </div>

          {/* --- COLONNE DROITE: SÉCURITÉ & ACTIONS --- */}
          <div className="space-y-8">
            
            {/* Sécurité */}
            <section className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8 text-red-500">
                <ShieldCheck size={20} />
                <h2 className="text-xl font-bold">Sécurité</h2>
              </div>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-all group font-bold text-gray-700 text-sm">
                  <div className="flex items-center gap-3">
                    <KeyRound size={18} className="text-gray-400" /> Modifier le mot de passe
                  </div>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="h-[1px] bg-gray-100 mx-4" />
                <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-red-50 transition-all group font-bold text-red-500 text-sm">
                  <div className="flex items-center gap-3">
                    <Trash2 size={18} /> Supprimer l'historique (RGPD)
                  </div>
                </button>
              </div>
            </section>

            {/* Notifications */}
            <section className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 text-orange-500">
                  <Bell size={20} />
                  <h2 className="text-xl font-bold">Alertes</h2>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifications} 
                  onChange={() => setNotifications(!notifications)}
                  className="w-5 h-5 accent-supmti-blue cursor-pointer" 
                />
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                Recevez des notifications pour les nouvelles filières recommandées basées sur votre FitScore.
              </p>
            </section>

            {/* Info Version */}
            <div className="text-center p-6 bg-blue-900 rounded-[2.5rem] text-white shadow-xl shadow-blue-100 relative overflow-hidden group">
              <div className="relative z-10">
                <Info size={24} className="mx-auto mb-2 opacity-50" />
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Version App</p>
                <p className="text-lg font-black italic">v2.4-SUPMTI</p>
              </div>
              <Bot size={80} className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform" />
            </div>
          </div>
        </div>

        {/* --- FOOTER ACTIONS --- */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-end gap-4">
          <button className="w-full sm:w-auto px-10 py-4 text-gray-400 font-bold hover:text-gray-600 transition">
            Annuler les modifications
          </button>
          <button className="w-full sm:w-auto px-12 py-4 bg-supmti-blue text-white rounded-[1.5rem] font-black shadow-2xl shadow-blue-200 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
            Sauvegarder les préférences <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}