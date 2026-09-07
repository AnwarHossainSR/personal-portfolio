import type { Note } from "@/content/schema";

/**
 * Empty until a real note exists. The /writing route and its nav item are
 * conditional on this array, so an empty writing section can never ship.
 */
export const notes: Note[] = [];

export function getNote(slug: string): Note | undefined {
	return notes.find((note) => note.slug === slug);
}
