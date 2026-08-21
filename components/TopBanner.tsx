"use client";

import { useState } from "react";
import { IconBuilding, IconChevron, IconLock } from "./icons";

function FlagSA() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true" className="shrink-0 border border-usa-gray-medium">
      <rect width="18" height="12" fill="#e31c3d" />
      <rect y="1.7" width="18" height="1.7" fill="#ffffff" />
      <rect y="5.1" width="18" height="1.7" fill="#ffffff" />
      <rect y="8.5" width="18" height="1.7" fill="#ffffff" />
      <rect width="8" height="6.8" fill="#112e51" />
      <path d="M4 1.4 4.6 3h1.7L4.9 4l.5 1.7L4 4.7 2.6 5.7 3.1 4 1.7 3h1.7Z" fill="#ffffff" />
    </svg>
  );
}

export default function TopBanner() {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-usa-gray border-b border-usa-gray-medium text-[13px] leading-snug text-usa-ink">
      <div className="mx-auto max-w-site px-4">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 py-1.5">
          <FlagSA />
          <span>Un site officiel de l&rsquo;État de San Andreas</span>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="inline-flex items-center gap-0.5 text-usa-dark underline hover:text-usa-darkest"
          >
            Voici comment le vérifier
            <IconChevron className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        </div>
        {open && (
          <div className="grid max-w-4xl gap-5 py-5 md:grid-cols-2">
            <div className="flex gap-3">
              <IconBuilding className="h-8 w-8 shrink-0 text-usa-gray-dark" />
              <p>
                <strong>Les sites officiels utilisent le domaine de l&rsquo;État</strong>
                <br />
                Un site du gouvernement de San Andreas appartient à une institution
                officielle de l&rsquo;État, placée sous l&rsquo;autorité du Département de la
                Justice et du Bureau du Gouverneur.
              </p>
            </div>
            <div className="flex gap-3">
              <IconLock className="h-8 w-8 shrink-0 text-usa-gray-dark" />
              <p>
                <strong>Les sites sécurisés utilisent HTTPS</strong>
                <br />
                Un cadenas ou <strong>https://</strong> signifie que vous êtes connecté en
                toute sécurité au site officiel. Ne partagez des informations sensibles
                que sur des sites officiels et sécurisés.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
