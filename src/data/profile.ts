export interface ProfileLink {
	label: string;
	href: string;
}

export interface Capability {
	/** Two or three words. A noun phrase, not a sentence. */
	title: string;
	/** One or two short sentences. Plain language, no hedging. */
	body: string;
}

export interface Profile {
	name: string;
	/**
	 * The headline. Short declarative sentences, separated by full stops —
	 * each one a thing you actually do, in the order the work happens.
	 */
	positioning: string;
	/** Two short paragraphs. First: what you do and for whom. Second: how you work. */
	pitch: string[];
	/** Six at most. The things you want remembered. */
	capabilities: Capability[];
	/** One blunt line. The hard truth about the work, and a claim to owning it. */
	creed: string;
	location: string;
	timezone: string;
	availability: string;
	responseTime: string;
	email: string;
	resumePath: string;
	links: ProfileLink[];
	/** Kept out of the primary link set on purpose; surfaced once, near the end. */
	teaching?: ProfileLink;
}

export const profile: Profile = {
	name: "Md. Anwar Hossain",
	positioning:
		"Build backends. Move them to AWS. Automate the release. Keep it running.",
	pitch: [
		"Five years on production systems. Video and export pipelines, a data visualisation platform used by newsrooms and analysts, and the AWS infrastructure underneath both.",
		"Most of what I ship is smaller than what was first proposed. It has to survive the deploy schedule, the team that maintains it, and the traffic that arrives afterwards.",
	],
	capabilities: [
		{
			title: "Backend services",
			body: "APIs and services in Node, TypeScript, PHP and Python, split into microservices with event-driven workflows between them and kept in one monorepo. PostgreSQL on RDS for the data that matters, Redis in front of the paths that get hit hardest.",
		},
		{
			title: "AWS infrastructure",
			body: "Lambda and API Gateway for event-driven work, ECS, EC2 and Elastic Beanstalk for the long-running services, S3 and CloudFront for delivery, RDS and DynamoDB for state, SQS between the parts that should not wait on each other — all provisioned in Terraform. An environment is something you reproduce from code, not something you assemble.",
		},
		{
			title: "Media and export",
			body: "Video ingest, encoding orchestration and CDN delivery on managed AWS media services, and the server-side render path that turns a live visualisation into a static image or a generated video.",
		},
		{
			title: "AI and MCP",
			body: "LLM features inside the product, and MCP servers that let an AI client drive the same API a person drives through the interface.",
		},
		{
			title: "Release automation",
			body: "Build, test and deploy through GitHub Actions, across a monorepo where one change can touch several deployables. Shipping is something anyone on the team can do.",
		},
		{
			title: "Product interfaces",
			body: "React and TypeScript front ends for products people use all day — editors, maps and dashboards — instrumented with PostHog so a design argument can be settled with what users actually did.",
		},
	],
	creed:
		"Software gets judged in production, not in review. That is the part I work on.",
	location: "Dhaka, Bangladesh",
	timezone: "UTC+6",
	availability:
		"Open to senior backend and platform roles. Remote, or Dhaka-based.",
	responseTime: "Email gets a reply within two working days.",
	email: "anwarmahedisr@gmail.com",
	resumePath: "/resume.pdf",
	links: [
		{ label: "GitHub", href: "https://github.com/AnwarHossainSR" },
		{ label: "LinkedIn", href: "https://www.linkedin.com/in/anwarsr/" },
	],
	teaching: {
		label: "tutorial series on YouTube",
		href: "https://www.youtube.com/@DevelopmentKit",
	},
};
