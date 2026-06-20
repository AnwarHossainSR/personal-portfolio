import React from "react";
import { CustomCursor } from "@/components/effects/CustomCursor";
import { InteractiveBackground } from "@/components/effects/InteractiveBackground";
import { Footer } from "@/components/layout/Footer";
import { Navigation } from "@/components/layout/Navigation";

interface LayoutProps {
	children: React.ReactNode;
}

export const Layout = React.memo(({ children }: LayoutProps) => {
	return (
		<div className="min-h-screen bg-background relative">
			<InteractiveBackground />
			<CustomCursor />
			<div className="relative z-10">
				<Navigation />
				<main className="relative">{children}</main>
				<Footer />
			</div>
		</div>
	);
});
