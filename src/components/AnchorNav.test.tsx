import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AnchorNav, SECTIONS } from "@/components/AnchorNav";
import { renderWithRouter } from "@/test/render";

describe("AnchorNav", () => {
	it("links every section by fragment", () => {
		renderWithRouter(<AnchorNav />);
		for (const section of SECTIONS) {
			const link = screen.getByRole("link", { name: section.label });
			expect(link).toHaveAttribute("href", `#${section.id}`);
		}
	});

	it("keeps the mobile menu target in the DOM while collapsed", () => {
		const { container } = renderWithRouter(<AnchorNav />);
		const toggle = screen.getByRole("button", { name: /menu/i });
		const controls = toggle.getAttribute("aria-controls");
		expect(controls).toBeTruthy();
		expect(container.querySelector(`#${controls}`)).not.toBeNull();
	});
});
