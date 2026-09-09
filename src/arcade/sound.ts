import { STORAGE } from "@/arcade/storage";

/**
 * Whether the overlay is allowed to make noise.
 *
 * A store rather than a field on the Audio instance, for the same reason
 * mode.ts exists: the control is in the panel and the sound is in the engine,
 * and one boolean does not justify threading a reference between them.
 *
 * The default is muted, which is a deliberate deviation from the reference.
 * Unprompted audio on a portfolio is worse than silence — but silence with no
 * way out is worse than either, which is what the first cut of this shipped.
 */
let muted = readStored();
const listeners = new Set<() => void>();

function readStored(): boolean {
	try {
		return localStorage.getItem(STORAGE.muted) !== "0";
	} catch {
		return true;
	}
}

export function subscribeMuted(listener: () => void): () => void {
	listeners.add(listener);
	return () => listeners.delete(listener);
}

export function isMuted(): boolean {
	return muted;
}

/** No server here; silent is the safe answer for a first paint. */
export function getMutedServerSnapshot(): boolean {
	return true;
}

export function setMuted(next: boolean): void {
	if (muted === next) return;
	muted = next;
	try {
		localStorage.setItem(STORAGE.muted, next ? "1" : "0");
	} catch {
		// The choice lasts the session instead.
	}
	for (const listener of listeners) listener();
}
