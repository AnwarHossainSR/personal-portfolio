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
				"mt-6 font-display text-[2.5rem] font-semibold leading-[1.04] tracking-[-0.04em] text-ink sm:text-5xl md:text-6xl",
				className,
			)}
		>
			{children}
		</h2>
	);
}
