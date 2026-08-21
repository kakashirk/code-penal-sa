// Lecture des documents importés depuis content/ (générés par scripts/import-content.mjs).

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

export interface TocEntry {
  level: number;
  text: string;
  slug: string;
}

export interface DocContent {
  slug: string;
  titre: string;
  html: string;
  toc: TocEntry[];
}

const CONTENT_DIR = path.join(process.cwd(), "content");

export function getDoc(slug: string): DocContent | null {
  const file = path.join(CONTENT_DIR, `${slug}.json`);
  if (!existsSync(file)) return null;
  try {
    return JSON.parse(readFileSync(file, "utf8")) as DocContent;
  } catch {
    return null;
  }
}
