import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEO";
import { notes } from "@/content/notes";

export default function Writing() {
	return (
		<>
			<SEOHead
				title="Writing"
				description="Engineering notes on decisions, tradeoffs and things that surprised me in production."
				path="/writing"
			/>
			<div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
				<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
					Writing
				</h1>
				<p className="mt-5 max-w-[62ch] text-[17px] leading-[1.75] text-muted">
					Notes on decisions I nearly got wrong and things production taught me.
					Not tutorials.
				</p>

				<ol className="mt-14 space-y-10">
					{notes.map((note) => (
						<li key={note.slug} className="border-t border-line/70 pt-6">
							<p className="text-sm text-muted">
								<time dateTime={note.published}>{note.published}</time> ·{" "}
								{note.readingMinutes} min
							</p>
							<h2 className="mt-2 max-w-[26ch] text-xl font-semibold leading-snug tracking-tight">
								<Link
									to={`/writing/${note.slug}`}
									className="transition-colors hover:text-accent"
								>
									{note.title}
								</Link>
							</h2>
							<p className="mt-3 max-w-[64ch] text-[17px] leading-[1.7] text-muted">
								{note.summary}
							</p>
						</li>
					))}
				</ol>
			</div>
		</>
	);
}
