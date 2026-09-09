import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "@/App";
import { SECTIONS } from "@/components/AnchorNav";
import { caseStudies } from "@/content/case-studies";
import { profile } from "@/data/profile";
import { renderWithRouter } from "@/test/render";

describe("navigation", () => {
	it("exposes the section anchors", () => {
		expect(SECTIONS.map((section) => section.label)).toEqual([
			"What I do",
			"Work",
			"Process",
			"Stack",
			"Contact",
		]);
	});

	it("does not offer a YouTube or Ask AI destination", () => {
		const ids = SECTIONS.map((section) => section.id).join(" ");
		expect(ids).not.toMatch(/youtube|ask-ai/);
	});

	it("keeps the mobile menu's aria-controls target mounted while closed", async () => {
		renderWithRouter(<App />);
		const toggle = await screen.findByRole("button", { name: /open menu/i });
		const targetId = toggle.getAttribute("aria-controls");
		expect(targetId).toBeTruthy();

		const target = document.getElementById(targetId ?? "");
		expect(target).toBeInTheDocument();
		expect(target).not.toBeVisible();
	});
});

// The section's accessible name (used by role "region") comes from the
// Section primitive's `title` prop, not the nav label in SECTIONS — the two
// only coincide by accident, and here they mostly don't (e.g. the nav says
// "What I do" while the section title is "What I can do for your team").
// Matched per section id rather than looping the nav label straight through.
const sectionTitle: Record<string, RegExp> = {
	"what-i-do": /what i can do for your team/i,
	work: /built and run in production/i,
	process: /three things that shape the work/i,
	stack: /the tools behind the work/i,
	contact: /get in touch/i,
};

describe("one page routing", () => {
	it("renders every section on the home route", async () => {
		renderWithRouter(<App />, { route: "/" });
		for (const section of SECTIONS) {
			expect(
				await screen.findByRole("region", { name: sectionTitle[section.id] }),
			).toBeTruthy();
		}
	});

	it("keeps case study detail routes reachable", async () => {
		renderWithRouter(<App />, { route: `/work/${caseStudies[0].slug}` });
		expect(
			await screen.findByRole("heading", {
				level: 1,
				name: caseStudies[0].title,
			}),
		).toBeInTheDocument();
	});

	it("redirects retired page routes onto the one page", async () => {
		renderWithRouter(<App />, { route: "/about" });
		expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent(
			profile.positioning,
		);
	});
});
