import { ENEMY_LEVEL_NUMBERS, type GunMode } from "@/arcade/constants";
import type { Stats } from "@/arcade/score";

/**
 * The bridge between the engine and the panel in ArcadePanel.tsx.
 *
 * The panel is static markup React renders once and never touches again; the
 * engine writes into it by id, at whatever rate the game runs. That split is
 * deliberate — routing a per-frame counter through React state would re-render
 * a component sixty times a second to change one text node, and would put the
 * game's frame budget at the mercy of the reconciler.
 *
 * The ids live here rather than in the panel so a test can hold the two
 * together: ArcadePanel.test.tsx asserts every id below is present in the
 * rendered markup, which is what stops the panel and the engine drifting into
 * a display that silently shows nothing.
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

export class Telemetry {
	/** Last value written per id, so an unchanged count costs no DOM write. */
	private readonly rendered = new Map<string, string>();
	private readonly nodes = new Map<string, HTMLElement | null>();

	private write(id: string, value: string): void {
		if (this.rendered.get(id) === value) return;
		let node = this.nodes.get(id);
		if (node === undefined) {
			node = document.getElementById(id);
			this.nodes.set(id, node);
		}
		if (!node) return;
		this.rendered.set(id, value);
		node.textContent = value;
	}

	/** The panel is mounted and unmounted independently of the engine. */
	forget(): void {
		this.nodes.clear();
		this.rendered.clear();
	}

	stats(stats: Stats): void {
		this.write(TELEMETRY_IDS.shots, String(stats.shots));
		this.write(TELEMETRY_IDS.broken, String(stats.broken));
		this.write(TELEMETRY_IDS.grabs, String(stats.grabs));
		this.write(TELEMETRY_IDS.maxLevel, String(stats.maxLevel));
		for (const level of ENEMY_LEVEL_NUMBERS) {
			const ids = enemyRowIds(level);
			const key = `level${level}Kills` as keyof Stats;
			this.write(ids.allTime, String(stats[key] ?? 0));
		}
	}

	hull(health: number): void {
		this.write(TELEMETRY_IDS.hull, String(health));
	}

	gunMode(mode: GunMode): void {
		this.write(TELEMETRY_IDS.gunMode, mode);
	}

	enemies(
		counts: Record<number, number>,
		sessionKills: Record<number, number>,
		speedMultiplier: number,
	): void {
		for (const level of ENEMY_LEVEL_NUMBERS) {
			const ids = enemyRowIds(level);
			this.write(ids.current, String(counts[level] ?? 0));
			this.write(ids.session, String(sessionKills[level] ?? 0));
		}
		this.write(TELEMETRY_IDS.enemySpeed, `${speedMultiplier.toFixed(1)}x`);
	}
}
