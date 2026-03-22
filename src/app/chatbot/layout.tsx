import { PanelOverlay } from "@/components/panels/PanelOverlay";

/*
 * Layout chatbot — remplace le padding/scroll du root layout
 * pour permettre l'input flottant style ChatGPT
 */
export default function ChatbotLayout({ children }: { children: React.ReactNode }) {
  return (
    /*
     * h-full + overflow-hidden : prend toute la hauteur du main parent
     * relative : contexte de positionnement pour PanelOverlay
     */
    <div className="h-full flex flex-col overflow-hidden relative">
      {children}
      {/* Panels SAMI (profil, fitscore, etc.) — portail au niveau chatbot */}
      <PanelOverlay />
    </div>
  );
}