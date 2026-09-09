import { lazy, Suspense, useEffect, useSyncExternalStore } from "react";
import { canRunArcade } from "@/arcade/gate";
import {
	getArcadeMode,
	getArcadeModeServerSnapshot,
	setArcadeMode,
	subscribeArcadeMode,
} from "@/arcade/mode";

/*
 * Lazy for the same reason the engine is: the panel is only ever on screen
 * while the game is running, so its markup and the telemetry ids belong in the
 * arcade chunk rather than in the bundle every reader downloads.
 */
const ArcadePanel = lazy(() => import("@/components/ArcadePanel"));

/**
 * The whole of React's involvement with the overlay: decide whether it should
 * be running, and tear it down when it should not be.
 *
 * The engine arrives through `await import("@/arcade")` and never through a
 * static import. That single line is what keeps ~25 kB of game — and its
 * stylesheet — out of the main chunk for every reader who never turns it on;
 * src/arcade/budget.test.ts asserts the main entry still imports nothing from
 * src/arcade except the gate and the mode store.
 *
 * Mounted once in Layout, outside <main>, so navigating between the home page
 * and a case study does not unmount and restart the game.
 */
export function ArcadeMount() {
	const enabled = useSyncExternalStore(
		subscribeArcadeMode,
		getArcadeMode,
		getArcadeModeServerSnapshot,
	);
	const available = canRunArcade();
	const running = enabled && available;

	useEffect(() => {
		if (!running) return;

		// The effect can be torn down before the import resolves — a fast
		// toggle, or React's development double-invoke. `cancelled` is what
		// stops a game starting into an unmounted component.
		let cancelled = false;
		let stopGame: (() => void) | null = null;

		void import("@/arcade").then(({ start, stop }) => {
			if (cancelled) return;
			stopGame = stop;
			start();
		});

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key !== "Escape") return;
			setArcadeMode(false);
		};
		document.addEventListener("keydown", onKeyDown);

		return () => {
			cancelled = true;
			document.removeEventListener("keydown", onKeyDown);
			stopGame?.();
		};
	}, [running]);

	if (!running) return null;
	// No fallback: a spinner where a panel is about to be is worse than the
	// half-second of nothing it replaces.
	return (
		<Suspense fallback={null}>
			<ArcadePanel />
		</Suspense>
	);
}
