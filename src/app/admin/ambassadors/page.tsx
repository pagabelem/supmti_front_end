// src/app/admin/ambassadors/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { UserCheck, Plus, Trash2, ToggleLeft, ToggleRight, Loader2, Phone, Mail, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
function getUid() { try { return JSON.parse(localStorage.getItem('supmti-auth')||'{}')?.state?.user?.id||''; } catch { return ''; } }

interface Ambassadeur { id:string; nom:string; program_id:string; niveau:string; email?:string; whatsapp?:string; is_active:boolean; }

const FILIERES = ['ISI','ME','IISIC','IISRT','FACG','MSTIC'];
const FILIERE_COLORS: Record<string,string> = {
  ISI:'bg-teal-500/10 text-teal-400', ME:'bg-red-500/10 text-red-400',
  IISIC:'bg-purple-500/10 text-purple-400', IISRT:'bg-blue-500/10 text-blue-400',
  FACG:'bg-amber-500/10 text-amber-400', MSTIC:'bg-emerald-500/10 text-emerald-400',
};

export default function AdminAmbassadors() {
  const [list,     setList]     = useState<Ambassadeur[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [form,     setForm]     = useState({ nom:'', program_id:'ISI', niveau:'1ère année', email:'', whatsapp:'' });
  const [adding,   setAdding]   = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    setLoading(true);
    fetch(`${API}/api/admin/ambassadeurs`, { credentials:'include', headers: getUid()?{'X-User-Id':getUid()}:{} })
      .then(r=>r.json()).then(d=>setList(d.ambassadeurs||d||[]))
      .catch(()=>setList([
        { id:'1', nom:'Hamza Alami',   program_id:'IISIC', niveau:'2ème année', email:'hamza@supmti.ma',  whatsapp:'0600000001', is_active:true  },
        { id:'2', nom:'Nadia Chraibi', program_id:'ISI',   niveau:'3ème année', email:'nadia@supmti.ma',  whatsapp:'0600000002', is_active:true  },
        { id:'3', nom:'Mehdi Tazi',    program_id:'ME',    niveau:'1ère année', email:'mehdi@supmti.ma',  whatsapp:'',           is_active:false },
      ]))
      .finally(()=>setLoading(false));
  };

  useEffect(()=>{ load(); },[]);

  const toggleActive = async (amb: Ambassadeur) => {
    try {
      await fetch(`${API}/api/admin/ambassadeurs/${amb.id}`, {
        method:'PATCH', credentials:'include',
        headers:{'Content-Type':'application/json',...(getUid()?{'X-User-Id':getUid()}:{})},
        body: JSON.stringify({ is_active: !amb.is_active }),
      });
      setList(l=>l.map(a=>a.id===amb.id?{...a,is_active:!a.is_active}:a));
    } catch { alert('Erreur'); }
  };

  const handleAdd = async () => {
    if (!form.nom.trim()) { alert('Nom requis'); return; }
    setAdding(true);
    try {
      const res  = await fetch(`${API}/api/admin/ambassadeurs`, {
        method:'POST', credentials:'include',
        headers:{'Content-Type':'application/json',...(getUid()?{'X-User-Id':getUid()}:{})},
        body: JSON.stringify({...form, is_active:true}),
      });
      const data = await res.json().catch(()=>({}));
      setList(l=>[...l, data.ambassadeur||{id:Date.now().toString(),...form,is_active:true}]);
      setForm({nom:'',program_id:'ISI',niveau:'1ère année',email:'',whatsapp:''});
      setShowForm(false);
    } finally { setAdding(false); }
  };

  const handleDelete = async (id:string) => {
    if (!confirm('Supprimer?')) return;
    await fetch(`${API}/api/admin/ambassadeurs/${id}`,{method:'DELETE',credentials:'include',headers:getUid()?{'X-User-Id':getUid()}:{}});
    setList(l=>l.filter(a=>a.id!==id));
  };

  const actifs   = list.filter(a=>a.is_active).length;
  const inactifs = list.filter(a=>!a.is_active).length;

  return (
    <div className="p-8 bg-gray-50 dark:bg-slate-900 min-h-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-6 bg-purple-500 rounded-full" />
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Ambassadeurs</h1>
          </div>
          <div className="flex items-center gap-3 ml-5">
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">{actifs} actifs</span>
            {inactifs > 0 && <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 text-xs font-bold">{inactifs} inactifs</span>}
          </div>
        </div>
        <button onClick={()=>setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#006666] text-white font-bold text-sm hover:bg-[#004d4d] transition-all shadow-lg shadow-[#006666]/20">
          <Plus size={16}/> Ajouter un ambassadeur
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="mb-8 p-6 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
              <UserCheck size={15} className="text-purple-500"/> Nouvel ambassadeur
            </h3>
            <button onClick={()=>setShowForm(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 transition-all">
              <X size={15}/>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            {[
              {key:'nom',      label:'Nom complet *', type:'text',  placeholder:'Hamza Alami'},
              {key:'email',    label:'Email',          type:'email', placeholder:'hamza@supmti.ma'},
              {key:'whatsapp', label:'WhatsApp',       type:'text',  placeholder:'0600000000'},
            ].map(({key,label,type,placeholder})=>(
              <div key={key}>
                <label className="text-xs text-gray-500 dark:text-slate-400 font-bold mb-1.5 block uppercase">{label}</label>
                <input type={type} value={(form as any)[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))}
                  placeholder={placeholder}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white text-sm placeholder:text-gray-400 outline-none focus:border-[#006666] transition-all"/>
              </div>
            ))}
            <div>
              <label className="text-xs text-gray-500 dark:text-slate-400 font-bold mb-1.5 block uppercase">Filière</label>
              <select value={form.program_id} onChange={e=>setForm(f=>({...f,program_id:e.target.value}))}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white text-sm outline-none focus:border-[#006666] transition-all">
                {FILIERES.map(f=><option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-slate-400 font-bold mb-1.5 block uppercase">Niveau</label>
              <select value={form.niveau} onChange={e=>setForm(f=>({...f,niveau:e.target.value}))}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white text-sm outline-none focus:border-[#006666] transition-all">
                {['1ère année','2ème année','3ème année'].map(n=><option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={()=>setShowForm(false)} className="px-5 py-2 rounded-xl text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white text-sm font-bold transition-all">Annuler</button>
            <button onClick={handleAdd} disabled={adding}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#006666] text-white font-bold text-sm hover:bg-[#004d4d] transition-all disabled:opacity-50 shadow-md shadow-[#006666]/20">
              {adding?<Loader2 size={14} className="animate-spin"/>:<Plus size={14}/>} Ajouter
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48 gap-3 text-gray-400 dark:text-slate-400">
          <Loader2 size={20} className="animate-spin"/><span>Chargement…</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map(amb => (
            <div key={amb.id} className={cn(
              "group p-5 rounded-2xl border transition-all hover:shadow-md",
              amb.is_active
                ? "bg-white dark:bg-slate-800/80 border-gray-100 dark:border-slate-700 hover:border-purple-200 dark:hover:border-purple-800/40"
                : "bg-gray-50 dark:bg-slate-900/50 border-gray-100 dark:border-slate-800 opacity-60"
            )}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 font-black text-lg shadow-sm">
                    {amb.nom.charAt(0)}
                  </div>
                  <div>
                    <p className="font-black text-gray-900 dark:text-white text-sm">{amb.nom}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn("px-2 py-0.5 rounded-md text-[10px] font-black", FILIERE_COLORS[amb.program_id]||'bg-gray-100 text-gray-500')}>
                        {amb.program_id}
                      </span>
                      <span className="text-[10px] text-gray-400 dark:text-slate-500">{amb.niveau}</span>
                    </div>
                  </div>
                </div>
                <button onClick={()=>toggleActive(amb)} title={amb.is_active?'Désactiver':'Activer'}
                  className="transition-transform hover:scale-110">
                  {amb.is_active
                    ? <ToggleRight size={26} className="text-emerald-500"/>
                    : <ToggleLeft  size={26} className="text-gray-300 dark:text-slate-600"/>
                  }
                </button>
              </div>

              <div className="space-y-1.5 mb-4 pl-1">
                {amb.email    && <a href={`mailto:${amb.email}`} className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400 hover:text-[#006666] transition-colors"><Mail size={11}/>{amb.email}</a>}
                {amb.whatsapp && <a href={`https://wa.me/${amb.whatsapp}`} target="_blank" className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400 hover:text-emerald-500 transition-colors"><Phone size={11}/>{amb.whatsapp}</a>}
                {!amb.email && !amb.whatsapp && <p className="text-xs text-gray-300 dark:text-slate-600 italic">Aucun contact renseigné</p>}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700">
                <span className={cn("text-[10px] font-black px-2.5 py-1 rounded-full",
                  amb.is_active
                    ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20"
                    : "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400")}>
                  {amb.is_active ? '● ACTIF' : '● INACTIF'}
                </span>
                <button onClick={()=>handleDelete(amb.id)}
                  className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-400 dark:text-slate-500 hover:text-red-500 transition-all">
                  <Trash2 size={14}/>
                </button>
              </div>
            </div>
          ))}

          {list.length === 0 && (
            <div className="col-span-3 text-center py-16 text-gray-400 dark:text-slate-500">
              <UserCheck size={32} className="mx-auto mb-3 opacity-30"/>
              <p>Aucun ambassadeur enregistré</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}