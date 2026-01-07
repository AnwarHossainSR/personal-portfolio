import React from "react";
import { Footer } from "./Footer";
import { InteractiveBackground } from "./InteractiveBackground";
import { Navigation } from "./Navigation";
import { ParticleBackground } from "./ParticleBackground";

interface LayoutProps {
	children: React.ReactNode;
}

export const Layout = React.memo(({ children }: LayoutProps) => {
	return (
		<div className="min-h-screen bg-background relative">
			<ParticleBackground />
			<InteractiveBackground />
			<div className="relative z-10">
				<Navigation />
				<main className="relative">{children}</main>
				<Footer />
			</div>
		</div>
	);
});
