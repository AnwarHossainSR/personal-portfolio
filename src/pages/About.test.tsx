import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { roles } from "@/data/roles";
import About from "@/pages/About";
import { renderWithRouter } from "@/test/render";

describe("About", () => {
	it("carries the anchors the old /experience and /skills URLs redirect to", () => {
		const { container } = renderWithRouter(<About />);
		expect(container.querySelector("#track-record")).not.toBeNull();
		expect(container.querySelector("#stack")).not.toBeNull();
	});

	it("lists every role with its scope", () => {
		renderWithRouter(<About />);
		for (const role of roles) {
			expect(screen.getByText(role.company)).toBeInTheDocument();
			expect(screen.getByText(role.scope)).toBeInTheDocument();
		}
	});

	it("shows no proficiency levels in the stack section", () => {
		const { container } = renderWithRouter(<About />);
		expect(container.textContent).not.toMatch(
			/\bExpert\b|\bAdvanced\b|\bIntermediate\b/,
		);
	});

	it("shows no certifications section", () => {
		renderWithRouter(<About />);
		expect(
			screen.queryByText(/certification|credential/i),
		).not.toBeInTheDocument();
	});

	it("mentions teaching once, as a link rather than a section", () => {
		renderWithRouter(<About />);
		expect(
			screen.getAllByRole("link", { name: /youtube|tutorial/i }),
		).toHaveLength(1);
	});
});
