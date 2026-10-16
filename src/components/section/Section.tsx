import type { ReactNode } from "react";
import { Eyebrow } from "@/components/section/Eyebrow";
import { SectionHeading } from "@/components/section/SectionHeading";

interface SectionProps {
	id: string;
	number: string;
	eyebrow: string;
	title: string;
	children: ReactNode;
}

/**
 * Every section opens the same way: an index in ember, a rule, the eyebrow,
 * and — on the far side — the section's path, as if the page were a
 * repository and each section a directory in it. The path is decoration and
 * hidden from assistive tech; the heading is what names the region.
 */
export function Section({
	id,
	number,
	eyebrow,
	title,
	children,
}: SectionProps) {
	const headingId = `${id}-heading`;

	return (
		<section
			id={id}
			aria-labelledby={headingId}
			className="relative scroll-mt-20 py-20 md:py-28"
		>
			<div className="mx-auto max-w-7xl px-5 sm:px-8">
				<div className="flex items-center gap-3">
					<span className="font-mono text-[11px] tracking-[0.18em] text-accent">
						{number}
					</span>
					<span aria-hidden="true" className="h-px w-10 bg-line" />
					<Eyebrow>{eyebrow}</Eyebrow>
					<span
						aria-hidden="true"
						className="ml-auto hidden font-mono text-[11px] text-faint sm:block"
					>
						~/{id}
					</span>
				</div>
				<SectionHeading className="max-w-[20ch]">
					<span id={headingId}>{title}</span>
				</SectionHeading>
				<div className="mt-14 md:mt-16">{children}</div>
			</div>
		</section>
	);
}
