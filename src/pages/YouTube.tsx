import { Play, Youtube } from "lucide-react";
import { useState } from "react";
import { SEOHead } from "@/components/SEO";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { type YouTubeVideo, youtubePlaylists } from "@/data/youtube";

export default function YouTubePlaylist() {
	const [open, setOpen] = useState(false);
	const [activeVideo, setActiveVideo] = useState<YouTubeVideo | null>(null);

	const openVideo = (video: YouTubeVideo) => {
		setActiveVideo(video);
		setOpen(true);
	};

	const getEmbedUrl = (video: YouTubeVideo) => {
		if (video.type === "playlist") {
			return `https://www.youtube.com/embed/videoseries?list=${video.id}`;
		}
		return `https://www.youtube.com/embed/${video.id}`;
	};

	const getThumbnailUrl = (video: YouTubeVideo) => {
		if (video.type === "playlist") {
			// YouTube doesn't have a direct "playlist thumbnail" API that is reliable without an API key,
			// so we use a generic placeholder or the first video's thumbnail if we knew it.
			// For now, using a nice gradient/placeholder or a common pattern.
			return `https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=600&h=400`;
		}
		return `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
	};

	return (
		<>
			<SEOHead
				title="YouTube Playlist"
				description="Curated YouTube videos on system design, AWS architecture, React, and full‑stack engineering."
				keywords="YouTube playlist, system design videos, AWS, React, TypeScript, software engineering"
				url="https://anwarportfolio.vercel.app/youtube"
				type="website"
			/>

			<header className="relative py-16 md:py-24">
				<div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10" />
				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="premium-card p-6 sm:p-8 md:p-12">
						<div className="inline-flex items-center gap-2 mb-4">
							<span className="h-px w-6 bg-gradient-to-r from-transparent to-primary/60" />
							<span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/90">
								Learn with me
							</span>
						</div>
						<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">
							YouTube <span className="gradient-text">Playlist</span>
						</h1>
						<p className="text-base sm:text-lg text-muted-foreground/90 max-w-3xl">
							A handpicked collection of videos and playlists covering modern
							React development, scalable architecture, and developer
							productivity.
						</p>
						<div className="mt-6">
							<Button size="sm" variant="secondary" asChild>
								<a
									href="https://www.youtube.com/@DevelopmentKit"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Visit my YouTube channel"
								>
									<Youtube className="mr-2 h-4 w-4 text-red-600" /> Visit
									Channel
								</a>
							</Button>
						</div>
					</div>
				</div>
			</header>

			<main className="relative py-12 md:py-20">
				<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
						{youtubePlaylists.map((video) => (
							<article
								key={video.id}
								className="group premium-card overflow-hidden"
							>
								<button
									onClick={() => openVideo(video)}
									className="w-full text-left"
									aria-label={`Play ${video.type}: ${video.title}`}
								>
									<AspectRatio ratio={16 / 9} className="overflow-hidden">
										<img
											src={getThumbnailUrl(video)}
											alt={`${video.title} thumbnail`}
											loading="lazy"
											className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
										/>
										<div className="absolute inset-0 bg-black/40 opacity-40 group-hover:opacity-60 transition-opacity" />
										<div className="absolute inset-0 flex items-center justify-center">
											<div className="flex flex-col items-center gap-2">
												<span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/90 text-primary-foreground shadow-lg group-hover:scale-110 transition-transform">
													<Play className="h-6 w-6 fill-current" />
												</span>
												{video.type === "playlist" && (
													<span className="text-[10px] uppercase tracking-widest text-white bg-black/50 px-2 py-0.5 rounded">
														Playlist
													</span>
												)}
											</div>
										</div>
									</AspectRatio>
								</button>
								<Card className="mt-3 sm:mt-4 bg-transparent border-none shadow-none p-4">
									<CardHeader className="p-0">
										<CardTitle className="text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
											{video.title}
										</CardTitle>
									</CardHeader>
								</Card>
							</article>
						))}
					</div>
				</section>

				<Dialog open={open} onOpenChange={setOpen}>
					<DialogContent className="max-w-4xl p-0 overflow-hidden border-none bg-transparent">
						<div className="relative pt-[56.25%] bg-black">
							{activeVideo && (
								<iframe
									src={getEmbedUrl(activeVideo)}
									title={activeVideo.title}
									loading="lazy"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
									allowFullScreen
									className="absolute inset-0 w-full h-full border-none"
								/>
							)}
						</div>
						<div className="p-4 bg-card border-t border-card-border/50">
							<h2 className="text-xl font-bold">{activeVideo?.title}</h2>
							<p className="text-sm text-muted-foreground mt-1">
								{activeVideo?.type === "playlist"
									? "YouTube Playlist"
									: "YouTube Video"}
							</p>
						</div>
					</DialogContent>
				</Dialog>
			</main>
		</>
	);
}
