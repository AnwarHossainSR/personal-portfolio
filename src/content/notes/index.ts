import type { ReactElement } from "react";
import { type Note, parseNote } from "@/content/schema";

export interface NoteEntry extends Note {
	body: () => ReactElement;
}

function defineNote(meta: unknown, body: () => ReactElement): NoteEntry {
	return { ...parseNote(meta), body };
}

/**
 * Empty until a real note exists. Both the /writing route and its nav item are
 * conditional on `notes.length`, so an empty writing section cannot ship.
 *
 * To publish: create src/content/notes/<slug>.tsx exporting a metadata object
 * and a body component, then register it here with defineNote().
 */
export const notes: NoteEntry[] = [];

notes.sort((a, b) => b.published.localeCompare(a.published));

export function getNote(slug: string): NoteEntry | undefined {
	return notes.find((note) => note.slug === slug);
}

export { defineNote };
