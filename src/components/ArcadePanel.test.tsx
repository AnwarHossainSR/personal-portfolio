import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import * as matchers from "vitest-axe/matchers";
import { getArcadeMode, setArcadeMode } from "@/arcade/mode";
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

	it("collapses without unmounting the rows the engine writes to", async () => {
		// Unmounting them would drop every counter back to zero on expand, and
		// the engine has no way to know it happened.
		const { container } = render(<ArcadePanel />);
		await userEvent.click(screen.getByRole("button", { name: /hide/i }));
		const body = container.querySelector("#arcade-panel-body") as HTMLElement;
		expect(body.hidden).toBe(true);
		expect(container.querySelector(`#${TELEMETRY_ID_LIST[0]}`)).not.toBeNull();
		await userEvent.click(screen.getByRole("button", { name: /show/i }));
		expect(body.hidden).toBe(false);
	});

	it("stops the overlay from its own control", async () => {
		setArcadeMode(true);
		render(<ArcadePanel />);
		await userEvent.click(screen.getByRole("button", { name: /stop/i }));
		expect(getArcadeMode()).toBe(false);
	});

	it("has no axe violations", async () => {
		const { container } = render(<ArcadePanel />);
		expect(await axe(container)).toHaveNoViolations();
	});
});
