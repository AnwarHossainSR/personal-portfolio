import { Link } from "react-router-dom";
import { EvidenceBadge } from "@/components/case-study/EvidenceBadge";
import { SEOHead } from "@/components/SEO";
import { caseStudies } from "@/content/case-studies";

export default function Work() {
	return (
		<>
			<SEOHead
				title="Selected work"
				description="Three engineering case studies: the constraints, the decisions and the alternatives rejected, with the method behind every number."
				path="/work"
			/>
			<div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
				<header className="max-w-[58ch]">
					<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
						Selected work
					</h1>
					<p className="mt-5 text-[17px] leading-[1.75] text-muted-foreground">
						Three systems, written up in full: what the situation was, what
						boxed the solution in, what I chose and what I turned down, and how
						the results were measured. Fewer entries than a project grid, on
						purpose — these are the ones I can talk through for an hour.
					</p>
				</header>

				<ol className="mt-16 space-y-16">
					{caseStudies.map((study) => (
						<li key={study.slug} className="border-t border-border/70 pt-8">
							<div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
								<span>{study.organisation}</span>
								<span aria-hidden="true">·</span>
								<span>{study.period}</span>
								<span aria-hidden="true">·</span>
								<span>{study.domain}</span>
								<EvidenceBadge level={study.evidence} />
							</div>

							<h2 className="mt-4 max-w-[24ch] text-2xl font-semibold leading-tight tracking-tight sm:text-[28px]">
								<Link
									to={`/work/${study.slug}`}
									className="transition-colors hover:text-accent focus-visible:text-accent"
								>
									{study.title}
								</Link>
							</h2>

							<p className="mt-4 max-w-[64ch] text-[17px] leading-[1.75] text-muted-foreground">
								{study.summary}
							</p>

							<p className="mt-4 max-w-[64ch] text-[15px] leading-relaxed text-muted-foreground/85">
								<span className="text-foreground">Scope. </span>
								{study.scope}
							</p>

							<p className="mt-5 text-sm text-muted-foreground">
								{study.stack.join(" · ")}
							</p>

							<p className="mt-6">
								<Link
									to={`/work/${study.slug}`}
									className="text-sm text-foreground underline underline-offset-4 transition-colors hover:text-accent"
								>
									Read the case study
								</Link>
							</p>
						</li>
					))}
				</ol>
			</div>
		</>
	);
}
