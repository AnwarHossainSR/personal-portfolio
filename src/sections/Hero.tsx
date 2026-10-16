import { ArrowRight, FileText, Github, Linkedin } from "lucide-react";
import { Fragment } from "react";
import { LiveClock } from "@/components/LiveClock";
import { profile } from "@/data/profile";
import { roles } from "@/data/roles";
import { cn } from "@/lib/utils";
import { AgentTrace } from "@/sections/AgentTrace";

// profile.positioning is short declarative sentences separated by ". ".
// Splitting on the space that follows a period (lookbehind, not consumed)
// lets each sentence be one step of the plan inside the single h1, while every
// text node still concatenates back to the exact source string, spaces
// included, so the element keeps one accessible name equal to
// profile.positioning. The step numbers are generated content with empty alt
// text (index.css, .plan-step), so they never join that name.
const positioningLines = profile.positioning.split(/(?<=\.)\s+/);

// The first sentence of the availability line is the status; the rest is
// detail that belongs with the contact section.
const status = profile.availability.split(/(?<=\.)\s+/)[0];

const LINK_ICONS: Record<string, typeof Github> = {
	GitHub: Github,
	LinkedIn: Linkedin,
};

export function Hero() {
	const current = roles[0];

	return (
		<section id="top" className="relative isolate overflow-hidden">
			<div aria-hidden="true" className="dot-field" />
			<div
				aria-hidden="true"
				className="halo -right-40 -top-32 h-[44rem] w-[44rem]"
			/>

			<div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-16 px-5 pb-20 pt-14 sm:px-8 md:pt-20 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:items-center lg:gap-12 lg:pb-24 lg:pt-14">
				<div>
					<p className="hero-rise hero-rise-1 inline-flex max-w-full items-center gap-2.5 rounded-full border border-signal/25 bg-signal/[0.07] py-1 pl-3 pr-3.5 text-[13px] text-ink">
						<span className="live-dot" aria-hidden="true" />
						{status}
					</p>

					<h1 className="hero-rise hero-rise-1 mt-7 font-display text-[2.45rem] font-semibold leading-[1.03] tracking-[-0.045em] text-ink sm:text-[3.4rem] md:text-6xl lg:text-[3.6rem] xl:text-[4.5rem]">
						{positioningLines.map((line, index) => {
							const last = index === positioningLines.length - 1;
							return (
								<Fragment key={line}>
									<span
										data-step={String(index + 1).padStart(2, "0")}
										className={cn(
											"plan-step block",
											last &&
												"caret font-serif font-normal italic tracking-[-0.02em] text-accent",
										)}
									>
										{line}
									</span>
									{last ? null : " "}
								</Fragment>
							);
						})}
					</h1>

					<div className="hero-rise hero-rise-2 mt-8 max-w-xl space-y-4 text-[17px] leading-relaxed text-muted">
						{profile.pitch.map((paragraph, index) => (
							<p key={paragraph} className={index === 0 ? "text-ink/85" : ""}>
								{paragraph}
							</p>
						))}
					</div>

					<div className="hero-rise hero-rise-3 mt-10 flex flex-wrap items-center gap-3">
						<a
							href="#contact"
							className="group inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-paper shadow-lg shadow-accent/25 transition-all hover:shadow-accent/40 hover:brightness-110"
						>
							Get in touch
							<ArrowRight
								className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
								aria-hidden="true"
							/>
						</a>
						<a
							href={profile.resumePath}
							target="_blank"
							rel="noreferrer"
							className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-surface/70 px-5 text-sm text-ink transition-colors hover:bg-surface-deep"
						>
							<FileText className="h-4 w-4 text-muted" aria-hidden="true" />
							Résumé (PDF)
						</a>
						{profile.links.map((link) => {
							const Icon = LINK_ICONS[link.label] ?? ArrowRight;
							return (
								<a
									key={link.href}
									href={link.href}
									target="_blank"
									rel="noreferrer"
									aria-label={link.label}
									title={link.label}
									className="grid h-11 w-11 place-items-center rounded-full border border-line bg-surface/70 text-muted transition-colors hover:bg-surface-deep hover:text-ink"
								>
									<Icon className="h-4 w-4" aria-hidden="true" />
								</a>
							);
						})}
					</div>

					<dl className="hero-rise hero-rise-4 mt-12 grid max-w-xl grid-cols-2 gap-x-8 gap-y-5 border-t border-line/60 pt-6 sm:grid-cols-3">
						<div>
							<dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
								Based in
							</dt>
							<dd className="mt-1.5 text-sm text-ink">{profile.location}</dd>
						</div>
						<div>
							<dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
								Local time
							</dt>
							<dd className="mt-1.5 text-sm text-ink">
								<LiveClock
									timeZone={profile.timeZoneId}
									className="tabular-nums"
								/>{" "}
								<span className="text-faint">{profile.timezone}</span>
							</dd>
						</div>
						<div className="col-span-2 sm:col-span-1">
							<dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
								Currently
							</dt>
							<dd className="mt-1.5 text-sm text-ink">{current.company}</dd>
						</div>
					</dl>
				</div>

				<AgentTrace className="hero-rise hero-rise-2 lg:pl-4" />
			</div>
		</section>
	);
}
