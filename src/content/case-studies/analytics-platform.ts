import { parseCaseStudy } from "@/content/schema";

export const analyticsPlatform = parseCaseStudy({
	slug: "analytics-platform",
	title: "Building the editor behind a chart publishing platform",
	summary:
		"everviz lets newsrooms and analysts build charts, maps and tables without writing code, then publish them anywhere. I work on the React and Highcharts front end that does the building.",
	organisation: "Craftsmen Ltd., on everviz (Visual Elements)",
	domain: "Data visualisation SaaS",
	role: "Full-stack engineer on the authoring interface and the services behind it",
	team: "Product engineering team working with the everviz product group in Norway",
	period: "2024 — present",
	scope:
		"I work on the authoring interface and the API surface it calls. The Highcharts rendering engine itself is upstream and not ours to change; the product's job is to put a usable editor in front of it and make what comes out publishable.",
	stack: [
		"React",
		"TypeScript",
		"Highcharts",
		"Node.js",
		"AWS Lambda",
		"DynamoDB",
	],
	evidence: "qualitative",
	context:
		"everviz sells on letting a journalist or an analyst produce a publishable chart, map or table without writing code, and then embed it in an article, a broadcast graphic or a slide. That makes the editor the product: whatever the rendering engine underneath can do is irrelevant if the person driving it cannot get to it. The engineering problem is not drawing charts — Highcharts already does that — it is turning a very large configuration surface into choices a non-developer can make confidently, and keeping the output usable everywhere it lands.",
	constraints: [
		"The rendering engine is upstream and its configuration model is fixed, so the editor has to adapt to it rather than the other way round",
		"Published output has to keep working on someone else's page long after it was created, which rules out anything that depends on the editor still being open or on a short-lived URL",
	],
	decisions: [
		{
			question:
				"How much of the rendering engine's configuration surface do we expose in the editor?",
			chose:
				"Curate it — surface the options that answer a real editorial question, and keep the full configuration reachable but out of the default path",
			rejected: [
				{
					option:
						"Expose the whole configuration object and let the user find what they need",
					why: "It is the most powerful option and the least work to build, since it needs no product decisions about what matters. But the people this product is for are journalists and analysts, not developers — handing them the full surface means the common case takes as long as the rare one, which is the opposite of what they are paying for",
				},
			],
			tradeoff:
				"Every curated control is a product decision that has to be revisited when the engine adds capability, so the editor carries ongoing maintenance that a raw configuration form would not.",
		},
		{
			question:
				"What has to be true for a published visualisation to keep working?",
			chose:
				"Treat the published artefact as independent of the editor — it renders from its own stored configuration and data, so nothing about it depends on the session that produced it",
			rejected: [
				{
					option:
						"Render published output by calling back into the authoring service",
					why: "It keeps a single source of truth and means an edit is live everywhere immediately, which sounds strictly better. But it puts the authoring service in the critical path of every page view on someone else's site, so our downtime becomes their broken article",
				},
			],
			tradeoff:
				"An edit is not automatically reflected everywhere the visualisation was already embedded, so republishing becomes an explicit step the user has to understand.",
		},
	],
	results: [],
	reflection:
		"The recurring tension in this product is that every capability the rendering engine gains is a question about whether the editor should expose it, and answering that well needs product judgement rather than engineering judgement. The work I would push on is making that a cheaper question to answer — so adding a control is a small, routine change rather than a negotiation each time.",
	links: [{ label: "everviz.com", href: "https://www.everviz.com/" }],
});
