// Import des 21 Google Docs publics du Code Pénal vers content/*.json
// Usage : node scripts/import-content.mjs
// Chaque document est téléchargé via l'export HTML public, nettoyé avec cheerio,
// puis sauvegardé sous la forme { slug, titre, html, toc }.

import * as cheerio from "cheerio";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const DOCS = [
  // Livres
  { slug: "livre-i", titre: "Livre I — Constitution, Bill of Rights & Dispositions générales", docId: "1MBxJ7-55erbOB96OcV0ElJnM_A49Ms-jx4LcrvY_sGI" },
  { slug: "livre-ii", titre: "Livre II — Des Acts (Lois spéciales)", docId: "1kPK59am5VxxFTeZpoeFOxxZVb3qQ9gFUnDsjb8ZS17o" },
  { slug: "livre-iii", titre: "Livre III — De la procédure pénale", docId: "13rf-8NP_U0-swvqawzxb0wNBo-pjbCU50w17O0gzOtM" },
  { slug: "livre-iv", titre: "Livre IV — Des mandats et des enquêtes", docId: "1zOaF7TR2TaCV4rdQn78G-mZQ3AWEtCG2XM8HGQSjZhI" },
  { slug: "livre-v", titre: "Livre V — Des infractions contre les personnes et les biens", docId: "1N60LhWsXmevAHzxYLARhO8e8FZ69FwCmM7mJy5NZLEk" },
  { slug: "livre-vi", titre: "Livre VI — Des infractions économiques et financières", docId: "1DFE3Nice0IhzmwUVQayLi8qrGeg0J8xWLavTGnZiYYM" },
  { slug: "livre-vii", titre: "Livre VII — Des infractions spéciales", docId: "1v4zhZEoPuMVn5v2im3JE8DeGviHeJo5Z-1FjI_A3GyM" },
  { slug: "livre-viii", titre: "Livre VIII — Du Code civil", docId: "1QgsZrvZzKWsLZyNuS6m1sDmvdPMHClp6Vf_Dc-wgYpI" },
  { slug: "livre-ix", titre: "Livre IX — Du Code du travail et des entreprises", docId: "1PgPvnXnBgTqa7kBimGI8T0JybVYxAinGz3vb8UMKr-Q" },
  { slug: "livre-x", titre: "Livre X — Du Code de la santé", docId: "15_TZIVCfiMaYFwL0Vn14ACQj_3cE4Ciaa4llXpUK-w4" },
  { slug: "livre-xi", titre: "Livre XI — Du Code de la route et du Code aérien", docId: "1qUsCfA8RJKsNYQAlihJgA8fBxOGdiOi9wvGfTKT8tAc" },
  { slug: "livre-xii", titre: "Livre XII — Du Code électoral", docId: "1ujQvBe52Vq7J9_CyaYxEtJk7Y_H37Cs0IRKliYk0BVo" },
  { slug: "livre-xiii", titre: "Livre XIII — Des États d'urgence (Defcon)", docId: "17FuK6rBHEMrcYw3VwLsDA4CLOyk9vX9iEQHDCJZjPbc" },
  // Annexes
  { slug: "annexe-1-manuel-agent", titre: "Annexe 1 — Manuel de procédure de l'Agent", docId: "176ft7HXR_NUl9t5tkjVlRZB-5UnXFUyG0iH5rMEM8xw" },
  { slug: "annexe-2-grille", titre: "Annexe 2 — Grille générale des infractions", docId: "19eZvvsn2Alu6D37sWXPFoKy34NB1dLtiGki6D2FDC9U" },
  { slug: "annexe-3-enqueteur", titre: "Annexe 3 — Guide de l'Enquêteur et des Mandats", docId: "1qcuF6-bum1FE2XgxsnygCyVaFq5uLVv3a0UE0Uaw7kw" },
  { slug: "annexe-4-avocat", titre: "Annexe 4 — Guide de l'Avocat", docId: "1EfkgMiinrAKlVNjejqiN401EFIwdUzUT3wOvMJgH_Jw" },
  { slug: "annexe-5-doj", titre: "Annexe 5 — Guide du DOJ (Procureur & Juge)", docId: "11xDCt6bLs_oX39Va3mO_onAcwX-VvxD6A91NQY88Tao" },
  { slug: "annexe-6-citoyen", titre: "Annexe 6 — Guide du Citoyen", docId: "1pyG5ss4dXOx2gd6PPUkOjyWrj8FDIkcU9xYbHpMYSrM" },
  { slug: "annexe-7-glossaire", titre: "Annexe 7 — Glossaire juridique", docId: "14rX3st4GjnJHRhw4sgf6rrVr0FfaZCa6fU00QusPcqs" },
  { slug: "annexe-8-decrets", titre: "Annexe 8 — Recueil des décrets de l'État", docId: "1dd5xzzdsPIm5dF_DhupgZS9xCrwVWHh_hAvlybayfQ0" },
];

const OUT_DIR = path.join(process.cwd(), "content");

const ALLOWED_TAGS = new Set([
  "h1", "h2", "h3", "p", "ul", "ol", "li",
  "table", "thead", "tbody", "tr", "td", "th",
  "strong", "em", "a", "br",
]);

function slugify(text) {
  const s = text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return s || "section";
}

// Protocoles autorisés dans les href ; tout le reste (javascript:, data:, vbscript:…) est retiré
const HREF_AUTORISE = /^(https?:|mailto:|\/(?!\/)|#)/i;

function cleanDocument($) {
  // Balises supprimées avec leur contenu : jamais déballées, même vides
  $(
    "head, style, script, noscript, template, meta, link, title, base, img, picture, source, hr, " +
      "iframe, frame, frameset, object, embed, applet, form, input, button, select, textarea, " +
      "video, audio, track, svg, math, canvas, map, area, dialog, slot, portal"
  ).remove();

  // Le titre du document Google est exporté en <p class="title"> → h1
  $("p.title").each((_, el) => {
    $(el).replaceWith(`<h1>${$(el).html() ?? ""}</h1>`);
  });

  // Le gras/italique de Google Docs vit dans le style inline des <span>.
  // Parcours en ordre inverse pour traiter les enfants avant les parents.
  for (const el of $("span").toArray().reverse()) {
    const style = $(el).attr("style") ?? "";
    const bold = /font-weight\s*:\s*(700|800|900|bold)/i.test(style);
    const italic = /font-style\s*:\s*italic/i.test(style);
    const inner = $(el).html() ?? "";
    if (bold && italic) $(el).replaceWith(`<strong><em>${inner}</em></strong>`);
    else if (bold) $(el).replaceWith(`<strong>${inner}</strong>`);
    else if (italic) $(el).replaceWith(`<em>${inner}</em>`);
    else $(el).replaceWith(inner);
  }

  // Google enveloppe les liens dans des redirections google.com/url?q=…
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") ?? "";
    if (href.includes("google.com/url?")) {
      try {
        const q = new URL(href).searchParams.get("q");
        if (q) $(el).attr("href", q);
      } catch {
        $(el).removeAttr("href");
      }
    }
  });

  // Liste blanche de protocoles : un href suspect est retiré, le texte du lien reste
  $("a[href]").each((_, el) => {
    const href = ($(el).attr("href") ?? "").trim();
    if (!HREF_AUTORISE.test(href)) $(el).removeAttr("href");
  });

  // h4/h5/h6 → h3 (seuls h1-h3 sont conservés pour le sommaire)
  $("h4, h5, h6").each((_, el) => {
    $(el).replaceWith(`<h3>${$(el).html() ?? ""}</h3>`);
  });

  // Déballer toute balise non autorisée, purger les attributs des autres
  for (const el of $("body *").toArray().reverse()) {
    const tag = (el.tagName ?? "").toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) {
      $(el).replaceWith($(el).html() ?? "");
      continue;
    }
    const keep = new Set(
      tag === "a" ? ["href"] : tag === "td" || tag === "th" ? ["colspan", "rowspan"] : []
    );
    for (const attr of Object.keys(el.attribs ?? {})) {
      if (!keep.has(attr)) $(el).removeAttr(attr);
    }
    // colspan/rowspan : uniquement des entiers raisonnables
    for (const attr of ["colspan", "rowspan"]) {
      const v = $(el).attr(attr);
      if (v !== undefined && !/^\d{1,3}$/.test(v)) $(el).removeAttr(attr);
    }
  }

  // Supprimer les blocs vides (paragraphes &nbsp;, titres sans texte, spans vides déjà déballés…)
  for (const el of $("strong, em, li, p, h1, h2, h3").toArray()) {
    const node = $(el);
    if (node.text().replace(/ /g, " ").trim() === "" && node.find("table, br").length === 0) {
      node.remove();
    }
  }
}

function extractToc($) {
  const toc = [];
  const used = new Map();
  $("body")
    .find("h1, h2, h3")
    .each((_, el) => {
      const text = $(el).text().replace(/\s+/g, " ").trim();
      if (!text) return;
      let slug = slugify(text);
      const seen = used.get(slug) ?? 0;
      used.set(slug, seen + 1);
      if (seen > 0) slug = `${slug}-${seen + 1}`;
      $(el).attr("id", slug);
      toc.push({ level: Number(el.tagName[1]), text, slug });
    });
  return toc;
}

async function importDoc(doc) {
  const url = `https://docs.google.com/document/d/${doc.docId}/export?format=html`;
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  const raw = await res.text();

  const $ = cheerio.load(raw);
  cleanDocument($);
  const toc = extractToc($);
  const html = ($("body").html() ?? "").trim();

  const out = { slug: doc.slug, titre: doc.titre, html, toc };
  writeFileSync(path.join(OUT_DIR, `${doc.slug}.json`), JSON.stringify(out, null, 2), "utf8");
  return { sections: toc.length, kb: Math.round(html.length / 1024) };
}

async function run() {
  mkdirSync(OUT_DIR, { recursive: true });
  let ok = 0;
  let ko = 0;
  for (const doc of DOCS) {
    try {
      const { sections, kb } = await importDoc(doc);
      console.log(`OK  ${doc.slug} (${sections} sections, ${kb} Ko)`);
      ok += 1;
    } catch (err) {
      console.error(`ERR ${doc.slug} : ${err.message}`);
      ko += 1;
    }
  }
  console.log(`\nImport terminé : ${ok} réussi(s), ${ko} échec(s).`);
  if (ok === 0) process.exitCode = 1;
}

run();
