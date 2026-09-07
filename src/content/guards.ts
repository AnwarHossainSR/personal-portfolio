/**
 * Content authored for this site must never ship with scaffolding text in it.
 * The site's whole claim is that its numbers are real, so a stray "TBD" is not
 * a cosmetic bug — it undermines the thing the content model exists to assert.
 * These tokens therefore fail the test suite rather than a lint rule.
 */
const PLACEHOLDER_PATTERNS = [
	/<<REPLACE>>/,
	/\bTODO\b/,
	/\bTBD\b/,
	/\bFIXME\b/,
	/\bLorem ipsum\b/i,
	/example\.com/i,
];

function walk(value: unknown, path: string, hits: string[]): void {
	if (typeof value === "string") {
		if (PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(value))) {
			hits.push(path);
		}
		return;
	}

	if (Array.isArray(value)) {
		value.forEach((item, index) => {
			walk(item, path ? `${path}.${index}` : String(index), hits);
		});
		return;
	}

	if (value && typeof value === "object") {
		for (const [key, item] of Object.entries(value)) {
			walk(item, path ? `${path}.${key}` : key, hits);
		}
	}
}

export function findPlaceholders(value: unknown): string[] {
	const hits: string[] = [];
	walk(value, "", hits);
	return hits;
}

export function assertNoPlaceholders(value: unknown, label: string): void {
	const hits = findPlaceholders(value);
	if (hits.length > 0) {
		throw new Error(
			`${label}: unresolved placeholder text at ${hits.join(", ")}`,
		);
	}
}
