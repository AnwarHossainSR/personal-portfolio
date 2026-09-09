import { useState, useSyncExternalStore } from "react";
import { setArcadeMode } from "@/arcade/mode";
import {
	getMutedServerSnapshot,
	isMuted,
	setMuted,
	subscribeMuted,
} from "@/arcade/sound";
import { ENEMY_LEVEL_NUMBERS } from "@/arcade/storage";
import { enemyRowIds, TELEMETRY_IDS } from "@/arcade/telemetry-ids";

/**
 * The overlay's readout, and its explanation.
 *
 * A fixed panel rather than a block in the footer: the numbers are only worth
 * anything while you are playing, and playing happens wherever you are on the
 * page — a readout you have to scroll to the bottom of the document to see is
 * a readout nobody reads.
 *
 * Closed by default, and closed means one small button rather than a docked
 * header bar. A panel that is always on screen is a permanent obstruction on a
 * page whose job is to be read, and the numbers are optional: you can play the
 * whole thing without ever opening it.
 *
 * The rows themselves are static markup. React renders them once and never
 * touches them again: the engine writes the numbers directly by id, at
 * whatever rate the game runs. Routing a per-frame counter through React state
 * would re-render this component sixty times a second to change one text node.
 *
 * `data-arcade-keep` is what stops the game shooting its own instrument panel.
 */

const rowClass = "flex items-baseline justify-between gap-4";
const valueClass = "tabular-nums text-ink";

function Row({ label, id }: { label: string; id: string }) {
	return (
		<div className={rowClass}>
			<span className="text-faint">{label}</span>
			<span id={id} className={valueClass}>
				0
			</span>
		</div>
	);
}

export function ArcadePanel() {
	const [open, setOpen] = useState(false);
	const [confirmingReset, setConfirmingReset] = useState(false);
	const muted = useSyncExternalStore(
		subscribeMuted,
		isMuted,
		getMutedServerSnapshot,
	);

	if (!open) {
		return (
			<button
				type="button"
				data-arcade-keep
				onClick={() => setOpen(true)}
				aria-expanded={false}
				className="pointer-events-auto fixed bottom-4 right-4 z-[70] rounded-md border border-line bg-paper/95 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted shadow-sm backdrop-blur transition-colors hover:text-ink"
			>
				Arcade stats
			</button>
		);
	}

	return (
		<aside
			aria-labelledby="arcade-panel-heading"
			data-arcade-keep
			// Above the arcade root (z-60) so the game draws behind it, and
			// pointer-events restored because this panel, unlike everything else
			// the overlay puts on screen, is meant to be clicked.
			className="pointer-events-auto fixed bottom-4 right-4 z-[70] w-[19rem] max-w-[calc(100vw-2rem)] rounded-md border border-line bg-paper/95 shadow-lg backdrop-blur"
		>
			<div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
				<h2
					id="arcade-panel-heading"
					className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted"
				>
					Arcade overlay
				</h2>
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={() => setOpen(false)}
						aria-expanded={true}
						className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint transition-colors hover:text-ink"
					>
						Hide
					</button>
					<button
						type="button"
						onClick={() => setArcadeMode(false)}
						className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint transition-colors hover:text-ink"
					>
						Stop
					</button>
				</div>
			</div>

			<div className="max-h-[60vh] space-y-3 overflow-y-auto px-4 py-3">
				<div className="space-y-1.5 font-mono text-[11px] uppercase tracking-[0.12em]">
					<Row label="Shots" id={TELEMETRY_IDS.shots} />
					<Row label="Glyphs destroyed" id={TELEMETRY_IDS.broken} />
					<Row label="Orbs collected" id={TELEMETRY_IDS.grabs} />
					<Row label="Hull" id={TELEMETRY_IDS.hull} />
					<Row label="Gun" id={TELEMETRY_IDS.gunMode} />
					<Row label="Enemy speed" id={TELEMETRY_IDS.enemySpeed} />
					<Row label="Highest level" id={TELEMETRY_IDS.maxLevel} />
				</div>

				<div className="space-y-1.5 border-t border-line/60 pt-3 font-mono text-[11px] uppercase tracking-[0.12em]">
					<div className={`${rowClass} text-faint`}>
						<span>Enemies</span>
						<span className="tabular-nums">now/ses/all</span>
					</div>
					{ENEMY_LEVEL_NUMBERS.map((level) => {
						const ids = enemyRowIds(level);
						return (
							<div key={level} className={rowClass}>
								<span className="text-faint">Level {level}</span>
								<span className={valueClass}>
									<span id={ids.current}>0</span>
									{" / "}
									<span id={ids.session}>0</span>
									{" / "}
									<span id={ids.allTime}>0</span>
								</span>
							</div>
						);
					})}
				</div>

				<div className="flex items-center justify-between gap-4 border-t border-line/60 pt-3 font-mono text-[11px] uppercase tracking-[0.12em]">
					<span className="text-faint">Sound</span>
					{/*
					 * The control the first cut of this was missing. Audio still
					 * defaults to off — unprompted noise on a portfolio is worse
					 * than silence — but silence with no way out is worse than
					 * either.
					 */}
					<button
						type="button"
						aria-pressed={!muted}
						onClick={() => setMuted(!muted)}
						className="text-ink underline underline-offset-4 transition-colors hover:text-accent"
					>
						{muted ? "Off" : "On"}
					</button>
				</div>

				{/*
				 * Clearing the all-time score, two-step like the reference's
				 * panel. Theirs removes the stored ciphertext and reloads the
				 * page; a reload here would throw away both the run and the
				 * restored page, so the engine zeroes its counters in place and
				 * the telemetry sweep picks them up on the next frame.
				 *
				 * The engine is reached through a dynamic import so this control
				 * cannot drag it into the main bundle. By the time anyone can
				 * click it the chunk is already loaded — the panel only exists
				 * while the overlay is running.
				 */}
				<div className="border-t border-line/60 pt-3">
					{confirmingReset ? (
						<div
							role="alert"
							className="flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.12em]"
						>
							<span className="text-faint">Clear all-time score?</span>
							<span className="flex items-center gap-3">
								<button
									type="button"
									onClick={() => setConfirmingReset(false)}
									className="text-faint transition-colors hover:text-ink"
								>
									Cancel
								</button>
								<button
									type="button"
									onClick={async () => {
										const { resetScore } = await import("@/arcade");
										resetScore();
										setConfirmingReset(false);
									}}
									className="rounded bg-accent px-2.5 py-1 text-paper transition-opacity hover:opacity-90"
								>
									Confirm
								</button>
							</span>
						</div>
					) : (
						<button
							type="button"
							onClick={() => setConfirmingReset(true)}
							className="font-mono text-[11px] uppercase tracking-[0.12em] text-faint underline underline-offset-4 transition-colors hover:text-ink"
						>
							Clear score
						</button>
					)}
				</div>

				<p className="border-t border-line/60 pt-3 font-mono text-[11px] uppercase leading-relaxed tracking-[0.12em] text-faint">
					WASD · click to fire · 1–4 guns · V boundaries · Esc to stop
				</p>

				{/*
				 * The note that makes this an artifact rather than a gimmick,
				 * folded away so it does not compete with the numbers. Same rule
				 * as the rest of the site: no figure here that was not measured,
				 * and the limitation of the score sealing is stated rather than
				 * left out.
				 */}
				<details className="border-t border-line/60 pt-3 text-sm leading-relaxed text-muted">
					<summary className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.14em] text-faint transition-colors hover:text-ink">
						What this is
					</summary>
					<div className="mt-3 space-y-3">
						<p>
							The overlay reads this page as its level. Every element is
							classified as an obstacle from computed style — background alpha,
							background image, box shadow, border — and text nodes are walked
							with a Range for per-character rectangles, so the collision world
							is the layout itself rather than a description of it. Hold V to
							see it.
						</p>
						<p>
							Bullets sweep the segment they travelled each frame instead of
							testing where they landed, which is what stops them passing
							through a hairline rule at speed. Enemies sample eight headings
							and steer around obstacles rather than chasing in a straight line.
							The score is sealed with a key held in IndexedDB: that stops it
							being edited in storage, and does not stop anyone who opens the
							console.
						</p>
						<p>
							Nothing it destroys is permanent. Every change is registered
							before it is made and reversed when you stop, because React will
							not put back a text node deleted underneath it.
						</p>
						<p>
							<a
								href="https://github.com/AnwarHossainSR/personal-portfolio/tree/main/src/arcade"
								target="_blank"
								rel="noreferrer"
								className="text-ink underline underline-offset-4 transition-colors hover:text-accent"
							>
								Read the source
							</a>{" "}
							— the code is the evidence; a claim about it is not.
						</p>
					</div>
				</details>
			</div>
		</aside>
	);
}

// Default export as well: ArcadeMount reaches it through React.lazy, so the
// panel's markup travels with the arcade chunk rather than the main one.
export default ArcadePanel;
