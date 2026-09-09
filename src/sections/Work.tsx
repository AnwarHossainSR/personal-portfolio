import { Link } from "react-router-dom";
import { EvidenceBadge } from "@/components/case-study/EvidenceBadge";
import { Eyebrow, Section } from "@/components/section";
import { caseStudies } from "@/content/case-studies";
import { roles } from "@/data/roles";
import { Reveal } from "@/motion/Reveal";

export function Work() {
	return (
		<Section
			id="work"
			number="02"
			eyebrow="Selected work"
			title="Built and run in production"
		>
			<ol className="space-y-14">
				{caseStudies.map((study, index) => (
					<Reveal
						as="li"
						key={study.slug}
						delay={index * 0.08}
						className="border-t border-line pt-6 first:border-t-0 first:pt-0"
					>
						<div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
							<span>{study.organisation}</span>
							<span aria-hidden="true">·</span>
							<span>{study.period}</span>
							<span aria-hidden="true">·</span>
							<span>{study.domain}</span>
							<EvidenceBadge level={study.evidence} />
						</div>

						<h3 className="mt-3 max-w-[26ch] font-display text-2xl font-semibold leading-[1.12] tracking-tight text-ink md:text-3xl">
							<Link
								to={`/work/${study.slug}`}
								className="transition-colors hover:text-accent"
							>
								{study.title}
							</Link>
						</h3>

						<p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
							{study.summary}
						</p>

						<p className="mt-4 max-w-2xl leading-relaxed text-muted">
							<span className="text-ink">Scope. </span>
							{study.scope}
						</p>

						<p className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
							{study.stack.join(" · ")}
						</p>

						<p className="mt-5">
							<Link
								to={`/work/${study.slug}`}
								className="text-sm text-ink underline underline-offset-4 transition-colors hover:text-accent"
							>
								Read the case study
							</Link>
						</p>
					</Reveal>
				))}
			</ol>

			<div className="mt-20 border-t border-line pt-10">
				<Eyebrow>Track record</Eyebrow>

				<ol className="mt-8 space-y-10">
					{roles.map((role, index) => (
						<Reveal
							as="li"
							key={role.id}
							delay={index * 0.08}
							className="border-t border-line/60 pt-6 first:border-t-0 first:pt-0"
						>
							<div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
								<h3 className="text-base font-semibold tracking-tight text-ink">
									{role.title}
								</h3>
								<span className="text-sm text-muted">{role.company}</span>
								<span className="text-sm text-faint">{role.period}</span>
							</div>

							<p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
								{role.scope}
							</p>

							<ul className="mt-3 max-w-2xl space-y-1.5">
								{role.impact.map((item) => (
									<li key={item} className="text-sm leading-relaxed text-muted">
										{item}
									</li>
								))}
							</ul>

							<p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
								{role.stack.join(" · ")}
							</p>
						</Reveal>
					))}
				</ol>
			</div>
		</Section>
	);
}
