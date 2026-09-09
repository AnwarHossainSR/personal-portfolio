import { type RenderOptions, render } from "@testing-library/react";
import type { ReactElement } from "react";
import { HelmetProvider } from "react-helmet-next";
import { MemoryRouter } from "react-router-dom";

type Options = RenderOptions & { route?: string };

export function renderWithRouter(ui: ReactElement, options: Options = {}) {
	const { route = "/", ...renderOptions } = options;

	return render(
		<HelmetProvider>
			<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
		</HelmetProvider>,
		renderOptions,
	);
}
