import Link from "next/link";
import { INFRACTIONS } from "@/data/infractions";
import { ANNEXES, LIVRES } from "@/lib/registry";
import { IconBook, IconLoupe, IconTable, IconUser } from "@/components/icons";

const EXEMPLES = ["braquage", "excès de vitesse", "GAV", "pot de vin", "argent sale"];

export default function Home() {
  return (
    <>
      {/* Héros */}
      <section className="bg-usa-darkest text-white">
        <div className="mx-auto max-w-site px-4 py-12 sm:py-16">
          <p className="text-sm font-bold uppercase tracking-widest text-usa-gold">
            Département de la Justice
          </p>
          <h1 className="mt-2 max-w-3xl font-serif text-3xl font-black leading-tight sm:text-5xl">
            Code Pénal de l&rsquo;État de San Andreas
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-usa-gray-medium">
            La loi de l&rsquo;État, accessible à tous : les 13 Livres du Code, la grille
            officielle des infractions et les guides pratiques du citoyen comme de
            l&rsquo;agent.
          </p>
          <form action="/recherche" role="search" className="mt-8 flex max-w-2xl">
            <label htmlFor="recherche-accueil" className="sr-only">
              Rechercher dans le Code
            </label>
            <input
              id="recherche-accueil"
              name="q"
              type="search"
              placeholder="Rechercher une infraction, une procédure, un terme juridique…"
              className="h-14 w-full bg-white px-4 text-base text-usa-ink focus:outline-none focus:ring-4 focus:ring-usa-gold"
            />
            <button
              type="submit"
              aria-label="Rechercher"
              className="flex h-14 w-16 shrink-0 items-center justify-center bg-usa-red hover:bg-usa-red-dark"
            >
              <IconLoupe className="h-6 w-6 text-white" />
            </button>
          </form>
          <p className="mt-3 text-sm text-[#aeb0b5]">
            Exemples :{" "}
            {EXEMPLES.map((ex, i) => (
              <span key={ex}>
                {i > 0 && " · "}
                <Link
                  href={`/recherche?q=${encodeURIComponent(ex)}`}
                  className="underline hover:text-white"
                >
                  {ex}
                </Link>
              </span>
            ))}
          </p>
        </div>
      </section>

      {/* Accès rapide */}
      <section aria-label="Accès rapide" className="border-b border-usa-gray-medium bg-usa-gray">
        <div className="mx-auto grid max-w-site gap-4 px-4 py-8 md:grid-cols-3">
          <Link
            href="/grille"
            className="group border border-usa-gray-medium border-t-4 border-t-usa-red bg-white p-5 hover:shadow-md"
          >
            <IconTable className="h-8 w-8 text-usa-dark" />
            <p className="mt-3 font-serif text-lg font-bold text-usa-darkest group-hover:underline">
              Grille des infractions
            </p>
            <p className="mt-1 text-sm text-usa-gray-dark">
              Les {INFRACTIONS.length} infractions du Code : amendes, peines, régimes et
              peines complémentaires, avec filtres et tri.
            </p>
          </Link>
          <Link
            href="#livres"
            className="group border border-usa-gray-medium border-t-4 border-t-usa-dark bg-white p-5 hover:shadow-md"
          >
            <IconBook className="h-8 w-8 text-usa-dark" />
            <p className="mt-3 font-serif text-lg font-bold text-usa-darkest group-hover:underline">
              Les 13 Livres du Code
            </p>
            <p className="mt-1 text-sm text-usa-gray-dark">
              De la Constitution aux États d&rsquo;urgence : l&rsquo;intégralité du droit de
              San Andreas, consolidée et annotée.
            </p>
          </Link>
          <Link
            href="/annexes/annexe-6-citoyen"
            className="group border border-usa-gray-medium border-t-4 border-t-usa-gold bg-white p-5 hover:shadow-md"
          >
            <IconUser className="h-8 w-8 text-usa-dark" />
            <p className="mt-3 font-serif text-lg font-bold text-usa-darkest group-hover:underline">
              Guide du Citoyen
            </p>
            <p className="mt-1 text-sm text-usa-gray-dark">
              Vos droits lors d&rsquo;un contrôle, d&rsquo;une garde à vue ou d&rsquo;un
              procès, expliqués simplement.
            </p>
          </Link>
        </div>
      </section>

      {/* Les 13 Livres */}
      <section id="livres" className="mx-auto max-w-site scroll-mt-4 px-4 py-10">
        <h2 className="border-b-2 border-usa-gold pb-2 font-serif text-2xl font-black text-usa-darkest">
          Les 13 Livres du Code
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LIVRES.map((l) => (
            <Link
              key={l.slug}
              href={`/livres/${l.slug}`}
              className="group border border-usa-gray-medium bg-white p-4 hover:border-usa-dark hover:shadow-md"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-usa-dark">
                {l.numero}
              </p>
              <p className="mt-1 font-serif text-lg font-bold leading-snug text-usa-darkest group-hover:underline">
                {l.sousTitre}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Annexes */}
      <section aria-label="Annexes et guides pratiques" className="border-t border-usa-gray-medium bg-usa-gray">
        <div className="mx-auto max-w-site px-4 py-10">
          <h2 className="border-b-2 border-usa-gold pb-2 font-serif text-2xl font-black text-usa-darkest">
            Annexes &amp; guides pratiques
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {ANNEXES.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/annexes/${a.slug}`}
                  className="flex items-baseline gap-3 border border-usa-gray-medium bg-white px-4 py-3 hover:border-usa-dark"
                >
                  <span className="whitespace-nowrap text-xs font-bold uppercase tracking-wide text-usa-dark">
                    {a.numero}
                  </span>
                  <span className="font-semibold text-usa-darkest">{a.sousTitre}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
