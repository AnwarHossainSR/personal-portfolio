import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useElementWidth } from "@/motion/useElementWidth";
import { useInView } from "@/motion/useInView";
import { roleInYear, toolsByYear } from "@/sections/showcase/data";

const FALLBACK_W = 560;
const H = 240;
const TOP = 30; // room for the value on each cap
const BOTTOM = 30; // room for the year under each column
const SIDE = 8;
const BAR = 24; // thick enough to read, thin enough to leave air in the band
const RADIUS = 4;

/** A column with a rounded data end and a square foot on the baseline. */
function columnPath(x: number, y: number, width: number, base: number) {
	const r = Math.min(RADIUS, base - y);
	return [
		`M${x},${base}`,
		`V${y + r}`,
		`Q${x},${y} ${x + r},${y}`,
		`H${x + width - r}`,
		`Q${x + width},${y} ${x + width},${y + r}`,
		`V${base}`,
		"Z",
	].join(" ");
}

/**
 * The Stack section, counted by the year each tool came into daily use.
 *
 * One series, so one colour and no legend — the title says what is plotted.
 * Emphasis rather than a ramp: the peak year in ember, the rest in the chart
 * gray, because the story is that one year and not a gradient. Every value is
 * on its cap, the tooltip lists the tools behind it, and the table view says
 * all of it again without needing a pointer.
 */
export function ToolkitChart() {
	const data = useMemo(() => toolsByYear(), []);
	const [view, setView] = useState<"chart" | "table">("chart");
	const [active, setActive] = useState<number | null>(null);
	const [ref, inView] = useInView<HTMLDivElement>();
	// Drawn at its real width, so a label set at 12px is 12px on a phone too.
	const [plotRef, W] = useElementWidth<HTMLDivElement>(FALLBACK_W);

	const max = Math.max(...data.map((d) => d.tools.length));
	const total = data.reduce((sum, d) => sum + d.tools.length, 0);
	const peak = data.find((d) => d.tools.length === max) ?? data[0];
	const joined = roleInYear(peak.year);
	const joinedThatYear = joined?.period.includes(String(peak.year));

	const band = (W - SIDE * 2) / data.length;
	const base = H - BOTTOM;
	const scale = (count: number) => ((base - TOP) * count) / max;
	const shown = active === null ? null : data[active];

	return (
		<div ref={ref} className="flex h-full flex-col">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<p aria-hidden="true" className="font-mono text-[11px] text-faint">
					<span className="text-accent">chart</span>/toolkit-by-year
				</p>
				<fieldset className="flex rounded-full border border-line/80 bg-paper/40 p-0.5 font-mono text-[11px]">
					<legend className="sr-only">Show as</legend>
					{(["chart", "table"] as const).map((option) => (
						<button
							key={option}
							type="button"
							aria-pressed={view === option}
							onClick={() => setView(option)}
							className={cn(
								"rounded-full px-3 py-1 capitalize transition-colors",
								view === option
									? "bg-surface-deep text-ink"
									: "text-faint hover:text-ink",
							)}
						>
							{option}
						</button>
					))}
				</fieldset>
			</div>

			<h3 className="mt-4 font-display text-xl font-semibold tracking-[-0.02em] text-ink">
				Tools in daily use, by the year each one started
			</h3>
			<p className="mt-2 text-sm leading-relaxed text-muted">
				{max} of {total} arrived in {peak.year}
				{joinedThatYear
					? `, the year I joined ${joined?.company.replace(/\.$/, "")}`
					: ""}
				.
			</p>

			{view === "chart" ? (
				<div
					ref={plotRef}
					className="relative mt-6 flex-1"
					onPointerLeave={() => setActive(null)}
				>
					<svg
						viewBox={`0 0 ${W} ${H}`}
						height={H}
						className={cn("block h-auto w-full", inView && "chart-in")}
						aria-hidden="true"
						data-arcade-ground
					>
						<line
							x1={SIDE}
							x2={W - SIDE}
							y1={base + 0.5}
							y2={base + 0.5}
							className="stroke-line"
							strokeWidth={1}
						/>
						{data.map((d, index) => {
							const count = d.tools.length;
							const cx = SIDE + band * (index + 0.5);
							const x = cx - BAR / 2;
							const y = base - scale(count);
							const isPeak = d === peak;
							const isActive = active === index;
							return (
								<g key={d.year}>
									{count > 0 && (
										<path
											d={columnPath(x, y, BAR, base)}
											className={cn(
												"chart-column transition-opacity",
												isPeak ? "fill-accent" : "fill-chart-rest",
												active !== null && !isActive && "opacity-45",
											)}
											style={{ animationDelay: `${index * 70}ms` }}
										/>
									)}
									<text
										x={cx}
										y={(count > 0 ? y : base) - 9}
										textAnchor="middle"
										className={cn(
											"font-mono text-[12px] tabular-nums",
											isPeak ? "fill-ink" : "fill-muted",
										)}
									>
										{count}
									</text>
									<text
										x={cx}
										y={base + 20}
										textAnchor="middle"
										className="fill-faint font-mono text-[11px] tabular-nums"
									>
										{d.year}
									</text>
								</g>
							);
						})}
					</svg>

					{/*
					 * The hit targets: one button per year over the whole band,
					 * not the 24px column. Real buttons, so a keyboard reaches
					 * every year and a tap on a phone pins its tooltip.
					 */}
					<ol
						aria-label={`Tools first used per year, ${data[0].year} to ${data[data.length - 1].year}`}
						className="absolute inset-0 flex"
						style={{ paddingInline: `${(SIDE / W) * 100}%` }}
					>
						{data.map((d, index) => {
							const count = d.tools.length;
							return (
								<li key={d.year} className="flex-1">
									<button
										type="button"
										aria-label={`${d.year}: ${count} ${count === 1 ? "tool" : "tools"}${count ? ` — ${d.tools.map((t) => t.name).join(", ")}` : ""}`}
										className="h-full w-full cursor-default rounded-lg focus-visible:ring-offset-0"
										onPointerEnter={() => setActive(index)}
										onFocus={() => setActive(index)}
										onBlur={() => setActive(null)}
										onClick={() => setActive(index)}
									/>
								</li>
							);
						})}
					</ol>

					{shown && (
						<div
							aria-hidden="true"
							className="pointer-events-none absolute top-0 z-10 w-72 max-w-full -translate-x-1/2 rounded-xl border border-line bg-paper/95 p-3 shadow-elevation-2 backdrop-blur"
							style={{
								left: `clamp(min(9rem, 50%), ${((SIDE + band * ((active ?? 0) + 0.5)) / W) * 100}%, calc(100% - min(9rem, 50%)))`,
							}}
						>
							<p className="text-sm">
								<span className="font-semibold text-ink">
									{shown.tools.length}{" "}
									{shown.tools.length === 1 ? "tool" : "tools"}
								</span>{" "}
								<span className="text-faint">in {shown.year}</span>
							</p>
							{shown.tools.length > 0 ? (
								<ul className="mt-2 space-y-1 text-[12px] leading-snug">
									{shown.tools.map((tool) => (
										<li
											key={tool.name}
											className="grid grid-cols-[0.625rem_minmax(0,1fr)_auto] items-baseline gap-2"
										>
											<span
												className={cn(
													"mt-1 h-0.5 w-2.5 shrink-0 rounded-full",
													shown === peak ? "bg-accent" : "bg-chart-rest",
												)}
											/>
											<span className="text-ink">{tool.name}</span>
											<span className="text-right text-faint">
												{tool.group}
											</span>
										</li>
									))}
								</ul>
							) : (
								<p className="mt-1 text-[12px] text-muted">
									Nothing new — the same tools, used harder.
								</p>
							)}
						</div>
					)}
				</div>
			) : (
				<div className="mt-6 flex-1 overflow-x-auto">
					<table className="w-full text-left text-sm">
						<caption className="sr-only">
							Tools first used per year, from the Stack section
						</caption>
						<thead>
							<tr className="border-b border-line font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
								<th scope="col" className="py-2 pr-4 font-normal">
									Year
								</th>
								<th scope="col" className="py-2 pr-4 text-right font-normal">
									Count
								</th>
								<th scope="col" className="py-2 font-normal">
									Tools
								</th>
							</tr>
						</thead>
						<tbody>
							{data.map((d) => (
								<tr key={d.year} className="border-b border-line/60 align-top">
									<th
										scope="row"
										className="py-2.5 pr-4 font-mono text-[12px] font-normal tabular-nums text-ink"
									>
										{d.year}
									</th>
									<td className="py-2.5 pr-4 text-right tabular-nums text-ink">
										{d.tools.length}
									</td>
									<td className="py-2.5 text-[13px] leading-relaxed text-muted">
										{d.tools.map((t) => t.name).join(", ") || "—"}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			<p className="mt-4 font-mono text-[11px] text-faint">
				Source: the Stack section of this page.
			</p>
		</div>
	);
}
