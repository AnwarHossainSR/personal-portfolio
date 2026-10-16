import { act, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLocation } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { setPaletteOpen } from "@/components/command/store";
import { Layout } from "@/components/Layout";
import { caseStudies } from "@/content/case-studies";
import { profile } from "@/data/profile";
import { renderWithRouter } from "@/test/render";

function LocationProbe() {
	const { pathname, hash } = useLocation();
	return <p data-testid="location">{`${pathname}${hash}`}</p>;
}

function renderPage() {
	return renderWithRouter(
		<Layout>
			<LocationProbe />
		</Layout>,
	);
}

afterEach(() => {
	act(() => setPaletteOpen(false));
});

describe("CommandPalette", () => {
	it("opens from the keyboard shortcut", async () => {
		const user = userEvent.setup();
		renderPage();
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

		await user.keyboard("{Control>}k{/Control}");
		expect(
			await screen.findByRole("dialog", { name: "Command palette" }),
		).toBeInTheDocument();
		expect(screen.getByRole("combobox")).toHaveFocus();
	});

	it("opens from the header trigger and lists every section and case study", async () => {
		const user = userEvent.setup();
		renderPage();
		const [trigger] = screen.getAllByRole("button", {
			name: "Open command palette",
		});
		await user.click(trigger);

		const listbox = await screen.findByRole("listbox");
		for (const label of ["What I do", "Work", "Process", "Stack", "Contact"]) {
			expect(
				within(listbox).getByRole("option", { name: new RegExp(label) }),
			).toBeInTheDocument();
		}
		for (const study of caseStudies) {
			expect(
				within(listbox).getByRole("option", { name: new RegExp(study.title) }),
			).toBeInTheDocument();
		}
	});

	it("filters as you type and runs the active command on Enter", async () => {
		const user = userEvent.setup();
		renderPage();
		await user.keyboard("{Control>}k{/Control}");
		const input = await screen.findByRole("combobox");

		const study = caseStudies[1];
		await user.type(input, study.slug.split("-")[0]);
		const options = screen.getAllByRole("option");
		expect(options[0]).toHaveAccessibleName(new RegExp(study.title));
		expect(options[0]).toHaveAttribute("aria-selected", "true");
		expect(input).toHaveAttribute("aria-activedescendant", options[0].id);

		await user.keyboard("{Enter}");
		expect(screen.getByTestId("location")).toHaveTextContent(
			`/work/${study.slug}`,
		);
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});

	it("moves the selection with the arrow keys", async () => {
		const user = userEvent.setup();
		renderPage();
		await user.keyboard("{Control>}k{/Control}");
		await screen.findByRole("combobox");

		await user.keyboard("{ArrowDown}");
		const options = screen.getAllByRole("option");
		expect(options[1]).toHaveAttribute("aria-selected", "true");
		await user.keyboard("{ArrowUp}{ArrowUp}");
		expect(options[options.length - 1]).toHaveAttribute(
			"aria-selected",
			"true",
		);
	});

	it("says so when nothing matches", async () => {
		const user = userEvent.setup();
		renderPage();
		await user.keyboard("{Control>}k{/Control}");
		await user.type(await screen.findByRole("combobox"), "zzzz");
		expect(screen.queryAllByRole("option")).toHaveLength(0);
		expect(screen.getByText(/nothing matches/i)).toBeInTheDocument();
	});

	it("closes on Escape and gives focus back to what opened it", async () => {
		const user = userEvent.setup();
		renderPage();
		const [trigger] = screen.getAllByRole("button", {
			name: "Open command palette",
		});
		await user.click(trigger);
		await screen.findByRole("dialog");

		await user.keyboard("{Escape}");
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
		expect(trigger).toHaveFocus();
	});

	it("takes a section to the home page at that section", async () => {
		const user = userEvent.setup();
		renderPage();
		await user.keyboard("{Control>}k{/Control}");
		await user.type(await screen.findByRole("combobox"), "stack");
		await user.keyboard("{Enter}");
		expect(screen.getByTestId("location")).toHaveTextContent("/#stack");
	});

	it("stays open and says so when copying fails", async () => {
		const user = userEvent.setup();
		const writeText = vi.fn().mockRejectedValue(new Error("denied"));
		Object.defineProperty(navigator, "clipboard", {
			value: { writeText },
			configurable: true,
		});
		renderPage();
		await user.keyboard("{Control>}k{/Control}");
		await user.type(await screen.findByRole("combobox"), "copy email");
		await user.keyboard("{Enter}");
		expect(writeText).toHaveBeenCalledWith(profile.email);
		expect(
			await screen.findByRole("option", { name: /could not copy/i }),
		).toBeInTheDocument();
		await new Promise((resolve) => setTimeout(resolve, 800));
		expect(screen.getByRole("dialog")).toBeInTheDocument();
	});

	it("confirms a copy that worked, then closes", async () => {
		const user = userEvent.setup();
		const writeText = vi.fn().mockResolvedValue(undefined);
		Object.defineProperty(navigator, "clipboard", {
			value: { writeText },
			configurable: true,
		});
		renderPage();
		await user.keyboard("{Control>}k{/Control}");
		await user.type(await screen.findByRole("combobox"), "copy email");
		await user.keyboard("{Enter}");
		expect(
			await screen.findByRole("option", { name: /copied to clipboard/i }),
		).toBeInTheDocument();
		await waitFor(() =>
			expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
		);
	});
});
