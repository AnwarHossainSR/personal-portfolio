import { type RefObject, useEffect, useRef, useState } from "react";

/** Same as Reveal: an observer that never fires must not trap anything. */
const FALLBACK_MS = 1200;

/**
 * True once the element has been on screen, and true for good after that —
 * an entrance plays once. Used where the animation lives inside the element
 * (columns growing, a strap wiping in) rather than on the element itself,
 * which is Reveal's job.
 */
export function useInView<T extends Element>(): [RefObject<T | null>, boolean] {
	const ref = useRef<T | null>(null);
	const [inView, setInView] = useState(false);

	useEffect(() => {
		const node = ref.current;
		if (!node || inView) return;
		const fallback = window.setTimeout(() => setInView(true), FALLBACK_MS);
		if (typeof IntersectionObserver === "undefined") {
			setInView(true);
			return () => window.clearTimeout(fallback);
		}
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					setInView(true);
					observer.disconnect();
				}
			},
			{ rootMargin: "0px 0px -80px 0px" },
		);
		observer.observe(node);
		return () => {
			window.clearTimeout(fallback);
			observer.disconnect();
		};
	}, [inView]);

	return [ref, inView];
}
