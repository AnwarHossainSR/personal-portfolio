import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { EvidenceBadge } from "@/components/case-study/EvidenceBadge";
import { Eyebrow, Section } from "@/components/section";
import { caseStudies } from "@/content/case-studies";
import { roles } from "@/data/roles";
import { cn } from "@/lib/utils";
import { Reveal } from "@/motion/Reveal";

const pad = (n: number) => String(n).padStart(2, "0");

export function Work() {
	return (
		<Section
			id="work"
			number="03"
			eyebrow="Selected work"
			title="Built and run in production"
		>
			{/*
			 * Rows on rules, not cards. These are the long-form part of the site,
			 * and an index of articles reads better as a table of contents than
			 * as a wall of tiles — Work.test.tsx holds it to that.
			 */}
			<ol className="border-t border-line/70">
				{caseStudies.map((study, index) => (
					<Reveal
						as="li"
						key={study.slug}
						delay={index * 0.08}
						className="group grid gap-6 border-b border-line/70 py-10 md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] md:gap-12 md:py-14"
					>
						<div className="flex flex-col gap-4">
							<span className="font-mono text-[11px] tracking-[0.18em] text-accent">
								{pad(index + 1)}{" "}
								<span className="text-faint">/ {pad(caseStudies.length)}</span>
							</span>
							<div className="space-y-1">
								<p className="text-sm text-ink">{study.organisation}</p>
								<p className="font-mono text-[12px] text-faint">
									{study.period}
								</p>
							</div>
							<div className="flex flex-wrap gap-2">
								<span className="chip">{study.domain}</span>
								<EvidenceBadge level={study.evidence} />
							</div>
						</div>

						<div>
							<h3 className="max-w-[28ch] font-display text-2xl font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[2rem]">
								<Link
									to={`/work/${study.slug}`}
									className="transition-colors hover:text-accent"
								>
									{study.title}
								</Link>
							</h3>

							<p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-muted">
								{study.summary}
							</p>

							<p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
								<span className="mr-1 font-mono text-[11px] uppercase tracking-[0.16em] text-ink">
									Scope.{" "}
								</span>
								{study.scope}
							</p>

							<ul className="mt-6 flex flex-wrap gap-1.5">
								{study.stack.map((item) => (
									<li key={item} className="chip">
										{item}
									</li>
								))}
							</ul>

							<p className="mt-7">
								<Link
									to={`/work/${study.slug}`}
									className="inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-accent"
								>
									Read the case study
									<ArrowRight
										className="h-4 w-4 transition-transform group-hover:translate-x-1"
										aria-hidden="true"
									/>
								</Link>
							</p>
						</div>
					</Reveal>
				))}
			</ol>

			<div className="mt-24">
				<Eyebrow>Track record</Eyebrow>

				{/*
				 * Drawn as a commit graph: one branch, newest at the top, and the
				 * role that is still going marked live rather than closed.
				 */}
				<ol className="mt-10">
					{roles.map((role, index) => {
						const current = /present/i.test(role.period);
						const last = index === roles.length - 1;
						return (
							<Reveal
								as="li"
								key={role.id}
								delay={index * 0.08}
								className="relative grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-4 sm:gap-x-6"
							>
								<div
									aria-hidden="true"
									className="relative flex justify-center"
								>
									{!last && (
										<span className="absolute bottom-0 top-3 w-px bg-line" />
									)}
									<span
										className={cn(
											"relative mt-1.5 grid h-3.5 w-3.5 place-items-center rounded-full border-2 bg-paper",
											current ? "border-signal" : "border-line",
										)}
									>
										{current && <span className="live-dot" />}
									</span>
								</div>

								<div className={cn("max-w-3xl", last ? "pb-0" : "pb-14")}>
									<div className="flex flex-wrap items-center gap-x-3 gap-y-2">
										<h3 className="text-lg font-semibold tracking-tight text-ink">
											{role.title}
										</h3>
										{current && (
											<span className="chip border-signal/30 text-signal">
												current
											</span>
										)}
									</div>
									<p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-sm">
										<span className="text-ink/90">{role.company}</span>
										<span aria-hidden="true" className="text-faint">
											·
										</span>
										<span className="font-mono text-[12px] text-faint">
											{role.period}
										</span>
									</p>

									<p className="mt-4 text-[15px] leading-relaxed text-muted">
										{role.scope}
									</p>

									<ul className="mt-4 space-y-2">
										{role.impact.map((item) => (
											<li
												key={item}
												className="relative pl-5 text-[15px] leading-relaxed text-muted"
											>
												<span
													aria-hidden="true"
													className="absolute left-0 top-0 font-mono text-accent"
												>
													→
												</span>
												{item}
											</li>
										))}
									</ul>

									<p className="mt-4 font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-faint">
										{role.stack.join(" · ")}
									</p>
								</div>
							</Reveal>
						);
					})}
				</ol>
			</div>
		</Section>
	);
}
