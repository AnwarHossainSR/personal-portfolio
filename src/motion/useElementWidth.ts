import { type RefObject, useEffect, useRef, useState } from "react";

/**
 * The rendered width of an element, kept current with a ResizeObserver.
 *
 * For charts that draw in pixels rather than scaling a fixed viewBox: a
 * 560-unit SVG squeezed onto a phone shrinks its 12px labels to 6px, which
 * nobody can read. Starts at `fallback` so the first render (and any
 * environment without ResizeObserver) still draws something sensible.
 */
export function useElementWidth<T extends Element>(
	fallback: number,
): [RefObject<T | null>, number] {
	const ref = useRef<T | null>(null);
	const [width, setWidth] = useState(fallback);

	useEffect(() => {
		const node = ref.current;
		if (!node || typeof ResizeObserver === "undefined") return;
		const observer = new ResizeObserver(([entry]) => {
			const next = Math.round(entry.contentRect.width);
			if (next > 0) setWidth(next);
		});
		observer.observe(node);
		return () => observer.disconnect();
	}, []);

	return [ref, width];
}
