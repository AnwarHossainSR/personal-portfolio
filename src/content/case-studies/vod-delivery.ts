import { parseCaseStudy } from "@/content/schema";

export const vodDelivery = parseCaseStudy({
	slug: "vod-delivery",
	title: "Building a video-on-demand pipeline on managed AWS media services",
	summary:
		"A SaaS product needed to accept uploaded video and play it back reliably across devices and connection speeds. I built the ingest, encoding and delivery path on AWS Media Services.",
	organisation: "Craftsmen Ltd.",
	domain: "Video streaming / VOD",
	role: "Engineer on the video delivery system, from upload through to playback delivery",
	team: "Product engineering team at Craftsmen; I worked the media path with backend and frontend colleagues either side of it",
	period: "2024 — present",
	scope:
		"I owned the ingest, encoding orchestration, storage lifecycle and CDN delivery configuration. The player experience and the surrounding product UI were built by colleagues; I provided the delivery contract they consumed and did not change their code.",
	stack: [
		"AWS Media Services",
		"AWS S3",
		"CloudFront",
		"Node.js",
		"Lambda",
		"Terraform",
	],
	evidence: "qualitative",
	context:
		"The product needed to take video uploaded by customers and make it play back smoothly for viewers whose devices and bandwidth varied widely. A single-rendition file served straight from storage does not survive that: viewers on poor connections stall, and viewers on good ones get quality below what their connection could carry. The work was to put a real encoding and delivery pipeline behind the upload, without turning media infrastructure into a system the team would then have to operate full time.",
	constraints: [
		"The team had no dedicated media or streaming specialists, so whatever went in had to be operable by generalist full-stack engineers on call",
		"Media processing is expensive when it is wrong — reprocessing a back catalogue because of a bad encoding decision costs real money, so the ladder and format choices had to be right early rather than iterated on in production",
	],
	decisions: [
		{
			question:
				"Do we run our own transcoding, or hand encoding to a managed service?",
			chose:
				"AWS Media Services for encoding and packaging, with the pipeline orchestrated from our own Lambda functions so the job lifecycle stayed visible to us",
			rejected: [
				{
					option: "Self-hosted FFmpeg workers on ECS or EC2",
					why: "It is cheaper per minute of video and far more configurable, but it makes the team responsible for a transcode farm — queue depth, instance sizing, failed-job recovery, codec upgrades. With no media specialists on the team, that operational surface would have been carried by whoever was on call, and encoding failures are the kind of problem that is slow to diagnose without domain knowledge",
				},
			],
			tradeoff:
				"We pay a managed-service premium per minute of encoded video and inherit its limits on codec and packaging options. If volume grows enough for that premium to matter, moving to self-hosted encoding later means rebuilding the orchestration layer around a different job model.",
		},
		{
			question: "How should encoded output reach viewers?",
			chose:
				"Adaptive bitrate output packaged into a streaming format, served through CloudFront rather than directly from S3",
			rejected: [
				{
					option:
						"Serving a single high-quality rendition directly from the storage bucket",
					why: "It is simpler and needs no packaging step, but it pushes the entire cost of a bad connection onto the viewer — buffering rather than a quality drop — and it bills egress at origin rates for every view instead of serving repeat views from an edge cache",
				},
			],
			tradeoff:
				"Adaptive delivery means every asset is stored several times over at different renditions, so storage cost rises with the size of the ladder, and a cache sitting in front of the origin means content updates are not instant unless invalidation is handled deliberately.",
		},
	],
	results: [],
	reflection:
		"I would define the storage lifecycle policy in the same change that introduces the encoding ladder, rather than treating it as a follow-up. Every rendition of every asset accumulates from the first upload onward, and a retention rule written after a back catalogue already exists is a migration rather than a configuration line. The cost of that omission is invisible in week one and awkward by month six.",
	links: [],
});
