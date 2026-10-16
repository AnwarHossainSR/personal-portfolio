import { ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { SECTIONS } from "@/components/AnchorNav";
import { SEOHead } from "@/components/SEO";
import { Eyebrow } from "@/components/section";

export default function NotFound() {
	const { pathname } = useLocation();

	return (
		<>
			<SEOHead title="Page not found" noIndex />
			<div className="relative isolate overflow-hidden">
				<div aria-hidden="true" className="dot-field" />
				<div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 md:py-32">
					<Eyebrow>404</Eyebrow>

					<h1 className="mt-4 max-w-[18ch] font-display text-[2.5rem] font-semibold leading-[1.04] tracking-[-0.04em] text-ink md:text-6xl">
						That page does not exist
					</h1>

					<div
						data-arcade-ground
						className="panel mt-10 max-w-xl overflow-hidden font-mono text-[12.5px]"
					>
						<p className="border-b border-line px-4 py-3 text-faint">
							<span className="text-accent">❯</span> GET{" "}
							<span className="break-all text-ink">{pathname}</span>
						</p>
						<p className="px-4 py-3 text-muted">
							<span className="text-accent">404</span> route not found · the
							sections below are a good place to start
						</p>
					</div>

					<p className="mt-10 max-w-2xl text-lg leading-relaxed text-muted">
						It may have moved when the site became a single page. Everything now
						lives on one route, in these sections.
					</p>

					<nav aria-label="Sections" className="mt-8 flex flex-wrap gap-2">
						{SECTIONS.map((section) => (
							<Link
								key={section.id}
								to={`/#${section.id}`}
								className="group inline-flex items-center gap-1.5 rounded-full border border-line/80 bg-surface/60 px-4 py-2 text-sm text-ink transition-colors hover:border-accent/50 hover:text-accent"
							>
								{section.label}
								<ArrowRight
									className="h-3.5 w-3.5 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
									aria-hidden="true"
								/>
							</Link>
						))}
					</nav>
				</div>
			</div>
		</>
	);
}
