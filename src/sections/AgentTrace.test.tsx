import { screen } from "@testing-library/react";
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
		expect(TRACE_STEPS.at(-1)?.live).toBe(true);
		expect(TRACE_STEPS.filter((item) => item.live)).toHaveLength(1);
	});

	it("keeps the console itself out of the accessibility tree", () => {
		const { container } = renderWithRouter(<AgentTrace />);
		const list = container.querySelector("ol");
		expect(list).toHaveAttribute("aria-hidden", "true");
	});
});
