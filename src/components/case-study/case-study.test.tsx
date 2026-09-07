import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DecisionBlock } from "@/components/case-study/DecisionBlock";
import { EvidenceBadge } from "@/components/case-study/EvidenceBadge";
import { ResultsTable } from "@/components/case-study/ResultsTable";

const decision = {
	question: "How do we make large uploads survive a dropped connection?",
	chose: "Direct-to-S3 multipart uploads with presigned URLs",
	rejected: [
		{
			option: "Keep proxying uploads through the API",
			why: "A deploy during an upload would kill the transfer regardless of retries",
		},
	],
	tradeoff:
		"Validation moved after the upload, so rejected files consume storage.",
};

const results = [
	{
		metric: "Failed uploads over 1GB",
		before: "18% of attempts",
		after: "under 2% of attempts",
		method:
			"Ingest service logs, 30 days either side of the cutover, same editor cohort",
	},
];

describe("EvidenceBadge", () => {
	it("labels measured evidence", () => {
		render(<EvidenceBadge level="measured" />);
		expect(screen.getByText("Measured")).toBeInTheDocument();
	});

	it("labels qualitative evidence honestly rather than hiding it", () => {
		render(<EvidenceBadge level="qualitative" />);
		expect(screen.getByText("No metrics claimed")).toBeInTheDocument();
	});
});

describe("DecisionBlock", () => {
	it("shows the question, the choice, the rejected option with its reason, and the cost", () => {
		render(<DecisionBlock decision={decision} index={0} />);
		expect(screen.getByText(decision.question)).toBeInTheDocument();
		expect(screen.getByText(decision.chose)).toBeInTheDocument();
		expect(screen.getByText(decision.rejected[0].option)).toBeInTheDocument();
		expect(screen.getByText(decision.rejected[0].why)).toBeInTheDocument();
		expect(screen.getByText(decision.tradeoff)).toBeInTheDocument();
	});
});

describe("ResultsTable", () => {
	it("renders the method alongside every number", () => {
		render(<ResultsTable results={results} />);
		expect(screen.getByText(results[0].method)).toBeInTheDocument();
		expect(screen.getByText("18% of attempts")).toBeInTheDocument();
	});

	it("renders nothing when there are no results", () => {
		const { container } = render(<ResultsTable results={[]} />);
		expect(container).toBeEmptyDOMElement();
	});
});
