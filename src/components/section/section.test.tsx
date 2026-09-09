import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Eyebrow, Section, SectionHeading } from "@/components/section";

describe("Eyebrow", () => {
	it("renders monospace uppercase label text", () => {
		render(<Eyebrow>Selected work</Eyebrow>);
		const el = screen.getByText("Selected work");
		expect(el.className).toContain("font-mono");
		expect(el.className).toContain("uppercase");
	});
});

describe("SectionHeading", () => {
	it("renders a level-2 heading in the display face", () => {
		render(<SectionHeading>What I do</SectionHeading>);
		const heading = screen.getByRole("heading", {
			level: 2,
			name: "What I do",
		});
		expect(heading.className).toContain("font-display");
	});
});

describe("Section", () => {
	it("exposes an anchor target and labels itself by its heading", () => {
		render(
			<Section
				id="work"
				number="03"
				eyebrow="Selected work"
				title="Built in production"
			>
				<p>body</p>
			</Section>,
		);
		const region = screen.getByRole("region", { name: /built in production/i });
		expect(region).toHaveAttribute("id", "work");
		expect(screen.getByText("03")).toBeInTheDocument();
		expect(screen.getByText("body")).toBeInTheDocument();
	});
});
