import { Link } from "react-router-dom";
import { NAV_ITEMS } from "@/components/Navigation";
import { notes } from "@/content/notes";
import { profile } from "@/data/profile";

export function Footer() {
	const items = NAV_ITEMS.filter(
		(item) => item.href !== "/writing" || notes.length > 0,
	);

	return (
		<footer className="mt-24 border-t border-border/70">
			<div className="mx-auto flex max-w-5xl flex-col gap-6 px-5 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
				<p>
					{profile.name} · {profile.location}
				</p>
				<nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
					{items.map((item) => (
						<Link
							key={item.href}
							to={item.href}
							className="transition-colors hover:text-foreground"
						>
							{item.label}
						</Link>
					))}
					{profile.links.map((link) => (
						<a
							key={link.href}
							href={link.href}
							target="_blank"
							rel="noreferrer"
							className="transition-colors hover:text-foreground"
						>
							{link.label}
						</a>
					))}
				</nav>
			</div>
		</footer>
	);
}
