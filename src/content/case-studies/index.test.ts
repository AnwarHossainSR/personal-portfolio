import { describe, expect, it } from "vitest";
import { caseStudies, getCaseStudy } from "@/content/case-studies";

describe("case study registry", () => {
	it("publishes exactly three case studies", () => {
		expect(caseStudies).toHaveLength(3);
	});

	it("has unique slugs", () => {
		const slugs = caseStudies.map((study) => study.slug);
		expect(new Set(slugs).size).toBe(slugs.length);
	});

	it("looks a case study up by slug", () => {
		expect(getCaseStudy(caseStudies[0].slug)?.title).toBe(caseStudies[0].title);
		expect(getCaseStudy("not-a-real-slug")).toBeUndefined();
	});

	it("never links a bare profile URL in place of a project", () => {
		for (const study of caseStudies) {
			for (const link of study.links) {
				expect(link.href).not.toMatch(/^https:\/\/github\.com\/[^/]+\/?$/);
			}
		}
	});

	it("states a scope boundary on every case study", () => {
		for (const study of caseStudies) {
			expect(study.scope.length).toBeGreaterThan(40);
		}
	});

	it("claims no numeric results while evidence is qualitative", () => {
		for (const study of caseStudies) {
			if (study.evidence === "qualitative") {
				expect(study.results).toHaveLength(0);
			}
		}
	});

	it("names a rejected alternative and a cost on every decision", () => {
		for (const study of caseStudies) {
			for (const decision of study.decisions) {
				expect(decision.rejected.length).toBeGreaterThan(0);
				expect(decision.tradeoff.length).toBeGreaterThan(20);
			}
		}
	});
});
