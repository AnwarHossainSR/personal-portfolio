import { parseCaseStudy } from "@/content/schema";

export const releasePath = parseCaseStudy({
	slug: "release-path",
	title: "Putting environments in code and releases behind a pipeline",
	summary:
		"Cloud environments had drifted apart and shipping depended on the people who remembered the steps. I moved provisioning into Terraform and the deploy into a pipeline anyone on the team can run.",
	organisation: "Craftsmen Ltd.",
	domain: "Cloud infrastructure / delivery",
	role: "Engineer responsible for infrastructure provisioning and the deployment pipeline",
	team: "Product engineering team at Craftsmen; the pipeline is used by every engineer shipping to the product",
	period: "2024 — present",
	scope:
		"I owned the Terraform configuration for the environments and the GitHub Actions and Serverless Framework pipelines that deploy through them. Application code and its tests belonged to the engineers writing features; I owned the path that code travels once it is merged.",
	stack: [
		"Terraform",
		"GitHub Actions",
		"Serverless Framework",
		"AWS Lambda",
		"AWS ECS",
		"Amazon SQS",
		"Docker",
		"Microservices",
		"Monorepo",
	],
	evidence: "qualitative",
	context:
		"Environments had drifted apart, which meant staging and production were similar rather than identical and nobody could say precisely how they differed. That turns every deployment into a partial unknown: a change verified in staging carries no guarantee in production, and a production problem cannot be reproduced anywhere safe. Releases had the same shape of problem — enough manual steps that shipping depended on the people who remembered their order.",
	constraints: [
		"The environments were live and serving customers, so bringing them under version control could not involve taking them down",
		"Any new release process had to be usable by every engineer on the team, not only by whoever built it, or it would simply relocate the bottleneck rather than remove it",
	],
	decisions: [
		{
			question:
				"Do we describe environments in code, or keep provisioning them through the console and scripts?",
			chose:
				"Terraform as the single description of every environment, so an environment is something you can read, review and reproduce rather than something you assemble",
			rejected: [
				{
					option:
						"Keep console provisioning and write down the steps in a runbook",
					why: "It is far less work up front and needs nobody to learn a new tool. But a runbook has no way to be wrong out loud — it drifts from reality silently, cannot be diffed or code-reviewed, and gives you no way to tell whether two environments actually match beyond reading both by hand",
				},
			],
			tradeoff:
				"Every change now has to go through Terraform to be real. A quick fix made directly in the console is drift the tool will fight on the next apply, so the team gives up some short-term speed for the guarantee.",
		},
		{
			question: "How much of the release should the pipeline own?",
			chose:
				"Build, test and deploy automated end to end through GitHub Actions and the Serverless Framework, so releasing is something any engineer can do rather than an errand",
			rejected: [
				{
					option: "Keep deploys manual, working from a documented checklist",
					why: "A checklist is cheap and flexible, and it needs no pipeline maintenance. But a checklist executed by hand is executed slightly differently each time, and it keeps the ability to ship concentrated in whoever is most practised at it — which is exactly the dependency worth removing",
				},
			],
			tradeoff:
				"The pipeline becomes critical infrastructure. When it breaks, nobody ships, so it needs the same care, review and debugging attention as the product code that travels through it.",
		},
	],
	results: [],
	reflection:
		"The ordering is what I would be deliberate about. Automating a release path onto environments that still differ from one another gets you a pipeline that succeeds while the outcome still varies, and that erodes trust in the pipeline itself rather than building it. Reproducible provisioning is the less visible half of this work and the half that makes the other half mean anything.",
	links: [],
});
