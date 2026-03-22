// src/app/admin/fitscore/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Award, Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
function getUid() { try { return JSON.parse(localStorage.getItem('supmti-auth')||'{}')?.state?.user?.id||''; } catch { return ''; } }

const FILIERES = ['ISI','ME','IISIC','IISRT','FACG','MSTIC'];
const COLORS: Record<string,string> = {
  ISI:'#006666', ME:'#CC0000', IISIC:'#7c3aed',
  IISRT:'#0284c7', FACG:'#d97706', MSTIC:'#059669'
};
const BAC_TYPES = ['SM','PC','SVT','Eco','Info'];

// Radar SVG simple
function RadarChart({ data }: { data: Record<string,number> }) {
  const labels = Object.keys(data);
  const values = Object.values(data);
  const n      = labels.length;
  if (n === 0) return null;
  const cx = 120, cy = 120, r = 90;
  const points = labels.map((_, i) => {
    const angle = (i * 2 * Math.PI / n) - Math.PI / 2;
    const val   = (values[i] || 0) / 100;
    return { x: cx + r * val * Math.cos(angle), y: cy + r * val * Math.sin(angle) };
  });
  const gridPoints = (scale: number) => labels.map((_, i) => {
    const angle = (i * 2 * Math.PI / n) - Math.PI / 2;
    return `${cx + r * scale * Math.cos(angle)},${cy + r * scale * Math.sin(angle)}`;
  }).join(' ');
  const dataPath = points.map((p, i) => `${i===0?'M':'L'}${p.x},${p.y}`).join(' ') + 'Z';
  const labelPos = labels.map((_, i) => {
    const angle = (i * 2 * Math.PI / n) - Math.PI / 2;
    return { x: cx + (r+20) * Math.cos(angle), y: cy + (r+20) * Math.sin(angle) };
  });

  return (
    <svg viewBox="0 0 240 240" className="w-full max-w-[280px] mx-auto">
      {[0.25,0.5,0.75,1].map(s => (
        <polygon key={s} points={gridPoints(s)} fill="none" stroke="#334155" strokeWidth="1" />
      ))}
      {labels.map((_, i) => {
        const angle = (i * 2 * Math.PI / n) - Math.PI / 2;
        return <line key={i} x1={cx} y1={cy} x2={cx+r*Math.cos(angle)} y2={cy+r*Math.sin(angle)} stroke="#334155" strokeWidth="1" />;
      })}
      <path d={dataPath} fill="#006666" fillOpacity="0.25" stroke="#006666" strokeWidth="2" />
      {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4" fill="#006666" />)}
      {labels.map((label, i) => (
        <text key={i} x={labelPos[i].x} y={labelPos[i].y}
          textAnchor="middle" dominantBaseline="middle"
          fontSize="9" fill="#94a3b8" fontWeight="bold">{label}</text>
      ))}
    </svg>
  );
}

export default function AdminFitscore() {
  const [data,    setData]    = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selBac,  setSelBac]  = useState('SM');

  const load = () => {
    setLoading(true);
    fetch(`${API}/api/admin/analytics`, {
      credentials:'include', headers: getUid() ? {'X-User-Id':getUid()} : {}
    })
      .then(r => r.json()).then(setData)
      .catch(() => setData({
        fitscore_par_filiere: { ISI:88.2, ME:74.5, IISIC:91.3, IISRT:82.7, FACG:69.1, MSTIC:78.4 },
        fitscore_par_bac: {
          SM:  { ISI:92, IISIC:89, IISRT:85, ME:72, FACG:65, MSTIC:75 },
          PC:  { ISI:88, IISIC:85, IISRT:90, ME:70, FACG:62, MSTIC:72 },
          SVT: { ISI:75, IISIC:78, IISRT:72, ME:80, FACG:74, MSTIC:77 },
          Eco: { ISI:60, IISIC:62, IISRT:58, ME:91, FACG:88, MSTIC:85 },
          Info:{ ISI:95, IISIC:93, IISRT:88, ME:65, FACG:60, MSTIC:70 },
        },
        top_students: [
          { name:'Yassine M.', filiere:'IISIC', score:94.2, bac:'SM' },
          { name:'Sarah B.',   filiere:'ME',    score:91.8, bac:'Eco'},
          { name:'Omar T.',    filiere:'ISI',   score:89.5, bac:'PC' },
        ]
      }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const sorted = data ? Object.entries(data.fitscore_par_filiere||{})
    .sort(([,a]:any,[,b]:any) => b-a) : [];

  const radarData = data?.fitscore_par_bac?.[selBac] || {};

  return (
    <div className="p-8 bg-gray-50 dark:bg-slate-900 min-h-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-2 h-6 bg-orange-500 rounded-full" />
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">FitScore Global</h1>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white text-sm font-semibold transition-all">
          <RefreshCw size={14} className={loading?'animate-spin':''} /> Actualiser
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 gap-3 text-slate-400">
          <Loader2 size={24} className="animate-spin" /><span>Chargement…</span>
        </div>
      ) : (
        <div className="space-y-8">

          {/* Classement filières */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 size={16} className="text-orange-400" />
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Classement Filières</h3>
              </div>
              <div className="space-y-4">
                {sorted.map(([filiere, score]: any, i) => (
                  <div key={filiere} className="flex items-center gap-4">
                    <div className="flex items-center gap-2 w-8">
                      {i === 0 && <span className="text-yellow-400 text-lg">🥇</span>}
                      {i === 1 && <span className="text-slate-300 text-lg">🥈</span>}
                      {i === 2 && <span className="text-orange-400 text-lg">🥉</span>}
                      {i > 2  && <span className="text-slate-500 text-sm font-bold w-6 text-center">{i+1}</span>}
                    </div>
                    <span className="text-sm font-black text-gray-900 dark:text-white w-14">{filiere}</span>
                    <div className="flex-1 h-3 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width:`${score}%`, backgroundColor: COLORS[filiere]||'#006666' }} />
                    </div>
                    <span className="text-sm font-black w-14 text-right" style={{ color: COLORS[filiere]||'#006666' }}>
                      {score.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top étudiants */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-6">
                <Award size={16} className="text-yellow-400" />
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Top Compatibilités</h3>
              </div>
              <div className="space-y-3">
                {(data?.top_students||[]).map((s: any, i: number) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700">
                    <div className="w-9 h-9 rounded-xl bg-[#006666]/20 flex items-center justify-center text-[#006666] font-black shrink-0">
                      {s.name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{s.name}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">{s.filiere} · BAC {s.bac}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-black text-emerald-400">{s.score}%</p>
                      <p className="text-[10px] text-gray-400 dark:text-slate-500">FitScore</p>
                    </div>
                  </div>
                ))}
                {(!data?.top_students || data.top_students.length === 0) && (
                  <p className="text-slate-500 text-sm text-center py-8">Aucun FitScore calculé</p>
                )}
              </div>
            </div>
          </div>

          {/* Radar par BAC */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-purple-400" />
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Compatibilité par Type de BAC</h3>
              </div>
              <div className="flex gap-2">
                {BAC_TYPES.map(b => (
                  <button key={b} onClick={() => setSelBac(b)}
                    className={cn("px-3 py-1 rounded-lg text-xs font-bold transition-all",
                      selBac===b ? "bg-[#006666] text-white" : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white")}>
                    {b}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center gap-12">
              <RadarChart data={radarData} />
              <div className="space-y-3">
                {Object.entries(radarData).map(([filiere, val]:any) => (
                  <div key={filiere} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: COLORS[filiere]||'#006666' }} />
                    <span className="text-xs font-bold text-slate-300 w-12">{filiere}</span>
                    <div className="w-24 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width:`${val}%`, backgroundColor: COLORS[filiere]||'#006666' }} />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-slate-400">{val}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}