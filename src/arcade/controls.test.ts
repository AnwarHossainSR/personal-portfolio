import { describe, expect, it } from "vitest";
import { LEFT_BEHIND_MARGIN, leftBehind, movementKey } from "@/arcade/controls";

describe("movementKey", () => {
	it("reads WASD in either case", () => {
		expect(movementKey("w")).toBe("w");
		expect(movementKey("A")).toBe("a");
	});

	it("treats the arrow keys as WASD", () => {
		expect(movementKey("ArrowUp")).toBe("w");
		expect(movementKey("ArrowLeft")).toBe("a");
		expect(movementKey("ArrowDown")).toBe("s");
		expect(movementKey("ArrowRight")).toBe("d");
	});

	it("ignores every other key, including the game's own", () => {
		for (const key of ["f", "r", "v", "1", "Escape", " ", ""]) {
			expect(movementKey(key)).toBeNull();
		}
	});
});

describe("leftBehind", () => {
	const height = 900;

	it("is false anywhere on screen", () => {
		for (const y of [0, 450, 900]) expect(leftBehind(y, height)).toBe(false);
	});

	it("allows a little drift past either edge", () => {
		expect(leftBehind(-LEFT_BEHIND_MARGIN, height)).toBe(false);
		expect(leftBehind(height + LEFT_BEHIND_MARGIN, height)).toBe(false);
	});

	it("is true once the reader has scrolled away from the rocket", () => {
		// The case that made the game look dead: scrolled to the contact
		// section with the rocket still up in the hero.
		expect(leftBehind(-4289, height)).toBe(true);
		expect(leftBehind(height + LEFT_BEHIND_MARGIN + 1, height)).toBe(true);
	});
});
