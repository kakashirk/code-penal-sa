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

const norm = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

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

const celluleBase = "border-b border-r border-usa-gray-medium px-2 py-1.5 align-top";

export default function GrilleClient() {
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [cats, setCats] = useState<Set<string>>(new Set());
  const [niveaux, setNiveaux] = useState<Set<Niveau>>(new Set());
  const [regimes, setRegimes] = useState<Set<Regime>>(new Set());
  const [sort, setSort] = useState<SortState | null>(null);
  const [filtresOuverts, setFiltresOuverts] = useState(false);

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

  const nbFiltres = cats.size + niveaux.size + regimes.size;

  const toggleSort = (key: SortKey) => {
    setSort((s) => (s && s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: 1 }));
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
                    i === 0 ? "left-0 z-30 min-w-[15rem]" : "z-20"
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
            {lignes.map((inf, i) => (
              <tr
                key={inf.nom}
                className={`${i % 2 === 1 ? "bg-[#f9f9f9]" : "bg-white"} hover:bg-usa-gold-light`}
              >
                <td
                  className={`${celluleBase} sticky left-0 z-10 bg-inherit font-semibold text-usa-darkest`}
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
                  {inf.reference}
                </td>
              </tr>
            ))}
            {lignes.length === 0 && (
              <tr>
                <td colSpan={COLONNES.length} className="bg-white px-4 py-8 text-center text-sm text-usa-gray-dark">
                  Aucune infraction ne correspond à ces critères.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cartes (mobile) */}
      <ul className="mt-2 space-y-3 md:hidden">
        {lignes.map((inf) => (
          <li key={inf.nom} className="border border-usa-gray-medium bg-white">
            <div className="flex items-start justify-between gap-2 border-b border-usa-gray-medium bg-usa-gray px-3 py-2">
              <p className="font-bold leading-tight text-usa-darkest">{inf.nom}</p>
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
                Référence : {inf.reference}
              </div>
            </dl>
          </li>
        ))}
        {lignes.length === 0 && (
          <li className="border border-usa-gray-medium bg-white p-4 text-center text-sm text-usa-gray-dark">
            Aucune infraction ne correspond à ces critères.
          </li>
        )}
      </ul>
    </section>
  );
}
