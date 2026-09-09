import { ENEMY_LEVEL_NUMBERS } from "@/arcade/storage";
import { enemyRowIds, TELEMETRY_IDS } from "@/arcade/telemetry-ids";

/**
 * The overlay's readout, and its explanation.
 *
 * Static markup. React renders it once and never touches it again: the engine
 * writes the numbers directly by id, at whatever rate the game runs. Routing a
 * per-frame counter through React state would re-render this component sixty
 * times a second to change one text node.
 *
 * `data-arcade-keep` is what stops the game shooting its own instrument panel.
 */

const rowClass = "flex items-baseline justify-between gap-4";
const labelClass = "text-faint";
const valueClass = "tabular-nums text-ink";

function Row({ label, id }: { label: string; id: string }) {
	return (
		<div className={rowClass}>
			<span className={labelClass}>{label}</span>
			<span id={id} className={valueClass}>
				0
			</span>
		</div>
	);
}

export function ArcadePanel() {
	return (
		<section
			aria-labelledby="arcade-panel-heading"
			data-arcade-keep
			className="mx-auto max-w-6xl px-5 pb-16 sm:px-8"
		>
			<div className="border-t border-line pt-8">
				<h2
					id="arcade-panel-heading"
					className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted"
				>
					Arcade overlay
				</h2>

				<div className="mt-6 grid gap-x-10 gap-y-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
					<div className="space-y-1.5 font-mono text-[11px] uppercase tracking-[0.12em]">
						<Row label="Shots" id={TELEMETRY_IDS.shots} />
						<Row label="Glyphs destroyed" id={TELEMETRY_IDS.broken} />
						<Row label="Orbs collected" id={TELEMETRY_IDS.grabs} />
						<Row label="Hull" id={TELEMETRY_IDS.hull} />
						<Row label="Gun" id={TELEMETRY_IDS.gunMode} />
						<Row label="Enemy speed" id={TELEMETRY_IDS.enemySpeed} />
						<Row label="Highest level" id={TELEMETRY_IDS.maxLevel} />

						<div className="pt-3">
							<div
								className={`${rowClass} border-b border-line/60 pb-1.5 text-faint`}
							>
								<span>Enemies</span>
								<span className="tabular-nums">now / session / all time</span>
							</div>
							{ENEMY_LEVEL_NUMBERS.map((level) => {
								const ids = enemyRowIds(level);
								return (
									<div key={level} className={`${rowClass} pt-1.5`}>
										<span className={labelClass}>Level {level}</span>
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
					</div>

					<div className="space-y-4 text-sm leading-relaxed text-muted">
						<p className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
							WASD · click to fire · 1–4 guns · V boundaries · Esc to stop
						</p>
						{/*
						 * What this is, in the same register as the rest of the site,
						 * and with the same rule: no number here that was not measured.
						 * The panel sits outside the content schema, which makes it the
						 * easiest place in the codebase to break that rule without a
						 * test catching it.
						 */}
						<p>
							The overlay reads this page as its level. It classifies every
							element as an obstacle from computed style — background alpha,
							background image, box shadow, border — and walks text nodes with a
							Range to get per-character rectangles, so the collision world is
							the layout itself rather than a description of it.
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
							before it is made and reversed when you switch the overlay off,
							because React will not put back a text node deleted underneath it.
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
				</div>
			</div>
		</section>
	);
}

// Default export as well: ArcadeMount reaches it through React.lazy, so the
// panel's markup travels with the arcade chunk rather than the main one.
export default ArcadePanel;
