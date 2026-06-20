import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * A card wrapper that tracks the pointer and exposes its position via CSS
 * variables (`--spot-x` / `--spot-y`), used by the `.spotlight-card` style to
 * render a soft glow that follows the cursor across the card.
 */
export function SpotlightCard({
	className,
	children,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		e.currentTarget.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
		e.currentTarget.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
	};

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: decorative pointer-tracking glow only
		<div
			className={cn("spotlight-card", className)}
			onMouseMove={handleMove}
			{...props}
		>
			{children}
		</div>
	);
}
