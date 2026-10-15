import { readFileSync } from "node:fs";
import path from "node:path";
import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

/*
 * The theme lives in a module-level store, so each test imports a fresh copy
 * of the module against a fresh localStorage.
 */
async function freshModule() {
	vi.resetModules();
	return import("@/hooks/useTheme");
}

beforeEach(() => {
	localStorage.clear();
	document.documentElement.className = "";
});

describe("useTheme", () => {
	it("starts dark for a first visit and puts the class on <html>", async () => {
		const { useTheme } = await freshModule();
		function Probe() {
			return <p>{useTheme().theme}</p>;
		}
		render(<Probe />);
		expect(screen.getByText("dark")).toBeInTheDocument();
		expect(document.documentElement).toHaveClass("dark");
		expect(localStorage.getItem("theme")).toBe("dark");
	});

	it("resets a choice stored under the previous default once", async () => {
		localStorage.setItem("theme", "light");
		localStorage.setItem("theme-default-version", "light-v1");
		const { useTheme } = await freshModule();
		function Probe() {
			return <p>{useTheme().theme}</p>;
		}
		render(<Probe />);
		expect(screen.getByText("dark")).toBeInTheDocument();
	});

	it("keeps a choice made under the current default", async () => {
		localStorage.setItem("theme", "light");
		localStorage.setItem("theme-default-version", "dark-v2");
		const { useTheme } = await freshModule();
		function Probe() {
			return <p>{useTheme().theme}</p>;
		}
		render(<Probe />);
		expect(screen.getByText("light")).toBeInTheDocument();
		expect(document.documentElement).toHaveClass("light");
	});

	it("shares one theme between every consumer", async () => {
		const { useTheme, toggleTheme } = await freshModule();
		function Probe({ id }: { id: string }) {
			return <p data-testid={id}>{useTheme().theme}</p>;
		}
		render(
			<>
				<Probe id="desktop" />
				<Probe id="mobile" />
			</>,
		);
		act(() => toggleTheme());
		expect(screen.getByTestId("desktop")).toHaveTextContent("light");
		expect(screen.getByTestId("mobile")).toHaveTextContent("light");
		expect(document.documentElement).toHaveClass("light");
		expect(document.documentElement).not.toHaveClass("dark");
		expect(localStorage.getItem("theme")).toBe("light");
	});

	it("keeps the browser chrome colour in step", async () => {
		const meta = document.createElement("meta");
		meta.name = "theme-color";
		document.head.append(meta);
		const { setTheme } = await freshModule();
		setTheme("light");
		expect(meta.content).toBe("#faf9f6");
		setTheme("dark");
		expect(meta.content).toBe("#0c0a08");
		meta.remove();
	});

	it("agrees with the pre-paint script in index.html", async () => {
		// The script sets the class before React loads, so a returning visitor
		// does not see the wrong theme flash. If the two disagree about the
		// version, that visitor flashes on every load.
		const { THEME_DEFAULT_VERSION } = await freshModule();
		const html = readFileSync(
			path.resolve(process.cwd(), "index.html"),
			"utf8",
		);
		expect(html).toContain(`=== "${THEME_DEFAULT_VERSION}"`);
	});
});
