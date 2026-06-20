import { useEffect, useRef, useState } from "react";

interface StatsCounterProps {
	end: number;
	duration?: number;
	suffix?: string;
	prefix?: string;
	className?: string;
}

export function StatsCounter({
	end,
	duration = 2000,
	suffix = "",
	prefix = "",
	className = "",
}: StatsCounterProps) {
	const [count, setCount] = useState(0);
	const [isVisible, setIsVisible] = useState(false);
	const counterRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !isVisible) {
					setIsVisible(true);
				}
			},
			{ threshold: 0.1 },
		);

		if (counterRef.current) {
			observer.observe(counterRef.current);
		}

		return () => observer.disconnect();
	}, [isVisible]);

	useEffect(() => {
		if (!isVisible) return;

		let startTime: number;
		let animationFrame: number;

		const animate = (currentTime: number) => {
			if (!startTime) startTime = currentTime;
			const progress = Math.min((currentTime - startTime) / duration, 1);

			// Easing function for smooth animation
			const easeOutQuart = 1 - (1 - progress) ** 4;
			setCount(Math.floor(easeOutQuart * end));

			if (progress < 1) {
				animationFrame = requestAnimationFrame(animate);
			}
		};

		animationFrame = requestAnimationFrame(animate);

		return () => cancelAnimationFrame(animationFrame);
	}, [isVisible, end, duration]);

	return (
		<div ref={counterRef} className={`animate-count-up ${className}`}>
			{prefix}
			{count}
			{suffix}
		</div>
	);
}

interface StatsCardProps {
	value: number;
	label: string;
	suffix?: string;
	prefix?: string;
	icon?: React.ReactNode;
}

export function StatsCard({
	value,
	label,
	suffix = "",
	prefix = "",
	icon,
}: StatsCardProps) {
	return (
		<div className="glass-card p-6 sm:p-8 text-center group hover:scale-105 transition-all duration-500">
			{icon && (
				<div className="mb-4 flex justify-center text-primary group-hover:scale-110 transition-transform">
					{icon}
				</div>
			)}
			<div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-2">
				<StatsCounter end={value} suffix={suffix} prefix={prefix} />
			</div>
			<div className="text-sm sm:text-base text-muted-foreground font-medium">
				{label}
			</div>
		</div>
	);
}
