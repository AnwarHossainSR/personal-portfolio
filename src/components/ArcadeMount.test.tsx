import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { STORAGE } from "@/arcade/constants";
import { setArcadeMode } from "@/arcade/mode";
import { ArcadeMount } from "@/components/ArcadeMount";
import { ArcadeToggle } from "@/components/ArcadeToggle";

const start = vi.fn();
const stop = vi.fn();

// The engine is mocked rather than run: this file is about whether React asks
// for it at all, and under what conditions. src/arcade/lifecycle.test.ts is
// where the real thing is started and stopped.
vi.mock("@/arcade", () => ({
	start: () => start(),
	stop: () => stop(),
}));

const realMatchMedia = window.matchMedia;

function setGate(open: boolean) {
	window.matchMedia = ((query: string) =>
		({
			matches: open && query.includes("pointer: fine"),
			media: query,
			onchange: null,
			addListener: () => {},
			removeListener: () => {},
			addEventListener: () => {},
			removeEventListener: () => {},
			dispatchEvent: () => false,
		}) as MediaQueryList) as typeof window.matchMedia;
}

beforeEach(() => {
	start.mockClear();
	stop.mockClear();
	localStorage.clear();
	setArcadeMode(false);
});

afterEach(() => {
	setArcadeMode(false);
	window.matchMedia = realMatchMedia;
});

describe("ArcadeMount", () => {
	it("renders nothing and loads nothing while the overlay is off", async () => {
		setGate(true);
		const { container } = render(<ArcadeMount />);
		expect(container.innerHTML).toBe("");
		// A microtask is enough for a dynamic import that was going to happen.
		await Promise.resolve();
		expect(start).not.toHaveBeenCalled();
	});

	it("loads nothing when the media gate is shut, even if enabled", async () => {
		setGate(false);
		setArcadeMode(true);
		const { container } = render(<ArcadeMount />);
		expect(container.innerHTML).toBe("");
		await Promise.resolve();
		expect(start).not.toHaveBeenCalled();
	});

	it("starts the engine and shows the panel once enabled", async () => {
		setGate(true);
		setArcadeMode(true);
		render(<ArcadeMount />);
		await waitFor(() => expect(start).toHaveBeenCalled());
		// The panel is lazy too, so it arrives a tick after the engine.
		expect(
			await screen.findByRole("heading", { name: /arcade overlay/i }),
		).toBeInTheDocument();
	});

	it("stops the engine when unmounted", async () => {
		setGate(true);
		setArcadeMode(true);
		const { unmount } = render(<ArcadeMount />);
		await waitFor(() => expect(start).toHaveBeenCalled());
		unmount();
		expect(stop).toHaveBeenCalled();
	});

	it("Escape stops the game and restores the page", async () => {
		setGate(true);
		setArcadeMode(true);
		render(<ArcadeMount />);
		await waitFor(() => expect(start).toHaveBeenCalled());
		await screen.findByRole("heading", { name: /arcade overlay/i });
		await userEvent.keyboard("{Escape}");
		await waitFor(() => expect(stop).toHaveBeenCalled());
		expect(
			screen.queryByRole("heading", { name: /arcade overlay/i }),
		).not.toBeInTheDocument();
	});
});

describe("ArcadeToggle", () => {
	it("does not appear where the game cannot run", () => {
		setGate(false);
		const { container } = render(<ArcadeToggle />);
		expect(container.innerHTML).toBe("");
	});

	it("says plainly what it is and what state it is in", () => {
		setGate(true);
		render(<ArcadeToggle />);
		const button = screen.getByRole("button", { name: /arcade mode: off/i });
		expect(button).toHaveAttribute("aria-pressed", "false");
	});

	it("remembers the choice", async () => {
		setGate(true);
		render(<ArcadeToggle />);
		await userEvent.click(screen.getByRole("button", { name: /arcade mode/i }));
		expect(localStorage.getItem(STORAGE.enabled)).toBe("1");
		expect(
			screen.getByRole("button", { name: /arcade mode: on/i }),
		).toHaveAttribute("aria-pressed", "true");
	});
});
