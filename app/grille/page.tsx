import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Alert from "@/components/Alert";
import Breadcrumb from "@/components/Breadcrumb";
import GrilleClient from "@/components/GrilleClient";

export const metadata: Metadata = {
  title: "Grille générale des infractions",
  description:
    "Barème officiel des amendes et peines de l'État de San Andreas : catégories, niveaux, régimes de peine et peines complémentaires.",
};

export default function GrillePage() {
  return (
    <div className="mx-auto max-w-site px-4 pb-12">
      <Breadcrumb
        items={[{ label: "Accueil", href: "/" }, { label: "Grille des infractions" }]}
      />
      <header className="mb-6 border-b-4 border-usa-gold pb-4">
        <p className="text-sm font-bold uppercase tracking-widest text-usa-dark">Annexe 2</p>
        <h1 className="mt-1 font-serif text-2xl font-black leading-tight text-usa-darkest sm:text-3xl">
          Grille générale des infractions
        </h1>
        <p className="mt-2 text-sm text-usa-gray-dark">
          Barème officiel des amendes et peines — Département de la Justice
        </p>
      </header>

      <Alert type="info" title="Rappel — calcul des peines">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Concours d&rsquo;infractions :</strong> seule la détention la plus
            élevée est retenue ; les amendes se cumulent, plafonnées à{" "}
            <strong>5 000 000 $</strong> par procédure.
          </li>
          <li>
            <strong>Circonstances aggravantes :</strong> majoration de <strong>+50 %</strong>{" "}
            (générales) ou <strong>+25 %</strong> (spéciales), cumulables.
          </li>
          <li>
            <strong>Circonstances atténuantes :</strong> réduction de <strong>−10 %</strong>{" "}
            chacune, sans descendre sous <strong>50 %</strong> de la peine.
          </li>
          <li>
            Détail complet :{" "}
            <Link href="/livres/livre-i" className="font-bold text-usa-dark underline">
              Livre I — Dispositions générales
            </Link>
            .
          </li>
        </ul>
      </Alert>

      <Suspense fallback={null}>
        <GrilleClient />
      </Suspense>
    </div>
  );
}
