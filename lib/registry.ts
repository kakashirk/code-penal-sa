// Registre canonique des 21 documents du Code (nav, pages, recherche).
// Les titres font foi même si un document n'a pas encore été importé.

export interface DocMeta {
  slug: string;
  titre: string;
  numero: string;
  sousTitre: string;
}

function meta(slug: string, titre: string): DocMeta {
  const [numero, ...reste] = titre.split(" — ");
  return { slug, titre, numero, sousTitre: reste.join(" — ") };
}

export const LIVRES: DocMeta[] = [
  meta("livre-i", "Livre I — Constitution, Bill of Rights & Dispositions générales"),
  meta("livre-ii", "Livre II — Des Acts (Lois spéciales)"),
  meta("livre-iii", "Livre III — De la procédure pénale"),
  meta("livre-iv", "Livre IV — Des mandats et des enquêtes"),
  meta("livre-v", "Livre V — Des infractions contre les personnes et les biens"),
  meta("livre-vi", "Livre VI — Des infractions économiques et financières"),
  meta("livre-vii", "Livre VII — Des infractions spéciales"),
  meta("livre-viii", "Livre VIII — Du Code civil"),
  meta("livre-ix", "Livre IX — Du Code du travail et des entreprises"),
  meta("livre-x", "Livre X — Du Code de la santé"),
  meta("livre-xi", "Livre XI — Du Code de la route et du Code aérien"),
  meta("livre-xii", "Livre XII — Du Code électoral"),
  meta("livre-xiii", "Livre XIII — Des États d'urgence (Defcon)"),
];

export const ANNEXES: DocMeta[] = [
  meta("annexe-1-manuel-agent", "Annexe 1 — Manuel de procédure de l'Agent"),
  meta("annexe-2-grille", "Annexe 2 — Grille générale des infractions"),
  meta("annexe-3-enqueteur", "Annexe 3 — Guide de l'Enquêteur et des Mandats"),
  meta("annexe-4-avocat", "Annexe 4 — Guide de l'Avocat"),
  meta("annexe-5-doj", "Annexe 5 — Guide du DOJ (Procureur & Juge)"),
  meta("annexe-6-citoyen", "Annexe 6 — Guide du Citoyen"),
  meta("annexe-7-glossaire", "Annexe 7 — Glossaire juridique"),
  meta("annexe-8-decrets", "Annexe 8 — Recueil des décrets de l'État"),
];
