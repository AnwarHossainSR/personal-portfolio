import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Reveal } from "@/motion/Reveal";

const realMatchMedia = window.matchMedia;

function stubReducedMotion(reduced: boolean) {
	window.matchMedia = ((query: string) =>
		({
			matches: reduced && query.includes("prefers-reduced-motion"),
			media: query,
			onchange: null,
			addListener: () => {},
			removeListener: () => {},
			addEventListener: () => {},
			removeEventListener: () => {},
			dispatchEvent: () => false,
		}) as MediaQueryList) as typeof window.matchMedia;
}

afterEach(() => {
	window.matchMedia = realMatchMedia;
	vi.useRealTimers();
});

describe("Reveal", () => {
	it("renders its children even when the observer never fires", () => {
		// The stub in src/test/setup.ts never calls the callback. Content must
		// still be in the document — an animation that does not run may not
		// take the content with it.
		render(
			<Reveal>
				<p>visible either way</p>
			</Reveal>,
		);
		expect(screen.getByText("visible either way")).toBeInTheDocument();
	});

	it("reveals on a timeout when the observer never fires", () => {
		vi.useFakeTimers();
		const { container } = render(
			<Reveal>
				<p>fallback</p>
			</Reveal>,
		);
		const wrapper = container.firstElementChild as HTMLElement;
		expect(wrapper.style.opacity).toBe("0");
		act(() => {
			vi.advanceTimersByTime(1500);
		});
		expect(wrapper.style.opacity).toBe("1");
	});

	it("renders unwrapped, with no animation styles, under reduced motion", () => {
		stubReducedMotion(true);
		const { container } = render(
			<Reveal className="keeps-its-class">
				<p>no motion</p>
			</Reveal>,
		);
		const wrapper = container.firstElementChild as HTMLElement;
		expect(wrapper.className).toBe("keeps-its-class");
		expect(wrapper.getAttribute("style")).toBeNull();
		expect(screen.getByText("no motion")).toBeInTheDocument();
	});

	it("renders as the requested element", () => {
		const { container } = render(
			<ul>
				<Reveal as="li">
					<span>row</span>
				</Reveal>
			</ul>,
		);
		expect(container.querySelector("li")).not.toBeNull();
	});
});
