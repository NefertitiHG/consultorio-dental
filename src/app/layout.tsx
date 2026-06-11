import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";

import { Navigation } from "@/components/layout/Navigation";
import { FeedbackWidget } from "@/components/ui/FeedbackWidget";
import { BirthdaySurprise } from "@/components/ui/BirthdaySurprise";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ERP Clínica Dental",
  description: "Sistema de gestión dental premium",
  manifest: "/manifest.json",
  themeColor: "#d4af37",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          <div className="flex h-screen overflow-hidden">
            <Navigation />
            
            {/* Contenido Principal */}
            <main className="flex-1 md:ml-64 pb-16 md:pb-0 overflow-y-auto">
              {children}
            </main>
            {/* Widget Global */}
            <FeedbackWidget />
            
            {/* Efecto sorpresa oculto */}
            <BirthdaySurprise />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
