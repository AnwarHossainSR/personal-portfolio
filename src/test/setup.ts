import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
	cleanup();
});

// jsdom does not implement matchMedia; several components read it for theme
// and reduced-motion. Provide a non-matching stub so tests exercise the
// default branch rather than crashing.
if (!window.matchMedia) {
	window.matchMedia = (query: string) =>
		({
			matches: false,
			media: query,
			onchange: null,
			addListener: () => {},
			removeListener: () => {},
			addEventListener: () => {},
			removeEventListener: () => {},
			dispatchEvent: () => false,
		}) as MediaQueryList;
}

// jsdom does not implement IntersectionObserver; AnchorNav (and anything
// else that tracks section visibility) needs a stub so tests don't crash.
if (!("IntersectionObserver" in globalThis)) {
	class NoopIntersectionObserver {
		observe() {}
		unobserve() {}
		disconnect() {}
		takeRecords() {
			return [];
		}
		root = null;
		rootMargin = "";
		thresholds = [];
	}
	// @ts-expect-error — minimal stub for tests
	globalThis.IntersectionObserver = NoopIntersectionObserver;
}
