import { Fragment } from "react";
import { profile } from "@/data/profile";

// profile.positioning is short declarative sentences separated by ". ".
// Splitting on the space that follows a period (lookbehind, not consumed)
// lets each sentence sit on its own visual line inside the single h1 — the
// rhythm the reference design leans on — while every text node still
// concatenates back to the exact source string, spaces included, so the
// element keeps one accessible name equal to profile.positioning.
const positioningLines = profile.positioning.split(/(?<=\.)\s+/);

export function Hero() {
	return (
		<section
			id="top"
			className="mx-auto max-w-6xl px-5 pb-20 pt-16 sm:px-8 md:pb-28 md:pt-24"
		>
			<h1 className="max-w-[16ch] font-display text-[2.75rem] font-medium leading-[1.04] tracking-tight text-ink sm:text-6xl md:text-7xl">
				{positioningLines.map((line, index) => (
					<Fragment key={line}>
						{line}
						{index < positioningLines.length - 1 ? " " : null}
						{index < positioningLines.length - 1 ? <br /> : null}
					</Fragment>
				))}
			</h1>

			<div className="mt-8 max-w-2xl space-y-5 text-lg leading-relaxed text-muted">
				{profile.pitch.map((paragraph) => (
					<p key={paragraph}>{paragraph}</p>
				))}
			</div>

			<div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
				<a
					href="#contact"
					className="rounded bg-ink px-4 py-2.5 font-medium text-paper transition-opacity hover:opacity-90"
				>
					Get in touch
				</a>
				<a
					href={profile.resumePath}
					target="_blank"
					rel="noreferrer"
					className="text-muted underline underline-offset-4 transition-colors hover:text-ink"
				>
					Résumé (PDF)
				</a>
				{profile.links.map((link) => (
					<a
						key={link.href}
						href={link.href}
						target="_blank"
						rel="noreferrer"
						className="text-muted underline underline-offset-4 transition-colors hover:text-ink"
					>
						{link.label}
					</a>
				))}
			</div>
		</section>
	);
}
