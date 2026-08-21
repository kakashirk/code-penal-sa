"use client";

import { useEffect, useMemo, useState } from "react";
import type { TocEntry } from "@/lib/content";

export default function TocSidebar({ toc }: { toc: TocEntry[] }) {
  const items = useMemo(() => toc.filter((t) => t.level <= 3), [toc]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const headings = items
      .map((t) => document.getElementById(t.slug))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const onScroll = () => {
      const repere = window.scrollY + 100;
      let courant = headings[0].id;
      for (const h of headings) {
        if (h.offsetTop <= repere) courant = h.id;
        else break;
      }
      setActive(courant);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Sommaire" className="text-sm">
      <p className="mb-2 border-b-2 border-usa-gold pb-2 text-xs font-bold uppercase tracking-wide text-usa-darkest">
        Sur cette page
      </p>
      <ul className="space-y-0.5">
        {items.map((t) => (
          <li key={t.slug}>
            <a
              href={`#${t.slug}`}
              className={`block border-l-4 py-1 pr-2 leading-snug ${
                t.level === 1 ? "pl-2" : t.level === 2 ? "pl-4" : "pl-6"
              } ${
                active === t.slug
                  ? "border-usa-dark bg-usa-gray font-bold text-usa-darkest"
                  : "border-transparent text-usa-gray-dark hover:border-usa-gray-medium hover:text-usa-darkest"
              }`}
            >
              {t.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
