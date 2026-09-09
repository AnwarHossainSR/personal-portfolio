import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithRouter } from "@/test/render";

function Probe() {
	return <h1>harness online</h1>;
}

describe("test harness", () => {
	it("renders a component inside a router and applies jest-dom matchers", () => {
		renderWithRouter(<Probe />);
		expect(
			screen.getByRole("heading", { name: "harness online" }),
		).toBeInTheDocument();
	});
});
