import type { CSSProperties } from "react";
import { Section } from "@/components/section";
import { processSteps } from "@/data/process";
import { Reveal } from "@/motion/Reveal";

/*
 * What each step is, in the system's voice. Keyed by position because the
 * process is exactly three steps — process-stack.test.tsx holds it there.
 */
const STAGE = ["plan", "ship", "hand off"];

export function Process() {
	return (
		<Section
			id="process"
			number="03"
			eyebrow="How I work"
			title="Three things that shape the work"
		>
			<ol className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-4">
				{processSteps.map((step, index) => {
					const last = index === processSteps.length - 1;
					return (
						<Reveal
							as="li"
							key={step.title}
							delay={index * 0.1}
							className="flex flex-col"
						>
							{/*
							 * The rail: a node per step, joined by a wire that a
							 * packet keeps travelling along. Each step draws the wire
							 * to its right, so the last one draws the loop instead.
							 */}
							<div aria-hidden="true" className="flex items-center gap-3">
								<span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-accent/50 bg-accent/10 font-mono text-[12px] text-accent">
									{String(index + 1).padStart(2, "0")}
								</span>
								{last ? (
									<span className="hidden font-mono text-[11px] text-faint md:inline">
										↻ and again
									</span>
								) : (
									<span
										className="packet-track hidden h-px flex-1 bg-line md:block"
										style={{ "--at": `${index * 1.4}s` } as CSSProperties}
									/>
								)}
							</div>

							<div className="panel mt-5 flex-1 p-6 md:p-7">
								<p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
									{STAGE[index]}
								</p>
								<h3 className="mt-3 font-display text-xl font-semibold tracking-[-0.02em] text-ink md:text-2xl">
									{step.title}
								</h3>
								<p className="mt-3 text-[15px] leading-relaxed text-muted">
									{step.body}
								</p>
							</div>
						</Reveal>
					);
				})}
			</ol>
		</Section>
	);
}
