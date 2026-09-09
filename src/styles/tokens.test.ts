import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(
	path.resolve(process.cwd(), "src/styles/tokens.css"),
	"utf8",
);

const tailwindConfig = readFileSync(
	path.resolve(process.cwd(), "tailwind.config.ts"),
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

	it("stores bare oklch channels rather than a wrapped colour function", () => {
		// Tailwind 3.4 cannot inject an alpha channel into an opaque var()
		// string, so each warm token must hold three space-separated channel
		// values ("18% 0.012 85") rather than a complete oklch(...) function.
		// The oklch() wrapper now lives in tailwind.config.ts, applied with the
		// <alpha-value> placeholder (checked below), which is what makes
		// `/opacity` modifiers like `bg-paper/85` work.
		for (const token of TOKENS) {
			const declarations = [
				...css.matchAll(new RegExp(`${token}:\\s*([^;]+);`, "g")),
			].map((match) => match[1].trim());
			expect(
				declarations.length,
				`${token} has no declarations`,
			).toBeGreaterThan(0);

			for (const value of declarations) {
				expect(
					value,
					`${token} should not wrap its value in oklch(...)`,
				).not.toContain("oklch(");

				const channels = value.split(/\s+/);
				expect(
					channels,
					`${token}: "${value}" is not three space-separated channels`,
				).toHaveLength(3);

				const [lightness, chroma, hue] = channels;
				expect(lightness).toMatch(/^\d+(\.\d+)?%$/);
				expect(Number(chroma)).toBeGreaterThanOrEqual(0);
				expect(Number(chroma)).toBeLessThan(1);
				expect(Number(hue)).toBeGreaterThanOrEqual(0);
				expect(Number(hue)).toBeLessThanOrEqual(360);
			}
		}
	});

	it("wraps every warm token with the <alpha-value> placeholder in tailwind.config.ts", () => {
		for (const token of TOKENS) {
			const pattern = new RegExp(
				`oklch\\(var\\(${token}\\)\\s*/\\s*<alpha-value>\\)`,
			);
			expect(
				tailwindConfig,
				`${token} is not wrapped with oklch(var(${token}) / <alpha-value>) in tailwind.config.ts`,
			).toMatch(pattern);
		}
	});

	it("keeps the neutrals warm", () => {
		const hues = [
			...css.matchAll(
				/--color-(?:paper|surface|ink|muted|faint|line)[a-z-]*:\s*[\d.]+%\s+[\d.]+\s+(\d+)/g,
			),
		].map((match) => Number(match[1]));
		expect(hues.length).toBeGreaterThan(0);
		for (const hue of hues) {
			expect(hue).toBeGreaterThanOrEqual(60);
			expect(hue).toBeLessThanOrEqual(95);
		}
	});
});
