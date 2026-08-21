import type { Metadata } from "next";
import { Merriweather, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Nav from "@/components/Nav";
import TopBanner from "@/components/TopBanner";

const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-merriweather",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Code Pénal de l'État de San Andreas",
    template: "%s | Code Pénal de San Andreas",
  },
  description:
    "Portail officiel du Département de la Justice de l'État de San Andreas : les 13 Livres du Code, la grille générale des infractions et les guides pratiques. Serveur SpaceNew Roleplay.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${merriweather.variable} ${sourceSans.variable}`}>
      <body className="flex min-h-screen flex-col bg-white font-sans text-usa-ink">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-usa-gold focus:px-4 focus:py-2 focus:font-bold focus:text-usa-darkest"
        >
          Aller au contenu principal
        </a>
        <TopBanner />
        <Header />
        <Nav />
        <main id="contenu" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
