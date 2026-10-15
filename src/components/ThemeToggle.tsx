import { Moon, Sun } from "lucide-react";
import type { MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { resolveTheme, toggleTheme, useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

type TransitionDocument = Document & {
	startViewTransition?: (update: () => void) => { ready: Promise<void> };
};

/**
 * Where the View Transitions API exists, the new theme is revealed as a
 * circle growing out of this button; everywhere else, and under reduced
 * motion, the switch is instant. Either way the theme itself changes the same
 * way — the transition only decides how the change is painted.
 */
function toggleFrom(event: MouseEvent<HTMLButtonElement>) {
	const doc = document as TransitionDocument;
	const reduced = window.matchMedia?.(
		"(prefers-reduced-motion: reduce)",
	).matches;
	if (!doc.startViewTransition || reduced) {
		toggleTheme();
		return;
	}

	const rect = event.currentTarget.getBoundingClientRect();
	const x = rect.left + rect.width / 2;
	const y = rect.top + rect.height / 2;
	const radius = Math.hypot(
		Math.max(x, window.innerWidth - x),
		Math.max(y, window.innerHeight - y),
	);

	const transition = doc.startViewTransition(toggleTheme);
	void transition.ready.then(() => {
		document.documentElement.animate(
			{
				clipPath: [
					`circle(0px at ${x}px ${y}px)`,
					`circle(${radius}px at ${x}px ${y}px)`,
				],
			},
			{
				duration: 560,
				easing: "cubic-bezier(0.16, 1, 0.3, 1)",
				pseudoElement: "::view-transition-new(root)",
			},
		);
	});
}

export function ThemeToggle({ className }: { className?: string }) {
	const { theme } = useTheme();
	const next = resolveTheme(theme) === "light" ? "dark" : "light";

	return (
		<Button
			variant="ghost"
			size="sm"
			onClick={toggleFrom}
			className={cn(
				"relative h-9 w-9 rounded-full border border-line/80 bg-surface/60 p-0 text-muted transition-colors hover:bg-surface-deep hover:text-ink",
				className,
			)}
			aria-label={`Switch to ${next} mode`}
		>
			<Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
			<Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
		</Button>
	);
}
