import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { DecisionBlock } from "@/components/case-study/DecisionBlock";
import { EvidenceBadge } from "@/components/case-study/EvidenceBadge";
import { ResultsTable } from "@/components/case-study/ResultsTable";
import { Prose } from "@/components/Prose";
import { SEOHead } from "@/components/SEO";
import { getCaseStudy } from "@/content/case-studies";
import NotFound from "@/pages/NotFound";

function Section({ title, children }: { title: string; children: ReactNode }) {
	return (
		<section className="mt-14 border-t border-border/70 pt-8">
			<h2 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
				{title}
			</h2>
			<div className="mt-5">{children}</div>
		</section>
	);
}

export default function CaseStudy() {
	const { slug } = useParams();
	const study = slug ? getCaseStudy(slug) : undefined;

	if (!study) {
		return <NotFound />;
	}

	return (
		<>
			<SEOHead
				title={study.title}
				description={study.summary}
				path={`/work/${study.slug}`}
				type="article"
			/>
			<article className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
				<Link
					to="/work"
					className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
				>
					<ArrowLeft className="h-4 w-4" aria-hidden="true" />
					All work
				</Link>

				<header className="mt-8">
					<div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
						<span>{study.organisation}</span>
						<span aria-hidden="true">·</span>
						<span>{study.period}</span>
						<span aria-hidden="true">·</span>
						<span>{study.domain}</span>
						<EvidenceBadge level={study.evidence} />
					</div>

					<h1 className="mt-5 max-w-[22ch] text-3xl font-semibold leading-[1.15] tracking-tight sm:text-[40px]">
						{study.title}
					</h1>

					<p className="mt-6 max-w-[64ch] text-[19px] leading-[1.65] text-muted-foreground">
						{study.summary}
					</p>

					<dl className="mt-10 grid gap-6 border-t border-border/70 pt-6 sm:grid-cols-3">
						<div>
							<dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
								Role
							</dt>
							<dd className="mt-2 text-[15px] text-foreground">{study.role}</dd>
						</div>
						<div>
							<dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
								Team
							</dt>
							<dd className="mt-2 text-[15px] text-foreground">{study.team}</dd>
						</div>
						<div>
							<dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
								Stack
							</dt>
							<dd className="mt-2 text-[15px] text-foreground">
								{study.stack.join(" · ")}
							</dd>
						</div>
					</dl>
				</header>

				{/* Scope sits above the narrative on purpose: a reader should know what
				    was mine before they read what happened. */}
				<Section title="What I owned">
					<Prose>
						<p>{study.scope}</p>
					</Prose>
				</Section>

				<Section title="The situation">
					<Prose>
						<p>{study.context}</p>
					</Prose>
				</Section>

				<Section title="Constraints">
					<ul className="max-w-[68ch] space-y-3">
						{study.constraints.map((constraint) => (
							<li
								key={constraint}
								className="border-l-2 border-border pl-4 text-[17px] leading-[1.7] text-muted-foreground"
							>
								{constraint}
							</li>
						))}
					</ul>
				</Section>

				<Section title="Decisions">
					<div className="space-y-12">
						{study.decisions.map((decision, index) => (
							<DecisionBlock
								key={decision.question}
								decision={decision}
								index={index}
							/>
						))}
					</div>
				</Section>

				{study.results.length > 0 && (
					<Section title="Results">
						<ResultsTable results={study.results} />
					</Section>
				)}

				<Section title="What I'd do differently">
					<Prose>
						<p>{study.reflection}</p>
					</Prose>
				</Section>

				{study.links.length > 0 && (
					<Section title="Links">
						<ul className="space-y-2">
							{study.links.map((link) => (
								<li key={link.href}>
									<a
										href={link.href}
										target="_blank"
										rel="noreferrer"
										className="text-[15px] text-foreground underline underline-offset-4 hover:text-accent"
									>
										{link.label}
									</a>
								</li>
							))}
						</ul>
					</Section>
				)}
			</article>
		</>
	);
}
