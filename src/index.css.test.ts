import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const SRC = path.resolve(process.cwd(), "src");
const css = readFileSync(path.join(SRC, "index.css"), "utf8");
const tokensCss = readFileSync(path.join(SRC, "styles", "tokens.css"), "utf8");

describe("stylesheet", () => {
	it("no longer defines the decorative classes", () => {
		for (const removed of [
			".premium-card",
			".gradient-text",
			".mesh-gradient",
			".hero-glow",
		]) {
			expect(css).not.toContain(removed);
		}
	});

	it("does not paint a grid behind the whole page", () => {
		expect(css).not.toContain("--bg-grid");
	});

	it("honours prefers-reduced-motion", () => {
		expect(css).toContain("prefers-reduced-motion");
	});

	it("keeps both palettes defined", () => {
		// Colour definitions live in styles/tokens.css, imported at the top of
		// this stylesheet — see tokens.test.ts for the token-level assertions.
		expect(css).toContain('@import "./styles/tokens.css"');
		expect(tokensCss).toContain(".light");
		expect(tokensCss).toMatch(/:root,\s*\.dark/);
	});
});

const REMOVED_CLASSES = [
	"premium-card",
	"gradient-text",
	"mesh-gradient",
	"section-shell",
	"metric-tile",
	"interactive-card",
	"slide-in-up",
	"font-black",
];

function sourceFiles(dir: string): string[] {
	return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) return sourceFiles(full);
		return /\.tsx?$/.test(entry.name) ? [full] : [];
	});
}

describe("typography contract", () => {
	it("loads fonts from the document head, not a css import", () => {
		expect(css).not.toContain("@import url(\"https://fonts.googleapis.com");
	});

	it("paints the paper ground on body", () => {
		expect(css).toMatch(/body\s*\{[^}]*bg-paper/s);
	});
});

describe("component classes", () => {
	it("has no remaining references to the removed classes", () => {
		const offenders = sourceFiles(SRC)
			.filter((file) => !file.endsWith("index.css.test.ts"))
			.filter((file) => {
				const source = readFileSync(file, "utf8");
				return REMOVED_CLASSES.some((name) => source.includes(name));
			})
			.map((file) => path.relative(SRC, file));

		expect(offenders).toEqual([]);
	});
});
