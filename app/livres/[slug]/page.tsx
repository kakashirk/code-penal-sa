import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DocPage from "@/components/DocPage";
import { getDoc } from "@/lib/content";
import { LIVRES } from "@/lib/registry";

export const dynamicParams = false;

export function generateStaticParams() {
  return LIVRES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = LIVRES.find((d) => d.slug === slug);
  return { title: meta?.titre ?? "Livre" };
}

export default async function LivrePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const idx = LIVRES.findIndex((d) => d.slug === slug);
  if (idx === -1) notFound();
  return (
    <DocPage
      meta={LIVRES[idx]}
      doc={getDoc(slug)}
      prev={idx > 0 ? LIVRES[idx - 1] : null}
      next={idx < LIVRES.length - 1 ? LIVRES[idx + 1] : null}
      base="livres"
      baseLabel="Les 13 Livres"
    />
  );
}
