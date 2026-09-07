import type { EvidenceLevel } from "@/content/schema";

const LABELS: Record<EvidenceLevel, { text: string; hint: string }> = {
	measured: {
		text: "Measured",
		hint: "Numbers below come with the instrument and window used to collect them.",
	},
	estimated: {
		text: "Estimated",
		hint: "Numbers below are defensible approximations, not instrumented measurements.",
	},
	qualitative: {
		text: "No metrics claimed",
		hint: "I do not have figures I can source for this work, so none are given.",
	},
};

export function EvidenceBadge({ level }: { level: EvidenceLevel }) {
	const label = LABELS[level];

	return (
		<span
			title={label.hint}
			className="inline-flex items-center rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
		>
			{label.text}
		</span>
	);
}

export { LABELS as EVIDENCE_LABELS };
