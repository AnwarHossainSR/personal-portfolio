import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "@/App";
import { NAV_ITEMS } from "@/components/Navigation";
import { renderWithRouter } from "@/test/render";

describe("navigation", () => {
	it("exposes four primary items", () => {
		expect(NAV_ITEMS.map((item) => item.label)).toEqual([
			"Work",
			"About",
			"Writing",
			"Contact",
		]);
	});

	it("does not offer a YouTube or Ask AI destination", () => {
		const hrefs = NAV_ITEMS.map((item) => item.href).join(" ");
		expect(hrefs).not.toMatch(/youtube|ask-ai/);
	});
});

describe("routes", () => {
	it("404s the removed AI chatbot route", async () => {
		renderWithRouter(<App />, { route: "/ask-ai" });
		expect(await screen.findByText(/page not found/i)).toBeInTheDocument();
	});

	it("404s the removed YouTube route", async () => {
		renderWithRouter(<App />, { route: "/youtube" });
		expect(await screen.findByText(/page not found/i)).toBeInTheDocument();
	});

	// Restored in Task 8 Step 6, once Work.tsx renders a "Selected work" heading.
	it.todo("redirects the old projects URL to work");
});
