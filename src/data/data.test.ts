import { describe, expect, it } from "vitest";
import { findPlaceholders } from "@/content/guards";
import { profile } from "@/data/profile";
import { roles } from "@/data/roles";
import { stackGroups } from "@/data/stack";

describe("profile", () => {
	it("states a single positioning line, not a pipe-separated claim list", () => {
		expect(profile.positioning).not.toContain("|");
		expect(profile.positioning.length).toBeLessThan(160);
	});

	it("carries at most six capabilities, each a short noun phrase", () => {
		expect(profile.capabilities.length).toBeLessThanOrEqual(6);
		for (const capability of profile.capabilities) {
			expect(capability.title.split(/\s+/).length).toBeLessThanOrEqual(3);
			expect(capability.body.length).toBeGreaterThan(20);
		}
	});

	it("states the positioning as short declarative sentences", () => {
		const sentences = profile.positioning
			.split(".")
			.filter((part) => part.trim().length > 0);
		expect(sentences.length).toBeGreaterThanOrEqual(3);
		for (const sentence of sentences) {
			expect(sentence.trim().split(/\s+/).length).toBeLessThanOrEqual(6);
		}
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

describe("roles", () => {
	it("names a scope for every role", () => {
		for (const role of roles) {
			expect(role.scope.length).toBeGreaterThan(30);
		}
	});

	it("keeps impact statements to at most three per role", () => {
		for (const role of roles) {
			expect(role.impact.length).toBeLessThanOrEqual(3);
			expect(role.impact.length).toBeGreaterThan(0);
		}
	});

	it("has no placeholder text", () => {
		expect(findPlaceholders(roles)).toEqual([]);
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
