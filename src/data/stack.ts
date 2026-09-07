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
				usedFor: "Most production services since 2021",
				since: "2019",
			},
			{
				name: "Express",
				usedFor: "HTTP layer on the Node services",
				since: "2019",
			},
			{
				name: "Laravel / PHP",
				usedFor: "Enterprise applications at BJIT and Annon Lab",
				since: "2020",
			},
			{
				name: "PostgreSQL",
				usedFor: "Primary datastore; schema design and query tuning",
				since: "2021",
			},
			{
				name: "Redis",
				usedFor: "Caching and queues in front of hot paths",
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
				since: "2021",
			},
			{
				name: "S3 + CloudFront",
				usedFor: "Media storage and delivery on the VOD work",
				since: "2022",
			},
			{
				name: "ECS + EC2",
				usedFor: "Long-running containerised services",
				since: "2022",
			},
			{
				name: "Terraform",
				usedFor: "Environment provisioning; parity between staging and prod",
				since: "2023",
			},
			{
				name: "GitHub Actions",
				usedFor: "Build, test and deploy pipelines with rollback",
				since: "2022",
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
				since: "2020",
			},
			{
				name: "Next.js",
				usedFor: "Server-rendered product surfaces",
				since: "2022",
			},
			{
				name: "Tailwind CSS",
				usedFor: "Styling, including this site",
				since: "2022",
			},
		],
	},
];
