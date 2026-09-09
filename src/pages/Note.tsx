import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Prose } from "@/components/Prose";
import { SEOHead } from "@/components/SEO";
import { getNote } from "@/content/notes";
import NotFound from "@/pages/NotFound";

export default function Note() {
	const { slug } = useParams();
	const note = slug ? getNote(slug) : undefined;

	if (!note) {
		return <NotFound />;
	}

	const Body = note.body;

	return (
		<>
			<SEOHead
				title={note.title}
				description={note.summary}
				path={`/writing/${note.slug}`}
				type="article"
				publishedTime={note.published}
			/>
			<article className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
				<Link
					to="/writing"
					className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
				>
					<ArrowLeft className="h-4 w-4" aria-hidden="true" />
					All writing
				</Link>

				<header className="mt-8">
					<p className="text-sm text-muted">
						<time dateTime={note.published}>{note.published}</time> ·{" "}
						{note.readingMinutes} min · {note.tags.join(", ")}
					</p>
					<h1 className="mt-4 max-w-[24ch] font-display text-3xl font-semibold leading-[1.15] tracking-tight sm:text-[38px]">
						{note.title}
					</h1>
				</header>

				<Prose className="mt-10 space-y-5">
					<Body />
				</Prose>
			</article>
		</>
	);
}
