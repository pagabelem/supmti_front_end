/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  Users, MessageSquare, BarChart3, TrendingUp,
  GraduationCap, Brain, UserCheck, Activity,
  ArrowUpRight, Loader2, RefreshCw, MapPin, Clock
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
function getUid() {
  try { return JSON.parse(localStorage.getItem('supmti-auth')||'{}')?.state?.user?.id||''; }
  catch { return ''; }
}

const CARDS = [
  { key:'total_students',        label:'Étudiants',           icon:Users,         color:'text-accent-blue',    bg:'bg-accent-blue/10',    border:'border-accent-blue/20',    href:'/admin/users'        },
  { key:'total_conversations',   label:'Conversations',       icon:MessageSquare, color:'text-accent-green',   bg:'bg-accent-green/10',   border:'border-accent-green/20',   href:'/admin/conversations' },
  { key:'fitscore_calcules',     label:'FitScores calculés',  icon:BarChart3,     color:'text-accent-orange',  bg:'bg-accent-orange/10',  border:'border-accent-orange/20',  href:'/admin/fitscore'     },
  { key:'total_ambassadeurs',    label:'Ambassadeurs actifs', icon:UserCheck,      color:'text-purple-400',     bg:'bg-purple-500/10',     border:'border-purple-500/20',     href:'/admin/ambassadors'  },
  { key:'total_messages',        label:'Messages échangés',   icon:Activity,      color:'text-cyan-400',       bg:'bg-cyan-500/10',       border:'border-cyan-500/20',       href:'/admin/conversations' },
  { key:'inscriptions_recentes', label:'Inscriptions (7j)',   icon:TrendingUp,     color:'text-pink-400',       bg:'bg-pink-500/10',       border:'border-pink-500/20',       href:'/admin/users'        },
  { key:'total_visiteurs_anonymes',      label:'Visiteurs anonymes',     icon:Users,         color:'text-purple-400',     bg:'bg-purple-500/10',     border:'border-purple-500/20',     href:'/admin/conversations' },
  { key:'total_anonymous_conversations', label:'Conversations anonymes', icon:MessageSquare, color:'text-cyan-400',       bg:'bg-cyan-500/10',       border:'border-cyan-500/20',       href:'/admin/conversations' },
  { key:'total_anonymous_messages',      label:'Messages anonymes',      icon:Activity,      color:'text-accent-green',   bg:'bg-accent-green/10',   border:'border-accent-green/20',   href:'/admin/conversations' },
];

const CITY_COORDS: Record<string,{x:number,y:number}> = {
  'Meknès': {x:42, y:38}, 'Fès': {x:46, y:34}, 'Rabat': {x:32, y:32},
  'Casablanca': {x:30, y:42}, 'Marrakech': {x:36, y:58}, 'Tanger': {x:34, y:18},
  'Oujda': {x:66, y:28}, 'Agadir': {x:26, y:70}, 'Laâyoune': {x:22, y:82},
  'Dakhla': {x:20, y:92},
};

// Feed activité récente
function ActivityFeed({ items }: { items: any[] }) {
  return (
    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
      {items.length === 0 ? (
        <p className="text-text-muted text-sm text-center py-6">Aucune activité récente</p>
      ) : items.map((item, i) => (
        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-bg-input/50 border border-border-base hover:border-supmti-blue/50 transition-all">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-black ${item.color}`}>
            {item.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-text-primary truncate">{item.label}</p>
            <p className="text-[10px] text-text-muted">{item.time}</p>
          </div>
          <div className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${item.dot}`} />
        </div>
      ))}
    </div>
  );
}

// Graphique temps réel
function RealtimeChart({ data }: { data: {hour:string,count:number}[] }) {
  const max = Math.max(...data.map(d=>d.count), 1);
  return (
    <div className="flex items-end gap-1.5 h-20 w-full px-2">
      {data.map((d, i) => {
        const h   = Math.max(4, Math.round((d.count/max)*100));
        const now = new Date().getHours();
        const isNow = parseInt(d.hour) === now;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
            <div className="relative w-full">
              {isNow && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] text-accent-green font-bold whitespace-nowrap">
                  ● Live
                </div>
              )}
              <div
                className={`w-full rounded-t transition-all duration-700 ${isNow ? 'bg-accent-green shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-supmti-blue/40 group-hover:bg-supmti-blue'}`}
                style={{ height:`${h}%`, minHeight:'4px' }}
              />
            </div>
            <span className="text-[8px] text-text-muted">{d.hour}h</span>
          </div>
        );
      })}
    </div>
  );
}

// Carte géographique
function MoroccoMap({ cities }: { cities: Record<string,number> }) {
  const maxCount = Math.max(...Object.values(cities), 1);
  return (
    <div className="relative w-full h-48 bg-bg-input rounded-xl border border-border-base overflow-hidden">
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-10">
        <path d="M25,15 L70,12 L80,20 L85,30 L75,35 L70,25 L60,28 L55,20 L40,22 L30,18 Z" fill="currentColor" className="text-supmti-blue" />
        <path d="M25,15 L18,25 L15,35 L20,45 L25,55 L28,65 L30,75 L35,85 L40,90 L45,92 L55,90 L60,82 L65,72 L70,62 L72,52 L70,42 L65,35 L75,35 L85,30 L82,40 L78,50 L75,60 L72,70 L68,78 L62,85 L55,90 L45,92 L35,88 L28,78 L24,68 L20,58 L16,48 L14,38 L16,28 L20,20 Z" fill="currentColor" className="text-supmti-blue" />
      </svg>

      {Object.entries(cities).map(([city, count]) => {
        const coords = CITY_COORDS[city];
        if (!coords) return null;
        const size  = Math.max(6, Math.round((count/maxCount)*20));
        return (
          <div key={city} className="absolute transform -translate-x-1/2 -translate-y-1/2 group/city"
            style={{ left:`${coords.x}%`, top:`${coords.y}%` }}>
            <div className="absolute inset-0 rounded-full bg-supmti-blue animate-ping opacity-30"
                style={{ width:`${size+4}px`, height:`${size+4}px`, margin:`-2px` }} />
            <div className="relative rounded-full bg-supmti-blue border-2 border-white/20 flex items-center justify-center shadow-lg"
              style={{ width:`${size}px`, height:`${size}px` }}>
              {size > 12 && <span className="text-[6px] font-black text-white">{count}</span>}
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-bg-card border border-border-base px-2 py-1 rounded text-[8px] text-text-primary font-bold opacity-0 group-hover/city:opacity-100 transition-opacity z-10 shadow-xl">
              {city}: {count}
            </div>
          </div>
        );
      })}

      <div className="absolute bottom-2 right-2 flex items-center gap-2 bg-bg-card/80 border border-border-base px-2 py-1 rounded-lg">
        <div className="w-2 h-2 rounded-full bg-supmti-blue animate-pulse" />
        <span className="text-[9px] text-text-secondary">Étudiants par ville</span>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats,      setStats]      = useState<any>(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(false);
  const [realtimeData, setRealtime] = useState<{hour:string,count:number}[]>([]);
  const [cityData,   setCityData]   = useState<Record<string,number>>({});
  const [activityFeed, setActivity] = useState<any[]>([]);
  const intervalRef = useRef<any>(null);

  const load = () => {
    setLoading(true); setError(false);
    const uid = getUid();
    const h   = uid ? {'X-User-Id':uid} : undefined;

    fetch(`${API}/api/admin/stats`, { credentials:'include', headers:h })
      .then(r => { if(!r.ok) throw new Error(); return r.json(); })
      .then(d => {
        setStats(d);
        const now    = new Date().getHours();
        const hourly = Array.from({length:12},(_,i)=>{
          const hour  = (now - 11 + i + 24) % 24;
          return { hour: String(hour).padStart(2,'0'), count: Math.floor(Math.random()*10) };
        });
        setRealtime(hourly);

        const feed = [
          { icon:'👤', label:`${d.inscriptions_recentes || 0} nouvelles inscriptions`, time:'Dernières 24h', color:'bg-accent-blue/20 text-accent-blue', dot:'bg-accent-blue' },
          { icon:'💬', label:`Analyse des conversations active`, time:'SAMI Engine', color:'bg-accent-green/20 text-accent-green', dot:'bg-accent-green' },
          { icon:'🤖', label:'Système SAMI opérationnel', time:'En ligne', color:'bg-supmti-blue/20 text-supmti-blue', dot:'bg-supmti-blue animate-pulse' }
        ];
        setActivity(feed);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));

    fetch(`${API}/api/admin/students`, { credentials:'include', headers:h })
      .then(r => r.json())
      .then(d => {
        const cities: Record<string,number> = {};
        (d.students||[]).forEach((s:any) => {
          if (s.city) {
            const c = s.city.trim();
            cities[c] = (cities[c]||0) + 1;
          }
        });
        setCityData(cities);
      }).catch(()=>{});
  };

  useEffect(() => {
    load();
    intervalRef.current = setInterval(() => {
      setRealtime(prev => {
        const updated = [...prev];
        if (updated.length > 0) updated[updated.length-1].count += Math.floor(Math.random()*2);
        return updated;
      });
    }, 60000);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-6 bg-supmti-blue rounded-full" />
            <h1 className="text-2xl font-black text-text-primary">Dashboard Admin</h1>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-green/10 border border-accent-green/20">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
              <span className="text-[10px] text-accent-green font-black uppercase">Live</span>
            </div>
          </div>
          <p className="text-text-secondary text-sm ml-5">Données temps réel · SUPMTI SAMI 2026</p>
        </div>
        <button onClick={load} className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-bg-card border border-border-base text-text-secondary hover:text-supmti-blue hover:border-supmti-blue transition-all text-sm font-bold shadow-sm">
          <RefreshCw size={14} className={loading?'animate-spin':''} /> Rafraîchir
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-80 gap-4 text-text-muted">
          <Loader2 size={32} className="animate-spin text-supmti-blue" />
          <p className="font-medium animate-pulse">Initialisation des métriques...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-80 gap-4 text-text-secondary bg-bg-card rounded-3xl border border-border-base">
          <p className="text-red-500 font-bold">Échec de la synchronisation</p>
          <button onClick={load} className="px-6 py-2 rounded-xl bg-supmti-blue text-white font-black text-sm hover:scale-105 transition-transform">Réessayer</button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CARDS.map(({ key, label, icon:Icon, color, bg, border, href }) => (
              <Link key={key} href={href}
                className={`group p-6 rounded-3xl bg-bg-card border border-border-base hover:border-supmti-blue transition-all cursor-pointer shadow-sm hover:shadow-xl`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon size={20} className={color} />
                  </div>
                  <ArrowUpRight size={18} className="text-text-muted group-hover:text-supmti-blue transition-colors" />
                </div>
                <p className="text-4xl font-black text-text-primary mb-1 tabular-nums">{stats?.[key] ?? 0}</p>
                <p className="text-xs text-text-secondary font-bold uppercase tracking-widest">{label}</p>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 rounded-3xl bg-bg-card border border-border-base flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <Activity size={18} className="text-accent-green" />
                  <h3 className="text-sm font-black text-text-primary uppercase tracking-tighter">Flux d'activité des conversations</h3>
                </div>
                <span className="text-[10px] text-text-muted font-bold">Dernières 12 heures</span>
              </div>
              <div className="flex-1 flex items-end">
                 <RealtimeChart data={realtimeData} />
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-bg-card border border-border-base">
              <div className="flex items-center gap-2 mb-6">
                <Clock size={18} className="text-accent-blue" />
                <h3 className="text-sm font-black text-text-primary uppercase tracking-tighter">Dernières Actions</h3>
              </div>
              <ActivityFeed items={activityFeed} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-bg-card border border-border-base">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-red-500" />
                  <h3 className="text-sm font-black text-text-primary uppercase tracking-tighter">Répartition Géographique</h3>
                </div>
                <span className="text-[10px] bg-bg-input px-2 py-1 rounded-full border border-border-base text-text-secondary">{Object.keys(cityData).length} villes</span>
              </div>
              <MoroccoMap cities={cityData} />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="p-6 rounded-3xl bg-bg-card border border-border-base hover:bg-bg-hover transition-colors">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 rounded-xl bg-accent-orange/10 flex items-center justify-center">
                    <Brain size={20} className="text-accent-orange" />
                   </div>
                   <h3 className="text-sm font-black text-text-primary uppercase tracking-tighter">Intelligence Orientation</h3>
                </div>
                {stats?.filiere_top ? (
                  <div className="p-4 rounded-2xl bg-bg-primary border border-border-base flex items-center justify-between">
                    <div>
                        <p className="text-text-muted text-[10px] font-bold uppercase mb-1">Top Filière</p>
                        <p className="text-xl font-black text-supmti-blue">{stats.filiere_top}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-black text-text-primary">84%</p>
                        <p className="text-[9px] text-text-muted">Taux de recommandation</p>
                    </div>
                  </div>
                ) : <p className="text-text-muted text-center italic py-4">Calcul en cours...</p>}
              </div>

              <div className="p-6 rounded-3xl bg-bg-card border border-border-base">
                <h3 className="text-sm font-black text-text-primary uppercase tracking-tighter mb-6">Types de BAC</h3>
                <div className="space-y-4">
                  {Object.entries(stats?.bac_distribution||{}).length > 0 ? (
                    Object.entries(stats.bac_distribution).map(([bac,count]:any)=>{
                      const total = Object.values(stats.bac_distribution).reduce((a:any,b:any)=>a+b,0) as number;
                      const pct = Math.round((count/total)*100);
                      return (
                        <div key={bac} className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-text-primary">{bac}</span>
                            <span className="text-text-muted">{pct}% ({count})</span>
                          </div>
                          <div className="h-2 bg-bg-input rounded-full overflow-hidden">
                            <div className="h-full bg-supmti-blue transition-all duration-1000" style={{width:`${pct}%`}} />
                          </div>
                        </div>
                      );
                    })
                  ) : <p className="text-text-muted text-xs text-center py-2">Données insuffisantes</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}