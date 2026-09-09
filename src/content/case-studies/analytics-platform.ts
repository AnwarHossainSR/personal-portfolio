import { parseCaseStudy } from "@/content/schema";

export const analyticsPlatform = parseCaseStudy({
	slug: "analytics-platform",
	title: "Building the editor behind a chart publishing platform",
	summary:
		"everviz lets newsrooms and analysts build charts, maps and tables without code, then publish or export them anywhere. I work on the editor, the services behind it, and the export, AI and MCP paths.",
	organisation: "Craftsmen Ltd., on everviz (Visual Elements)",
	domain: "Data visualisation SaaS",
	role: "Full-stack engineer on the authoring interface and the services behind it",
	team: "Product engineering team working with the everviz product group in Norway",
	period: "2024 — present",
	scope:
		"I work on the authoring interface and the API surface it calls, the export path that turns a live visualisation into a static image or a video, and the AI and MCP entry points into the same API. The Highcharts rendering engine itself is upstream and not ours to change; the product's job is to put a usable editor in front of it and make what comes out publishable.",
	stack: [
		"React",
		"TypeScript",
		"Highcharts",
		"Highcharts Maps",
		"Node.js",
		"Monorepo",
		"AWS Lambda",
		"Amazon RDS",
		"DynamoDB",
		"Redis",
		"MCP server",
		"PostHog",
	],
	evidence: "qualitative",
	context:
		"everviz sells on letting a journalist or an analyst produce a publishable chart, map or table without writing code, and then embed it in an article, a broadcast graphic or a slide. That makes the editor the product: whatever the rendering engine underneath can do is irrelevant if the person driving it cannot get to it. The engineering problem is not drawing charts — Highcharts already does that — it is turning a very large configuration surface into choices a non-developer can make confidently, and keeping the output usable everywhere it lands. Not everywhere it lands is a web page, which is why the same configuration also has to come out as a static image or a rendered video for print and broadcast. More recently the same API has a second class of caller: AI assistance inside the editor, and an MCP server that lets an AI client create and edit visualisations through the interfaces the editor already uses.",
	constraints: [
		"The rendering engine is upstream and its configuration model is fixed, so the editor has to adapt to it rather than the other way round",
		"Published output has to keep working on someone else's page long after it was created, which rules out anything that depends on the editor still being open or on a short-lived URL",
		"Print and broadcast consumers cannot run a browser, so image and video output has to be produced server-side from the same stored configuration the web embed uses",
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
		{
			question:
				"How do you produce an image or a video of something that is designed to render in a browser?",
			chose:
				"Render it server-side from the same stored configuration, in a separate export service, and treat export as an asynchronous job rather than a request the user waits on",
			rejected: [
				{
					option:
						"Capture the visualisation in the user's own browser and upload the result",
					why: "It needs no extra service and the rendering is guaranteed to match what the user is looking at. But the output then depends on the machine that produced it — fonts, device pixel ratio, whether the tab stayed open — and a video render is far too long to hold a browser tab hostage for",
				},
			],
			tradeoff:
				"Export becomes its own deployable with its own rendering environment to keep in step with the editor, and a job that fails fails out of sight of the person who asked for it, so it needs its own status and retry path.",
		},
	],
	results: [],
	reflection:
		"The recurring tension in this product is that every capability the rendering engine gains is a question about whether the editor should expose it, and answering that well needs product judgement rather than engineering judgement. The work I would push on is making that a cheaper question to answer — so adding a control is a small, routine change rather than a negotiation each time. The AI and MCP work has sharpened that: a second, non-human caller on the same API makes it obvious where the API describes the product and where it just describes the editor's screens.",
	links: [{ label: "everviz.com", href: "https://www.everviz.com/" }],
});
