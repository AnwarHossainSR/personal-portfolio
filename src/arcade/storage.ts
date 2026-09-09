/**
 * localStorage keys, in their own module.
 *
 * Split out of constants.ts because mode.ts needs them and constants.ts also
 * holds the enemy stat blocks. One import of a key would otherwise pull every
 * tuning number in the game into the main bundle — see budget.test.ts.
 *
 * Namespaced and versioned so nothing here can collide with the site's own
 * storage, and so a format change can be a new key rather than a migration.
 */
export const STORAGE = {
	gunMode: "arcade:gun-mode:v1",
	muted: "arcade:muted:v1",
	enabled: "arcade:enabled:v1",
	score: "arcade:sealed-score:v1",
} as const;

/** The levels the game defines. Their stat blocks live in constants.ts. */
export const ENEMY_LEVEL_NUMBERS = [1, 2, 3] as const;
