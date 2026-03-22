// src/app/admin/students/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { Users, Search, Eye, Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
function getUid() { try { return JSON.parse(localStorage.getItem('supmti-auth')||'{}')?.state?.user?.id||''; } catch { return ''; } }

interface Student { id:string; full_name:string; email:string; average?:number; bac_type?:string; city?:string; level?:string; created_at?:string; }

export default function AdminStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [deleting, setDeleting] = useState<string|null>(null);

  const load = () => {
    setLoading(true);
    fetch(`${API}/api/admin/students`,{credentials:'include',headers:getUid()?{'X-User-Id':getUid()}:{}})
      .then(r=>r.json()).then(d=>setStudents(d.students||d||[]))
      .catch(()=>setStudents([
        {id:'1',full_name:'Yassine Mansouri',email:'yassine@test.ma',average:15.5,bac_type:'SM',city:'Meknès',level:'Terminale',created_at:'2026-03-10'},
        {id:'2',full_name:'Sarah Benali',email:'sarah@test.ma',average:13.0,bac_type:'Eco',city:'Fès',level:'1ère Bac',created_at:'2026-03-12'},
      ]))
      .finally(()=>setLoading(false));
  };

  useEffect(()=>{ load(); },[]);

  const filtered = students.filter(s=>
    s.full_name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id:string) => {
    if (!confirm('Supprimer cet étudiant ?')) return;
    setDeleting(id);
    try {
      await fetch(`${API}/api/admin/students/${id}`,{method:'DELETE',credentials:'include',headers:getUid()?{'X-User-Id':getUid()}:{}});
      setStudents(s=>s.filter(x=>x.id!==id));
    } finally { setDeleting(null); }
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-slate-900 min-h-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-2 h-6 bg-blue-500 rounded-full"/>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Étudiants</h1>
          <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold">{students.length}</span>
        </div>
      </div>

      <div className="relative mb-6">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher par nom ou email…"
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-gray-900 dark:text-white text-sm placeholder:text-gray-400 outline-none focus:border-[#006666] transition-all shadow-sm"/>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48 gap-3 text-gray-400 dark:text-slate-400">
          <Loader2 size={20} className="animate-spin"/><span>Chargement…</span>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
              <tr>
                {['Étudiant','BAC / Moyenne','Ville','Niveau','Inscrit le','Actions'].map(h=>(
                  <th key={h} className="px-5 py-3.5 text-left text-[10px] font-black text-gray-500 dark:text-slate-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-transparent divide-y divide-gray-50 dark:divide-slate-800">
              {filtered.map(s=>(
                <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#006666]/10 flex items-center justify-center text-[#006666] font-black text-sm shrink-0">
                        {s.full_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{s.full_name}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {s.bac_type && <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 text-xs font-bold">{s.bac_type}</span>}
                      {s.average  ? <span className={cn("font-bold text-xs", Number(s.average)>=14?"text-emerald-500":"Number(s.average)>=10?text-yellow-500:text-red-500")}>{s.average}/20</span>
                                  : <span className="text-gray-300 dark:text-slate-600 text-xs">—</span>}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500 dark:text-slate-400 text-xs">{s.city||'—'}</td>
                  <td className="px-5 py-4 text-gray-500 dark:text-slate-400 text-xs">{s.level||'—'}</td>
                  <td className="px-5 py-4 text-gray-400 dark:text-slate-500 text-xs">{s.created_at?.slice(0,10)||'—'}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-all">
                        <Eye size={14}/>
                      </button>
                      <button onClick={()=>handleDelete(s.id)} disabled={deleting===s.id}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-400 hover:text-red-500 transition-all disabled:opacity-50">
                        {deleting===s.id?<Loader2 size={14} className="animate-spin"/>:<Trash2 size={14}/>}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length===0 && (
                <tr><td colSpan={6} className="px-5 py-16 text-center text-gray-400 dark:text-slate-500">
                  <Users size={24} className="mx-auto mb-2 opacity-30"/>Aucun étudiant trouvé
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}