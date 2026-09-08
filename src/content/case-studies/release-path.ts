import { parseCaseStudy } from "@/content/schema";

export const releasePath = parseCaseStudy({
	slug: "release-path",
	title: "Making environments reproducible and releases boring",
	summary:
		"Cloud environments had drifted apart and releases were a manual ritual. I moved provisioning into Terraform and put the deploy behind a pipeline the whole team could run.",
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
		"Docker",
	],
	evidence: "qualitative",
	context:
		"Environments had been created by hand as the product grew, which meant staging and production were similar rather than identical, and nobody could say precisely how they differed. That turns every deployment into a partial unknown — a change verified in staging carries no guarantee in production, and a production incident cannot be reproduced anywhere safe. Releases had accumulated manual steps in the same way, so shipping depended on the people who remembered the order.",
	constraints: [
		"The environments were live and serving customers, so they had to be brought under Terraform without being torn down and rebuilt",
		"Any new release process had to be usable by every engineer on the team, not only by whoever wrote it, or it would simply become a different bottleneck",
	],
	decisions: [
		{
			question:
				"How do we bring live, hand-built environments under infrastructure as code without an outage?",
			chose:
				"Import the existing resources into Terraform state and reconcile the configuration against what was already running, so the first apply was a no-op",
			rejected: [
				{
					option:
						"Define the environments fresh in Terraform and cut over to newly created infrastructure",
					why: "It produces a much cleaner configuration, unburdened by whatever odd choices had accumulated. But it means standing up a parallel environment and migrating live traffic and data onto it, which is a substantially riskier project than the drift problem it was solving — a large risk taken to fix a moderate one",
				},
			],
			tradeoff:
				"The Terraform now describes the environments as they actually are, including the accumulated oddities, so the configuration is less tidy than a greenfield one and some of the historical decisions in it are inherited rather than chosen.",
		},
		{
			question: "What should the pipeline do when a deploy goes wrong?",
			chose:
				"Make every release rollback-ready, so the recovery action is redeploying the previous known-good version rather than diagnosing under pressure",
			rejected: [
				{
					option:
						"Rely on forward fixes — diagnose the failure and ship a patch",
					why: "It avoids the work of keeping previous versions deployable and is fine when the failure is understood quickly. But it makes time-to-recovery depend on time-to-diagnosis, which is exactly the thing that is unpredictable during an incident, and it pressures whoever is on call into writing a fix while the product is degraded",
				},
			],
			tradeoff:
				"Rollback-ready releases constrain what a deployment may do — database migrations in particular have to be written so the previous version still runs against the new schema, which is more work per migration than a one-way change.",
		},
	],
	results: [],
	reflection:
		"I automated the deployment before I automated environment creation, because the deployment was the thing people complained about. That was the wrong order. Automating a release path onto environments that still differ from each other means the pipeline succeeds and the outcome still varies, which erodes trust in the pipeline itself. The provisioning should have been reproducible first, even though it was the less visible problem.",
	links: [],
});
