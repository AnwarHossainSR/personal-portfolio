import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import * as matchers from "vitest-axe/matchers";
import { TELEMETRY_ID_LIST } from "@/arcade/telemetry-ids";
import { ArcadePanel } from "@/components/ArcadePanel";

expect.extend(matchers);

describe("ArcadePanel", () => {
	/**
	 * The engine writes into this panel by id and React never re-renders it,
	 * which means a renamed id fails silently: the game keeps running, the
	 * panel keeps showing zero, and nothing complains. The id list is imported
	 * from telemetry.ts rather than repeated here so the two cannot drift.
	 */
	it("renders every element the engine writes into", () => {
		const { container } = render(<ArcadePanel />);
		expect(TELEMETRY_ID_LIST.length).toBeGreaterThan(0);
		for (const id of TELEMETRY_ID_LIST) {
			expect(
				container.querySelector(`#${id}`),
				`#${id} is missing`,
			).not.toBeNull();
		}
	});

	it("marks itself as something the game may not destroy", () => {
		const { container } = render(<ArcadePanel />);
		expect(container.querySelector("[data-arcade-keep]")).not.toBeNull();
	});

	it("states the controls, including the way out", () => {
		render(<ArcadePanel />);
		expect(screen.getByText(/esc to stop/i)).toBeInTheDocument();
	});

	it("links to the source rather than only describing it", () => {
		render(<ArcadePanel />);
		expect(
			screen.getByRole("link", { name: /read the source/i }),
		).toHaveAttribute("href", expect.stringContaining("/src/arcade"));
	});

	it("has no axe violations", async () => {
		const { container } = render(<ArcadePanel />);
		expect(await axe(container)).toHaveNoViolations();
	});
});
