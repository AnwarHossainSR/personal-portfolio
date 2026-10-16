import { Check, X } from "lucide-react";
import type { Decision } from "@/content/schema";

export function DecisionBlock({
	decision,
	index,
}: {
	decision: Decision;
	index: number;
}) {
	return (
		<article data-arcade-ground className="panel overflow-hidden">
			<div className="border-b border-line/70 p-6 md:p-7">
				<p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
					Decision {String(index + 1).padStart(2, "0")}
				</p>
				<h3 className="mt-3 max-w-[50ch] font-display text-xl font-semibold leading-snug tracking-[-0.02em] text-ink">
					{decision.question}
				</h3>
			</div>

			<dl className="grid md:grid-cols-2">
				<div className="border-b border-line/70 p-6 md:border-b-0 md:border-r md:p-7">
					<dt className="flex items-center gap-2 text-sm font-medium text-ink">
						<span className="grid h-5 w-5 place-items-center rounded-full bg-signal/15 text-signal">
							<Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
						</span>
						Chose
					</dt>
					<dd className="mt-3 text-[15px] leading-relaxed text-muted">
						{decision.chose}
					</dd>
				</div>
				<div className="p-6 md:p-7">
					<dt className="flex items-center gap-2 text-sm font-medium text-ink">
						<span className="grid h-5 w-5 place-items-center rounded-full bg-surface-deep text-faint">
							<X className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
						</span>
						Rejected
					</dt>
					<dd className="mt-3 space-y-4">
						{decision.rejected.map((option) => (
							<div key={option.option}>
								<p className="text-[15px] leading-relaxed text-muted">
									{option.option}
								</p>
								<p className="mt-1.5 text-[15px] leading-relaxed text-faint">
									{option.why}
								</p>
							</div>
						))}
					</dd>
				</div>
			</dl>

			<div className="border-t border-line/70 bg-accent/[0.05] p-6 md:p-7">
				<p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
					What it cost
				</p>
				<p className="mt-2 max-w-[66ch] text-[15px] leading-relaxed text-muted">
					{decision.tradeoff}
				</p>
			</div>
		</article>
	);
}
