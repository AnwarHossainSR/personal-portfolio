import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEO";

export default function NotFound() {
	return (
		<>
			<SEOHead title="Page not found" noIndex />
			<div className="mx-auto max-w-5xl px-5 py-24 sm:px-8">
				<h1 className="text-2xl font-semibold tracking-tight">
					Page not found
				</h1>
				<p className="mt-3 max-w-prose text-muted">
					That page does not exist. The work is at{" "}
					<Link to="/work" className="text-ink underline underline-offset-4">
						/work
					</Link>
					.
				</p>
			</div>
		</>
	);
}
