import { parseCaseStudy } from "@/content/schema";

export const analyticsPlatform = parseCaseStudy({
	slug: "analytics-platform",
	title: "Keeping an analytics dashboard responsive as the data grew",
	summary:
		"An enterprise SaaS product rendered live analytics in the browser. I built the dashboard and the API behind it, and reshaped both when charting large result sets started to hurt.",
	organisation: "Craftsmen Ltd.",
	domain: "SaaS / data visualisation",
	role: "Full-stack engineer on the visualisation platform and the API serving it",
	team: "Product engineering team at Craftsmen, working directly with the product owner on what each view had to answer",
	period: "2024 — present",
	scope:
		"I owned the dashboard front end and the query and aggregation API it called. The upstream data collection and the storage schema were owned elsewhere; I consumed them and pushed back on the shape when a view could not be served efficiently.",
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
		"The product's value was that customers could see their operational data rather than export it, so the dashboard was the thing people judged the product by. Charts rendered live in the browser from API responses. That works well while result sets are small, and stops working in two places at once as they grow: the API spends longer assembling responses, and the browser spends longer turning them into pixels. Both failures look identical to a customer — the page is slow — so they had to be separated before either could be fixed.",
	constraints: [
		"The dashboard was already in front of enterprise customers, so changes had to preserve the existing views rather than redesign them",
		"The upstream data model belonged to another part of the system and could not be reshaped on this work's timeline",
	],
	decisions: [
		{
			question:
				"Do we aggregate for the chart on the server, or send rows and let the client shape them?",
			chose:
				"Aggregate server-side and return series already shaped for the chart, so the payload is bounded by the resolution of the view rather than by how much data the customer has",
			rejected: [
				{
					option: "Return raw rows and aggregate in the browser",
					why: "It keeps the API generic and lets the front end change a view without a backend release, which is genuinely useful early on. But payload size then scales with the customer's data volume rather than with what the chart can actually display, and the largest customers — the ones who matter most — get the worst experience. The flexibility is worth least exactly where the performance cost is highest",
				},
			],
			tradeoff:
				"Chart shape and API shape are now coupled: a new view that needs a different aggregation needs a backend change rather than a front-end one, which slows down iteration on the dashboard.",
		},
		{
			question:
				"How do we keep the browser responsive when a view legitimately needs many points?",
			chose:
				"Cap what is rendered at a resolution a chart can usefully show, and let the user narrow the range to get detail back",
			rejected: [
				{
					option:
						"Render everything the API returns and rely on the charting library to cope",
					why: "It is the honest representation of the data and needs no product decision, but past a certain point additional points land inside the same pixel — the user gets no more information while the main thread does more work. Paying render cost for detail nobody can see is a bad trade",
				},
			],
			tradeoff:
				"A user looking at a wide time range is seeing a reduced view, so the interface has to make that legible rather than silently thinning the data — otherwise a chart is quietly lying about its own resolution.",
		},
	],
	results: [],
	reflection:
		"I treated this as a rendering problem for longer than I should have, because the symptom the customer reported was a slow page and the chart was the visible part. Splitting the measurement into server time and client time was what actually made the work tractable, and it was cheap to do. I would reach for that separation first now, before changing anything, rather than after the first fix failed to move the number.",
	links: [],
});
