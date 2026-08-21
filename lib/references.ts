// Résolution des références de la grille (« V-4 », « XI-9 »…) vers la page du
// Livre correspondant, avec l'ancre de l'article quand elle existe dans le
// sommaire importé. Construit côté serveur et passé en prop au client.

import { INFRACTIONS } from "@/data/infractions";
import { getDoc, type DocContent } from "./content";

const ROMAIN_VERS_SLUG: Record<string, string> = {
  I: "livre-i",
  II: "livre-ii",
  III: "livre-iii",
  IV: "livre-iv",
  V: "livre-v",
  VI: "livre-vi",
  VII: "livre-vii",
  VIII: "livre-viii",
  IX: "livre-ix",
  X: "livre-x",
  XI: "livre-xi",
  XII: "livre-xii",
  XIII: "livre-xiii",
};

const norm = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// Articles du Livre I cités par le calculateur de peine (concours, aggravantes,
// atténuantes, tentative), en plus des références présentes dans la grille.
const REFS_SUPPLEMENTAIRES = ["I-19", "I-20", "I-21", "I-22", "I-23", "I-24"];

export function buildReferenceLinks(): Record<string, string> {
  const liens: Record<string, string> = {};
  const cache = new Map<string, DocContent | null>();

  const refs = [...INFRACTIONS.map((inf) => inf.reference), ...REFS_SUPPLEMENTAIRES];
  for (const ref of refs) {
    if (liens[ref]) continue;
    const m = ref.match(/^([IVXLC]+)-(\d+)$/);
    if (!m) continue;
    const slug = ROMAIN_VERS_SLUG[m[1]];
    if (!slug) continue;

    let doc = cache.get(slug);
    if (doc === undefined) {
      doc = getDoc(slug);
      cache.set(slug, doc);
    }

    let href = `/livres/${slug}`;
    if (doc) {
      const motif = new RegExp(`^art(?:icle)?\\.?\\s*${m[2]}\\b`);
      const cible = doc.toc.find((t) => motif.test(norm(t.text)));
      if (cible) href = `/livres/${slug}#${cible.slug}`;
    }
    liens[ref] = href;
  }

  return liens;
}
