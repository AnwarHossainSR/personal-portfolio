import { SECTIONS } from "@/components/AnchorNav";
import { profile } from "@/data/profile";

export function Footer() {
	return (
		<footer data-arcade-keep className="mt-24 border-t border-line">
			<div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
				<p>
					{profile.name} · {profile.location}
				</p>
				<nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
					{SECTIONS.map((section) => (
						<a
							key={section.id}
							href={`#${section.id}`}
							className="transition-colors hover:text-ink"
						>
							{section.label}
						</a>
					))}
					{profile.links.map((link) => (
						<a
							key={link.href}
							href={link.href}
							target="_blank"
							rel="noreferrer"
							className="transition-colors hover:text-ink"
						>
							{link.label}
						</a>
					))}
				</nav>
			</div>
		</footer>
	);
}
