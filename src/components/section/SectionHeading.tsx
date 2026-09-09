import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<h2
			className={cn(
				"mt-3 font-display text-4xl font-medium leading-[1.08] tracking-tight text-ink md:text-5xl",
				className,
			)}
		>
			{children}
		</h2>
	);
}
