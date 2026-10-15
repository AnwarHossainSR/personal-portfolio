import { FileText, Menu, X } from "lucide-react";
import { type MouseEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArcadeToggle } from "@/components/ArcadeToggle";
import { CommandTrigger } from "@/components/command/CommandTrigger";
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
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const onHome = pathname === "/";

	/*
	 * The links stay plain `#fragment` hrefs, which is what they are on the
	 * home page. Anywhere else the fragment does not exist, so the click is
	 * turned into a route change to the home page at that section, and
	 * ScrollManager takes it from there.
	 */
	const goToSection = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
		setOpen(false);
		if (onHome) return;
		event.preventDefault();
		navigate({ pathname: "/", hash: id });
	};

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
		// The hero ("top") is observed too, so that scrolling back up to it
		// clears the highlight instead of leaving the last section lit.
		const targets = ["top", ...SECTIONS.map((section) => section.id)];
		const observed = new Set<string>();
		const attachAvailable = () => {
			for (const id of targets) {
				if (observed.has(id)) continue;
				const el = document.getElementById(id);
				if (el) {
					observer.observe(el);
					observed.add(id);
				}
			}
			return observed.size === targets.length;
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
			className="sticky top-0 z-50 border-b border-line/60 bg-paper/70 backdrop-blur-xl"
		>
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
				<Link
					to={{ pathname: "/", hash: "top" }}
					className="group flex items-center gap-3 rounded-lg"
				>
					<span
						aria-hidden="true"
						className="relative grid h-8 w-8 place-items-center rounded-lg bg-accent font-mono text-[13px] font-semibold text-paper transition-transform duration-300 group-hover:-rotate-6"
					>
						A
						<span className="absolute -right-0.5 -top-0.5 rounded-full ring-2 ring-paper">
							<span className="live-dot block after:hidden" />
						</span>
					</span>
					<span className="flex flex-col leading-none">
						<span className="whitespace-nowrap font-display text-[15px] font-semibold tracking-tight text-ink">
							{profile.name}
						</span>
						<span className="mt-1 hidden font-mono text-[10px] uppercase tracking-[0.16em] text-faint sm:block">
							Senior Software Engineer
						</span>
					</span>
				</Link>

				<nav aria-label="Primary" className="hidden lg:block">
					<ul className="flex items-center gap-0.5 rounded-full border border-line/80 bg-surface/60 p-1">
						{SECTIONS.map((section) => (
							<li key={section.id}>
								<a
									href={`#${section.id}`}
									onClick={(event) => goToSection(event, section.id)}
									aria-current={active === section.id ? "true" : undefined}
									className={cn(
										"block rounded-full px-3.5 py-1.5 text-[13px] transition-colors",
										onHome && active === section.id
											? "bg-surface-deep text-ink shadow-elevation-1"
											: "text-muted hover:text-ink",
									)}
								>
									{section.label}
								</a>
							</li>
						))}
					</ul>
				</nav>

				<div className="flex items-center gap-2">
					<CommandTrigger />
					<a
						href={profile.resumePath}
						target="_blank"
						rel="noreferrer"
						className="hidden h-9 items-center gap-1.5 rounded-full border border-line/80 bg-surface/60 px-3 text-[13px] text-muted transition-colors hover:text-ink lg:inline-flex"
					>
						<FileText className="h-3.5 w-3.5" aria-hidden="true" />
						Résumé
					</a>
					{/*
					 * Renders nothing where the game cannot run — touch, coarse
					 * pointer, reduced motion — which is every case the mobile
					 * menu covers.
					 */}
					<ArcadeToggle className="hidden lg:inline-flex" />
					<ThemeToggle className="hidden lg:inline-flex" />
					<button
						type="button"
						onClick={() => setOpen(!open)}
						aria-expanded={open}
						aria-controls="anchor-nav-mobile"
						aria-label={open ? "Close menu" : "Open menu"}
						className="grid h-9 w-9 place-items-center rounded-full border border-line/80 bg-surface/60 text-muted transition-colors hover:text-ink lg:hidden"
					>
						{open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
					</button>
				</div>
			</div>

			{/* Always mounted so aria-controls always resolves; visibility is toggled. */}
			<nav
				id="anchor-nav-mobile"
				aria-label="Primary mobile"
				hidden={!open}
				className="border-t border-line/60 px-5 pb-6 pt-3 lg:hidden"
			>
				<ul className="grid gap-1">
					{SECTIONS.map((section, index) => (
						<li key={section.id}>
							<a
								href={`#${section.id}`}
								onClick={(event) => goToSection(event, section.id)}
								className="flex items-baseline gap-4 rounded-lg px-2 py-2.5 text-lg text-ink transition-colors hover:bg-surface"
							>
								<span
									aria-hidden="true"
									className="font-mono text-[11px] text-faint"
								>
									{String(index + 1).padStart(2, "0")}
								</span>
								{section.label}
							</a>
						</li>
					))}
				</ul>
				<div className="mt-4 flex items-center gap-3 border-t border-line/60 pt-4">
					<a
						href={profile.resumePath}
						target="_blank"
						rel="noreferrer"
						className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line/80 px-3.5 text-sm text-muted"
					>
						<FileText className="h-3.5 w-3.5" aria-hidden="true" />
						Résumé
					</a>
					<ThemeToggle />
				</div>
			</nav>

			<div
				aria-hidden="true"
				className="scroll-progress pointer-events-none absolute inset-x-0 bottom-0 h-px bg-accent"
			/>
		</header>
	);
}
