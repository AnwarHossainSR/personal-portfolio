import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { profile } from "@/data/profile";
import { Hero } from "@/sections/Hero";
import { WhatIDo } from "@/sections/WhatIDo";
import { renderWithRouter } from "@/test/render";

describe("Hero", () => {
	it("leads with the positioning line as the only h1", () => {
		renderWithRouter(<Hero />);
		const headings = screen.getAllByRole("heading", { level: 1 });
		expect(headings).toHaveLength(1);
		expect(headings[0]).toHaveTextContent(profile.positioning);
	});

	it("keeps the step numbers out of the headline's text", () => {
		// The numbers are generated content (index.css, .plan-step). If they
		// were ever rendered as text they would join the h1's name, and the
		// partial match above would not notice.
		renderWithRouter(<Hero />);
		const heading = screen.getByRole("heading", { level: 1 });
		expect(heading.textContent).toBe(profile.positioning);
		for (const step of heading.querySelectorAll("[data-step]")) {
			expect(step.getAttribute("data-step")).toMatch(/^\d{2}$/);
		}
	});

	it("renders no vanity counters", () => {
		const { container } = renderWithRouter(<Hero />);
		expect(container.textContent).not.toMatch(
			/years experience|projects delivered/i,
		);
	});
});

describe("WhatIDo", () => {
	it("renders one block per capability, title and body", () => {
		renderWithRouter(<WhatIDo />);
		for (const capability of profile.capabilities) {
			expect(screen.getByText(capability.title)).toBeInTheDocument();
			expect(screen.getByText(capability.body)).toBeInTheDocument();
		}
	});

	it("renders the creed line", () => {
		renderWithRouter(<WhatIDo />);
		expect(screen.getByText(profile.creed)).toBeInTheDocument();
	});
});
