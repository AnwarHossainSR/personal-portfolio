import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { findPlaceholders } from "@/content/guards";
import { recognition } from "@/data/recognition";
import { Proof } from "@/sections/Proof";
import { renderWithRouter } from "@/test/render";

describe("recognition data", () => {
	it("carries an issuer and a year on every entry", () => {
		for (const item of recognition) {
			expect(item.issuer.length).toBeGreaterThan(2);
			expect(item.year).toMatch(/^\d{4}$/);
		}
	});

	it("has no placeholder text", () => {
		expect(findPlaceholders(recognition)).toEqual([]);
	});
});

describe("Proof", () => {
	it("renders every entry with its issuer", () => {
		const { container } = renderWithRouter(<Proof />);
		if (recognition.length === 0) {
			expect(container).toBeEmptyDOMElement();
			return;
		}
		for (const item of recognition) {
			expect(screen.getByText(item.title)).toBeInTheDocument();
			expect(screen.getByText(new RegExp(item.issuer))).toBeInTheDocument();
		}
	});
});
