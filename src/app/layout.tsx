// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider }       from "@/components/ThemeProvider";
import { AdminLayoutWrapper }  from "@/components/AdminLayoutWrapper";

export const metadata: Metadata = {
  title: "SUPMTI - Orientation IA",
  description: "Plateforme intelligente d'aide à l'orientation académique",
  icons: { icon: "/images/logo-supmti.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased transition-colors duration-300">
        <ThemeProvider>
          <AdminLayoutWrapper>
            {children}
          </AdminLayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}