import { useEffect, useRef } from "react";

interface FloatingIcon {
	id: number;
	icon: string;
	x: number;
	y: number;
	size: number;
	duration: number;
	delay: number;
}

const TECH_ICONS = [
	"⚛️", // React
	"📦", // Node.js
	"🐍", // Python
	"☁️", // AWS
	"🐳", // Docker
	"⚡", // Vite
	"🔷", // TypeScript
	"🎨", // Design
	"🚀", // Deployment
	"💾", // Database
	"🔧", // Tools
	"📱", // Mobile
];

export default function FloatingIcons() {
	const containerRef = useRef<HTMLDivElement>(null);
	const icons = useRef<FloatingIcon[]>([]);

	useEffect(() => {
		// Generate random floating icons
		icons.current = Array.from({ length: 12 }, (_, i) => ({
			id: i,
			icon: TECH_ICONS[i % TECH_ICONS.length],
			x: Math.random() * 100,
			y: Math.random() * 100,
			size: 20 + Math.random() * 30,
			duration: 15 + Math.random() * 10,
			delay: Math.random() * 5,
		}));
	}, []);

	return (
		<div
			ref={containerRef}
			className="absolute inset-0 overflow-hidden pointer-events-none opacity-30"
		>
			{icons.current.map((icon) => (
				<div
					key={icon.id}
					className="absolute animate-float-slow"
					style={{
						left: `${icon.x}%`,
						top: `${icon.y}%`,
						fontSize: `${icon.size}px`,
						animationDuration: `${icon.duration}s`,
						animationDelay: `${icon.delay}s`,
					}}
				>
					{icon.icon}
				</div>
			))}
		</div>
	);
}
