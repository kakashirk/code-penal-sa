import { NIVEAU_LABELS, type Niveau } from "@/data/infractions";

const COULEURS: Record<Niveau, string> = {
  1: "bg-usa-green text-white",
  2: "bg-usa-gold text-usa-ink",
  3: "bg-usa-orange text-white",
  4: "bg-usa-red text-white",
};

export default function NiveauBadge({ niveau }: { niveau: Niveau }) {
  return (
    <span
      title={NIVEAU_LABELS[niveau]}
      className={`inline-block rounded-sm px-1.5 py-1 text-[11px] font-bold leading-none ${COULEURS[niveau]}`}
    >
      N{niveau}
    </span>
  );
}
