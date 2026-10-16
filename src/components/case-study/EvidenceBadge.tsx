import { EVIDENCE_LABELS as LABELS } from "@/content/evidence";
import type { EvidenceLevel } from "@/content/schema";
import { cn } from "@/lib/utils";

const DOTS: Record<EvidenceLevel, string> = {
	measured: "bg-signal",
	estimated: "bg-accent",
	qualitative: "bg-faint",
};

export function EvidenceBadge({ level }: { level: EvidenceLevel }) {
	const label = LABELS[level];

	return (
		<span title={label.hint} className="chip">
			<span
				aria-hidden="true"
				className={cn("h-1.5 w-1.5 rounded-full", DOTS[level])}
			/>
			{label.text}
		</span>
	);
}

export { LABELS as EVIDENCE_LABELS };
