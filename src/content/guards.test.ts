import { describe, expect, it } from "vitest";
import { assertNoPlaceholders, findPlaceholders } from "@/content/guards";

describe("findPlaceholders", () => {
	it("finds the replacement sentinel anywhere in a nested structure", () => {
		const found = findPlaceholders({
			a: { b: ["fine", "p95 was <<REPLACE>>ms"] },
		});
		expect(found).toEqual(["a.b.1"]);
	});

	it("finds TODO, TBD, Lorem and example.com", () => {
		const found = findPlaceholders({
			one: "TODO: write this",
			two: "TBD",
			three: "Lorem ipsum dolor",
			four: "https://example.com/blog/post",
			five: "a legitimate sentence",
		});
		expect(found.sort()).toEqual(["four", "one", "three", "two"]);
	});

	it("does not flag ordinary prose", () => {
		expect(
			findPlaceholders({ a: "Reduced p95 latency from 840ms to 210ms." }),
		).toEqual([]);
	});
});

describe("assertNoPlaceholders", () => {
	it("throws naming the label and the offending path", () => {
		expect(() =>
			assertNoPlaceholders({ summary: "TBD" }, "case-study:vod"),
		).toThrow(/case-study:vod.*summary/s);
	});

	it("does not throw on clean content", () => {
		expect(() =>
			assertNoPlaceholders({ summary: "Shipped it." }, "x"),
		).not.toThrow();
	});
});
