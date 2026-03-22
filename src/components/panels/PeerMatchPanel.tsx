// 'use client';
// import { useState, useEffect } from 'react';
// import { Send, CheckCircle2, ExternalLink, Mail, Phone, Sparkles, RefreshCw, Clock, Loader2 } from 'lucide-react';
// import { useSessionStore } from '@/store/sessionStore';
// import { sendPeerMatch }   from '@/services/panelService';
// import { ActionBtn }       from './ui';
// import { cn }              from '@/lib/utils';

// const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
// function getUid() {
//   try { return JSON.parse(localStorage.getItem('supmti-auth')||'{}')?.state?.user?.id||''; }
//   catch { return ''; }
// }

// const FILIERES = [
//   { id: 'ISI',   nom: "Ingénierie Systèmes Informatiques", icon: '💻', color: 'from-blue-500 to-indigo-600'   },
//   { id: 'ME',    nom: "Management des Entreprises",         icon: '📊', color: 'from-emerald-500 to-teal-600' },
//   { id: 'IISIC', nom: "IA & Systèmes d'Information",        icon: '🤖', color: 'from-purple-500 to-pink-600'  },
//   { id: 'IISRT', nom: "Réseaux & Télécommunications",       icon: '📡', color: 'from-cyan-500 to-blue-600'    },
//   { id: 'FACG',  nom: "Finance, Audit & Contrôle",          icon: '💰', color: 'from-amber-500 to-orange-600' },
//   { id: 'MSTIC', nom: "Management Digital & TIC",           icon: '🌐', color: 'from-pink-500 to-rose-600'    },
// ];

// interface AmbInfo {
//   ambassadeur?: string; contact_email?: string; contact_wa?: string; message?: string;
// }

// interface DemandeStatus {
//   statut: string; filiere: string;
//   ambassadeur_nom?: string; ambassadeur_email?: string; ambassadeur_wa?: string;
// }

// export const PeerMatchPanel = () => {
//   const { fitscore, profil } = useSessionStore();
//   const suggestedId          = fitscore?.classement?.[0]?.filiere_id || fitscore?.meilleure_filiere || null;

//   const [selected,  setSelected]  = useState<string | null>(suggestedId);
//   const [sent,      setSent]      = useState(false);
//   const [loading,   setLoading]   = useState(false);
//   const [error,     setError]     = useState<string | null>(null);
//   const [ambInfo,   setAmbInfo]   = useState<AmbInfo | null>(null);
//   const [checking,  setChecking]  = useState(false);
//   const [demande,   setDemande]   = useState<DemandeStatus | null>(null);
//   const [demandeId, setDemandeId] = useState<string | null>(null);

//   // Au montage — vérifier si une demande existe déjà pour cet utilisateur
//   useEffect(() => {
//     const savedId = localStorage.getItem('peermatch_demande_id');
//     if (savedId) {
//       setDemandeId(savedId);
//       setSent(true);
//       checkStatut(savedId);
//     }
//   }, []);

//   const checkStatut = async (id?: string) => {
//     const dId = id || demandeId;
//     if (!dId) return;
//     setChecking(true);
//     try {
//       const uid = getUid();
//       const res = await fetch(`${API}/api/peermatch/statut/${dId}`, {
//         credentials: 'include',
//         headers: uid ? { 'X-User-Id': uid } : {},
//       });
//       if (res.ok) {
//         const data = await res.json();
//         setDemande(data);
//         // Si ambassadeur assigné, mettre à jour ambInfo
//         if (data.ambassadeur_nom) {
//           setAmbInfo({
//             ambassadeur:   data.ambassadeur_nom,
//             contact_email: data.ambassadeur_email,
//             contact_wa:    data.ambassadeur_wa,
//           });
//         }
//       }
//     } catch { /* silencieux */ }
//     finally { setChecking(false); }
//   };

//   const contact = async () => {
//     if (!selected) return;
//     setLoading(true); setError(null);
//     try {
//       const prenom = profil?.informations_personnelles?.prenom || 'Étudiant';
//       const email  = (profil as any)?.informations_personnelles?.email || '';

//       const data = await sendPeerMatch(
//         prenom, email, selected,
//         `Bonjour, je suis intéressé(e) par la filière ${selected} et j'aimerais échanger avec un ambassadeur.`,
//       );

//       if (data.error) {
//         setError(data.message || 'Erreur lors de la demande.');
//       } else {
//         setAmbInfo({
//           ambassadeur:   data.ambassadeur,
//           contact_email: data.contact_email,
//           contact_wa:    data.contact_wa,
//           message:       data.message,
//         });
//         // Sauvegarder l'ID de la demande pour pouvoir vérifier le statut plus tard
//         if (data.demande_id) {
//           localStorage.setItem('peermatch_demande_id', data.demande_id);
//           setDemandeId(data.demande_id);
//           setDemande({ statut:'en_attente', filiere: selected });
//         }
//         setSent(true);
//       }
//     } catch {
//       setError('Connexion au serveur impossible. Réessaie dans un instant.');
//     }
//     setLoading(false);
//   };

//   const ambassadeurAssigne = demande?.ambassadeur_nom || ambInfo?.ambassadeur;
//   const emailContact       = demande?.ambassadeur_email || ambInfo?.contact_email;
//   const waContact          = demande?.ambassadeur_wa    || ambInfo?.contact_wa;

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500 pb-6">

//       {/* ── Header ── */}
//       <div className="text-center py-6 bg-gradient-to-b from-slate-50 to-transparent dark:from-white/[0.03] rounded-t-3xl border-x border-t border-slate-100 dark:border-white/[0.05]">
//         <div className="relative inline-block mb-4">
//           <div className="absolute -inset-1 bg-orange-500/20 rounded-full blur-lg animate-pulse" />
//           <div className="relative text-5xl">🤝</div>
//         </div>
//         <h3 className="font-black text-lg text-slate-800 dark:text-white px-6">
//           Échange avec un Ambassadeur
//         </h3>
//         <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 px-8 leading-relaxed italic">
//           "Rien ne remplace le vécu. Pose tes questions à un étudiant qui suit déjà ce cursus."
//         </p>
//       </div>

//       {/* ── Suggestion IA ── */}
//       {suggestedId && !sent && (
//         <div className="mx-1 p-3.5 bg-orange-500/5 border border-orange-500/20 rounded-2xl flex items-center gap-3 animate-in slide-in-from-left duration-700">
//           <div className="p-2 bg-orange-500 rounded-xl text-white shadow-lg shadow-orange-500/20">
//             <Sparkles size={16} />
//           </div>
//           <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
//             Recommandation SAMI : <span className="text-orange-600 dark:text-orange-400 font-black">
//               Ambassadeur {suggestedId}
//             </span> disponible pour toi.
//           </p>
//         </div>
//       )}

//       {/* ── Grille filières ── */}
//       {!sent && (
//         <>
//           <div>
//             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">
//               Cible du Matching
//             </p>
//             <div className="grid grid-cols-3 gap-2">
//               {FILIERES.map(f => (
//                 <button key={f.id} onClick={() => setSelected(f.id)}
//                   className={cn(
//                     'relative p-3 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center group',
//                     selected === f.id
//                       ? 'border-orange-500 bg-white dark:bg-slate-900 shadow-xl shadow-orange-500/10 scale-[1.02]'
//                       : 'border-slate-100 dark:border-white/[0.05] bg-white/50 dark:bg-white/[0.02] grayscale hover:grayscale-0'
//                   )}>
//                   <div className="text-xl mb-1 group-hover:scale-125 transition-transform duration-300">{f.icon}</div>
//                   <div className={cn('text-[10px] font-black tracking-tighter',
//                     selected === f.id ? 'text-orange-500' : 'text-slate-500')}>{f.id}</div>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {error && (
//             <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl text-xs text-rose-600 text-center">{error}</div>
//           )}

//           <div className="pt-2">
//             {loading ? (
//               <div className="flex flex-col items-center gap-3 py-4">
//                 <div className="w-8 h-8 border-2 border-slate-200 dark:border-white/10 border-t-orange-500 rounded-full animate-spin" />
//                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">
//                   Recherche d'un ambassadeur disponible...
//                 </p>
//               </div>
//             ) : (
//               <ActionBtn onClick={contact} disabled={!selected}
//                 className="w-full h-14 rounded-2xl bg-[#006666] text-white font-bold text-sm shadow-2xl transition-all active:scale-95 group">
//                 <Send size={18} className="mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
//                 Entrer en contact
//               </ActionBtn>
//             )}
//           </div>
//         </>
//       )}

//       {/* ── Confirmation + Statut ── */}
//       {sent && (
//         <div className="animate-in zoom-in-95 duration-500 space-y-4">

//           {/* Statut de la demande */}
//           <div className={cn(
//             "rounded-2xl p-4 border-2 flex items-center gap-3",
//             demande?.statut === 'traite'
//               ? "bg-emerald-500/5 border-emerald-500/20"
//               : demande?.statut === 'annule'
//                 ? "bg-red-500/5 border-red-500/20"
//                 : "bg-yellow-500/5 border-yellow-500/20"
//           )}>
//             {demande?.statut === 'traite' ? (
//               <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
//             ) : demande?.statut === 'annule' ? (
//               <span className="text-red-500 text-lg shrink-0">✕</span>
//             ) : (
//               <Clock size={20} className="text-yellow-500 shrink-0 animate-pulse" />
//             )}
//             <div className="flex-1">
//               <p className="font-black text-sm text-slate-800 dark:text-white">
//                 {demande?.statut === 'traite'  ? '✅ Demande traitée — Ambassadeur assigné !'
//                 : demande?.statut === 'annule' ? '❌ Demande annulée'
//                 : '⏳ Demande en attente de traitement'}
//               </p>
//               <p className="text-[10px] text-slate-500 mt-0.5">
//                 {demande?.statut === 'traite'  ? 'Un ambassadeur est prêt à te répondre.'
//                 : demande?.statut === 'annule' ? 'Contacte directement SUPMTI.'
//                 : 'L\'équipe SUPMTI traitera ta demande sous 24-48h.'}
//               </p>
//             </div>
//             {/* Bouton vérifier */}
//             <button onClick={() => checkStatut()} disabled={checking}
//               className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shrink-0 disabled:opacity-50">
//               {checking ? <Loader2 size={11} className="animate-spin"/> : <RefreshCw size={11}/>}
//               Actualiser
//             </button>
//           </div>

//           {/* Ambassadeur assigné */}
//           {ambassadeurAssigne && (
//             <div className="bg-emerald-500/5 border-2 border-emerald-500/20 rounded-2xl p-5 animate-in fade-in duration-500">
//               <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-3">
//                 🎓 Ton ambassadeur
//               </p>
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black text-lg">
//                   {ambassadeurAssigne.charAt(0)}
//                 </div>
//                 <div>
//                   <p className="font-black text-slate-900 dark:text-white text-base">{ambassadeurAssigne}</p>
//                   <p className="text-[10px] text-slate-500">Ambassadeur SUPMTI · {demande?.filiere || selected}</p>
//                 </div>
//               </div>

//               <div className="flex flex-col gap-2">
//                 {waContact && (
//                   <a href={`https://wa.me/${waContact.replace(/\D/g,'')}`}
//                     target="_blank" rel="noopener noreferrer"
//                     className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all">
//                     <Phone size={14} /> Contacter via WhatsApp <ExternalLink size={12} />
//                   </a>
//                 )}
//                 {emailContact && (
//                   <a href={`mailto:${emailContact}?subject=Peer Match ${demande?.filiere || selected}`}
//                     className="flex items-center justify-center gap-2 w-full py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:opacity-90 transition-all">
//                     <Mail size={14} /> Envoyer un Email
//                   </a>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* En attente — fallback SUPMTI */}
//           {!ambassadeurAssigne && demande?.statut !== 'annule' && (
//             <div className="bg-slate-50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/[0.05] rounded-2xl p-4">
//               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
//                 En attendant, contacte SUPMTI
//               </p>
//               <div className="flex flex-col gap-2">
//                 <a href="https://wa.me/212627802602" target="_blank" rel="noopener noreferrer"
//                   className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white rounded-xl text-xs font-bold">
//                   WhatsApp SUPMTI <ExternalLink size={12} />
//                 </a>
//                 <a href={`mailto:contact@supmtimeknes.ac.ma?subject=Peer Match ${selected}`}
//                   className="flex items-center justify-center gap-2 w-full py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300">
//                   <Mail size={14} /> Email SUPMTI
//                 </a>
//               </div>
//             </div>
//           )}

//           {/* Nouvelle demande */}
//           <button
//             onClick={() => {
//               setSent(false); setAmbInfo(null); setDemande(null);
//               setDemandeId(null); setSelected(suggestedId);
//               localStorage.removeItem('peermatch_demande_id');
//             }}
//             className="w-full py-2 text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
//             Faire une nouvelle demande
//           </button>
//         </div>
//       )}

//       {/* ── Contacts fixes SUPMTI ── */}
//       <div className="bg-slate-50 dark:bg-black/20 border border-slate-200/50 dark:border-white/5 rounded-2xl p-4">
//         <p className="text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest flex items-center gap-2">
//           <Phone size={10} /> Support SUPMTI Meknès
//         </p>
//         <div className="space-y-2 text-[11px] font-medium text-slate-600 dark:text-slate-400">
//           <div className="flex justify-between items-center pb-2 border-b border-slate-200/50 dark:border-white/5">
//             <span>Standard</span>
//             <span className="text-slate-900 dark:text-white">+212 6 27 80 26 02</span>
//           </div>
//           <div className="flex justify-between items-center pb-2 border-b border-slate-200/50 dark:border-white/5">
//             <span>Email Direct</span>
//             <span className="text-slate-900 dark:text-white">contact@supmtimeknes.ac.ma</span>
//           </div>
//           <div className="flex items-center gap-2 pt-1 opacity-60">
//             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
//             <span className="text-[10px]">Lun-Ven : 08:30 – 18:00 · Sam : 08:30 – 12:00</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };





'use client';
import { useState, useEffect } from 'react';
import { Send, CheckCircle2, ExternalLink, Mail, Phone, Sparkles, RefreshCw, Clock, Loader2 } from 'lucide-react';
import { useSessionStore } from '@/store/sessionStore';
import { sendPeerMatch }   from '@/services/panelService';
import { ActionBtn }       from './ui';
import { cn }              from '@/lib/utils';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
function getUid() {
  try { return JSON.parse(localStorage.getItem('supmti-auth')||'{}')?.state?.user?.id||''; }
  catch { return ''; }
}

const FILIERES = [
  { id: 'ISI',   nom: "Ingénierie Systèmes Informatiques", icon: '💻' },
  { id: 'ME',    nom: "Management des Entreprises",         icon: '📊' },
  { id: 'IISIC', nom: "IA & Systèmes d'Information",        icon: '🤖' },
  { id: 'IISRT', nom: "Réseaux & Télécommunications",       icon: '📡' },
  { id: 'FACG',  nom: "Finance, Audit & Contrôle",          icon: '💰' },
  { id: 'MSTIC', nom: "Management Digital & TIC",           icon: '🌐' },
];

interface DemandeStatus {
  statut: string; filiere: string;
  ambassadeur_nom?: string; ambassadeur_email?: string; ambassadeur_wa?: string;
}

export const PeerMatchPanel = () => {
  const { fitscore, profil } = useSessionStore();
  const suggestedId = fitscore?.classement?.[0]?.filiere_id || fitscore?.meilleure_filiere || null;

  const [selected,  setSelected]  = useState<string | null>(suggestedId);
  const [sent,      setSent]      = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [checking,  setChecking]  = useState(false);
  const [demande,   setDemande]   = useState<DemandeStatus | null>(null);
  const [demandeId, setDemandeId] = useState<string | null>(null);

  // Au montage — vérifier si une demande existe déjà
  useEffect(() => {
    const savedId = localStorage.getItem('peermatch_demande_id');
    if (savedId) {
      setDemandeId(savedId);
      setSent(true);
      checkStatut(savedId);
    }
  }, []);

  const checkStatut = async (id?: string) => {
    const dId = id || demandeId;
    if (!dId) return;
    setChecking(true);
    try {
      const uid = getUid();
      const res = await fetch(`${API}/api/peermatch/statut/${dId}`, {
        credentials: 'include',
        headers: uid ? { 'X-User-Id': uid } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setDemande(data);
      }
    } catch { /* silencieux */ }
    finally { setChecking(false); }
  };

  const contact = async () => {
    if (!selected) return;
    setLoading(true); setError(null);
    try {
      const prenom = profil?.informations_personnelles?.prenom || 'Étudiant';
      const email  = (profil as any)?.informations_personnelles?.email || '';

      const data = await sendPeerMatch(
        prenom, email, selected,
        `Bonjour, je suis intéressé(e) par la filière ${selected} et j'aimerais échanger avec un ambassadeur.`,
      );

      if (data.error) {
        setError(data.message || 'Erreur lors de la demande.');
      } else {
        // Sauvegarder l'ID — NE PAS afficher les coordonnées de l'API
        // L'ambassadeur sera visible SEULEMENT après traitement admin
        if (data.demande_id) {
          localStorage.setItem('peermatch_demande_id', data.demande_id);
          setDemandeId(data.demande_id);
        }
        // Forcer statut en_attente — ignorer tout ambassadeur retourné par l'API
        setDemande({ statut: 'en_attente', filiere: selected });
        setSent(true);
      }
    } catch {
      setError('Connexion au serveur impossible. Réessaie dans un instant.');
    }
    setLoading(false);
  };

  // Coordonnées UNIQUEMENT depuis checkStatut (après traitement admin)
  const ambassadeurAssigne = demande?.statut === 'traite' ? demande?.ambassadeur_nom : null;
  const emailContact       = demande?.statut === 'traite' ? demande?.ambassadeur_email : null;
  const waContact          = demande?.statut === 'traite' ? demande?.ambassadeur_wa : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-6">

      {/* Header */}
      <div className="text-center py-6 bg-gradient-to-b from-slate-50 to-transparent dark:from-white/[0.03] rounded-t-3xl border-x border-t border-slate-100 dark:border-white/[0.05]">
        <div className="relative inline-block mb-4">
          <div className="absolute -inset-1 bg-orange-500/20 rounded-full blur-lg animate-pulse" />
          <div className="relative text-5xl">🤝</div>
        </div>
        <h3 className="font-black text-lg text-slate-800 dark:text-white px-6">
          Échange avec un Ambassadeur
        </h3>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 px-8 leading-relaxed italic">
          "Rien ne remplace le vécu. Pose tes questions à un étudiant qui suit déjà ce cursus."
        </p>
      </div>

      {/* Suggestion IA */}
      {suggestedId && !sent && (
        <div className="mx-1 p-3.5 bg-orange-500/5 border border-orange-500/20 rounded-2xl flex items-center gap-3 animate-in slide-in-from-left duration-700">
          <div className="p-2 bg-orange-500 rounded-xl text-white shadow-lg shadow-orange-500/20">
            <Sparkles size={16} />
          </div>
          <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
            Recommandation SAMI : <span className="text-orange-600 dark:text-orange-400 font-black">
              filière {suggestedId}
            </span> — un ambassadeur peut te répondre.
          </p>
        </div>
      )}

      {/* Grille filières */}
      {!sent && (
        <>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">
              Choisir une filière
            </p>
            <div className="grid grid-cols-3 gap-2">
              {FILIERES.map(f => (
                <button key={f.id} onClick={() => setSelected(f.id)}
                  className={cn(
                    'relative p-3 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center group',
                    selected === f.id
                      ? 'border-orange-500 bg-white dark:bg-slate-900 shadow-xl shadow-orange-500/10 scale-[1.02]'
                      : 'border-slate-100 dark:border-white/[0.05] bg-white/50 dark:bg-white/[0.02] grayscale hover:grayscale-0'
                  )}>
                  <div className="text-xl mb-1 group-hover:scale-125 transition-transform duration-300">{f.icon}</div>
                  <div className={cn('text-[10px] font-black tracking-tighter',
                    selected === f.id ? 'text-orange-500' : 'text-slate-500')}>{f.id}</div>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl text-xs text-rose-600 text-center">{error}</div>
          )}

          <div className="pt-2">
            {loading ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="w-8 h-8 border-2 border-slate-200 dark:border-white/10 border-t-orange-500 rounded-full animate-spin" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">
                  Envoi de la demande...
                </p>
              </div>
            ) : (
              <ActionBtn onClick={contact} disabled={!selected}
                className="w-full h-14 rounded-2xl bg-[#006666] text-white font-bold text-sm shadow-2xl transition-all active:scale-95 group">
                <Send size={18} className="mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                Envoyer la demande
              </ActionBtn>
            )}
          </div>
        </>
      )}

      {/* Confirmation + Statut */}
      {sent && (
        <div className="animate-in zoom-in-95 duration-500 space-y-4">

          {/* Statut */}
          <div className={cn(
            "rounded-2xl p-4 border-2 flex items-center gap-3",
            demande?.statut === 'traite'  ? "bg-emerald-500/5 border-emerald-500/20"
            : demande?.statut === 'annule' ? "bg-red-500/5 border-red-500/20"
            :                                "bg-yellow-500/5 border-yellow-500/20"
          )}>
            {demande?.statut === 'traite'  ? <CheckCircle2 size={20} className="text-emerald-500 shrink-0"/>
            :demande?.statut === 'annule'  ? <span className="text-red-500 text-lg shrink-0">✕</span>
            :                                <Clock size={20} className="text-yellow-500 shrink-0 animate-pulse"/>
            }
            <div className="flex-1">
              <p className="font-black text-sm text-slate-800 dark:text-white">
                {demande?.statut === 'traite'  ? '✅ Demande traitée — Ambassadeur assigné !'
                :demande?.statut === 'annule'  ? '❌ Demande annulée'
                :                               '⏳ Demande en attente de traitement'}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {demande?.statut === 'traite'  ? 'L\'équipe SUPMTI a validé ta demande.'
                :demande?.statut === 'annule'  ? 'Contacte directement SUPMTI.'
                :                               'L\'équipe SUPMTI traitera ta demande sous 24-48h.'}
              </p>
            </div>
            <button onClick={() => checkStatut()} disabled={checking}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shrink-0 disabled:opacity-50">
              {checking ? <Loader2 size={11} className="animate-spin"/> : <RefreshCw size={11}/>}
              Actualiser
            </button>
          </div>

          {/* Ambassadeur — SEULEMENT si statut = traite ET coordonnées présentes */}
          {demande?.statut === 'traite' && ambassadeurAssigne && (
            <div className="bg-emerald-500/5 border-2 border-emerald-500/20 rounded-2xl p-5 animate-in fade-in duration-500">
              <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-3">
                🎓 Ton ambassadeur
              </p>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black text-lg">
                  {ambassadeurAssigne.charAt(0)}
                </div>
                <div>
                  <p className="font-black text-slate-900 dark:text-white text-base">{ambassadeurAssigne}</p>
                  <p className="text-[10px] text-slate-500">Ambassadeur SUPMTI · {demande?.filiere || selected}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {waContact && (
                  <a href={`https://wa.me/${waContact.replace(/\D/g,'')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all">
                    <Phone size={14}/> Contacter via WhatsApp <ExternalLink size={12}/>
                  </a>
                )}
                {emailContact && (
                  <a href={`mailto:${emailContact}?subject=Peer Match ${demande?.filiere||selected}`}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:opacity-90 transition-all">
                    <Mail size={14}/> Envoyer un Email
                  </a>
                )}
              </div>
            </div>
          )}

          {/* En attente — pas encore traité */}
          {demande?.statut !== 'traite' && demande?.statut !== 'annule' && (
            <div className="bg-slate-50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/[0.05] rounded-2xl p-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                En attendant, contacte SUPMTI
              </p>
              <div className="flex flex-col gap-2">
                <a href="https://wa.me/212627802602" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white rounded-xl text-xs font-bold">
                  WhatsApp SUPMTI <ExternalLink size={12}/>
                </a>
                <a href={`mailto:contact@supmtimeknes.ac.ma?subject=Peer Match ${selected}`}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300">
                  <Mail size={14}/> Email SUPMTI
                </a>
              </div>
            </div>
          )}

          {/* Nouvelle demande */}
          <button onClick={() => {
            setSent(false); setDemande(null); setDemandeId(null);
            setSelected(suggestedId);
            localStorage.removeItem('peermatch_demande_id');
          }} className="w-full py-2 text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            Faire une nouvelle demande
          </button>
        </div>
      )}

      {/* Contacts fixes SUPMTI */}
      <div className="bg-slate-50 dark:bg-black/20 border border-slate-200/50 dark:border-white/5 rounded-2xl p-4">
        <p className="text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest flex items-center gap-2">
          <Phone size={10}/> Support SUPMTI Meknès
        </p>
        <div className="space-y-2 text-[11px] font-medium text-slate-600 dark:text-slate-400">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/50 dark:border-white/5">
            <span>Standard</span>
            <span className="text-slate-900 dark:text-white">+212 6 27 80 26 02</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/50 dark:border-white/5">
            <span>Email Direct</span>
            <span className="text-slate-900 dark:text-white">contact@supmtimeknes.ac.ma</span>
          </div>
          <div className="flex items-center gap-2 pt-1 opacity-60">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"/>
            <span className="text-[10px]">Lun-Ven : 08:30 – 18:00 · Sam : 08:30 – 12:00</span>
          </div>
        </div>
      </div>
    </div>
  );
};