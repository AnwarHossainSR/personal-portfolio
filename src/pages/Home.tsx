import {
	ArrowRight,
	CheckCircle2,
	Download,
	ExternalLink,
	Github,
	Linkedin,
	Mail,
	Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/profile";

const githubLink = profile.links.find((link) => link.label === "GitHub");
const linkedinLink = profile.links.find((link) => link.label === "LinkedIn");

export default function Home() {
	return (
		<>
			<SEOHead
				title="Senior Software Engineer"
				description="Md. Anwar Hossain is a Senior Software Engineer specializing in AI automation, agentic AI workflows, AWS cloud architecture, full-stack development, and DevOps."
				keywords="Md. Anwar Hossain, AI Automation Engineer, Agentic AI, Senior Software Engineer, AWS Architect, Full Stack Developer, React, Node.js, DevOps"
				url="https://anwarportfolio.vercel.app"
			/>
			<div className="min-h-screen">
				<section className="relative overflow-hidden bg-gradient-hero py-20 sm:py-24 lg:py-28">
					<div className="section-shell">
						<div className="grid items-center gap-12 lg:grid-cols-[1.12fr_0.88fr]">
							<div className="slide-in-up">
								<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent">
									<span className="h-2 w-2 rounded-full bg-accent" />
									{profile.availability}
								</div>

								<h1 className="max-w-4xl text-4xl font-black tracking-tight text-balance text-foreground sm:text-6xl lg:text-7xl">
									{profile.name}
									<span className="block gradient-text">
										{profile.positioning}
									</span>
								</h1>

								<p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
									{profile.pitch[0]}
								</p>

								<div className="mt-8 flex flex-col gap-3 sm:flex-row">
									<Button
										size="lg"
										className="bg-gradient-primary font-bold text-primary-foreground shadow-glow"
										asChild
									>
										<Link to="/work">
											View case studies
											<ArrowRight className="ml-2 h-4 w-4" />
										</Link>
									</Button>
									<Button
										size="lg"
										variant="outline"
										className="border-card-border bg-card/80"
										asChild
									>
										<a
											href={profile.resumePath}
											target="_blank"
											rel="noopener noreferrer"
										>
											<Download className="mr-2 h-4 w-4" />
											Resume
										</a>
									</Button>
									{linkedinLink && (
										<Button
											size="lg"
											variant="ghost"
											className="text-muted-foreground hover:text-foreground"
											asChild
										>
											<a
												href={linkedinLink.href}
												target="_blank"
												rel="noopener noreferrer"
											>
												<Linkedin className="mr-2 h-4 w-4" />
												LinkedIn
											</a>
										</Button>
									)}
								</div>
							</div>

							<div className="relative">
								<div className="premium-card overflow-hidden p-4">
									<div className="aspect-[4/5] overflow-hidden rounded-md bg-secondary">
										<img
											src="/images/profile.png"
											alt={profile.name}
											className="h-full w-full object-cover"
										/>
									</div>
									<div className="relative mt-4 space-y-4">
										<div>
											<p className="text-sm font-semibold text-primary">
												{profile.positioning}
											</p>
										</div>
										<div className="grid gap-2 text-sm text-muted-foreground">
											{profile.headline.map((item) => (
												<div key={item} className="flex items-start gap-2">
													<CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
													<span>{item}</span>
												</div>
											))}
										</div>
										<div className="flex gap-2">
											{githubLink && (
												<Button
													variant="outline"
													size="sm"
													className="flex-1 border-card-border"
													asChild
												>
													<a
														href={githubLink.href}
														target="_blank"
														rel="noopener noreferrer"
													>
														<Github className="mr-2 h-4 w-4" />
														GitHub
													</a>
												</Button>
											)}
											<Button
												variant="outline"
												size="sm"
												className="flex-1 border-card-border"
												asChild
											>
												<Link to="/contact">
													<Mail className="mr-2 h-4 w-4" />
													Contact
												</Link>
											</Button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="py-16 sm:py-20">
					<div className="section-shell">
						<div className="premium-card overflow-hidden p-8 text-center sm:p-12">
							<Sparkles className="mx-auto h-8 w-8 text-primary" />
							<h2 className="mt-5 text-3xl font-black sm:text-5xl">
								Let's talk about what you're building
							</h2>
							<p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
								{profile.pitch[1]}
							</p>
							<div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
								<Button
									className="bg-gradient-primary font-bold text-primary-foreground"
									asChild
								>
									<Link to="/contact">
										Start a conversation
										<ArrowRight className="ml-2 h-4 w-4" />
									</Link>
								</Button>
								<Button
									variant="outline"
									className="border-card-border"
									asChild
								>
									<a
										href={profile.resumePath}
										target="_blank"
										rel="noopener noreferrer"
									>
										Open resume
										<ExternalLink className="ml-2 h-4 w-4" />
									</a>
								</Button>
							</div>
						</div>
					</div>
				</section>
			</div>
		</>
	);
}
