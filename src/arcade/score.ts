import {
	SCORE_DB_NAME,
	SCORE_DB_STORE,
	SCORE_KEY_ID,
	STORAGE,
} from "@/arcade/constants";

export interface Stats {
	broken: number;
	kills: number;
	shots: number;
	idle: number;
	respawns: number;
	deaths: number;
	grabs: number;
	maxLevel: number;
	level1Kills: number;
	level2Kills: number;
	level3Kills: number;
}

export function emptyStats(): Stats {
	return {
		broken: 0,
		kills: 0,
		shots: 0,
		idle: 0,
		respawns: 0,
		deaths: 0,
		grabs: 0,
		maxLevel: 1,
		level1Kills: 0,
		level2Kills: 0,
		level3Kills: 0,
	};
}

/**
 * Sealed score persistence: AES-GCM under a non-extractable key held in
 * IndexedDB, ciphertext base64'd into localStorage.
 *
 * Be exact about what this buys. It stops someone editing a number in devtools
 * storage and reloading. It does not stop anyone who opens the console — the
 * page can decrypt, so a visitor can too. It is a lock on the drawer, not a
 * safe, and on a site whose whole premise is not overstating evidence, saying
 * so is the point.
 *
 * Every crypto and IndexedDB call degrades to an in-memory score on failure.
 * Private browsing, disabled storage and Safari's ITP all break this path and
 * none of them may break the page.
 */
export class ScoreStore {
	private keyPromise: Promise<CryptoKey> | null = null;
	private chain: Promise<void> = Promise.resolve();
	private timer = 0;

	private openDb(): Promise<IDBDatabase> {
		return new Promise((resolve, reject) => {
			if (typeof indexedDB === "undefined") {
				reject(new Error("indexeddb unavailable"));
				return;
			}
			const request = indexedDB.open(SCORE_DB_NAME, 1);
			request.onupgradeneeded = () =>
				request.result.createObjectStore(SCORE_DB_STORE);
			request.onsuccess = () => resolve(request.result);
			request.onerror = () =>
				reject(request.error ?? new Error("score database unavailable"));
		});
	}

	private key(): Promise<CryptoKey> {
		if (this.keyPromise) return this.keyPromise;
		this.keyPromise = (async () => {
			if (!globalThis.crypto?.subtle) throw new Error("no webcrypto");
			const db = await this.openDb();
			const existing = await new Promise<CryptoKey | undefined>(
				(resolve, reject) => {
					const request = db
						.transaction(SCORE_DB_STORE, "readonly")
						.objectStore(SCORE_DB_STORE)
						.get(SCORE_KEY_ID);
					request.onsuccess = () => resolve(request.result);
					request.onerror = () => reject(request.error);
				},
			);
			if (existing) {
				db.close();
				return existing;
			}
			// Non-extractable: the key can be used but never read back out,
			// so it cannot be copied to another browser and replayed.
			const key = await crypto.subtle.generateKey(
				{ name: "AES-GCM", length: 256 },
				false,
				["encrypt", "decrypt"],
			);
			await new Promise<void>((resolve, reject) => {
				const tx = db.transaction(SCORE_DB_STORE, "readwrite");
				tx.objectStore(SCORE_DB_STORE).put(key, SCORE_KEY_ID);
				tx.oncomplete = () => resolve();
				tx.onerror = () => reject(tx.error);
			});
			db.close();
			return key;
		})();
		return this.keyPromise;
	}

	/**
	 * Debounced, and serialised through one promise chain. Writing on every
	 * kill would be an IndexedDB transaction per frame during a firefight.
	 */
	queueSave(stats: Stats): void {
		if (this.timer) return;
		this.timer = window.setTimeout(() => {
			this.timer = 0;
			const snapshot = JSON.stringify(stats);
			this.chain = this.chain
				.then(async () => {
					const key = await this.key();
					const iv = crypto.getRandomValues(new Uint8Array(12));
					const encrypted = await crypto.subtle.encrypt(
						{ name: "AES-GCM", iv },
						key,
						new TextEncoder().encode(snapshot),
					);
					localStorage.setItem(
						STORAGE.score,
						JSON.stringify({
							i: bytesToBase64(iv),
							d: bytesToBase64(new Uint8Array(encrypted)),
						}),
					);
				})
				.catch(() => {
					// In-memory score for the rest of the session.
				});
		}, 500);
	}

	/** Returns the saved stats, or null if there are none this browser can read. */
	async load(): Promise<Partial<Stats> | null> {
		try {
			const raw = localStorage.getItem(STORAGE.score);
			if (!raw) return null;
			const saved = JSON.parse(raw) as { i: string; d: string };
			const key = await this.key();
			const decrypted = await crypto.subtle.decrypt(
				{ name: "AES-GCM", iv: base64ToBytes(saved.i) },
				key,
				base64ToBytes(saved.d),
			);
			return JSON.parse(new TextDecoder().decode(decrypted)) as Partial<Stats>;
		} catch {
			return null;
		}
	}

	/**
	 * Drops the stored score.
	 *
	 * The pending write is cancelled first, or the debounced save already in
	 * flight would seal the old numbers back into storage a moment after they
	 * were cleared. The AES key in IndexedDB is deliberately left alone: it is
	 * per-browser rather than per-score, and destroying it would orphan
	 * nothing while costing a key generation on the next save.
	 */
	reset(): void {
		if (this.timer) window.clearTimeout(this.timer);
		this.timer = 0;
		try {
			localStorage.removeItem(STORAGE.score);
		} catch {
			// Nothing was stored to begin with.
		}
	}

	dispose(): void {
		if (this.timer) window.clearTimeout(this.timer);
		this.timer = 0;
	}
}

/** Only non-negative finite integers survive the trip back in. */
export function mergeSavedStats(into: Stats, saved: Partial<Stats>): void {
	for (const name of Object.keys(into) as Array<keyof Stats>) {
		const value = saved[name];
		if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
			into[name] = Math.floor(value);
		}
	}
}

export function bytesToBase64(bytes: Uint8Array): string {
	let binary = "";
	for (const byte of bytes) binary += String.fromCharCode(byte);
	return btoa(binary);
}

export function base64ToBytes(value: string): Uint8Array {
	const binary = atob(value);
	return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}
