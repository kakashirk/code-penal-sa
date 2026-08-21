"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import { useSearchParams } from "next/navigation";
import type { SearchEntry } from "@/lib/search-index";
import NiveauBadge from "./NiveauBadge";
import { IconLoupe } from "./icons";

const SECTIONS: Array<{ type: SearchEntry["type"]; label: string }> = [
  { type: "infraction", label: "Infractions" },
  { type: "document", label: "Livres & annexes" },
  { type: "definition", label: "Définitions" },
];

const EXEMPLES = [
  "arnaque",
  "braquage",
  "on m'a volé ma voiture",
  "pot de vin",
  "GAV",
  "beuh",
  "taxer",
  "perpète",
  "kidnapping",
  "argent sale",
];

export default function SearchClient({ entries }: { entries: SearchEntry[] }) {
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");

  const fuse = useMemo(
    () =>
      new Fuse(entries, {
        keys: [
          { name: "titre", weight: 0.45 },
          { name: "motsCles", weight: 0.35 },
          { name: "description", weight: 0.15 },
          { name: "reference", weight: 0.05 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [entries]
  );

  const resultats = useMemo(() => {
    const requete = q.trim();
    if (requete.length < 2) return [];
    return fuse.search(requete).slice(0, 60).map((r) => r.item);
  }, [fuse, q]);

  useEffect(() => {
    const requete = q.trim();
    const url = requete ? `/recherche?q=${encodeURIComponent(requete)}` : "/recherche";
    window.history.replaceState(null, "", url);
  }, [q]);

  const groupes = SECTIONS.map((s) => ({
    ...s,
    items: resultats.filter((r) => r.type === s.type),
  })).filter((g) => g.items.length > 0);

  return (
    <div>
      <div className="relative">
        <label htmlFor="recherche-globale" className="sr-only">
          Rechercher dans le Code
        </label>
        <input
          id="recherche-globale"
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          type="search"
          placeholder="Recherchez en langage naturel : « on m'a volé ma voiture », « pot de vin »…"
          className="h-14 w-full border-2 border-usa-dark bg-white px-4 pr-12 text-base focus:outline-none focus:ring-4 focus:ring-usa-gold"
        />
        <IconLoupe className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-usa-gray-dark" />
      </div>

      {q.trim().length < 2 && (
        <div className="mt-6">
          <p className="text-sm font-bold uppercase tracking-wide text-usa-gray-dark">
            Essayez par exemple
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {EXEMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setQ(ex)}
                className="border border-usa-gray-dark bg-white px-3 py-1.5 text-sm hover:bg-usa-gray"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}

      {q.trim().length >= 2 && (
        <p className="mt-4 text-sm text-usa-gray-dark" aria-live="polite">
          <strong className="text-usa-ink">{resultats.length}</strong> résultat
          {resultats.length > 1 ? "s" : ""} pour «&nbsp;{q.trim()}&nbsp;»
        </p>
      )}

      {q.trim().length >= 2 && resultats.length === 0 && (
        <div className="mt-4 border-l-[6px] border-l-usa-gold bg-usa-gold-light p-4 text-sm">
          Aucun résultat. Essayez un autre terme (par exemple «&nbsp;braquage&nbsp;»,
          «&nbsp;vol de voiture&nbsp;», «&nbsp;GAV&nbsp;») ou consultez directement la{" "}
          <Link href="/grille" className="font-bold text-usa-dark underline">
            grille des infractions
          </Link>
          .
        </div>
      )}

      {groupes.map((groupe) => (
        <section key={groupe.type} className="mt-8">
          <h2 className="border-b-2 border-usa-gold pb-2 font-serif text-lg font-black text-usa-darkest">
            {groupe.label}{" "}
            <span className="font-sans text-sm font-normal text-usa-gray-dark">
              ({groupe.items.length})
            </span>
          </h2>
          <ul>
            {groupe.items.map((item) => (
              <li key={item.id} className="border-b border-usa-gray py-3">
                <div className="flex flex-wrap items-center gap-2">
                  {item.niveau && <NiveauBadge niveau={item.niveau} />}
                  <Link
                    href={item.href}
                    className="font-semibold text-usa-dark underline hover:text-usa-darkest"
                  >
                    {item.titre}
                  </Link>
                  {item.reference && (
                    <span className="border border-usa-gray-medium bg-usa-gray px-1.5 py-0.5 text-[11px] font-bold tabular-nums text-usa-gray-dark">
                      {item.reference}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-usa-gray-dark">{item.description}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
