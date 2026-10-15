import { Award } from "lucide-react";
import { Section } from "@/components/section";
import { recognition } from "@/data/recognition";
import { cn } from "@/lib/utils";

export function Proof() {
	if (recognition.length === 0) {
		return null;
	}

	return (
		<Section
			id="proof"
			number="05"
			eyebrow="Recognition"
			title="What the work earned"
		>
			<ul
				className={cn("grid gap-4", recognition.length > 1 && "md:grid-cols-2")}
			>
				{recognition.map((item) => (
					<li
						key={`${item.title}-${item.year}`}
						className="panel relative flex flex-col gap-6 overflow-hidden p-6 sm:flex-row sm:items-start md:p-8"
					>
						<div
							aria-hidden="true"
							className="halo -right-24 -top-24 h-72 w-72"
						/>
						<span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-accent/40 bg-accent/10 text-accent">
							<Award className="h-5 w-5" aria-hidden="true" />
						</span>
						<div className="relative">
							<h3 className="font-display text-2xl font-semibold tracking-[-0.02em] text-ink md:text-3xl">
								{item.title}
							</h3>
							<p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
								{item.issuer} · {item.year}
							</p>
							{item.note && (
								<p className="mt-4 max-w-2xl leading-relaxed text-muted">
									{item.note}
								</p>
							)}
						</div>
					</li>
				))}
			</ul>
		</Section>
	);
}
