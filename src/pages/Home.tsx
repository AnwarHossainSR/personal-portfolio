import { Link } from "react-router-dom";
import { EvidenceBadge } from "@/components/case-study/EvidenceBadge";
import { SEOHead } from "@/components/SEO";
import { featuredCaseStudies } from "@/content/case-studies";
import { profile } from "@/data/profile";

export default function Home() {
	return (
		<>
			<SEOHead description={profile.positioning} path="/" />
			<div className="mx-auto max-w-5xl px-5 sm:px-8">
				<section className="py-20 sm:py-28">
					{/* The name is in the nav and the footer. The h1 is the only line a
					    scanning reader is guaranteed to read, so it states the problem
					    shape rather than the job title. */}
					<h1 className="max-w-[20ch] text-[32px] font-semibold leading-[1.15] tracking-tight sm:text-[46px]">
						{profile.positioning}
					</h1>

					<div className="mt-8 max-w-[64ch] space-y-5 text-[17px] leading-[1.75] text-muted-foreground">
						{profile.pitch.map((paragraph) => (
							<p key={paragraph}>{paragraph}</p>
						))}
					</div>

					<div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
						<Link
							to="/contact"
							className="rounded-md bg-foreground px-4 py-2.5 font-medium text-background transition-opacity hover:opacity-90"
						>
							Get in touch
						</Link>
						<a
							href={profile.resumePath}
							target="_blank"
							rel="noreferrer"
							className="text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
						>
							Résumé (PDF)
						</a>
						{profile.links.map((link) => (
							<a
								key={link.href}
								href={link.href}
								target="_blank"
								rel="noreferrer"
								className="text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
							>
								{link.label}
							</a>
						))}
					</div>
				</section>

				<section className="border-t border-border/70 py-16">
					<h2 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
						Selected work
					</h2>

					<ol className="mt-10 space-y-14">
						{featuredCaseStudies.map((study) => (
							<li key={study.slug}>
								<div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
									<span>{study.organisation}</span>
									<span aria-hidden="true">·</span>
									<span>{study.period}</span>
									<EvidenceBadge level={study.evidence} />
								</div>
								<h3 className="mt-3 max-w-[26ch] text-xl font-semibold leading-snug tracking-tight sm:text-2xl">
									<Link
										to={`/work/${study.slug}`}
										className="transition-colors hover:text-accent"
									>
										{study.title}
									</Link>
								</h3>
								<p className="mt-3 max-w-[64ch] text-[17px] leading-[1.7] text-muted-foreground">
									{study.summary}
								</p>
							</li>
						))}
					</ol>

					<p className="mt-12">
						<Link
							to="/work"
							className="text-sm text-foreground underline underline-offset-4 transition-colors hover:text-accent"
						>
							All work
						</Link>
					</p>
				</section>

				<section className="border-t border-border/70 py-16">
					<h2 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
						What I'm hired for
					</h2>
					<ul className="mt-8 max-w-[62ch] space-y-4">
						{profile.capabilities.map((capability) => (
							<li
								key={capability.title}
								className="text-[17px] leading-[1.7] text-muted-foreground"
							>
								{capability.title}
							</li>
						))}
					</ul>
					<p className="mt-10 max-w-[62ch] text-[15px] leading-relaxed text-muted-foreground">
						{profile.availability} {profile.responseTime}
					</p>
				</section>
			</div>
		</>
	);
}
