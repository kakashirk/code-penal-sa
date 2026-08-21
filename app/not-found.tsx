import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-site px-4 py-16 text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-usa-red">Erreur 404</p>
      <h1 className="mt-2 font-serif text-3xl font-black text-usa-darkest">
        Page introuvable
      </h1>
      <p className="mt-3 text-usa-gray-dark">
        La page demandée n&rsquo;existe pas ou a été déplacée par le greffe.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block bg-usa-dark px-5 py-3 font-bold text-white hover:bg-usa-darkest"
      >
        Retour à l&rsquo;accueil
      </Link>
    </div>
  );
}
