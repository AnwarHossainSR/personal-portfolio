import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { SECTIONS } from "@/components/AnchorNav";
import {
	CommandTrigger,
	useModifierLabel,
} from "@/components/command/CommandTrigger";
import { profile } from "@/data/profile";
import { SOURCE_URL } from "@/data/site";

export function Footer() {
	const modifier = useModifierLabel();
	const year = new Date().getFullYear();

	return (
		<footer
			data-arcade-keep
			className="relative mt-24 overflow-hidden border-t border-line/70"
		>
			<div className="mx-auto max-w-7xl px-5 pt-16 sm:px-8">
				<div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr]">
					<div>
						<p className="font-display text-2xl font-semibold tracking-tight text-ink">
							{profile.name}
						</p>
						<p className="mt-2 text-sm text-muted">
							Senior Software Engineer · {profile.location}
						</p>
						<div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted">
							<CommandTrigger />
							<span>
								or press{" "}
								<span className="font-mono text-[12px] text-ink">
									{modifier} K
								</span>{" "}
								anywhere to jump around.
							</span>
						</div>
					</div>

					<nav aria-label="Footer">
						<p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
							Sections
						</p>
						<ul className="mt-4 space-y-2.5 text-sm">
							{SECTIONS.map((section) => (
								<li key={section.id}>
									<Link
										to={{ pathname: "/", hash: section.id }}
										className="text-muted transition-colors hover:text-ink"
									>
										{section.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					<div>
						<p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
							Elsewhere
						</p>
						<ul className="mt-4 space-y-2.5 text-sm">
							{[
								...profile.links,
								{ label: "Résumé", href: profile.resumePath },
								{ label: "llms.txt, for AI agents", href: "/llms.txt" },
							].map((link) => (
								<li key={link.href}>
									<a
										href={link.href}
										target="_blank"
										rel="noreferrer"
										className="group inline-flex items-center gap-1 text-muted transition-colors hover:text-ink"
									>
										{link.label}
										<ArrowUpRight
											className="h-3.5 w-3.5 opacity-50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
											aria-hidden="true"
										/>
									</a>
								</li>
							))}
						</ul>
					</div>
				</div>

				<div className="mt-14 flex flex-col gap-3 border-t border-line/60 py-6 font-mono text-[11px] text-faint sm:flex-row sm:items-center sm:justify-between">
					<p>
						© {year} {profile.name}
					</p>
					<p>
						React · TypeScript · Tailwind —{" "}
						<a
							href={SOURCE_URL}
							target="_blank"
							rel="noreferrer"
							className="text-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink"
						>
							read the source
						</a>
					</p>
				</div>
			</div>

			<p
				aria-hidden="true"
				className="wordmark pointer-events-none -mb-[0.18em] select-none whitespace-nowrap text-center font-display text-[clamp(3.5rem,14vw,13rem)] font-semibold leading-none tracking-[-0.05em]"
			>
				{profile.name.replace(/^Md\.\s*/, "")}
			</p>
		</footer>
	);
}
