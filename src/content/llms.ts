import { caseStudies } from "@/content/case-studies";
import { EVIDENCE_LABELS } from "@/content/evidence";
import type { CaseStudy } from "@/content/schema";
import { processSteps } from "@/data/process";
import { profile } from "@/data/profile";
import { recognition } from "@/data/recognition";
import { roles } from "@/data/roles";
import { SITE_URL, SOURCE_URL } from "@/data/site";
import { stackGroups } from "@/data/stack";

/*
 * The site, for language models: /llms.txt in the llmstxt.org format, and
 * /llms-full.txt with every case study written out in full.
 *
 * Rendered at build time from the same parsed, schema-checked content the
 * pages render (vite.config.ts emits both files), so it cannot say anything
 * the page does not. When a recruiter's assistant is asked about this person,
 * this is what it should read rather than a scrape of the markup — and it
 * carries the evidence level of every case study, so a model is told what the
 * work does and does not claim, the same as a person is.
 */

const caseStudyUrl = (study: CaseStudy) => `${SITE_URL}/work/${study.slug}`;

function evidenceLine(study: CaseStudy): string {
	const label = EVIDENCE_LABELS[study.evidence];
	return `${label.text}. ${label.hint}`;
}

function header(): string[] {
	return [
		`# ${profile.name}`,
		"",
		`> ${profile.positioning}`,
		"",
		...profile.pitch.flatMap((paragraph) => [paragraph, ""]),
		`- Location: ${profile.location} (${profile.timezone})`,
		`- Availability: ${profile.availability}`,
		`- Contact: ${profile.email} — ${profile.responseTime}`,
		"",
	];
}

function capabilities(): string[] {
	return [
		"## Capabilities",
		"",
		...profile.capabilities.map((c) => `- **${c.title}**: ${c.body}`),
		"",
		`${profile.creed}`,
		"",
	];
}

function trackRecord(): string[] {
	return [
		"## Track record",
		"",
		...roles.flatMap((role) => [
			`### ${role.title} — ${role.company} (${role.period})`,
			"",
			role.scope,
			"",
			...role.impact.map((item) => `- ${item}`),
			"",
			`Stack: ${role.stack.join(", ")}`,
			"",
		]),
	];
}

function stack(): string[] {
	return [
		"## Stack",
		"",
		"No proficiency ratings: what each tool is used for, and since when.",
		"",
		...stackGroups.flatMap((group) => [
			`### ${group.name}`,
			"",
			group.purpose,
			"",
			...group.items.map(
				(item) => `- ${item.name}: ${item.usedFor} (since ${item.since})`,
			),
			"",
		]),
	];
}

function process(): string[] {
	return [
		"## How I work",
		"",
		...processSteps.map((step) => `- **${step.title}**: ${step.body}`),
		"",
	];
}

function proof(): string[] {
	if (recognition.length === 0) return [];
	return [
		"## Recognition",
		"",
		...recognition.map(
			(item) =>
				`- ${item.title}, ${item.issuer} (${item.year})${item.note ? `: ${item.note}` : ""}`,
		),
		"",
	];
}

function links(): string[] {
	return [
		"## Links",
		"",
		`- [Résumé (PDF)](${SITE_URL}${profile.resumePath})`,
		...profile.links.map((link) => `- [${link.label}](${link.href})`),
		"",
	];
}

/** /llms.txt — the index: who, what, and where to read more. */
export function renderLlmsTxt(): string {
	return [
		...header(),
		"## Case studies",
		"",
		...caseStudies.map(
			(study) =>
				`- [${study.title}](${caseStudyUrl(study)}): ${study.summary} Evidence: ${EVIDENCE_LABELS[study.evidence].text.toLowerCase()}.`,
		),
		"",
		...capabilities(),
		...trackRecord(),
		...links(),
		"## Optional",
		"",
		`- [Every case study in full](${SITE_URL}/llms-full.txt): context, constraints, decisions with the options rejected, and what each one cost`,
		`- [Source code for this site](${SOURCE_URL})`,
		"",
	].join("\n");
}

function fullCaseStudy(study: CaseStudy): string[] {
	return [
		`## ${study.title}`,
		"",
		`URL: ${caseStudyUrl(study)}`,
		`Organisation: ${study.organisation} · ${study.period} · ${study.domain}`,
		`Role: ${study.role}`,
		`Team: ${study.team}`,
		`Stack: ${study.stack.join(", ")}`,
		`Evidence: ${evidenceLine(study)}`,
		"",
		study.summary,
		"",
		"### What I owned",
		"",
		study.scope,
		"",
		"### The situation",
		"",
		study.context,
		"",
		"### Constraints",
		"",
		...study.constraints.map((constraint) => `- ${constraint}`),
		"",
		"### Decisions",
		"",
		...study.decisions.flatMap((decision, index) => [
			`#### ${index + 1}. ${decision.question}`,
			"",
			`- Chose: ${decision.chose}`,
			...decision.rejected.map(
				(option) => `- Rejected: ${option.option} — ${option.why}`,
			),
			`- What it cost: ${decision.tradeoff}`,
			"",
		]),
		...(study.results.length > 0
			? [
					"### Results",
					"",
					...study.results.map(
						(result) =>
							`- ${result.metric}: ${result.before} → ${result.after} (method: ${result.method})`,
					),
					"",
				]
			: []),
		"### What I'd do differently",
		"",
		study.reflection,
		"",
		...(study.links.length > 0
			? [
					"### Links",
					"",
					...study.links.map((link) => `- [${link.label}](${link.href})`),
					"",
				]
			: []),
	];
}

/** /llms-full.txt — everything, so a model needs no second request. */
export function renderLlmsFullTxt(): string {
	return [
		...header(),
		...capabilities(),
		"# Case studies",
		"",
		...caseStudies.flatMap(fullCaseStudy),
		...trackRecord(),
		...process(),
		...stack(),
		...proof(),
		...links(),
	].join("\n");
}
