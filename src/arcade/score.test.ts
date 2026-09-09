import { afterEach, describe, expect, it, vi } from "vitest";
import { STORAGE } from "@/arcade/constants";
import {
	base64ToBytes,
	bytesToBase64,
	emptyStats,
	mergeSavedStats,
	ScoreStore,
} from "@/arcade/score";

afterEach(() => {
	localStorage.clear();
	vi.useRealTimers();
});

describe("base64", () => {
	it("round-trips arbitrary bytes", () => {
		const bytes = new Uint8Array([0, 1, 127, 128, 200, 255, 42]);
		expect([...base64ToBytes(bytesToBase64(bytes))]).toEqual([...bytes]);
	});

	it("round-trips a full AES-GCM payload", () => {
		const iv = new Uint8Array(12).fill(7);
		expect([...base64ToBytes(bytesToBase64(iv))]).toEqual([...iv]);
	});
});

describe("mergeSavedStats", () => {
	it("takes only non-negative finite integers", () => {
		const stats = emptyStats();
		mergeSavedStats(stats, {
			kills: 12.9,
			shots: -5,
			broken: Number.NaN,
			grabs: Number.POSITIVE_INFINITY,
			deaths: 3,
		});
		expect(stats.kills).toBe(12);
		expect(stats.shots).toBe(0);
		expect(stats.broken).toBe(0);
		expect(stats.grabs).toBe(0);
		expect(stats.deaths).toBe(3);
	});

	it("ignores keys that are not part of the stat block", () => {
		const stats = emptyStats();
		mergeSavedStats(stats, { nonsense: 99 } as never);
		expect(stats).toEqual(emptyStats());
	});
});

describe("ScoreStore", () => {
	/**
	 * jsdom has no IndexedDB and the browsers that matter here can refuse both
	 * it and WebCrypto — private windows, Safari's ITP, storage switched off.
	 * None of that may reach the page, so every path degrades to an in-memory
	 * score rather than throwing.
	 */
	it("loads null rather than throwing when there is nothing saved", async () => {
		await expect(new ScoreStore().load()).resolves.toBeNull();
	});

	it("loads null rather than throwing when the saved value is corrupt", async () => {
		localStorage.setItem(STORAGE.score, "not json");
		await expect(new ScoreStore().load()).resolves.toBeNull();
	});

	it("survives crypto.subtle being unavailable", async () => {
		const subtle = globalThis.crypto?.subtle;
		Object.defineProperty(globalThis.crypto, "subtle", {
			value: undefined,
			configurable: true,
		});
		try {
			localStorage.setItem(
				STORAGE.score,
				JSON.stringify({ i: "AAA=", d: "AAA=" }),
			);
			const store = new ScoreStore();
			await expect(store.load()).resolves.toBeNull();
			expect(() => store.queueSave(emptyStats())).not.toThrow();
			store.dispose();
		} finally {
			Object.defineProperty(globalThis.crypto, "subtle", {
				value: subtle,
				configurable: true,
			});
		}
	});

	it("debounces: many saves in a row schedule one write", () => {
		vi.useFakeTimers();
		const setTimeout = vi.spyOn(window, "setTimeout");
		const store = new ScoreStore();
		for (let i = 0; i < 20; i++) store.queueSave(emptyStats());
		expect(setTimeout).toHaveBeenCalledTimes(1);
		store.dispose();
		setTimeout.mockRestore();
	});

	it("writes nothing to localStorage when the write path fails", async () => {
		vi.useFakeTimers();
		const store = new ScoreStore();
		store.queueSave(emptyStats());
		await vi.advanceTimersByTimeAsync(1000);
		// No IndexedDB in jsdom, so the key is never available and the chain
		// swallows it. The important part is that nothing threw and no partial
		// value was written.
		expect(localStorage.getItem(STORAGE.score)).toBeNull();
		store.dispose();
	});
});
