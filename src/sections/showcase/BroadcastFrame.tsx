import { type CSSProperties, useEffect, useState } from "react";
import { LiveClock } from "@/components/LiveClock";
import { profile } from "@/data/profile";
import { stackGroups } from "@/data/stack";
import { cn } from "@/lib/utils";
import { useInView } from "@/motion/useInView";
import { useReducedMotion } from "@/motion/useReducedMotion";

const ROTATE_EVERY_MS = 3400;
const TICKER = stackGroups.flatMap((group) => group.items.map((i) => i.name));
const city = profile.location.split(",")[0];
const CAPABILITIES = profile.capabilities;

/** The ticker's run, twice over so the loop has no seam. The copy is hidden. */
function TickerRun({ hidden = false }: { hidden?: boolean }) {
	return (
		<span
			aria-hidden={hidden || undefined}
			className="flex shrink-0 items-center"
		>
			{TICKER.map((name) => (
				<span key={name} className="flex items-center">
					<span className="px-[1.4cqw]">{name}</span>
					<span className="text-accent">◆</span>
				</span>
			))}
		</span>
	);
}

/**
 * A broadcast graphics package, drawn as HTML: a lower third, a live bug, a
 * rotating "now" panel and a ticker. It is the shape of the export work in
 * the analytics case study — graphics built for a browser, rendered to video
 * for broadcast — with this page's own content on air.
 *
 * Sized in container-query units against a 1920-wide frame, so it scales the
 * way video does instead of reflowing the way a web page does. Always on the
 * dark ground: television graphics are designed over picture, not paper.
 */
export function BroadcastFrame() {
	const reduced = useReducedMotion();
	const [ref, inView] = useInView<HTMLDivElement>();
	const [slot, setSlot] = useState(0);

	useEffect(() => {
		if (reduced || !inView) return;
		const id = window.setInterval(
			() => setSlot((current) => (current + 1) % CAPABILITIES.length),
			ROTATE_EVERY_MS,
		);
		return () => window.clearInterval(id);
	}, [reduced, inView]);

	const now = CAPABILITIES[slot];

	return (
		<div className="dark">
			<div
				ref={ref}
				role="img"
				aria-label={`A broadcast graphic: a lower third naming ${profile.name}, Senior Software Engineer; a live bug with the time in ${city}; a panel cycling through capabilities; and a ticker listing the stack.`}
				data-arcade-ground
				className={cn(
					"relative isolate aspect-video w-full overflow-hidden rounded-xl bg-paper text-ink [container-type:inline-size]",
					inView && "on-air",
				)}
			>
				{/* The set: a lit backdrop and a floor grid running away from camera. */}
				<div
					aria-hidden="true"
					className="halo -left-[10%] -top-[30%] h-[90%] w-[60%]"
				/>
				<div
					aria-hidden="true"
					className="halo halo-signal -bottom-[40%] right-[5%] h-[80%] w-[45%]"
				/>
				<div aria-hidden="true" className="studio-floor" />

				{/* Station mark, top left. */}
				<div className="absolute left-[5cqw] top-[4.5cqw] flex items-center gap-[1cqw]">
					<span className="grid h-[3.6cqw] w-[3.6cqw] place-items-center rounded-[0.6cqw] bg-accent font-mono text-[1.8cqw] font-semibold text-paper">
						A
					</span>
					<span className="font-mono text-[1.1cqw] uppercase tracking-[0.3em] text-muted">
						Production
					</span>
				</div>

				{/* Live bug and clock, top right. */}
				<div className="absolute right-[5cqw] top-[4.5cqw] flex items-stretch overflow-hidden rounded-[0.5cqw] font-mono text-[1.3cqw] uppercase tracking-[0.2em]">
					<span className="flex items-center gap-[0.7cqw] bg-accent px-[1.2cqw] py-[0.6cqw] font-semibold text-paper">
						<span className="on-air-blink h-[0.8cqw] w-[0.8cqw] rounded-full bg-paper" />
						Live
					</span>
					<span className="bg-paper/80 px-[1.2cqw] py-[0.6cqw] text-ink backdrop-blur">
						{city}{" "}
						<LiveClock timeZone={profile.timeZoneId} className="tabular-nums" />
					</span>
				</div>

				{/* The "now" panel, right of frame. */}
				<div className="absolute right-[5cqw] top-[24%] w-[30cqw] rounded-[0.8cqw] border border-line/70 bg-surface/70 p-[1.6cqw] backdrop-blur-md">
					<p className="font-mono text-[1cqw] uppercase tracking-[0.25em] text-accent">
						Now · capability {String(slot + 1).padStart(2, "0")}/
						{String(CAPABILITIES.length).padStart(2, "0")}
					</p>
					<p
						key={now.title}
						className="on-air-swap mt-[0.8cqw] font-display text-[2.4cqw] font-semibold leading-tight tracking-[-0.02em]"
					>
						{now.title}
					</p>
					<div className="mt-[1.2cqw] h-[0.25cqw] overflow-hidden rounded-full bg-line">
						<div
							key={slot}
							className="on-air-progress h-full bg-accent"
							style={
								{
									"--rotate-ms": `${ROTATE_EVERY_MS}ms`,
								} as CSSProperties
							}
						/>
					</div>
				</div>

				{/* Lower third. */}
				<div className="absolute bottom-[11cqw] left-[5cqw] max-w-[60cqw]">
					<div className="l3 l3-name flex items-stretch">
						<span className="w-[0.6cqw] bg-accent" />
						<p className="bg-ink px-[2cqw] py-[1cqw] font-display text-[3.6cqw] font-semibold uppercase leading-none tracking-[-0.01em] text-paper">
							{profile.name}
						</p>
					</div>
					<p className="l3 l3-title inline-block bg-surface/90 px-[2cqw] py-[0.8cqw] font-mono text-[1.45cqw] uppercase tracking-[0.18em] text-ink backdrop-blur">
						Senior Software Engineer · {city}
					</p>
				</div>

				{/* Ticker. */}
				<div className="absolute inset-x-0 bottom-0 flex h-[4.6cqw] items-stretch bg-paper/90 font-mono text-[1.45cqw] uppercase tracking-[0.12em] backdrop-blur">
					<span className="relative z-10 flex items-center bg-accent px-[2cqw] font-semibold text-paper">
						Stack
					</span>
					<div className="flex min-w-0 flex-1 items-center overflow-hidden text-ink">
						<div className="on-air-ticker flex">
							<TickerRun />
							<TickerRun hidden />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
