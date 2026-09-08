import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Constrains running text to a readable measure. Long-form case studies are the
 * point of this site, and full-width paragraphs on a 1440px display are the
 * fastest way to make nobody read them.
 */
export function Prose({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"max-w-[68ch] text-[17px] leading-[1.75] text-muted",
				className,
			)}
		>
			{children}
		</div>
	);
}
