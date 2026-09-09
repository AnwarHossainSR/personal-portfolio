export interface StackItem {
	name: string;
	/** What you build with it. One clause. */
	usedFor: string;
	/** Roughly since when. A year, not a self-graded level. */
	since: string;
}

export interface StackGroup {
	name: string;
	purpose: string;
	items: StackItem[];
}

/**
 * Deliberately has no proficiency field. Self-assigned levels are the least
 * reliable evidence on a portfolio, and 44 of them read as breadth-anxiety.
 * What a technology is used for is checkable in conversation; "Expert" is not.
 */
export const stackGroups: StackGroup[] = [
	{
		name: "Services and APIs",
		purpose: "What I reach for when the work is a backend that has to stay up.",
		items: [
			{
				name: "Node.js + TypeScript",
				usedFor: "Most production services",
				since: "2021",
			},
			{
				name: "Express",
				usedFor: "HTTP layer on the Node services",
				since: "2021",
			},
			{
				name: "PHP + Laravel",
				usedFor: "Enterprise applications at BJIT and Annonlab",
				since: "2021",
			},
			{
				name: "Python",
				usedFor:
					"Django and FastAPI services, and scripting around the pipelines",
				since: "2022",
			},
			{
				name: "PostgreSQL",
				usedFor: "Primary datastore; schema design and query tuning",
				since: "2021",
			},
			{
				name: "Redis",
				usedFor: "Caching and queues in front of hot paths",
				since: "2022",
			},
			{
				name: "MCP servers",
				usedFor:
					"Exposing product capability to AI clients over the product API",
				since: "2025",
			},
		],
	},
	{
		name: "Architecture",
		purpose:
			"How the systems are shaped, which outlasts what they are written in.",
		items: [
			{
				name: "Microservices",
				usedFor: "Service boundaries drawn per domain rather than per team",
				since: "2022",
			},
			{
				name: "Event-driven workflows",
				usedFor:
					"Queues and events between the parts that should not block each other",
				since: "2024",
			},
			{
				name: "Monorepo",
				usedFor: "One repository across the services and the front ends",
				since: "2024",
			},
			{
				name: "Polyglot persistence",
				usedFor: "Storage matched to the workload instead of chosen once",
				since: "2021",
			},
		],
	},
	{
		name: "AWS and delivery",
		purpose: "Where those services run, and how they get there.",
		items: [
			{
				name: "Lambda + API Gateway",
				usedFor: "Event-driven and request-scoped workloads",
				since: "2024",
			},
			{
				name: "ECS + EC2",
				usedFor: "Long-running containerised services",
				since: "2022",
			},
			{
				name: "Elastic Beanstalk",
				usedFor: "Managed hosting for services that predate the container work",
				since: "2024",
			},
			{
				name: "RDS + DynamoDB",
				usedFor: "Relational and key-value state behind the services",
				since: "2024",
			},
			{
				name: "S3 + CloudFront",
				usedFor: "Media storage and delivery on the VOD and export work",
				since: "2024",
			},
			{
				name: "Terraform",
				usedFor: "Environment provisioning; parity between staging and prod",
				since: "2024",
			},
			{
				name: "GitHub Actions",
				usedFor: "Build, test and deploy pipelines",
				since: "2024",
			},
		],
	},
	{
		name: "Interfaces",
		purpose: "The front end I build when the product needs one.",
		items: [
			{
				name: "React",
				usedFor: "Product interfaces and internal tools",
				since: "2021",
			},
			{
				name: "Next.js",
				usedFor: "Server-rendered product surfaces",
				since: "2022",
			},
			{
				name: "Highcharts",
				usedFor: "Charts, maps and tables in the everviz editor",
				since: "2024",
			},
			{
				name: "Tailwind CSS",
				usedFor: "Styling, including this site",
				since: "2022",
			},
			{
				name: "PostHog",
				usedFor: "Product analytics behind interface decisions",
				since: "2024",
			},
		],
	},
];
