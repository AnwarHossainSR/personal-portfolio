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
		"Amazon SQS",
		"Event-driven",
	],
	evidence: "qualitative",
	context:
		"The product needed to take video uploaded by customers and make it play back smoothly for viewers whose devices and bandwidth varied widely. A single-rendition file served straight from storage does not survive that: viewers on poor connections stall, and viewers on good ones get quality below what their connection could carry. The work was to put a real encoding and delivery pipeline behind the upload.",
	constraints: [
		"Media processing is expensive to get wrong — reprocessing a back catalogue because of a bad encoding decision costs real money, so the ladder and format choices had to be settled early rather than iterated on in production",
		"The pipeline had to sit behind an upload path the product already exposed, so its interface was fixed before the implementation was chosen",
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
					why: "Cheaper per minute of video and far more configurable, but it makes the product team responsible for a transcode farm — queue depth, instance sizing, failed-job recovery, codec upgrades. That is a second system to operate alongside the product, and its failures are slow to diagnose without media domain knowledge",
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
					why: "Simpler, and it needs no packaging step. But it pushes the entire cost of a bad connection onto the viewer — buffering rather than a quality drop — and it bills egress at origin rates for every view instead of serving repeat views from an edge cache",
				},
			],
			tradeoff:
				"Adaptive delivery means every asset is stored several times over at different renditions, so storage cost rises with the size of the ladder, and a cache in front of the origin means content updates are not instant unless invalidation is handled deliberately.",
		},
	],
	results: [],
	reflection:
		"The part of this I would treat as first-class from the start, rather than as configuration to settle later, is the storage lifecycle. Every rendition of every asset accumulates from the first upload onward, so a retention rule written once a back catalogue already exists is a migration rather than a setting. It is invisible in week one and awkward by month six.",
	links: [],
});
