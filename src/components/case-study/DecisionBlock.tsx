import type { Decision } from "@/content/schema";

export function DecisionBlock({
	decision,
	index,
}: {
	decision: Decision;
	index: number;
}) {
	return (
		<article className="border-t border-border/70 pt-8">
			<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
				Decision {index + 1}
			</p>
			<h3 className="mt-3 max-w-[46ch] text-xl font-semibold leading-snug tracking-tight">
				{decision.question}
			</h3>

			<dl className="mt-6 grid gap-6 sm:grid-cols-2">
				<div>
					<dt className="text-sm font-medium text-foreground">Chose</dt>
					<dd className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
						{decision.chose}
					</dd>
				</div>
				<div>
					<dt className="text-sm font-medium text-foreground">Rejected</dt>
					<dd className="mt-2 space-y-4">
						{decision.rejected.map((option) => (
							<div key={option.option}>
								<p className="text-[15px] leading-relaxed text-muted-foreground">
									{option.option}
								</p>
								<p className="mt-1 text-[15px] leading-relaxed text-muted-foreground/80">
									{option.why}
								</p>
							</div>
						))}
					</dd>
				</div>
			</dl>

			<div className="mt-6 border-l-2 border-accent/60 pl-4">
				<p className="text-sm font-medium text-foreground">What it cost</p>
				<p className="mt-1.5 max-w-[62ch] text-[15px] leading-relaxed text-muted-foreground">
					{decision.tradeoff}
				</p>
			</div>
		</article>
	);
}
