import {
	type ElementType,
	type ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";
import { useReducedMotion } from "@/motion/useReducedMotion";

/**
 * Scroll reveal without a dependency. The reference implementation this was
 * taken from uses framer-motion; that is ~30 kB gzip for one fade and a
 * translate, on a bundle that has already missed its budget. An
 * IntersectionObserver plus a CSS transition is the same effect, and the
 * pattern is already in the codebase (AnchorNav).
 */
interface RevealProps {
	children: ReactNode;
	/** Seconds. Stagger a list with `delay={index * 0.08}`. */
	delay?: number;
	className?: string;
	as?: ElementType;
}

// If the observer never fires — no IntersectionObserver, a stubbed one in
// tests, a browser that mis-reports an element inside a transformed ancestor —
// the content reveals anyway. Content must never be trapped behind an
// animation that did not run.
const FALLBACK_REVEAL_MS = 1200;

export function Reveal({
	children,
	delay = 0,
	className,
	as: Tag = "div",
}: RevealProps) {
	const reduced = useReducedMotion();
	const ref = useRef<HTMLElement | null>(null);
	const [shown, setShown] = useState(false);

	useEffect(() => {
		if (reduced) return;
		const node = ref.current;
		if (!node) return;

		const fallback = window.setTimeout(
			() => setShown(true),
			FALLBACK_REVEAL_MS,
		);

		if (typeof IntersectionObserver === "undefined") {
			setShown(true);
			return () => window.clearTimeout(fallback);
		}

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					setShown(true);
					// once: true — a section that has arrived stays arrived.
					observer.unobserve(entry.target);
				}
			},
			{ rootMargin: "0px 0px -64px 0px" },
		);
		observer.observe(node);

		return () => {
			window.clearTimeout(fallback);
			observer.disconnect();
		};
	}, [reduced]);

	if (reduced) {
		return <Tag className={className}>{children}</Tag>;
	}

	return (
		<Tag
			ref={ref}
			className={className}
			style={{
				opacity: shown ? 1 : 0,
				transform: shown ? "none" : "translateY(26px)",
				filter: shown ? "none" : "blur(5px)",
				transition:
					"opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
				transitionDelay: delay ? `${delay}s` : undefined,
				willChange: shown ? undefined : "opacity, transform",
			}}
		>
			{children}
		</Tag>
	);
}
