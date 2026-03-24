// 'use client';
// import Link from 'next/link';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import {
//   Bot, UserCircle, GraduationCap, Sparkles, ChevronRight,
//   BarChart3, Brain, Users, Zap, Star, ArrowRight,
//   Code2, Network, BarChart, Globe, Shield, Cpu
// } from 'lucide-react';

// // ── Compteur animé ────────────────────────────────────────────
// function Counter({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
//   const [count, setCount] = useState(0);
//   const [started, setStarted] = useState(false);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
//       { threshold: 0.5 }
//     );
//     const el = document.getElementById(`counter-${end}-${suffix}`);
//     if (el) observer.observe(el);
//     return () => observer.disconnect();
//   }, [end, suffix, started]);

//   useEffect(() => {
//     if (!started) return;
//     const steps = 60;
//     const stepTime = duration / steps;
//     let current = 0;
//     const timer = setInterval(() => {
//       current += end / steps;
//       if (current >= end) { setCount(end); clearInterval(timer); }
//       else setCount(Math.floor(current));
//     }, stepTime);
//     return () => clearInterval(timer);
//   }, [started, end, duration]);

//   return <span id={`counter-${end}-${suffix}`}>{count}{suffix}</span>;
// }

// // ── Données (Couleurs limitées : Vert, Rouge, Noir, Blanc) ────────
// const STATS = [
//   { value: 6,   suffix: '',   label: "Filières d'excellence",    icon: GraduationCap },
//   { value: 500,  suffix: '+',  label: 'Étudiants orientés',        icon: Users         },
//   { value: 98,   suffix: '%',  label: 'Taux de satisfaction',      icon: Star          },
//   { value: 3,    suffix: 'x',  label: "Plus rapide qu'un conseiller", icon: Zap        },
// ];

// const FILIERES = [
//   { id: 'ISI',   nom: 'Ingénierie des Systèmes Informatiques', icon: Code2,    color: '#006666', bg: 'bg-emerald-50 dark:bg-emerald-950/20',     border: 'border-emerald-100 dark:border-emerald-900/30',   desc: 'Dev, IA, Cloud, Cybersécurité' },
//   { id: 'ME',    nom: 'Management & Entrepreneuriat',          icon: BarChart, color: '#CC0000', bg: 'bg-red-50 dark:bg-red-950/20',       border: 'border-red-100 dark:border-red-900/30',     desc: 'Business, Finance, Startup' },
//   { id: 'IISIC', nom: 'Ingénierie Informatique & IA',          icon: Brain,    color: '#006666', bg: 'bg-emerald-50 dark:bg-emerald-950/20', border: 'border-emerald-100 dark:border-emerald-900/30', desc: 'Machine Learning, Vision, NLP' },
//   { id: 'IISRT', nom: 'Réseaux & Télécommunications',          icon: Network,  color: '#CC0000', bg: 'bg-red-50 dark:bg-red-950/20',       border: 'border-red-100 dark:border-red-900/30',     desc: 'Réseaux, IoT, 5G' },
//   { id: 'FACG',  nom: 'Finance, Audit & Comptabilité',         icon: Shield,   color: '#CC0000', bg: 'bg-red-50 dark:bg-red-950/20',   border: 'border-red-100 dark:border-red-900/30', desc: 'Audit, Contrôle, IFRS' },
//   { id: 'MSTIC', nom: 'Management SI & Transformation Digitale', icon: Globe,  color: '#006666', bg: 'bg-emerald-50 dark:bg-emerald-950/20', border: 'border-emerald-100 dark:border-emerald-900/30', desc: 'Digital, ERP, Consulting' },
// ];

// const FEATURES = [
//   { icon: BarChart3, titre: 'FitScore™',        desc: 'Calcul de compatibilité basé sur ton BAC et ton profil psychométrique.', color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
//   { icon: Brain,     titre: 'Test Psycho',       desc: 'Révèle tes forces cognitives et ta personnalité académique.',        color: 'text-red-600', bg: 'bg-red-500/10' },
//   { icon: Cpu,       titre: 'RAG Knowledge',     desc: 'Base de connaissance SUPMTI indexée et interrogeable en temps réel.',   color: 'text-emerald-600',   bg: 'bg-emerald-500/10'   },
//   { icon: Users,     titre: 'Peer Match',        desc: 'Mise en relation avec des ambassadeurs étudiants de ta filière.',      color: 'text-red-600', bg: 'bg-red-500/10' },
//   { icon: Zap,       titre: 'Coach Académique',  desc: "Plan d'action personnalisé et ressources recommandées.",               color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
//   { icon: Globe,     titre: 'Simulation Carrière', desc: 'Projection de ta carrière sur 7 ans sur le marché marocain.',         color: 'text-red-600',   bg: 'bg-red-500/10'   },
// ];

// export default function Home() {
//   const [activeFiliere, setActiveFiliere] = useState<string | null>(null);
//   const router = useRouter();

//   // Raccourci Admin : CTRL + SHIFT + A
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
//         e.preventDefault();
//         router.push('/login');
//       }
//     };
//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [router]);

//   return (
//     <div className="relative bg-white dark:bg-[#020617] text-slate-900 dark:text-white overflow-x-hidden transition-colors duration-300">

//       {/* ══════════════════════════════════════════════════════
//           HERO
//       ══════════════════════════════════════════════════════ */}
//       <section className="relative flex flex-col items-center justify-center min-h-screen px-6 py-24 overflow-hidden">
        
//         {/* Background mesh (Vert/Rouge) */}
//         <div className="absolute inset-0 pointer-events-none">
//           <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#006666]/10 dark:bg-[#006666]/20 rounded-full filter blur-3xl animate-blob" />
//           <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#CC0000]/5 dark:bg-[#CC0000]/10 rounded-full filter blur-3xl animate-blob" style={{ animationDelay: '2s' }} />
//           <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
//             style={{ backgroundImage: 'radial-gradient(circle, #006666 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
//         </div>

//         <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">
//           <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-[#006666]/20 text-[#006666] dark:text-emerald-400 text-xs font-black mb-10 shadow-lg backdrop-blur-sm uppercase tracking-widest animate-in fade-in slide-in-from-top-4 duration-700">
//             <Sparkles size={12} className="animate-pulse" />
//             SAMI v2.0 · Assistant IA SUPMTI 2026
//           </div>

//           <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[0.95] tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
//             Ton orientation,<br />
//             <span className="relative inline-block mt-2">
//               <span className="text-[#006666] dark:text-emerald-400">redéfinie</span>
//               <span className="absolute -bottom-2 left-0 right-0 h-1.5 bg-[#CC0000] rounded-full" />
//             </span>
//             {' '}par l'IA.
//           </h1>

//           <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl max-w-2xl mb-12 animate-in fade-in duration-700 delay-200">
//             L'intelligence artificielle qui décode ton potentiel pour t'orienter vers les métiers de demain.
//           </p>

//           <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
//             <Link href="/login" className="group flex items-center justify-center gap-3 bg-[#006666] hover:bg-[#004d4d] text-white px-10 py-5 rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-[#006666]/30 hover:scale-105 transition-all">
//               <UserCircle size={22} />
//               Calculer mon FitScore
//               <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
//             </Link>
//             <Link href="/chatbot" className="flex items-center justify-center gap-3 border-2 border-gray-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md px-10 py-5 rounded-2xl font-bold text-lg hover:border-[#006666] transition-all">
//               <Bot size={22} />
//               Essayer gratuitement
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* ══════════════════════════════════════════════════════
//           STATS & FEATURES (Version simplifiée Vert/Rouge/Noir)
//       ══════════════════════════════════════════════════════ */}
//       <section className="py-20 px-6 bg-gray-50 dark:bg-slate-900/50 border-y border-gray-100 dark:border-slate-800">
//         <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
//           {STATS.map(({ value, suffix, label, icon: Icon }) => (
//             <div key={label} className="flex flex-col items-center text-center group">
//               <div className="w-14 h-14 rounded-2xl bg-[#006666]/10 flex items-center justify-center mb-4 group-hover:bg-[#CC0000]/10 transition-colors">
//                 <Icon size={24} className="text-[#006666] dark:text-emerald-400 group-hover:text-[#CC0000]" />
//               </div>
//               <div className="text-4xl font-black mb-1">
//                 <Counter end={value} suffix={suffix} />
//               </div>
//               <p className="text-sm text-gray-500 font-medium">{label}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       <section className="py-28 px-6">
//         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
//           {FEATURES.map(({ icon: Icon, titre, desc, color, bg }) => (
//             <div key={titre} className="group p-8 rounded-3xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/30 transition-all hover:-translate-y-1">
//               <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center mb-6`}>
//                 <Icon size={22} className={color} />
//               </div>
//               <h3 className="text-xl font-black mb-3">{titre}</h3>
//               <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ══════════════════════════════════════════════════════
//           FILIÈRES
//       ══════════════════════════════════════════════════════ */}
//       <section className="py-28 px-6 bg-gray-50 dark:bg-slate-900/30">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-16">
//             <p className="text-[#CC0000] text-xs font-black uppercase tracking-widest mb-3">Nos Formations</p>
//             <h2 className="text-4xl md:text-5xl font-black tracking-tight">L'excellence au service de l'avenir.</h2>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//             {FILIERES.map(({ id, nom, icon: Icon, color, bg, border, desc }) => (
//               <div
//                 key={id}
//                 onMouseEnter={() => setActiveFiliere(id)}
//                 onMouseLeave={() => setActiveFiliere(null)}
//                 className={`group relative p-6 rounded-3xl border-2 bg-white dark:bg-slate-900 transition-all cursor-pointer hover:scale-[1.02] border-transparent hover:border-emerald-500/50`}
//               >
//                 <div className="flex items-start justify-between mb-4">
//                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm`} style={{ backgroundColor: color + '15' }}>
//                     <Icon size={22} style={{ color }} />
//                   </div>
//                   <span className="text-xs font-black px-3 py-1 rounded-full bg-gray-100 dark:bg-slate-800">{id}</span>
//                 </div>
//                 <h3 className="font-black mb-1 leading-tight">{nom}</h3>
//                 <p className="text-xs text-gray-500 mb-4">{desc}</p>
//                 <div className="flex items-center gap-2 text-xs font-bold" style={{ color }}>
//                   Détails du programme <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ══════════════════════════════════════════════════════
//           FOOTER & ADMIN
//       ══════════════════════════════════════════════════════ */}
//       <div className="py-12 px-6 border-t border-gray-100 dark:border-slate-800">
//         <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
//           <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">
//             © 2026 SUPMTI Meknès · SAMI Projet IA
//           </p>
          
//           <div className="flex items-center gap-6">
//             {['RAG', 'EmotionSense', 'PeerMatch'].map(t => (
//               <span key={t} className="text-[10px] font-black text-gray-300 dark:text-slate-700 italic">{t}</span>
//             ))}
//           </div>

//           {/* Accès Admin discret (Visuel + Raccourci actif) */}
//           <Link 
//             href="/login" 
//             className="flex items-center gap-2 text-[10px] text-gray-300 dark:text-slate-700 hover:text-emerald-500 transition-all font-mono group"
//           >
//             <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-slate-800 group-hover:bg-emerald-500 animate-pulse" />
//             SYS_SECURE_AUTH
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bot, UserCircle, GraduationCap, Sparkles, ChevronRight,
  BarChart3, Brain, Users, Zap, Star, ArrowRight,
  Code2, Network, BarChart, Globe, Shield, Cpu, Briefcase, Landmark
} from 'lucide-react';

// ── COMPOSANTS UTILITAIRES ────────────────────────────────────

function Counter({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setStarted(true); }, { threshold: 0.5 });
    const el = document.getElementById(`counter-${end}`);
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [end]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, end, duration]);
  return <span id={`counter-${end}`}>{count}{suffix}</span>;
}

// ── DONNÉES ──────────────────────────────────────────────────

const STATS = [
  { value: 7, suffix: '', label: "Filières d'excellence", icon: GraduationCap },
  { value: 500, suffix: '+', label: 'Étudiants orientés', icon: Users },
  { value: 98, suffix: '%', label: 'Taux de satisfaction', icon: Star },
  { value: 3, suffix: 'x', label: "Plus rapide qu'un conseiller", icon: Zap },
];

const DEPARTEMENTS = [
  {
    nom: "Management & Finance",
    color: "#CC0000",
    filières: [
      { id: 'MGE', nom: "Management de l'Entreprise", level: 'BAC+3', icon: BarChart, desc: 'Pilotage, Marketing & Stratégie' },
      { id: 'MDI', nom: 'Management et Dév. International', level: 'BAC+3', icon: Globe, desc: 'Commerce global & Import-Export' },
      { id: 'FACG', nom: 'Finance, Audit et Contrôle de Gestion', level: 'BAC+5', icon: Shield, desc: 'Expertise financière & Audit' },
      { id: 'MRI', nom: 'Management et Relations Internationales', level: 'BAC+5', icon: Landmark, desc: 'Diplomatie & Stratégie mondiale' },
    ]
  },
  {
    nom: "Ingénierie (ISI)",
    color: "#006666",
    filières: [
      { id: 'IISI', nom: 'Ing. Intelligente des Systèmes Info', level: 'BAC+3', icon: Code2, desc: 'Développement Web & IA' },
      { id: 'IISIC', nom: "Ing. Intelligente des Systèmes d'Info", level: 'BAC+5', icon: Brain, desc: 'Architecture SI & Data Science' },
      { id: 'IISRT', nom: 'Ing. Intelligente Réseaux & Télécoms', level: 'BAC+5', icon: Network, desc: 'Cybersécurité & Cloud' },
    ]
  }
];

const FEATURES = [
  { icon: BarChart3, titre: 'FitScore™', desc: 'Calcul de compatibilité basé sur ton profil psychométrique.', color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  { icon: Brain, titre: 'Test Psycho', desc: 'Révèle tes forces cognitives et ta personnalité académique.', color: 'text-red-600', bg: 'bg-red-500/10' },
  { icon: Cpu, titre: 'RAG Knowledge', desc: 'Base de connaissance SUPMTI interrogeable en temps réel.', color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  { icon: Users, titre: 'Peer Match', desc: 'Mise en relation avec des ambassadeurs étudiants.', color: 'text-red-600', bg: 'bg-red-500/10' },
  { icon: Zap, titre: 'Coach Académique', desc: "Plan d'action personnalisé et ressources recommandées.", color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  { icon: Globe, titre: 'Simulation Carrière', desc: 'Projection de ta carrière sur le marché marocain.', color: 'text-red-600', bg: 'bg-red-500/10' },
];

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        router.push('/login');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  return (
    <div className="bg-white dark:bg-[#020617] text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* ── HERO SECTION ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#006666]/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#CC0000]/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
            <Sparkles size={14} className="text-[#006666] animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase">SAMI v2.0 • IA Orientation SUPMTI</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">
            Ton futur est <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#006666] to-[#CC0000]">déjà écrit.</span>
          </h1>

          <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
            L'intelligence artificielle qui décode ton potentiel pour t'orienter vers les métiers de demain à SUPMTI Meknès.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="group flex items-center justify-center gap-3 bg-[#006666] text-white px-10 py-5 rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-[#006666]/40 transition-all hover:-translate-y-1">
              <UserCircle size={22} /> Calculer mon FitScore
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/chatbot" className="flex items-center justify-center gap-3 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 px-10 py-5 rounded-2xl font-black text-lg hover:border-[#CC0000] transition-all">
              <Bot size={22} /> Essayer SAMI
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section className="py-20 border-y border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/50">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          {STATS.map(({ value, suffix, label, icon: Icon }) => (
            <div key={label} className="text-center group">
              <div className="inline-flex p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-sm mb-4 group-hover:scale-110 transition-transform">
                <Icon size={24} className="text-[#006666]" />
              </div>
              <div className="text-4xl font-black mb-1 italic">
                <Counter end={value} suffix={suffix} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CAROUSEL FEATURES ── */}
      <section className="py-24 overflow-hidden">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black uppercase tracking-tighter">Technologie d'Orientation</h2>
        </div>
        <div className="flex animate-marquee space-x-6 whitespace-nowrap">
          {[...FEATURES, ...FEATURES].map((f, i) => (
            <div key={i} className="inline-block w-[300px] p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shrink-0">
              <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center mb-6`}>
                <f.icon size={22} className={f.color} />
              </div>
              <h3 className="text-xl font-black mb-2 whitespace-normal">{f.titre}</h3>
              <p className="text-sm text-slate-500 whitespace-normal leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
        
        <style jsx global>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}</style>
      </section>

      {/* ── FILIÈRES (LES 7 FILIÈRES) ── */}
      <section className="py-32 px-6 bg-slate-50 dark:bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-[#CC0000] font-black uppercase tracking-[0.3em] text-[10px]">Parcours Académiques</span>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter mt-4 italic">7 Filières, 2 Départements.</h2>
          </div>

          <div className="space-y-32">
            {DEPARTEMENTS.map((dept) => (
              <div key={dept.nom}>
                <div className="flex items-center gap-4 mb-12 border-b-4 border-slate-900 dark:border-white pb-4">
                   <h3 className="text-3xl font-black uppercase tracking-tighter">{dept.nom}</h3>
                   <div className="flex-1 h-[2px] bg-slate-100 dark:bg-slate-800" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {dept.filières.map((f) => (
                    <div 
                      key={f.id} 
                      className="group relative bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden transition-all hover:-translate-y-2"
                    >
                      {/* Glow Effect */}
                      <div 
                        className="absolute -top-24 -right-24 w-48 h-48 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500" 
                        style={{ backgroundColor: dept.color, filter: 'blur(40px)' }}
                      />
                      
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-8">
                          <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white group-hover:scale-110 transition-transform">
                            <f.icon size={26} style={{ color: dept.color }} />
                          </div>
                          <span className="text-[10px] font-black px-3 py-1.5 rounded-full bg-black text-white dark:bg-white dark:text-black">
                            {f.level}
                          </span>
                        </div>
                        
                        <div className="mb-8">
                          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: dept.color }}>{f.id}</p>
                          <h4 className="text-xl font-black leading-[1.1] group-hover:underline decoration-2 underline-offset-4">{f.nom}</h4>
                        </div>
                        
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">{f.desc}</p>
                        
                        <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest group-hover:gap-4 transition-all">
                          Détails <ArrowRight size={16} style={{ color: dept.color }} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-20 px-6 border-t border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
             <div className="text-2xl font-black tracking-tighter">SUPMTI <span className="text-[#CC0000]">MEKNÈS</span></div>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">© 2026 SAMI PROJECT • ALL RIGHTS RESERVED</p>
          </div>

          <div className="flex gap-12">
            {['RAG Engine', 'Vector DB', 'NextJS 14'].map(t => (
              <span key={t} className="text-[10px] font-black text-slate-300 dark:text-slate-800 uppercase tracking-widest italic">{t}</span>
            ))}
          </div>

          <Link href="/login" className="flex items-center gap-3 text-[10px] font-mono text-slate-400 hover:text-[#006666] transition-colors group">
            <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800 group-hover:bg-[#006666] animate-pulse" />
            SECURE_ACCESS_ADMIN
          </Link>
        </div>
      </footer>
    </div>
  );
}