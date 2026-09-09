import type { CaseStudy } from "@/content/schema";
import { analyticsPlatform } from "./analytics-platform";
import { releasePath } from "./release-path";
import { vodDelivery } from "./vod-delivery";

/**
 * Order is editorial, not chronological: the first entry is the one that best
 * answers "can this person do the job", because it is the one most readers see.
 */
export const caseStudies: CaseStudy[] = [
	analyticsPlatform,
	vodDelivery,
	releasePath,
];

export const featuredCaseStudies = caseStudies.slice(0, 3);

export function getCaseStudy(slug: string): CaseStudy | undefined {
	return caseStudies.find((study) => study.slug === slug);
}
