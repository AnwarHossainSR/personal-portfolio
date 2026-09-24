import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Subscribes to the reduced-motion preference rather than sampling it once.
 * A reader who flips the OS setting mid-visit gets the change without a
 * reload, and anything rendered before `matchMedia` exists (SSR, jsdom)
 * falls back to "motion is fine" rather than crashing.
 */
export function useReducedMotion(): boolean {
	const [reduced, setReduced] = useState(() => {
		if (typeof window === "undefined" || !window.matchMedia) return false;
		return window.matchMedia(QUERY).matches;
	});

	useEffect(() => {
		if (typeof window === "undefined" || !window.matchMedia) return;
		const query = window.matchMedia(QUERY);
		setReduced(query.matches);
		const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
		// Safari < 14 only has the deprecated listener API; both are guarded
		// because the test stub implements them as no-ops.
		if (query.addEventListener) {
			query.addEventListener("change", onChange);
			return () => query.removeEventListener("change", onChange);
		}
		query.addListener(onChange);
		return () => query.removeListener(onChange);
	}, []);

	return reduced;
}
