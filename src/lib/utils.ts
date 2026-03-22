import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/* ── Tailwind merge helper ── */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ── Markdown → HTML (identique index.html) ── */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;',
  };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}

export function markdownToHtml(text: string): string {
  if (!text) return '';
  let h = escapeHtml(text);
  h = h.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  h = h.replace(/\*(.*?)\*/g,     '<em>$1</em>');
  h = h.replace(/^### (.*$)/gim,  '<h3>$1</h3>');
  h = h.replace(/^## (.*$)/gim,   '<h2>$1</h2>');
  h = h.replace(/^---$/gim,       '<hr>');
  h = h.replace(/^\s*[-•]\s+(.*$)/gim, '<li>$1</li>');
  h = h.replace(/(<li>[\s\S]*?<\/li>)/m, '<ul>$1</ul>');
  h = h.replace(/^\s*\d+\)\s+(.*$)/gim, '<li>$1</li>');
  h = h.replace(/`(.*?)`/g,       '<code>$1</code>');
  h = h.replace(/\n{2,}/g,        '</p><p>');
  h = h.replace(/\n/g,            '<br>');
  h = '<p>' + h + '</p>';
  h = h.replace(/<p><\/p>/g,           '');
  h = h.replace(/<p>(<h[23]>)/g,       '$1');
  h = h.replace(/(<\/h[23]>)<\/p>/g,   '$1');
  h = h.replace(/<p>(<ul>)/g,          '$1');
  h = h.replace(/(<\/ul>)<\/p>/g,      '$1');
  h = h.replace(/<p>(<hr>)<\/p>/g,     '$1');
  return h;
}