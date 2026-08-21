import Link from "next/link";
import Alert from "./Alert";
import Breadcrumb from "./Breadcrumb";
import TocSidebar from "./TocSidebar";
import type { DocContent } from "@/lib/content";
import type { DocMeta } from "@/lib/registry";

export default function DocPage({
  meta,
  doc,
  prev,
  next,
  base,
  baseLabel,
}: {
  meta: DocMeta;
  doc: DocContent | null;
  prev: DocMeta | null;
  next: DocMeta | null;
  base: "livres" | "annexes";
  baseLabel: string;
}) {
  return (
    <div className="mx-auto max-w-site px-4 pb-12">
      <Breadcrumb
        items={[{ label: "Accueil", href: "/" }, { label: baseLabel }, { label: meta.numero }]}
      />
      <header className="mb-6 border-b-4 border-usa-gold pb-4">
        <p className="text-sm font-bold uppercase tracking-widest text-usa-dark">{meta.numero}</p>
        <h1 className="mt-1 font-serif text-2xl font-black leading-tight text-usa-darkest sm:text-3xl">
          {meta.sousTitre}
        </h1>
        <p className="mt-2 text-sm text-usa-gray-dark">
          Département de la Justice — État de San Andreas · Version consolidée en vigueur
        </p>
      </header>

      {doc && doc.toc.length > 0 && (
        <details className="mb-6 border border-usa-gray-medium lg:hidden">
          <summary className="cursor-pointer bg-usa-gray px-4 py-2.5 font-bold text-usa-darkest">
            Sommaire
          </summary>
          <div className="px-4 py-3">
            <TocSidebar toc={doc.toc} />
          </div>
        </details>
      )}

      <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10">
        <aside className="hidden lg:block">
          {doc && doc.toc.length > 0 && (
            <div className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto pr-2">
              <TocSidebar toc={doc.toc} />
            </div>
          )}
        </aside>
        <div className="min-w-0">
          {doc ? (
            <article className="doc-content" dangerouslySetInnerHTML={{ __html: doc.html }} />
          ) : (
            <Alert type="warning" title="Contenu indisponible">
              Ce document n&rsquo;a pas encore été importé. Exécutez{" "}
              <code className="bg-white px-1">npm run import</code> puis reconstruisez le site.
            </Alert>
          )}

          <nav
            aria-label="Navigation entre documents"
            className="mt-10 flex flex-col gap-3 border-t border-usa-gray-medium pt-4 sm:flex-row sm:justify-between"
          >
            {prev ? (
              <Link
                href={`/${base}/${prev.slug}`}
                className="flex-1 border border-usa-gray-medium px-4 py-3 hover:border-usa-dark hover:bg-usa-gray"
              >
                <span className="block text-xs font-bold uppercase tracking-wide text-usa-gray-dark">
                  ← Précédent
                </span>
                <span className="mt-0.5 block font-semibold text-usa-dark">
                  {prev.numero} — {prev.sousTitre}
                </span>
              </Link>
            ) : (
              <span className="hidden flex-1 sm:block" />
            )}
            {next ? (
              <Link
                href={`/${base}/${next.slug}`}
                className="flex-1 border border-usa-gray-medium px-4 py-3 text-left hover:border-usa-dark hover:bg-usa-gray sm:text-right"
              >
                <span className="block text-xs font-bold uppercase tracking-wide text-usa-gray-dark">
                  Suivant →
                </span>
                <span className="mt-0.5 block font-semibold text-usa-dark">
                  {next.numero} — {next.sousTitre}
                </span>
              </Link>
            ) : (
              <span className="hidden flex-1 sm:block" />
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}
