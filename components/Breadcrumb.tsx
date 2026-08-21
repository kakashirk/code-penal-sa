import Link from "next/link";

export interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Fil d'Ariane" className="py-3 text-sm text-usa-gray-dark">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {items.map((it, i) => (
          <li key={`${it.label}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && (
              <span aria-hidden="true" className="text-usa-gray-dark">
                ›
              </span>
            )}
            {it.href ? (
              <Link href={it.href} className="text-usa-dark underline hover:text-usa-darkest">
                {it.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-usa-ink">
                {it.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
