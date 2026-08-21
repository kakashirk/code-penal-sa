export default function Seal({ size = 64 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="Sceau du Département de la Justice de l'État de San Andreas"
      className="shrink-0"
    >
      <circle cx="50" cy="50" r="49" fill="#112e51" />
      <circle cx="50" cy="50" r="46.5" fill="none" stroke="#fdb81e" strokeWidth="1.8" />
      <circle cx="50" cy="50" r="31" fill="none" stroke="#fdb81e" strokeWidth="1.1" />
      <defs>
        <path
          id="seal-arc"
          d="M 50 50 m -38.5 0 a 38.5 38.5 0 1 1 77 0 a 38.5 38.5 0 1 1 -77 0"
        />
      </defs>
      <text
        fontSize="7.6"
        fill="#fdb81e"
        letterSpacing="1.6"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight="bold"
      >
        <textPath href="#seal-arc" startOffset="0">
          ÉTAT DE SAN ANDREAS • DÉPARTEMENT DE LA JUSTICE •
        </textPath>
      </text>
      <path
        d="M50 36.5 L53.9 47.2 L65.4 47.6 L56.3 54.8 L59.5 65.9 L50 59.4 L40.5 65.9 L43.7 54.8 L34.6 47.6 L46.1 47.2 Z"
        fill="#fdb81e"
      />
    </svg>
  );
}
