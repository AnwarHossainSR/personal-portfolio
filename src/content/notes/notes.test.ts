import { describe, expect, it } from "vitest";
import { getNote, notes } from "@/content/notes";

describe("notes registry", () => {
	it("is sorted newest first", () => {
		const dates = notes.map((note) => note.published);
		expect([...dates].sort().reverse()).toEqual(dates);
	});

	it("has unique slugs", () => {
		const slugs = notes.map((note) => note.slug);
		expect(new Set(slugs).size).toBe(slugs.length);
	});

	it("returns undefined for an unknown slug", () => {
		expect(getNote("not-a-note")).toBeUndefined();
	});

	it("gives every note a body", () => {
		for (const note of notes) {
			expect(typeof note.body).toBe("function");
		}
	});
});
