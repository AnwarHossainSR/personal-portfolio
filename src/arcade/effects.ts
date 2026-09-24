import { COLORS, MAX_PARTS } from "@/arcade/constants";
import { rand, TAU } from "@/arcade/math";

export interface Part {
	el: HTMLElement;
	x: number;
	y: number;
	vx: number;
	vy: number;
	a: number;
	spin: number;
	life: number;
	t: number;
}

const pick = (): string => COLORS[(Math.random() * COLORS.length) | 0];

/**
 * Particles and one-shot flashes. Everything here is a positioned div inside
 * the arcade root, moved with transforms only — no layout property is ever
 * animated, because a hundred particles that each trigger reflow is a
 * different program from a hundred that do not.
 */
export class Effects {
	private readonly root: HTMLElement;
	private readonly parts: Part[] = [];
	/** Flash timers, so stop() can cancel a flash that has not faded yet. */
	private readonly timers = new Set<number>();

	constructor(root: HTMLElement) {
		this.root = root;
	}

	private transient(className: string, x: number, y: number, life: number) {
		const el = document.createElement("div");
		el.className = className;
		el.style.left = `${x}px`;
		el.style.top = `${y - window.scrollY}px`;
		this.root.appendChild(el);
		const timer = window.setTimeout(() => {
			this.timers.delete(timer);
			el.remove();
		}, life);
		this.timers.add(timer);
	}

	private makePart(size: number, colour: string): HTMLElement {
		const el = document.createElement("div");
		el.className = "arcade-part";
		el.style.width = `${size}px`;
		el.style.height = `${size}px`;
		el.style.background = colour;
		this.root.appendChild(el);
		return el;
	}

	add(part: Part): void {
		this.parts.push(part);
		// Oldest first. A cap that dropped the newest would make a big
		// explosion invisible, which is exactly backwards.
		while (this.parts.length > MAX_PARTS) {
			this.parts.shift()?.el.remove();
		}
	}

	spawn(
		x: number,
		y: number,
		count: number,
		minSize: number,
		maxSize: number,
		minSpeed: number,
		maxSpeed: number,
		colour?: string,
	): void {
		for (let i = 0; i < count; i++) {
			const a = rand(0, TAU);
			const sp = rand(minSpeed, maxSpeed);
			const el = this.makePart(rand(minSize, maxSize), colour ?? pick());
			this.add({
				el,
				x,
				y,
				vx: Math.cos(a) * sp,
				vy: Math.sin(a) * sp,
				a: rand(0, TAU),
				spin: rand(-9, 9),
				life: rand(0.6, 1.3),
				t: 0,
			});
		}
	}

	boomAt(
		x: number,
		y: number,
		count: number,
		minSize: number,
		maxSize: number,
		minSpeed: number,
		maxSpeed: number,
	): void {
		this.transient("arcade-flash", x - 32, y - 32, 700);
		this.spawn(x, y, count, minSize, maxSize, minSpeed, maxSpeed);
	}

	muzzleAt(x: number, y: number): void {
		this.transient("arcade-muzzle", x - 16, y - 16, 240);
	}

	enemyFlashAt(x: number, y: number): void {
		this.transient("arcade-enemyflash", x - 14, y - 14, 400);
	}

	ringAt(x: number, y: number): void {
		this.transient("arcade-boom", x - 18, y - 18, 650);
	}

	update(dt: number): void {
		for (let i = this.parts.length - 1; i >= 0; i--) {
			const p = this.parts[i];
			p.t += dt;
			if (p.t >= p.life) {
				p.el.remove();
				this.parts.splice(i, 1);
				continue;
			}
			p.x += p.vx * dt;
			p.y += p.vy * dt;
			const drag = 0.92 ** (dt * 60);
			p.vx *= drag;
			p.vy *= drag;
			p.a += p.spin * dt;
			const k = 1 - p.t / p.life;
			p.el.style.transform = `translate(${p.x}px, ${p.y - window.scrollY}px) rotate(${p.a}rad) scale(${0.3 + 0.7 * k})`;
			p.el.style.opacity = String(k);
		}
	}

	dispose(): void {
		for (const timer of this.timers) window.clearTimeout(timer);
		this.timers.clear();
		for (const part of this.parts) part.el.remove();
		this.parts.length = 0;
	}
}
