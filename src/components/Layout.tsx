import type { ReactNode } from "react";
import { ArcadeMount } from "@/components/ArcadeMount";
import { CommandMount } from "@/components/command/CommandMount";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { ScrollManager } from "@/components/ScrollManager";

export function Layout({ children }: { children: ReactNode }) {
	return (
		/*
		 * Flex column with a growing main: short pages (the 404, a single note)
		 * would otherwise leave the footer stranded mid-viewport with dead paper
		 * below it.
		 */
		<div className="flex min-h-screen flex-col bg-paper">
			<a
				href="#main"
				className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:text-ink focus:ring-2 focus:ring-accent"
			>
				Skip to content
			</a>
			<ScrollManager />
			<Navigation />
			<main id="main" className="flex-1">
				{children}
			</main>
			<Footer />
			<CommandMount />
			<ArcadeMount />
		</div>
	);
}
