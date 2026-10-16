import { act, render } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { fragmentId, ScrollManager } from "@/components/ScrollManager";

function renderAt(initial: string) {
	const router = createMemoryRouter(
		[
			{
				path: "*",
				element: (
					<>
						<ScrollManager />
						<section id="work">work</section>
					</>
				),
			},
		],
		{ initialEntries: [initial] },
	);
	render(<RouterProvider router={router} />);
	return router;
}

afterEach(() => {
	vi.restoreAllMocks();
	// Removes the per-test stub, so jsdom is back to not implementing it.
	Reflect.deleteProperty(Element.prototype, "scrollIntoView");
});

describe("ScrollManager", () => {
	it("starts a new route at the top", async () => {
		const scrollTo = vi.spyOn(window, "scrollTo");
		const router = renderAt("/");
		scrollTo.mockClear();
		await act(() => router.navigate("/work/analytics-platform"));
		expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ top: 0 }));
	});

	it("leaves back and forward to the browser", async () => {
		const scrollTo = vi.spyOn(window, "scrollTo");
		const router = renderAt("/");
		await act(() => router.navigate("/work/analytics-platform"));
		scrollTo.mockClear();
		await act(() => router.navigate(-1));
		expect(scrollTo).not.toHaveBeenCalled();
	});

	it("scrolls to the section a hash names", async () => {
		const scrollIntoView = vi.fn();
		Element.prototype.scrollIntoView = scrollIntoView;
		const router = renderAt("/");
		await act(() => router.navigate("/#work"));
		expect(scrollIntoView).toHaveBeenCalled();
		const contexts = scrollIntoView.mock.contexts;
		expect(contexts[contexts.length - 1]).toHaveProperty("id", "work");
	});

	it("survives a malformed hash instead of blanking the page", async () => {
		// decodeURIComponent throws on this. Thrown inside the effect, it
		// unmounted the whole layout.
		const router = renderAt("/");
		await act(() => router.navigate("/#%E0%A4%A"));
		expect(document.getElementById("work")).toBeInTheDocument();
	});
});

describe("fragmentId", () => {
	it("decodes a well-formed fragment", () => {
		expect(fragmentId("#caf%C3%A9")).toBe("café");
	});

	it("falls back to the fragment as written when it cannot be decoded", () => {
		expect(fragmentId("#%E0%A4%A")).toBe("%E0%A4%A");
	});
});
