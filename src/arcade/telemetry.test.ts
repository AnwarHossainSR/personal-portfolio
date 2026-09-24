import { afterEach, describe, expect, it } from "vitest";
import { emptyStats } from "@/arcade/score";
import { Telemetry } from "@/arcade/telemetry";
import { TELEMETRY_IDS } from "@/arcade/telemetry-ids";

afterEach(() => {
	document.body.innerHTML = "";
});

describe("Telemetry", () => {
	/**
	 * Regression. The engine starts before the panel exists — ArcadeMount calls
	 * start() in an effect and the panel arrives a tick later through lazy() —
	 * so the first write always misses. Caching that miss froze every counter
	 * at zero for the rest of the session, with a game running perfectly behind
	 * a dead readout and nothing in the console to say so.
	 */
	it("writes to a node that appears after the first attempt", () => {
		const telemetry = new Telemetry();
		const stats = emptyStats();
		stats.shots = 7;
		telemetry.stats(stats); // No panel yet.

		const el = document.createElement("span");
		el.id = TELEMETRY_IDS.shots;
		el.textContent = "0";
		document.body.appendChild(el);

		stats.shots = 8;
		telemetry.stats(stats);
		expect(el.textContent).toBe("8");
	});

	it("follows the node when React replaces the panel", () => {
		const telemetry = new Telemetry();
		const stats = emptyStats();
		const first = document.createElement("span");
		first.id = TELEMETRY_IDS.shots;
		document.body.appendChild(first);
		stats.shots = 1;
		telemetry.stats(stats);
		expect(first.textContent).toBe("1");

		first.remove();
		const second = document.createElement("span");
		second.id = TELEMETRY_IDS.shots;
		document.body.appendChild(second);
		stats.shots = 2;
		telemetry.stats(stats);
		expect(second.textContent).toBe("2");
	});

	it("writes what the DOM does not already say, not what it last remembered", () => {
		// The panel can be collapsed and reopened mid-game, which replaces
		// every row with a fresh element showing its placeholder. A writer that
		// short-circuits on a remembered value would leave it there.
		const telemetry = new Telemetry();
		const el = document.createElement("span");
		el.id = TELEMETRY_IDS.hull;
		document.body.appendChild(el);
		telemetry.hull(3);
		expect(el.textContent).toBe("3");

		el.remove();
		const reopened = document.createElement("span");
		reopened.id = TELEMETRY_IDS.hull;
		reopened.textContent = "0";
		document.body.appendChild(reopened);
		telemetry.hull(3);
		expect(reopened.textContent).toBe("3");
	});
});
