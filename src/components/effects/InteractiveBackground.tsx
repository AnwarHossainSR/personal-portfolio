import { useEffect, useRef } from "react";

interface Particle {
	x: number;
	y: number;
	vx: number;
	vy: number;
	size: number;
	baseOpacity: number;
	hue: number;
}

/**
 * A single, cohesive ambient background inspired by Vercel / Linear:
 *  - a soft cursor spotlight that *persists* and eases toward the pointer
 *  - a dotted grid that subtly lights up around the cursor
 *  - a lightweight, mouse-aware particle constellation for depth
 *
 * Theme-aware (dark/light) and respects `prefers-reduced-motion`.
 */
export function InteractiveBackground() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const overlayRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const overlay = overlayRef.current;
		if (!canvas || !overlay) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const prefersReduced =
			window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

		let width = window.innerWidth;
		let height = window.innerHeight;
		let dpr = Math.min(window.devicePixelRatio || 1, 2);

		const mouse = { x: width / 2, y: height / 2 };
		const glow = { x: mouse.x, y: mouse.y };

		const isLight = () => document.documentElement.classList.contains("light");
		const rand = (a: number, b: number) => Math.random() * (b - a) + a;

		const resize = () => {
			width = window.innerWidth;
			height = window.innerHeight;
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = Math.floor(width * dpr);
			canvas.height = Math.floor(height * dpr);
			canvas.style.width = `${width}px`;
			canvas.style.height = `${height}px`;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		};

		const particles: Particle[] = [];
		const initParticles = () => {
			particles.length = 0;
			if (prefersReduced) return;
			const count = Math.min(64, Math.floor((width * height) / 28000));
			for (let i = 0; i < count; i++) {
				particles.push({
					x: Math.random() * width,
					y: Math.random() * height,
					vx: rand(-0.14, 0.14),
					vy: rand(-0.14, 0.14),
					size: rand(1, 2.3),
					baseOpacity: rand(0.2, 0.55),
					hue: rand(188, 258),
				});
			}
		};

		const updateOverlay = () => {
			overlay.style.setProperty("--mx", `${glow.x}px`);
			overlay.style.setProperty("--my", `${glow.y}px`);
		};

		const onMove = (x: number, y: number) => {
			mouse.x = x;
			mouse.y = y;
			if (prefersReduced) {
				glow.x = x;
				glow.y = y;
				updateOverlay();
			}
		};
		const handleMouse = (e: MouseEvent) => onMove(e.clientX, e.clientY);
		const handleTouch = (e: TouchEvent) => {
			const t = e.touches[0];
			if (t) onMove(t.clientX, t.clientY);
		};

		let animationId = 0;
		const animate = () => {
			const light = isLight();

			// Persistent, eased spotlight follow
			glow.x += (mouse.x - glow.x) * 0.08;
			glow.y += (mouse.y - glow.y) * 0.08;
			updateOverlay();

			ctx.clearRect(0, 0, width, height);

			const connectDist = 130;
			for (let i = 0; i < particles.length; i++) {
				const p = particles[i];

				// Gentle attraction toward the cursor
				const dx = mouse.x - p.x;
				const dy = mouse.y - p.y;
				const dist = Math.hypot(dx, dy);
				if (dist < 180) {
					const f = (180 - dist) / 180;
					p.x += dx * f * 0.008;
					p.y += dy * f * 0.008;
				}

				p.x += p.vx;
				p.y += p.vy;
				if (p.x < 0 || p.x > width) p.vx *= -1;
				if (p.y < 0 || p.y > height) p.vy *= -1;
				p.x = Math.max(0, Math.min(width, p.x));
				p.y = Math.max(0, Math.min(height, p.y));

				ctx.beginPath();
				ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
				ctx.fillStyle = light
					? `hsla(${p.hue}, 70%, 45%, ${p.baseOpacity * 0.55})`
					: `hsla(${p.hue}, 85%, 68%, ${p.baseOpacity})`;
				ctx.fill();

				// Connect nearby particles
				for (let j = i + 1; j < particles.length; j++) {
					const o = particles[j];
					const lx = p.x - o.x;
					const ly = p.y - o.y;
					const d = Math.hypot(lx, ly);
					if (d < connectDist) {
						const op = (1 - d / connectDist) * (light ? 0.1 : 0.16);
						ctx.beginPath();
						ctx.moveTo(p.x, p.y);
						ctx.lineTo(o.x, o.y);
						ctx.strokeStyle = light
							? `hsla(245, 55%, 45%, ${op})`
							: `hsla(225, 90%, 74%, ${op})`;
						ctx.lineWidth = 1;
						ctx.stroke();
					}
				}
			}

			// Persistent cursor glow rendered onto the canvas
			ctx.save();
			ctx.globalCompositeOperation = light ? "source-over" : "lighter";
			const r = 170;
			const g = ctx.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, r);
			if (light) {
				g.addColorStop(0, "hsla(252, 83%, 60%, 0.08)");
				g.addColorStop(1, "hsla(252, 83%, 60%, 0)");
			} else {
				g.addColorStop(0, "hsla(252, 95%, 70%, 0.12)");
				g.addColorStop(0.5, "hsla(188, 92%, 58%, 0.06)");
				g.addColorStop(1, "hsla(252, 95%, 68%, 0)");
			}
			ctx.beginPath();
			ctx.arc(glow.x, glow.y, r, 0, Math.PI * 2);
			ctx.fillStyle = g;
			ctx.fill();
			ctx.restore();

			animationId = requestAnimationFrame(animate);
		};

		resize();
		initParticles();
		updateOverlay();

		if (!prefersReduced) animate();

		const handleResize = () => {
			resize();
			initParticles();
		};
		window.addEventListener("resize", handleResize);
		window.addEventListener("mousemove", handleMouse);
		window.addEventListener("touchmove", handleTouch, { passive: true });

		return () => {
			window.removeEventListener("resize", handleResize);
			window.removeEventListener("mousemove", handleMouse);
			window.removeEventListener("touchmove", handleTouch);
			cancelAnimationFrame(animationId);
		};
	}, []);

	return (
		<>
			<div
				ref={overlayRef}
				aria-hidden="true"
				className="bg-grid-reveal fixed inset-0 z-0 pointer-events-none"
			/>
			<canvas
				ref={canvasRef}
				className="fixed inset-0 z-0 pointer-events-none"
				style={{ background: "transparent" }}
			/>
		</>
	);
}
