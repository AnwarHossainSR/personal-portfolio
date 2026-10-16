import { useEffect, useState } from "react";
import { formatClock } from "@/components/LiveClock";
import { cn } from "@/lib/utils";
import { useInView } from "@/motion/useInView";
import { PLACES } from "@/sections/showcase/data";
import { WORLD_DOTS } from "@/sections/showcase/world-dots";

/*
 * Equirectangular, cropped to the part of the world the work happens in.
 * Four SVG units to a degree, so one 2.5° cell is a 10-unit dot pitch.
 */
const VIEW = { lonMin: -22, lonMax: 150, latMax: 72, latMin: -14 } as const;
const K = 4;
const W = (VIEW.lonMax - VIEW.lonMin) * K;
const H = (VIEW.latMax - VIEW.latMin) * K;

const project = (lon: number, lat: number) => ({
	x: (lon - VIEW.lonMin) * K,
	y: (VIEW.latMax - lat) * K,
});

/**
 * Every land dot inside the view, as one path of zero-length segments with
 * round caps. One DOM node for a thousand dots, rather than a thousand nodes.
 */
function landPath(): string {
	const { rows, cols, step, lon0, latTop } = WORLD_DOTS;
	const parts: string[] = [];
	rows.forEach((hex, row) => {
		const lat = latTop - row * step;
		if (lat > VIEW.latMax || lat < VIEW.latMin) return;
		const bits = BigInt(`0x${hex}`);
		for (let col = 0; col < cols; col++) {
			if (((bits >> BigInt(cols - 1 - col)) & 1n) === 0n) continue;
			const lon = lon0 + col * step;
			if (lon < VIEW.lonMin || lon > VIEW.lonMax) continue;
			const { x, y } = project(lon, lat);
			parts.push(`M${x.toFixed(1)} ${y.toFixed(1)}h0`);
		}
	});
	return parts.join("");
}

const LAND = landPath();

/** Hours east of UTC for a zone at a given moment, from the platform's own tz data. */
export function utcOffsetHours(timeZone: string, at: Date): number {
	const name = new Intl.DateTimeFormat("en-GB", {
		timeZone,
		timeZoneName: "shortOffset",
	})
		.formatToParts(at)
		.find((part) => part.type === "timeZoneName")?.value;
	const match = name?.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
	if (!match) return 0;
	const hours = Number(match[2]) + Number(match[3] ?? 0) / 60;
	return match[1] === "-" ? -hours : hours;
}

const [HOME, AWAY] = PLACES;
const from = project(HOME.lon, HOME.lat);
const to = project(AWAY.lon, AWAY.lat);
// A great-circle route reads as an arc on a flat map; bow it away from the equator.
const mid = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
const control = { x: mid.x + 30, y: mid.y - 120 };
const ROUTE = `M${from.x} ${from.y} Q${control.x} ${control.y} ${to.x} ${to.y}`;

/**
 * Where the work happens: Dhaka, and the everviz product group in Norway —
 * both stated elsewhere on the page. The clocks are live, and the gap
 * between them comes from the browser's own time-zone data, so it is right in
 * both halves of the year without anyone having to remember daylight saving.
 */
export function WorkMap() {
	const [now, setNow] = useState(() => new Date());
	const [ref, inView] = useInView<HTMLDivElement>();

	useEffect(() => {
		const id = window.setInterval(() => setNow(new Date()), 15_000);
		return () => window.clearInterval(id);
	}, []);

	const gap =
		utcOffsetHours(HOME.timeZone, now) - utcOffsetHours(AWAY.timeZone, now);

	return (
		<div ref={ref} className="flex h-full flex-col">
			<p aria-hidden="true" className="font-mono text-[11px] text-faint">
				<span className="text-accent">map</span>/where-the-work-happens
			</p>
			<h3 className="mt-4 font-display text-xl font-semibold tracking-[-0.02em] text-ink">
				Where the work happens
			</h3>
			<p className="mt-2 text-sm leading-relaxed text-muted">
				{HOME.label}, with the {AWAY.detail} in {AWAY.label} — {Math.abs(gap)}{" "}
				hours apart today.
			</p>

			<div
				role="img"
				aria-label={`Map: a route from ${HOME.label} to ${AWAY.label}.`}
				className="relative mt-5 flex-1"
			>
				<svg
					viewBox={`0 0 ${W} ${H}`}
					className={cn(
						"pointer-events-none block h-auto w-full",
						inView && "map-in",
					)}
					aria-hidden="true"
				>
					<defs>
						<linearGradient
							id="route-gradient"
							gradientUnits="userSpaceOnUse"
							x1={from.x}
							y1={from.y}
							x2={to.x}
							y2={to.y}
						>
							<stop
								offset="0"
								className="[stop-color:oklch(var(--color-accent))]"
							/>
							<stop
								offset="1"
								className="[stop-color:oklch(var(--color-signal))]"
							/>
						</linearGradient>
					</defs>
					<path
						d={LAND}
						className="stroke-faint/45"
						strokeWidth={4.2}
						strokeLinecap="round"
					/>
					<path
						d={ROUTE}
						fill="none"
						stroke="url(#route-gradient)"
						strokeWidth={2}
						strokeLinecap="round"
						pathLength={100}
						className="map-route"
					/>
					<path
						d={ROUTE}
						fill="none"
						className="map-packet stroke-ink"
						strokeWidth={3}
						strokeLinecap="round"
						pathLength={100}
					/>
					{[
						{ ...from, tone: "fill-accent" },
						{ ...to, tone: "fill-signal" },
					].map((point) => (
						<g key={`${point.x}-${point.y}`}>
							<circle
								cx={point.x}
								cy={point.y}
								r={6}
								className={cn("map-ping", point.tone)}
							/>
							<circle
								cx={point.x}
								cy={point.y}
								r={6}
								className={cn("stroke-surface", point.tone)}
								strokeWidth={2.5}
							/>
						</g>
					))}
				</svg>

				{[
					// Dhaka's label to the right; Norway's below, where the route
					// arriving from the east does not run through it.
					{ place: HOME, at: from, offset: "-translate-y-1/2 pl-3" },
					{ place: AWAY, at: to, offset: "-translate-x-3 translate-y-2.5" },
				].map(({ place, at, offset }) => (
					<div
						key={place.id}
						aria-hidden="true"
						className={cn("pointer-events-none absolute", offset)}
						style={{
							left: `${(at.x / W) * 100}%`,
							top: `${(at.y / H) * 100}%`,
						}}
					>
						<p className="whitespace-nowrap rounded-md bg-paper/80 px-1.5 py-0.5 text-[12px] font-medium text-ink backdrop-blur-sm">
							{place.label}{" "}
							<span className="font-mono tabular-nums text-muted">
								{formatClock(now, place.timeZone)}
							</span>
						</p>
					</div>
				))}
			</div>

			<dl className="mt-4 grid grid-cols-2 gap-3 border-t border-line/60 pt-4">
				{PLACES.map((place, index) => (
					<div key={place.id}>
						<dt className="flex items-center gap-2.5 text-sm text-ink">
							<span
								aria-hidden="true"
								className={cn(
									"h-2 w-2 shrink-0 rounded-full",
									index === 0 ? "bg-accent" : "bg-signal",
								)}
							/>
							{place.label}
						</dt>
						<dd className="mt-0.5 pl-[1.125rem] text-[12px] text-muted">
							{place.detail} ·{" "}
							<time className="font-mono tabular-nums">
								{formatClock(now, place.timeZone)}
							</time>
						</dd>
					</div>
				))}
			</dl>
		</div>
	);
}
