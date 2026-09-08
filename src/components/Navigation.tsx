import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { notes } from "@/content/notes";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

export interface NavItem {
	label: string;
	href: string;
}

/**
 * Four items. The old eight-item bar was breadth-first; this one exists to get
 * a reader to one deep artefact. "Writing" is listed but only routed when a
 * note exists — an empty writing section is worse than no writing section.
 */
export const NAV_ITEMS: NavItem[] = [
	{ label: "Work", href: "/work" },
	{ label: "About", href: "/about" },
	{ label: "Writing", href: "/writing" },
	{ label: "Contact", href: "/contact" },
];

export function Navigation() {
	const [open, setOpen] = useState(false);
	const location = useLocation();

	// biome-ignore lint/correctness/useExhaustiveDependencies: location is the trigger, not a value read in the body — close the mobile menu on navigation.
	useEffect(() => {
		setOpen(false);
	}, [location]);

	const items = NAV_ITEMS.filter(
		(item) => item.href !== "/writing" || notes.length > 0,
	);

	return (
		<header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
			<div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-6 px-5 sm:px-8">
				<Link
					to="/"
					className="text-sm font-semibold tracking-tight text-foreground"
				>
					{profile.name}
				</Link>

				<nav aria-label="Primary" className="hidden items-center gap-1 sm:flex">
					{items.map((item) => (
						<Link
							key={item.href}
							to={item.href}
							aria-current={
								location.pathname.startsWith(item.href) ? "page" : undefined
							}
							className={cn(
								"rounded-md px-3 py-2 text-sm transition-colors",
								location.pathname.startsWith(item.href)
									? "text-foreground"
									: "text-muted-foreground hover:text-foreground",
							)}
						>
							{item.label}
						</Link>
					))}
					<a
						href={profile.resumePath}
						target="_blank"
						rel="noreferrer"
						className="ml-2 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
					>
						Résumé
					</a>
					<ThemeToggle />
				</nav>

				<button
					type="button"
					onClick={() => setOpen(!open)}
					aria-expanded={open}
					aria-controls="mobile-nav"
					aria-label={open ? "Close menu" : "Open menu"}
					className="rounded-md p-2 text-muted-foreground sm:hidden"
				>
					{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
				</button>
			</div>

			<nav
				id="mobile-nav"
				aria-label="Primary"
				hidden={!open}
				className="border-t border-border/70 px-5 pb-5 pt-2 sm:hidden"
			>
				{items.map((item) => (
					<Link
						key={item.href}
						to={item.href}
						className="block py-2.5 text-sm text-muted-foreground"
					>
						{item.label}
					</Link>
				))}
				<a
					href={profile.resumePath}
					target="_blank"
					rel="noreferrer"
					className="block py-2.5 text-sm text-muted-foreground"
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
