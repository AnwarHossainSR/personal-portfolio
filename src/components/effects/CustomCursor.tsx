import { useEffect, useRef } from "react";

const INTERACTIVE_SELECTOR =
	'a, button, [role="button"], input, textarea, select, label, summary, .cursor-pointer';

/**
 * A refined two-part cursor: a precise dot that tracks the pointer exactly and
 * a soft ring that eases behind it, growing when hovering interactive elements.
 * Only enabled for fine pointers (mouse/trackpad) and when motion is allowed.
 */
export function CustomCursor() {
	const dotRef = useRef<HTMLDivElement>(null);
	const ringRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const finePointer = window.matchMedia?.("(pointer: fine)").matches ?? false;
		const prefersReduced =
			window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
		if (!finePointer || prefersReduced) return;

		const dot = dotRef.current;
		const ring = ringRef.current;
		if (!dot || !ring) return;

		const root = document.documentElement;
		root.classList.add("custom-cursor-active");

		const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
		const ringPos = { x: mouse.x, y: mouse.y };
		let visible = false;
		let hovering = false;
		let raf = 0;

		const onMove = (e: MouseEvent) => {
			mouse.x = e.clientX;
			mouse.y = e.clientY;

			if (!visible) {
				visible = true;
				dot.style.opacity = "1";
				ring.style.opacity = "1";
			}

			dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;

			const target = e.target as Element | null;
			const isInteractive = !!target?.closest?.(INTERACTIVE_SELECTOR);
			if (isInteractive !== hovering) {
				hovering = isInteractive;
				ring.classList.toggle("cursor-ring--hover", hovering);
			}
		};

		const onLeave = () => {
			visible = false;
			dot.style.opacity = "0";
			ring.style.opacity = "0";
		};
		const onEnter = () => {
			visible = true;
			dot.style.opacity = "1";
			ring.style.opacity = "1";
		};
		const onDown = () => ring.classList.add("cursor-ring--down");
		const onUp = () => ring.classList.remove("cursor-ring--down");

		const render = () => {
			ringPos.x += (mouse.x - ringPos.x) * 0.18;
			ringPos.y += (mouse.y - ringPos.y) * 0.18;
			ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;
			raf = requestAnimationFrame(render);
		};

		window.addEventListener("mousemove", onMove);
		document.addEventListener("mouseleave", onLeave);
		document.addEventListener("mouseenter", onEnter);
		window.addEventListener("mousedown", onDown);
		window.addEventListener("mouseup", onUp);
		raf = requestAnimationFrame(render);

		return () => {
			root.classList.remove("custom-cursor-active");
			window.removeEventListener("mousemove", onMove);
			document.removeEventListener("mouseleave", onLeave);
			document.removeEventListener("mouseenter", onEnter);
			window.removeEventListener("mousedown", onDown);
			window.removeEventListener("mouseup", onUp);
			cancelAnimationFrame(raf);
		};
	}, []);

	return (
		<>
			<div ref={ringRef} className="cursor-ring" aria-hidden="true" />
			<div ref={dotRef} className="cursor-dot" aria-hidden="true" />
		</>
	);
}
