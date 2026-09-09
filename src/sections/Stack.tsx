import { Section } from "@/components/section";
import { stackGroups } from "@/data/stack";

export function Stack() {
	return (
		<Section
			id="stack"
			number="04"
			eyebrow="Tools"
			title="The tools behind the work"
		>
			<p className="max-w-2xl leading-relaxed text-muted">
				Grouped by what I use each thing for. No proficiency ratings — what a
				tool is used for is something you can check in conversation, and a grade
				I award myself is not.
			</p>

			<div className="mt-10 space-y-10">
				{stackGroups.map((group) => (
					<div key={group.name} className="border-t border-line pt-6">
						<h3 className="font-display text-xl font-semibold tracking-tight text-ink md:text-2xl">
							{group.name}
						</h3>
						<p className="mt-2 max-w-2xl leading-relaxed text-muted">
							{group.purpose}
						</p>
						<dl className="mt-5 space-y-3">
							{group.items.map((item) => (
								<div key={item.name} className="sm:flex sm:gap-6">
									<dt className="text-ink sm:w-56 sm:shrink-0">{item.name}</dt>
									<dd className="leading-relaxed text-muted">
										{item.usedFor}{" "}
										<span className="text-faint">· since {item.since}</span>
									</dd>
								</div>
							))}
						</dl>
					</div>
				))}
			</div>
		</Section>
	);
}
