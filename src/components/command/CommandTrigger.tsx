import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { setPaletteOpen } from "@/components/command/store";
import { cn } from "@/lib/utils";

/** "⌘" on Apple platforms, "Ctrl" everywhere else. */
export function useModifierLabel(): string {
	const [label, setLabel] = useState("⌘");
	useEffect(() => {
		if (!/Mac|iPhone|iPad/i.test(navigator.userAgent)) setLabel("Ctrl");
	}, []);
	return label;
}

export function CommandTrigger({ className }: { className?: string }) {
	const modifier = useModifierLabel();

	return (
		<button
			type="button"
			onClick={() => setPaletteOpen(true)}
			aria-label="Open command palette"
			aria-haspopup="dialog"
			aria-keyshortcuts="Meta+K Control+K"
			title={`Jump anywhere (${modifier} K)`}
			className={cn(
				"group inline-flex h-9 min-w-9 items-center justify-center gap-2 rounded-full border border-line/80 bg-surface/60 px-2.5 text-[13px] sm:justify-start sm:pl-3 sm:pr-1.5 text-muted transition-colors hover:border-line hover:text-ink",
				className,
			)}
		>
			<Search className="h-3.5 w-3.5" aria-hidden="true" />
			<span className="hidden xl:inline">Jump to…</span>
			<span className="hidden items-center gap-0.5 sm:flex" aria-hidden="true">
				<kbd className="kbd">{modifier}</kbd>
				<kbd className="kbd">K</kbd>
			</span>
		</button>
	);
}
