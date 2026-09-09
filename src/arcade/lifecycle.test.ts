import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { destroyChar, destroyElement } from "@/arcade/bullets";
import { Game } from "@/arcade/engine";
import { canRun, start, stop } from "@/arcade/index";
import { UndoLog } from "@/arcade/undo";

/**
 * The lifecycle contract, which is the part of this port that has no
 * counterpart in the Astro original. Everything here is about `stop()` being
 * real: no listener left on the document, no element left in the body, and no
 * hole left in the page.
 */

const realMatchMedia = window.matchMedia;

/** Answers the engine's two gate queries the way a desktop browser would. */
function openGate() {
	window.matchMedia = ((query: string) =>
		({
			matches: query.includes("pointer: fine"),
			media: query,
			onchange: null,
			addListener: () => {},
			removeListener: () => {},
			addEventListener: () => {},
			removeEventListener: () => {},
			dispatchEvent: () => false,
		}) as MediaQueryList) as typeof window.matchMedia;
}

beforeEach(() => {
	document.body.innerHTML = "";
	document.documentElement.className = "";
});

afterEach(() => {
	stop();
	window.matchMedia = realMatchMedia;
	vi.useRealTimers();
});

describe("the media gate", () => {
	it("is shut under the test stub, which answers false to every query", () => {
		// src/test/setup.ts stubs matchMedia to match nothing. That single fact
		// is what keeps a 2,000-line game engine out of every other test in
		// this suite, so it is asserted rather than assumed.
		expect(canRun()).toBe(false);
	});

	it("start() with the gate shut creates no DOM and binds no listeners", () => {
		const addEventListener = vi.spyOn(document, "addEventListener");
		start();
		expect(document.body.innerHTML).toBe("");
		expect(document.getElementById("arcade-root")).toBeNull();
		expect(addEventListener).not.toHaveBeenCalled();
		addEventListener.mockRestore();
	});

	it("start() is refused under prefers-reduced-motion", () => {
		window.matchMedia = ((query: string) =>
			({
				matches: true,
				media: query,
				onchange: null,
				addListener: () => {},
				removeListener: () => {},
				addEventListener: () => {},
				removeEventListener: () => {},
				dispatchEvent: () => false,
			}) as MediaQueryList) as typeof window.matchMedia;
		expect(canRun()).toBe(false);
		start();
		expect(document.getElementById("arcade-root")).toBeNull();
	});
});

describe("start/stop with the gate open", () => {
	it("leaves the body and the html class list exactly as it found them", () => {
		openGate();
		document.body.innerHTML =
			"<main><h1>Build backends</h1><p>Keep it running.</p></main>";
		const before = document.body.innerHTML;

		start();
		expect(document.getElementById("arcade-root")).not.toBeNull();
		expect(document.documentElement.classList).toContain("arcade-no-select");

		stop();
		expect(document.body.innerHTML).toBe(before);
		expect(document.documentElement.className).toBe("");
		expect(document.getElementById("arcade-root")).toBeNull();
	});

	it("unbinds every listener it bound", () => {
		openGate();
		const added = vi.spyOn(document, "addEventListener");
		const removed = vi.spyOn(document, "removeEventListener");
		start();
		const addedTypes = added.mock.calls.map((call) => call[0]).sort();
		stop();
		const removedTypes = removed.mock.calls.map((call) => call[0]).sort();
		expect(addedTypes.length).toBeGreaterThan(0);
		expect(removedTypes).toEqual(addedTypes);
		added.mockRestore();
		removed.mockRestore();
	});

	it("is idempotent in both directions", () => {
		openGate();
		start();
		start();
		expect(document.querySelectorAll("#arcade-root")).toHaveLength(1);
		stop();
		stop();
		expect(document.getElementById("arcade-root")).toBeNull();
	});

	it("marks its root aria-hidden so nothing it injects reaches the a11y tree", () => {
		openGate();
		start();
		expect(
			document.getElementById("arcade-root")?.getAttribute("aria-hidden"),
		).toBe("true");
	});
});

describe("destruction round-trip", () => {
	function fixture() {
		document.body.innerHTML = '<p id="line">Build backends</p>';
		const root = document.createElement("div");
		root.id = "arcade-root";
		document.body.appendChild(root);
		return { root, game: new Game(root) };
	}

	it("stop() puts a destroyed glyph back", () => {
		const { game } = fixture();
		const node = document.getElementById("line")?.firstChild as Text;
		expect(node.data).toBe("Build backends");

		destroyChar(game, {
			node,
			index: 0,
			len: 1,
			rect: { left: 0, top: 0, right: 8, bottom: 12 },
		});
		const line = document.getElementById("line") as HTMLElement;
		// The character is hidden in a placeholder span rather than deleted, so
		// the line keeps its width and the paragraph below it does not reflow.
		// textContent is therefore unchanged; what changed is what is painted.
		const blank = line.querySelector(".arcade-char-blank") as HTMLElement;
		expect(blank).not.toBeNull();
		expect(blank.textContent).toBe("B");
		expect(blank.style.visibility).toBe("hidden");
		expect(node.data).toBe("");

		game.stop();
		expect(line.querySelector(".arcade-char-blank")).toBeNull();
		expect(line.textContent).toBe("Build backends");
	});

	it("stop() puts a destroyed element back", () => {
		const { game } = fixture();
		const el = document.getElementById("line") as HTMLElement;
		destroyElement(game, el);
		expect(el.style.visibility).toBe("hidden");
		expect(el.dataset.arcadeDestroyed).toBe("1");

		game.stop();
		expect(el.style.visibility).toBe("");
		expect(el.dataset.arcadeDestroyed).toBeUndefined();
	});

	it("refuses to destroy anything a reader can operate", () => {
		document.body.innerHTML = '<nav><a id="link" href="/">Work</a></nav>';
		const root = document.createElement("div");
		root.id = "arcade-root";
		document.body.appendChild(root);
		const game = new Game(root);
		const link = document.getElementById("link") as HTMLElement;

		destroyElement(game, link);
		expect(link.style.visibility).toBe("");

		destroyChar(game, {
			node: link.firstChild as Text,
			index: 0,
			len: 1,
			rect: { left: 0, top: 0, right: 8, bottom: 12 },
		});
		expect(link.textContent).toBe("Work");
		game.stop();
	});
});

describe("UndoLog", () => {
	it("runs a reversal once, whichever path reaches it first", () => {
		vi.useFakeTimers();
		const log = new UndoLog();
		const restore = vi.fn();
		log.register(restore, 1000);
		log.restoreAll();
		vi.advanceTimersByTime(5000);
		expect(restore).toHaveBeenCalledTimes(1);
	});

	it("empties itself as entries expire, so a long session stays bounded", () => {
		vi.useFakeTimers();
		const log = new UndoLog();
		for (let i = 0; i < 50; i++) log.register(() => {}, 100);
		expect(log.size).toBe(50);
		vi.advanceTimersByTime(200);
		expect(log.size).toBe(0);
	});

	it("reverses newest first", () => {
		const log = new UndoLog();
		const order: number[] = [];
		log.register(() => order.push(1), 10_000);
		log.register(() => order.push(2), 10_000);
		log.restoreAll();
		expect(order).toEqual([2, 1]);
	});

	it("keeps going when one reversal throws", () => {
		const log = new UndoLog();
		const survivor = vi.fn();
		log.register(survivor, 10_000);
		log.register(() => {
			throw new Error("node is gone");
		}, 10_000);
		expect(() => log.restoreAll()).not.toThrow();
		expect(survivor).toHaveBeenCalledTimes(1);
	});
});
