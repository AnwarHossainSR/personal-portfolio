import { useSyncExternalStore } from "react";
import { canRunArcade } from "@/arcade/gate";
import {
	getArcadeMode,
	getArcadeModeServerSnapshot,
	setArcadeMode,
	subscribeArcadeMode,
} from "@/arcade/mode";

/**
 * The control that turns the overlay on.
 *
 * Visible rather than hidden behind a key sequence: a feature nobody can find
 * was not worth building. Plainly labelled rather than an icon, because the
 * reader deserves to know what they are about to switch on — and in the
 * footer rather than the hero, because the hero's job is the positioning line.
 *
 * It renders nothing at all where the game cannot run — touch, coarse pointer,
 * reduced motion — so the control never offers something that would do
 * nothing.
 */
export function ArcadeToggle() {
	const enabled = useSyncExternalStore(
		subscribeArcadeMode,
		getArcadeMode,
		getArcadeModeServerSnapshot,
	);

	if (!canRunArcade()) return null;

	return (
		<div className="flex flex-wrap items-center gap-x-4 gap-y-2">
			<button
				type="button"
				aria-pressed={enabled}
				onClick={() => setArcadeMode(!enabled)}
				className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted underline underline-offset-4 transition-colors hover:text-ink"
			>
				Arcade mode: {enabled ? "on" : "off"}
			</button>
			<p className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
				{enabled
					? "Esc restores the page"
					: "Turns this page into the level. Nothing it breaks is permanent."}
			</p>
		</div>
	);
}
