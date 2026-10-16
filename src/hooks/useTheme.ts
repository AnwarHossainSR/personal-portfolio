import { useSyncExternalStore } from "react";

export type Theme = "dark" | "light" | "system";

/*
 * Bumping this resets every returning visitor to DEFAULT_THEME once, which is
 * how the switch to a dark-first design reaches people who stored "light"
 * under the previous one. The pre-paint script in index.html reads the same
 * two keys and must be kept in step.
 */
export const THEME_DEFAULT_VERSION = "dark-v2";
const DEFAULT_THEME: Theme = "dark";
const THEME_KEY = "theme";
const VERSION_KEY = "theme-default-version";

/** The browser chrome colour for each ground — the paper tokens, as hex. */
const THEME_COLOR = { dark: "#0c0a08", light: "#faf9f6" } as const;

function isTheme(value: unknown): value is Theme {
	return value === "dark" || value === "light" || value === "system";
}

function readStoredTheme(): Theme {
	try {
		if (localStorage.getItem(VERSION_KEY) !== THEME_DEFAULT_VERSION) {
			localStorage.setItem(THEME_KEY, DEFAULT_THEME);
			localStorage.setItem(VERSION_KEY, THEME_DEFAULT_VERSION);
			return DEFAULT_THEME;
		}
		const stored = localStorage.getItem(THEME_KEY);
		return isTheme(stored) ? stored : DEFAULT_THEME;
	} catch {
		// Storage can throw outright (Safari private mode, blocked cookies).
		return DEFAULT_THEME;
	}
}

export function resolveTheme(theme: Theme): "dark" | "light" {
	if (theme !== "system") return theme;
	if (typeof window === "undefined" || !window.matchMedia) return "dark";
	return window.matchMedia("(prefers-color-scheme: light)").matches
		? "light"
		: "dark";
}

function applyTheme(theme: Theme) {
	resolved = resolveTheme(theme);
	if (typeof document === "undefined") return;
	const root = document.documentElement;
	root.classList.remove("light", "dark");
	root.classList.add(resolved);
	document
		.querySelector('meta[name="theme-color"]')
		?.setAttribute("content", THEME_COLOR[resolved]);
}

/*
 * One store for the whole page. The previous hook kept the theme in component
 * state, so the desktop and mobile toggles each held their own copy and the
 * second one went stale the moment the first was clicked.
 */
let current: Theme | null = null;
/** What `current` paints as. Differs from it only while it is "system". */
let resolved: "dark" | "light" = resolveTheme(DEFAULT_THEME);
const listeners = new Set<() => void>();

function getTheme(): Theme {
	if (current === null) {
		current = readStoredTheme();
		applyTheme(current);
	}
	return current;
}

function getServerTheme(): Theme {
	return DEFAULT_THEME;
}

function getResolved(): "dark" | "light" {
	getTheme();
	return resolved;
}

function getServerResolved(): "dark" | "light" {
	return "dark";
}

function notify() {
	for (const listener of listeners) listener();
}

/*
 * While the choice is "system", an OS switch between light and dark has to
 * repaint the page — the stored value has not changed, but what it means has.
 * Listened for only while something is subscribed.
 */
let media: MediaQueryList | null = null;
function onSystemChange() {
	if (current !== "system") return;
	applyTheme("system");
	notify();
}

function subscribe(listener: () => void) {
	listeners.add(listener);
	if (!media && typeof window !== "undefined" && window.matchMedia) {
		media = window.matchMedia("(prefers-color-scheme: light)");
		media.addEventListener?.("change", onSystemChange);
	}
	return () => {
		listeners.delete(listener);
		if (listeners.size === 0) {
			media?.removeEventListener?.("change", onSystemChange);
			media = null;
		}
	};
}

export function setTheme(theme: Theme) {
	current = theme;
	try {
		localStorage.setItem(THEME_KEY, theme);
		localStorage.setItem(VERSION_KEY, THEME_DEFAULT_VERSION);
	} catch {
		// The choice still applies for this visit.
	}
	applyTheme(theme);
	notify();
}

export function toggleTheme() {
	setTheme(resolveTheme(getTheme()) === "light" ? "dark" : "light");
}

export function useTheme() {
	const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);
	const resolvedTheme = useSyncExternalStore(
		subscribe,
		getResolved,
		getServerResolved,
	);
	return { theme, resolvedTheme, setTheme, toggleTheme };
}
