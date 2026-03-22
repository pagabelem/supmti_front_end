// src/app/admin/knowledge/page.tsx
'use client';
import { useEffect, useState, useCallback } from 'react';
import { Database, Upload, Trash2, FileText, Loader2, Plus, CheckCircle2, Search, RefreshCw, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
function getUid() { try { return JSON.parse(localStorage.getItem('supmti-auth')||'{}')?.state?.user?.id||''; } catch { return ''; } }
function headers() { const u=getUid(); return u?{'X-User-Id':u}:{}; }

interface Doc {
  id: string; title: string; source?: string;
  uploaded_at?: string; chunks_count?: number;
  file_type?: string; file_size?: number;
}

const TYPE_COLORS: Record<string,string> = {
  pdf:  'bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400',
  txt:  'bg-blue-50 dark:bg-blue-500/10 text-blue-500 dark:text-blue-400',
  docx: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 dark:text-indigo-400',
};

export default function AdminKnowledge() {
  const [docs,      setDocs]      = useState<Doc[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [success,   setSuccess]   = useState(false);
  const [title,     setTitle]     = useState('');
  const [search,    setSearch]    = useState('');
  const [deleting,  setDeleting]  = useState<string|null>(null);
  const [uploadErr, setUploadErr] = useState<string|null>(null);
  const [ragStats,  setRagStats]  = useState<{total_chunks:number; total_docs:number} | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API}/api/admin/documents`, {credentials:'include', headers:headers()})
        .then(r=>r.json()).catch(()=>null),
      fetch(`${API}/api/admin/stats`, {credentials:'include', headers:headers()})
        .then(r=>r.json()).catch(()=>null),
    ]).then(([docsData, statsData]) => {
      if (docsData) setDocs(docsData.documents || docsData || []);
      else setDocs([
        {id:'1', title:'Guide filières SUPMTI 2026',    source:'PDF interne', uploaded_at:'2026-03-01', chunks_count:12, file_type:'pdf'},
        {id:'2', title:'Frais de scolarité & bourses',  source:'Site web',    uploaded_at:'2026-03-05', chunks_count:4,  file_type:'txt'},
        {id:'3', title:'Débouchés professionnels ISI',  source:'PDF interne', uploaded_at:'2026-03-08', chunks_count:8,  file_type:'pdf'},
        {id:'4', title:'Partenariats entreprises SUPMTI', source:'Brochure',  uploaded_at:'2026-03-10', chunks_count:6,  file_type:'docx'},
      ]);
      if (statsData) {
        setRagStats({
          total_docs:   statsData.total_documents || 0,
          total_chunks: statsData.total_chunks    || 0,
        });
      }
    }).finally(()=>setLoading(false));
  }, []);

  useEffect(()=>{ load(); },[load]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!title.trim()) { setUploadErr('Renseigne un titre avant d\'uploader'); return; }
    setUploading(true); setUploadErr(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('title', title);
      const res  = await fetch(`${API}/api/admin/documents/upload`, {
        method:'POST', credentials:'include', headers:headers(), body:fd,
      });
      if (!res.ok) { setUploadErr('Erreur lors de l\'upload. Réessaie.'); return; }
      const data = await res.json().catch(()=>({}));
      const ext  = file.name.split('.').pop()?.toLowerCase() || '';
      const newDoc: Doc = data.document || {
        id: Date.now().toString(), title,
        source: file.name,
        uploaded_at: new Date().toISOString().slice(0,10),
        chunks_count: 0,
        file_type: ext,
        file_size: file.size,
      };
      setDocs(d=>[newDoc, ...d]);
      setTitle('');
      setSuccess(true);
      setTimeout(()=>setSuccess(false), 3000);
    } catch { setUploadErr('Impossible de joindre le serveur.'); }
    finally { setUploading(false); e.target.value=''; }
  };

  const handleDelete = async (id:string) => {
    if (!confirm('Supprimer ce document de la base RAG ?')) return;
    setDeleting(id);
    try {
      await fetch(`${API}/api/admin/documents/${id}`, {
        method:'DELETE', credentials:'include', headers:headers(),
      });
      setDocs(d=>d.filter(x=>x.id!==id));
    } catch { alert('Erreur lors de la suppression.'); }
    finally { setDeleting(null); }
  };

  const filtered = docs.filter(d=>
    !search ||
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    (d.source||'').toLowerCase().includes(search.toLowerCase())
  );

  const totalChunks = docs.reduce((s,d)=>s+(d.chunks_count||0), 0);

  return (
    <div className="p-8 bg-gray-50 dark:bg-slate-900 min-h-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-6 bg-cyan-500 rounded-full"/>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Base de Connaissance RAG</h1>
          </div>
          <div className="flex items-center gap-3 ml-5">
            <span className="px-2.5 py-1 rounded-full bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-bold">
              {docs.length} documents
            </span>
            <span className="px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold">
              {totalChunks} chunks indexés
            </span>
          </div>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white text-sm font-semibold transition-all shadow-sm">
          <RefreshCw size={14} className={loading?'animate-spin':''}/> Actualiser
        </button>
      </div>

      {/* Upload zone */}
      <div className={cn(
        "mb-8 p-6 rounded-2xl bg-white dark:bg-slate-800/50 border-2 border-dashed transition-all",
        uploadErr
          ? "border-red-300 dark:border-red-700"
          : success
            ? "border-emerald-300 dark:border-emerald-700"
            : "border-gray-200 dark:border-slate-600 hover:border-[#006666] dark:hover:border-[#006666]"
      )}>
        <div className="flex items-center gap-3 mb-4">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-all",
            success ? "bg-emerald-50 dark:bg-emerald-500/10" : "bg-[#006666]/10")}>
            {success
              ? <CheckCircle2 size={18} className="text-emerald-500"/>
              : <Upload size={18} className="text-[#006666]"/>
            }
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-black text-gray-900 dark:text-white">
              {success ? 'Document ajouté avec succès !' : 'Ajouter un document à la base RAG'}
            </h3>
            <p className="text-[10px] text-gray-400 dark:text-slate-500">
              PDF, TXT, DOCX · Le document sera découpé en chunks et indexé vectoriellement
            </p>
          </div>
        </div>

        {uploadErr && (
          <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl animate-in fade-in">
            <AlertCircle size={14} className="text-red-500 shrink-0"/>
            <p className="text-xs text-red-600 dark:text-red-400 font-medium">{uploadErr}</p>
            <button onClick={()=>setUploadErr(null)} className="ml-auto text-red-400 hover:text-red-600"><X size={13}/></button>
          </div>
        )}

        <div className="flex gap-3">
          <input
            value={title} onChange={e=>{ setTitle(e.target.value); setUploadErr(null); }}
            placeholder="Titre du document (ex: Guide filières SUPMTI 2026)…"
            className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-slate-500 outline-none focus:border-[#006666] transition-all"
          />
          <label className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm cursor-pointer transition-all shadow-sm shrink-0",
            uploading
              ? "bg-gray-100 dark:bg-slate-700 text-gray-400 cursor-not-allowed"
              : "bg-[#006666] text-white hover:bg-[#004d4d] shadow-[#006666]/20"
          )}>
            {uploading ? <Loader2 size={15} className="animate-spin"/> : <Plus size={15}/>}
            {uploading ? 'Indexation…' : 'Ajouter PDF/TXT'}
            <input type="file" accept=".pdf,.txt,.docx" className="hidden" onChange={handleUpload} disabled={uploading}/>
          </label>
        </div>
        {uploading && (
          <div className="flex items-center gap-2 mt-3 text-xs text-[#006666] font-medium animate-pulse">
            <Loader2 size={12} className="animate-spin"/>
            Découpage en chunks et indexation vectorielle en cours…
          </div>
        )}
      </div>

      {/* Barre de recherche */}
      {docs.length > 0 && (
        <div className="relative mb-5">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher dans les documents…"
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-slate-500 outline-none focus:border-[#006666] transition-all shadow-sm"/>
          {search && (
            <button onClick={()=>setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
              <X size={14}/>
            </button>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48 gap-3 text-gray-400 dark:text-slate-400">
          <Loader2 size={20} className="animate-spin"/><span>Chargement de la base RAG…</span>
        </div>
      ) : filtered.length === 0 && docs.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-3xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <Database size={32} className="text-gray-300 dark:text-slate-600"/>
          </div>
          <p className="text-gray-700 dark:text-slate-300 font-black text-lg mb-1">Base RAG vide</p>
          <p className="text-gray-400 dark:text-slate-500 text-sm">Ajoutez des documents PDF ou TXT pour alimenter SAMI</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400 dark:text-slate-500">
          <Search size={24} className="mx-auto mb-2 opacity-30"/>
          <p>Aucun document pour "{search}"</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(doc => {
            const ext  = doc.file_type || doc.source?.split('.').pop()?.toLowerCase() || 'pdf';
            const tc   = TYPE_COLORS[ext] || TYPE_COLORS.pdf;
            return (
              <div key={doc.id} className="group flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 hover:border-cyan-200 dark:hover:border-cyan-700/40 hover:shadow-md transition-all">

                {/* Icône type */}
                <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-black text-[10px]", tc)}>
                  {ext.toUpperCase()}
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <p className="font-black text-gray-900 dark:text-white text-sm truncate">{doc.title}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    {doc.source && (
                      <span className="text-xs text-gray-400 dark:text-slate-500 truncate max-w-[150px]">{doc.source}</span>
                    )}
                    {doc.uploaded_at && (
                      <span className="text-[10px] text-gray-300 dark:text-slate-600 border-l border-gray-200 dark:border-slate-700 pl-2">
                        {doc.uploaded_at.slice(0,10)}
                      </span>
                    )}
                    {doc.chunks_count != null && (
                      <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold border",
                        doc.chunks_count > 0
                          ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20"
                          : "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-100 dark:border-yellow-500/20"
                      )}>
                        {doc.chunks_count > 0 ? `✓ ${doc.chunks_count} chunks` : '⏳ Indexation…'}
                      </span>
                    )}
                    {doc.file_size && (
                      <span className="text-[10px] text-gray-300 dark:text-slate-600">
                        {(doc.file_size/1024).toFixed(0)} Ko
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={()=>handleDelete(doc.id)} disabled={deleting===doc.id}
                    className="p-2 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-300 dark:text-slate-500 hover:text-red-500 transition-all disabled:opacity-50">
                    {deleting===doc.id ? <Loader2 size={15} className="animate-spin"/> : <Trash2 size={15}/>}
                  </button>
                </div>
              </div>
            );
          })}

          {/* Résumé en bas */}
          <p className="text-[10px] text-gray-400 dark:text-slate-600 text-center pt-2">
            {filtered.length} document{filtered.length>1?'s':''} · {totalChunks} chunks indexés au total
          </p>
        </div>
      )}
    </div>
  );
}