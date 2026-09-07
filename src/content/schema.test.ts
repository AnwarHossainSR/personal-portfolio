import { describe, expect, it } from "vitest";
import { parseCaseStudy } from "@/content/schema";

const valid = {
	slug: "vod-ingest",
	title: "Cutting failed video ingests by rebuilding the upload path",
	summary:
		"Rebuilt a fragile media ingest pipeline so large uploads stopped failing at the edge.",
	organisation: "BJIT Group Ltd.",
	domain: "Video streaming / VOD",
	role: "Backend engineer, owned the ingest path end to end",
	team: "4 engineers, 1 QA, 1 product manager",
	period: "2023",
	scope:
		"I owned upload, transcode orchestration and storage. Playback and the player UI belonged to another team.",
	stack: ["Node.js", "AWS S3", "CloudFront", "PostgreSQL", "Redis"],
	evidence: "measured" as const,
	context:
		"Editors uploading long-form video over unreliable connections were seeing uploads fail near completion, and every failure meant restarting a multi-gigabyte transfer from zero.",
	constraints: [
		"No downtime window: the existing upload path had to keep working during the migration",
		"Three engineers for six weeks",
	],
	decisions: [
		{
			question: "How do we make large uploads survive a dropped connection?",
			chose:
				"Direct-to-S3 multipart uploads with presigned URLs, resumed client-side from the last acknowledged part",
			rejected: [
				{
					option:
						"Keep proxying the upload through the API and add a retry loop",
					why: "The API instances would still hold the whole transfer in flight, so a deploy or a scale-in event during an upload would kill it regardless of retries",
				},
			],
			tradeoff:
				"Validation moved after the upload rather than before it, so bad files now consume storage and are rejected asynchronously.",
		},
	],
	results: [
		{
			metric: "Failed uploads over 1GB",
			before: "18% of attempts",
			after: "under 2% of attempts",
			method:
				"Ingest service logs, 30 days either side of the cutover, same editor cohort",
		},
	],
	reflection:
		"I would have added the async validation queue in the same release rather than the one after. For three weeks bad files accumulated in the bucket and someone had to clear them by hand.",
	links: [],
};

describe("parseCaseStudy", () => {
	it("accepts a complete, measured case study", () => {
		expect(parseCaseStudy(valid).slug).toBe("vod-ingest");
	});

	it("rejects a measured case study with no results", () => {
		expect(() => parseCaseStudy({ ...valid, results: [] })).toThrow(
			/measured/i,
		);
	});

	it("rejects a qualitative case study that still carries numeric results", () => {
		expect(() => parseCaseStudy({ ...valid, evidence: "qualitative" })).toThrow(
			/qualitative/i,
		);
	});

	it("rejects a result whose method is missing or too short to be a method", () => {
		const results = [{ ...valid.results[0], method: "logs" }];
		expect(() => parseCaseStudy({ ...valid, results })).toThrow();
	});

	it("rejects a decision with no rejected alternative", () => {
		const decisions = [{ ...valid.decisions[0], rejected: [] }];
		expect(() => parseCaseStudy({ ...valid, decisions })).toThrow();
	});

	it("rejects placeholder text anywhere in the content", () => {
		expect(() =>
			parseCaseStudy({ ...valid, reflection: "TODO: write the reflection" }),
		).toThrow(/placeholder/i);
	});

	it("caps the stack list so it cannot become a keyword dump", () => {
		const stack = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];
		expect(() => parseCaseStudy({ ...valid, stack })).toThrow();
	});
});
