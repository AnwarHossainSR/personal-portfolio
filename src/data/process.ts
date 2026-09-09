export interface ProcessStep {
	title: string;
	body: string;
}

/**
 * How the work actually goes, stated as three steps. Written to be true of the
 * case studies on this site rather than as a generic agency methodology — if a
 * step here does not describe how a piece of work in the Work section went,
 * the step is wrong.
 */
export const processSteps: ProcessStep[] = [
	{
		title: "Find the constraint",
		body: "Before anything gets designed I want to know what actually boxes the solution in — the deploy schedule, the team that has to maintain it, the system upstream that will not change. Most bad architecture is a good idea applied to the wrong constraint.",
	},
	{
		title: "Ship the smaller change",
		body: "The version that survives is usually smaller than the one first proposed. I would rather put a narrow thing into production and learn from it than land a broad one that nobody can operate.",
	},
	{
		title: "Make it someone else's to run",
		body: "Work is not finished when it passes review. It is finished when another engineer can deploy it, debug it at two in the morning, and change it without asking me what I was thinking.",
	},
];
