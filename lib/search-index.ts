// Construction (côté serveur) de l'index de recherche globale :
// infractions + sommaires des livres/annexes importés + glossaire juridique.

import * as cheerio from "cheerio";
import { INFRACTIONS, REGIME_LABELS, type Niveau } from "@/data/infractions";
import { getMotsCles } from "@/data/mots-cles";
import { getDoc } from "./content";
import { ANNEXES, LIVRES } from "./registry";

export interface SearchEntry {
  id: string;
  type: "infraction" | "document" | "definition";
  titre: string;
  description: string;
  href: string;
  motsCles: string[];
  niveau?: Niveau;
  reference?: string;
}

const norm = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// Synonymes de concepts juridiques (hors infractions). Si le glossaire importé
// contient déjà le terme, les synonymes lui sont rattachés ; sinon une
// définition de secours est indexée.
const SYNONYMES_DEFINITIONS: Array<{
  cle: string;
  motsCles: string[];
  secours: { terme: string; definition: string };
}> = [
  {
    cle: "detention perpetuelle",
    motsCles: ["perpète", "perpétuité", "prison à vie", "à perpétuité"],
    secours: {
      terme: "Détention perpétuelle",
      definition:
        "Peine d'enfermement à durée indéterminée réservée aux crimes fédéraux les plus graves.",
    },
  },
  {
    cle: "flagrance",
    motsCles: ["en flag", "flag", "flagrant délit", "pris sur le fait"],
    secours: {
      terme: "Flagrance",
      definition:
        "Situation où l'infraction se commet ou vient de se commettre sous les yeux des forces de l'ordre.",
    },
  },
  {
    cle: "garde a vue",
    motsCles: ["GAV", "gav", "mis en cellule", "interpellé"],
    secours: {
      terme: "Garde à vue",
      definition:
        "Privation de liberté temporaire d'un suspect dans les locaux des forces de l'ordre, encadrée par la procédure pénale.",
    },
  },
  {
    cle: "ppa",
    motsCles: ["port d'armes", "permis de port d'armes", "licence d'arme", "permis arme"],
    secours: {
      terme: "PPA — Permis de Port d'Arme",
      definition:
        "Autorisation délivrée par l'État, obligatoire pour détenir et porter légalement une arme.",
    },
  },
  {
    cle: "fonds illicites",
    motsCles: ["argent sale", "argent illégal"],
    secours: {
      terme: "Fonds illicites",
      definition:
        "Sommes issues d'activités illégales, saisissables et passibles de poursuites pour possession ou blanchiment.",
    },
  },
];

interface DefGlossaire {
  terme: string;
  definition: string;
  anchor: string;
}

function parseGlossaire(): DefGlossaire[] {
  const doc = getDoc("annexe-7-glossaire");
  if (!doc) return [];
  const $ = cheerio.load(doc.html);
  const defs: DefGlossaire[] = [];
  const vus = new Set<string>();
  let anchor = "";
  $("body")
    .children()
    .each((_, el) => {
      const tag = (el.tagName ?? "").toLowerCase();
      if (tag === "h1" || tag === "h2" || tag === "h3") {
        anchor = $(el).attr("id") ?? anchor;
        return;
      }
      if (tag !== "p") return;
      const texte = $(el).text().replace(/\s+/g, " ").trim();
      const m = texte.match(/^(.{2,70}?)\s*—\s*(.+)$/);
      if (!m) return;
      const terme = m[1].trim();
      const definition = m[2].trim();
      const cle = norm(terme);
      if (definition.length < 10 || vus.has(cle)) return;
      vus.add(cle);
      defs.push({ terme, definition, anchor });
    });
  return defs;
}

export function buildSearchIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];

  // 1. Infractions de la grille
  INFRACTIONS.forEach((inf, i) => {
    const peine = inf.peineAffichee === "—" ? "" : ` · ${inf.peineAffichee}`;
    entries.push({
      id: `inf-${i}`,
      type: "infraction",
      titre: inf.nom,
      description: `${inf.categorie} · ${inf.amendeAffichee}${peine} · ${REGIME_LABELS[inf.regime]}`,
      href: `/grille?q=${encodeURIComponent(inf.nom)}`,
      motsCles: getMotsCles(inf.nom, inf.categorie),
      niveau: inf.niveau,
      reference: inf.reference,
    });
  });

  // 2. Livres et annexes : le document lui-même + ses sections (h1/h2)
  const groupes: Array<{ base: "livres" | "annexes"; docs: typeof LIVRES }> = [
    { base: "livres", docs: LIVRES },
    { base: "annexes", docs: ANNEXES },
  ];
  for (const { base, docs } of groupes) {
    for (const metaDoc of docs) {
      entries.push({
        id: `doc-${metaDoc.slug}`,
        type: "document",
        titre: metaDoc.titre,
        description: "Document complet",
        href: `/${base}/${metaDoc.slug}`,
        motsCles: [],
      });
      const doc = getDoc(metaDoc.slug);
      if (!doc) continue;
      for (const section of doc.toc) {
        if (section.level > 2) continue;
        if (section.text.length < 4) continue;
        if (norm(section.text) === norm(metaDoc.titre)) continue;
        entries.push({
          id: `sec-${metaDoc.slug}-${section.slug}`,
          type: "document",
          titre: section.text,
          description: metaDoc.titre,
          href: `/${base}/${metaDoc.slug}#${section.slug}`,
          motsCles: [],
        });
      }
    }
  }

  // 3. Glossaire juridique + définitions de secours obligatoires
  const defs = parseGlossaire();
  const synonymesRestants = [...SYNONYMES_DEFINITIONS];
  defs.forEach((def, i) => {
    const cleTerme = norm(def.terme);
    const motsCles: string[] = [];
    for (let s = synonymesRestants.length - 1; s >= 0; s--) {
      if (cleTerme.includes(synonymesRestants[s].cle)) {
        motsCles.push(...synonymesRestants[s].motsCles);
        synonymesRestants.splice(s, 1);
      }
    }
    entries.push({
      id: `def-${i}`,
      type: "definition",
      titre: def.terme,
      description: def.definition,
      href: def.anchor
        ? `/annexes/annexe-7-glossaire#${def.anchor}`
        : "/annexes/annexe-7-glossaire",
      motsCles,
    });
  });
  synonymesRestants.forEach((syn, i) => {
    entries.push({
      id: `def-secours-${i}`,
      type: "definition",
      titre: syn.secours.terme,
      description: syn.secours.definition,
      href: "/annexes/annexe-7-glossaire",
      motsCles: syn.motsCles,
    });
  });

  return entries;
}
