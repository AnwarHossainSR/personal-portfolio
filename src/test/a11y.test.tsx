import { Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import * as matchers from "vitest-axe/matchers";
import { setArcadeMode } from "@/arcade/mode";
import { Layout } from "@/components/Layout";
import { caseStudies } from "@/content/case-studies";
import CaseStudy from "@/pages/CaseStudy";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import { renderWithRouter } from "@/test/render";

expect.extend(matchers);

// Rendered through Layout (not the bare page component) so the chrome that
// ships with every real page — AnchorNav's header, Footer — is part of what
// axe inspects. That chrome is where the duplicate-landmark and contrast
// violations actually live; testing the bare page would miss them.
describe("accessibility", () => {
	it("the one page has no axe violations", async () => {
		const { container } = renderWithRouter(
			<Layout>
				<Home />
			</Layout>,
		);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("a case study page has no axe violations", async () => {
		const { container } = renderWithRouter(
			<Layout>
				<Routes>
					<Route path="/work/:slug" element={<CaseStudy />} />
				</Routes>
			</Layout>,
			{ route: `/work/${caseStudies[0].slug}` },
		);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("the arcade control adds no violations, on or off", async () => {
		// The overlay itself injects nothing into the accessibility tree — its
		// root is aria-hidden, asserted in src/arcade/lifecycle.test.ts. What
		// does reach the tree is the control that turns it on, so that is what
		// is checked here, in both of its states.
		// The stub in src/test/setup.ts answers false to every media query, so
		// the control would render nothing at all and this test would assert
		// nothing. Open the gate the way a desktop browser would.
		const realMatchMedia = window.matchMedia;
		window.matchMedia = ((query: string) =>
			({
				matches: query.includes("pointer: fine"),
				media: query,
				onchange: null,
				addListener: () => {},
				removeListener: () => {},
				addEventListener: () => {},
				removeEventListener: () => {},
				dispatchEvent: () => false,
			}) as MediaQueryList) as typeof window.matchMedia;

		const off = renderWithRouter(
			<Layout>
				<p>page</p>
			</Layout>,
		);
		expect(
			off.getByRole("button", { name: /turn arcade mode on/i }),
		).toBeInTheDocument();
		expect(await axe(off.container)).toHaveNoViolations();
		off.unmount();

		setArcadeMode(true);
		const on = renderWithRouter(
			<Layout>
				<p>page</p>
			</Layout>,
		);
		expect(
			on.getByRole("button", { name: /turn arcade mode off/i }),
		).toBeInTheDocument();
		expect(await axe(on.container)).toHaveNoViolations();
		setArcadeMode(false);
		window.matchMedia = realMatchMedia;
	});

	it("the 404 page has no axe violations", async () => {
		const { container } = renderWithRouter(
			<Layout>
				<NotFound />
			</Layout>,
		);
		expect(await axe(container)).toHaveNoViolations();
	});
});
