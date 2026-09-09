import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";

export function Layout({ children }: { children: ReactNode }) {
	return (
		<div className="min-h-screen bg-paper">
			<a
				href="#main"
				className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:text-ink focus:ring-2 focus:ring-accent"
			>
				Skip to content
			</a>
			<Navigation />
			<main id="main">{children}</main>
			<Footer />
		</div>
	);
}
