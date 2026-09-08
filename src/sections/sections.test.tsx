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
