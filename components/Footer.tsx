import Link from "next/link";
import Seal from "./Seal";
import { ANNEXES, LIVRES } from "@/lib/registry";

const lienFooter = "text-[13px] text-white/85 hover:text-white hover:underline";

export default function Footer() {
  return (
    <footer className="mt-12">
      <div className="border-t border-usa-gray-medium bg-usa-gray">
        <div className="mx-auto max-w-site px-4 py-2 text-right">
          <a href="#" className="text-sm text-usa-dark underline hover:text-usa-darkest">
            Retour en haut de la page
          </a>
        </div>
      </div>
      <div className="bg-usa-darkest text-white">
        <div className="mx-auto grid max-w-site gap-8 px-4 py-10 md:grid-cols-3">
          <nav aria-label="Les 13 Livres du Code">
            <h2 className="mb-3 border-b border-usa-dark pb-2 font-serif text-base font-bold">
              Les 13 Livres du Code
            </h2>
            <ul className="space-y-1.5">
              {LIVRES.map((l) => (
                <li key={l.slug}>
                  <Link href={`/livres/${l.slug}`} className={lienFooter}>
                    {l.numero} — {l.sousTitre}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Annexes et guides">
            <h2 className="mb-3 border-b border-usa-dark pb-2 font-serif text-base font-bold">
              Annexes &amp; guides
            </h2>
            <ul className="space-y-1.5">
              {ANNEXES.map((a) => (
                <li key={a.slug}>
                  <Link href={`/annexes/${a.slug}`} className={lienFooter}>
                    {a.numero} — {a.sousTitre}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Accès rapide">
            <h2 className="mb-3 border-b border-usa-dark pb-2 font-serif text-base font-bold">
              Accès rapide
            </h2>
            <ul className="space-y-1.5">
              <li>
                <Link href="/" className={lienFooter}>
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/grille" className={lienFooter}>
                  Grille générale des infractions
                </Link>
              </li>
              <li>
                <Link href="/recherche" className={lienFooter}>
                  Recherche dans le Code
                </Link>
              </li>
              <li>
                <Link href="/annexes/annexe-6-citoyen" className={lienFooter}>
                  Guide du Citoyen
                </Link>
              </li>
              <li>
                <Link href="/annexes/annexe-7-glossaire" className={lienFooter}>
                  Glossaire juridique
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="bg-[#0b2140] text-white">
        <div className="mx-auto flex max-w-site flex-col items-center gap-4 px-4 py-6 text-center sm:flex-row sm:text-left">
          <Seal size={64} />
          <div>
            <p className="font-serif font-bold">
              État de San Andreas — Département de la Justice
            </p>
            <p className="mt-1 text-sm text-[#aeb0b5]">
              © État de San Andreas — Département de la Justice · SpaceNew Roleplay
            </p>
            <p className="mt-1 text-xs text-[#aeb0b5]">
              Portail fictif du serveur GTA RP SpaceNew. Toute ressemblance avec des
              institutions réelles relève de la fiction.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
