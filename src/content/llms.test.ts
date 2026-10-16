import { describe, expect, it } from "vitest";
import { caseStudies } from "@/content/case-studies";
import { findPlaceholders } from "@/content/guards";
import { renderLlmsFullTxt, renderLlmsTxt } from "@/content/llms";
import { profile } from "@/data/profile";
import { SITE_URL } from "@/data/site";

const index = renderLlmsTxt();
const full = renderLlmsFullTxt();

describe("llms.txt", () => {
	it("follows the llmstxt.org shape: an H1, then a blockquote summary", () => {
		const [title, blank, summary] = index.split("\n");
		expect(title).toBe(`# ${profile.name}`);
		expect(blank).toBe("");
		expect(summary).toBe(`> ${profile.positioning}`);
	});

	it("links every case study by its absolute URL", () => {
		for (const study of caseStudies) {
			expect(index).toContain(
				`[${study.title}](${SITE_URL}/work/${study.slug})`,
			);
		}
	});

	it("tells a model what each case study does and does not claim", () => {
		for (const study of caseStudies) {
			const line = index
				.split("\n")
				.find((row) => row.includes(`/work/${study.slug})`));
			expect(line).toMatch(/Evidence: /);
		}
	});

	it("points to the full version under Optional", () => {
		const optional = index.slice(index.indexOf("## Optional"));
		expect(optional).toContain(`${SITE_URL}/llms-full.txt`);
	});

	it("uses only absolute links, which is all a model fetching it can follow", () => {
		for (const [, href] of index.matchAll(/\]\(([^)]+)\)/g)) {
			expect(href).toMatch(/^https:\/\//);
		}
	});

	it("has no placeholder text", () => {
		expect(findPlaceholders({ index, full })).toEqual([]);
	});
});

describe("llms-full.txt", () => {
	it("carries every decision with what was rejected and what it cost", () => {
		for (const study of caseStudies) {
			expect(full).toContain(`## ${study.title}`);
			for (const decision of study.decisions) {
				expect(full).toContain(decision.question);
				expect(full).toContain(decision.tradeoff);
				for (const option of decision.rejected) {
					expect(full).toContain(option.why);
				}
			}
			expect(full).toContain(study.reflection);
		}
	});

	it("puts the method next to every number, as the page does", () => {
		for (const study of caseStudies) {
			for (const result of study.results) {
				expect(full).toContain(`(method: ${result.method})`);
			}
		}
	});
});
