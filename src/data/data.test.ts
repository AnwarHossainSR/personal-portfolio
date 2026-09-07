import { describe, expect, it } from "vitest";
import { findPlaceholders } from "@/content/guards";
import { profile } from "@/data/profile";
import { stackGroups } from "@/data/stack";

describe("profile", () => {
	it("states a single positioning line, not a pipe-separated claim list", () => {
		expect(profile.positioning).not.toContain("|");
		expect(profile.positioning.length).toBeLessThan(160);
	});

	it("carries at most three headline points", () => {
		expect(profile.headline.length).toBeLessThanOrEqual(3);
	});

	it("does not link a YouTube channel from the primary link set", () => {
		expect(profile.links.some((link) => /youtube/i.test(link.href))).toBe(
			false,
		);
	});

	it("has no placeholder text", () => {
		expect(findPlaceholders(profile)).toEqual([]);
	});
});

describe("stack", () => {
	it("assigns no proficiency levels", () => {
		const serialised = JSON.stringify(stackGroups);
		expect(serialised).not.toMatch(/expert|advanced|intermediate|beginner/i);
	});

	it("keeps each group short enough to read", () => {
		for (const group of stackGroups) {
			expect(group.items.length).toBeLessThanOrEqual(7);
		}
	});

	it("has no placeholder text", () => {
		expect(findPlaceholders(stackGroups)).toEqual([]);
	});
});
