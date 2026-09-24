import { ENEMY_LEVEL_NUMBERS } from "@/arcade/storage";

/**
 * The ids the engine writes into, and the panel renders.
 *
 * Separate from telemetry.ts so ArcadePanel.tsx can import them without
 * dragging the writer — and through it the rest of the engine — into the main
 * bundle. The ids live in one place rather than two so the panel and the game
 * cannot drift into a display that silently shows nothing; ArcadePanel.test.tsx
 * asserts every id below is present in the rendered markup.
 */
export const TELEMETRY_IDS = {
	shots: "arcade-shots",
	broken: "arcade-broken",
	grabs: "arcade-grabs",
	hull: "arcade-hull",
	gunMode: "arcade-gun-mode",
	enemySpeed: "arcade-enemy-speed",
	maxLevel: "arcade-max-level",
} as const;

export const enemyRowIds = (level: number) => ({
	current: `arcade-enemy-${level}-current`,
	session: `arcade-enemy-${level}-session`,
	allTime: `arcade-enemy-${level}-all-time`,
});

/** Flat list, for the test that holds the panel and the engine together. */
export const TELEMETRY_ID_LIST: string[] = [
	...Object.values(TELEMETRY_IDS),
	...ENEMY_LEVEL_NUMBERS.flatMap((level) => Object.values(enemyRowIds(level))),
];
