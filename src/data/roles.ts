export interface Role {
	id: string;
	company: string;
	title: string;
	period: string;
	location: string;
	/** What you were accountable for. Team size and systems owned. */
	scope: string;
	/** At most three. Outcomes, not duties. A number here needs a method in the sentence. */
	impact: string[];
	/** What you used day to day. Not everything you ever touched. */
	stack: string[];
}

export const roles: Role[] = [
	{
		id: "craftsmen",
		company: "Craftsmen Ltd.",
		title: "Software Development Engineer II — Full Stack",
		period: "May 2024 — present",
		location: "Dhaka, Bangladesh",
		scope:
			"Full-stack and cloud work on a SaaS analytics product and a video-on-demand delivery system. I own the AWS infrastructure those run on and the pipelines that deploy them.",
		impact: [
			"Designed and shipped a video-on-demand delivery system on AWS Media Services, covering encoding, storage and adaptive streaming.",
			"Moved environment provisioning to Terraform, so environments are reproducible from code rather than assembled by hand.",
			"Built the CI/CD pipelines on GitHub Actions and the Serverless Framework that the team releases through.",
		],
		stack: [
			"React",
			"Node.js",
			"TypeScript",
			"AWS Lambda",
			"AWS ECS",
			"DynamoDB",
			"Terraform",
			"GitHub Actions",
		],
	},
	{
		id: "bjit",
		company: "BJIT Group Ltd.",
		title: "Software Engineer — Full Stack",
		period: "August 2021 — May 2024",
		location: "Dhaka, Bangladesh",
		scope:
			"Delivery across e-commerce, logistics and enterprise products in Agile squads, working to client-facing deadlines with distributed teams.",
		impact: [
			"Delivered full-stack applications across e-commerce, logistics and enterprise domains using React, Next.js, Node.js, Django, Laravel and Vue.",
			"Chose storage per workload rather than by default — MySQL, MongoDB, PostgreSQL, Firebase and Redis across services — and designed the persistence strategy that followed.",
			"Named Best Employee of the Year 2023 for sustained delivery and cross-team impact.",
		],
		stack: [
			"React",
			"Next.js",
			"Node.js",
			"Laravel",
			"Django",
			"MySQL",
			"MongoDB",
			"Docker",
		],
	},
	{
		id: "annonlab",
		company: "Annonlab",
		title: "Junior Software Engineer",
		period: "March 2021 — August 2021",
		location: "Dhaka, Bangladesh",
		scope:
			"First professional role. Web application work in a small startup team, with code review and iterative delivery.",
		impact: [
			"Built and maintained web applications in JavaScript, jQuery, PHP and Laravel, and implemented responsive interfaces to design specifications.",
		],
		stack: ["JavaScript", "jQuery", "PHP", "Laravel", "HTML5", "CSS3"],
	},
];
