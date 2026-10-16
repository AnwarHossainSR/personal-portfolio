import type { EvidenceLevel } from "@/content/schema";

/**
 * What each evidence level claims, in words. Shared by the badge on the page
 * and by llms.txt, so a model reading the site is told the same thing about a
 * number's provenance as a person is.
 */
export const EVIDENCE_LABELS: Record<
	EvidenceLevel,
	{ text: string; hint: string }
> = {
	measured: {
		text: "Measured",
		hint: "Numbers below come with the instrument and window used to collect them.",
	},
	estimated: {
		text: "Estimated",
		hint: "Numbers below are defensible approximations, not instrumented measurements.",
	},
	qualitative: {
		text: "No metrics claimed",
		hint: "I do not have figures I can source for this work, so none are given.",
	},
};
