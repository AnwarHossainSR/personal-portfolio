import React from "react";
import { CustomCursor } from "./CustomCursor";
import { Footer } from "./Footer";
import { InteractiveBackground } from "./InteractiveBackground";
import { Navigation } from "./Navigation";

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
