import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DocPage from "@/components/DocPage";
import { getDoc } from "@/lib/content";
import { ANNEXES } from "@/lib/registry";

export const dynamicParams = false;

export function generateStaticParams() {
  return ANNEXES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = ANNEXES.find((d) => d.slug === slug);
  return { title: meta?.titre ?? "Annexe" };
}

export default async function AnnexePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const idx = ANNEXES.findIndex((d) => d.slug === slug);
  if (idx === -1) notFound();
  return (
    <DocPage
      meta={ANNEXES[idx]}
      doc={getDoc(slug)}
      prev={idx > 0 ? ANNEXES[idx - 1] : null}
      next={idx < ANNEXES.length - 1 ? ANNEXES[idx + 1] : null}
      base="annexes"
      baseLabel="Annexes"
    />
  );
}
