import { CheckCircle2, Download, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/profile";

export default function About() {
	return (
		<>
			<SEOHead
				title="About Me"
				description="Learn about Md. Anwar Hossain, a Senior Software Engineer specializing in AWS, full-stack engineering, system design, and DevOps."
				path="/about"
			/>
			<div className="min-h-screen py-16 sm:py-20">
				<div className="section-shell">
					<section className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
						<div className="premium-card overflow-hidden p-4">
							<div className="aspect-square overflow-hidden rounded-md bg-secondary">
								<img
									src="/images/profile.png"
									alt={profile.name}
									className="h-full w-full object-cover"
								/>
							</div>
						</div>

						<div className="slide-in-up">
							<p className="eyebrow">About</p>
							<h1 className="mt-3 text-4xl font-black sm:text-6xl">
								{profile.positioning}
							</h1>
							<div className="mt-6 space-y-4 text-lg leading-8 text-muted-foreground">
								{profile.pitch.map((paragraph) => (
									<p key={paragraph}>{paragraph}</p>
								))}
							</div>
							<div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold text-muted-foreground">
								<span className="inline-flex items-center gap-2 rounded-full border border-card-border bg-card px-4 py-2">
									<MapPin className="h-4 w-4 text-primary" />
									{profile.location}
								</span>
								<span className="rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-accent">
									{profile.availability}
								</span>
							</div>
							<div className="mt-8 flex flex-col gap-3 sm:flex-row">
								<Button
									className="bg-gradient-primary font-bold text-primary-foreground"
									asChild
								>
									<a
										href={profile.resumePath}
										target="_blank"
										rel="noopener noreferrer"
									>
										<Download className="mr-2 h-4 w-4" />
										Open resume
									</a>
								</Button>
								<Button
									variant="outline"
									className="border-card-border"
									asChild
								>
									<Link to="/contact">Contact me</Link>
								</Button>
							</div>
						</div>
					</section>

					<section className="mt-16">
						<div className="mx-auto max-w-3xl text-center">
							<p className="eyebrow">What I bring</p>
							<h2 className="mt-3 text-3xl font-black sm:text-5xl">
								Practical senior engineering across the stack
							</h2>
						</div>
						<div className="mt-10 grid gap-3">
							{profile.headline.map((item) => (
								<div
									key={item}
									className="flex items-start gap-3 rounded-md border border-card-border bg-background/50 p-3"
								>
									<CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
									<span className="text-sm text-muted-foreground">{item}</span>
								</div>
							))}
						</div>
					</section>
				</div>
			</div>
		</>
	);
}
