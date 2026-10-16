import { Section } from "@/components/section";
import { stackGroups } from "@/data/stack";
import { Reveal } from "@/motion/Reveal";
import { useSpotlight } from "@/motion/useSpotlight";

const slug = (name: string) =>
	name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");

export function Stack() {
	const onPointerMove = useSpotlight();

	return (
		<Section
			id="stack"
			number="05"
			eyebrow="Tools"
			title="The tools behind the work"
		>
			<p className="max-w-2xl text-[17px] leading-relaxed text-muted">
				Grouped by what I use each thing for. No proficiency ratings — what a
				tool is used for is something you can check in conversation, and a grade
				I award myself is not.
			</p>

			<div
				onPointerMove={onPointerMove}
				className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2"
			>
				{stackGroups.map((group, index) => (
					<Reveal
						key={group.name}
						delay={(index % 2) * 0.08}
						data-arcade-ground
						className="spotlight panel p-6 md:p-7"
					>
						<p aria-hidden="true" className="font-mono text-[11px] text-faint">
							<span className="text-accent">registry</span>/{slug(group.name)}
						</p>
						<h3 className="mt-4 font-display text-xl font-semibold tracking-[-0.02em] text-ink md:text-2xl">
							{group.name}
						</h3>
						<p className="mt-2 text-[15px] leading-relaxed text-muted">
							{group.purpose}
						</p>
						<dl className="mt-6 divide-y divide-line/60 border-t border-line/60">
							{group.items.map((item) => (
								<div
									key={item.name}
									className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 py-3"
								>
									<dt className="text-[15px] text-ink">{item.name}</dt>
									<dd className="font-mono text-[11px] leading-6 text-faint">
										since {item.since}
									</dd>
									<dd className="col-span-2 text-sm leading-relaxed text-muted">
										{item.usedFor}
									</dd>
								</div>
							))}
						</dl>
					</Reveal>
				))}
			</div>
		</Section>
	);
}
