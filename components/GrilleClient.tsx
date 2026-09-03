"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import {
  CATEGORIES,
  INFRACTIONS,
  NIVEAUX,
  NIVEAU_LABELS,
  REGIME_LABELS,
  type Infraction,
  type Niveau,
  type Regime,
} from "@/data/infractions";
import NiveauBadge from "./NiveauBadge";
import { IconChevron, IconLoupe } from "./icons";

type SortKey =
  | "nom"
  | "categorie"
  | "niveau"
  | "amendeNum"
  | "peineMinutes"
  | "regime"
  | "reference";

interface SortState {
  key: SortKey;
  dir: 1 | -1;
}

const REGIME_ORDRE: Record<Regime, number> = { A: 0, S: 1, P: 2, F: 3 };
const REGIME_CLES: Regime[] = ["A", "S", "P", "F"];

const PLAFOND_AMENDES = 5_000_000;
// Cumul de toutes les aggravantes, générales et spéciales confondues (art. 22-3)
const PLAFOND_AGGRAVANTES = 75;

const COLONNES: Array<{ label: string; sortKey?: SortKey; align?: "right" | "center" }> = [
  { label: "Infraction", sortKey: "nom" },
  { label: "Catégorie", sortKey: "categorie" },
  { label: "Niveau", sortKey: "niveau", align: "center" },
  { label: "Amende", sortKey: "amendeNum", align: "right" },
  { label: "Peine", sortKey: "peineMinutes", align: "right" },
  { label: "Régime", sortKey: "regime" },
  { label: "Peines complémentaires" },
  { label: "Réf.", sortKey: "reference" },
];

const AGG_GENERALES =
  "+50 % chacune (art. 21) sur la détention et l'amende : récidive, préméditation, bande organisée, otage ou bouclier humain, victime agent ou représentant, victime vulnérable, cruauté. Cumul de toutes les aggravantes plafonné à +75 % (art. 22-3).";
const AGG_SPECIALES =
  "+25 % chacune (art. 22) sur la détention et l'amende : arme non constitutive, arme cat. 3, sans PPA, visage dissimulé, usurpation d'uniforme, Defcon 3+, refus d'obtempérer ou fuite, entrave à l'enquête, mineur impliqué. Même plafond commun de +75 %.";
const ATTENUANTES_TXT =
  "−10 % chacune (art. 23) sur la détention et l'amende, sans jamais descendre sous 50 % des totaux calculés après aggravantes.";

const norm = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// Amende impossible à totaliser automatiquement : « 75 % du montant »,
// « / unité », « / victime », « / jour »…
const amendeManuelle = (inf: Infraction) =>
  inf.amendeNum === 0 || inf.amendeAffichee.includes("/");

function fmtDollars(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " $";
}

function fmtMinutes(m: number): string {
  const mins = Math.round(m);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const r = mins % 60;
  return `${mins} min (${h} H${r > 0 ? ` ${r.toString().padStart(2, "0")}` : ""})`;
}

function comparer(a: Infraction, b: Infraction, key: SortKey): number {
  switch (key) {
    case "nom":
      return a.nom.localeCompare(b.nom, "fr");
    case "categorie":
      return a.categorie.localeCompare(b.categorie, "fr");
    case "niveau":
      return a.niveau - b.niveau;
    case "amendeNum":
      return a.amendeNum - b.amendeNum;
    case "peineMinutes":
      return a.peineMinutes - b.peineMinutes;
    case "regime":
      return REGIME_ORDRE[a.regime] - REGIME_ORDRE[b.regime];
    case "reference":
      return a.reference.localeCompare(b.reference, "fr", { numeric: true });
  }
}

function toggleDansSet<T>(set: Set<T>, valeur: T): Set<T> {
  const suivant = new Set(set);
  if (suivant.has(valeur)) suivant.delete(valeur);
  else suivant.add(valeur);
  return suivant;
}

function Chip({
  actif,
  onClick,
  children,
}: {
  actif: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={actif}
      className={`border px-2.5 py-1.5 text-[13px] leading-none ${
        actif
          ? "border-usa-dark bg-usa-dark font-bold text-white"
          : "border-usa-gray-dark bg-white text-usa-ink hover:bg-usa-gray"
      }`}
    >
      {children}
    </button>
  );
}

function GroupeFiltres({ label, children }: { label: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-1.5 text-xs font-bold uppercase tracking-wide text-usa-gray-dark">
        {label}
      </legend>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </fieldset>
  );
}

function Compteur({
  label,
  sousTexte,
  valeur,
  max,
  onChange,
}: {
  label: string;
  sousTexte: string;
  valeur: number;
  max: number;
  onChange: (v: number) => void;
}) {
  const bouton =
    "flex h-8 w-8 items-center justify-center border border-white/40 text-lg font-bold leading-none hover:bg-usa-dark disabled:cursor-not-allowed disabled:opacity-30";
  return (
    <div className="border-b border-white/15 pb-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-bold">{label}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onChange(valeur - 1)}
            disabled={valeur === 0}
            aria-label={`Retirer une ${label.toLowerCase()}`}
            className={bouton}
          >
            −
          </button>
          <span className="w-8 text-center text-base font-bold tabular-nums">{valeur}</span>
          <button
            type="button"
            onClick={() => onChange(valeur + 1)}
            disabled={valeur === max}
            aria-label={`Ajouter une ${label.toLowerCase()}`}
            className={bouton}
          >
            +
          </button>
        </div>
      </div>
      <p className="mt-1 text-[11px] leading-snug text-white/70">{sousTexte}</p>
    </div>
  );
}

// Ligne du tableau de calcul du panneau : étape, détention, amende
function LigneCalcul({
  label,
  note,
  detention,
  amende,
  total = false,
}: {
  label: string;
  note?: string;
  detention: string;
  amende: string;
  total?: boolean;
}) {
  const cellule = total ? "border-t border-white/25 pt-1.5 text-base" : "py-0.5";
  const montant = `${cellule} whitespace-nowrap pl-2 text-right ${
    total ? "font-bold text-usa-gold" : "font-semibold"
  }`;
  return (
    <tr className="align-top">
      <th scope="row" className={`${cellule} pr-1 text-left ${total ? "font-bold" : "font-normal"}`}>
        {label}
        {note && <span className="block text-[11px] font-bold text-usa-gold">{note}</span>}
      </th>
      <td className={montant}>{detention}</td>
      <td className={montant}>{amende}</td>
    </tr>
  );
}

const celluleBase = "border-b border-r border-usa-gray-medium px-2 py-1.5 align-top";

function LienRef({
  reference,
  refLinks,
  className,
  children,
}: {
  reference: string;
  refLinks: Record<string, string>;
  className: string;
  children: ReactNode;
}) {
  const href = refLinks[reference];
  if (!href) return <span className={className}>{children}</span>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}

export default function GrilleClient({ refLinks }: { refLinks: Record<string, string> }) {
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [cats, setCats] = useState<Set<string>>(new Set());
  const [niveaux, setNiveaux] = useState<Set<Niveau>>(new Set());
  const [regimes, setRegimes] = useState<Set<Regime>>(new Set());
  const [sort, setSort] = useState<SortState | null>(null);
  const [filtresOuverts, setFiltresOuverts] = useState(false);

  // Calculateur — la sélection est indépendante des filtres et leur survit
  const [selection, setSelection] = useState<Set<string>>(new Set());
  const [detailOuvert, setDetailOuvert] = useState(false);
  const [aggGen, setAggGen] = useState(0);
  const [aggSpe, setAggSpe] = useState(0);
  const [attenuantes, setAttenuantes] = useState(0);
  const [tentative, setTentative] = useState(false);

  const lignes = useMemo(() => {
    const nq = norm(q.trim());
    const mots = nq.split(/\s+/).filter(Boolean);
    const filtrees = INFRACTIONS.filter((inf) => {
      if (cats.size > 0 && !cats.has(inf.categorie)) return false;
      if (niveaux.size > 0 && !niveaux.has(inf.niveau)) return false;
      if (regimes.size > 0 && !regimes.has(inf.regime)) return false;
      if (mots.length > 0) {
        const meule = norm(
          `${inf.nom} ${inf.categorie} ${inf.complementaires} ${inf.reference}`
        );
        if (!mots.every((m) => meule.includes(m))) return false;
      }
      return true;
    });
    if (!sort) return filtrees;
    return [...filtrees].sort((a, b) => comparer(a, b, sort.key) * sort.dir);
  }, [q, cats, niveaux, regimes, sort]);

  const selInfractions = useMemo(
    () => INFRACTIONS.filter((inf) => selection.has(inf.nom)),
    [selection]
  );

  // Ordre impératif du Livre I, art. 19-1 : base → concours → aggravantes → atténuantes.
  // Les pourcentages portent sur les totaux cumulés de détention ET d'amende (art. 19-3) ;
  // chaque étape est arrondie à la minute et au dollar, comme l'exemple de l'Annexe 2.
  const calc = useMemo(() => {
    const amendesAuto = selInfractions.filter((i) => !amendeManuelle(i));
    const amendesManuelles = selInfractions.filter(amendeManuelle);
    const federale = selInfractions.some((i) => i.regime === "F");

    // Base cumulée après concours (art. 20) ; la détention d'une peine fédérale est fixée par le Juge
    const baseDet = federale ? 0 : selInfractions.reduce((s, i) => s + i.peineMinutes, 0);
    const baseAmende = amendesAuto.reduce((s, i) => s + i.amendeNum, 0);

    // Aggravantes (art. 21-22) : cumul plafonné à +75 % (art. 22-3), le surplus reste sans effet
    const pctDemande = aggGen * 50 + aggSpe * 25;
    const pctAgg = Math.min(pctDemande, PLAFOND_AGGRAVANTES);
    const plafondAggAtteint = pctDemande >= PLAFOND_AGGRAVANTES;
    const aggDet = Math.round(baseDet * (1 + pctAgg / 100));
    const aggAmende = Math.round(baseAmende * (1 + pctAgg / 100));

    // Atténuantes (art. 23) : −10 % chacune, plancher 50 % des montants calculés après aggravantes
    const facteurDemande = 1 - (attenuantes * 10) / 100;
    const plancherAtteint = attenuantes > 0 && facteurDemande <= 0.5;
    const facteurAtt = Math.max(facteurDemande, 0.5);
    const attDet = Math.round(aggDet * facteurAtt);
    const attAmende = Math.round(aggAmende * facteurAtt);

    // Tentative (art. 24-2) : moitié de la détention et moitié de l'amende
    const finale = tentative ? Math.round(attDet / 2) : attDet;
    const amendeAvantPlafond = tentative ? Math.round(attAmende / 2) : attAmende;

    // Plafond global des amendes (art. 15-2), appliqué après tout le reste
    const plafondAtteint = amendeAvantPlafond > PLAFOND_AMENDES;
    const totalAmendes = Math.min(amendeAvantPlafond, PLAFOND_AMENDES);

    const regimeMax = selInfractions.reduce<Regime>(
      (max, i) => (REGIME_ORDRE[i.regime] > REGIME_ORDRE[max] ? i.regime : max),
      "A"
    );

    return {
      amendesManuelles,
      federale,
      baseDet,
      baseAmende,
      pctDemande,
      pctAgg,
      plafondAggAtteint,
      aggDet,
      aggAmende,
      plancherAtteint,
      attDet,
      attAmende,
      finale,
      amendeAvantPlafond,
      plafondAtteint,
      totalAmendes,
      regimeMax,
    };
  }, [selInfractions, aggGen, aggSpe, attenuantes, tentative]);

  // Colonne détention du tableau de calcul : sans objet quand la durée relève du Juge
  const det = (minutes: number) => (calc.federale ? "—" : fmtMinutes(minutes));

  const nbFiltres = cats.size + niveaux.size + regimes.size;

  const toggleSort = (key: SortKey) => {
    setSort((s) => (s && s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: 1 }));
  };

  const toggleSelection = (nom: string) => setSelection((s) => toggleDansSet(s, nom));

  const toutEffacer = () => {
    setSelection(new Set());
    setDetailOuvert(false);
    setAggGen(0);
    setAggSpe(0);
    setAttenuantes(0);
    setTentative(false);
  };

  const reinitialiser = () => {
    setQ("");
    setCats(new Set());
    setNiveaux(new Set());
    setRegimes(new Set());
    setSort(null);
  };

  return (
    <section aria-label="Grille des infractions" className="mt-6">
      {/* Recherche + filtres */}
      <div className="border border-usa-gray-medium bg-usa-gray p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <label htmlFor="grille-recherche" className="sr-only">
              Rechercher une infraction
            </label>
            <input
              id="grille-recherche"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              type="search"
              placeholder="Recherche instantanée : nom, peine complémentaire, référence…"
              className="h-11 w-full border border-usa-gray-dark bg-white px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-usa-dark"
            />
            <IconLoupe className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-usa-gray-dark" />
          </div>
          <button
            type="button"
            onClick={() => setFiltresOuverts((v) => !v)}
            aria-expanded={filtresOuverts}
            className="flex h-11 items-center justify-center gap-1.5 border-2 border-usa-dark bg-white px-4 text-sm font-bold text-usa-dark md:hidden"
          >
            Filtres{nbFiltres > 0 ? ` (${nbFiltres})` : ""}
            <IconChevron
              className={`h-3.5 w-3.5 transition-transform ${filtresOuverts ? "rotate-180" : ""}`}
            />
          </button>
          <button
            type="button"
            onClick={reinitialiser}
            className="h-11 border-2 border-usa-dark bg-white px-4 text-sm font-bold text-usa-dark hover:bg-usa-dark hover:text-white"
          >
            Réinitialiser
          </button>
        </div>

        <div className={`${filtresOuverts ? "block" : "hidden"} mt-4 space-y-3 md:block`}>
          <GroupeFiltres label="Catégorie">
            {CATEGORIES.map((c) => (
              <Chip key={c} actif={cats.has(c)} onClick={() => setCats(toggleDansSet(cats, c))}>
                {c}
              </Chip>
            ))}
          </GroupeFiltres>
          <GroupeFiltres label="Niveau">
            {NIVEAUX.map((n) => (
              <Chip
                key={n}
                actif={niveaux.has(n)}
                onClick={() => setNiveaux(toggleDansSet(niveaux, n))}
              >
                {NIVEAU_LABELS[n].replace("Niveau ", "N").replace(" — ", " · ")}
              </Chip>
            ))}
          </GroupeFiltres>
          <GroupeFiltres label="Régime de peine">
            {REGIME_CLES.map((r) => (
              <Chip
                key={r}
                actif={regimes.has(r)}
                onClick={() => setRegimes(toggleDansSet(regimes, r))}
              >
                {REGIME_LABELS[r]}
              </Chip>
            ))}
          </GroupeFiltres>
        </div>
      </div>

      {/* Aide au calculateur */}
      <div className="mt-3 border-l-[6px] border-l-usa-green bg-[#e7f4e4] p-3 text-sm">
        Cochez les infractions constatées pour calculer la peine totale selon la règle du
        concours d&rsquo;infractions (
        <LienRef
          reference="I-20"
          refLinks={refLinks}
          className="font-bold text-usa-dark underline hover:text-usa-darkest"
        >
          Livre I, art. 20
        </LienRef>
        ).
      </div>

      {/* Compteur + tri mobile */}
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-usa-gray-dark" aria-live="polite">
          <strong className="text-usa-ink">{lignes.length}</strong>{" "}
          infraction{lignes.length > 1 ? "s" : ""} affichée{lignes.length > 1 ? "s" : ""} sur{" "}
          {INFRACTIONS.length}
        </p>
        <div className="flex items-center gap-2 md:hidden">
          <label htmlFor="grille-tri" className="text-xs font-bold uppercase text-usa-gray-dark">
            Trier
          </label>
          <select
            id="grille-tri"
            value={sort ? `${sort.key}:${sort.dir}` : ""}
            onChange={(e) => {
              const v = e.target.value;
              if (!v) {
                setSort(null);
                return;
              }
              const [k, d] = v.split(":");
              setSort({ key: k as SortKey, dir: Number(d) as 1 | -1 });
            }}
            className="h-10 flex-1 border border-usa-gray-dark bg-white px-2 text-sm"
          >
            <option value="">Ordre du Code</option>
            <option value="nom:1">Nom (A → Z)</option>
            <option value="amendeNum:1">Amende croissante</option>
            <option value="amendeNum:-1">Amende décroissante</option>
            <option value="peineMinutes:1">Peine croissante</option>
            <option value="peineMinutes:-1">Peine décroissante</option>
            <option value="niveau:1">Niveau (1 → 4)</option>
            <option value="niveau:-1">Niveau (4 → 1)</option>
          </select>
        </div>
      </div>

      {/* Tableau (desktop) */}
      <div className="mt-2 hidden max-h-[72vh] overflow-auto border border-usa-gray-medium md:block">
        <table className="w-full border-separate [border-spacing:0] text-[13px] leading-snug">
          <thead>
            <tr>
              <th
                scope="col"
                className="sticky left-0 top-0 z-30 w-10 border-b-2 border-r border-[#2d4972] bg-usa-darkest px-2 py-2"
              >
                <span className="sr-only">Sélection</span>
              </th>
              {COLONNES.map((col, i) => (
                <th
                  key={col.label}
                  scope="col"
                  aria-sort={
                    col.sortKey && sort?.key === col.sortKey
                      ? sort.dir === 1
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                  className={`sticky top-0 whitespace-nowrap border-b-2 border-r border-[#2d4972] bg-usa-darkest px-2 py-2 text-left align-bottom font-bold text-white ${
                    i === 0 ? "left-10 z-30 min-w-[15rem]" : "z-20"
                  }`}
                >
                  {col.sortKey ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(col.sortKey!)}
                      className={`flex w-full items-center gap-1 hover:underline ${
                        col.align === "right"
                          ? "justify-end"
                          : col.align === "center"
                            ? "justify-center"
                            : ""
                      }`}
                    >
                      <span>{col.label}</span>
                      <span
                        aria-hidden="true"
                        className={`text-[9px] leading-none ${
                          sort?.key === col.sortKey ? "text-usa-gold" : "text-white/40"
                        }`}
                      >
                        {sort?.key === col.sortKey ? (sort.dir === 1 ? "▲" : "▼") : "▲▼"}
                      </span>
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lignes.map((inf, i) => {
              const estSel = selection.has(inf.nom);
              return (
                <tr
                  key={inf.nom}
                  className={`${
                    estSel ? "bg-[#d9e8f6]" : i % 2 === 1 ? "bg-[#f9f9f9]" : "bg-white"
                  } hover:bg-usa-gold-light`}
                >
                  <td className={`${celluleBase} sticky left-0 z-10 bg-inherit text-center`}>
                    <input
                      type="checkbox"
                      checked={estSel}
                      onChange={() => toggleSelection(inf.nom)}
                      aria-label={`Sélectionner ${inf.nom}`}
                      className="h-4 w-4 accent-usa-dark align-middle"
                    />
                  </td>
                  <td
                    className={`${celluleBase} sticky left-10 z-10 bg-inherit font-semibold text-usa-darkest`}
                  >
                    {inf.nom}
                  </td>
                  <td className={`${celluleBase} whitespace-nowrap`}>{inf.categorie}</td>
                  <td className={`${celluleBase} text-center`}>
                    <NiveauBadge niveau={inf.niveau} />
                  </td>
                  <td className={`${celluleBase} whitespace-nowrap text-right tabular-nums`}>
                    {inf.amendeAffichee}
                  </td>
                  <td className={`${celluleBase} whitespace-nowrap text-right tabular-nums`}>
                    {inf.peineAffichee}
                  </td>
                  <td className={`${celluleBase} whitespace-nowrap`}>
                    {REGIME_LABELS[inf.regime]}
                  </td>
                  <td className={`${celluleBase} min-w-[15rem]`}>
                    {inf.complementaires === "—" ? (
                      <span className="text-usa-gray-dark">—</span>
                    ) : (
                      inf.complementaires
                    )}
                  </td>
                  <td className={`${celluleBase} whitespace-nowrap tabular-nums`}>
                    <LienRef
                      reference={inf.reference}
                      refLinks={refLinks}
                      className="text-usa-dark underline hover:text-usa-darkest"
                    >
                      {inf.reference}
                    </LienRef>
                  </td>
                </tr>
              );
            })}
            {lignes.length === 0 && (
              <tr>
                <td
                  colSpan={COLONNES.length + 1}
                  className="bg-white px-4 py-8 text-center text-sm text-usa-gray-dark"
                >
                  Aucune infraction ne correspond à ces critères.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cartes (mobile) */}
      <ul className="mt-2 space-y-3 md:hidden">
        {lignes.map((inf) => {
          const estSel = selection.has(inf.nom);
          return (
            <li
              key={inf.nom}
              className={`border bg-white ${
                estSel ? "border-usa-dark" : "border-usa-gray-medium"
              }`}
            >
              <div
                className={`flex items-start justify-between gap-2 border-b px-3 py-2 ${
                  estSel
                    ? "border-usa-dark bg-[#d9e8f6]"
                    : "border-usa-gray-medium bg-usa-gray"
                }`}
              >
                <label className="flex min-w-0 items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={estSel}
                    onChange={() => toggleSelection(inf.nom)}
                    aria-label={`Sélectionner ${inf.nom}`}
                    className="mt-0.5 h-5 w-5 shrink-0 accent-usa-dark"
                  />
                  <span className="font-bold leading-tight text-usa-darkest">{inf.nom}</span>
                </label>
                <NiveauBadge niveau={inf.niveau} />
              </div>
              <dl className="grid grid-cols-2 gap-x-3 gap-y-2 px-3 py-2.5 text-sm">
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-wide text-usa-gray-dark">
                    Amende
                  </dt>
                  <dd className="font-semibold tabular-nums">{inf.amendeAffichee}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-wide text-usa-gray-dark">
                    Peine
                  </dt>
                  <dd className="font-semibold tabular-nums">{inf.peineAffichee}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-wide text-usa-gray-dark">
                    Catégorie
                  </dt>
                  <dd>{inf.categorie}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-wide text-usa-gray-dark">
                    Régime
                  </dt>
                  <dd>{REGIME_LABELS[inf.regime]}</dd>
                </div>
                {inf.complementaires !== "—" && (
                  <div className="col-span-2">
                    <dt className="text-[11px] font-bold uppercase tracking-wide text-usa-gray-dark">
                      Peines complémentaires
                    </dt>
                    <dd>{inf.complementaires}</dd>
                  </div>
                )}
                <div className="col-span-2 text-xs text-usa-gray-dark">
                  Référence :{" "}
                  <LienRef
                    reference={inf.reference}
                    refLinks={refLinks}
                    className="text-usa-dark underline hover:text-usa-darkest"
                  >
                    {inf.reference}
                  </LienRef>
                </div>
              </dl>
            </li>
          );
        })}
        {lignes.length === 0 && (
          <li className="border border-usa-gray-medium bg-white p-4 text-center text-sm text-usa-gray-dark">
            Aucune infraction ne correspond à ces critères.
          </li>
        )}
      </ul>

      {/* Réserve d'espace sous la barre de total fixe */}
      {selection.size > 0 && <div aria-hidden="true" className="h-44 md:h-24" />}

      {/* Panneau de total (calculateur) */}
      {selection.size > 0 && (
        <div
          className="fixed inset-x-0 bottom-0 z-40 border-t-4 border-usa-gold bg-usa-darkest text-white shadow-[0_-4px_16px_rgba(0,0,0,0.35)]"
          role="region"
          aria-label="Calculateur de peine"
        >
          {detailOuvert && (
            <div className="max-h-[62vh] overflow-y-auto border-b border-white/20">
              <div className="mx-auto grid max-w-site gap-6 px-4 py-4 lg:grid-cols-[minmax(0,1fr)_23rem]">
                {/* Infractions retenues */}
                <section aria-label="Infractions retenues">
                  <h3 className="mb-1 text-xs font-bold uppercase tracking-wide text-usa-gold">
                    Infractions retenues
                  </h3>
                  <ul className="divide-y divide-white/15">
                    {selInfractions.map((inf) => (
                      <li key={inf.nom} className="flex items-start gap-3 py-2 text-sm">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold leading-snug">{inf.nom}</p>
                          <p className="mt-0.5 text-[12px] leading-snug text-white/75">
                            <span className="tabular-nums">{inf.amendeAffichee}</span>
                            {amendeManuelle(inf) && (
                              <strong className="text-usa-gold">
                                {" "}
                                — montant à calculer manuellement
                              </strong>
                            )}
                            {" · "}
                            {inf.regime === "F" ? (
                              <span className="font-bold">Fédérale</span>
                            ) : inf.peineAffichee === "—" ? (
                              "sans détention"
                            ) : (
                              <span className="tabular-nums">{inf.peineAffichee}</span>
                            )}
                            {" · "}
                            <LienRef
                              reference={inf.reference}
                              refLinks={refLinks}
                              className="underline hover:text-white"
                            >
                              Voir l&rsquo;article ({inf.reference}) ↗
                            </LienRef>
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleSelection(inf.nom)}
                          aria-label={`Retirer ${inf.nom}`}
                          className="flex h-7 w-7 shrink-0 items-center justify-center border border-white/40 font-bold hover:bg-usa-red"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                  {calc.amendesManuelles.length > 0 && (
                    <p className="mt-2 border-l-4 border-usa-gold bg-white/10 p-2 text-[12px] leading-snug">
                      {calc.amendesManuelles.length > 1
                        ? `${calc.amendesManuelles.length} amendes dépendent du montant ou de la quantité en cause`
                        : "1 amende dépend du montant ou de la quantité en cause"}{" "}
                      : elles sont à calculer manuellement et ne sont pas comptées dans le
                      total ci-dessous.
                    </p>
                  )}
                </section>

                {/* Modificateurs + calcul */}
                <section aria-label="Modificateurs et calcul" className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-usa-gold">
                    Modificateurs (Livre I)
                  </h3>
                  <Compteur
                    label="Aggravantes générales"
                    sousTexte={AGG_GENERALES}
                    valeur={aggGen}
                    max={7}
                    onChange={setAggGen}
                  />
                  <Compteur
                    label="Aggravantes spéciales"
                    sousTexte={AGG_SPECIALES}
                    valeur={aggSpe}
                    max={9}
                    onChange={setAggSpe}
                  />
                  <Compteur
                    label="Atténuantes"
                    sousTexte={ATTENUANTES_TXT}
                    valeur={attenuantes}
                    max={5}
                    onChange={setAttenuantes}
                  />
                  <label className="flex items-start gap-2.5 border-b border-white/15 pb-3 text-sm">
                    <input
                      type="checkbox"
                      checked={tentative}
                      onChange={(e) => setTentative(e.target.checked)}
                      className="mt-0.5 h-4 w-4 accent-usa-gold"
                    />
                    <span>
                      <strong>Tentative</strong>
                      <span className="block text-[11px] text-white/70">
                        Art. 24 : la détention et l&rsquo;amende sont divisées par 2.
                      </span>
                    </span>
                  </label>

                  {calc.federale && (
                    <p className="bg-usa-red p-3 text-sm font-bold leading-snug">
                      PEINE FÉDÉRALE — durée fixée par le Juge. Les amendes restent
                      cumulées et modulées ci-dessous.
                    </p>
                  )}
                  <div className="border border-white/25 bg-white/5 p-3 text-sm">
                    <h4 className="text-xs font-bold uppercase tracking-wide text-usa-gold">
                      Calcul de la peine (art. 19)
                    </h4>
                    <p className="mb-2 mt-0.5 text-[11px] leading-snug text-white/70">
                      Les pourcentages portent sur les totaux cumulés de détention et
                      d&rsquo;amende obtenus après concours (art. 19-3).
                    </p>
                    <table className="w-full border-collapse tabular-nums">
                      <thead>
                        <tr className="text-[11px] uppercase tracking-wide text-white/70">
                          <th scope="col" className="pb-1 text-left font-bold">
                            Étape
                          </th>
                          <th scope="col" className="pb-1 pl-2 text-right font-bold">
                            Détention
                          </th>
                          <th scope="col" className="pb-1 pl-2 text-right font-bold">
                            Amende
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <LigneCalcul
                          label="Base cumulée (art. 20)"
                          detention={det(calc.baseDet)}
                          amende={fmtDollars(calc.baseAmende)}
                        />
                        {calc.pctDemande > 0 && (
                          <LigneCalcul
                            label={`Aggravantes (+${calc.pctAgg} %)`}
                            note={calc.plafondAggAtteint ? "plafond +75 % atteint" : undefined}
                            detention={det(calc.aggDet)}
                            amende={fmtDollars(calc.aggAmende)}
                          />
                        )}
                        {attenuantes > 0 && (
                          <LigneCalcul
                            label={`Atténuantes (−${attenuantes * 10} %)`}
                            note={calc.plancherAtteint ? "plancher 50 % atteint" : undefined}
                            detention={det(calc.attDet)}
                            amende={fmtDollars(calc.attAmende)}
                          />
                        )}
                        {tentative && (
                          <LigneCalcul
                            label="Tentative (÷ 2)"
                            detention={det(calc.finale)}
                            amende={fmtDollars(calc.amendeAvantPlafond)}
                          />
                        )}
                        <LigneCalcul
                          total
                          label="Peine totale"
                          note={calc.plafondAtteint ? "plafond 5 000 000 $ atteint" : undefined}
                          detention={calc.federale ? "fixée par le Juge" : fmtMinutes(calc.finale)}
                          amende={fmtDollars(calc.totalAmendes)}
                        />
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* Barre compacte */}
          <div className="mx-auto flex max-w-site flex-wrap items-center gap-x-5 gap-y-1.5 px-4 py-2.5 text-sm">
            <p>
              <strong className="text-base tabular-nums">{selection.size}</strong>{" "}
              infraction{selection.size > 1 ? "s" : ""}
            </p>
            <p>
              Amendes :{" "}
              <strong className="tabular-nums">{fmtDollars(calc.totalAmendes)}</strong>
              {calc.plafondAtteint && (
                <strong className="ml-1.5 text-usa-gold">plafond atteint</strong>
              )}
              {calc.amendesManuelles.length > 0 && (
                <span className="ml-1.5 text-white/70">
                  + {calc.amendesManuelles.length} à calculer
                </span>
              )}
            </p>
            {calc.federale ? (
              <p className="bg-usa-red px-2 py-0.5 font-bold">
                PEINE FÉDÉRALE — durée fixée par le Juge
              </p>
            ) : (
              <p>
                Détention :{" "}
                <strong className="tabular-nums">{fmtMinutes(calc.finale)}</strong>
              </p>
            )}
            <p className="text-white/80">Régime : {REGIME_LABELS[calc.regimeMax]}</p>
            <div className="ml-auto flex gap-2">
              <button
                type="button"
                onClick={() => setDetailOuvert((v) => !v)}
                aria-expanded={detailOuvert}
                className="flex items-center gap-1.5 border border-white/50 px-3 py-1.5 font-bold hover:bg-usa-dark"
              >
                Détail
                <IconChevron
                  className={`h-3.5 w-3.5 transition-transform ${
                    detailOuvert ? "" : "rotate-180"
                  }`}
                />
              </button>
              <button
                type="button"
                onClick={toutEffacer}
                className="border border-white/50 px-3 py-1.5 font-bold hover:bg-usa-red"
              >
                Tout effacer
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
