import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The guard that keeps the game out of the bundle every reader downloads.
 *
 * This is asserted over the module graph in source, not over a build artefact:
 * a test that needs `dist/` only runs when someone remembered to build, and
 * the failure it is guarding against — somebody adding a convenient static
 * `import { start } from "@/arcade"` — is introduced in source and would be
 * invisible until the next production build.
 *
 * The rule: nothing reachable from the app's entry may import the engine. Only
 * three arcade modules are allowed through statically — the media gate, the
 * on/off store, and the storage keys the store reads — and each is a handful
 * of lines with no further arcade imports of its own.
 */

const SRC = path.resolve(process.cwd(), "src");

/** Modules small enough, and free enough of the engine, to ship to everyone. */
const ALLOWED_STATIC = new Set([
	"@/arcade/gate",
	"@/arcade/mode",
	"@/arcade/storage",
]);

const PANEL_MAY_IMPORT = new Set(["@/arcade/telemetry-ids", "@/arcade/sound"]);

/** Reached only through `import()` or `lazy()`, so they get their own chunk. */
const LAZY_ONLY = new Set(["@/arcade", "@/components/ArcadePanel"]);

function sourceFiles(dir: string): string[] {
	return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) return sourceFiles(full);
		if (!/\.tsx?$/.test(entry.name)) return [];
		if (/\.test\.tsx?$/.test(entry.name)) return [];
		return [full];
	});
}

/** Static imports only: `import x from "y"`, not `await import("y")`. */
function staticImports(source: string): string[] {
	const specifiers: string[] = [];
	const pattern =
		/(^|\n)\s*(?:import|export)\s[^\n;]*?from\s*["']([^"']+)["']/g;
	for (const match of source.matchAll(pattern)) specifiers.push(match[2]);
	// Bare side-effect imports: `import "./arcade.css"`.
	for (const match of source.matchAll(/(^|\n)\s*import\s+["']([^"']+)["']/g)) {
		specifiers.push(match[2]);
	}
	return specifiers;
}

const appFiles = sourceFiles(SRC).filter(
	(file) => !file.startsWith(path.join(SRC, "arcade")),
);

describe("bundle budget", () => {
	it("no application module statically imports the engine", () => {
		const offenders: string[] = [];
		for (const file of appFiles) {
			for (const specifier of staticImports(readFileSync(file, "utf8"))) {
				if (!specifier.startsWith("@/arcade")) continue;
				if (ALLOWED_STATIC.has(specifier)) continue;
				// The panel imports the telemetry ids, and the panel is itself
				// only reached through lazy(), so it rides the arcade chunk.
				// The panel is itself reached only through lazy(), so what it
				// imports rides the arcade chunk with it.
				if (
					PANEL_MAY_IMPORT.has(specifier) &&
					file.endsWith(`${path.sep}ArcadePanel.tsx`)
				) {
					continue;
				}
				offenders.push(`${path.relative(SRC, file)} → ${specifier}`);
			}
		}
		expect(offenders).toEqual([]);
	});

	it("the modules that are allowed through pull nothing else in behind them", () => {
		for (const allowed of ALLOWED_STATIC) {
			const file = path.join(SRC, `${allowed.replace("@/", "")}.ts`);
			const imports = staticImports(readFileSync(file, "utf8")).filter(
				(specifier) => specifier.startsWith("@/arcade"),
			);
			for (const specifier of imports) {
				expect(
					ALLOWED_STATIC.has(specifier),
					`${allowed} imports ${specifier}, which is not on the allowed list`,
				).toBe(true);
			}
		}
	});

	it("the engine and the panel are reached only through a dynamic import", () => {
		const found = new Set<string>();
		for (const file of appFiles) {
			const source = readFileSync(file, "utf8");
			for (const match of source.matchAll(
				/import\(\s*["']([^"']+)["']\s*\)/g,
			)) {
				if (LAZY_ONLY.has(match[1])) found.add(match[1]);
			}
		}
		expect([...found].sort()).toEqual([...LAZY_ONLY].sort());
	});

	it("the engine's stylesheet is imported by the engine, not by the app", () => {
		// Vite splits arcade.css with the chunk that imports it. Pulling it
		// into src/index.css instead would put every keyframe in the
		// stylesheet that blocks first paint.
		const indexCss = readFileSync(path.join(SRC, "index.css"), "utf8");
		expect(indexCss).not.toContain("arcade.css");
		expect(
			readFileSync(path.join(SRC, "arcade", "index.ts"), "utf8"),
		).toContain("arcade.css");
	});
});
