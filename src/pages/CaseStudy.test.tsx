import { screen } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { caseStudies } from "@/content/case-studies";
import CaseStudy from "@/pages/CaseStudy";
import { renderWithRouter } from "@/test/render";

const study = caseStudies[0];

function renderAt(slug: string) {
	return renderWithRouter(
		<Routes>
			<Route path="/work/:slug" element={<CaseStudy />} />
		</Routes>,
		{ route: `/work/${slug}` },
	);
}

describe("CaseStudy", () => {
	it("renders the title as the page heading", () => {
		renderAt(study.slug);
		expect(
			screen.getByRole("heading", { level: 1, name: study.title }),
		).toBeInTheDocument();
	});

	it("renders context, constraints, every decision and the reflection", () => {
		renderAt(study.slug);
		expect(
			screen.getByRole("heading", { name: /the situation/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("heading", { name: /constraints/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("heading", { name: /what i'd do differently/i }),
		).toBeInTheDocument();
		for (const decision of study.decisions) {
			expect(screen.getByText(decision.question)).toBeInTheDocument();
		}
	});

	it("states the scope boundary", () => {
		renderAt(study.slug);
		expect(screen.getByText(study.scope)).toBeInTheDocument();
	});

	it("renders the method for every result", () => {
		renderAt(study.slug);
		for (const result of study.results) {
			expect(screen.getByText(result.method)).toBeInTheDocument();
		}
	});

	it("renders a not-found page for an unknown slug", () => {
		renderAt("no-such-case-study");
		expect(screen.getByText(/page not found/i)).toBeInTheDocument();
	});
});
