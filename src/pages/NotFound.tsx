import { Link } from "react-router-dom";
import { SECTIONS } from "@/components/AnchorNav";
import { SEOHead } from "@/components/SEO";
import { Eyebrow } from "@/components/section";

export default function NotFound() {
	return (
		<>
			<SEOHead title="Page not found" noIndex />
			<div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
				<Eyebrow>404</Eyebrow>

				<h1 className="mt-3 max-w-[18ch] font-display text-4xl font-medium leading-[1.08] tracking-tight text-ink md:text-5xl">
					That page does not exist
				</h1>

				<p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
					It may have moved when the site became a single page. Everything now
					lives on one route, in these sections.
				</p>

				<nav
					aria-label="Sections"
					className="mt-8 flex flex-wrap gap-x-6 gap-y-3"
				>
					{SECTIONS.map((section) => (
						<Link
							key={section.id}
							to={`/#${section.id}`}
							className="text-ink underline underline-offset-4 transition-colors hover:text-accent"
						>
							{section.label}
						</Link>
					))}
				</nav>
			</div>
		</>
	);
}
