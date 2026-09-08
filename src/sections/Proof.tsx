import { Section } from "@/components/section";
import { recognition } from "@/data/recognition";

export function Proof() {
	if (recognition.length === 0) {
		return null;
	}

	return (
		<Section id="proof" number="05" eyebrow="Recognition" title="What the work earned">
			<ul className="space-y-8">
				{recognition.map((item) => (
					<li key={`${item.title}-${item.year}`} className="border-t border-line pt-6 first:border-t-0 first:pt-0">
						<h3 className="font-display text-xl font-semibold tracking-tight text-ink md:text-2xl">
							{item.title}
						</h3>
						<p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
							{item.issuer} · {item.year}
						</p>
						{item.note && <p className="mt-3 max-w-2xl leading-relaxed text-muted">{item.note}</p>}
					</li>
				))}
			</ul>
		</Section>
	);
}
