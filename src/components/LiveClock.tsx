import { useEffect, useState } from "react";

/** Formats a moment as 24-hour HH:MM in the given IANA zone. */
export function formatClock(date: Date, timeZone: string): string {
	return new Intl.DateTimeFormat("en-GB", {
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23",
		timeZone,
	}).format(date);
}

/**
 * The time where I am, right now. A real reading rather than a decoration:
 * someone deciding when to expect a reply from UTC+6 wants exactly this.
 * Re-reads every fifteen seconds, which is often enough that the minute never
 * visibly lags and rare enough to cost nothing.
 */
export function LiveClock({
	timeZone,
	className,
}: {
	timeZone: string;
	className?: string;
}) {
	const [now, setNow] = useState(() => new Date());

	useEffect(() => {
		const id = window.setInterval(() => setNow(new Date()), 15_000);
		return () => window.clearInterval(id);
	}, []);

	return (
		<time dateTime={now.toISOString()} className={className}>
			{formatClock(now, timeZone)}
		</time>
	);
}
