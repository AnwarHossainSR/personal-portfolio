import { lazy, Suspense, useEffect, useSyncExternalStore } from "react";
import {
	getPaletteServerSnapshot,
	isPaletteOpen,
	setPaletteOpen,
	subscribePalette,
} from "@/components/command/store";

/*
 * The dialog itself is lazy. It needs every case study's title to build its
 * list, and importing the case studies here would pull their full text into
 * the chunk every reader downloads, for a control most readers never open.
 */
const CommandPalette = lazy(
	() => import("@/components/command/CommandPalette"),
);

/** Owns the shortcut and mounts the palette while it is open. */
export function CommandMount() {
	const open = useSyncExternalStore(
		subscribePalette,
		isPaletteOpen,
		getPaletteServerSnapshot,
	);

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (!(event.metaKey || event.ctrlKey)) return;
			if (event.key.toLowerCase() !== "k") return;
			event.preventDefault();
			setPaletteOpen(!isPaletteOpen());
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, []);

	if (!open) return null;
	return (
		<Suspense fallback={null}>
			<CommandPalette onClose={() => setPaletteOpen(false)} />
		</Suspense>
	);
}
