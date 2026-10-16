import { ArrowUpRight, Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { LiveClock } from "@/components/LiveClock";
import { Section } from "@/components/section";
import { profile } from "@/data/profile";

function CopyEmailButton() {
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!copied) return;
		const id = window.setTimeout(() => setCopied(false), 1800);
		return () => window.clearTimeout(id);
	}, [copied]);

	return (
		<button
			type="button"
			onClick={() => {
				void navigator.clipboard?.writeText(profile.email).then(
					() => setCopied(true),
					() => {},
				);
			}}
			aria-label={copied ? "Email address copied" : "Copy email address"}
			className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-surface-deep text-muted transition-colors hover:text-ink"
		>
			{copied ? (
				<Check className="h-4 w-4 text-signal" aria-hidden="true" />
			) : (
				<Copy className="h-4 w-4" aria-hidden="true" />
			)}
		</button>
	);
}

const city = profile.location.split(",")[0];

const rowLabel =
	"font-mono text-[10px] uppercase tracking-[0.18em] text-faint sm:w-24 sm:shrink-0";

export function Contact() {
	return (
		<Section id="contact" number="07" eyebrow="Contact" title="Get in touch">
			<div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
				<div className="space-y-5 text-[17px] leading-relaxed text-muted">
					<p className="flex items-start gap-3 text-ink">
						<span className="live-dot mt-2.5" aria-hidden="true" />
						{profile.availability}
					</p>
					<p>{profile.responseTime}</p>
					<p>
						Email is best. If you are writing about a role, the two things that
						make a reply useful are the team's actual problem and the
						constraints around it.
					</p>

					{profile.teaching && (
						<p className="border-t border-line/60 pt-5 text-sm">
							I also recorded a{" "}
							<a
								href={profile.teaching.href}
								target="_blank"
								rel="noreferrer"
								className="text-ink underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
							>
								{profile.teaching.label}
							</a>{" "}
							for engineers starting out. It is not what I want to be hired for,
							but explaining things is part of how I work on a team.
						</p>
					)}
				</div>

				<div
					data-arcade-ground
					className="panel relative overflow-hidden shadow-elevation-2"
				>
					<div
						aria-hidden="true"
						className="halo -right-32 -top-32 h-80 w-80"
					/>
					<div className="relative flex items-center justify-between gap-4 border-b border-line px-5 py-3 font-mono text-[11px] text-faint sm:px-6">
						<span aria-hidden="true">
							<span className="text-accent">~</span>/contact
						</span>
						<span className="flex items-center gap-2">
							<span className="live-dot" aria-hidden="true" />
							<span>
								{city}{" "}
								<LiveClock
									timeZone={profile.timeZoneId}
									className="tabular-nums text-muted"
								/>
							</span>
						</span>
					</div>

					<dl className="relative divide-y divide-line/60">
						<div className="px-5 py-6 sm:flex sm:items-center sm:gap-6 sm:px-6">
							<dt className={rowLabel}>Email</dt>
							<dd className="mt-2 flex min-w-0 flex-1 items-center justify-between gap-3 sm:mt-0">
								<a
									href={`mailto:${profile.email}`}
									className="min-w-0 break-all font-display text-xl font-semibold tracking-[-0.02em] text-ink transition-colors hover:text-accent sm:text-2xl"
								>
									{profile.email}
								</a>
								<CopyEmailButton />
							</dd>
						</div>
						{profile.links.map((link) => (
							<div
								key={link.href}
								className="px-5 py-4 sm:flex sm:items-center sm:gap-6 sm:px-6"
							>
								<dt className={rowLabel}>{link.label}</dt>
								<dd className="mt-1.5 min-w-0 sm:mt-0">
									<a
										href={link.href}
										target="_blank"
										rel="noreferrer"
										className="group inline-flex items-center gap-1.5 break-all text-[15px] text-ink transition-colors hover:text-accent"
									>
										{link.href.replace(/^https:\/\//, "")}
										<ArrowUpRight
											className="h-4 w-4 shrink-0 text-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
											aria-hidden="true"
										/>
									</a>
								</dd>
							</div>
						))}
						<div className="px-5 py-4 sm:flex sm:items-center sm:gap-6 sm:px-6">
							<dt className={rowLabel}>Location</dt>
							<dd className="mt-1.5 text-[15px] text-ink sm:mt-0">
								{profile.location} · {profile.timezone}
							</dd>
						</div>
						{/*
						 * For the assistant a recruiter asks about me, rather than for
						 * the recruiter: the same content as this page, as plain text a
						 * model can read in one request. Built from the same data.
						 */}
						<div className="px-5 py-4 sm:flex sm:items-center sm:gap-6 sm:px-6">
							<dt className={rowLabel}>For AI agents</dt>
							<dd className="mt-1.5 text-[15px] sm:mt-0">
								<a
									href="/llms.txt"
									className="font-mono text-[14px] text-ink underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
								>
									/llms.txt
								</a>
								<span className="text-muted"> · </span>
								<a
									href="/llms-full.txt"
									className="font-mono text-[14px] text-muted underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
								>
									/llms-full.txt
								</a>
							</dd>
						</div>
					</dl>
				</div>
			</div>
		</Section>
	);
}
