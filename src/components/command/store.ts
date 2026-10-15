/**
 * Whether the command palette is open, held outside React so that anything —
 * the header trigger, the keyboard shortcut, a hint in the footer — can open
 * it without the palette's own code being in the main chunk. Same shape as
 * the arcade's on/off store in src/arcade/mode.ts.
 */
let open = false;
const listeners = new Set<() => void>();

export function isPaletteOpen(): boolean {
	return open;
}

export function getPaletteServerSnapshot(): boolean {
	return false;
}

export function setPaletteOpen(next: boolean): void {
	if (open === next) return;
	open = next;
	for (const listener of listeners) listener();
}

export function subscribePalette(listener: () => void): () => void {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}
