import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "@/App";
import { SECTIONS } from "@/components/AnchorNav";
import { renderWithRouter } from "@/test/render";

describe("navigation", () => {
	it("exposes the section anchors", () => {
		expect(SECTIONS.map((section) => section.label)).toEqual([
			"What I do",
			"Work",
			"Process",
			"Stack",
			"Contact",
		]);
	});

	it("does not offer a YouTube or Ask AI destination", () => {
		const ids = SECTIONS.map((section) => section.id).join(" ");
		expect(ids).not.toMatch(/youtube|ask-ai/);
	});

	it("keeps the mobile menu's aria-controls target mounted while closed", async () => {
		renderWithRouter(<App />);
		const toggle = await screen.findByRole("button", { name: /open menu/i });
		const targetId = toggle.getAttribute("aria-controls");
		expect(targetId).toBeTruthy();

		const target = document.getElementById(targetId ?? "");
		expect(target).toBeInTheDocument();
		expect(target).not.toBeVisible();
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

	it("redirects the old projects URL to work", async () => {
		renderWithRouter(<App />, { route: "/projects" });
		expect(
			await screen.findByRole("heading", { name: /selected work/i }),
		).toBeInTheDocument();
	});
});
