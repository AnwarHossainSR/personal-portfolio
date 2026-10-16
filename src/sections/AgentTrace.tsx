import { Check, RotateCcw, Sparkles } from "lucide-react";
import { type CSSProperties, useId, useState } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/motion/useReducedMotion";

interface TraceStep {
	step: string;
	detail: string;
	/** The step that never finishes: production is not a state you leave. */
	live?: boolean;
}

/*
 * How a change goes from an idea to production, written as an agent's run.
 * Every line maps onto something stated elsewhere on the page — the process
 * steps, the stack, the positioning line — and none of it carries a number,
 * because a duration or a count here would be a measurement nobody took.
 */
export const TRACE_STEPS: TraceStep[] = [
	{ step: "plan", detail: "find the constraint first" },
	{ step: "build", detail: "node · typescript · postgres" },
	{ step: "provision", detail: "terraform apply → aws" },
	{ step: "release", detail: "github actions → prod" },
	{ step: "observe", detail: "keep it running", live: true },
];

export const TRACE_PROMPT = "make it someone else's to run";

const FIRST_ROW_AT = 0.7;
const ROW_GAP = 0.7;
const SPIN_FOR = 0.55;

type TimedStyle = CSSProperties & Record<`--${string}`, string | number>;

function timing(index: number): TimedStyle {
	const at = FIRST_ROW_AT + index * ROW_GAP;
	return { "--at": `${at}s`, "--done": `${at + SPIN_FOR}s` };
}

/**
 * The hero's console. Labelled as an illustration on screen as well as to
 * assistive tech — a portfolio that is strict about where its numbers come
 * from should not let a styled log pass for a real one.
 */
export function AgentTrace({ className }: { className?: string }) {
	const promptAt = FIRST_ROW_AT + TRACE_STEPS.length * ROW_GAP + 0.2;
	const captionId = useId();
	const reduced = useReducedMotion();
	// Bumping the key remounts the rows, which restarts every CSS animation.
	const [run, setRun] = useState(0);

	return (
		<figure aria-labelledby={captionId} className={cn("relative", className)}>
			<div
				aria-hidden="true"
				className="halo halo-signal -bottom-16 -left-16 h-72 w-72"
			/>
			<div
				data-arcade-ground
				className="panel relative overflow-hidden bg-surface/85 shadow-elevation-2 backdrop-blur"
			>
				<div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 font-mono text-[11px]">
					<span
						aria-hidden="true"
						className="flex min-w-0 items-center gap-2 text-muted"
					>
						<Sparkles className="h-3.5 w-3.5 shrink-0 text-accent" />
						<span className="truncate">
							agent.run(<span className="text-accent">"ship it"</span>)
						</span>
					</span>
					<span className="flex shrink-0 items-center gap-3">
						<span
							aria-hidden="true"
							className="flex items-center gap-2 text-signal"
						>
							<span className="live-dot" />
							running
						</span>
						{!reduced && (
							<button
								type="button"
								onClick={() => setRun((count) => count + 1)}
								aria-label="Replay the run"
								title="Replay the run"
								className="grid h-6 w-6 place-items-center rounded-full border border-line text-faint transition-colors hover:border-accent/60 hover:text-accent"
							>
								<RotateCcw className="h-3 w-3" aria-hidden="true" />
							</button>
						)}
					</span>
				</div>

				<div key={run}>
					<ol
						aria-hidden="true"
						className="px-2 py-3 font-mono text-[12px] sm:text-[12.5px]"
					>
						{TRACE_STEPS.map((item, index) => (
							<li
								key={item.step}
								style={timing(index)}
								className={cn(
									"trace-row grid grid-cols-[1rem_4.75rem_minmax(0,1fr)] items-center gap-3 rounded-lg px-2.5 py-2 sm:grid-cols-[1rem_5.5rem_minmax(0,1fr)_auto]",
									item.live && "bg-signal/[0.06]",
								)}
							>
								<span className="relative grid h-4 w-4 place-items-center">
									<span className="trace-spin absolute h-3.5 w-3.5 rounded-full border-[1.5px] border-line border-t-accent" />
									<span className="trace-tick grid place-items-center">
										{item.live ? (
											<span className="live-dot" />
										) : (
											<Check
												className="h-3.5 w-3.5 text-signal"
												strokeWidth={2.5}
											/>
										)}
									</span>
								</span>
								<span className="text-ink">{item.step}</span>
								<span className="truncate text-muted">{item.detail}</span>
								<span
									className={cn(
										"trace-tick hidden sm:block",
										item.live ? "text-signal" : "text-faint",
									)}
								>
									{item.live ? "live" : "ok"}
								</span>
							</li>
						))}
					</ol>

					<div
						aria-hidden="true"
						className="flex items-center gap-2 border-t border-line px-4 py-3.5 font-mono text-[12px] sm:text-[12.5px]"
					>
						<span className="text-accent">❯</span>
						<span
							className="trace-type text-ink"
							style={
								{
									"--chars": TRACE_PROMPT.length,
									"--at": `${promptAt}s`,
								} as TimedStyle
							}
						>
							{TRACE_PROMPT}
						</span>
						<span className="caret caret-block -ml-1.5" />
					</div>
				</div>
			</div>
			<figcaption
				id={captionId}
				className="mt-4 font-mono text-[11px] text-faint"
			>
				An illustration of how work ships — not a real log.
			</figcaption>
		</figure>
	);
}
