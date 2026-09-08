import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { caseStudies } from "@/content/case-studies";
import { Work } from "@/sections/Work";
import { renderWithRouter } from "@/test/render";

describe("Work section", () => {
	it("lists every case study with a link to its detail page", () => {
		renderWithRouter(<Work />);
		for (const study of caseStudies) {
			const link = screen.getByRole("link", { name: new RegExp(study.title, "i") });
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
		expect(container.querySelectorAll(".shadow-lg, .rounded-xl")).toHaveLength(0);
	});
});
