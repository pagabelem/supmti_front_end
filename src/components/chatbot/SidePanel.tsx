// 'use client';
// import { useState, useEffect } from 'react';
// import { PanelType } from '@/store/panelStore';
// import { useSessionStore } from '@/store/sessionStore';
// import { ENDPOINTS, FILIERE_META } from '@/config/constants';
// import { markdownToHtml } from '@/lib/utils';
// import type {
//   FitscoreResult, CarriereResult, AdmissionResult,
//   CoachResult, PsychoStartResult, PsychoAnswerResult, ComparaisonResult
// } from '@/types/student';

// const PANEL_TITLES: Record<string, string> = {
//   profil:    '👤 Mon Profil',
//   fitscore:  '📊 FitScore IA',
//   admission: '🎯 Simulation Admission',
//   carriere:  '🚀 Simulation Carrière',
//   comparer:  '⚖️ Comparer Filières',
//   psycho:    '🧠 Test Psychométrique',
//   coach:     '🏅 Coach Académique',
//   peermatch: '🤝 Peer Match',
// };

// interface Props {
//   type: PanelType;
//   onClose: () => void;
//   showToast: (msg: string) => void;
// }

// export default function SidePanel({ type, onClose, showToast }: Props) {
//   return (
//     <div className="panel">
//       <div className="panel-header">
//         <div className="panel-title">{PANEL_TITLES[type!] || type}</div>
//         <button className="panel-close" onClick={onClose}><i className="fas fa-times" /></button>
//       </div>
//       <div className="panel-body">
//         {type === 'profil'    && <ProfilPanel onClose={onClose} />}
//         {type === 'fitscore'  && <FitscorePanel />}
//         {type === 'admission' && <AdmissionPanel />}
//         {type === 'carriere'  && <CarrierePanel />}
//         {type === 'comparer'  && <ComparerPanel />}
//         {type === 'psycho'    && <PsychoPanel />}
//         {type === 'coach'     && <CoachPanel />}
//         {type === 'peermatch' && <PeerMatchPanel showToast={showToast} />}
//       </div>
//     </div>
//   );
// }

// // ══ Profil ══
// function ProfilPanel({ onClose }: { onClose: () => void }) {
//   const profil = useSessionStore(s => s.profil);
//   if (!profil || (!profil.informations_personnelles?.prenom || profil.informations_personnelles.prenom === 'Étudiant')) {
//     return (
//       <div style={{ textAlign: 'center', padding: '32px 16px' }}>
//         <div style={{ fontSize: 48, marginBottom: 16 }}>👤</div>
//         <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Profil non encore créé</div>
//         <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
//           Présente-toi à Sami dans le chat :<br />
//           <strong style={{ color: 'var(--accent-orange)' }}>&quot;Je m&apos;appelle X, j&apos;ai le BAC SMA avec 14.5 de moyenne&quot;</strong>
//         </div>
//         <button className="panel-action-btn secondary" onClick={onClose}>
//           <i className="fas fa-comment" /> Aller au chat
//         </button>
//       </div>
//     );
//   }
//   const info  = profil.informations_personnelles || {};
//   const parc  = profil.parcours_academique || {};
//   const pref  = profil.preferences || {};
//   const notes = parc.notes_matieres || {};
//   return (
//     <>
//       <div className="profil-card">
//         <div className="profil-header">Informations personnelles</div>
//         {info.prenom && info.prenom !== 'Étudiant' && <Row icon="👤" label="Prénom" value={info.prenom} />}
//         {info.pays   && <Row icon="🌍" label="Pays"   value={info.pays} />}
//         {info.ville  && <Row icon="📍" label="Ville"  value={info.ville} />}
//       </div>
//       <div className="profil-card">
//         <div className="profil-header">Parcours académique</div>
//         {parc.type_bac && parc.type_bac !== 'AUTRE' && <Row icon="🎓" label="BAC"     value={parc.label_bac || parc.type_bac} />}
//         {(parc.moyenne_generale || 0) > 0 && <Row icon="📊" label="Moyenne" value={`${parc.moyenne_generale}/20 — ${parc.mention || ''}`} />}
//         {parc.niveau_actuel   && <Row icon="📚" label="Niveau"   value={parc.niveau_actuel} />}
//         {parc.diplome_actuel  && <Row icon="📜" label="Diplôme"  value={parc.diplome_actuel} />}
//         {Object.keys(notes).length > 0 && (
//           <Row icon="📝" label="Notes" value={Object.entries(notes).slice(0,4).map(([m,n])=>`${m}: ${n}`).join(' · ')} />
//         )}
//       </div>
//       {(pref.centres_interet?.length || 0) > 0 && (
//         <div className="profil-card">
//           <div className="profil-header">Préférences</div>
//           <Row icon="💡" label="Intérêts" value={(pref.centres_interet || []).join(', ')} />
//           {pref.ambition_professionnelle && <Row icon="🎯" label="Ambition" value={pref.ambition_professionnelle} />}
//         </div>
//       )}
//       <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: 8 }}>
//         Statut : <strong style={{ color: profil.statut_profil === 'complet' ? 'var(--accent-green)' : 'var(--accent-orange)' }}>{profil.statut_profil}</strong>
//       </div>
//     </>
//   );
// }

// function Row({ icon, label, value }: { icon: string; label: string; value: string | undefined }) {
//   return (
//     <div className="profil-row">
//       <span className="pr-icon">{icon}</span>
//       <span className="pr-label">{label}</span>
//       <span className="pr-value">{value}</span>
//     </div>
//   );
// }

// // ══ FitScore ══
// function FitscorePanel() {
//   const { setFitscore } = useSessionStore();
//   const [result, setResult] = useState<FitscoreResult | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const calc = async () => {
//     setLoading(true); setError(null);
//     try {
//       const res  = await fetch(ENDPOINTS.FITSCORE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include' });
//       const data: FitscoreResult = await res.json();
//       if (data.error) { setError(data.message || 'Profil incomplet'); setLoading(false); return; }
//       setResult(data); setFitscore(data);
//     } catch { setError('Erreur de connexion.'); }
//     setLoading(false);
//   };

//   return (
//     <>
//       <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
//         Le FitScore calcule ta compatibilité avec chaque filière de SUPMTI en analysant ton BAC, ta moyenne, tes intérêts et ton profil psychométrique.
//       </p>
//       <button className="panel-action-btn" onClick={calc} disabled={loading}>
//         <i className="fas fa-calculator" /> Calculer mon FitScore
//       </button>
//       {loading && <><div className="spinner" /><div className="loading-text">Calcul en cours avec l&apos;IA...</div></>}
//       {error && (
//         <div style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
//           <div style={{ fontSize: 24, marginBottom: 8 }}>⚠️</div>
//           <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>{error}</div>
//         </div>
//       )}
//       {result?.classement && (
//         <>
//           <div className="result-card">
//             <h4>🏆 Classement des filières</h4>
//             {result.classement.map(f => (
//               <div key={f.filiere_id} className="score-row">
//                 <div className="score-label">{f.filiere_nom || f.filiere_id}</div>
//                 <div className="score-bar-wrap"><div className="score-bar-fill" style={{ width: `${f.score_total}%` }} /></div>
//                 <div className="score-val">{f.score_total}%</div>
//               </div>
//             ))}
//           </div>
//           {result.rapport && (
//             <div className="result-card" style={{ background: 'rgba(249,115,22,0.06)', borderColor: 'rgba(249,115,22,0.2)' }}>
//               <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Rapport personnalisé</div>
//               <div className="prose" style={{ fontSize: 13 }} dangerouslySetInnerHTML={{ __html: markdownToHtml(result.rapport) }} />
//             </div>
//           )}
//         </>
//       )}
//     </>
//   );
// }

// // ══ Admission ══
// function AdmissionPanel() {
//   const [result, setResult] = useState<AdmissionResult | null>(null);
//   const [loading, setLoading] = useState(false);

//   const calc = async () => {
//     setLoading(true);
//     try {
//       const res  = await fetch(ENDPOINTS.ADMISSION, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include' });
//       const data: AdmissionResult = await res.json();
//       setResult(data);
//     } catch { setResult({ rapport: '', error: true, message: 'Erreur. Réessaie.' }); }
//     setLoading(false);
//   };

//   return (
//     <>
//       <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
//         Calcule ta probabilité d&apos;admission dans chaque filière et estime ta bourse d&apos;excellence.
//       </p>
//       <button className="panel-action-btn" onClick={calc} disabled={loading}>
//         <i className="fas fa-door-open" /> Simuler mon admission
//       </button>
//       {loading && <><div className="spinner" /><div className="loading-text">Simulation en cours...</div></>}
//       {result && !loading && (
//         result.error
//           ? <div style={{ textAlign: 'center', padding: 16, fontSize: 13, color: 'var(--text-secondary)' }}>{result.message}</div>
//           : <div className="result-card"><div className="prose" style={{ fontSize: 13 }} dangerouslySetInnerHTML={{ __html: markdownToHtml(result.rapport) }} /></div>
//       )}
//     </>
//   );
// }

// // ══ Carrière ══
// function CarrierePanel() {
//   const [filieres, setFilieres]   = useState<string[]>([]);
//   const [explication, setExplication] = useState('');
//   const [annee, setAnnee]         = useState('');
//   const [selected, setSelected]   = useState<string | null>(null);
//   const [result,   setResult]     = useState<CarriereResult | null>(null);
//   const [loading,  setLoading]    = useState(true);
//   const [simLoading, setSimLoading] = useState(false);

//   useEffect(() => {
//     (async () => {
//       try {
//         const res  = await fetch(ENDPOINTS.CARRIERE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({}) });
//         const data: CarriereResult = await res.json();
//         setFilieres(data.filieres_disponibles || ['ISI','ME','IISIC','IISRT','FACG','MSTIC']);
//         setExplication(data.explication || 'Choisis une filière pour simuler ta carrière.');
//         setAnnee(data.annee_entree || '');
//       } catch { setFilieres(['ISI','ME','IISIC','IISRT','FACG','MSTIC']); }
//       setLoading(false);
//     })();
//   }, []);

//   const simulate = async () => {
//     if (!selected) return;
//     setSimLoading(true); setResult(null);
//     try {
//       const res  = await fetch(ENDPOINTS.CARRIERE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ filiere_id: selected }) });
//       const data: CarriereResult = await res.json();
//       setResult(data);
//     } catch { /**/ }
//     setSimLoading(false);
//   };

//   if (loading) return <div className="spinner" />;

//   return (
//     <>
//       <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
//         {explication}{annee && <><br /><strong style={{ color: 'var(--accent-orange)' }}>Entrée : {annee}</strong></>}
//       </p>
//       <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sélectionne une filière</div>
//       <div className="filiere-grid">
//         {filieres.map(f => (
//           <div key={f} className={`filiere-chip${selected === f ? ' selected' : ''}`} onClick={() => setSelected(f)}>
//             <div className="fc-id">{f}</div>
//             {FILIERE_META[f] && <div className="fc-nom">{FILIERE_META[f].nom}</div>}
//           </div>
//         ))}
//       </div>
//       <button className="panel-action-btn" onClick={simulate} disabled={!selected || simLoading}>
//         <i className="fas fa-rocket" /> Lancer la simulation
//       </button>
//       {simLoading && <><div className="spinner" /><div className="loading-text">Simulation GPT en cours...</div></>}
//       {result && !simLoading && (
//         <>
//           <div className="result-card" style={{ background: 'rgba(249,115,22,0.05)', borderColor: 'rgba(249,115,22,0.2)' }}>
//             <h4>📊 {result.filiere_nom || selected}</h4>
//             {result.donnees_cles && (
//               <>
//                 <div className="score-row"><span className="score-label">Salaire départ</span><span className="score-val" style={{ fontSize: 12 }}>{result.donnees_cles.salaire_depart || 'N/A'}</span></div>
//                 <div className="score-row"><span className="score-label">Après 3 ans</span><span className="score-val"    style={{ fontSize: 12 }}>{result.donnees_cles.salaire_3ans || 'N/A'}</span></div>
//                 <div className="score-row"><span className="score-label">Après 7 ans</span><span className="score-val"    style={{ fontSize: 12 }}>{result.donnees_cles.salaire_7ans || 'N/A'}</span></div>
//                 <div className="score-row"><span className="score-label">Taux insertion</span><span className="score-val" style={{ fontSize: 12 }}>{result.donnees_cles.taux_insertion || 'N/A'}</span></div>
//               </>
//             )}
//           </div>
//           <div className="result-card">
//             <h4>🎬 Simulation narrative</h4>
//             <div className="prose" style={{ fontSize: 13 }} dangerouslySetInnerHTML={{ __html: markdownToHtml(result.scenario) }} />
//           </div>
//         </>
//       )}
//     </>
//   );
// }

// // ══ Comparer ══
// function ComparerPanel() {
//   const FILIERES = ['ISI','ME','IISIC','IISRT','FACG','MSTIC'];
//   const [f1, setF1]       = useState('ISI');
//   const [f2, setF2]       = useState('ME');
//   const [result, setResult] = useState<ComparaisonResult | null>(null);
//   const [loading, setLoading] = useState(false);

//   const compare = async () => {
//     setLoading(true); setResult(null);
//     try {
//       const res  = await fetch(ENDPOINTS.COMPARER, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ filiere_1: f1, filiere_2: f2 }) });
//       const data: ComparaisonResult = await res.json();
//       setResult(data);
//     } catch { /**/ }
//     setLoading(false);
//   };

//   const selectStyle: React.CSSProperties = { width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-primary)', fontFamily: 'Outfit,sans-serif', fontSize: 13, outline: 'none' };

//   return (
//     <>
//       <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>Compare deux filières côte à côte : salaires, insertion, métiers, entreprises.</p>
//       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
//         <div>
//           <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Filière 1</div>
//           <select style={selectStyle} value={f1} onChange={e => setF1(e.target.value)}>
//             {FILIERES.map(f => <option key={f} value={f}>{f}</option>)}
//           </select>
//         </div>
//         <div>
//           <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Filière 2</div>
//           <select style={selectStyle} value={f2} onChange={e => setF2(e.target.value)}>
//             {FILIERES.map(f => <option key={f} value={f}>{f}</option>)}
//           </select>
//         </div>
//       </div>
//       <button className="panel-action-btn" onClick={compare} disabled={loading}>
//         <i className="fas fa-balance-scale" /> Comparer maintenant
//       </button>
//       {loading && <><div className="spinner" /><div className="loading-text">Comparaison en cours...</div></>}
//       {result && !loading && (
//         <>
//           {(result.avertissements?.length || 0) > 0 && (
//             <div style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 10, padding: 12, marginBottom: 12, fontSize: 12, color: 'var(--accent-orange)' }}>
//               {result.avertissements!.join(' | ')}
//             </div>
//           )}
//           <div className="result-card"><div className="prose" style={{ fontSize: 13 }} dangerouslySetInnerHTML={{ __html: markdownToHtml(result.comparaison) }} /></div>
//           {result.recommandation && (
//             <div className="result-card" style={{ background: 'rgba(59,130,246,0.06)', borderColor: 'rgba(59,130,246,0.2)' }}>
//               <h4 style={{ color: 'var(--accent-blue)' }}>💡 Recommandation personnalisée</h4>
//               <div style={{ fontSize: 13, lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: markdownToHtml(result.recommandation) }} />
//             </div>
//           )}
//         </>
//       )}
//     </>
//   );
// }

// // ══ Psycho ══
// function PsychoPanel() {
//   const [phase, setPhase]   = useState<'intro' | 'question' | 'done'>('intro');
//   const [question, setQuestion] = useState('');
//   const [current, setCurrent]   = useState(1);
//   const [total, setTotal]       = useState(18);
//   const [answer, setAnswer]     = useState('');
//   const [scores, setScores]     = useState<Record<string,number>>({});
//   const [rapport, setRapport]   = useState('');
//   const [loading, setLoading]   = useState(false);

//   const ICONS: Record<string,string> = { logique:'🧠', creativite:'💡', leadership:'👑', gestion_stress:'💪', travail_equipe:'🤝', style_cognitif:'🔍' };
//   const NOMS:  Record<string,string> = { logique:'Logique', creativite:'Créativité', leadership:'Leadership', gestion_stress:'Gestion du stress', travail_equipe:'Travail en équipe', style_cognitif:'Style analytique' };

//   const start = async () => {
//     setLoading(true);
//     try {
//       const res  = await fetch(ENDPOINTS.PSYCHO_START, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include' });
//       const data: PsychoStartResult = await res.json();
//       setQuestion(data.message); setCurrent(1); setTotal(18); setPhase('question');
//     } catch { /**/ }
//     setLoading(false);
//   };

//   const submit = async () => {
//     if (!answer.trim()) return;
//     setLoading(true);
//     const ans = answer; setAnswer('');
//     try {
//       const res  = await fetch(ENDPOINTS.PSYCHO_ANSWER, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ reponse: ans }) });
//       const data: PsychoAnswerResult = await res.json();
//       if (data.complete) {
//         setScores(data.scores || {}); setRapport(data.rapport || ''); setPhase('done');
//       } else {
//         setQuestion(data.message || ''); setCurrent(data.question_actuelle || current + 1);
//       }
//     } catch { /**/ }
//     setLoading(false);
//   };

//   const pct = Math.round((current / total) * 100);

//   if (phase === 'intro') return (
//     <>
//       <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
//         18 questions adaptatives pour analyser ton profil psychologique académique. Il n&apos;y a pas de bonnes ou mauvaises réponses.
//       </p>
//       <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 14, marginBottom: 16, fontSize: 12, color: 'var(--text-secondary)' }}>
//         <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
//           <span>🧠 Logique</span><span>💡 Créativité</span><span>👑 Leadership</span>
//           <span>💪 Stress</span><span>🤝 Équipe</span><span>🔍 Style cognitif</span>
//         </div>
//       </div>
//       <button className="panel-action-btn" onClick={start} disabled={loading}>
//         <i className="fas fa-brain" /> Démarrer le test
//       </button>
//       {loading && <div className="spinner" />}
//     </>
//   );

//   if (phase === 'question') return (
//     <>
//       <div className="psycho-progress">
//         <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)' }}>
//           <span>Question {current}/{total}</span><span>{pct}%</span>
//         </div>
//         <div className="psycho-progress-bar"><div className="psycho-progress-fill" style={{ width: `${pct}%` }} /></div>
//       </div>
//       <div className="psycho-question" dangerouslySetInnerHTML={{ __html: markdownToHtml(question) }} />
//       <textarea className="psycho-input" placeholder="Ta réponse..." rows={3} value={answer} onChange={e => setAnswer(e.target.value)} />
//       <button className="panel-action-btn" onClick={submit} disabled={loading || !answer.trim()}>
//         {loading ? <><div style={{ width:16,height:16,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 0.8s linear infinite',display:'inline-block' }} /></> : <><i className="fas fa-arrow-right" /> Répondre</>}
//       </button>
//     </>
//   );

//   return (
//     <>
//       <div className="result-card" style={{ background: 'rgba(249,115,22,0.05)', borderColor: 'rgba(249,115,22,0.2)' }}>
//         <h4>✅ Résultats du test</h4>
//         <div className="scores-grid">
//           {Object.entries(scores).map(([k, v]) => (
//             <div key={k} className="score-item">
//               <span className="score-icon">{ICONS[k] || '•'}</span>
//               <span className="score-name">{NOMS[k] || k}</span>
//               <div className="score-track"><div className="score-fill" style={{ width: `${v}%` }} /></div>
//               <span className="score-pct">{v}%</span>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="result-card"><div className="prose" style={{ fontSize: 13 }} dangerouslySetInnerHTML={{ __html: markdownToHtml(rapport) }} /></div>
//     </>
//   );
// }

// // ══ Coach ══
// function CoachPanel() {
//   const [result, setResult]   = useState<CoachResult | null>(null);
//   const [loading, setLoading] = useState(false);

//   const get = async () => {
//     setLoading(true);
//     try {
//       const res  = await fetch(ENDPOINTS.COACH, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include' });
//       const data: CoachResult = await res.json();
//       setResult(data);
//     } catch { setResult({ rapport: '', error: true, message: 'Erreur. Réessaie.' }); }
//     setLoading(false);
//   };

//   return (
//     <>
//       <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
//         Rapport de coaching personnalisé avec actions concrètes pour cette semaine.
//       </p>
//       <button className="panel-action-btn" onClick={get} disabled={loading}>
//         <i className="fas fa-medal" /> Générer mon rapport coach
//       </button>
//       {loading && <><div className="spinner" /><div className="loading-text">Génération du rapport...</div></>}
//       {result && !loading && (
//         result.error
//           ? <div style={{ textAlign: 'center', padding: 16, fontSize: 13, color: 'var(--text-secondary)' }}>{result.message}</div>
//           : <div className="result-card" style={{ background: 'rgba(249,115,22,0.05)', borderColor: 'rgba(249,115,22,0.2)' }}>
//               <div className="prose" style={{ fontSize: 13 }} dangerouslySetInnerHTML={{ __html: markdownToHtml(result.rapport) }} />
//             </div>
//       )}
//     </>
//   );
// }

// // ══ Peer Match ══
// function PeerMatchPanel({ showToast }: { showToast: (msg: string) => void }) {
//   const fitscore = useSessionStore(s => s.fitscore);
//   const suggeree = fitscore?.classement?.[0]?.filiere_id || fitscore?.meilleure_filiere || null;
//   const [selected, setSelected] = useState<string | null>(suggeree);
//   const [sent, setSent] = useState(false);

//   const FILIERES = Object.entries(FILIERE_META);

//   const contact = async () => {
//     if (!selected) return;
//     await new Promise(r => setTimeout(r, 1200));
//     setSent(true);
//   };

//   return (
//     <>
//       <div style={{ textAlign: 'center', padding: '8px 0 20px' }}>
//         <div style={{ fontSize: 40, marginBottom: 12 }}>🤝</div>
//         <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Parle à un(e) étudiant(e) réel(le)</div>
//         <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 340, margin: '0 auto' }}>
//           Hésite encore ? Rien de mieux qu&apos;un retour d&apos;expérience authentique.
//         </div>
//       </div>
//       {suggeree && (
//         <div style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
//           <span>🎯</span>
//           <span style={{ color: 'var(--text-primary)' }}>D&apos;après ton FitScore, <strong style={{ color: 'var(--accent-orange)' }}>{suggeree}</strong> est présélectionnée.</span>
//         </div>
//       )}
//       <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Choisir une filière</div>
//       <div className="filiere-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
//         {FILIERES.map(([id, meta]) => (
//           <div key={id} className={`filiere-chip${selected === id ? ' selected' : ''}`}
//             style={selected === id ? { borderColor: meta.couleur, background: meta.couleur + '22' } : {}}
//             onClick={() => setSelected(id)}>
//             <div style={{ fontSize: 22, marginBottom: 4 }}>{meta.icon}</div>
//             <div className="fc-id" style={{ color: meta.couleur }}>{id}</div>
//             <div className="fc-nom">{meta.nom}</div>
//           </div>
//         ))}
//       </div>
//       <button className="panel-action-btn" onClick={contact} disabled={!selected || sent} style={{ marginTop: 8 }}>
//         <i className="fas fa-paper-plane" /> Être mis en contact
//       </button>
//       {sent && (
//         <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 12, padding: 16, marginTop: 12 }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
//             <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#22c55e,#16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🎓</div>
//             <div>
//               <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Demande envoyée à SUPMTI !</div>
//               <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Filière {selected}</div>
//             </div>
//           </div>
//           <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
//             Un(e) ambassadeur(trice) de <strong style={{ color: 'var(--accent-orange)' }}>{selected}</strong> va te contacter sous 24-48h.
//           </div>
//           <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
//             <a href="https://wa.me/212535511011" target="_blank" rel="noreferrer"
//               style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#22c55e', textDecoration: 'none' }}>
//               <i className="fab fa-whatsapp" /> WhatsApp SUPMTI
//             </a>
//             <a href={`mailto:contact@supmtimeknes.ac.ma?subject=Peer Match ${selected}`}
//               style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}>
//               <i className="fas fa-envelope" /> Email
//             </a>
//           </div>
//         </div>
//       )}
//       <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 14, marginTop: 8 }}>
//         <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>📞 Contact direct SUPMTI</div>
//         <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
//           <div>📱 +212 5 35 51 10 11</div>
//           <div>✉️ contact@supmtimeknes.ac.ma</div>
//           <div>🕐 Lun-Ven 08h30-18h00 · Sam 08h30-12h00</div>
//         </div>
//       </div>
//     </>
//   );
// }