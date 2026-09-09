import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { featuredCaseStudies } from "@/content/case-studies";
import { profile } from "@/data/profile";
import Home from "@/pages/Home";
import { renderWithRouter } from "@/test/render";

describe("Home", () => {
	it("leads with the positioning line, not a job title", () => {
		renderWithRouter(<Home />);
		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
			profile.positioning,
		);
	});

	it("links every featured case study", () => {
		renderWithRouter(<Home />);
		for (const study of featuredCaseStudies) {
			expect(
				screen.getByRole("link", { name: new RegExp(study.title, "i") }),
			).toHaveAttribute("href", `/work/${study.slug}`);
		}
	});

	it("does not render vanity counters", () => {
		renderWithRouter(<Home />);
		expect(screen.queryByText(/years experience/i)).not.toBeInTheDocument();
		expect(screen.queryByText(/projects delivered/i)).not.toBeInTheDocument();
		expect(screen.queryByText(/core technologies/i)).not.toBeInTheDocument();
	});

	it("offers exactly one primary contact path", () => {
		renderWithRouter(<Home />);
		expect(
			screen.getAllByRole("link", { name: /get in touch|contact/i }),
		).toHaveLength(1);
	});
});
