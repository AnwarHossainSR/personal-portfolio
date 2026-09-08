export interface RecognitionItem {
	title: string;
	issuer: string;
	year: string;
	note?: string;
}

/**
 * Real, attributable recognition only. This is where the previous version of
 * this site displayed self-issued "certifications" with an issuer of
 * "Portfolio and product workflow experience" and a verified badge — the
 * single most damaging thing on it. An empty array is a perfectly good state;
 * an invented entry is not.
 */
export const recognition: RecognitionItem[] = [
	{
		title: "Best Employee of the Year",
		issuer: "BJIT Group Ltd.",
		year: "2023",
		note: "Awarded for sustained delivery and cross-team impact across multiple product lines.",
	},
];
