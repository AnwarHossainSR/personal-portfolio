import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
	/** Small uppercase label shown above the title. */
	eyebrow?: string;
	/** The main heading. Wrap part of it in <span className="gradient-text"> for accent. */
	title: ReactNode;
	/** Optional supporting copy shown below the title. */
	subtitle?: ReactNode;
	/** Alignment of the block. Defaults to centered. */
	align?: "center" | "left";
	/** Heading element to render. Use "h1" for page titles. Defaults to "h2". */
	as?: "h1" | "h2";
	className?: string;
}

/**
 * A consistent, polished heading used across pages: an accent eyebrow label,
 * a bold title, and an optional subtitle — keeping every section on-brand.
 */
export function SectionHeading({
	eyebrow,
	title,
	subtitle,
	align = "center",
	as: Heading = "h2",
	className,
}: SectionHeadingProps) {
	return (
		<div
			className={cn(
				"max-w-3xl",
				align === "center" ? "mx-auto text-center" : "text-left",
				className,
			)}
		>
			{eyebrow && (
				<div
					className={cn(
						"inline-flex items-center gap-2 mb-4",
						align === "center" ? "mx-auto" : "",
					)}
				>
					<span className="h-px w-6 bg-gradient-to-r from-transparent to-primary/60" />
					<span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/90">
						{eyebrow}
					</span>
					<span className="h-px w-6 bg-gradient-to-l from-transparent to-primary/60" />
				</div>
			)}
			<Heading className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
				{title}
			</Heading>
			{subtitle && (
				<p className="mt-4 text-sm sm:text-lg text-muted-foreground/80 leading-relaxed text-balance">
					{subtitle}
				</p>
			)}
		</div>
	);
}
