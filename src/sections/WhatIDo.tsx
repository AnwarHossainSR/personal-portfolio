import { Eyebrow, Section } from "@/components/section";
import { profile } from "@/data/profile";

export function WhatIDo() {
	return (
		<Section
			id="what-i-do"
			number="01"
			eyebrow="Capabilities"
			title="What I can do for your team"
		>
			<div className="grid gap-x-10 gap-y-10 md:grid-cols-2">
				{profile.capabilities.map((capability, index) => (
					<div key={capability.title}>
						<span className="font-mono text-[11px] tracking-[0.18em] text-faint">
							{String(index + 1).padStart(2, "0")}
						</span>
						<h3 className="mt-3 font-display text-2xl font-medium leading-[1.12] tracking-tight text-ink md:text-3xl">
							{capability.title}
						</h3>
						<p className="mt-3 max-w-[46ch] leading-relaxed text-muted">
							{capability.body}
						</p>
					</div>
				))}
			</div>

			<div className="mt-16 border-t border-line pt-8">
				<Eyebrow>The work</Eyebrow>
				<p className="mt-3 max-w-[34ch] font-display text-xl font-semibold tracking-tight text-ink md:text-2xl">
					{profile.creed}
				</p>
			</div>
		</Section>
	);
}
