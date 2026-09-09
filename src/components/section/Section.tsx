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
			className="scroll-mt-24 border-t border-line py-20 md:py-28"
		>
			<div className="mx-auto max-w-6xl px-5 sm:px-8">
				<div className="flex items-baseline gap-4">
					<span className="font-mono text-[11px] tracking-[0.18em] text-faint">
						{number}
					</span>
					<Eyebrow>{eyebrow}</Eyebrow>
				</div>
				<SectionHeading className="max-w-[22ch]">
					<span id={headingId}>{title}</span>
				</SectionHeading>
				<div className="mt-10">{children}</div>
			</div>
		</section>
	);
}
