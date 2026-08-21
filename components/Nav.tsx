"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ANNEXES, LIVRES } from "@/lib/registry";
import { IconChevron, IconClose, IconMenu } from "./icons";

type MenuId = "livres" | "annexes";

export default function Nav() {
  const [openMenu, setOpenMenu] = useState<MenuId | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  const lienBase =
    "block px-4 py-3 text-sm font-semibold text-white hover:bg-usa-dark";
  const lienActif = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href))
      ? "bg-usa-dark shadow-[inset_0_-4px_0_#fdb81e]"
      : "";

  const boutonMenu = (id: MenuId, label: string) => (
    <button
      type="button"
      onClick={() => setOpenMenu((v) => (v === id ? null : id))}
      aria-expanded={openMenu === id}
      className={`flex w-full items-center gap-1 px-4 py-3 text-left text-sm font-semibold text-white hover:bg-usa-dark ${
        openMenu === id ? "bg-usa-dark" : ""
      }`}
    >
      {label}
      <IconChevron
        className={`h-3.5 w-3.5 transition-transform ${openMenu === id ? "rotate-180" : ""}`}
      />
    </button>
  );

  return (
    <nav ref={navRef} aria-label="Navigation principale" className="bg-usa-darkest">
      <div className="mx-auto max-w-site px-4 md:px-0 lg:px-4">
        {/* Mobile */}
        <div className="flex items-center justify-between md:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            className="flex items-center gap-2 py-3 text-sm font-bold uppercase tracking-wide text-white"
          >
            {mobileOpen ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
            Menu
          </button>
        </div>
        {mobileOpen && (
          <div className="border-t border-usa-dark pb-3 md:hidden">
            <Link href="/" className={lienBase}>
              Accueil
            </Link>
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-white hover:bg-usa-dark">
                Les 13 Livres
                <IconChevron className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
              </summary>
              <ul className="bg-[#0b2140]">
                {LIVRES.map((l) => (
                  <li key={l.slug}>
                    <Link
                      href={`/livres/${l.slug}`}
                      className="block px-6 py-2 text-[13px] text-white/90 hover:bg-usa-dark"
                    >
                      <span className="font-bold">{l.numero}</span> — {l.sousTitre}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
            <Link href="/grille" className={lienBase}>
              Grille des infractions
            </Link>
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-white hover:bg-usa-dark">
                Annexes
                <IconChevron className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
              </summary>
              <ul className="bg-[#0b2140]">
                {ANNEXES.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/annexes/${a.slug}`}
                      className="block px-6 py-2 text-[13px] text-white/90 hover:bg-usa-dark"
                    >
                      <span className="font-bold">{a.numero}</span> — {a.sousTitre}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
            <Link href="/recherche" className={lienBase}>
              Recherche
            </Link>
          </div>
        )}

        {/* Desktop */}
        <ul className="hidden md:flex">
          <li>
            <Link href="/" className={`${lienBase} ${pathname === "/" ? "bg-usa-dark shadow-[inset_0_-4px_0_#fdb81e]" : ""}`}>
              Accueil
            </Link>
          </li>
          <li className="relative">
            {boutonMenu("livres", "Les 13 Livres")}
            {openMenu === "livres" && (
              <div className="absolute left-0 top-full z-50 w-[30rem] max-w-[85vw] border border-usa-gray-medium bg-white shadow-lg">
                <ul className="max-h-[70vh] overflow-y-auto py-1">
                  {LIVRES.map((l) => (
                    <li key={l.slug}>
                      <Link
                        href={`/livres/${l.slug}`}
                        className="block px-4 py-2 text-sm text-usa-ink hover:bg-usa-gray"
                      >
                        <span className="font-bold text-usa-darkest">{l.numero}</span>
                        <span className="text-usa-gray-dark"> — </span>
                        {l.sousTitre}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
          <li>
            <Link href="/grille" className={`${lienBase} ${lienActif("/grille")}`}>
              Grille des infractions
            </Link>
          </li>
          <li className="relative">
            {boutonMenu("annexes", "Annexes")}
            {openMenu === "annexes" && (
              <div className="absolute left-0 top-full z-50 w-[28rem] max-w-[85vw] border border-usa-gray-medium bg-white shadow-lg">
                <ul className="py-1">
                  {ANNEXES.map((a) => (
                    <li key={a.slug}>
                      <Link
                        href={`/annexes/${a.slug}`}
                        className="block px-4 py-2 text-sm text-usa-ink hover:bg-usa-gray"
                      >
                        <span className="font-bold text-usa-darkest">{a.numero}</span>
                        <span className="text-usa-gray-dark"> — </span>
                        {a.sousTitre}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
          <li>
            <Link href="/recherche" className={`${lienBase} ${lienActif("/recherche")}`}>
              Recherche
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
