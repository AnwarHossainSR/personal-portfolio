import { parseCaseStudy } from "@/content/schema";

export const analyticsPlatform = parseCaseStudy({
	slug: "analytics-platform",
	title: "Building the analytics dashboard customers judge the product by",
	summary:
		"An enterprise SaaS product sells on being able to show customers their own operational data. I built the dashboard that does the showing, and the API that feeds it.",
	organisation: "Craftsmen Ltd.",
	domain: "SaaS / data visualisation",
	role: "Full-stack engineer on the visualisation platform and the API serving it",
	team: "Product engineering team at Craftsmen, working directly with the product owner on what each view had to answer",
	period: "2024 — present",
	scope:
		"I owned the dashboard front end and the query and aggregation API it called. The upstream data collection and the storage schema were owned elsewhere; I consumed them and raised it when a view could not be served efficiently from the shape available.",
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
		"The product's value is that customers can see their operational data rather than export it and work on it elsewhere, which makes the dashboard the surface the product gets judged on. Charts render live in the browser from API responses. That arrangement has a design decision buried in it that is cheap to make early and expensive to change later: how much of the work of turning records into a chart happens on the server, and how much arrives in the browser as raw data.",
	constraints: [
		"The views are enterprise-facing and each one exists to answer a specific operational question, so the shape of a chart was a product decision rather than something engineering could choose freely",
		"The upstream data model belonged to another part of the system and could not be reshaped to suit a view on this work's timeline",
	],
	decisions: [
		{
			question:
				"Do we aggregate for the chart on the server, or send rows and let the client shape them?",
			chose:
				"Aggregate server-side and return series already shaped for the chart, so a response is bounded by the resolution of the view rather than by how much data the customer has",
			rejected: [
				{
					option: "Return raw rows and aggregate in the browser",
					why: "It keeps the API generic and lets the front end add a view without a backend release, which is genuinely useful early on. But payload size then scales with the customer's data volume rather than with what the chart can display, so the largest customers get the worst experience — and the flexibility is worth least exactly where the cost is highest",
				},
			],
			tradeoff:
				"Chart shape and API shape are now coupled: a new view needing a different aggregation needs a backend change rather than a front-end one, which slows iteration on the dashboard.",
		},
		{
			question: "What should 'real-time' actually mean for these dashboards?",
			chose:
				"Refresh on an interval the data's own update rate justifies, so the number on screen is current within a window the customer can reason about",
			rejected: [
				{
					option: "Push updates continuously over a persistent connection",
					why: "It is the more impressive answer and the right one when a user acts on sub-second changes. But it adds connection lifecycle, reconnection and fan-out concerns to a dashboard whose underlying data does not change that fast, which is infrastructure bought for a property nobody is using",
				},
			],
			tradeoff:
				"There is a bounded staleness window on every figure, so the interface has to be honest about when it last updated rather than implying the number is live to the second.",
		},
	],
	results: [],
	reflection:
		"The coupling introduced by server-side aggregation is the thing to watch. It was the right call for payload size, but it means the dashboard cannot grow a new view without backend work, and that friction compounds quietly. If I were extending this, I would look at whether a small set of parameterised aggregations could cover most new views without a release each time.",
	links: [],
});
