import type { EvidenceLevel } from "@/content/schema";
import { cn } from "@/lib/utils";

const LABELS: Record<
	EvidenceLevel,
	{ text: string; hint: string; dot: string }
> = {
	measured: {
		text: "Measured",
		hint: "Numbers below come with the instrument and window used to collect them.",
		dot: "bg-signal",
	},
	estimated: {
		text: "Estimated",
		hint: "Numbers below are defensible approximations, not instrumented measurements.",
		dot: "bg-accent",
	},
	qualitative: {
		text: "No metrics claimed",
		hint: "I do not have figures I can source for this work, so none are given.",
		dot: "bg-faint",
	},
};

export function EvidenceBadge({ level }: { level: EvidenceLevel }) {
	const label = LABELS[level];

	return (
		<span title={label.hint} className="chip">
			<span
				aria-hidden="true"
				className={cn("h-1.5 w-1.5 rounded-full", label.dot)}
			/>
			{label.text}
		</span>
	);
}

export { LABELS as EVIDENCE_LABELS };
