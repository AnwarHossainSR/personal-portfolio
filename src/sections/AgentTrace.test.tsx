import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { findPlaceholders } from "@/content/guards";
import { AgentTrace, TRACE_PROMPT, TRACE_STEPS } from "@/sections/AgentTrace";
import { renderWithRouter } from "@/test/render";

describe("AgentTrace", () => {
	it("says on screen that it is an illustration", () => {
		renderWithRouter(<AgentTrace />);
		const figure = screen.getByRole("figure");
		expect(figure).toHaveAccessibleName(/illustration/i);
		expect(figure).toHaveAccessibleName(/not a real log/i);
	});

	it("carries no numbers — a duration or count here would be one nobody measured", () => {
		const text = [
			...TRACE_STEPS.flatMap((item) => [item.step, item.detail]),
			TRACE_PROMPT,
		].join(" ");
		expect(text).not.toMatch(/\d/);
		expect(findPlaceholders(TRACE_STEPS)).toEqual([]);
	});

	it("ends on a step that stays live", () => {
		expect(TRACE_STEPS[TRACE_STEPS.length - 1].live).toBe(true);
		expect(TRACE_STEPS.filter((item) => item.live)).toHaveLength(1);
	});

	it("keeps the console itself out of the accessibility tree", () => {
		const { container } = renderWithRouter(<AgentTrace />);
		const list = container.querySelector("ol");
		expect(list).toHaveAttribute("aria-hidden", "true");
	});

	it("replays the run from its own control", async () => {
		const { container } = renderWithRouter(<AgentTrace />);
		const before = container.querySelector("ol");
		await userEvent.click(
			screen.getByRole("button", { name: "Replay the run" }),
		);
		const after = container.querySelector("ol");
		// A new list, not the old one re-styled: remounting is what restarts
		// the CSS animations.
		expect(after).not.toBe(before);
		expect(after?.children).toHaveLength(TRACE_STEPS.length);
	});
});
