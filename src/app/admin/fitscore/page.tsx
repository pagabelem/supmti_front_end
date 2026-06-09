/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/admin/fitscore/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Award, Loader2, RefreshCw, Crown, Target, Zap, Sparkles, Medal, Star, ArrowUp, Users, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
function getUid() { 
  try { 
    return JSON.parse(localStorage.getItem('supmti-auth')||'{}')?.state?.user?.id||''; 
  } catch { 
    return ''; 
  } 
}

const FILIERES = ['ISI','ME','IISIC','IISRT','FACG','MSTIC'];
const COLORS: Record<string,string> = {
  ISI:'#006666', ME:'#CC0000', IISIC:'#7c3aed',
  IISRT:'#0284c7', FACG:'#d97706', MSTIC:'#059669'
};
const GRADIENTS: Record<string,string> = {
  ISI:'from-teal-600 to-teal-700',
  ME:'from-red-600 to-red-700',
  IISIC:'from-purple-600 to-purple-700',
  IISRT:'from-sky-600 to-sky-700',
  FACG:'from-amber-600 to-amber-700',
  MSTIC:'from-emerald-600 to-emerald-700'
};
const BAC_TYPES = ['SM','PC','SVT','Eco','Info'];

// Radar SVG amélioré
function RadarChart({ data }: { data: Record<string,number> }) {
  const labels = Object.keys(data);
  const values = Object.values(data);
  const n = labels.length;
  if (n === 0) return null;
  const cx = 150, cy = 150, r = 110;
  const points = labels.map((_, i) => {
    const angle = (i * 2 * Math.PI / n) - Math.PI / 2;
    const val = (values[i] || 0) / 100;
    return { x: cx + r * val * Math.cos(angle), y: cy + r * val * Math.sin(angle) };
  });
  const gridPoints = (scale: number) => labels.map((_, i) => {
    const angle = (i * 2 * Math.PI / n) - Math.PI / 2;
    return `${cx + r * scale * Math.cos(angle)},${cy + r * scale * Math.sin(angle)}`;
  }).join(' ');
  const dataPath = points.map((p, i) => `${i===0?'M':'L'}${p.x},${p.y}`).join(' ') + 'Z';
  const labelPos = labels.map((_, i) => {
    const angle = (i * 2 * Math.PI / n) - Math.PI / 2;
    return { x: cx + (r+22) * Math.cos(angle), y: cy + (r+22) * Math.sin(angle) };
  });

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-[300px] mx-auto">
      <defs>
        <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#006666" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#006666" stopOpacity="0" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="url(#radarGlow)" />
      {[0.25,0.5,0.75,1].map(s => (
        <polygon key={s} points={gridPoints(s)} fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="4,4" />
      ))}
      {labels.map((_, i) => {
        const angle = (i * 2 * Math.PI / n) - Math.PI / 2;
        return <line key={i} x1={cx} y1={cy} x2={cx+r*Math.cos(angle)} y2={cy+r*Math.sin(angle)} stroke="#1e293b" strokeWidth="1.5" />;
      })}
      <path d={dataPath} fill="#006666" fillOpacity="0.3" stroke="#006666" strokeWidth="3" filter="url(#glow)" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="5" fill="#006666" stroke="#fff" strokeWidth="2" />
      ))}
      {labels.map((label, i) => (
        <text key={i} x={labelPos[i].x} y={labelPos[i].y}
          textAnchor="middle" dominantBaseline="middle"
          fontSize="11" fill="#64748b" fontWeight="bold" className="dark:fill-slate-400">
          {label}
        </text>
      ))}
    </svg>
  );
}

// Carte de statistique améliorée
function StatCard({ title, value, subtitle, icon: Icon, color, trend }: any) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/50 border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon size={128} />
      </div>
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", color.bg)}>
            <Icon size={20} className={color.text} />
          </div>
          {trend && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10">
              <ArrowUp size={10} className="text-emerald-500" />
              <span className="text-[10px] font-bold text-emerald-500">{trend}</span>
            </div>
          )}
        </div>
        <p className="text-3xl font-black text-slate-900 dark:text-white">{value}</p>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-1">{title}</p>
        {subtitle && <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

export default function AdminFitscore() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selBac, setSelBac] = useState('SM');
  const [hoveredFiliere, setHoveredFiliere] = useState<string | null>(null);

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
          { name:'Yassine M.', filiere:'IISIC', score:94.2, bac:'SM', avatar:'YM' },
          { name:'Sarah B.',   filiere:'ME',    score:91.8, bac:'Eco', avatar:'SB' },
          { name:'Omar T.',    filiere:'ISI',   score:89.5, bac:'PC', avatar:'OT' },
          { name:'Fatima E.',   filiere:'IISRT', score:87.3, bac:'SM', avatar:'FE' },
          { name:'Karim B.',    filiere:'MSTIC', score:85.9, bac:'Info', avatar:'KB' },
        ]
      }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const sorted = data ? Object.entries(data.fitscore_par_filiere||{})
    .sort(([,a]:any,[,b]:any) => b-a) : [];

  const radarData = data?.fitscore_par_bac?.[selBac] || {};
  const avgScore = sorted.length > 0 ? (sorted.reduce((acc, [,s]:any) => acc + s, 0) / sorted.length).toFixed(1) : '0';
  
  // Calcul sécurisé pour l'interprétation
  const radarEntries: Array<[string, number]> = Object.entries(radarData).map(([k, v]) => [k, Number(v)]);
  const hasRadarData = radarEntries.length > 0;
  const bestFiliere = hasRadarData ? radarEntries.sort(([,a],[,b]) => b - a)[0][0] : 'aucune';
  const bestScore = hasRadarData ? Math.max(...Object.values(radarData).map(Number)) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#006666] to-[#008888]">
        <div className="absolute inset-0 bg-white/5" />
        <div className="relative px-8 py-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Target size={28} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-black text-white tracking-tight">FitScore Analytics</h1>
                  <Sparkles size={20} className="text-yellow-300" />
                </div>
                <p className="text-emerald-100 mt-1 text-sm">Analyse des compatibilités étudiants-filières</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <p className="text-[10px] text-emerald-100 uppercase font-bold">Score Moyen Global</p>
                <p className="text-2xl font-black text-white">{avgScore}%</p>
              </div>
              <button 
                onClick={load} 
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 font-semibold text-sm"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> 
                Actualiser
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-[#006666]/20 border-t-[#006666] animate-spin" />
              <Target size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#006666] animate-pulse" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 mt-4 font-medium">Analyse des données FitScore...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Statistiques rapides */}
            <div className="grid grid-cols-4 gap-4">
              <StatCard 
                title="Total Étudiants" 
                value="1,248" 
                subtitle="Profil complété" 
                icon={Users} 
                color={{ bg: 'bg-sky-100 dark:bg-sky-500/10', text: 'text-sky-600' }}
                trend="+12%"
              />
              <StatCard 
                title="FitScore Moyen" 
                value={`${avgScore}%`} 
                subtitle="Toutes filières" 
                icon={Zap} 
                color={{ bg: 'bg-amber-100 dark:bg-amber-500/10', text: 'text-amber-600' }}
              />
              <StatCard 
                title="Meilleur Score" 
                value="94.2%" 
                subtitle="IISIC" 
                icon={Crown} 
                color={{ bg: 'bg-yellow-100 dark:bg-yellow-500/10', text: 'text-yellow-600' }}
              />
              <StatCard 
                title="Tests Complétés" 
                value="347" 
                subtitle="Psychométriques" 
                icon={CheckCircle2} 
                color={{ bg: 'bg-emerald-100 dark:bg-emerald-500/10', text: 'text-emerald-600' }}
              />
            </div>

            {/* Classement filières + Top étudiants */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Classement filières */}
              <div className="rounded-2xl bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-800/30">
                  <div className="flex items-center gap-2">
                    <BarChart3 size={18} className="text-[#006666]" />
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      Classement Filières 2026
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Score de compatibilité moyen</p>
                </div>
                <div className="p-6 space-y-4">
                  {sorted.map(([filiere, score]: any, i) => (
                    <div 
                      key={filiere} 
                      className="group cursor-pointer transition-all duration-300"
                      onMouseEnter={() => setHoveredFiliere(filiere)}
                      onMouseLeave={() => setHoveredFiliere(null)}
                    >
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-slate-100 to-white dark:from-slate-800 dark:to-slate-800/50 font-black text-sm group-hover:scale-110 transition-transform">
                          {i === 0 && <Crown size={16} className="text-yellow-500 fill-yellow-500" />}
                          {i === 1 && <Medal size={16} className="text-slate-400" />}
                          {i === 2 && <Medal size={16} className="text-amber-600" />}
                          {i > 2 && <span className="text-slate-500">{i+1}</span>}
                        </div>
                        <span className="text-sm font-bold text-slate-900 dark:text-white w-14">{filiere}</span>
                        <div className="flex-1 relative">
                          <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className={cn("h-full rounded-full transition-all duration-700 group-hover:opacity-80", 
                                hoveredFiliere === filiere && "scale-y-110"
                              )}
                              style={{ width: `${score}%`, backgroundColor: COLORS[filiere] || '#006666' }} 
                            />
                          </div>
                          <Sparkles 
                            size={10} 
                            className={cn("absolute -top-1 text-yellow-400 transition-all duration-300", 
                              hoveredFiliere === filiere ? "opacity-100 scale-100" : "opacity-0 scale-0"
                            )}
                            style={{ left: `calc(${score}% - 6px)` }}
                          />
                        </div>
                        <span className="text-sm font-black min-w-[45px] text-right" style={{ color: COLORS[filiere] || '#006666' }}>
                          {score.toFixed(1)}%
                        </span>
                      </div>
                      {hoveredFiliere === filiere && (
                        <div className="ml-12 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-[10px] text-slate-500 dark:text-slate-400 animate-in fade-in slide-in-from-top-1">
                          {score >= 85 && "🔥 Très forte compatibilité"}
                          {score >= 75 && score < 85 && "👍 Bonne compatibilité"}
                          {score < 75 && "📈 Potentiel à développer"}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Top étudiants */}
              <div className="rounded-2xl bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-800/30">
                  <div className="flex items-center gap-2">
                    <Award size={18} className="text-yellow-500" />
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      Top Compatibilités
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Profils les mieux adaptés</p>
                </div>
                <div className="p-6 space-y-3">
                  {(data?.top_students||[]).map((s: any, i: number) => (
                    <div key={i} className="group relative p-4 rounded-xl bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-100 dark:border-slate-700 hover:border-[#006666]/50 hover:shadow-lg transition-all duration-300">
                      <div className="absolute top-0 right-0 w-20 h-20 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Star size={80} />
                      </div>
                      <div className="relative flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#006666] to-[#008888] flex items-center justify-center text-white font-black text-base shadow-lg">
                            {s.avatar || s.name?.charAt(0)}
                          </div>
                          {i === 0 && (
                            <div className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                              <Crown size={10} className="text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-900 dark:text-white">{s.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded text-[9px] font-black" style={{ backgroundColor: `${COLORS[s.filiere]}20`, color: COLORS[s.filiere] }}>
                              {s.filiere}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">BAC {s.bac}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={cn("text-2xl font-black", 
                            s.score >= 90 ? "text-emerald-500" : s.score >= 80 ? "text-amber-500" : "text-slate-400"
                          )}>
                            {s.score}%
                          </div>
                          <p className="text-[10px] text-slate-400">FitScore</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Radar par BAC - Version améliorée */}
            <div className="rounded-2xl bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-800/30">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={18} className="text-purple-500" />
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      Analyse par Type de BAC
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    {BAC_TYPES.map(b => (
                      <button 
                        key={b} 
                        onClick={() => setSelBac(b)}
                        className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200",
                          selBac === b 
                            ? "bg-gradient-to-r from-[#006666] to-[#008888] text-white shadow-md" 
                            : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                        )}
                      >
                        BAC {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
                  <RadarChart data={radarData} />
                  <div className="flex-1 max-w-md space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(radarData).map(([filiere, val]: any) => (
                        <div key={filiere} className="group p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-gradient-to-r hover:from-[#006666]/5 hover:to-transparent transition-all duration-300">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${COLORS[filiere]}20` }}>
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[filiere] }} />
                              </div>
                              {val >= 85 && <Zap size={10} className="absolute -top-1 -right-1 text-yellow-500" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{filiere}</span>
                                <span className="text-xs font-black" style={{ color: COLORS[filiere] }}>{val}%</span>
                              </div>
                              <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-500 group-hover:scale-x-105" style={{ width: `${val}%`, backgroundColor: COLORS[filiere] }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 border border-blue-200 dark:border-blue-500/20">
                      <p className="text-xs text-blue-800 dark:text-blue-300">
                        <strong>📊 Interprétation :</strong> Le BAC {selBac} montre une compatibilité optimale avec 
                        {hasRadarData ? `${bestFiliere} (${bestScore}%)` : 'aucune donnée disponible'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}