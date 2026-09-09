import { afterEach, describe, expect, it } from "vitest";
import { alpha, angDiff, clamp } from "@/arcade/math";
import { circleRect, toWorldRect, World } from "@/arcade/world";

/**
 * jsdom reports a zero-size rect for every element and implements no layout,
 * so these tests assert the *classification* rules — which is where the bugs
 * are — and never the measured geometry. Where a rect is needed it is passed
 * in, or stubbed on one element rather than on the prototype.
 */

let root: HTMLElement;

function mount(html: string): HTMLElement {
	document.body.innerHTML = html;
	root = document.createElement("div");
	root.id = "arcade-root";
	document.body.appendChild(root);
	return root;
}

function world(): World {
	return new World(root);
}

afterEach(() => {
	document.body.innerHTML = "";
	window.scrollY = 0;
});

describe("math", () => {
	it("reads the alpha channel of a computed colour", () => {
		expect(alpha("rgba(0, 0, 0, 0)")).toBe(0);
		expect(alpha("rgba(10, 20, 30, 0.5)")).toBe(0.5);
		expect(alpha("rgb(10, 20, 30)")).toBe(1);
		expect(alpha("transparent")).toBe(0);
		expect(alpha("")).toBe(0);
		// A keyword the browser did not resolve counts as opaque: calling a
		// wall empty is worse than calling empty space a wall.
		expect(alpha("rebeccapurple")).toBe(1);
	});

	it("clamps and wraps angles", () => {
		expect(clamp(5, 0, 1)).toBe(1);
		expect(clamp(-5, 0, 1)).toBe(0);
		expect(angDiff(0, Math.PI / 2)).toBeCloseTo(Math.PI / 2);
		// The short way round, not the long one.
		expect(angDiff(0.1, -0.1)).toBeCloseTo(-0.2);
		expect(Math.abs(angDiff(0, Math.PI * 1.9))).toBeLessThan(Math.PI);
	});
});

describe("circleRect", () => {
	const rect = { left: 0, top: 0, right: 100, bottom: 100 };

	it("returns null when the circle is clear of the rect", () => {
		expect(circleRect(200, 200, 10, rect)).toBeNull();
	});

	it("returns a push out of the nearest edge when overlapping", () => {
		const hit = circleRect(-5, 50, 10, rect);
		expect(hit).not.toBeNull();
		expect(hit?.nx).toBeCloseTo(-1);
		expect(hit?.push).toBeCloseTo(5);
	});

	it("pushes out through the nearest edge when the centre is inside", () => {
		const hit = circleRect(10, 50, 5, rect);
		expect(hit).not.toBeNull();
		expect(hit?.nx).toBe(-1);
		expect(hit?.ny).toBe(0);
		expect(hit?.push).toBe(15);
	});

	it("treats exact tangency as no overlap", () => {
		expect(circleRect(110, 50, 10, rect)).toBeNull();
	});
});

describe("toWorldRect", () => {
	it("shifts a viewport rect by exactly the scroll offset", () => {
		const viewport = { left: 10, top: 20, right: 30, bottom: 40 };
		const world = toWorldRect(viewport, 500);
		expect(world.top).toBe(520);
		expect(world.bottom).toBe(540);
		// Only the vertical axis moves; the page does not scroll sideways.
		expect(world.left).toBe(10);
		expect(world.right).toBe(30);
	});
});

describe("World.solid", () => {
	it("is true for an element with a background colour", () => {
		mount('<div id="card" style="background-color: rgb(20, 20, 20)"></div>');
		const el = document.getElementById("card") as HTMLElement;
		expect(world().solid(el)).toBe(true);
	});

	it("is false for a bare span", () => {
		mount("<span id='plain'>text</span>");
		const el = document.getElementById("plain") as HTMLElement;
		expect(world().solid(el)).toBe(false);
	});

	it("is false for a background tint below the alpha threshold", () => {
		mount(
			'<div id="tint" style="background-color: rgba(20, 20, 20, 0.04)"></div>',
		);
		const el = document.getElementById("tint") as HTMLElement;
		expect(world().solid(el)).toBe(false);
	});

	it("is true for a visible top border", () => {
		mount('<div id="ruled" style="border-top: 1px solid rgb(0, 0, 0)"></div>');
		const el = document.getElementById("ruled") as HTMLElement;
		expect(world().solid(el)).toBe(true);
	});

	it("is true for replaced content regardless of style", () => {
		mount('<img id="pic" alt="" src="data:," />');
		const el = document.getElementById("pic") as HTMLElement;
		expect(world().solid(el)).toBe(true);
	});

	it("is false for body, html, and anything inside the arcade root", () => {
		mount("<p>page</p>");
		const inside = document.createElement("div");
		inside.style.backgroundColor = "rgb(0, 0, 0)";
		root.appendChild(inside);
		const w = world();
		expect(w.solid(document.body)).toBe(false);
		expect(w.solid(document.documentElement)).toBe(false);
		expect(w.solid(inside)).toBe(false);
	});
});

describe("World.solidity", () => {
	/**
	 * Regression, and the one real deviation from the reference. Every section
	 * on this site is a full-width block with a one-pixel rule on top. The
	 * reference classifies that as filled, which made the entire document a
	 * wall: the rocket had nowhere to spawn and every bullet died the moment it
	 * left the barrel.
	 */
	function bordered(): HTMLElement {
		mount('<div id="ruled" style="border-top: 1px solid rgb(0, 0, 0)"></div>');
		const el = document.getElementById("ruled") as HTMLElement;
		el.getBoundingClientRect = () =>
			({
				left: 0,
				top: 100,
				right: 800,
				bottom: 500,
				width: 800,
				height: 400,
			}) as DOMRect;
		return el;
	}

	it("classifies a border as an edge, not as a filled box", () => {
		expect(world().solidity(bordered())).toBe("edge");
	});

	it("classifies a painted background as filled", () => {
		mount('<div id="card" style="background-color: rgb(20, 20, 20)"></div>');
		const el = document.getElementById("card") as HTMLElement;
		expect(world().solidity(el)).toBe("filled");
	});

	it("blocks only along the band the border paints", () => {
		const el = bordered();
		const w = world();
		// On the rule.
		expect(w.edgeRectAt(el, 400, 101)).not.toBeNull();
		// In the middle of the box, hundreds of pixels from any border.
		expect(w.edgeRectAt(el, 400, 300)).toBeNull();
	});

	it("gives a hairline rule a band thick enough to collide with", () => {
		const band = world().edgeRectAt(bordered(), 400, 101);
		expect(band).not.toBeNull();
		expect(
			(band as { bottom: number; top: number }).bottom -
				(band as { top: number }).top,
		).toBeGreaterThanOrEqual(4);
	});

	it("treats an element the size of the viewport as ground, not an obstacle", () => {
		// This site paints its paper on a wrapper div rather than on body.
		mount(
			'<div id="ground" style="background-color: rgb(240, 240, 240)"></div>',
		);
		const el = document.getElementById("ground") as HTMLElement;
		el.getBoundingClientRect = () =>
			({
				left: 0,
				top: 0,
				right: window.innerWidth,
				bottom: window.innerHeight * 4,
				width: window.innerWidth,
				height: window.innerHeight * 4,
			}) as DOMRect;
		expect(world().solidity(el)).toBeNull();
	});
});

describe("World.textRect", () => {
	it("is null for a tag that is not a text tag", () => {
		mount('<div id="wrap">words</div>');
		const el = document.getElementById("wrap") as HTMLElement;
		expect(world().textRect(el)).toBeNull();
	});

	it("is null for a text tag with no text", () => {
		mount('<p id="empty">   </p>');
		const el = document.getElementById("empty") as HTMLElement;
		expect(world().textRect(el)).toBeNull();
	});

	it("is null for hidden text", () => {
		mount('<p id="gone" style="visibility: hidden">words</p>');
		const el = document.getElementById("gone") as HTMLElement;
		expect(world().textRect(el)).toBeNull();
	});

	it("returns the measured rect for visible text", () => {
		mount('<p id="line">words</p>');
		const el = document.getElementById("line") as HTMLElement;
		// jsdom measures nothing, so the rect is supplied on this one element.
		el.getBoundingClientRect = () =>
			({
				left: 4,
				top: 8,
				right: 120,
				bottom: 26,
				width: 116,
				height: 18,
			}) as DOMRect;
		expect(world().textRect(el)?.top).toBe(8);
	});
});

describe("World.blockingWorldRect", () => {
	it("differs from blockingRect by exactly window.scrollY", () => {
		mount('<div id="card" style="background-color: rgb(20, 20, 20)"></div>');
		const el = document.getElementById("card") as HTMLElement;
		el.getBoundingClientRect = () =>
			({
				left: 0,
				top: 100,
				right: 200,
				bottom: 160,
				width: 200,
				height: 60,
			}) as DOMRect;
		// elementsFromPoint is not implemented in jsdom; supply the one answer
		// this test needs rather than a global layout fake.
		document.elementsFromPoint = () => [el];

		const w = world();
		const viewport = w.blockingRect(10, 120);
		expect(viewport?.top).toBe(100);

		window.scrollY = 400;
		const documentSpace = w.blockingWorldRect(10, 520);
		expect(documentSpace?.top).toBe(100 + 400);
		expect(documentSpace?.bottom).toBe(160 + 400);
	});

	it("skips elements marked data-arcade-keep", () => {
		mount(
			'<div id="panel" data-arcade-keep style="background: rgb(0,0,0)"></div>',
		);
		const el = document.getElementById("panel") as HTMLElement;
		document.elementsFromPoint = () => [el];
		expect(world().blockingRect(5, 5)).toBeNull();
	});
});
