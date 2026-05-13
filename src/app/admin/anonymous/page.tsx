/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
'use client';
import { useEffect, useState } from 'react';
import {
  Users, MessageSquare, Globe, Eye, Trash2, ChevronRight,
  Loader2, Search, X, User, GraduationCap, Target,
  Brain, MapPin, RefreshCw, AlertCircle, BookOpen,
  TrendingUp, Clock, Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

function getUid() {
  try { return JSON.parse(localStorage.getItem('supmti-auth')||'{}')?.state?.user?.id||''; }
  catch { return ''; }
}

function authHeaders(): Record<string, string> {
  const uid = getUid();
  return uid ? { 'X-User-Id': uid } : {} as Record<string, string>;
}

// ── Types ─────────────────────────────────────────────────────
interface AnonConv {
  id:          string;
  session_id:  string;
  started_at:  string;
  nb_messages: number;
  titre:       string;
  langue:      string;
  ip_address:  string;
  prenom:      string;
  bac:         string;
  moyenne:     string | number;
  niveau:      string;
  interets:    string[];
  est_anonyme: boolean;
}

interface AnonMessage {
  role:       string;
  content:    string;
  created_at: string;
}

interface AnonDetail {
  id:             string;
  profil_extrait: Record<string, any>;
  langue:         string;
  started_at:     string;
  messages:       AnonMessage[];
  nb_messages:    number;
}

// ── Langue flag ───────────────────────────────────────────────
const LANG_FLAGS: Record<string, string> = { fr: '🇫🇷', en: '🇬🇧', ar: '🇲🇦' };

// ── Badge profil ──────────────────────────────────────────────
const ProfileBadge = ({ label, value, icon: Icon, color }: {
  label: string; value: string; icon: any; color: string;
}) => {
  if (!value || value === '—') return null;
  return (
    <div className={cn(
      'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border',
      color
    )}>
      <Icon size={11} />
      <span className="text-text-secondary">{label} :</span>
      <span>{value}</span>
    </div>
  );
};

// ── Modal détail conversation ─────────────────────────────────
function ConvModal({
  conv, onClose, onDelete
}: {
  conv: AnonConv;
  onClose: () => void;
  onDelete: (id: string) => void;
}) {
  const [detail,   setDetail]   = useState<AnonDetail | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/admin/anonymous/${conv.id}`, {
      credentials: 'include', headers: authHeaders()
    })
      .then(r => r.json())
      .then(d => setDetail(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [conv.id]);

  const handleDelete = async () => {
    if (!confirm('Supprimer cette conversation ? Action irréversible.')) return;
    setDeleting(true);
    try {
      await fetch(`${API}/api/admin/anonymous/${conv.id}`, {
        method: 'DELETE', credentials: 'include', headers: authHeaders()
      });
      onDelete(conv.id);
      onClose();
    } catch {}
    finally { setDeleting(false); }
  };

  const profil = detail?.profil_extrait || {};

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col bg-bg-card border border-border-base rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-base bg-bg-sidebar/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <Users size={18} className="text-orange-500" />
            </div>
            <div>
              <p className="font-black text-text-primary text-sm">
                {conv.prenom !== '—' ? conv.prenom : 'Visiteur anonyme'}
              </p>
              <p className="text-[10px] text-text-muted">
                {LANG_FLAGS[conv.langue] || '🌍'} {conv.langue?.toUpperCase()} ·
                {conv.started_at} · {conv.nb_messages} messages
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all text-xs font-bold disabled:opacity-50"
            >
              {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
              Supprimer
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-bg-hover text-text-muted hover:text-text-primary transition-all"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={24} className="animate-spin text-supmti-blue" />
            </div>
          ) : (
            <div className="flex flex-col md:flex-row h-full">

              {/* Colonne gauche — Profil extrait */}
              <div className="w-full md:w-64 shrink-0 p-5 border-b md:border-b-0 md:border-r border-border-base bg-bg-sidebar/30 space-y-4">
                <div>
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-3">
                    Profil extrait par SAMI
                  </p>

                  {/* Avatar initiale */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-600/10 border border-orange-500/20 flex items-center justify-center">
                      <span className="text-xl font-black text-orange-500">
                        {profil.prenom ? profil.prenom.charAt(0).toUpperCase() : '?'}
                      </span>
                    </div>
                    <div>
                      <p className="font-black text-text-primary text-sm">
                        {profil.prenom || 'Inconnu'}
                      </p>
                      <p className="text-[10px] text-orange-500 font-bold">Visiteur anonyme</p>
                    </div>
                  </div>

                  {/* Champs profil */}
                  <div className="space-y-2">
                    {profil.bac && (
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-bg-input border border-border-base">
                        <GraduationCap size={13} className="text-blue-400 shrink-0" />
                        <div>
                          <p className="text-[9px] text-text-muted uppercase">BAC</p>
                          <p className="text-xs font-bold text-text-primary">{profil.bac}</p>
                        </div>
                      </div>
                    )}
                    {profil.moyenne && profil.moyenne !== '—' && (
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-bg-input border border-border-base">
                        <TrendingUp size={13} className="text-emerald-400 shrink-0" />
                        <div>
                          <p className="text-[9px] text-text-muted uppercase">Moyenne</p>
                          <p className="text-xs font-bold text-emerald-400">{profil.moyenne}/20</p>
                        </div>
                      </div>
                    )}
                    {profil.niveau && (
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-bg-input border border-border-base">
                        <Target size={13} className="text-purple-400 shrink-0" />
                        <div>
                          <p className="text-[9px] text-text-muted uppercase">Niveau</p>
                          <p className="text-xs font-bold text-text-primary">{profil.niveau}</p>
                        </div>
                      </div>
                    )}
                    {profil.ville && (
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-bg-input border border-border-base">
                        <MapPin size={13} className="text-pink-400 shrink-0" />
                        <div>
                          <p className="text-[9px] text-text-muted uppercase">Ville</p>
                          <p className="text-xs font-bold text-text-primary">{profil.ville}</p>
                        </div>
                      </div>
                    )}
                    {profil.ambition && (
                      <div className="p-2 rounded-xl bg-bg-input border border-border-base">
                        <p className="text-[9px] text-text-muted uppercase mb-1">Ambition</p>
                        <p className="text-xs text-text-primary leading-relaxed">{profil.ambition}</p>
                      </div>
                    )}
                    {profil.interets && profil.interets.length > 0 && (
                      <div className="p-2 rounded-xl bg-bg-input border border-border-base">
                        <p className="text-[9px] text-text-muted uppercase mb-2">Centres d'intérêt</p>
                        <div className="flex flex-wrap gap-1">
                          {profil.interets.map((int: string, i: number) => (
                            <span key={i} className="px-2 py-0.5 rounded-lg bg-supmti-blue/10 border border-supmti-blue/20 text-[10px] font-bold text-supmti-blue">
                              {int}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Infos session */}
                    <div className="pt-2 border-t border-border-base space-y-1.5">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-text-muted">Session</span>
                        <span className="font-mono text-text-secondary">{conv.session_id}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-text-muted">IP</span>
                        <span className="font-mono text-text-secondary">{conv.ip_address || '—'}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-text-muted">Langue</span>
                        <span>{LANG_FLAGS[conv.langue]} {conv.langue?.toUpperCase()}</span>
                      </div>
                    </div>

                    {/* Si aucune info extraite */}
                    {!profil.prenom && !profil.bac && !profil.moyenne && !profil.interets?.length && (
                      <div className="flex flex-col items-center gap-2 py-4 text-center">
                        <AlertCircle size={20} className="text-text-muted" />
                        <p className="text-[11px] text-text-muted">
                          Aucune information extraite de cette conversation.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Colonne droite — Messages */}
              <div className="flex-1 p-5 overflow-y-auto space-y-3">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-4">
                  Conversation ({detail?.nb_messages || 0} messages)
                </p>
                {(detail?.messages || []).map((msg, i) => (
                  <div key={i} className={cn(
                    'flex gap-2',
                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  )}>
                    {/* Avatar */}
                    <div className={cn(
                      'w-7 h-7 rounded-xl flex items-center justify-center text-[11px] font-black shrink-0 mt-0.5',
                      msg.role === 'user'
                        ? 'bg-orange-500/20 text-orange-500'
                        : 'bg-supmti-blue/20 text-supmti-blue'
                    )}>
                      {msg.role === 'user' ? (profil.prenom?.charAt(0) || '?') : 'S'}
                    </div>
                    <div className={cn(
                      'max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
                      msg.role === 'user'
                        ? 'bg-orange-500/10 border border-orange-500/20 text-text-primary rounded-tr-sm'
                        : 'bg-bg-input border border-border-base text-text-primary rounded-tl-sm'
                    )}>
                      <p className="text-[11px] whitespace-pre-wrap">{msg.content}</p>
                      {msg.created_at && (
                        <p className="text-[9px] text-text-muted mt-1 text-right">{msg.created_at}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Page principale ───────────────────────────────────────────
export default function AnonymousConversationsPage() {
  const [conversations, setConversations] = useState<AnonConv[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [total,         setTotal]         = useState(0);
  const [search,        setSearch]        = useState('');
  const [filterLang,    setFilterLang]    = useState('all');
  const [filterProfile, setFilterProfile] = useState('all'); // all | with_profile | no_profile
  const [selected,      setSelected]      = useState<AnonConv | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/admin/anonymous?limit=200`, {
        credentials: 'include', headers: authHeaders()
      });
      const data = await res.json();
      setConversations(data.conversations || []);
      setTotal(data.total || 0);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    setTotal(t => Math.max(0, t - 1));
  };

  // Filtres
  const filtered = conversations.filter(c => {
    const matchSearch =
      !search ||
      c.titre?.toLowerCase().includes(search.toLowerCase()) ||
      c.prenom?.toLowerCase().includes(search.toLowerCase()) ||
      c.bac?.toLowerCase().includes(search.toLowerCase()) ||
      c.interets?.some(i => i.toLowerCase().includes(search.toLowerCase()));

    const matchLang = filterLang === 'all' || c.langue === filterLang;

    const hasProfile = c.prenom !== '—' || c.bac !== '—' || (c.interets?.length || 0) > 0;
    const matchProfile =
      filterProfile === 'all' ||
      (filterProfile === 'with_profile' && hasProfile) ||
      (filterProfile === 'no_profile'   && !hasProfile);

    return matchSearch && matchLang && matchProfile;
  });

  // Stats rapides
  const withProfile = conversations.filter(c =>
    c.prenom !== '—' || c.bac !== '—' || (c.interets?.length || 0) > 0
  ).length;
  const totalMessages = conversations.reduce((sum, c) => sum + c.nb_messages, 0);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-primary">Visiteurs Anonymes</h1>
          <p className="text-text-secondary text-sm mt-0.5">
            Conversations des utilisateurs non connectés · Profils extraits par SAMI
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-input border border-border-base text-text-secondary hover:text-text-primary transition-all text-sm font-bold disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Actualiser
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total conversations', value: total, icon: MessageSquare, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
          { label: 'Avec profil extrait', value: withProfile, icon: User, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Total messages',      value: totalMessages, icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
          { label: 'Langues détectées',   value: new Set(conversations.map(c => c.langue)).size, icon: Globe, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={cn('p-4 rounded-2xl border', bg)}>
            <div className="flex items-center gap-2 mb-2">
              <Icon size={15} className={color} />
              <p className="text-[10px] font-black text-text-muted uppercase tracking-wider">{label}</p>
            </div>
            <p className={cn('text-2xl font-black', color)}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par nom, BAC, intérêt…"
            className="w-full pl-9 pr-4 py-2.5 bg-bg-input border border-border-base rounded-xl text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-supmti-blue transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
              <X size={14} />
            </button>
          )}
        </div>

        <select
          value={filterLang}
          onChange={e => setFilterLang(e.target.value)}
          className="px-4 py-2.5 bg-bg-input border border-border-base rounded-xl text-sm text-text-primary outline-none focus:border-supmti-blue transition-all"
        >
          <option value="all">🌍 Toutes les langues</option>
          <option value="fr">🇫🇷 Français</option>
          <option value="en">🇬🇧 English</option>
          <option value="ar">🇲🇦 Darija</option>
        </select>

        <select
          value={filterProfile}
          onChange={e => setFilterProfile(e.target.value)}
          className="px-4 py-2.5 bg-bg-input border border-border-base rounded-xl text-sm text-text-primary outline-none focus:border-supmti-blue transition-all"
        >
          <option value="all">👤 Tous les profils</option>
          <option value="with_profile">✅ Avec profil extrait</option>
          <option value="no_profile">❓ Sans profil</option>
        </select>
      </div>

      {/* Résultats */}
      <div className="text-[11px] text-text-muted px-1">
        {filtered.length} conversation{filtered.length > 1 ? 's' : ''} affichée{filtered.length > 1 ? 's' : ''}
        {search && ` · filtre : "${search}"`}
      </div>

      {/* Liste */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={28} className="animate-spin text-supmti-blue" />
            <p className="text-text-muted text-sm">Chargement des conversations…</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-bg-input border border-border-base flex items-center justify-center">
            <Users size={28} className="text-text-muted" />
          </div>
          <div className="text-center">
            <p className="font-bold text-text-primary">Aucune conversation anonyme</p>
            <p className="text-text-muted text-sm mt-1">
              {search ? `Aucun résultat pour "${search}"` : 'Les visiteurs non connectés apparaîtront ici.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(conv => {
            const hasProfile = conv.prenom !== '—' || conv.bac !== '—' || (conv.interets?.length || 0) > 0;
            return (
              <div
                key={conv.id}
                className="group p-4 rounded-2xl bg-bg-card border border-border-base hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/5 transition-all cursor-pointer"
                onClick={() => setSelected(conv)}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className={cn(
                    'w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 font-black text-lg border',
                    hasProfile
                      ? 'bg-orange-500/10 border-orange-500/20 text-orange-500'
                      : 'bg-bg-input border-border-base text-text-muted'
                  )}>
                    {conv.prenom !== '—' ? conv.prenom.charAt(0).toUpperCase() : '?'}
                  </div>

                  {/* Contenu principal */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-black text-text-primary text-sm">
                        {conv.prenom !== '—' ? conv.prenom : 'Visiteur anonyme'}
                      </span>
                      <span className="text-[10px]">{LANG_FLAGS[conv.langue] || '🌍'}</span>
                      {hasProfile && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase">
                          Profil extrait
                        </span>
                      )}
                    </div>

                    {/* Titre de la conv */}
                    <p className="text-sm text-text-secondary truncate mb-2">{conv.titre}</p>

                    {/* Badges profil */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <ProfileBadge
                        label="BAC" value={conv.bac}
                        icon={GraduationCap}
                        color="bg-blue-500/5 border-blue-500/20 text-blue-400"
                      />
                      <ProfileBadge
                        label="Moyenne" value={conv.moyenne !== '—' ? `${conv.moyenne}/20` : '—'}
                        icon={TrendingUp}
                        color="bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                      />
                      <ProfileBadge
                        label="Niveau" value={conv.niveau}
                        icon={Target}
                        color="bg-purple-500/5 border-purple-500/20 text-purple-400"
                      />
                      {(conv.interets || []).slice(0, 2).map((int, i) => (
                        <span key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-lg border bg-supmti-blue/5 border-supmti-blue/20 text-supmti-blue text-[11px] font-bold">
                          <Brain size={10} /> {int}
                        </span>
                      ))}
                      {(conv.interets || []).length > 2 && (
                        <span className="text-[10px] text-text-muted">
                          +{conv.interets.length - 2} autres
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Meta droite */}
                  <div className="shrink-0 text-right space-y-1">
                    <div className="flex items-center gap-1.5 justify-end">
                      <MessageSquare size={12} className="text-text-muted" />
                      <span className="text-xs font-bold text-text-secondary">{conv.nb_messages} msgs</span>
                    </div>
                    <div className="flex items-center gap-1.5 justify-end">
                      <Clock size={11} className="text-text-muted" />
                      <span className="text-[10px] text-text-muted">{conv.started_at}</span>
                    </div>
                    <ChevronRight
                      size={14}
                      className="text-text-muted group-hover:text-orange-400 group-hover:translate-x-1 transition-all ml-auto"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal détail */}
      {selected && (
        <ConvModal
          conv={selected}
          onClose={() => setSelected(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}