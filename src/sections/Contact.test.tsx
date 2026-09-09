import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { profile } from "@/data/profile";
import { Contact } from "@/sections/Contact";
import { renderWithRouter } from "@/test/render";

describe("Contact section", () => {
	it("offers a direct mailto link rather than a form that fakes a submit", () => {
		renderWithRouter(<Contact />);
		expect(screen.getByRole("link", { name: profile.email })).toHaveAttribute(
			"href",
			`mailto:${profile.email}`,
		);
	});

	it("renders no form controls", () => {
		const { container } = renderWithRouter(<Contact />);
		expect(container.querySelector("form")).toBeNull();
		expect(container.querySelector("input")).toBeNull();
	});

	it("states availability and response time", () => {
		renderWithRouter(<Contact />);
		expect(screen.getByText(profile.availability)).toBeInTheDocument();
		expect(screen.getByText(profile.responseTime)).toBeInTheDocument();
	});

	it("does not show a phone number", () => {
		const { container } = renderWithRouter(<Contact />);
		expect(container.textContent).not.toMatch(/\+880/);
	});

	it("mentions teaching once, as a link rather than a section", () => {
		renderWithRouter(<Contact />);
		expect(
			screen.getAllByRole("link", { name: /youtube|tutorial/i }),
		).toHaveLength(1);
	});
});
