'use client';
import { User, MapPin, GraduationCap, BarChart, Lightbulb, Target, MessageSquare } from 'lucide-react';
import { usePanelStore }   from '@/store/panelStore';
import { useSessionStore } from '@/store/sessionStore';
import { ActionBtn } from './ui';
import { cn } from '@/lib/utils';

export const ProfilPanel = () => {
  const { closePanel } = usePanelStore();
  const { profil }     = useSessionStore();

  const info  = profil?.informations_personnelles;
  const parc  = profil?.parcours_academique;
  const pref  = profil?.preferences;
  const notes = parc?.notes_matieres || {};
  const hasProfile = info?.prenom && info.prenom !== 'Étudiant';

  // --- État Vide : Incitation au Chat ---
  if (!hasProfile) {
    return (
      <div className="flex flex-col items-center text-center py-12 px-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full"></div>
          <div className="relative w-20 h-20 bg-slate-900 border border-white/10 rounded-3xl flex items-center justify-center text-4xl shadow-2xl">
            👤
          </div>
        </div>
        <h3 className="font-black text-white text-lg mb-2 uppercase tracking-tight">Identité inconnue</h3>
        <p className="text-xs text-slate-400 leading-relaxed mb-8">
          SAMI n'a pas encore assez de données pour dresser ton profil. Parle-lui de ton <span className="text-orange-400 font-bold">parcours</span> ou de tes <span className="text-orange-400 font-bold">ambitions</span>.
        </p>
        <div className="w-full p-4 bg-white/[0.03] border border-dashed border-white/10 rounded-2xl mb-6">
          <p className="text-[10px] text-slate-500 italic">"Je m'appelle Corneil, j'ai un BAC Info et je vise un Master en IA."</p>
        </div>
        <ActionBtn onClick={() => closePanel()} className="w-full bg-[#006666] text-white py-4 font-bold">
          <MessageSquare size={18} className="mr-2" /> Compléter mon profil
        </ActionBtn>
      </div>
    );
  }

  // --- Sous-composants Sublimés ---
  const Row = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: string, color?: string }) => (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-slate-100 dark:border-white/[0.03] last:border-none hover:bg-slate-50 dark:hover:bg-white/[0.01] transition-colors">
      <div className={cn("shrink-0 p-1.5 rounded-lg bg-slate-100 dark:bg-white/5", color || "text-slate-400")}>
        <Icon size={14} />
      </div>
      <div className="flex flex-col">
        <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</span>
        <span className="text-[13px] text-slate-700 dark:text-slate-200 font-bold leading-tight">{value}</span>
      </div>
    </div>
  );

  const Section = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/[0.07] rounded-2xl overflow-hidden mb-5 shadow-sm">
      <div className="px-4 py-2.5 bg-slate-50 dark:bg-white/[0.03] border-b border-slate-200 dark:border-white/[0.07] flex items-center gap-2">
        <Icon size={12} className="text-orange-500" />
        <h3 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">{title}</h3>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-white/[0.03]">
        {children}
      </div>
    </div>
  );

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      {/* Header Profil */}
      <div className="flex items-center gap-4 mb-8 px-1">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#006666] to-emerald-600 flex items-center justify-center text-white shadow-xl">
          <User size={28} />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tighter">
            {info?.prenom}
          </h2>
          <div className="flex items-center gap-2 mt-0.5">
             <div className={cn(
               "h-2 w-2 rounded-full",
               profil?.statut_profil === 'complet' ? 'bg-emerald-500 animate-pulse' : 'bg-orange-500'
             )} />
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
               Profil {profil?.statut_profil}
             </span>
          </div>
        </div>
      </div>

      {/* Sections de données */}
      <Section title="Informations" icon={User}>
        {info?.prenom && <Row icon={User} label="Prénom" value={info.prenom} />}
        {(info?.ville || info?.pays) && (
          <Row icon={MapPin} label="Localisation" value={`${info.ville || ''}${info.ville && info.pays ? ', ' : ''}${info.pays || ''}`} />
        )}
      </Section>

      <Section title="Cursus" icon={GraduationCap}>
        {parc?.type_bac && parc.type_bac !== 'AUTRE' && (
          <Row icon={GraduationCap} label="Diplôme BAC" value={parc.label_bac || parc.type_bac} color="text-blue-500" />
        )}
        {parc?.moyenne_generale && parc.moyenne_generale > 0 && (
          <Row icon={BarChart} label="Performance" value={`${parc.moyenne_generale}/20 — ${parc.mention || 'Passable'}`} color="text-emerald-500" />
        )}
        {parc?.niveau_actuel && (
          <Row icon={Target} label="Niveau actuel" value={parc.niveau_actuel} />
        )}
        {Object.keys(notes).length > 0 && (
          <div className="p-4 bg-slate-50 dark:bg-white/[0.02]">
             <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Relevé partiel</p>
             <div className="flex flex-wrap gap-2">
                {Object.entries(notes).map(([m, n]) => (
                  <span key={m} className="px-2 py-1 rounded-md bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                    {m}: <span className="text-[#006666]">{n}</span>
                  </span>
                ))}
             </div>
          </div>
        )}
      </Section>

      {pref?.centres_interet && pref.centres_interet.length > 0 && (
        <Section title="Objectifs" icon={Lightbulb}>
          <Row icon={Lightbulb} label="Centres d'intérêt" value={pref.centres_interet.join(', ')} color="text-yellow-500" />
          {pref.ambition_professionnelle && (
            <Row icon={Target} label="Ambition" value={pref.ambition_professionnelle} color="text-rose-500" />
          )}
        </Section>
      )}

      {/* Footer info */}
      <p className="text-[10px] text-slate-400 text-center mt-6 italic">
        Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
      </p>
    </div>
  );
};