import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { caseStudies } from "@/content/case-studies";
import Work from "@/pages/Work";
import { renderWithRouter } from "@/test/render";

describe("Work", () => {
	it("lists every case study as a link to its detail page", () => {
		renderWithRouter(<Work />);
		for (const study of caseStudies) {
			const link = screen.getByRole("link", {
				name: new RegExp(study.title, "i"),
			});
			expect(link).toHaveAttribute("href", `/work/${study.slug}`);
		}
	});

	it("shows the evidence level for each entry on the index", () => {
		renderWithRouter(<Work />);
		expect(
			screen.getAllByTitle(/numbers below|do not have figures/i).length,
		).toBe(caseStudies.length);
	});

	it("does not render a technology count or a projects-delivered counter", () => {
		renderWithRouter(<Work />);
		expect(screen.queryByText(/50\+/)).not.toBeInTheDocument();
		expect(screen.queryByText(/projects delivered/i)).not.toBeInTheDocument();
	});
});
