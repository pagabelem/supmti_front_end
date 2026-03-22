// src/app/admin/peermatch/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { Users, Clock, CheckCircle2, XCircle, Loader2, RefreshCw, Phone, Mail, UserCheck, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
function getUid() { try { return JSON.parse(localStorage.getItem('supmti-auth')||'{}')?.state?.user?.id||''; } catch { return ''; } }
function hdrs() { const u=getUid(); return u ? {'Content-Type':'application/json','X-User-Id':u} : {'Content-Type':'application/json'}; }

interface Ambassadeur { id:string; nom:string; program_id:string; niveau:string; email?:string; whatsapp?:string; is_active:boolean; }
interface Demande {
  id:string; prenom_etudiant:string; email_etudiant:string;
  filiere:string; message:string; statut:string; created_at:string;
  ambassadeur_id?:string;
  ambassadeur_nom?:string; ambassadeur_email?:string; ambassadeur_wa?:string;
}

const STATUS_CONFIG: Record<string,{label:string,color:string,bg:string,icon:any}> = {
  en_attente: { label:'En attente',  color:'text-yellow-400',  bg:'bg-yellow-500/10 border-yellow-500/20',  icon:Clock        },
  traite:     { label:'Traité',      color:'text-emerald-400', bg:'bg-emerald-500/10 border-emerald-500/20', icon:CheckCircle2 },
  annule:     { label:'Annulé',      color:'text-red-400',     bg:'bg-red-500/10 border-red-500/20',         icon:XCircle      },
};

// ── Dropdown sélecteur ambassadeur ───────────────────────────
function AmbSelector({ demande, ambassadeurs, onAssign }: {
  demande: Demande; ambassadeurs: Ambassadeur[];
  onAssign: (demandeId:string, amb:Ambassadeur) => Promise<void>;
}) {
  const [open,      setOpen]      = useState(false);
  const [assigning, setAssigning] = useState(false);
  const actifs = ambassadeurs.filter(a => a.is_active);

  const pick = async (amb: Ambassadeur) => {
    setOpen(false); setAssigning(true);
    await onAssign(demande.id, amb);
    setAssigning(false);
  };

  return (
    <div className="relative mt-1">
      <button
        onClick={() => setOpen(o => !o)}
        disabled={assigning || demande.statut === 'annule'}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-[11px] text-gray-600 dark:text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:border-[#006666] transition-all disabled:opacity-40"
      >
        {assigning
          ? <Loader2 size={11} className="animate-spin"/>
          : <><UserCheck size={11}/> Changer</>
        }
        <ChevronDown size={11} className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-0 top-9 z-30 w-56 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          <p className="text-[9px] text-gray-400 dark:text-slate-500 px-3 py-2 border-b border-gray-100 dark:border-slate-800 uppercase font-black tracking-widest">
            Choisir un ambassadeur
          </p>
          <div className="max-h-44 overflow-y-auto">
            {actifs.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">Aucun ambassadeur actif</p>
            ) : actifs.map(a => (
              <button key={a.id} onClick={() => pick(a)}
                className={cn("w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all text-left",
                  a.id === demande.ambassadeur_id && "bg-[#006666]/10")}>
                <div className="w-6 h-6 rounded-md bg-purple-500/20 flex items-center justify-center text-purple-400 text-[10px] font-black shrink-0">
                  {a.nom.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{a.nom}</p>
                  <p className="text-[9px] text-gray-500 dark:text-slate-400">{a.program_id} · {a.niveau}</p>
                </div>
                {a.id === demande.ambassadeur_id && <CheckCircle2 size={12} className="text-[#006666] shrink-0"/>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPeermatch() {
  const [demandes,     setDemandes]     = useState<Demande[]>([]);
  const [ambassadeurs, setAmbassadeurs] = useState<Ambassadeur[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [filter,       setFilter]       = useState('');
  const [updating,     setUpdating]     = useState<string|null>(null);

  const load = () => {
    setLoading(true);
    Promise.all([
      fetch(`${API}/api/admin/peermatch`,    { credentials:'include', headers: getUid()?{'X-User-Id':getUid()}:{} }).then(r=>r.json()),
      fetch(`${API}/api/admin/ambassadeurs`, { credentials:'include', headers: getUid()?{'X-User-Id':getUid()}:{} }).then(r=>r.json()),
    ])
      .then(([pd, ad]) => {
        setDemandes(pd.demandes || pd || []);
        setAmbassadeurs(ad.ambassadeurs || ad || []);
      })
      .catch(() => {
        setDemandes([
          { id:'1', prenom_etudiant:'Yassine', email_etudiant:'yassine@test.ma', filiere:'IISIC', message:'Je voudrais avoir des retours sur la filière IA.',   statut:'en_attente', created_at:'2026-03-14T10:30:00', ambassadeur_id:'a1', ambassadeur_nom:'Hamza Alami',   ambassadeur_email:'hamza@supmti.ma',  ambassadeur_wa:'0600000001' },
          { id:'2', prenom_etudiant:'Sarah',   email_etudiant:'sarah@test.ma',   filiere:'ME',    message:'Questions sur les débouchés en management.',        statut:'traite',     created_at:'2026-03-13T14:20:00', ambassadeur_id:'a2', ambassadeur_nom:'Nadia Chraibi', ambassadeur_email:'nadia@supmti.ma',  ambassadeur_wa:'0600000002' },
          { id:'3', prenom_etudiant:'Omar',    email_etudiant:'omar@test.ma',    filiere:'ISI',   message:'Hésitation entre ISI et IISRT.',                    statut:'en_attente', created_at:'2026-03-15T09:00:00' },
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
        method:'PATCH', credentials:'include', headers: hdrs(),
        body: JSON.stringify({ statut }),
      });
      setDemandes(d => d.map(x => x.id===id ? {...x, statut} : x));
    } finally { setUpdating(null); }
  };

  const assignAmbassadeur = async (demandeId: string, amb: Ambassadeur) => {
    await fetch(`${API}/api/admin/peermatch/${demandeId}`, {
      method:'PATCH', credentials:'include', headers: hdrs(),
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
  const counts   = {
    total:      demandes.length,
    en_attente: demandes.filter(d=>d.statut==='en_attente').length,
    traite:     demandes.filter(d=>d.statut==='traite').length,
    annule:     demandes.filter(d=>d.statut==='annule').length,
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-slate-900 min-h-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-2 h-6 bg-emerald-500 rounded-full" />
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Peer Match</h1>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">{counts.total} demandes</span>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white text-sm font-semibold transition-all">
          <RefreshCw size={14} className={loading?'animate-spin':''} /> Actualiser
        </button>
      </div>

      {/* Compteurs cliquables */}
      <div className="flex gap-3 mb-6">
        {[
          { label:'Toutes',     val:'',          count:counts.total,      color:'text-gray-700 dark:text-slate-300',  bg:'bg-white dark:bg-slate-800'        },
          { label:'En attente', val:'en_attente', count:counts.en_attente, color:'text-yellow-400', bg:'bg-yellow-500/10'  },
          { label:'Traitées',   val:'traite',     count:counts.traite,     color:'text-emerald-400',bg:'bg-emerald-500/10' },
          { label:'Annulées',   val:'annule',     count:counts.annule,     color:'text-red-400',    bg:'bg-red-500/10'     },
        ].map(({ label, val, count, color, bg }) => (
          <button key={label} onClick={() => setFilter(val)}
            className={cn(`px-4 py-2 rounded-xl border text-sm font-bold transition-all`, bg,
              filter===val ? 'border-white/20 scale-105' : 'border-gray-200 dark:border-slate-700 hover:opacity-80')}>
            <span className={`font-black mr-1.5 ${color}`}>{count}</span>
            <span className="text-gray-500 dark:text-slate-400">{label}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48 gap-3 text-slate-400">
          <Loader2 size={20} className="animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              <Users size={32} className="mx-auto mb-3 opacity-30" />
              <p>Aucune demande PeerMatch</p>
            </div>
          )}
          {filtered.map(d => {
            const cfg  = STATUS_CONFIG[d.statut] || STATUS_CONFIG.en_attente;
            const Icon = cfg.icon;
            return (
              <div key={d.id} className="p-5 rounded-2xl bg-white dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#006666]/20 flex items-center justify-center text-[#006666] font-black shrink-0">
                      {d.prenom_etudiant?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap mb-1">
                        <p className="font-bold text-gray-900 dark:text-white">{d.prenom_etudiant}</p>
                        <span className="px-2 py-0.5 rounded-md bg-[#006666]/20 text-[#006666] text-[10px] font-black">{d.filiere}</span>
                        <span className={cn("flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-black", cfg.bg, cfg.color)}>
                          <Icon size={10} /> {cfg.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">{d.email_etudiant}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-700 dark:text-slate-300 italic">"{d.message}"</p>

                      {/* Zone ambassadeur */}
                      <div className="flex items-center gap-4 mt-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700">
                        {d.ambassadeur_nom ? (
                          <>
                            <div>
                              <p className="text-[10px] text-gray-400 dark:text-slate-500 uppercase font-black mb-0.5">Ambassadeur assigné</p>
                              <p className="text-sm font-bold text-gray-900 dark:text-white">{d.ambassadeur_nom}</p>
                            </div>
                            <div className="flex items-center gap-3 ml-auto flex-wrap">
                              {d.ambassadeur_email && (
                                <a href={`mailto:${d.ambassadeur_email}`} className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors">
                                  <Mail size={12} /> {d.ambassadeur_email}
                                </a>
                              )}
                              {d.ambassadeur_wa && (
                                <a href={`https://wa.me/${d.ambassadeur_wa}`} target="_blank" className="flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-400 transition-colors">
                                  <Phone size={12} /> {d.ambassadeur_wa}
                                </a>
                              )}
                              {/* Bouton changer */}
                              <AmbSelector demande={d} ambassadeurs={ambassadeurs} onAssign={assignAmbassadeur} />
                            </div>
                          </>
                        ) : (
                          /* Aucun ambassadeur — bouton assigner */
                          <div className="w-full">
                            <p className="text-[10px] text-gray-400 dark:text-slate-500 uppercase font-black mb-2">Ambassadeur assigné</p>
                            <AmbSelector demande={d} ambassadeurs={ambassadeurs} onAssign={assignAmbassadeur} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <p className="text-[10px] text-gray-400 dark:text-slate-500 text-right">{d.created_at?.slice(0,10)}</p>
                    {d.statut === 'en_attente' && (
                      <div className="flex gap-2">
                        <button onClick={() => updateStatut(d.id,'traite')} disabled={updating===d.id}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-all disabled:opacity-50">
                          {updating===d.id ? <Loader2 size={12} className="animate-spin"/> : 'Traiter'}
                        </button>
                        <button onClick={() => updateStatut(d.id,'annule')} disabled={updating===d.id}
                          className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-all disabled:opacity-50">
                          Annuler
                        </button>
                      </div>
                    )}
                    {d.statut === 'traite' && (
                      <button onClick={() => updateStatut(d.id,'en_attente')} disabled={updating===d.id}
                        className="px-3 py-1.5 rounded-lg bg-slate-700 text-gray-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-600 transition-all disabled:opacity-50">
                        Rouvrir
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}