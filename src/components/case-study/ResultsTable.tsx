import type { Result } from "@/content/schema";

export function ResultsTable({ results }: { results: Result[] }) {
	if (results.length === 0) {
		return null;
	}

	return (
		<div data-arcade-ground className="panel overflow-x-auto">
			<table className="w-full min-w-[36rem] border-collapse text-left text-[15px]">
				<caption className="sr-only">
					Measured results, with the method used for each
				</caption>
				<thead>
					<tr className="border-b border-line bg-surface-deep/50">
						<th
							scope="col"
							className="px-5 py-3 font-mono text-[11px] font-normal uppercase tracking-[0.16em] text-faint"
						>
							Metric
						</th>
						<th
							scope="col"
							className="px-5 py-3 font-mono text-[11px] font-normal uppercase tracking-[0.16em] text-faint"
						>
							Before
						</th>
						<th
							scope="col"
							className="px-5 py-3 font-mono text-[11px] font-normal uppercase tracking-[0.16em] text-faint"
						>
							After
						</th>
					</tr>
				</thead>
				<tbody>
					{results.map((result) => (
						<tr
							key={result.metric}
							className="border-b border-line/70 align-top last:border-b-0"
						>
							<th scope="row" className="px-5 py-4 font-normal text-ink">
								{result.metric}
								{/* The method is the reason the number is worth anything. It sits with
								    the row rather than in a footnote so it cannot be skimmed past. */}
								<span className="mt-1.5 block text-[13px] leading-relaxed text-muted">
									{result.method}
								</span>
							</th>
							<td className="px-5 py-4 text-muted">{result.before}</td>
							<td className="px-5 py-4 font-medium text-signal">
								{result.after}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
