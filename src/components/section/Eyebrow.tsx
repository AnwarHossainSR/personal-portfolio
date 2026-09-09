import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The signature detail of this design: a tiny monospace label above each
 * section heading. Wide tracking is what makes it read as a label rather than
 * as small body text.
 */
export function Eyebrow({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<p
			className={cn(
				"font-mono text-[11px] uppercase tracking-[0.18em] text-muted",
				className,
			)}
		>
			{children}
		</p>
	);
}
