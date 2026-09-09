export { ENEMY_LEVEL_NUMBERS, STORAGE } from "@/arcade/storage";

/**
 * Tuning. Every number here is taken from the reference implementation
 * unchanged. They are a set, not a list — the enemy stat blocks in particular
 * are balanced against each other, and re-deriving one produces a game that
 * feels wrong in ways that are expensive to diagnose. Change them only with a
 * controller in hand.
 */

export const TURN_RATE = 3.6;
export const ROCKET_SPEED = 300;
export const CAR_W = 40;
export const CAR_H = 48;
export const CAR_R = 12.5;
export const CAR_CLEAR_R = 28;
export const BLAST_AFTER = 2500;
export const BARREL_LEN = 26;
export const SPREAD = 0.035;

export const BULLET_SPEED = 1650;
export const BULLET_LIFE = 1.4;
export const BULLET_LENGTH = 46;
export const BULLET_CLASH_RADIUS = 10;
export const CURVE_HOMING_RANGE = 900;
export const CURVE_HOMING_TURN_RATE = 4.8;

export const PLAYER_MAX_HEALTH = 3;
export const PLAYER_HIT_COOLDOWN = 450;
export const PLAYER_SPAWN_PROTECTION = 3000;

export const ENEMY_LEVEL_SPAWN_KILLS = 100;

/**
 * Frame-budget guards, not tuning knobs. A 1650 px/s bullet covers ~27 px in
 * one frame at 60 Hz, so collision is stepped rather than sampled at the
 * endpoint; these three caps are what stop a firefight from turning every
 * frame into a few hundred forced layouts.
 */
export const MAX_PLAYER_BULLETS = 36;
export const BULLET_COLLISION_STEP = 16;
export const MAX_BULLET_PROBES_PER_FRAME = 180;
export const MAX_PARTS = 160;

export const RESPAWN_AFTER = 5200;
export const CAR_RESPAWN_DELAY = 5000;
export const CAMERA_ACCEL = 3600;
export const CAMERA_MAX = 1400;

export const SCORE_BALL_FIRST = 2500;
export const SCORE_BALL_DELAY = 1200;
export const SCORE_BALL_RELOCATE_AFTER = 8000;

export const GUN_POWERUP_FIRST_MIN = 7000;
export const GUN_POWERUP_FIRST_MAX = 13000;
export const GUN_POWERUP_NEXT_MIN = 14000;
export const GUN_POWERUP_NEXT_MAX = 26000;
export const GUN_MULTIPLIER_DURATION = 10000;

export const ENEMY_FIRST = 12000;
export const ENEMIES_MAX = 8;
export const ENEMY_ALIVE_STEP = 45000;

/** Explosion debris. Bound to the theme so both grounds get readable colour. */
export const COLORS = [
	"oklch(var(--color-accent))",
	"oklch(var(--color-accent-deep))",
	"oklch(var(--color-ink))",
	"oklch(var(--color-arcade-danger))",
	"oklch(var(--color-paper))",
];

export const GUN_MODES = ["normal", "character", "tetris", "curve"] as const;
export type GunMode = (typeof GUN_MODES)[number];

export const SCORE_DB_NAME = "arcade-score-v1";
export const SCORE_DB_STORE = "keyring";
export const SCORE_KEY_ID = "rocket-score";

export interface EnemyConfig {
	label: string;
	health: number;
	radius: number;
	clearRadius: number;
	contactRadius: number;
	width: number;
	height: number;
	baseSpeed: number;
	speedLimit: number;
	acceleration: number;
	turnRate: number;
	fireRange: number;
	fireDelayMin: number;
	fireDelayMax: number;
	projectileSpread: number;
	projectileMinSpeed: number;
	projectileMaxSpeed: number;
	fireOffsets: number[];
	startSpeedMin: number;
	startSpeedMax: number;
}

export const ENEMY_LEVELS: Record<number, EnemyConfig> = {
	1: {
		label: "level 1",
		health: 1,
		radius: 9,
		clearRadius: 16,
		contactRadius: 24,
		width: 24,
		height: 26,
		baseSpeed: 32,
		speedLimit: 78,
		acceleration: 55,
		turnRate: 1.5,
		fireRange: 760,
		fireDelayMin: 1500,
		fireDelayMax: 2600,
		projectileSpread: 0.07,
		projectileMinSpeed: 500,
		projectileMaxSpeed: 640,
		fireOffsets: [0],
		startSpeedMin: 0.55,
		startSpeedMax: 0.68,
	},
	2: {
		label: "level 2",
		health: 3,
		radius: 17,
		clearRadius: 26,
		contactRadius: 48,
		width: 36,
		height: 39,
		baseSpeed: 92,
		speedLimit: 150,
		acceleration: 90,
		turnRate: 2.2,
		fireRange: 1100,
		fireDelayMin: 800,
		fireDelayMax: 800,
		projectileSpread: 0.025,
		projectileMinSpeed: 680,
		projectileMaxSpeed: 820,
		fireOffsets: [-0.18, 0, 0.18],
		startSpeedMin: 0.58,
		startSpeedMax: 0.58,
	},
	3: {
		label: "level 3",
		health: 9,
		radius: 24,
		clearRadius: 36,
		contactRadius: 68,
		width: 48,
		height: 52,
		baseSpeed: 118,
		speedLimit: 190,
		acceleration: 120,
		turnRate: 2.6,
		fireRange: 1400,
		fireDelayMin: 600,
		fireDelayMax: 600,
		projectileSpread: 0.02,
		projectileMinSpeed: 760,
		projectileMaxSpeed: 920,
		fireOffsets: [-0.32, -0.16, 0, 0.16, 0.32],
		startSpeedMin: 0.58,
		startSpeedMax: 0.58,
	},
};
