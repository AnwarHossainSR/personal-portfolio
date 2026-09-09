import type { GunMode } from "@/arcade/constants";
import type { Stats } from "@/arcade/score";
import { ENEMY_LEVEL_NUMBERS } from "@/arcade/storage";
import { enemyRowIds, TELEMETRY_IDS } from "@/arcade/telemetry-ids";

/**
 * The bridge between the engine and the panel in ArcadePanel.tsx.
 *
 * The panel is static markup React renders once and never touches again; the
 * engine writes into it by id, at whatever rate the game runs. That split is
 * deliberate — routing a per-frame counter through React state would re-render
 * a component sixty times a second to change one text node, and would put the
 * game's frame budget at the mercy of the reconciler.
 *
 * The ids themselves are in telemetry-ids.ts, which the panel imports on its
 * own so this writer never reaches the main bundle.
 */
export {
	enemyRowIds,
	TELEMETRY_ID_LIST,
	TELEMETRY_IDS,
} from "@/arcade/telemetry-ids";

export class Telemetry {
	/** Last value written per id, so an unchanged count costs no DOM write. */
	private readonly rendered = new Map<string, string>();
	private readonly nodes = new Map<string, HTMLElement>();

	/**
	 * Never caches a miss.
	 *
	 * The engine starts before the panel exists — ArcadeMount calls `start()`
	 * in an effect and the panel arrives a tick later through `lazy()` — and
	 * the panel can be unmounted while the game keeps running. Caching a null
	 * lookup, or a node React has since replaced, silently freezes every
	 * counter at its initial zero with nothing in the console to say so.
	 */
	private node(id: string): HTMLElement | null {
		const cached = this.nodes.get(id);
		if (cached?.isConnected) return cached;
		const found = document.getElementById(id);
		if (found) this.nodes.set(id, found);
		else this.nodes.delete(id);
		return found;
	}

	private write(id: string, value: string): void {
		if (this.rendered.get(id) === value) return;
		const node = this.node(id);
		// No panel on screen: leave `rendered` alone so the value is written
		// the moment one appears.
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
