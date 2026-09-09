import type { EnemyConfig, GunMode } from "@/arcade/constants";

/** `parked` before the first spawn, `blasted` between death and respawn. */
export type GameState = "parked" | "drive" | "blasted";

export interface Bullet {
	x: number;
	y: number;
	vx: number;
	vy: number;
	a: number;
	/** Previous position, kept so collision can sweep the segment travelled. */
	previousX: number;
	previousY: number;
	previousA: number;
	curve: number;
	target: Enemy | null;
	el: HTMLElement;
	life: number;
	mode: GunMode;
	/** Glyph keys already hit, so a piercing shot cannot hit one twice. */
	hit: Set<string>;
}

export interface EnemyBullet {
	x: number;
	y: number;
	vx: number;
	vy: number;
	a: number;
	previousX: number;
	previousY: number;
	previousA: number;
	el: HTMLElement;
	life: number;
}

export interface Enemy {
	level: number;
	config: EnemyConfig;
	x: number;
	y: number;
	angle: number;
	speed: number;
	maxSpeed: number;
	health: number;
	maxHealth: number;
	el: HTMLElement;
	healthEl: HTMLElement;
	fireT: number;
}

export interface Pickup {
	x: number;
	y: number;
	el: HTMLElement;
	moveAt: number;
}
