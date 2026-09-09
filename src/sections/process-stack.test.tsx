import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { findPlaceholders } from "@/content/guards";
import { processSteps } from "@/data/process";
import { stackGroups } from "@/data/stack";
import { Process } from "@/sections/Process";
import { Stack } from "@/sections/Stack";
import { renderWithRouter } from "@/test/render";

describe("process data", () => {
	it("has exactly three steps and no placeholder text", () => {
		expect(processSteps).toHaveLength(3);
		expect(findPlaceholders(processSteps)).toEqual([]);
	});
});

describe("Process", () => {
	it("renders every step title", () => {
		renderWithRouter(<Process />);
		for (const step of processSteps) {
			expect(screen.getByText(step.title)).toBeInTheDocument();
		}
	});
});

describe("Stack", () => {
	it("renders every group with no proficiency ratings", () => {
		const { container } = renderWithRouter(<Stack />);
		for (const group of stackGroups) {
			expect(screen.getByText(group.name)).toBeInTheDocument();
		}
		expect(container.textContent).not.toMatch(
			/\bExpert\b|\bAdvanced\b|\bIntermediate\b/,
		);
	});
});
