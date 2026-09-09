import { alpha, clamp, TAU } from "@/arcade/math";

/**
 * The DOM read as collision geometry.
 *
 * Everything here is pure with respect to the game: it measures the page and
 * returns rectangles. Nothing in this module mutates the document — the
 * destruction path lives in bullets.ts, behind the undo log in engine.ts.
 */

export interface Rect {
	left: number;
	top: number;
	right: number;
	bottom: number;
}

export interface Glyph {
	node: Text;
	index: number;
	len: number;
	rect: Rect;
}

export interface Push {
	nx: number;
	ny: number;
	push: number;
}

/**
 * Elements whose text can be shot. Copied from the reference; the omissions
 * matter as much as the entries — no TD/TH, so a table stays readable, and no
 * generic container tags, so one shot at a <div> cannot take a whole section
 * of text with it.
 */
const TEXT_TAGS = new Set([
	"H1",
	"H2",
	"H3",
	"H4",
	"H5",
	"H6",
	"P",
	"A",
	"SPAN",
	"STRONG",
	"EM",
	"B",
	"I",
	"SMALL",
	"LABEL",
	"LI",
	"DT",
	"DD",
	"BLOCKQUOTE",
	"FIGCAPTION",
	"CODE",
	"PRE",
	"BUTTON",
]);

const ALWAYS_SOLID = new Set([
	"IMG",
	"SVG",
	"VIDEO",
	"CANVAS",
	"PICTURE",
	"IFRAME",
	"INPUT",
	"TEXTAREA",
	"SELECT",
]);

/**
 * Anything a reader can operate, plus the site chrome. The reference guards
 * only the pointer-down path with this; here it also gates bullet impacts, so
 * a stray shot can never remove a link, a control, or the skip target.
 */
export const KEEP_SELECTOR =
	"a, button, input, textarea, select, label, nav, [contenteditable], [data-arcade-keep]";

export const CHAR_BLANK_CLASS = "arcade-char-blank";

/** A rect measured against the viewport, lifted into document coordinates. */
export function toWorldRect(rect: Rect, scrollY: number): Rect {
	return {
		left: rect.left,
		right: rect.right,
		top: rect.top + scrollY,
		bottom: rect.bottom + scrollY,
	};
}

/** Circle/AABB overlap. Returns the minimum-translation push, or null. */
export function circleRect(
	cx: number,
	cy: number,
	cr: number,
	r: Rect,
): Push | null {
	const nx = clamp(cx, r.left, r.right);
	const ny = clamp(cy, r.top, r.bottom);
	const dx = cx - nx;
	const dy = cy - ny;
	const d2 = dx * dx + dy * dy;
	if (d2 >= cr * cr) return null;
	if (d2 === 0) {
		// Centre is inside the rect: push out through the nearest edge.
		const l = cx - r.left;
		const rr = r.right - cx;
		const t = cy - r.top;
		const b = r.bottom - cy;
		const m = Math.min(l, rr, t, b);
		if (m === l) return { nx: -1, ny: 0, push: cr + l };
		if (m === rr) return { nx: 1, ny: 0, push: cr + rr };
		if (m === t) return { nx: 0, ny: -1, push: cr + t };
		return { nx: 0, ny: 1, push: cr + b };
	}
	const d = Math.sqrt(d2);
	return { nx: dx / d, ny: dy / d, push: cr - d };
}

const finiteRect = (r: DOMRect): boolean =>
	[r.left, r.top, r.right, r.bottom].every(Number.isFinite);

type CaretDocument = Document & {
	caretRangeFromPoint?: (x: number, y: number) => Range | null;
	caretPositionFromPoint?: (
		x: number,
		y: number,
	) => { offsetNode: Node; offset: number } | null;
};

export class World {
	private readonly root: Element;
	/**
	 * Obstacle rects keyed by an 8px screen-space bucket. Without it every
	 * bullet step and every enemy steering sample calls
	 * getBoundingClientRect(), which forces layout — enough of those in one
	 * frame and the case-study pages fall off 60 Hz.
	 */
	private readonly cache = new Map<string, Rect | null>();
	private cacheScrollY: number;

	constructor(root: Element) {
		this.root = root;
		this.cacheScrollY = window.scrollY;
	}

	/** Call after any mutation that changes layout. */
	invalidate(): void {
		this.cache.clear();
	}

	/**
	 * Is this element an obstacle? Decided from computed style rather than
	 * from a class list, so the game works on markup it has never seen. The
	 * 0.06 alpha threshold is deliberate: below it a background is a tint
	 * rather than a surface, and treating tints as walls makes the page
	 * unnavigable.
	 */
	solid(el: Element): boolean {
		if (this.root.contains(el)) return false;
		const tag = el.tagName;
		if (tag === "BODY" || tag === "HTML") return false;
		if (ALWAYS_SOLID.has(tag)) return true;
		const cs = getComputedStyle(el);
		if (alpha(cs.backgroundColor) > 0.06) return true;
		// A property the engine cannot read resolves to "" rather than "none"
		// in some environments; an unset background is not a wall.
		if (cs.backgroundImage && cs.backgroundImage !== "none") return true;
		if (cs.boxShadow && cs.boxShadow !== "none") return true;
		// The reference checks width and colour only. Style is checked here as
		// well because a width with `border-style: none` paints nothing — the
		// browser reports the used width as 0 so the reference gets the right
		// answer by accident, and jsdom reports the computed 16px so it gets
		// the wrong one.
		const borderStyle = cs.borderTopStyle;
		if (
			borderStyle &&
			borderStyle !== "none" &&
			borderStyle !== "hidden" &&
			Number.parseFloat(cs.borderTopWidth) > 0 &&
			alpha(cs.borderTopColor) > 0.06
		) {
			return true;
		}
		return false;
	}

	/** The rect of an element's text, or null if it has none worth hitting. */
	textRect(el: Element): DOMRect | null {
		if (this.root.contains(el)) return null;
		if (!TEXT_TAGS.has(el.tagName)) return null;
		if (!el.textContent?.trim()) return null;
		const cs = getComputedStyle(el);
		if (cs.display === "none") return null;
		if (cs.visibility === "hidden") return null;
		if (Number(cs.opacity) < 0.02) return null;
		if (!Number.parseFloat(cs.fontSize)) return null;
		const r = el.getBoundingClientRect();
		if (!finiteRect(r) || r.width <= 0 || r.height <= 0) return null;
		return r;
	}

	/**
	 * Per-character hit test at a viewport point. `cell` widens the ink rect
	 * to the glyph's type cell, so a bullet crossing the whitespace of a line
	 * still counts as a hit on the character it passed.
	 */
	glyphAt(px: number, py: number, cell?: boolean): Glyph | null {
		if (!Number.isFinite(px) || !Number.isFinite(py)) return null;
		let node: Node | null = null;
		let idx = -1;
		const doc = document as CaretDocument;
		if (doc.caretRangeFromPoint) {
			const r = doc.caretRangeFromPoint(px, py);
			if (r) {
				node = r.startContainer;
				idx = r.startOffset;
			}
		} else if (doc.caretPositionFromPoint) {
			const pos = doc.caretPositionFromPoint(px, py);
			if (pos) {
				node = pos.offsetNode;
				idx = pos.offset;
			}
		}
		if (!node || node.nodeType !== 3) return null;
		if (this.root.contains(node)) return null;
		const text = node as Text;
		if (idx < 0 || idx >= text.data.length) return null;

		// A surrogate pair is one glyph. Splitting one leaves two lone
		// surrogates and a page no reload will repair.
		const s = text.data;
		const code = s.charCodeAt(idx);
		let len = 1;
		if (code >= 0xd800 && code <= 0xdbff && idx + 1 < s.length) len = 2;
		else if (code >= 0xdc00 && code <= 0xdfff && idx > 0) {
			idx -= 1;
			len = 2;
		}

		const range = document.createRange();
		range.setStart(text, idx);
		range.setEnd(text, idx + len);
		const rects = range.getClientRects();
		if (!rects.length) return null;
		const ink = rects[0];
		const pad = 2;

		if (!cell) {
			if (
				px < ink.left - pad ||
				px > ink.right + pad ||
				py < ink.top - pad ||
				py > ink.bottom + pad
			) {
				return null;
			}
			return { node: text, index: idx, len, rect: ink };
		}

		const parent = text.parentElement;
		if (!parent) return null;
		const cs = getComputedStyle(parent);
		const fs = Number.parseFloat(cs.fontSize) || 16;
		let lh = Number.parseFloat(cs.lineHeight);
		if (!Number.isFinite(lh) || lh <= 0) lh = fs * 1.4;
		const cw = Math.max(fs * 0.62, ink.width + 3);
		const ch = Math.max(lh * 0.96, ink.height + 4);
		const cx = ink.left + ink.width / 2;
		const cy = ink.top + ink.height / 2;
		const rect = {
			left: cx - cw / 2,
			right: cx + cw / 2,
			top: cy - ch / 2,
			bottom: cy + ch / 2,
		};
		if (
			px < rect.left - pad ||
			px > rect.right + pad ||
			py < rect.top - pad ||
			py > rect.bottom + pad
		) {
			return null;
		}
		return { node: text, index: idx, len, rect };
	}

	elementsAt(px: number, py: number): Element[] {
		// jsdom does not implement elementsFromPoint. The engine never runs
		// there — see the media gate in index.ts — but world.test.ts exercises
		// this module directly.
		if (typeof document.elementsFromPoint !== "function") return [];
		return document.elementsFromPoint(px, py) || [];
	}

	/** Nearest obstacle at a viewport point: a solid element, or text. */
	blockingRect(px: number, py: number): Rect | null {
		if (!Number.isFinite(px) || !Number.isFinite(py)) return null;
		for (const el of this.elementsAt(px, py)) {
			if (el === document.body || el === document.documentElement) continue;
			if (this.root.contains(el)) continue;
			if ((el as HTMLElement).dataset?.arcadeKeep !== undefined) continue;
			if (this.solid(el)) {
				const r = el.getBoundingClientRect();
				if (finiteRect(r)) return r;
			}
			const text = this.textRect(el);
			if (text) return text;
		}
		return null;
	}

	/**
	 * The same query in document coordinates, cached.
	 *
	 * blockingRect takes viewport coordinates; this takes document ones. Every
	 * piece of game state — car, enemies, bullets — is in document space, so
	 * nearly every caller wants this one. The two are named apart rather than
	 * overloaded because confusing them is the single easiest way to break
	 * this port, and the symptom is bullets that miss by exactly the scroll
	 * offset.
	 */
	blockingWorldRect(px: number, py: number): Rect | null {
		if (this.cacheScrollY !== window.scrollY) {
			this.cache.clear();
			this.cacheScrollY = window.scrollY;
		}
		const screenY = py - window.scrollY;
		const key = `${Math.round(px / 8)}:${Math.round(screenY / 8)}`;
		const cached = this.cache.get(key);
		if (cached !== undefined) return cached;
		const rect = this.blockingRect(px, screenY);
		const world = rect ? toWorldRect(rect, window.scrollY) : null;
		this.cache.set(key, world);
		return world;
	}

	probe(px: number, py: number, out: Rect[]): void {
		if (!Number.isFinite(px) || !Number.isFinite(py)) return;
		const r = this.blockingRect(px, py);
		if (r) out.push(r);
	}

	/**
	 * Is a circle at (x, y) in document space free of obstacles? `samples`
	 * trades cost against care: 16 for placement decisions that happen once,
	 * 8 for the per-frame checks.
	 */
	spotClear(
		x: number,
		y: number,
		r: number,
		samples = 16,
		avoidRect?: Rect,
	): boolean {
		if (!Number.isFinite(x) || !Number.isFinite(y)) return false;
		if (avoidRect && circleRect(x, y, r, avoidRect)) return false;
		const points: Array<[number, number]> = [[0, 0]];
		for (let i = 0; i < samples; i++) {
			const a = (i / samples) * TAU;
			points.push([Math.cos(a) * r, Math.sin(a) * r]);
			if (samples > 8 && i % 2 === 0) {
				points.push([Math.cos(a) * r * 0.55, Math.sin(a) * r * 0.55]);
			}
		}
		for (const [ox, oy] of points) {
			const obstacle = this.blockingWorldRect(x + ox, y + oy);
			if (obstacle && circleRect(x, y, r, obstacle)) return false;
		}
		return true;
	}

	/** Straight-line visibility between two document-space points. */
	lineClear(x0: number, y0: number, x1: number, y1: number): boolean {
		const dx = x1 - x0;
		const dy = y1 - y0;
		const dist = Math.hypot(dx, dy);
		const steps = Math.max(1, Math.ceil(Math.min(dist, 480) / 30));
		for (let s = 1; s < steps; s++) {
			if (
				this.blockingWorldRect(x0 + (dx * s) / steps, y0 + (dy * s) / steps)
			) {
				return false;
			}
		}
		return true;
	}
}
