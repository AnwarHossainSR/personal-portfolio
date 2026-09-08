import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { notes } from "@/content/notes";
import Writing from "@/pages/Writing";
import { renderWithRouter } from "@/test/render";

describe("Writing", () => {
	it("renders a heading", () => {
		renderWithRouter(<Writing />);
		expect(
			screen.getByRole("heading", { level: 1, name: /writing/i }),
		).toBeInTheDocument();
	});

	it("links every published note", () => {
		renderWithRouter(<Writing />);
		for (const note of notes) {
			expect(
				screen.getByRole("link", { name: new RegExp(note.title, "i") }),
			).toHaveAttribute("href", `/writing/${note.slug}`);
		}
	});
});
