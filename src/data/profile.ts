export interface ProfileLink {
	label: string;
	href: string;
}

export interface Profile {
	name: string;
	/** One sentence naming the problem shape you are hired for. No stack lists. */
	positioning: string;
	/** Two short paragraphs. First: what you do and for whom. Second: how you work. */
	pitch: string[];
	/** At most three. These are the things you want remembered. */
	headline: string[];
	location: string;
	timezone: string;
	availability: string;
	responseTime: string;
	email: string;
	resumePath: string;
	links: ProfileLink[];
	/** Kept out of the primary link set on purpose; surfaced once, in About. */
	teaching?: ProfileLink;
}

export const profile: Profile = {
	name: "Md. Anwar Hossain",
	positioning:
		"I build and operate the backend and cloud systems that media and commerce products run on, and I keep them working while they change.",
	pitch: [
		"Five years across three companies, most recently on systems where delivery and availability are the product: video ingest and playback, live analytics for enterprise customers, and the AWS infrastructure underneath both.",
		"I work from the constraint inwards. Most of what I ship is a smaller change than the one originally proposed, chosen because it survives the deploy schedule, the team that has to maintain it, and the traffic that arrives afterwards.",
	],
	headline: [
		"Backend and cloud systems on AWS — serverless and containerised",
		"Media pipelines: ingest, transcode orchestration, CDN delivery",
		"Delivery practice: CI/CD, infrastructure as code, production ownership",
	],
	location: "Dhaka, Bangladesh",
	timezone: "UTC+6",
	availability:
		"Open to senior backend and platform roles, remote or Dhaka-based.",
	responseTime: "I reply to email within two working days.",
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
