import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ArcadeToggle } from "@/components/ArcadeToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

export interface SectionLink {
	id: string;
	label: string;
}

export const SECTIONS: SectionLink[] = [
	{ id: "what-i-do", label: "What I do" },
	{ id: "work", label: "Work" },
	{ id: "process", label: "Process" },
	{ id: "stack", label: "Stack" },
	{ id: "contact", label: "Contact" },
];

export function AnchorNav() {
	const [open, setOpen] = useState(false);
	const [active, setActive] = useState<string>("");

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				// Multiple sections can intersect the observation band at once
				// (e.g. a short section fully inside it while its neighbour
				// edges in). Rank by which is closest to crossing the band's
				// center line so the highlighted item is deterministic rather
				// than "whichever the browser reported last".
				const visible = entries.filter((entry) => entry.isIntersecting);
				if (visible.length === 0) return;

				const winner = visible.reduce((closest, entry) =>
					Math.abs(entry.boundingClientRect.top) <
					Math.abs(closest.boundingClientRect.top)
						? entry
						: closest,
				);
				setActive(winner.target.id);
			},
			{ rootMargin: "-45% 0px -50% 0px" },
		);

		// AnchorNav sits outside the route's Suspense boundary, so this effect
		// can run before a lazily-loaded page (Home included) has mounted its
		// sections. Attach to whatever exists now, then watch the DOM for the
		// rest arriving so the highlight still works instead of silently never
		// activating.
		const observed = new Set<string>();
		const attachAvailable = () => {
			for (const section of SECTIONS) {
				if (observed.has(section.id)) continue;
				const el = document.getElementById(section.id);
				if (el) {
					observer.observe(el);
					observed.add(section.id);
				}
			}
			return observed.size === SECTIONS.length;
		};

		let mutationObserver: MutationObserver | undefined;
		if (!attachAvailable()) {
			mutationObserver = new MutationObserver(() => {
				if (attachAvailable()) mutationObserver?.disconnect();
			});
			mutationObserver.observe(document.body, {
				childList: true,
				subtree: true,
			});
		}

		return () => {
			mutationObserver?.disconnect();
			observer.disconnect();
		};
	}, []);

	return (
		<header
			// The arcade overlay treats a painted, viewport-wide element as a
			// wall. A sticky header is exactly that, and enemies enter from
			// off-screen above — so the chrome is pass-through, and bullets
			// bounce off it rather than dismantling the navigation.
			data-arcade-keep
			className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur"
		>
			<div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
				<a
					href="#top"
					className="font-display text-base font-semibold tracking-tight text-ink"
				>
					{profile.name}
				</a>

				<nav aria-label="Primary" className="hidden items-center gap-1 sm:flex">
					{SECTIONS.map((section) => (
						<a
							key={section.id}
							href={`#${section.id}`}
							aria-current={active === section.id ? "true" : undefined}
							className={cn(
								"rounded px-3 py-2 text-sm transition-colors",
								active === section.id
									? "text-ink"
									: "text-muted hover:text-ink",
							)}
						>
							{section.label}
						</a>
					))}
					<a
						href={profile.resumePath}
						target="_blank"
						rel="noreferrer"
						className="ml-2 rounded border border-line px-3 py-2 text-sm text-muted transition-colors hover:text-ink"
					>
						Résumé
					</a>
					{/*
					 * Desktop nav only, and it renders nothing where the game
					 * cannot run — which is every case the mobile menu covers.
					 */}
					<ArcadeToggle />
					<ThemeToggle />
				</nav>

				<button
					type="button"
					onClick={() => setOpen(!open)}
					aria-expanded={open}
					aria-controls="anchor-nav-mobile"
					aria-label={open ? "Close menu" : "Open menu"}
					className="rounded p-2 text-muted sm:hidden"
				>
					{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
				</button>
			</div>

			{/* Always mounted so aria-controls always resolves; visibility is toggled. */}
			<nav
				id="anchor-nav-mobile"
				aria-label="Primary mobile"
				hidden={!open}
				className="border-t border-line px-5 pb-5 pt-2 sm:hidden"
			>
				{SECTIONS.map((section) => (
					<a
						key={section.id}
						href={`#${section.id}`}
						onClick={() => setOpen(false)}
						className="block py-2.5 text-sm text-muted"
					>
						{section.label}
					</a>
				))}
				<a
					href={profile.resumePath}
					target="_blank"
					rel="noreferrer"
					className="block py-2.5 text-sm text-muted"
				>
					Résumé
				</a>
				<div className="pt-3">
					<ThemeToggle />
				</div>
			</nav>
		</header>
	);
}
