import { describe, expect, it } from "vitest";
import { formatClock } from "@/components/LiveClock";
import { profile } from "@/data/profile";

describe("formatClock", () => {
	it("reads the time in the profile's zone, not the visitor's", () => {
		const moment = new Date("2026-10-15T15:47:00Z");
		expect(formatClock(moment, profile.timeZoneId)).toBe("21:47");
		expect(formatClock(moment, "UTC")).toBe("15:47");
	});

	it("uses a 24-hour clock with no midnight 24", () => {
		expect(formatClock(new Date("2026-10-15T18:05:00Z"), "Asia/Dhaka")).toBe(
			"00:05",
		);
	});

	it("labels the zone the way the profile does", () => {
		// Asia/Dhaka has not observed daylight saving since 2009.
		const offset = new Intl.DateTimeFormat("en-GB", {
			timeZone: profile.timeZoneId,
			timeZoneName: "shortOffset",
		})
			.formatToParts(new Date("2026-01-01T00:00:00Z"))
			.find((part) => part.type === "timeZoneName")?.value;
		expect(offset?.replace("GMT", "UTC")).toBe(profile.timezone);
	});
});
