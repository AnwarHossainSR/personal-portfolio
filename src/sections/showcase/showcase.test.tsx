import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { profile } from "@/data/profile";
import { stackGroups } from "@/data/stack";
import { BroadcastFrame } from "@/sections/showcase/BroadcastFrame";
import { PLACES, roleInYear, toolsByYear } from "@/sections/showcase/data";
import { ToolkitChart } from "@/sections/showcase/ToolkitChart";
import { utcOffsetHours, WorkMap } from "@/sections/showcase/WorkMap";
import { WORLD_DOTS } from "@/sections/showcase/world-dots";
import { renderWithRouter } from "@/test/render";

describe("toolsByYear", () => {
	const data = toolsByYear();

	it("counts every tool in the Stack section exactly once", () => {
		const total = data.reduce((sum, year) => sum + year.tools.length, 0);
		const items = stackGroups.reduce((sum, g) => sum + g.items.length, 0);
		expect(total).toBe(items);
	});

	it("keeps years with nothing new, so the axis has no silent gaps", () => {
		const years = data.map((d) => d.year);
		for (let i = 1; i < years.length; i++) {
			expect(years[i]).toBe(years[i - 1] + 1);
		}
	});

	it("knows which role was under way in a year", () => {
		expect(roleInYear(2024)?.id).toBe("craftsmen");
		expect(roleInYear(1990)).toBeUndefined();
	});
});

describe("ToolkitChart", () => {
	it("offers every year as a control a keyboard can reach", () => {
		renderWithRouter(<ToolkitChart />);
		const years = within(
			screen.getByRole("list", { name: /tools first used per year/i }),
		).getAllByRole("button");
		expect(years).toHaveLength(toolsByYear().length);
		expect(years[0]).toHaveAccessibleName(/^\d{4}: \d+ tools?/);
	});

	it("says the same thing as a table", async () => {
		renderWithRouter(<ToolkitChart />);
		await userEvent.click(screen.getByRole("button", { name: "table" }));
		const table = screen.getByRole("table");
		for (const year of toolsByYear()) {
			expect(
				within(table).getByRole("rowheader", { name: String(year.year) }),
			).toBeInTheDocument();
		}
	});

	it("names its source", () => {
		renderWithRouter(<ToolkitChart />);
		expect(screen.getByText(/source: the stack section/i)).toBeInTheDocument();
	});
});

describe("WorkMap", () => {
	it("marks both places the page says the work happens", () => {
		renderWithRouter(<WorkMap />);
		const terms = screen.getAllByRole("term").map((term) => term.textContent);
		for (const place of PLACES) {
			expect(terms).toContain(place.label);
		}
		expect(
			screen.getByRole("img", { name: /route from dhaka to norway/i }),
		).toBeInTheDocument();
	});

	it("reads time-zone offsets from the platform", () => {
		const winter = new Date("2026-01-15T12:00:00Z");
		const summer = new Date("2026-07-15T12:00:00Z");
		expect(utcOffsetHours("Asia/Dhaka", winter)).toBe(6);
		expect(utcOffsetHours("Europe/Oslo", winter)).toBe(1);
		expect(utcOffsetHours("Europe/Oslo", summer)).toBe(2);
	});
});

describe("WORLD_DOTS", () => {
	it("has a full-width hex row for every latitude", () => {
		for (const row of WORLD_DOTS.rows) {
			expect(row).toMatch(/^[0-9a-f]+$/);
			expect(row).toHaveLength(WORLD_DOTS.cols / 4);
		}
	});

	it("puts land under Dhaka and none in the middle of the Indian Ocean", () => {
		const at = (lon: number, lat: number) => {
			const row = Math.round((WORLD_DOTS.latTop - lat) / WORLD_DOTS.step);
			const col = Math.round((lon - WORLD_DOTS.lon0) / WORLD_DOTS.step);
			const bits = BigInt(`0x${WORLD_DOTS.rows[row]}`);
			return ((bits >> BigInt(WORLD_DOTS.cols - 1 - col)) & 1n) === 1n;
		};
		expect(at(88.75, 23.75)).toBe(true);
		expect(at(78.75, -18.75)).toBe(false);
	});
});

describe("BroadcastFrame", () => {
	it("describes itself as one image to assistive tech", () => {
		renderWithRouter(<BroadcastFrame />);
		expect(
			screen.getByRole("img", { name: /broadcast graphic/i }),
		).toHaveAccessibleName(new RegExp(profile.name));
	});

	it("puts every tool from the Stack section on the ticker", () => {
		const { container } = renderWithRouter(<BroadcastFrame />);
		const ticker = container.querySelector(".on-air-ticker");
		for (const group of stackGroups) {
			for (const item of group.items) {
				expect(ticker?.textContent).toContain(item.name);
			}
		}
	});
});
