import {
	Bot,
	Boxes,
	Clapperboard,
	Cloud,
	LayoutDashboard,
	type LucideIcon,
	Rocket,
	Server,
} from "lucide-react";
import { Eyebrow, Section } from "@/components/section";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";
import { Reveal } from "@/motion/Reveal";
import { useSpotlight } from "@/motion/useSpotlight";
import { McpDiagram } from "@/sections/McpDiagram";

/*
 * Icons are chosen from the capability's title rather than stored with the
 * data, so the content file stays content. Order matters: the AI pattern is
 * tested first and on word boundaries, because "Media" and "automation" both
 * contain the letters.
 */
const ICONS: [RegExp, LucideIcon][] = [
	[/\bai\b|mcp/i, Bot],
	[/backend|service/i, Server],
	[/aws|infra|cloud/i, Cloud],
	[/media|video|export/i, Clapperboard],
	[/release|deploy|pipeline/i, Rocket],
	[/interface|front/i, LayoutDashboard],
];

function iconFor(title: string): LucideIcon {
	return ICONS.find(([pattern]) => pattern.test(title))?.[1] ?? Boxes;
}

const isAgentic = (title: string) => /\bai\b|mcp/i.test(title);

/*
 * On a three-column grid, widening the second and fourth tiles makes the six
 * capabilities and the creed tile a clean 1+2 / 1+2 / 1+1+1. The two that
 * widen are the ones with the most to say: AWS has the longest body, and the
 * AI tile carries its diagram.
 */
const WIDE = new Set([1, 3]);

export function WhatIDo() {
	const onPointerMove = useSpotlight();

	return (
		<Section
			id="what-i-do"
			number="01"
			eyebrow="Capabilities"
			title="What I can do for your team"
		>
			<div
				onPointerMove={onPointerMove}
				className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
			>
				{profile.capabilities.map((capability, index) => {
					const Icon = iconFor(capability.title);
					const agentic = isAgentic(capability.title);
					return (
						<Reveal
							key={capability.title}
							delay={(index % 3) * 0.08}
							data-arcade-ground
							className={cn(
								"spotlight panel flex flex-col p-6 md:p-7",
								WIDE.has(index) && "lg:col-span-2",
								agentic && "border-accent/30",
							)}
						>
							<div className="flex items-center justify-between">
								<span
									className={cn(
										"grid h-10 w-10 place-items-center rounded-xl border",
										agentic
											? "border-accent/40 bg-accent/10 text-accent"
											: "border-line bg-surface-deep text-muted",
									)}
								>
									<Icon className="h-[18px] w-[18px]" aria-hidden="true" />
								</span>
								<span className="font-mono text-[11px] text-faint">
									{String(index + 1).padStart(2, "0")}
								</span>
							</div>
							<h3 className="mt-6 font-display text-xl font-semibold tracking-[-0.02em] text-ink md:text-2xl">
								{capability.title}
							</h3>
							<p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-muted">
								{capability.body}
							</p>
							{agentic && (
								<div className="mt-auto pt-6">
									<McpDiagram />
								</div>
							)}
						</Reveal>
					);
				})}

				<Reveal
					delay={0.16}
					data-arcade-ground
					className="panel relative flex flex-col justify-between overflow-hidden bg-surface-deep/60 p-6 md:col-span-2 md:p-7 lg:col-span-1"
				>
					<div
						aria-hidden="true"
						className="halo -bottom-24 -right-24 h-64 w-64"
					/>
					<Eyebrow>The work</Eyebrow>
					<p className="relative mt-8 max-w-[24ch] font-serif text-[1.9rem] italic leading-[1.15] text-ink">
						{profile.creed}
					</p>
				</Reveal>
			</div>
		</Section>
	);
}
