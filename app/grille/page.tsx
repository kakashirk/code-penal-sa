import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Alert from "@/components/Alert";
import Breadcrumb from "@/components/Breadcrumb";
import GrilleClient from "@/components/GrilleClient";
import { buildReferenceLinks } from "@/lib/references";

export const metadata: Metadata = {
  title: "Grille générale des infractions",
  description:
    "Barème officiel des amendes et peines de l'État de San Andreas : catégories, niveaux, régimes de peine, peines complémentaires et calculateur de peine.",
};

export default function GrillePage() {
  const refLinks = buildReferenceLinks();
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

      <Alert type="info" title="Rappel — calcul des peines (Livre I)">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Concours d&rsquo;infractions (art. 20) :</strong> les peines de
            détention <strong>se cumulent</strong>, et les amendes se cumulent, plafonnées
            à <strong>5 000 000 $</strong> par procédure.
          </li>
          <li>
            <strong>Circonstances aggravantes (art. 21-22) :</strong> majoration de{" "}
            <strong>+50 %</strong> (générales) ou <strong>+25 %</strong> (spéciales) sur la
            détention, cumulables sans plafond.
          </li>
          <li>
            <strong>Circonstances atténuantes (art. 23) :</strong> réduction de{" "}
            <strong>−10 %</strong> chacune, sans descendre sous <strong>50 %</strong> de la
            peine après aggravantes.
          </li>
          <li>
            <strong>Tentative (art. 24) :</strong> détention divisée par 2.
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
        <GrilleClient refLinks={refLinks} />
      </Suspense>
    </div>
  );
}
