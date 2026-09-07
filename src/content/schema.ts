import { z } from "zod";
import { assertNoPlaceholders } from "@/content/guards";

export const EVIDENCE_LEVELS = [
	"measured",
	"estimated",
	"qualitative",
] as const;
export type EvidenceLevel = (typeof EVIDENCE_LEVELS)[number];

/**
 * A result is only allowed to exist alongside the method that produced it.
 * `method` has a length floor because "logs" or "metrics" is not a method —
 * it has to say what was measured, over what window, against what baseline.
 */
export const resultSchema = z.object({
	metric: z.string().min(3),
	before: z.string().min(1),
	after: z.string().min(1),
	method: z
		.string()
		.min(
			25,
			"state what was measured, over what window, against what baseline",
		),
});

export const rejectedOptionSchema = z.object({
	option: z.string().min(5),
	why: z.string().min(20, "say why it was rejected, not just that it was"),
});

/**
 * The decision block is the reason this site exists. A decision with no
 * rejected alternative is a description of what was built; a decision with a
 * rejected alternative and a named cost is evidence of judgement.
 */
export const decisionSchema = z.object({
	question: z.string().min(10),
	chose: z.string().min(10),
	rejected: z
		.array(rejectedOptionSchema)
		.min(1, "name at least one alternative you turned down"),
	tradeoff: z.string().min(20, "every real decision costs something; name it"),
});

export const linkSchema = z.object({
	label: z.string().min(1),
	href: z.string().url(),
});

const caseStudyShape = z.object({
	slug: z
		.string()
		.regex(
			/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
			"lowercase kebab-case only; it becomes the URL",
		),
	title: z.string().min(15).max(90),
	summary: z.string().min(40).max(220),
	organisation: z.string().min(2),
	domain: z.string().min(3),
	role: z.string().min(10),
	team: z.string().min(5),
	period: z.string().min(4),
	scope: z.string().min(40, "name what you owned and what you did not"),
	stack: z.array(z.string().min(1)).min(3).max(8),
	evidence: z.enum(EVIDENCE_LEVELS),
	context: z.string().min(120),
	constraints: z
		.array(z.string().min(20))
		.min(2, "work without constraints looks easy"),
	decisions: z.array(decisionSchema).min(1).max(4),
	results: z.array(resultSchema).max(5),
	reflection: z.string().min(80, "what you would do differently, specifically"),
	links: z.array(linkSchema).default([]),
});

export const caseStudySchema = caseStudyShape.superRefine((value, ctx) => {
	if (value.evidence === "measured" && value.results.length === 0) {
		ctx.addIssue({
			code: "custom",
			path: ["results"],
			message:
				"evidence is 'measured' but no results are given — downgrade to 'qualitative' or add the numbers",
		});
	}

	if (value.evidence === "qualitative" && value.results.length > 0) {
		ctx.addIssue({
			code: "custom",
			path: ["evidence"],
			message:
				"evidence is 'qualitative' but results are present — a number you can state is 'measured' or 'estimated'",
		});
	}
});

export type CaseStudy = z.infer<typeof caseStudyShape>;
export type Result = z.infer<typeof resultSchema>;
export type Decision = z.infer<typeof decisionSchema>;
export type RejectedOption = z.infer<typeof rejectedOptionSchema>;

export function parseCaseStudy(input: unknown): CaseStudy {
	const slug =
		input && typeof input === "object" && "slug" in input
			? String(input.slug)
			: "unknown";
	assertNoPlaceholders(input, `case-study:${slug}`);

	const parsed = caseStudySchema.safeParse(input);
	if (!parsed.success) {
		const detail = parsed.error.issues
			.map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
			.join("; ");
		throw new Error(`case-study:${slug} is invalid — ${detail}`);
	}

	return parsed.data;
}

export const noteSchema = z.object({
	slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
	title: z.string().min(10).max(90),
	summary: z.string().min(40).max(220),
	published: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "ISO date, YYYY-MM-DD"),
	readingMinutes: z.number().int().min(1).max(60),
	tags: z.array(z.string().min(1)).min(1).max(4),
});

export type Note = z.infer<typeof noteSchema>;

export function parseNote(input: unknown): Note {
	const slug =
		input && typeof input === "object" && "slug" in input
			? String(input.slug)
			: "unknown";
	assertNoPlaceholders(input, `note:${slug}`);

	const parsed = noteSchema.safeParse(input);
	if (!parsed.success) {
		const detail = parsed.error.issues
			.map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
			.join("; ");
		throw new Error(`note:${slug} is invalid — ${detail}`);
	}

	return parsed.data;
}
