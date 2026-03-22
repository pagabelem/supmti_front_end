// src/app/admin/analytics/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Users, Globe, Loader2, Brain, PieChart } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
function getUid() { try { return JSON.parse(localStorage.getItem('supmti-auth')||'{}')?.state?.user?.id||''; } catch { return ''; } }

const COLORS_FILIERES: Record<string,string> = {
  ISI:'#006666', ME:'#CC0000', IISIC:'#7c3aed', IISRT:'#0284c7', FACG:'#d97706', MSTIC:'#059669'
};
const BAC_COLORS = ['#006666','#CC0000','#7c3aed','#0284c7','#d97706','#059669'];

function PieChartSVG({ data }: { data: Record<string,number> }) {
  const entries = Object.entries(data);
  const total   = entries.reduce((s,[,v])=>s+v,0);
  if (!total) return <p className="text-gray-400 dark:text-slate-500 text-sm text-center py-8">Aucune donnée</p>;

  let cumAngle = -Math.PI/2;
  const cx=90, cy=90, r=70;
  const slices = entries.map(([label,val],i) => {
    const angle = (val/total)*2*Math.PI;
    const x1    = cx+r*Math.cos(cumAngle);
    const y1    = cy+r*Math.sin(cumAngle);
    const x2    = cx+r*Math.cos(cumAngle+angle);
    const y2    = cy+r*Math.sin(cumAngle+angle);
    const large = angle>Math.PI?1:0;
    const path  = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`;
    cumAngle   += angle;
    return { path, label, val, pct:Math.round(val/total*100), color:BAC_COLORS[i%BAC_COLORS.length] };
  });

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 180 180" className="w-40 h-40 shrink-0">
        {slices.map((s,i) => (
          <path key={i} d={s.path} fill={s.color} stroke="transparent" strokeWidth="2"/>
        ))}
      </svg>
      <div className="space-y-2">
        {slices.map((s,i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm shrink-0" style={{backgroundColor:s.color}}/>
            <span className="text-xs font-bold text-gray-700 dark:text-slate-300">{s.label}</span>
            <span className="text-xs text-gray-400 dark:text-slate-500">{s.val} ({s.pct}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminAnalytics() {
  const [data,    setData]    = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = getUid();
    fetch(`${API}/api/admin/analytics`, { credentials:'include', headers:uid?{'X-User-Id':uid}:{} })
      .then(r=>r.json()).then(setData)
      .catch(()=>setData({
        fitscore_par_filiere:  {ISI:88.2,ME:74.5,IISIC:91.3,IISRT:82.7,FACG:69.1,MSTIC:78.4},
        langues_utilisees:     {fr:72,ar:18,en:10},
        conversations_par_jour:[
          {date:'10/03',count:8},{date:'11/03',count:12},{date:'12/03',count:15},
          {date:'13/03',count:9},{date:'14/03',count:18},{date:'15/03',count:22},
        ],
        taux_profil_complet:45, moyenne_fitscore_global:81.2, test_psycho_completes:14,
        bac_distribution:{SM:4,PC:3,SVT:2,Eco:1},
        filiere_taux_admission:{ISI:78,ME:85,IISIC:72,IISRT:80,FACG:88,MSTIC:82},
      }))
      .finally(()=>setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64 gap-3 text-gray-400 dark:text-slate-400 p-8">
      <Loader2 size={24} className="animate-spin"/><span>Chargement…</span>
    </div>
  );

  const maxConv = Math.max(...(data?.conversations_par_jour||[]).map((d:any)=>d.count),1);

  // Classe commune pour les cartes
  const card = "p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 shadow-sm";
  const title = "text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest";

  return (
    <div className="p-8 space-y-8 bg-gray-50 dark:bg-slate-900 min-h-full">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-2 h-6 bg-orange-500 rounded-full"/>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Analytics</h1>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { label:'FitScore moyen',   value:`${data?.moyenne_fitscore_global?.toFixed(1)||0}%`, icon:BarChart3, color:'text-orange-500', bg:'bg-orange-50 dark:bg-orange-500/10', border:'border-orange-100 dark:border-orange-500/20' },
          { label:'Tests psycho',     value:data?.test_psycho_completes||0,                     icon:Brain,     color:'text-purple-500', bg:'bg-purple-50 dark:bg-purple-500/10', border:'border-purple-100 dark:border-purple-500/20' },
          { label:'Profils complets', value:`${data?.taux_profil_complet||0}%`,                 icon:Users,     color:'text-blue-500',   bg:'bg-blue-50 dark:bg-blue-500/10',     border:'border-blue-100 dark:border-blue-500/20'   },
        ].map(({label,value,icon:Icon,color,bg,border})=>(
          <div key={label} className={`p-6 rounded-2xl bg-white dark:bg-slate-800/50 border ${border} shadow-sm`}>
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-4`}>
              <Icon size={18} className={color}/>
            </div>
            <p className="text-3xl font-black text-gray-900 dark:text-white mb-1">{value}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* FitScore par filière */}
        <div className={card}>
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 size={16} className="text-orange-500"/>
            <h3 className={title}>FitScore par filière</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(data?.fitscore_par_filiere||{}).sort(([,a]:any,[,b]:any)=>b-a).map(([f,s]:any)=>(
              <div key={f} className="flex items-center gap-3">
                <span className="text-xs font-black text-gray-700 dark:text-slate-300 w-12">{f}</span>
                <div className="flex-1 h-3 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{width:`${s}%`,backgroundColor:COLORS_FILIERES[f]||'#006666'}}/>
                </div>
                <span className="text-xs font-bold text-gray-500 dark:text-slate-400 w-12 text-right">{s.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Camembert BAC */}
        <div className={card}>
          <div className="flex items-center gap-2 mb-6">
            <PieChart size={16} className="text-blue-500"/>
            <h3 className={title}>Répartition BAC</h3>
          </div>
          <PieChartSVG data={data?.bac_distribution||{}}/>
        </div>

        {/* Taux admission */}
        <div className={card}>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={16} className="text-emerald-500"/>
            <h3 className={title}>Taux d'admission estimé</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(data?.filiere_taux_admission||{ISI:78,ME:85,IISIC:72,IISRT:80,FACG:88,MSTIC:82})
              .sort(([,a]:any,[,b]:any)=>b-a).map(([f,t]:any)=>(
              <div key={f} className="flex items-center gap-3">
                <span className="text-xs font-black text-gray-700 dark:text-slate-300 w-12">{f}</span>
                <div className="flex-1 h-2.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{width:`${t}%`}}/>
                </div>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold w-10 text-right">{t}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Langues */}
        <div className={card}>
          <div className="flex items-center gap-2 mb-6">
            <Globe size={16} className="text-cyan-500"/>
            <h3 className={title}>Langues utilisées</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(data?.langues_utilisees||{}).map(([lang,pct]:any)=>(
              <div key={lang} className="flex items-center gap-3">
                <span className="text-lg">{lang==='fr'?'🇫🇷':lang==='ar'?'🇲🇦':'🇬🇧'}</span>
                <div className="flex-1 h-3 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{width:`${pct}%`}}/>
                </div>
                <span className="text-xs font-bold text-gray-500 dark:text-slate-400 w-8 text-right">{pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activité journalière */}
      <div className={card}>
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp size={16} className="text-emerald-500"/>
          <h3 className={title}>Activité journalière (conversations)</h3>
        </div>
        <div className="flex items-end gap-2 h-36">
          {(data?.conversations_par_jour||[]).map((d:any)=>(
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5 group">
              <span className="text-[10px] text-gray-500 dark:text-slate-400 font-bold">{d.count}</span>
              <div className="w-full bg-[#006666] group-hover:bg-emerald-500 rounded-t-lg transition-all cursor-pointer"
                style={{height:`${Math.max(4,Math.round((d.count/maxConv)*100))}%`}}/>
              <span className="text-[9px] text-gray-400 dark:text-slate-500">{d.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}