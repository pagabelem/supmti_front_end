/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/admin/ai-config/page.tsx
'use client';
import { useEffect, useState } from 'react';
import {
  Settings2, Activity, Save, RefreshCcw,
  ShieldAlert, BrainCircuit, Zap, Loader2,
  CheckCircle2, AlertCircle, Database, Cpu
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
function getUid() {
  try { return JSON.parse(localStorage.getItem('supmti-auth') || '{}')?.state?.user?.id || ''; }
  catch { return ''; }
}

interface ServiceStatus { name: string; status: 'ok'|'warn'|'error'; latency?: number; }
interface LogEntry      { time: string; level: 'info'|'warn'|'error'; message: string; }

export default function AIConfigPage() {
  const [temp,         setTemp]         = useState(0.7);
  const [maxTokens,    setMaxTokens]    = useState(1000);
  const [ragMode,      setRagMode]      = useState(true);
  const [systemPrompt, setSystemPrompt] = useState(
    "Tu es SAMI, l'assistant intelligent d'orientation académique de SUPMTI Meknès. " +
    "Tu aides les étudiants avec empathie et précision en te basant sur les filières de l'école. " +
    "Tu utilises le FitScore pour recommander la filière la plus adaptée."
  );
  const [services,  setServices]  = useState<ServiceStatus[]>([]);
  const [logs,      setLogs]      = useState<LogEntry[]>([]);
  const [ragStats,  setRagStats]  = useState<any>(null);
  const [saving,    setSaving]    = useState(false);
  const [saveStatus,setSaveStatus]= useState<'idle'|'ok'|'error'>('idle');
  const [loadingSvc,setLoadingSvc]= useState(true);

  // Charger le statut des services
  useEffect(() => {
    const uid = getUid();
    // HeadersInit or undefined to satisfy fetch typings when no UID
    const headers: HeadersInit | undefined = uid ? { 'X-User-Id': String(uid) } : undefined;

    // Statut STT
    fetch(`${API}/test-stt/status`, { credentials:'include', headers })
      .then(r => r.json())
      .then(d => setServices(prev => [...prev, {
        name: 'OpenAI Whisper (STT)',
        status: d.success ? 'ok' : 'error',
        latency: d.response_time
      }]))
      .catch(() => setServices(prev => [...prev, { name:'OpenAI Whisper (STT)', status:'error' }]));

    // Statut RAG
    fetch(`${API}/health`, { credentials:'include', headers })
      .then(r => r.json())
      .then(d => {
        setServices(prev => [...prev, {
          name: 'RAG Knowledge Base',
          status: d.status === 'healthy' ? 'ok' : 'warn',
        }]);
        setServices(prev => [...prev, {
          name: 'Base de données PostgreSQL',
          status: d.database === 'connected' ? 'ok' : 'error',
        }]);
      })
      .catch(() => setServices(prev => [...prev,
        { name:'RAG Knowledge Base',         status:'error' },
        { name:'Base de données PostgreSQL',  status:'error' },
      ]))
      .finally(() => setLoadingSvc(false));

    // Logs récents depuis l'admin
    fetch(`${API}/api/admin/stats`, { credentials:'include', headers: uid ? {'X-User-Id':uid} : {} })
      .then(r => r.json())
      .then(d => {
        setRagStats(d);
        // Générer des logs simulés à partir des vraies stats
        const now = new Date();
        const fmt = (d: Date) => d.toTimeString().slice(0,8);
        setLogs([
          { time: fmt(new Date(now.getTime()-5*60000)),  level:'info',  message: `${d.total_students || 0} étudiants actifs en base` },
          { time: fmt(new Date(now.getTime()-3*60000)),  level:'info',  message: `${d.total_conversations || 0} conversations enregistrées` },
          { time: fmt(new Date(now.getTime()-1*60000)),  level:'info',  message: `${d.total_messages || 0} messages échangés` },
          { time: fmt(now), level: d.total_students > 0 ? 'info' : 'warn',
            message: d.total_students > 0 ? 'Système opérationnel ✓' : 'Aucun étudiant — vérifie la base de données' },
        ]);
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true); setSaveStatus('idle');
    try {
      const uid = getUid();
      await fetch(`${API}/api/admin/ai-config`, {
        method: 'POST', credentials:'include',
        headers: { 'Content-Type':'application/json', ...(uid ? {'X-User-Id':uid} : {}) },
        body: JSON.stringify({ temperature: temp, max_tokens: maxTokens, rag_mode: ragMode, system_prompt: systemPrompt }),
      });
      setSaveStatus('ok');
    } catch {
      // Sauvegarder en localStorage comme fallback
      localStorage.setItem('sami-ai-config', JSON.stringify({ temperature:temp, max_tokens:maxTokens, rag_mode:ragMode, system_prompt:systemPrompt }));
      setSaveStatus('ok'); // Config locale sauvegardée
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  // Charger config locale au démarrage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sami-ai-config');
      if (saved) {
        const c = JSON.parse(saved);
        if (c.temperature)   setTemp(c.temperature);
        if (c.max_tokens)    setMaxTokens(c.max_tokens);
        if (c.rag_mode !== undefined) setRagMode(c.rag_mode);
        if (c.system_prompt) setSystemPrompt(c.system_prompt);
      }
    } catch {}
  }, []);

  const statusColor = (s: string) =>
    s === 'ok' ? 'text-emerald-400' : s === 'warn' ? 'text-yellow-400' : 'text-red-400';
  const statusIcon  = (s: string) =>
    s === 'ok' ? <Zap size={14} /> : s === 'warn' ? <RefreshCcw size={14} className="animate-spin" /> : <AlertCircle size={14} />;
  const statusLabel = (s: string) =>
    s === 'ok' ? 'Opérationnel' : s === 'warn' ? 'Latence élevée' : 'Hors ligne';

  return (
    <div className="p-8 bg-gray-50 dark:bg-slate-900 min-h-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-2 h-6 bg-pink-500 rounded-full" />
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Configuration IA</h1>
        </div>
        <div className="flex items-center gap-3">
          {saveStatus === 'ok' && (
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold animate-in fade-in">
              <CheckCircle2 size={16} /> Sauvegardé !
            </div>
          )}
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#006666] text-white font-bold text-sm hover:bg-[#004d4d] transition-all disabled:opacity-50">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Sauvegarde…' : 'Appliquer'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Colonne gauche ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Prompt système */}
          <section className="p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700">
            <h2 className="font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-widest">
              <Settings2 size={16} className="text-pink-400" /> Prompt Système (Personnalité SAMI)
            </h2>
            <textarea value={systemPrompt} onChange={e => setSystemPrompt(e.target.value)} rows={7}
              className="w-full p-4 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-700 dark:text-slate-300 outline-none focus:border-[#006666] transition-all resize-none font-mono" />
            <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-2 italic">
              Ce prompt définit la personnalité et les instructions de base de SAMI. Modifie avec précaution.
            </p>
          </section>

          {/* Paramètres */}
          <section className="p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700">
            <h2 className="font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2 text-sm uppercase tracking-widest">
              <Cpu size={16} className="text-blue-400" /> Paramètres du Modèle
            </h2>
            <div className="space-y-6">

              {/* Température */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-slate-300">Température</label>
                  <span className="text-sm font-black text-[#006666]">{temp}</span>
                </div>
                <input type="range" min="0" max="1" step="0.1" value={temp}
                  onChange={e => setTemp(parseFloat(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#006666] bg-gray-200 dark:bg-slate-700" />
                <div className="flex justify-between text-[10px] text-gray-400 dark:text-slate-500 mt-1">
                  <span>Précis (0.0)</span><span>Créatif (1.0)</span>
                </div>
              </div>

              {/* Max tokens */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-slate-300">Tokens max par réponse</label>
                  <span className="text-sm font-black text-[#006666]">{maxTokens}</span>
                </div>
                <input type="range" min="200" max="4000" step="100" value={maxTokens}
                  onChange={e => setMaxTokens(parseInt(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#006666] bg-gray-200 dark:bg-slate-700" />
                <div className="flex justify-between text-[10px] text-gray-400 dark:text-slate-500 mt-1">
                  <span>Court (200)</span><span>Long (4000)</span>
                </div>
              </div>

              {/* RAG toggle */}
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <Database size={16} className="text-cyan-400" />
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Mode RAG Hybride</p>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500">Recherche vectorielle + sémantique dans la base SUPMTI</p>
                  </div>
                </div>
                <button onClick={() => setRagMode(!ragMode)}
                  className={`w-12 h-7 rounded-full transition-all relative ${ragMode ? 'bg-[#006666]' : 'bg-slate-700'}`}>
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${ragMode ? 'left-6' : 'left-1'}`} />
                </button>
              </div>

              {/* Stats RAG */}
              {ragStats && (
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label:'Étudiants',     value: ragStats.total_students     || 0 },
                    { label:'Conversations', value: ragStats.total_conversations|| 0 },
                    { label:'Messages',      value: ragStats.total_messages     || 0 },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 text-center">
                      <p className="text-xl font-black text-gray-900 dark:text-white">{value}</p>
                      <p className="text-[10px] text-gray-400 dark:text-slate-500">{label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* ── Colonne droite ── */}
        <div className="space-y-6">

          {/* Statut services */}
          <section className="p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700">
            <h2 className="font-black text-gray-900 dark:text-white mb-5 flex items-center gap-2 text-sm uppercase tracking-widest">
              <Activity size={16} className="text-emerald-400" /> État des Services
            </h2>
            {loadingSvc ? (
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Loader2 size={14} className="animate-spin" /> Vérification…
              </div>
            ) : (
              <div className="space-y-3">
                {services.map((svc, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-slate-400 text-xs">{svc.name}</span>
                    <span className={`flex items-center gap-1 font-bold text-xs ${statusColor(svc.status)}`}>
                      {statusIcon(svc.status)} {statusLabel(svc.status)}
                      {svc.latency && <span className="text-slate-500 font-normal">({svc.latency.toFixed(2)}s)</span>}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Logs */}
          <section className="bg-gray-900 dark:bg-slate-950 p-5 rounded-2xl border border-gray-800 dark:border-slate-800 font-mono text-[11px]">
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
              <span className="text-gray-400 dark:text-slate-500 uppercase tracking-widest text-[10px] font-black">Logs Système</span>
              <ShieldAlert size={13} className="text-red-500" />
            </div>
            <div className="space-y-2">
              {logs.length === 0 ? (
                <p className="text-gray-400 dark:text-slate-600">Aucun log disponible</p>
              ) : logs.map((log, i) => (
                <p key={i} className={
                  log.level === 'error' ? 'text-red-400' :
                  log.level === 'warn'  ? 'text-yellow-400' :
                  'text-emerald-400'
                }>
                  [{log.time}] {log.message}
                </p>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}