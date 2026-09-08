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
	/** Four at most. The things you want remembered. */
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
		"Five years on production systems. Video pipelines, analytics platforms for enterprise customers, and the AWS infrastructure underneath both.",
		"Most of what I ship is smaller than what was first proposed. It has to survive the deploy schedule, the team that maintains it, and the traffic that arrives afterwards.",
	],
	capabilities: [
		{
			title: "Backend services",
			body: "APIs and services in Node and TypeScript. Written to be read, changed and deployed by someone who is not me.",
		},
		{
			title: "AWS infrastructure",
			body: "Lambda, ECS, S3 and CloudFront, provisioned in Terraform. An environment is something you reproduce from code, not something you assemble.",
		},
		{
			title: "Media pipelines",
			body: "Video ingest, encoding orchestration and CDN delivery on managed AWS media services.",
		},
		{
			title: "Release automation",
			body: "Build, test and deploy through GitHub Actions. Shipping is something anyone on the team can do.",
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
		label: "React tutorial series on YouTube",
		href: "https://www.youtube.com/@DevelopmentKit",
	},
};
