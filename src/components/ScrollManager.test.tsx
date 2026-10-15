import { act, render } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ScrollManager } from "@/components/ScrollManager";

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
	// @ts-expect-error — removing the per-test stub
	delete Element.prototype.scrollIntoView;
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
		expect(scrollIntoView.mock.contexts.at(-1)).toHaveProperty("id", "work");
	});
});
