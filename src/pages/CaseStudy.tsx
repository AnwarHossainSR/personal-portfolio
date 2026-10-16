import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { DecisionBlock } from "@/components/case-study/DecisionBlock";
import { EvidenceBadge } from "@/components/case-study/EvidenceBadge";
import { ResultsTable } from "@/components/case-study/ResultsTable";
import { Prose } from "@/components/Prose";
import { SEOHead } from "@/components/SEO";
import { caseStudies, getCaseStudy } from "@/content/case-studies";
import NotFound from "@/pages/NotFound";

interface Part {
	id: string;
	title: string;
	content: ReactNode;
}

function Part({ part, index }: { part: Part; index: number }) {
	return (
		<section
			id={part.id}
			aria-labelledby={`${part.id}-heading`}
			className="scroll-mt-24 border-t border-line/70 pt-10"
		>
			<p
				aria-hidden="true"
				className="font-mono text-[11px] tracking-[0.18em] text-accent"
			>
				{String(index + 1).padStart(2, "0")}
			</p>
			<h2
				id={`${part.id}-heading`}
				className="mt-2 font-display text-2xl font-semibold tracking-[-0.025em] text-ink md:text-3xl"
			>
				{part.title}
			</h2>
			<div className="mt-6">{part.content}</div>
		</section>
	);
}

export default function CaseStudy() {
	const { slug } = useParams();
	const study = slug ? getCaseStudy(slug) : undefined;

	if (!study) {
		return <NotFound />;
	}

	const position = caseStudies.indexOf(study);
	const next = caseStudies[(position + 1) % caseStudies.length];

	// Scope sits above the narrative on purpose: a reader should know what was
	// mine before they read what happened.
	const parts: Part[] = [
		{
			id: "owned",
			title: "What I owned",
			content: (
				<Prose>
					<p>{study.scope}</p>
				</Prose>
			),
		},
		{
			id: "situation",
			title: "The situation",
			content: (
				<Prose>
					<p>{study.context}</p>
				</Prose>
			),
		},
		{
			id: "constraints",
			title: "Constraints",
			content: (
				<ol className="max-w-[68ch] space-y-3">
					{study.constraints.map((constraint, index) => (
						<li
							key={constraint}
							className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-2 rounded-xl border border-line/70 bg-surface/50 p-4 text-[16px] leading-[1.7] text-muted"
						>
							<span
								aria-hidden="true"
								className="pt-0.5 font-mono text-[11px] text-faint"
							>
								C{index + 1}
							</span>
							<span>{constraint}</span>
						</li>
					))}
				</ol>
			),
		},
		{
			id: "decisions",
			title: "Decisions",
			content: (
				<div className="space-y-5">
					{study.decisions.map((decision, index) => (
						<DecisionBlock
							key={decision.question}
							decision={decision}
							index={index}
						/>
					))}
				</div>
			),
		},
		...(study.results.length > 0
			? [
					{
						id: "results",
						title: "Results",
						content: <ResultsTable results={study.results} />,
					},
				]
			: []),
		{
			id: "differently",
			title: "What I'd do differently",
			content: (
				<Prose>
					<p>{study.reflection}</p>
				</Prose>
			),
		},
		...(study.links.length > 0
			? [
					{
						id: "links",
						title: "Links",
						content: (
							<ul className="space-y-2">
								{study.links.map((link) => (
									<li key={link.href}>
										<a
											href={link.href}
											target="_blank"
											rel="noreferrer"
											className="text-[15px] text-ink underline decoration-line underline-offset-4 hover:text-accent hover:decoration-accent"
										>
											{link.label}
										</a>
									</li>
								))}
							</ul>
						),
					},
				]
			: []),
	];

	return (
		<>
			<SEOHead
				title={study.title}
				description={study.summary}
				path={`/work/${study.slug}`}
				type="article"
			/>
			<article className="relative isolate">
				{/* Clipped by its own wrapper: overflow on the article would make
				    it a scroll container and unstick the table of contents. */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[40rem] overflow-hidden"
				>
					<div className="halo -right-40 -top-40 h-[36rem] w-[36rem]" />
				</div>
				<div className="mx-auto max-w-7xl px-5 pb-8 pt-12 sm:px-8 sm:pt-16">
					<nav
						aria-label="Breadcrumb"
						className="flex flex-wrap items-center gap-2 font-mono text-[12px] text-faint"
					>
						<Link
							to="/work"
							className="inline-flex items-center gap-1.5 rounded-full border border-line/80 bg-surface/60 px-3 py-1 text-muted transition-colors hover:text-ink"
						>
							<ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
							All work
						</Link>
						<span aria-hidden="true">/</span>
						<span>
							work/<span className="text-muted">{study.slug}</span>
						</span>
					</nav>

					<header className="mt-10">
						<div className="flex flex-wrap items-center gap-2">
							<span className="chip">{study.domain}</span>
							<EvidenceBadge level={study.evidence} />
						</div>

						<h1 className="mt-6 max-w-[22ch] font-display text-[2.4rem] font-semibold leading-[1.04] tracking-[-0.04em] text-ink sm:text-5xl md:text-6xl">
							{study.title}
						</h1>

						<p className="mt-6 max-w-[64ch] text-[19px] leading-[1.65] text-muted">
							{study.summary}
						</p>

						<dl className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
							{[
								["Organisation", study.organisation],
								["Period", study.period],
								["Role", study.role],
								["Team", study.team],
							].map(([term, value]) => (
								<div key={term} className="panel p-4">
									<dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
										{term}
									</dt>
									<dd className="mt-2 text-[15px] leading-snug text-ink">
										{value}
									</dd>
								</div>
							))}
						</dl>
						<ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Stack">
							{study.stack.map((item) => (
								<li key={item} className="chip">
									{item}
								</li>
							))}
						</ul>
					</header>

					<div className="mt-16 grid gap-12 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-16">
						<nav aria-label="On this page" className="hidden lg:block">
							<div className="sticky top-24">
								<p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
									On this page
								</p>
								<ol className="mt-4 space-y-1 border-l border-line/70">
									{parts.map((part) => (
										<li key={part.id}>
											<a
												href={`#${part.id}`}
												className="-ml-px block border-l border-transparent py-1.5 pl-4 text-sm text-muted transition-colors hover:border-accent hover:text-ink"
											>
												{part.title}
											</a>
										</li>
									))}
								</ol>
							</div>
						</nav>

						<div className="min-w-0 space-y-14">
							{parts.map((part, index) => (
								<Part key={part.id} part={part} index={index} />
							))}
						</div>
					</div>

					{next !== study && (
						<Link
							to={`/work/${next.slug}`}
							className="group mt-20 flex items-center justify-between gap-6 rounded-2xl border border-line/80 bg-surface p-6 shadow-elevation-1 transition-colors hover:border-accent/50 md:p-8"
						>
							<span>
								<span className="block font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
									Next case study
								</span>
								<span className="mt-2 block font-display text-xl font-semibold tracking-[-0.02em] text-ink transition-colors group-hover:text-accent md:text-2xl">
									{next.title}
								</span>
							</span>
							<ArrowRight
								className="h-5 w-5 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent"
								aria-hidden="true"
							/>
						</Link>
					)}
				</div>
			</article>
		</>
	);
}
