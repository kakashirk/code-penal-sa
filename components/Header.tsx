import Link from "next/link";
import Seal from "./Seal";
import { IconLoupe } from "./icons";

export default function Header() {
  return (
    <header className="border-b border-usa-gray-medium bg-white">
      <div className="mx-auto flex max-w-site flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Seal size={58} />
          <span className="block min-w-0">
            <span className="block font-serif text-lg font-black leading-tight text-usa-darkest sm:text-2xl">
              Code Pénal de l&rsquo;État de San Andreas
            </span>
            <span className="block text-sm text-usa-gray-dark">Département de la Justice</span>
          </span>
        </Link>
        <form action="/recherche" role="search" className="flex w-full sm:w-auto">
          <label htmlFor="recherche-header" className="sr-only">
            Rechercher dans le Code
          </label>
          <input
            id="recherche-header"
            name="q"
            type="search"
            placeholder="Rechercher dans le Code…"
            className="h-10 w-full border border-r-0 border-usa-gray-dark px-3 text-sm focus:outline-none focus:ring-2 focus:ring-usa-dark sm:w-64"
          />
          <button
            type="submit"
            aria-label="Rechercher"
            className="flex h-10 w-11 shrink-0 items-center justify-center bg-usa-red hover:bg-usa-red-dark"
          >
            <IconLoupe className="h-4 w-4 text-white" />
          </button>
        </form>
      </div>
    </header>
  );
}
