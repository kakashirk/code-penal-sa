import { Suspense } from "react";
import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import SearchClient from "@/components/SearchClient";
import { buildSearchIndex } from "@/lib/search-index";

export const metadata: Metadata = {
  title: "Recherche",
  description:
    "Recherche globale dans le Code Pénal de San Andreas : infractions, livres, annexes et glossaire juridique, en langage naturel.",
};

export default function RecherchePage() {
  const index = buildSearchIndex();
  return (
    <div className="mx-auto max-w-site px-4 pb-12">
      <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Recherche" }]} />
      <div className="mx-auto max-w-3xl">
        <header className="mb-6">
          <h1 className="font-serif text-2xl font-black text-usa-darkest sm:text-3xl">
            Recherche dans le Code
          </h1>
          <p className="mt-2 text-sm text-usa-gray-dark">
            Infractions, procédures et définitions — la recherche comprend le langage
            courant : «&nbsp;on m&rsquo;a volé ma voiture&nbsp;», «&nbsp;pot de
            vin&nbsp;», «&nbsp;GAV&nbsp;»…
          </p>
        </header>
        <Suspense fallback={null}>
          <SearchClient entries={index} />
        </Suspense>
      </div>
    </div>
  );
}
