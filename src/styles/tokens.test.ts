import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(
	path.resolve(process.cwd(), "src/styles/tokens.css"),
	"utf8",
);

const TOKENS = [
	"--color-paper",
	"--color-surface",
	"--color-surface-deep",
	"--color-ink",
	"--color-muted",
	"--color-faint",
	"--color-line",
	"--color-accent",
];

describe("design tokens", () => {
	it("defines every token in both themes", () => {
		const light = css.slice(css.indexOf(".light"));
		const dark = css.slice(css.indexOf(":root"), css.indexOf(".light"));
		for (const token of TOKENS) {
			expect(dark, `${token} missing from dark`).toContain(token);
			expect(light, `${token} missing from light`).toContain(token);
		}
	});

	it("uses oklch for every colour", () => {
		const declarations = css.match(/--color-[a-z-]+:\s*([^;]+);/g) ?? [];
		expect(declarations.length).toBeGreaterThan(0);
		for (const declaration of declarations) {
			expect(declaration).toContain("oklch(");
		}
	});

	it("keeps the neutrals warm", () => {
		const hues = [
			...css.matchAll(
				/--color-(?:paper|surface|ink|muted|faint|line)[a-z-]*:\s*oklch\([\d.]+%\s+[\d.]+\s+(\d+)\)/g,
			),
		].map((match) => Number(match[1]));
		expect(hues.length).toBeGreaterThan(0);
		for (const hue of hues) {
			expect(hue).toBeGreaterThanOrEqual(60);
			expect(hue).toBeLessThanOrEqual(95);
		}
	});
});
