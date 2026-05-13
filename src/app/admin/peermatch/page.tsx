/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
// // src/app/admin/peermatch/page.tsx
// 'use client';
// import { useEffect, useState } from 'react';
// import { Users, Clock, CheckCircle2, XCircle, Loader2, RefreshCw, Phone, Mail, UserCheck, ChevronDown } from 'lucide-react';
// import { cn } from '@/lib/utils';

// const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
// function getUid() { try { return JSON.parse(localStorage.getItem('supmti-auth')||'{}')?.state?.user?.id||''; } catch { return ''; } }
// function hdrs() { const u=getUid(); return u ? {'Content-Type':'application/json','X-User-Id':u} : {'Content-Type':'application/json'}; }

// interface Ambassadeur { id:string; nom:string; program_id:string; niveau:string; email?:string; whatsapp?:string; is_active:boolean; }
// interface Demande {
//   id:string; prenom_etudiant:string; email_etudiant:string;
//   filiere:string; message:string; statut:string; created_at:string;
//   ambassadeur_id?:string;
//   ambassadeur_nom?:string; ambassadeur_email?:string; ambassadeur_wa?:string;
// }

// const STATUS_CONFIG: Record<string,{label:string,color:string,bg:string,icon:any}> = {
//   en_attente: { label:'En attente',  color:'text-yellow-400',  bg:'bg-yellow-500/10 border-yellow-500/20',  icon:Clock        },
//   traite:     { label:'Traité',      color:'text-emerald-400', bg:'bg-emerald-500/10 border-emerald-500/20', icon:CheckCircle2 },
//   annule:     { label:'Annulé',      color:'text-red-400',     bg:'bg-red-500/10 border-red-500/20',         icon:XCircle      },
// };

// // ── Dropdown sélecteur ambassadeur ───────────────────────────
// function AmbSelector({ demande, ambassadeurs, onAssign }: {
//   demande: Demande; ambassadeurs: Ambassadeur[];
//   onAssign: (demandeId:string, amb:Ambassadeur) => Promise<void>;
// }) {
//   const [open,      setOpen]      = useState(false);
//   const [assigning, setAssigning] = useState(false);
//   const actifs = ambassadeurs.filter(a => a.is_active);

//   const pick = async (amb: Ambassadeur) => {
//     setOpen(false); setAssigning(true);
//     await onAssign(demande.id, amb);
//     setAssigning(false);
//   };

//   return (
//     <div className="relative mt-1">
//       <button
//         onClick={() => setOpen(o => !o)}
//         disabled={assigning || demande.statut === 'annule'}
//         className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-[11px] text-gray-600 dark:text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:border-[#006666] transition-all disabled:opacity-40"
//       >
//         {assigning
//           ? <Loader2 size={11} className="animate-spin"/>
//           : <><UserCheck size={11}/> Changer</>
//         }
//         <ChevronDown size={11} className={cn("transition-transform", open && "rotate-180")} />
//       </button>

//       {open && (
//         <div className="absolute left-0 top-9 z-30 w-56 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
//           <p className="text-[9px] text-gray-400 dark:text-slate-500 px-3 py-2 border-b border-gray-100 dark:border-slate-800 uppercase font-black tracking-widest">
//             Choisir un ambassadeur
//           </p>
//           <div className="max-h-44 overflow-y-auto">
//             {actifs.length === 0 ? (
//               <p className="text-xs text-slate-500 text-center py-4">Aucun ambassadeur actif</p>
//             ) : actifs.map(a => (
//               <button key={a.id} onClick={() => pick(a)}
//                 className={cn("w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all text-left",
//                   a.id === demande.ambassadeur_id && "bg-[#006666]/10")}>
//                 <div className="w-6 h-6 rounded-md bg-purple-500/20 flex items-center justify-center text-purple-400 text-[10px] font-black shrink-0">
//                   {a.nom.charAt(0)}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{a.nom}</p>
//                   <p className="text-[9px] text-gray-500 dark:text-slate-400">{a.program_id} · {a.niveau}</p>
//                 </div>
//                 {a.id === demande.ambassadeur_id && <CheckCircle2 size={12} className="text-[#006666] shrink-0"/>}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default function AdminPeermatch() {
//   const [demandes,     setDemandes]     = useState<Demande[]>([]);
//   const [ambassadeurs, setAmbassadeurs] = useState<Ambassadeur[]>([]);
//   const [loading,      setLoading]      = useState(true);
//   const [filter,       setFilter]       = useState('');
//   const [updating,     setUpdating]     = useState<string|null>(null);

//   const load = () => {
//     setLoading(true);
//     Promise.all([
//       fetch(`${API}/api/admin/peermatch`,    { credentials:'include', headers: getUid()?{'X-User-Id':getUid()}:{} }).then(r=>r.json()),
//       fetch(`${API}/api/admin/ambassadeurs`, { credentials:'include', headers: getUid()?{'X-User-Id':getUid()}:{} }).then(r=>r.json()),
//     ])
//       .then(([pd, ad]) => {
//         setDemandes(pd.demandes || pd || []);
//         setAmbassadeurs(ad.ambassadeurs || ad || []);
//       })
//       .catch(() => {
//         setDemandes([
//           { id:'1', prenom_etudiant:'Yassine', email_etudiant:'yassine@test.ma', filiere:'IISIC', message:'Je voudrais avoir des retours sur la filière IA.',   statut:'en_attente', created_at:'2026-03-14T10:30:00', ambassadeur_id:'a1', ambassadeur_nom:'Hamza Alami',   ambassadeur_email:'hamza@supmti.ma',  ambassadeur_wa:'0600000001' },
//           { id:'2', prenom_etudiant:'Sarah',   email_etudiant:'sarah@test.ma',   filiere:'ME',    message:'Questions sur les débouchés en management.',        statut:'traite',     created_at:'2026-03-13T14:20:00', ambassadeur_id:'a2', ambassadeur_nom:'Nadia Chraibi', ambassadeur_email:'nadia@supmti.ma',  ambassadeur_wa:'0600000002' },
//           { id:'3', prenom_etudiant:'Omar',    email_etudiant:'omar@test.ma',    filiere:'ISI',   message:'Hésitation entre ISI et IISRT.',                    statut:'en_attente', created_at:'2026-03-15T09:00:00' },
//         ]);
//         setAmbassadeurs([
//           { id:'a1', nom:'Hamza Alami',   program_id:'IISIC', niveau:'2ème année', email:'hamza@supmti.ma',  whatsapp:'0600000001', is_active:true  },
//           { id:'a2', nom:'Nadia Chraibi', program_id:'ME',    niveau:'3ème année', email:'nadia@supmti.ma',  whatsapp:'0600000002', is_active:true  },
//           { id:'a3', nom:'Mehdi Tazi',    program_id:'ISI',   niveau:'1ère année', email:'mehdi@supmti.ma',  whatsapp:'',           is_active:false },
//         ]);
//       })
//       .finally(() => setLoading(false));
//   };

//   useEffect(() => { load(); }, []);

//   const updateStatut = async (id: string, statut: string) => {
//     setUpdating(id);
//     try {
//       await fetch(`${API}/api/admin/peermatch/${id}`, {
//         method:'PATCH', credentials:'include', headers: hdrs(),
//         body: JSON.stringify({ statut }),
//       });
//       setDemandes(d => d.map(x => x.id===id ? {...x, statut} : x));
//     } finally { setUpdating(null); }
//   };

//   const assignAmbassadeur = async (demandeId: string, amb: Ambassadeur) => {
//     await fetch(`${API}/api/admin/peermatch/${demandeId}`, {
//       method:'PATCH', credentials:'include', headers: hdrs(),
//       body: JSON.stringify({ ambassadeur_id: amb.id }),
//     }).catch(()=>{});
//     setDemandes(d => d.map(x => x.id === demandeId ? {
//       ...x,
//       ambassadeur_id:    amb.id,
//       ambassadeur_nom:   amb.nom,
//       ambassadeur_email: amb.email,
//       ambassadeur_wa:    amb.whatsapp,
//     } : x));
//   };

//   const filtered = filter ? demandes.filter(d => d.statut === filter) : demandes;
//   const counts   = {
//     total:      demandes.length,
//     en_attente: demandes.filter(d=>d.statut==='en_attente').length,
//     traite:     demandes.filter(d=>d.statut==='traite').length,
//     annule:     demandes.filter(d=>d.statut==='annule').length,
//   };

//   return (
//     <div className="p-8 bg-gray-50 dark:bg-slate-900 min-h-full">
//       <div className="flex items-center justify-between mb-8">
//         <div className="flex items-center gap-3">
//           <div className="w-2 h-6 bg-emerald-500 rounded-full" />
//           <h1 className="text-2xl font-black text-gray-900 dark:text-white">Peer Match</h1>
//           <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">{counts.total} demandes</span>
//         </div>
//         <button onClick={load} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white text-sm font-semibold transition-all">
//           <RefreshCw size={14} className={loading?'animate-spin':''} /> Actualiser
//         </button>
//       </div>

//       {/* Compteurs cliquables */}
//       <div className="flex gap-3 mb-6">
//         {[
//           { label:'Toutes',     val:'',          count:counts.total,      color:'text-gray-700 dark:text-slate-300',  bg:'bg-white dark:bg-slate-800'        },
//           { label:'En attente', val:'en_attente', count:counts.en_attente, color:'text-yellow-400', bg:'bg-yellow-500/10'  },
//           { label:'Traitées',   val:'traite',     count:counts.traite,     color:'text-emerald-400',bg:'bg-emerald-500/10' },
//           { label:'Annulées',   val:'annule',     count:counts.annule,     color:'text-red-400',    bg:'bg-red-500/10'     },
//         ].map(({ label, val, count, color, bg }) => (
//           <button key={label} onClick={() => setFilter(val)}
//             className={cn(`px-4 py-2 rounded-xl border text-sm font-bold transition-all`, bg,
//               filter===val ? 'border-white/20 scale-105' : 'border-gray-200 dark:border-slate-700 hover:opacity-80')}>
//             <span className={`font-black mr-1.5 ${color}`}>{count}</span>
//             <span className="text-gray-500 dark:text-slate-400">{label}</span>
//           </button>
//         ))}
//       </div>

//       {loading ? (
//         <div className="flex items-center justify-center h-48 gap-3 text-slate-400">
//           <Loader2 size={20} className="animate-spin" />
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {filtered.length === 0 && (
//             <div className="text-center py-16 text-slate-500">
//               <Users size={32} className="mx-auto mb-3 opacity-30" />
//               <p>Aucune demande PeerMatch</p>
//             </div>
//           )}
//           {filtered.map(d => {
//             const cfg  = STATUS_CONFIG[d.statut] || STATUS_CONFIG.en_attente;
//             const Icon = cfg.icon;
//             return (
//               <div key={d.id} className="p-5 rounded-2xl bg-white dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all">
//                 <div className="flex items-start justify-between gap-4">
//                   <div className="flex items-start gap-4 flex-1 min-w-0">
//                     <div className="w-10 h-10 rounded-xl bg-[#006666]/20 flex items-center justify-center text-[#006666] font-black shrink-0">
//                       {d.prenom_etudiant?.charAt(0)}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-3 flex-wrap mb-1">
//                         <p className="font-bold text-gray-900 dark:text-white">{d.prenom_etudiant}</p>
//                         <span className="px-2 py-0.5 rounded-md bg-[#006666]/20 text-[#006666] text-[10px] font-black">{d.filiere}</span>
//                         <span className={cn("flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-black", cfg.bg, cfg.color)}>
//                           <Icon size={10} /> {cfg.label}
//                         </span>
//                       </div>
//                       <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">{d.email_etudiant}</p>
//                       <p className="text-sm text-gray-600 dark:text-gray-700 dark:text-slate-300 italic">"{d.message}"</p>

//                       {/* Zone ambassadeur */}
//                       <div className="flex items-center gap-4 mt-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700">
//                         {d.ambassadeur_nom ? (
//                           <>
//                             <div>
//                               <p className="text-[10px] text-gray-400 dark:text-slate-500 uppercase font-black mb-0.5">Ambassadeur assigné</p>
//                               <p className="text-sm font-bold text-gray-900 dark:text-white">{d.ambassadeur_nom}</p>
//                             </div>
//                             <div className="flex items-center gap-3 ml-auto flex-wrap">
//                               {d.ambassadeur_email && (
//                                 <a href={`mailto:${d.ambassadeur_email}`} className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors">
//                                   <Mail size={12} /> {d.ambassadeur_email}
//                                 </a>
//                               )}
//                               {d.ambassadeur_wa && (
//                                 <a href={`https://wa.me/${d.ambassadeur_wa}`} target="_blank" className="flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-400 transition-colors">
//                                   <Phone size={12} /> {d.ambassadeur_wa}
//                                 </a>
//                               )}
//                               {/* Bouton changer */}
//                               <AmbSelector demande={d} ambassadeurs={ambassadeurs} onAssign={assignAmbassadeur} />
//                             </div>
//                           </>
//                         ) : (
//                           /* Aucun ambassadeur — bouton assigner */
//                           <div className="w-full">
//                             <p className="text-[10px] text-gray-400 dark:text-slate-500 uppercase font-black mb-2">Ambassadeur assigné</p>
//                             <AmbSelector demande={d} ambassadeurs={ambassadeurs} onAssign={assignAmbassadeur} />
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Actions */}
//                   <div className="flex flex-col gap-2 shrink-0">
//                     <p className="text-[10px] text-gray-400 dark:text-slate-500 text-right">{d.created_at?.slice(0,10)}</p>
//                     {d.statut === 'en_attente' && (
//                       <div className="flex gap-2">
//                         <button onClick={() => updateStatut(d.id,'traite')} disabled={updating===d.id}
//                           className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-all disabled:opacity-50">
//                           {updating===d.id ? <Loader2 size={12} className="animate-spin"/> : 'Traiter'}
//                         </button>
//                         <button onClick={() => updateStatut(d.id,'annule')} disabled={updating===d.id}
//                           className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-all disabled:opacity-50">
//                           Annuler
//                         </button>
//                       </div>
//                     )}
//                     {d.statut === 'traite' && (
//                       <button onClick={() => updateStatut(d.id,'en_attente')} disabled={updating===d.id}
//                         className="px-3 py-1.5 rounded-lg bg-slate-700 text-white dark:text-slate-300 text-xs font-bold hover:bg-slate-600 transition-all disabled:opacity-50">
//                         Rouvrir
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }









// src/app/admin/peermatch/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { Users, Clock, CheckCircle2, XCircle, Loader2, RefreshCw, Phone, Mail, UserCheck, ChevronDown, ChevronLeft, ChevronRight, Star, Calendar, MessageCircle, Sparkles, Award, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
function getUid() { 
  try { 
    return JSON.parse(localStorage.getItem('supmti-auth')||'{}')?.state?.user?.id||''; 
  } catch { 
    return ''; 
  } 
}

// CORRECTION : La fonction hdrs retourne toujours un objet avec des propriétés définies
function hdrs(): Record<string, string> {
  const uid = getUid();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (uid) {
    headers['X-User-Id'] = uid;
  }
  return headers;
}

interface Ambassadeur { id:string; nom:string; program_id:string; niveau:string; email?:string; whatsapp?:string; is_active:boolean; }
interface Demande {
  id:string; prenom_etudiant:string; email_etudiant:string;
  filiere:string; message:string; statut:string; created_at:string;
  ambassadeur_id?:string;
  ambassadeur_nom?:string; ambassadeur_email?:string; ambassadeur_wa?:string;
}

const STATUS_CONFIG: Record<string,{label:string,color:string,bg:string,badgeBg:string,icon:any,gradient:string}> = {
  en_attente: { 
    label:'En attente',  
    color:'text-amber-400',  
    bg:'bg-amber-500/10', 
    badgeBg:'bg-amber-500/20 border-amber-500/30',
    icon:Clock,
    gradient:'from-amber-500/5 to-transparent'
  },
  traite: { 
    label:'Traité',      
    color:'text-emerald-400', 
    bg:'bg-emerald-500/10', 
    badgeBg:'bg-emerald-500/20 border-emerald-500/30',
    icon:CheckCircle2,
    gradient:'from-emerald-500/5 to-transparent'
  },
  annule: { 
    label:'Annulé',      
    color:'text-red-400',     
    bg:'bg-red-500/10', 
    badgeBg:'bg-red-500/20 border-red-500/30',
    icon:XCircle,
    gradient:'from-red-500/5 to-transparent'
  },
};

// ── Dropdown sélecteur ambassadeur premium ──────────────────
function AmbSelector({ demande, ambassadeurs, onAssign }: {
  demande: Demande; ambassadeurs: Ambassadeur[];
  onAssign: (demandeId:string, amb:Ambassadeur) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const actifs = ambassadeurs.filter(a => a.is_active);

  const pick = async (amb: Ambassadeur) => {
    setOpen(false); setAssigning(true);
    await onAssign(demande.id, amb);
    setAssigning(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        disabled={assigning || demande.statut === 'annule'}
        className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-br from-slate-100 to-white dark:from-slate-800 dark:to-slate-800/50 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:border-[#006666] hover:shadow-md transition-all duration-300 disabled:opacity-40"
      >
        {assigning
          ? <Loader2 size={12} className="animate-spin text-[#006666]"/>
          : <><UserCheck size={12} className="text-[#006666]"/> <span>Changer</span></>
        }
        <ChevronDown size={10} className={cn("transition-transform duration-300", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-3 bg-gradient-to-r from-[#006666]/5 to-transparent border-b border-slate-200 dark:border-slate-800">
              <p className="text-[10px] font-black uppercase tracking-wider text-[#006666]">👥 Équipe d'ambassadeurs</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Sélectionnez un référent pour cette demande</p>
            </div>
            <div className="max-h-64 overflow-y-auto custom-scrollbar">
              {actifs.length === 0 ? (
                <div className="text-center py-8">
                  <Users size={24} className="mx-auto mb-2 text-slate-400 opacity-30" />
                  <p className="text-xs text-slate-500">Aucun ambassadeur actif</p>
                </div>
              ) : actifs.map((a, idx) => (
                <button key={a.id} onClick={() => pick(a)}
                  className={cn("w-full flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-[#006666]/5 hover:to-transparent transition-all duration-200 text-left border-b border-slate-100 dark:border-slate-800 last:border-0 group",
                    a.id === demande.ambassadeur_id && "bg-gradient-to-r from-[#006666]/10 to-transparent")}>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#006666] to-[#008888] flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {a.nom.charAt(0)}
                    </div>
                    {a.id === demande.ambassadeur_id && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 size={10} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#006666] transition-colors truncate">
                      {a.nom}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono font-bold text-[#006666] bg-[#006666]/10 px-1.5 py-0.5 rounded">
                        {a.program_id}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        {a.niveau}
                      </span>
                    </div>
                  </div>
                  <Sparkles size={12} className="text-[#006666] opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Composant de pagination premium ─────────────────────────
function Pagination({ currentPage, totalPages, onPageChange }: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800 mt-6">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Page <span className="font-bold text-[#006666]">{currentPage}</span> sur <span className="font-bold">{totalPages}</span>
      </p>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-[#006666] hover:text-[#006666] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
        >
          <ChevronLeft size={16} />
        </button>
        
        {getPageNumbers().map((page, idx) => (
          page === '...' ? (
            <span key={`dots-${idx}`} className="px-2 text-slate-400">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={cn(
                "min-w-[36px] h-9 px-3 rounded-lg font-semibold text-sm transition-all duration-200",
                currentPage === page
                  ? "bg-gradient-to-r from-[#006666] to-[#008888] text-white shadow-lg shadow-[#006666]/20"
                  : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-[#006666] hover:text-[#006666]"
              )}
            >
              {page}
            </button>
          )
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-[#006666] hover:text-[#006666] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ── Carte de statistique premium ───────────────────────────
function StatCard({ label, count, color, icon: Icon, onClick, active }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative group overflow-hidden px-5 py-4 rounded-2xl transition-all duration-300 text-left",
        "bg-white dark:bg-slate-800/50 border-2",
        active 
          ? "border-[#006666] shadow-xl shadow-[#006666]/10 scale-[1.02]" 
          : "border-slate-200 dark:border-slate-700 hover:border-[#006666]/50 hover:shadow-lg"
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {count}
          </p>
        </div>
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300", 
          active ? "bg-[#006666] text-white" : "bg-slate-100 dark:bg-slate-700 text-[#006666] group-hover:bg-[#006666]/10"
        )}>
          <Icon size={22} />
        </div>
      </div>
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#006666] to-[#008888]" />
      )}
    </button>
  );
}

export default function AdminPeermatch() {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [ambassadeurs, setAmbassadeurs] = useState<Ambassadeur[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [updating, setUpdating] = useState<string|null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const load = () => {
    setLoading(true);
    Promise.all([
      fetch(`${API}/api/admin/peermatch`, { 
        credentials: 'include', 
        headers: getUid() ? { 'X-User-Id': getUid() } : {} 
      }).then(r => r.json()),
      fetch(`${API}/api/admin/ambassadeurs`, { 
        credentials: 'include', 
        headers: getUid() ? { 'X-User-Id': getUid() } : {} 
      }).then(r => r.json()),
    ])
      .then(([pd, ad]) => {
        setDemandes(pd.demandes || pd || []);
        setAmbassadeurs(ad.ambassadeurs || ad || []);
        setCurrentPage(1);
      })
      .catch(() => {
        setDemandes([
          { id:'1', prenom_etudiant:'Yassine', email_etudiant:'yassine@test.ma', filiere:'IISIC', message:'Je voudrais avoir des retours sur la filière IA.',   statut:'en_attente', created_at:'2026-03-14T10:30:00', ambassadeur_id:'a1', ambassadeur_nom:'Hamza Alami',   ambassadeur_email:'hamza@supmti.ma',  ambassadeur_wa:'0600000001' },
          { id:'2', prenom_etudiant:'Sarah',   email_etudiant:'sarah@test.ma',   filiere:'ME',    message:'Questions sur les débouchés en management.',        statut:'traite',     created_at:'2026-03-13T14:20:00', ambassadeur_id:'a2', ambassadeur_nom:'Nadia Chraibi', ambassadeur_email:'nadia@supmti.ma',  ambassadeur_wa:'0600000002' },
          { id:'3', prenom_etudiant:'Omar',    email_etudiant:'omar@test.ma',    filiere:'ISI',   message:'Hésitation entre ISI et IISRT.',                    statut:'en_attente', created_at:'2026-03-15T09:00:00' },
          { id:'4', prenom_etudiant:'Lina',    email_etudiant:'lina@test.ma',    filiere:'IISIC', message:'Comment se passe la vie associative ?',              statut:'en_attente', created_at:'2026-03-15T11:00:00' },
          { id:'5', prenom_etudiant:'Amine',   email_etudiant:'amine@test.ma',   filiere:'ME',    message:'Les stages sont-ils obligatoires ?',                statut:'traite',     created_at:'2026-03-12T16:00:00', ambassadeur_id:'a2', ambassadeur_nom:'Nadia Chraibi', ambassadeur_email:'nadia@supmti.ma',  ambassadeur_wa:'0600000002' },
          { id:'6', prenom_etudiant:'Imane',   email_etudiant:'imane@test.ma',   filiere:'ISI',   message:'Quels sont les meilleurs projets à faire ?',       statut:'annule',     created_at:'2026-03-11T09:30:00' },
        ]);
        setAmbassadeurs([
          { id:'a1', nom:'Hamza Alami',   program_id:'IISIC', niveau:'2ème année', email:'hamza@supmti.ma',  whatsapp:'0600000001', is_active:true  },
          { id:'a2', nom:'Nadia Chraibi', program_id:'ME',    niveau:'3ème année', email:'nadia@supmti.ma',  whatsapp:'0600000002', is_active:true  },
          { id:'a3', nom:'Mehdi Tazi',    program_id:'ISI',   niveau:'1ère année', email:'mehdi@supmti.ma',  whatsapp:'',           is_active:false },
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const updateStatut = async (id: string, statut: string) => {
    setUpdating(id);
    try {
      await fetch(`${API}/api/admin/peermatch/${id}`, {
        method: 'PATCH', 
        credentials: 'include', 
        headers: hdrs(),
        body: JSON.stringify({ statut }),
      });
      setDemandes(d => d.map(x => x.id===id ? {...x, statut} : x));
    } finally { setUpdating(null); }
  };

  const assignAmbassadeur = async (demandeId: string, amb: Ambassadeur) => {
    await fetch(`${API}/api/admin/peermatch/${demandeId}`, {
      method: 'PATCH', 
      credentials: 'include', 
      headers: hdrs(),
      body: JSON.stringify({ ambassadeur_id: amb.id }),
    }).catch(()=>{});
    setDemandes(d => d.map(x => x.id === demandeId ? {
      ...x,
      ambassadeur_id:    amb.id,
      ambassadeur_nom:   amb.nom,
      ambassadeur_email: amb.email,
      ambassadeur_wa:    amb.whatsapp,
    } : x));
  };

  const filtered = filter ? demandes.filter(d => d.statut === filter) : demandes;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedDemandes = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  const counts = {
    total: demandes.length,
    en_attente: demandes.filter(d=>d.statut==='en_attente').length,
    traite: demandes.filter(d=>d.statut==='traite').length,
    annule: demandes.filter(d=>d.statut==='annule').length,
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const handleFilterChange = (val: string) => {
    setFilter(val);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#006666] to-[#008888]">
        <div className="absolute inset-0 bg-[#ffffff08]" />
        <div className="relative px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Users size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight">Peer Match</h1>
                <p className="text-emerald-100 mt-1 text-sm">Gestion des demandes de matching étudiant</p>
              </div>
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

      {/* Contenu principal */}
      <div className="px-8 py-8">
        {/* Cartes statistiques */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <StatCard 
            label="Total demandes" 
            count={counts.total} 
            color="slate"
            icon={TrendingUp}
            active={filter === ''}
            onClick={() => handleFilterChange('')}
          />
          <StatCard 
            label="En attente" 
            count={counts.en_attente} 
            color="amber"
            icon={Clock}
            active={filter === 'en_attente'}
            onClick={() => handleFilterChange('en_attente')}
          />
          <StatCard 
            label="Traitées" 
            count={counts.traite} 
            color="emerald"
            icon={CheckCircle2}
            active={filter === 'traite'}
            onClick={() => handleFilterChange('traite')}
          />
          <StatCard 
            label="Annulées" 
            count={counts.annule} 
            color="red"
            icon={XCircle}
            active={filter === 'annule'}
            onClick={() => handleFilterChange('annule')}
          />
        </div>

        {/* Liste des demandes */}
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader2 size={40} className="animate-spin text-[#006666] mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400">Chargement des demandes...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedDemandes.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-800/30 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                  <Users size={48} className="mx-auto mb-4 text-slate-400 opacity-30" />
                  <p className="text-slate-500 dark:text-slate-400 font-medium">Aucune demande PeerMatch</p>
                  <p className="text-sm text-slate-400 mt-1">Les nouvelles demandes apparaîtront ici</p>
                </div>
              ) : (
                paginatedDemandes.map((d, idx) => {
                  const cfg = STATUS_CONFIG[d.statut] || STATUS_CONFIG.en_attente;
                  const Icon = cfg.icon;
                  return (
                    <div 
                      key={d.id} 
                      className="group relative overflow-hidden bg-white dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-[#006666]/50 hover:shadow-xl transition-all duration-300"
                    >
                      <div className={cn("absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none", cfg.gradient)} />
                      
                      <div className="relative p-6">
                        <div className="flex items-start gap-5">
                          {/* Avatar */}
                          <div className="relative">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#006666] to-[#008888] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                              {d.prenom_etudiant?.charAt(0).toUpperCase()}
                            </div>
                            <div className={cn("absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800", cfg.bg)}>
                              <Icon size={10} className={cn("absolute inset-0 m-auto", cfg.color)} />
                            </div>
                          </div>

                          {/* Contenu */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 flex-wrap mb-2">
                              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                {d.prenom_etudiant}
                              </h3>
                              <span className="px-2.5 py-1 rounded-lg bg-[#006666]/15 text-[#006666] text-[11px] font-black tracking-wide">
                                {d.filiere}
                              </span>
                              <span className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black", cfg.badgeBg, cfg.color)}>
                                <Icon size={10} /> {cfg.label}
                              </span>
                            </div>
                            
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-2">
                              <Mail size={12} className="text-slate-400" />
                              {d.email_etudiant}
                            </p>
                            
                            <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl border-l-4 border-[#006666]">
                              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                                <MessageCircle size={10} /> Message
                              </p>
                              <p className="text-sm text-slate-700 dark:text-slate-300 italic">
                                "{d.message}"
                              </p>
                            </div>

                            {/* Zone ambassadeur */}
                            <div className="flex items-center justify-between flex-wrap gap-4 p-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700">
                              <div className="flex items-center gap-3">
                                <Award size={20} className="text-[#006666]" />
                                <div>
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider">
                                    Ambassadeur assigné
                                  </p>
                                  {d.ambassadeur_nom ? (
                                    <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                      {d.ambassadeur_nom}
                                      <Star size={12} className="text-amber-400 fill-amber-400" />
                                    </p>
                                  ) : (
                                    <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                                      En attente d'assignation
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                {d.ambassadeur_email && (
                                  <a href={`mailto:${d.ambassadeur_email}`} 
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-[#006666] hover:text-white transition-all duration-200">
                                    <Mail size={12} /> Email
                                  </a>
                                )}
                                {d.ambassadeur_wa && (
                                  <a href={`https://wa.me/${d.ambassadeur_wa}`} target="_blank" 
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium hover:bg-emerald-500 hover:text-white transition-all duration-200">
                                    <Phone size={12} /> WhatsApp
                                  </a>
                                )}
                                <AmbSelector demande={d} ambassadeurs={ambassadeurs} onAssign={assignAmbassadeur} />
                              </div>
                            </div>
                          </div>

                          {/* Actions et date */}
                          <div className="flex flex-col items-end gap-3 shrink-0">
                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                              <Calendar size={12} />
                              {formatDate(d.created_at)}
                            </div>
                            
                            {d.statut === 'en_attente' && (
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => updateStatut(d.id, 'traite')} 
                                  disabled={updating === d.id}
                                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/20 transition-all duration-200 disabled:opacity-50"
                                >
                                  {updating === d.id ? <Loader2 size={12} className="animate-spin"/> : '✓ Traiter'}
                                </button>
                                <button 
                                  onClick={() => updateStatut(d.id, 'annule')} 
                                  disabled={updating === d.id}
                                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/20 transition-all duration-200 disabled:opacity-50"
                                >
                                  ✕ Annuler
                                </button>
                              </div>
                            )}
                            
                            {d.statut === 'traite' && (
                              <button 
                                onClick={() => updateStatut(d.id, 'en_attente')} 
                                disabled={updating === d.id}
                                className="px-3 py-1.5 rounded-lg bg-slate-600 text-white text-xs font-bold hover:bg-slate-700 transition-all duration-200 disabled:opacity-50"
                              >
                                ↺ Rouvrir
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            {/* Pagination */}
            {filtered.length > itemsPerPage && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #006666;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #008888;
        }
      `}</style>
    </div>
  );
}