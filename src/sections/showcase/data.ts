import { profile } from "@/data/profile";
import { roles } from "@/data/roles";
import { type StackGroup, stackGroups } from "@/data/stack";

export interface YearCount {
	year: number;
	tools: { name: string; group: string }[];
}

/**
 * Every tool in the Stack section, bucketed by the year it came into daily
 * use. Years with nothing new stay in as zero: a gap in the axis would hide
 * exactly the kind of pause a reader might want to ask about.
 */
export function toolsByYear(groups: StackGroup[] = stackGroups): YearCount[] {
	const tools = groups.flatMap((group) =>
		group.items.map((item) => ({
			name: item.name,
			group: group.name,
			year: Number(item.since),
		})),
	);
	const years = tools.map((tool) => tool.year);
	const first = Math.min(...years);
	const last = Math.max(...years);
	return Array.from({ length: last - first + 1 }, (_, index) => {
		const year = first + index;
		return {
			year,
			tools: tools
				.filter((tool) => tool.year === year)
				.map(({ name, group }) => ({ name, group })),
		};
	});
}

/** The role that was under way in a given year, newest first. */
export function roleInYear(year: number) {
	return roles.find((role) => {
		const [start, end] = role.period.split(/\s+—\s+/);
		const from = Number(start.match(/\d{4}/)?.[0]);
		const to = /present/i.test(end)
			? Number.POSITIVE_INFINITY
			: Number(end.match(/\d{4}/)?.[0]);
		return from <= year && year <= to;
	});
}

export interface Place {
	id: string;
	label: string;
	detail: string;
	lat: number;
	lon: number;
	timeZone: string;
}

/*
 * The two places the work happens between, both stated elsewhere on the site:
 * where I am (profile.location), and the everviz product group I work with
 * (the analytics-platform case study's team line). Norway is placed by
 * country rather than city, because a city is not something the site claims.
 */
export const PLACES: Place[] = [
	{
		id: "dhaka",
		label: profile.location.split(",")[0],
		detail: `Where I work · ${profile.timezone}`,
		lat: 23.81,
		lon: 90.41,
		timeZone: profile.timeZoneId,
	},
	{
		id: "norway",
		label: "Norway",
		detail: "everviz product group",
		lat: 61,
		lon: 9,
		timeZone: "Europe/Oslo",
	},
];
