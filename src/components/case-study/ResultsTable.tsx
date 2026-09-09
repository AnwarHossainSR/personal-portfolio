import type { Result } from "@/content/schema";

export function ResultsTable({ results }: { results: Result[] }) {
	if (results.length === 0) {
		return null;
	}

	return (
		<div className="overflow-x-auto">
			<table className="w-full min-w-[36rem] border-collapse text-left text-[15px]">
				<caption className="sr-only">
					Measured results, with the method used for each
				</caption>
				<thead>
					<tr className="border-b border-line">
						<th
							scope="col"
							className="py-2.5 pr-6 text-sm font-medium text-muted"
						>
							Metric
						</th>
						<th
							scope="col"
							className="py-2.5 pr-6 text-sm font-medium text-muted"
						>
							Before
						</th>
						<th
							scope="col"
							className="py-2.5 pr-6 text-sm font-medium text-muted"
						>
							After
						</th>
					</tr>
				</thead>
				<tbody>
					{results.map((result) => (
						<tr key={result.metric} className="border-b border-line align-top">
							<th scope="row" className="py-4 pr-6 font-normal text-ink">
								{result.metric}
								{/* The method is the reason the number is worth anything. It sits with
								    the row rather than in a footnote so it cannot be skimmed past. */}
								<span className="mt-1.5 block text-[13px] leading-relaxed text-muted">
									{result.method}
								</span>
							</th>
							<td className="py-4 pr-6 text-muted">{result.before}</td>
							<td className="py-4 pr-6 text-ink">{result.after}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
