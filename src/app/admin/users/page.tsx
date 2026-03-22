// src/app/admin/users/page.tsx
'use client';
import { useEffect, useState, useCallback } from 'react';
import {
  Users, Search, Plus, Trash2, Edit2, Eye, Loader2,
  ChevronLeft, ChevronRight, X, Check, Download,
  Shield, GraduationCap, Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
function getUid() {
  try { return JSON.parse(localStorage.getItem('supmti-auth') || '{}')?.state?.user?.id || ''; }
  catch { return ''; }
}
function authHeaders(): Record<string,string> {
  const uid = getUid();
  return { 'Content-Type': 'application/json', ...(uid ? { 'X-User-Id': uid } : {}) };
}

interface User {
  id: string; full_name: string; email: string; role: string;
  average?: number; bac_type?: string; city?: string;
  level?: string; created_at?: string; is_active?: boolean;
}

const BACS     = ['', 'SM', 'PC', 'SVT', 'Eco', 'Info', 'Lettres'];
const ROLES    = ['student', 'admin'];
const PER_PAGE = 8;

// ── Modal Détail / Édition ────────────────────────────────────
function UserModal({ user, onClose, onSave }: {
  user: User; onClose: () => void;
  onSave: (u: User) => Promise<void>;
}) {
  const [form,   setForm]   = useState({ ...user });
  const [saving, setSaving] = useState(false);
  const [tab,    setTab]    = useState<'detail'|'edit'>('detail');

  const handleSave = async () => {
    setSaving(true);
    await onSave(form);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-3xl w-full max-w-lg mx-4 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">

        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm",
              form.role === 'admin' ? "bg-red-500/20 text-red-400" : "bg-[#006666]/20 text-[#006666]")}>
              {form.full_name?.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-black text-gray-900 dark:text-white">{form.full_name}</p>
                <span className={cn("text-[9px] px-2 py-0.5 rounded-full font-black uppercase",
                  form.role === 'admin' ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-[#006666]/10 text-[#006666] border border-[#006666]/20")}>
                  {form.role}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-400">{form.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl text-gray-400 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-all">
            <X size={16} />
          </button>
        </div>

        <div className="flex border-b border-gray-100 dark:border-slate-800">
          {(['detail', 'edit'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={cn("flex-1 py-3 text-xs font-black uppercase tracking-widest transition-all",
                tab === t ? "text-[#006666] border-b-2 border-[#006666]" : "text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300")}>
              {t === 'detail' ? 'Détails' : 'Modifier'}
            </button>
          ))}
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {tab === 'detail' ? (
            <div className="space-y-3">
              {[
                { label: 'ID',         value: form.id },
                { label: 'Nom',        value: form.full_name },
                { label: 'Email',      value: form.email },
                { label: 'Rôle',       value: form.role },
                { label: 'BAC',        value: form.bac_type || '—' },
                { label: 'Moyenne',    value: form.average ? `${form.average}/20` : '—' },
                { label: 'Niveau',     value: form.level || '—' },
                { label: 'Ville',      value: form.city  || '—' },
                { label: 'Inscrit le', value: form.created_at?.slice(0,10) || '—' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-800">
                  <span className="text-xs text-gray-400 dark:text-slate-500 font-bold uppercase">{label}</span>
                  <span className="text-sm text-gray-900 dark:text-white font-medium max-w-[60%] text-right truncate">{value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {[
                { key:'full_name', label:'Nom complet',   type:'text'   },
                { key:'email',     label:'Email',         type:'email'  },
                { key:'average',   label:'Moyenne (/20)', type:'number' },
                { key:'level',     label:'Niveau',        type:'text'   },
                { key:'city',      label:'Ville',         type:'text'   },
              ].map(({ key, label, type }) => (
                <div key={key}>
                  <label className="text-xs text-gray-500 dark:text-slate-400 font-bold uppercase mb-1 block">{label}</label>
                  <input type={type} value={(form as any)[key] || ''}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white text-sm outline-none focus:border-[#006666] transition-all" />
                </div>
              ))}
              <div>
                <label className="text-xs text-gray-500 dark:text-slate-400 font-bold uppercase mb-1 block">Rôle</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white text-sm outline-none focus:border-[#006666] transition-all">
                  <option value="student">Étudiant</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-slate-400 font-bold uppercase mb-1 block">Type de BAC</label>
                <select value={form.bac_type || ''} onChange={e => setForm(f => ({ ...f, bac_type: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white text-sm outline-none focus:border-[#006666] transition-all">
                  {BACS.map(b => <option key={b} value={b}>{b || 'Non renseigné'}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>

        {tab === 'edit' && (
          <div className="flex gap-3 px-6 pb-6">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white text-sm font-bold transition-all">Annuler</button>
            <button onClick={handleSave} disabled={saving}
              className="flex-1 py-3 rounded-xl bg-[#006666] text-white text-sm font-black hover:bg-[#004d4d] disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Sauvegarder
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Modal Ajout ───────────────────────────────────────────────
function AddModal({ onClose, onAdd }: { onClose: () => void; onAdd: (data: any) => Promise<void> }) {
  const [role,   setRole]   = useState<'student'|'admin'>('student');
  const [form,   setForm]   = useState({ full_name:'', email:'', password:'', bac_type:'', average:'', level:'', city:'' });
  const [saving, setSaving] = useState(false);
  const [err,    setErr]    = useState('');

  const handleAdd = async () => {
    if (!form.full_name.trim() || !form.email.trim() || !form.password.trim()) {
      setErr('Nom, email et mot de passe sont obligatoires'); return;
    }
    setSaving(true); setErr('');
    try {
      await onAdd({ ...form, role });
      onClose();
    } catch (e: any) {
      setErr(e.message || 'Erreur lors de la création');
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-3xl w-full max-w-lg mx-4 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800">
          <p className="font-black text-gray-900 dark:text-white flex items-center gap-2">
            <Plus size={16} className="text-[#006666]" /> Nouvel utilisateur
          </p>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400"><X size={16} /></button>
        </div>

        {/* Toggle rôle */}
        <div className="flex gap-3 p-6 pb-0">
          <button onClick={() => setRole('student')}
            className={cn("flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 font-bold text-sm transition-all",
              role === 'student' ? "border-[#006666] bg-[#006666]/10 text-[#006666]" : "border-gray-200 dark:border-slate-700 text-gray-400 dark:text-slate-500 hover:border-gray-300 dark:hover:border-slate-600")}>
            <GraduationCap size={16} /> Étudiant
          </button>
          <button onClick={() => setRole('admin')}
            className={cn("flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 font-bold text-sm transition-all",
              role === 'admin' ? "border-red-500 bg-red-500/10 text-red-400" : "border-gray-200 dark:border-slate-700 text-gray-400 dark:text-slate-500 hover:border-gray-300 dark:hover:border-slate-600")}>
            <Shield size={16} /> Administrateur
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[55vh] overflow-y-auto">
          {err && <p className="text-red-400 text-xs bg-red-950/30 border border-red-900/30 p-3 rounded-xl">{err}</p>}

          {/* Champs communs */}
          {[
            { key:'full_name', label:'Nom complet *',   type:'text'     },
            { key:'email',     label:'Email *',         type:'email'    },
            { key:'password',  label:'Mot de passe *',  type:'password' },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label className="text-xs text-gray-500 dark:text-slate-400 font-bold uppercase mb-1 block">{label}</label>
              <input type={type} value={(form as any)[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white text-sm outline-none focus:border-[#006666] transition-all" />
            </div>
          ))}

          {/* Champs étudiant uniquement */}
          {role === 'student' && (
            <>
              <div className="pt-2 border-t border-gray-100 dark:border-slate-800">
                <p className="text-[10px] text-gray-400 dark:text-slate-500 font-black uppercase tracking-widest mb-3">Profil académique (optionnel)</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-slate-400 font-bold uppercase mb-1 block">Type de BAC</label>
                <select value={form.bac_type} onChange={e => setForm(f => ({ ...f, bac_type: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white text-sm outline-none focus:border-[#006666] transition-all">
                  {BACS.map(b => <option key={b} value={b}>{b || 'Non renseigné'}</option>)}
                </select>
              </div>
              {[
                { key:'average', label:'Moyenne (/20)', type:'number' },
                { key:'level',   label:'Niveau actuel', type:'text'   },
                { key:'city',    label:'Ville',          type:'text'   },
              ].map(({ key, label, type }) => (
                <div key={key}>
                  <label className="text-xs text-gray-500 dark:text-slate-400 font-bold uppercase mb-1 block">{label}</label>
                  <input type={type} value={(form as any)[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white text-sm outline-none focus:border-[#006666] transition-all" />
                </div>
              ))}
            </>
          )}
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-400 text-sm font-bold hover:text-white transition-all">Annuler</button>
          <button onClick={handleAdd} disabled={saving}
            className={cn("flex-1 py-3 rounded-xl text-white text-sm font-black disabled:opacity-50 flex items-center justify-center gap-2 transition-all",
              role === 'admin' ? "bg-red-600 hover:bg-red-700" : "bg-[#006666] hover:bg-[#004d4d]")}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            Créer {role === 'admin' ? 'l\'admin' : 'l\'étudiant'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page principale ───────────────────────────────────────────
export default function AdminUsersPage() {
  const [users,      setUsers]      = useState<User[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [filterBac,  setFilterBac]  = useState('');
  const [filterRole,  setFilterRole]  = useState('');
  const [filterProfil, setFilterProfil] = useState(false);
  const [page,       setPage]       = useState(1);
  const [selected,   setSelected]   = useState<User | null>(null);
  const [showAdd,    setShowAdd]    = useState(false);
  const [deleting,   setDeleting]   = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`${API}/api/admin/students`, { credentials:'include', headers: authHeaders() })
      .then(r => r.json())
      .then(d => setUsers(d.students || []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = users.filter(u => {
    const matchSearch = !search ||
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.city || '').toLowerCase().includes(search.toLowerCase());
    const matchBac  = !filterBac  || u.bac_type === filterBac;
    const matchRole   = !filterRole   || (u.role||'').toLowerCase() === filterRole.toLowerCase();
    const matchProfil = !filterProfil || (u.bac_type && u.average);
    return matchSearch && matchBac && matchRole && matchProfil;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet utilisateur définitivement ?')) return;
    setDeleting(id);
    try {
      await fetch(`${API}/api/admin/students/${id}`, { method:'DELETE', credentials:'include', headers: authHeaders() });
      setUsers(u => u.filter(x => x.id !== id));
    } finally { setDeleting(null); }
  };

  const handleSave = async (updated: User) => {
    await fetch(`${API}/api/admin/students/${updated.id}`, {
      method:'PUT', credentials:'include', headers: authHeaders(),
      body: JSON.stringify(updated),
    });
    setUsers(u => u.map(x => x.id === updated.id ? { ...x, ...updated } : x));
  };

  const handleAdd = async (form: any) => {
    const res  = await fetch(`${API}/api/auth/register`, {
      method:'POST', credentials:'include', headers: authHeaders(),
      body: JSON.stringify({ ...form, role: form.role }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.detail || 'Erreur lors de la création');
    load();
  };

  const exportCSV = () => {
    const hdrs = ['Nom','Email','Rôle','BAC','Moyenne','Ville','Niveau','Inscrit le'];
    const rows = filtered.map(u => [
      u.full_name, u.email, u.role, u.bac_type||'',
      u.average||'', u.city||'', u.level||'', u.created_at?.slice(0,10)||''
    ]);
    const csv  = [hdrs,...rows].map(r=>r.join(',')).join('\n');
    const a    = document.createElement('a');
    a.href     = URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
    a.download = 'utilisateurs_supmti.csv';
    a.click();
  };

  const hasFilters = search || filterBac || filterRole || filterProfil;

  return (
    <div className="p-8 bg-gray-50 dark:bg-slate-900 min-h-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-2 h-6 bg-blue-500 rounded-full" />
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Utilisateurs</h1>
          <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
            {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex gap-3">
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white text-sm font-semibold transition-all">
            <Download size={15} /> CSV
          </button>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#006666] text-white font-bold text-sm hover:bg-[#004d4d] transition-all">
            <Plus size={16} /> Ajouter
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Nom, email, ville…"
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-slate-500 outline-none focus:border-[#006666] transition-all" />
        </div>

        {/* Filtre rôle */}
        <select value={filterRole} onChange={e => { setFilterRole(e.target.value); setPage(1); }}
          className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white text-sm outline-none focus:border-[#006666] transition-all">
          <option value="">Tous les rôles</option>
          <option value="student">Étudiant</option>
          <option value="admin">Admin</option>
        </select>

        {/* Filtre BAC */}
        <select value={filterBac} onChange={e => { setFilterBac(e.target.value); setPage(1); }}
          className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white text-sm outline-none focus:border-[#006666] transition-all">
          <option value="">Tous les BAC</option>
          {BACS.filter(Boolean).map(b => <option key={b} value={b}>{b}</option>)}
        </select>

        {hasFilters && (
          <button onClick={() => { setSearch(''); setFilterBac(''); setFilterRole(''); setFilterProfil(false); setPage(1); }}
            className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white text-sm font-semibold flex items-center gap-2 transition-all">
            <X size={14} /> Réinitialiser
          </button>
        )}
      </div>

      {/* Compteurs rapides */}
      <div className="flex gap-3 mb-6">
        {[
          { label:'Total',        count: users.length,                          color:'text-slate-400', bg:'bg-white dark:bg-slate-800',       filterVal: ''        },
          { label:'Étudiants',    count: users.filter(u=>(u.role||'').toLowerCase()==='student').length, color:'text-[#006666]', bg:'bg-[#006666]/10', filterVal: 'student' },
          { label:'Admins',       count: users.filter(u=>(u.role||'').toLowerCase()==='admin').length,   color:'text-red-400',   bg:'bg-red-500/10',   filterVal: 'admin'   },
          { label:'Avec profil',  count: users.filter(u=>u.bac_type && u.average).length, color:'text-emerald-400', bg:'bg-emerald-500/10', filterVal: '__profil__' },
        ].map(({ label, count, color, bg, filterVal }) => (
          <button key={label}
            onClick={() => {
              if (filterVal === '__profil__') { setFilterProfil(f => !f); setPage(1); }
              else if (filterVal !== undefined) { setFilterRole(filterVal); setFilterProfil(false); setPage(1); }
            }}
            className={cn(
              `px-4 py-2 rounded-xl border transition-all`,
              bg,
              filterVal !== undefined ? 'cursor-pointer hover:opacity-80' : 'cursor-default',
              filterVal === '__profil__' && filterProfil ? 'border-emerald-500/40 scale-105' : 'border-slate-700 dark:border-slate-700',
              filterRole === filterVal && filterVal !== '__profil__' && filterVal !== '' ? 'border-white/20 scale-105' : ''
            )}>
            <span className={`text-sm font-black ${color}`}>{count}</span>
            <span className="text-xs text-gray-400 dark:text-slate-500 ml-2">{label}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-48 gap-3 text-slate-400">
          <Loader2 size={20} className="animate-spin" /><span>Chargement…</span>
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden mb-6">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                <tr>
                  {['Utilisateur','Rôle','BAC / Moyenne','Ville','Inscrit le','Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-[10px] font-black text-gray-500 dark:text-slate-400 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {paginated.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-16 text-center text-gray-400 dark:text-slate-500">
                    <Users size={24} className="mx-auto mb-2 opacity-30" />
                    Aucun utilisateur trouvé
                  </td></tr>
                ) : paginated.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0",
                          u.role === 'admin' ? "bg-red-500/20 text-red-400" : "bg-[#006666]/20 text-[#006666]")}>
                          {u.full_name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{u.full_name}</p>
                          <p className="text-xs text-gray-500 dark:text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn("px-2 py-1 rounded-lg text-[10px] font-black uppercase",
                        (u.role||'').toLowerCase() === 'admin'
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : "bg-[#006666]/10 text-[#006666] border border-[#006666]/20")}>
                        {(u.role||'').toLowerCase() === 'admin' ? '⚡ Admin' : '🎓 Étudiant'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {u.bac_type
                          ? <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 text-xs font-bold">{u.bac_type}</span>
                          : <span className="text-slate-600 text-xs">—</span>}
                        {u.average
                          ? <span className={cn("font-bold text-xs",
                              Number(u.average) >= 14 ? "text-emerald-400" : Number(u.average) >= 10 ? "text-yellow-400" : "text-red-400")}>
                              {Number(u.average).toFixed(2)}/20
                            </span>
                          : null}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 dark:text-slate-400 text-xs">{u.city || '—'}</td>
                    <td className="px-5 py-4 text-gray-400 dark:text-slate-500 text-xs">{u.created_at?.slice(0,10) || '—'}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelected(u)} title="Voir / Modifier"
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-all">
                          <Eye size={14} />
                        </button>
                        <button onClick={() => setSelected(u)} title="Modifier"
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-all">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(u.id)} disabled={deleting === u.id} title="Supprimer"
                          className="p-2 rounded-lg hover:bg-red-950/30 text-slate-400 hover:text-red-400 transition-all disabled:opacity-50">
                          {deleting === u.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400 dark:text-slate-500">
              {filtered.length === 0 ? '0' : `${(page-1)*PER_PAGE+1}–${Math.min(page*PER_PAGE, filtered.length)}`} sur {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
                className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 transition-all">
                <ChevronLeft size={16} />
              </button>
              {Array.from({length:totalPages},(_,i)=>i+1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={cn("w-9 h-9 rounded-xl text-sm font-bold transition-all",
                    p===page ? "bg-[#006666] text-white" : "bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white")}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
                className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 transition-all">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}

      {selected && <UserModal user={selected} onClose={() => setSelected(null)} onSave={handleSave} />}
      {showAdd   && <AddModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}
    </div>
  );
}