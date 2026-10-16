import { Section } from "@/components/section";
import { Reveal } from "@/motion/Reveal";
import { useSpotlight } from "@/motion/useSpotlight";
import { BroadcastFrame } from "@/sections/showcase/BroadcastFrame";
import { ToolkitChart } from "@/sections/showcase/ToolkitChart";
import { WorkMap } from "@/sections/showcase/WorkMap";

const BROADCAST_PARTS = [
	["Lower third", "Name and title, wiped on from the left"],
	["Live bug", "Status and the local time, kept live"],
	["Now panel", "Cycles through the capabilities above"],
	["Ticker", "Every tool from the Stack section"],
] as const;

/**
 * What the work produces, drawn rather than described. The case studies are
 * about the editor and the pipelines behind charts, maps and broadcast
 * graphics; this shows those three kinds of output, rendered live in the
 * browser from this site's own data. Not screenshots of anyone's product —
 * the shape of the output, with nothing on it that the page does not state
 * elsewhere.
 */
export function Showcase() {
	const onPointerMove = useSpotlight();

	return (
		<Section
			id="output"
			number="02"
			eyebrow="Output"
			title="Charts, maps and broadcast graphics"
		>
			<p className="max-w-2xl text-[17px] leading-relaxed text-muted">
				The systems I work on end in pictures: a chart, a map or a table on a
				newsroom's page, and the same configuration rendered to a still or a
				video for print and broadcast. These three are drawn live in your
				browser from this site's own data.
			</p>

			<div
				onPointerMove={onPointerMove}
				className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-5"
			>
				<Reveal
					data-arcade-ground
					className="spotlight panel p-6 md:p-7 lg:col-span-3"
				>
					<ToolkitChart />
				</Reveal>
				<Reveal
					delay={0.08}
					data-arcade-ground
					className="spotlight panel p-6 md:p-7 lg:col-span-2"
				>
					<WorkMap />
				</Reveal>
				<Reveal
					delay={0.12}
					data-arcade-ground
					className="panel grid gap-8 p-6 md:p-7 lg:col-span-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] lg:items-center"
				>
					<div>
						<p aria-hidden="true" className="font-mono text-[11px] text-faint">
							<span className="text-accent">broadcast</span>/graphics-package
						</p>
						<h3 className="mt-4 font-display text-xl font-semibold tracking-[-0.02em] text-ink">
							A broadcast graphics package
						</h3>
						<p className="mt-2 text-sm leading-relaxed text-muted">
							Graphics built for a browser and captured to video — the export
							path in the first case study. Scaled in container units against a
							1920-wide frame, so it resizes the way video does.
						</p>
						<dl className="mt-6 space-y-3 border-t border-line/60 pt-5">
							{BROADCAST_PARTS.map(([part, detail]) => (
								<div key={part} className="flex gap-3 text-sm">
									<dt className="w-24 shrink-0 text-ink">{part}</dt>
									<dd className="text-muted">{detail}</dd>
								</div>
							))}
						</dl>
					</div>
					<div className="order-first lg:order-none">
						<BroadcastFrame />
					</div>
				</Reveal>
			</div>
		</Section>
	);
}
