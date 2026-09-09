import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { caseStudies } from "@/content/case-studies";
import { roles } from "@/data/roles";
import { Work } from "@/sections/Work";
import { renderWithRouter } from "@/test/render";

describe("Work section", () => {
	it("lists every case study with a link to its detail page", () => {
		renderWithRouter(<Work />);
		for (const study of caseStudies) {
			const link = screen.getByRole("link", {
				name: new RegExp(study.title, "i"),
			});
			expect(link).toHaveAttribute("href", `/work/${study.slug}`);
		}
	});

	it("shows the scope boundary for each entry", () => {
		renderWithRouter(<Work />);
		for (const study of caseStudies) {
			expect(screen.getByText(study.scope)).toBeInTheDocument();
		}
	});

	it("shows no card borders or decorative chrome around entries", () => {
		const { container } = renderWithRouter(<Work />);
		expect(container.querySelectorAll(".shadow-lg, .rounded-xl")).toHaveLength(
			0,
		);
	});

	it("lists every role with its scope", () => {
		renderWithRouter(<Work />);
		// Scoped to the track-record block: company names like "Craftsmen Ltd."
		// also appear as case study metadata above, so an unscoped query would
		// match more than one node.
		const trackRecord = screen.getByText("Track record")
			.parentElement as HTMLElement;
		for (const role of roles) {
			expect(within(trackRecord).getByText(role.company)).toBeInTheDocument();
			expect(within(trackRecord).getByText(role.scope)).toBeInTheDocument();
		}
	});
});
