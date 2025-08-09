import { useState } from "react";
import { SEOHead } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, Youtube } from "lucide-react";

interface VideoItem {
  id: string;
  title: string;
  description?: string;
  publishedAt?: string;
}

const videos: VideoItem[] = [
  { id: "f02mOEt11OQ", title: "System Design Basics: Load Balancing" },
  { id: "lX9hsdsAeTk", title: "Mastering AWS Architecture Patterns" },
  { id: "8ZtInClXe1Q", title: "React 19: New Features Overview" },
  { id: "sBws8MSXN7A", title: "TypeScript for React Developers" },
  { id: "vtPkZShrvXQ", title: "Node.js Performance Tuning" },
  { id: "Ke90Tje7VS0", title: "Deep Dive: React Reconciliation" },
];

export default function YouTubePlaylist() {
  const [open, setOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  const openVideo = (video: VideoItem) => {
    setActiveVideo(video);
    setOpen(true);
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

      {/* Additional Structured Data for Video List */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: videos.map((v, i) => ({
            "@type": "VideoObject",
            position: i + 1,
            name: v.title,
            thumbnailUrl: `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`,
            uploadDate: v.publishedAt || "2024-01-01",
            embedUrl: `https://www.youtube.com/embed/${v.id}`,
            contentUrl: `https://www.youtube.com/watch?v=${v.id}`,
          })),
        })}
      </script>

      <header className="relative py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="premium-card p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">YouTube Playlist</h1>
            <p className="text-muted-foreground/90 text-lg max-w-3xl">
              A handpicked collection of videos covering scalable cloud architecture, modern React, performance, and developer productivity.
            </p>
            <div className="mt-6">
              <Button size="sm" variant="secondary" asChild>
                <a
                  href="https://www.youtube.com/@anwar" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Visit my YouTube channel"
                >
                  <Youtube className="mr-2 h-4 w-4" /> Visit Channel
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative py-12 md:py-20">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <article key={video.id} className="group premium-card overflow-hidden">
                <button
                  onClick={() => openVideo(video)}
                  className="w-full text-left"
                  aria-label={`Play video ${video.title}`}
                >
                  <AspectRatio ratio={16 / 9}>
                    <img
                      src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                      alt={`${video.title} thumbnail`}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="inline-flex items-center gap-2 rounded-full bg-primary/90 text-primary-foreground px-4 py-2 shadow-md group-hover:scale-105 transition-transform">
                        <Play className="h-4 w-4" />
                        Play
                      </span>
                    </div>
                  </AspectRatio>
                </button>
                <Card className="mt-4 bg-transparent border-none shadow-none p-0">
                  <CardHeader className="p-0">
                    <CardTitle className="text-xl leading-snug">{video.title}</CardTitle>
                  </CardHeader>
                </Card>
              </article>
            ))}
          </div>
        </section>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{activeVideo?.title}</DialogTitle>
            </DialogHeader>
            <div className="rounded-lg overflow-hidden">
              {activeVideo && (
                <AspectRatio ratio={16 / 9}>
                  <iframe
                    src={`https://www.youtube.com/embed/${activeVideo.id}`}
                    title={activeVideo.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </AspectRatio>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}
