import { useSyncExternalStore } from "react";
import { canRunArcade } from "@/arcade/gate";
import {
	getArcadeMode,
	getArcadeModeServerSnapshot,
	setArcadeMode,
	subscribeArcadeMode,
} from "@/arcade/mode";
import { cn } from "@/lib/utils";

/**
 * The control that turns the overlay on.
 *
 * In the header rather than the footer: a control nobody finds until they have
 * scrolled the whole page is a control nobody uses, and the header is the one
 * place on this site that is always on screen. Visible rather than hidden
 * behind a key sequence, and labelled in words rather than with an icon,
 * because a reader is entitled to know what they are about to switch on.
 *
 * It renders nothing at all where the game cannot run — touch, coarse pointer,
 * reduced motion — so the control never offers something that would do nothing.
 */
export function ArcadeToggle() {
	const enabled = useSyncExternalStore(
		subscribeArcadeMode,
		getArcadeMode,
		getArcadeModeServerSnapshot,
	);

	if (!canRunArcade()) return null;

	return (
		<button
			type="button"
			aria-pressed={enabled}
			// The visible word stays "Arcade" so it sits in the nav rhythm; the
			// state and the consequence go to the accessible name and the title.
			aria-label={enabled ? "Turn arcade mode off" : "Turn arcade mode on"}
			title={
				enabled
					? "Stop the arcade overlay and restore the page (Esc)"
					: "Turn this page into a playable level. Nothing it breaks is permanent."
			}
			onClick={() => setArcadeMode(!enabled)}
			className={cn(
				"ml-1 rounded border px-3 py-2 text-sm transition-colors",
				enabled
					? "border-accent text-accent"
					: "border-line text-muted hover:text-ink",
			)}
		>
			Arcade
		</button>
	);
}
