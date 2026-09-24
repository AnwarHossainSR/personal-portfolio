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

const darkBlock = css.slice(css.indexOf(":root"), css.indexOf(".light"));
const lightBlock = css.slice(css.indexOf(".light"));

/**
 * Parsed out of the stylesheet rather than listed by hand, so a token added
 * tomorrow is held to the same rules as the eight that shipped with the
 * redesign — both themes, bare channels, and an <alpha-value> wrapper in the
 * Tailwind config. A hand-written list only ever covers the past.
 */
function definedTokens(block: string): string[] {
	return [
		...new Set([...block.matchAll(/(--color-[a-z-]+):/g)].map((m) => m[1])),
	];
}

const TOKENS = definedTokens(css);

describe("design tokens", () => {
	it("defines every token in both themes", () => {
		expect(TOKENS.length).toBeGreaterThan(0);
		for (const token of TOKENS) {
			expect(darkBlock, `${token} missing from dark`).toContain(`${token}:`);
			expect(lightBlock, `${token} missing from light`).toContain(`${token}:`);
		}
	});

	it("has no token defined in one theme only", () => {
		// Both directions. A colour that exists only in .light is a bug that is
		// invisible until someone loads the site in the other theme, and the
		// arcade overlay in src/arcade runs over both grounds.
		expect(definedTokens(darkBlock).sort()).toEqual(
			definedTokens(lightBlock).sort(),
		);
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
