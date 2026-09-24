import { Section } from "@/components/section";
import { processSteps } from "@/data/process";
import { Reveal } from "@/motion/Reveal";

export function Process() {
	return (
		<Section
			id="process"
			number="03"
			eyebrow="How I work"
			title="Three things that shape the work"
		>
			<div className="grid gap-x-10 gap-y-10 md:grid-cols-3">
				{processSteps.map((step, index) => (
					<Reveal key={step.title} delay={index * 0.08}>
						<span className="font-mono text-[11px] tracking-[0.18em] text-faint">
							{String(index + 1).padStart(2, "0")}
						</span>
						<h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-ink md:text-2xl">
							{step.title}
						</h3>
						<p className="mt-3 leading-relaxed text-muted">{step.body}</p>
					</Reveal>
				))}
			</div>
		</Section>
	);
}
