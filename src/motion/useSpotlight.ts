import { type PointerEvent, useCallback } from "react";

/**
 * Feeds the pointer position to the `.spotlight` card under it, as
 * --spot-x / --spot-y, for the radial highlight drawn in index.css.
 *
 * One handler on the grid rather than one per card: a delegated listener costs
 * the same however many cards there are. Mouse only — on touch there is no
 * hover for the highlight to follow.
 */
export function useSpotlight() {
	return useCallback((event: PointerEvent<HTMLElement>) => {
		if (event.pointerType !== "mouse") return;
		const card = (event.target as Element).closest<HTMLElement>(".spotlight");
		if (!card || !event.currentTarget.contains(card)) return;
		const rect = card.getBoundingClientRect();
		card.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
		card.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
	}, []);
}
