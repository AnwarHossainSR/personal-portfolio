import { STORAGE } from "@/arcade/storage";

/**
 * Whether the reader has asked for the overlay.
 *
 * A module-level store rather than React context: the control lives in the
 * footer and the mount lives in the layout, and threading a provider through
 * for one boolean would be more machinery than the boolean is worth. Read with
 * useSyncExternalStore so both stay in step without either owning the state.
 *
 * The default is off. That is the decision this whole feature turns on — the
 * reference runs its game unconditionally, and here the reader who most needs
 * to take the case studies seriously is exactly the reader most likely to be
 * mid-sentence when a rocket arrives. The control is visible rather than
 * hidden, so nothing is lost but the ambush.
 */
let enabled = readStored();
const listeners = new Set<() => void>();

function readStored(): boolean {
	try {
		return localStorage.getItem(STORAGE.enabled) === "1";
	} catch {
		return false;
	}
}

export function subscribeArcadeMode(listener: () => void): () => void {
	listeners.add(listener);
	return () => listeners.delete(listener);
}

export function getArcadeMode(): boolean {
	return enabled;
}

/** The server snapshot: there is no server here, and off is the safe answer. */
export function getArcadeModeServerSnapshot(): boolean {
	return false;
}

export function setArcadeMode(next: boolean): void {
	if (enabled === next) return;
	enabled = next;
	try {
		localStorage.setItem(STORAGE.enabled, next ? "1" : "0");
	} catch {
		// The choice lasts the session instead.
	}
	for (const listener of listeners) listener();
}
