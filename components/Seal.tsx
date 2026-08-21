export default function Seal({ size = 64 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- SVG statique : next/image n'apporte rien ici
    <img
      src="/seal.svg"
      width={size}
      height={size}
      alt="Sceau du Département de la Justice de l'État de San Andreas"
      className="shrink-0 rounded-full"
    />
  );
}
