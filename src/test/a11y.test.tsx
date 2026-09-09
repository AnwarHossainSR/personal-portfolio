import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import * as matchers from "vitest-axe/matchers";
import { Route, Routes } from "react-router-dom";
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

	it("the 404 page has no axe violations", async () => {
		const { container } = renderWithRouter(
			<Layout>
				<NotFound />
			</Layout>,
		);
		expect(await axe(container)).toHaveNoViolations();
	});
});
