// 'use client';
// import { cn } from '@/lib/utils';
// import { AlertCircle, Loader2 } from 'lucide-react';

// // ─── Spinner (Plus dynamique) ────────────────────────────────────────────────
// export const Spinner = ({ label = "Analyse en cours..." }: { label?: string }) => (
//   <div className="flex flex-col items-center py-10 gap-4 animate-in fade-in duration-500">
//     <div className="relative">
//       <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full animate-pulse" />
//       <Loader2 className="w-10 h-10 text-orange-500 animate-spin relative" strokeWidth={2.5} />
//     </div>
//     <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] animate-pulse">
//       {label}
//     </p>
//   </div>
// );

// // ─── Error box (Plus sérieux) ────────────────────────────────────────────────
// export const ErrorBox = ({ message }: { message: string }) => (
//   <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-5 flex flex-col items-center gap-3 animate-in shake-in duration-500">
//     <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
//       <AlertCircle size={20} />
//     </div>
//     <p className="text-xs font-medium text-rose-600 dark:text-rose-400 text-center leading-relaxed">
//       {message}
//     </p>
//   </div>
// );

// // ─── Action button (Effet Glassmorphism) ──────────────────────────────────────
// interface ActionBtnProps {
//   onClick: () => void;
//   children: React.ReactNode;
//   disabled?: boolean;
//   variant?: 'primary' | 'secondary' | 'danger';
//   className?: string;
// }

// export const ActionBtn = ({ onClick, children, disabled, variant = 'primary', className }: ActionBtnProps) => {
//   const variants = {
//     primary: 'bg-[#006666] text-white shadow-lg shadow-[#006666]/20 hover:bg-[#005555] active:scale-[0.97]',
//     secondary: 'bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.1] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/[0.08]',
//     danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-600/20'
//   };

//   return (
//     <button
//       onClick={onClick}
//       disabled={disabled}
//       className={cn(
//         'w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all duration-300 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed',
//         variants[variant],
//         className
//       )}
//     >
//       {children}
//     </button>
//   );
// };

// // ─── Result card (Effet Profondeur) ──────────────────────────────────────────
// export const ResultCard = ({ children, accent, className }: { children: React.ReactNode; accent?: boolean; className?: string }) => (
//   <div className={cn(
//     'rounded-3xl border-2 p-5 mb-4 transition-all duration-500 overflow-hidden relative',
//     accent
//       ? 'bg-gradient-to-br from-orange-500/[0.07] to-transparent border-orange-500/20 shadow-xl shadow-orange-500/5'
//       : 'bg-white dark:bg-slate-900/40 border-slate-100 dark:border-white/[0.05] shadow-sm',
//     className
//   )}>
//     {accent && <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 blur-[40px] rounded-full -mr-10 -mt-10" />}
//     <div className="relative z-10">{children}</div>
//   </div>
// );

// // ─── Score bar (Ultra-moderne) ────────────────────────────────────────────────
// export const ScoreBar = ({ label, value }: { label: string; value: number }) => (
//   <div className="group space-y-2 mb-4 last:mb-0">
//     <div className="flex justify-between items-end">
//       <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider group-hover:text-[#006666] transition-colors">
//         {label}
//       </span>
//       <span className="text-xs font-black text-[#006666] dark:text-emerald-400">{value}%</span>
//     </div>
//     <div className="h-2.5 bg-slate-100 dark:bg-white/[0.05] rounded-full p-[3px] border border-slate-200/50 dark:border-white/[0.03]">
//       <div
//         className="h-full rounded-full bg-gradient-to-r from-[#006666] to-emerald-400 shadow-[0_0_12px_rgba(0,102,102,0.3)] transition-all duration-1000 ease-out"
//         style={{ width: `${value}%` }}
//       />
//     </div>
//   </div>
// );

// // ─── Markdown renderer (Prose Sublimée) ──────────────────────────────────────
// export const Prose = ({ content, className }: { content: string; className?: string }) => {
//   const html = markdownToHtml(content);
//   return (
//     <div
//       className={cn(
//         "prose-custom text-sm leading-relaxed text-slate-600 dark:text-slate-300 space-y-3",
//         className
//       )}
//       dangerouslySetInnerHTML={{ __html: html }}
//     />
//   );
// };

// // ─── Markdown Logic (Nettoyée) ───────────────────────────────────────────────
// function escapeHtml(text: string) {
//   const map: Record<string, string> = { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' };
//   return String(text).replace(/[&<>"']/g, m => map[m]);
// }

// function markdownToHtml(text: string) {
//   if (!text) return '';
//   let html = escapeHtml(text);
  
//   // Bold & Accent
//   html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#006666] dark:text-emerald-400 font-black">$1</strong>');
  
//   // Headers
//   html = html.replace(/^### (.*$)/gim, '<h4 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-6 mb-2">$1</h4>');
//   html = html.replace(/^## (.*$)/gim, '<h3 class="text-slate-900 dark:text-white font-black text-sm mt-8 mb-3 uppercase tracking-tight">$1</h3>');
  
//   // Listes
//   html = html.replace(/^\s*[-•]\s+(.*$)/gim, '<div class="flex gap-3 mb-1.5"><span class="text-emerald-500 font-bold">•</span><span class="flex-1">$1</span></div>');
  
//   // Code & Divider
//   html = html.replace(/`(.*?)`/g, '<code class="bg-slate-100 dark:bg-white/10 px-1.5 py-0.5 rounded text-[11px] font-mono text-emerald-600 dark:text-emerald-400">$1</code>');
//   html = html.replace(/^---$/gim, '<div class="h-[1px] bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent my-6"></div>');
  
//   // Paragraphes
//   html = html.replace(/\n{2,}/g, '</p><p class="mt-4">');
//   html = '<p>' + html + '</p>';
  
//   return html;
// }


'use client';
import { cn } from '@/lib/utils';
import { AlertCircle, Loader2 } from 'lucide-react';

// ─── Spinner — 2 modes : fullscreen (défaut) + inline ────────
export const Spinner = ({
  label = "Analyse en cours...",
  inline = false,
}: {
  label?: string;
  inline?: boolean;
}) => {
  if (inline) {
    return <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} />;
  }
  return (
    <div className="flex flex-col items-center py-10 gap-4 animate-in fade-in duration-500">
      <div className="relative">
        <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full animate-pulse" />
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin relative" strokeWidth={2.5} />
      </div>
      <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] animate-pulse">
        {label}
      </p>
    </div>
  );
};

// ─── Error box ───────────────────────────────────────────────
export const ErrorBox = ({ message }: { message: string }) => (
  <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-5 flex flex-col items-center gap-3 animate-in shake-in duration-500">
    <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
      <AlertCircle size={20} />
    </div>
    <p className="text-xs font-medium text-rose-600 dark:text-rose-400 text-center leading-relaxed">
      {message}
    </p>
  </div>
);

// ─── Action button ────────────────────────────────────────────
interface ActionBtnProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
}

export const ActionBtn = ({
  onClick, children, disabled, variant = 'primary', className,
}: ActionBtnProps) => {
  const variants = {
    primary:   'bg-[#006666] text-white shadow-lg shadow-[#006666]/20 hover:bg-[#005555] active:scale-[0.97]',
    secondary: 'bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.1] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/[0.08]',
    danger:    'bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-600/20',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all duration-300 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed',
        variants[variant],
        className
      )}
    >
      {children}
    </button>
  );
};

// ─── Result card ──────────────────────────────────────────────
export const ResultCard = ({
  children, accent, className,
}: {
  children: React.ReactNode;
  accent?: boolean;
  className?: string;
}) => (
  <div className={cn(
    'rounded-3xl border-2 p-5 mb-4 transition-all duration-500 overflow-hidden relative',
    accent
      ? 'bg-gradient-to-br from-orange-500/[0.07] to-transparent border-orange-500/20 shadow-xl shadow-orange-500/5'
      : 'bg-white dark:bg-slate-900/40 border-slate-100 dark:border-white/[0.05] shadow-sm',
    className
  )}>
    {accent && (
      <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 blur-[40px] rounded-full -mr-10 -mt-10" />
    )}
    <div className="relative z-10">{children}</div>
  </div>
);

// ─── Score bar ────────────────────────────────────────────────
export const ScoreBar = ({ label, value }: { label: string; value: number }) => (
  <div className="group space-y-2 mb-4 last:mb-0">
    <div className="flex justify-between items-end">
      <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider group-hover:text-[#006666] transition-colors">
        {label}
      </span>
      <span className="text-xs font-black text-[#006666] dark:text-emerald-400">{value}%</span>
    </div>
    <div className="h-2.5 bg-slate-100 dark:bg-white/[0.05] rounded-full p-[3px] border border-slate-200/50 dark:border-white/[0.03]">
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#006666] to-emerald-400 shadow-[0_0_12px_rgba(0,102,102,0.3)] transition-all duration-1000 ease-out"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

// ─── Markdown renderer ────────────────────────────────────────
export const Prose = ({
  content, className,
}: {
  content: string;
  className?: string;
}) => {
  const html = markdownToHtml(content);
  return (
    <div
      className={cn(
        "prose-custom text-sm leading-relaxed text-slate-600 dark:text-slate-300 space-y-3",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

// ─── Markdown → HTML ─────────────────────────────────────────
function escapeHtml(text: string) {
  const map: Record<string, string> = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;',
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

function markdownToHtml(text: string) {
  if (!text) return '';
  let html = escapeHtml(text);

  // Bold accent
  html = html.replace(
    /\*\*(.*?)\*\*/g,
    '<strong class="text-[#006666] dark:text-emerald-400 font-black">$1</strong>'
  );

  // Headers
  html = html.replace(
    /^### (.*$)/gim,
    '<h4 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-6 mb-2">$1</h4>'
  );
  html = html.replace(
    /^## (.*$)/gim,
    '<h3 class="text-slate-900 dark:text-white font-black text-sm mt-8 mb-3 uppercase tracking-tight">$1</h3>'
  );

  // Listes
  html = html.replace(
    /^\s*[-•]\s+(.*$)/gim,
    '<div class="flex gap-3 mb-1.5"><span class="text-emerald-500 font-bold">•</span><span class="flex-1">$1</span></div>'
  );

  // Code
  html = html.replace(
    /`(.*?)`/g,
    '<code class="bg-slate-100 dark:bg-white/10 px-1.5 py-0.5 rounded text-[11px] font-mono text-emerald-600 dark:text-emerald-400">$1</code>'
  );

  // Divider
  html = html.replace(
    /^---$/gim,
    '<div class="h-[1px] bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent my-6"></div>'
  );

  // Paragraphes
  html = html.replace(/\n{2,}/g, '</p><p class="mt-4">');
  html = '<p>' + html + '</p>';

  return html;
}