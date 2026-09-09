import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import * as matchers from "vitest-axe/matchers";
import { getArcadeMode, setArcadeMode } from "@/arcade/mode";
import { TELEMETRY_ID_LIST } from "@/arcade/telemetry-ids";
import { ArcadePanel } from "@/components/ArcadePanel";

expect.extend(matchers);

afterEach(() => {
	vi.doUnmock("@/arcade");
	vi.resetModules();
});

/** The panel ships closed; most of these assertions are about what is inside. */
async function renderOpen() {
	const result = render(<ArcadePanel />);
	await userEvent.click(screen.getByRole("button", { name: /arcade stats/i }));
	return result;
}

describe("ArcadePanel", () => {
	/**
	 * The engine writes into this panel by id and React never re-renders it,
	 * which means a renamed id fails silently: the game keeps running, the
	 * panel keeps showing zero, and nothing complains. The id list is imported
	 * from telemetry.ts rather than repeated here so the two cannot drift.
	 */
	it("renders every element the engine writes into", async () => {
		const { container } = await renderOpen();
		expect(TELEMETRY_ID_LIST.length).toBeGreaterThan(0);
		for (const id of TELEMETRY_ID_LIST) {
			expect(
				container.querySelector(`#${id}`),
				`#${id} is missing`,
			).not.toBeNull();
		}
	});

	it("marks itself as something the game may not destroy, open or closed", async () => {
		const closed = render(<ArcadePanel />);
		expect(closed.container.querySelector("[data-arcade-keep]")).not.toBeNull();
		closed.unmount();
		const { container } = await renderOpen();
		expect(container.querySelector("[data-arcade-keep]")).not.toBeNull();
	});

	it("states the controls, including the way out", async () => {
		await renderOpen();
		expect(screen.getByText(/esc to stop/i)).toBeInTheDocument();
	});

	it("links to the source rather than only describing it", async () => {
		await renderOpen();
		expect(
			screen.getByRole("link", { name: /read the source/i }),
		).toHaveAttribute("href", expect.stringContaining("/src/arcade"));
	});

	it("starts closed and opens on click", async () => {
		// A panel that is always on screen is a permanent obstruction on a page
		// whose job is to be read. Closed is one button; the numbers are opt-in.
		const { container } = render(<ArcadePanel />);
		expect(container.querySelector(`#${TELEMETRY_ID_LIST[0]}`)).toBeNull();

		await userEvent.click(
			screen.getByRole("button", { name: /arcade stats/i }),
		);
		expect(container.querySelector(`#${TELEMETRY_ID_LIST[0]}`)).not.toBeNull();

		await userEvent.click(screen.getByRole("button", { name: /hide/i }));
		expect(container.querySelector(`#${TELEMETRY_ID_LIST[0]}`)).toBeNull();
		expect(
			screen.getByRole("button", { name: /arcade stats/i }),
		).toBeInTheDocument();
	});

	it("stops the overlay from its own control", async () => {
		setArcadeMode(true);
		await renderOpen();
		await userEvent.click(screen.getByRole("button", { name: /stop/i }));
		expect(getArcadeMode()).toBe(false);
	});

	it("will not clear the score on a single click", async () => {
		// Two steps, like the reference's panel. A one-click control that wipes
		// an all-time score is a control somebody hits by accident.
		const resetScore = vi.fn();
		vi.doMock("@/arcade", () => ({ resetScore }));
		await renderOpen();

		await userEvent.click(screen.getByRole("button", { name: /clear score/i }));
		expect(resetScore).not.toHaveBeenCalled();
		expect(screen.getByRole("alert")).toHaveTextContent(
			/clear all-time score/i,
		);

		await userEvent.click(screen.getByRole("button", { name: /cancel/i }));
		expect(resetScore).not.toHaveBeenCalled();
		expect(
			screen.getByRole("button", { name: /clear score/i }),
		).toBeInTheDocument();
	});

	it("clears the score on confirmation, through a dynamic import", async () => {
		const resetScore = vi.fn();
		vi.doMock("@/arcade", () => ({ resetScore }));
		await renderOpen();

		await userEvent.click(screen.getByRole("button", { name: /clear score/i }));
		await userEvent.click(screen.getByRole("button", { name: /confirm/i }));
		await waitFor(() => expect(resetScore).toHaveBeenCalledTimes(1));
		// Back to the resting state, not stuck mid-confirmation.
		expect(
			screen.getByRole("button", { name: /clear score/i }),
		).toBeInTheDocument();
	});

	it("has no axe violations, closed or open", async () => {
		const closed = render(<ArcadePanel />);
		expect(await axe(closed.container)).toHaveNoViolations();
		closed.unmount();
		const { container } = await renderOpen();
		expect(await axe(container)).toHaveNoViolations();
	});
});
