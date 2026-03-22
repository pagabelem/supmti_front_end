// src/app/admin/reports/page.tsx
'use client';
import { useState } from 'react';
import { FileText, Download, Loader2, CheckCircle2, Users, BarChart3, MessageSquare, UserCheck, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
function getUid() { try { return JSON.parse(localStorage.getItem('supmti-auth')||'{}')?.state?.user?.id||''; } catch { return ''; } }

const REPORTS = [
  { id:'students-csv',  label:'Étudiants',          desc:'Export complet des profils académiques',      icon:Users,         color:'text-blue-500',    bg:'bg-blue-50 dark:bg-blue-500/10',       border:'border-blue-100 dark:border-blue-500/20',    endpoint:'/api/admin/export/students',    filename:'etudiants_supmti.csv',    format:'csv' },
  { id:'stats-pdf',     label:'Statistiques',        desc:'Bilan global : inscriptions, FitScores, BAC', icon:BarChart3,     color:'text-orange-500',  bg:'bg-orange-50 dark:bg-orange-500/10',   border:'border-orange-100 dark:border-orange-500/20',endpoint:'/api/rapport/pdf',              filename:'rapport_stats_sami.pdf',  format:'pdf' },
  { id:'conv-csv',      label:'Conversations',       desc:'Historique des conversations anonymisées',    icon:MessageSquare, color:'text-emerald-500', bg:'bg-emerald-50 dark:bg-emerald-500/10', border:'border-emerald-100 dark:border-emerald-500/20',endpoint:'/api/admin/export/conversations',filename:'conversations_supmti.csv',format:'csv' },
  { id:'ambassad-csv',  label:'Ambassadeurs',        desc:'Contacts et filières des ambassadeurs',       icon:UserCheck,     color:'text-purple-500',  bg:'bg-purple-50 dark:bg-purple-500/10',   border:'border-purple-100 dark:border-purple-500/20',endpoint:'/api/admin/export/ambassadeurs',filename:'ambassadeurs_supmti.csv', format:'csv' },
  { id:'peermatch-csv', label:'PeerMatch',           desc:'Demandes de mise en relation et statuts',     icon:Users,         color:'text-cyan-500',    bg:'bg-cyan-50 dark:bg-cyan-500/10',       border:'border-cyan-100 dark:border-cyan-500/20',    endpoint:'/api/admin/export/peermatch',   filename:'peermatch_supmti.csv',    format:'csv' },
];

export default function AdminReports() {
  const [downloading, setDownloading] = useState<string|null>(null);
  const [done,        setDone]        = useState<string[]>([]);

  const download = async (report: typeof REPORTS[0]) => {
    setDownloading(report.id);
    try {
      const uid = getUid();
      const res = await fetch(`${API}${report.endpoint}`,{credentials:'include',headers:uid?{'X-User-Id':uid}:{}});
      if (res.ok) {
        const blob=await res.blob();
        const a=document.createElement('a');
        a.href=URL.createObjectURL(blob); a.download=report.filename; a.click();
      } else { await fallback(report); }
      setDone(d=>[...d,report.id]);
      setTimeout(()=>setDone(d=>d.filter(x=>x!==report.id)),3000);
    } catch { await fallback(report); setDone(d=>[...d,report.id]); setTimeout(()=>setDone(d=>d.filter(x=>x!==report.id)),3000); }
    finally { setDownloading(null); }
  };

  const fallback = async (report: typeof REPORTS[0]) => {
    const uid=getUid(); const h=uid?{'X-User-Id':uid,'Content-Type':'application/json'}:{'Content-Type':'application/json'};
    let csv='';
    if (report.id==='students-csv') {
      const d=await fetch(`${API}/api/admin/students`,{credentials:'include',headers:h}).then(r=>r.json()).catch(()=>({students:[]}));
      csv=['Nom,Email,Rôle,BAC,Moyenne,Ville,Niveau,Inscrit le',...(d.students||[]).map((s:any)=>[s.full_name,s.email,s.role||'',s.bac_type||'',s.average||'',s.city||'',s.level||'',s.created_at?.slice(0,10)||''].join(','))].join('\n');
    } else if (report.id==='ambassad-csv') {
      const d=await fetch(`${API}/api/admin/ambassadeurs`,{credentials:'include',headers:h}).then(r=>r.json()).catch(()=>({ambassadeurs:[]}));
      csv=['Nom,Filière,Niveau,Email,WhatsApp,Statut',...(d.ambassadeurs||[]).map((a:any)=>[a.nom,a.program_id,a.niveau,a.email||'',a.whatsapp||'',a.is_active?'Actif':'Inactif'].join(','))].join('\n');
    } else { csv='Export non disponible\n'; }
    const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'})); a.download=report.filename; a.click();
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-slate-900 min-h-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-2 h-6 bg-pink-500 rounded-full"/>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Rapports & Exports</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {REPORTS.map(report => {
          const Icon=report.icon, isDoing=downloading===report.id, isDone=done.includes(report.id);
          return (
            <div key={report.id} className={cn("group p-6 rounded-2xl bg-white dark:bg-slate-800/50 border transition-all hover:shadow-lg hover:-translate-y-0.5", report.border)}>
              <div className="flex items-start gap-4 mb-5">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform", report.bg)}>
                  <Icon size={22} className={report.color}/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-black text-gray-900 dark:text-white text-sm">{report.label}</h3>
                    <span className={cn("text-[9px] px-2 py-0.5 rounded-full font-black uppercase",
                      report.format==='pdf'
                        ? "bg-red-50 dark:bg-red-500/10 text-red-500 border border-red-100 dark:border-red-500/20"
                        : "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-500/20")}>
                      {report.format.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-slate-400">{report.desc}</p>
                </div>
              </div>
              <button onClick={()=>download(report)} disabled={!!downloading}
                className={cn("w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all",
                  isDone   ? "bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                  :isDoing ? "bg-gray-100 dark:bg-slate-700 text-gray-400 cursor-not-allowed"
                  :          `${report.bg} border ${report.border} ${report.color} hover:opacity-80 active:scale-95`)}>
                {isDoing  ? <><Loader2 size={15} className="animate-spin"/> Génération…</>
                :isDone   ? <><CheckCircle2 size={15}/> Téléchargé !</>
                :           <><Download size={15}/> Télécharger</>}
              </button>
            </div>
          );
        })}
      </div>

      <div className="p-5 rounded-2xl bg-blue-50 dark:bg-slate-800/30 border border-blue-100 dark:border-dashed dark:border-slate-700">
        <p className="text-xs text-blue-600 dark:text-slate-500 leading-relaxed">
          <span className="font-bold">ℹ️</span> Les exports CSV utilisent les données réelles de la base. Les rapports PDF nécessitent l'endpoint
          <code className="mx-1 px-1.5 py-0.5 bg-blue-100 dark:bg-slate-700 rounded text-blue-700 dark:text-slate-300">/api/rapport/pdf</code>
          dans main.py. Un CSV de substitution est généré automatiquement si l'endpoint est manquant.
        </p>
      </div>
    </div>
  );
}