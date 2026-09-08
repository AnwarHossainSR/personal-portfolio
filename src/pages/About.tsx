import { Prose } from "@/components/Prose";
import { SEOHead } from "@/components/SEO";
import { profile } from "@/data/profile";
import { roles } from "@/data/roles";
import { stackGroups } from "@/data/stack";

export default function About() {
	return (
		<>
			<SEOHead
				title="About"
				description={`${profile.name} — ${profile.positioning}`}
				path="/about"
			/>
			<div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
				<header className="max-w-[58ch]">
					<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
						About
					</h1>
					<div className="mt-6 space-y-5 text-[17px] leading-[1.75] text-muted-foreground">
						{profile.pitch.map((paragraph) => (
							<p key={paragraph}>{paragraph}</p>
						))}
					</div>
					<p className="mt-6 text-sm text-muted-foreground">
						{profile.location} · {profile.timezone}
					</p>
				</header>

				<section
					id="track-record"
					className="mt-20 scroll-mt-24 border-t border-border/70 pt-8"
				>
					<h2 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
						Track record
					</h2>

					<ol className="mt-10 space-y-12">
						{roles.map((role) => (
							<li key={role.id}>
								<div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
									<h3 className="text-lg font-semibold tracking-tight">
										{role.title}
									</h3>
									<span className="text-muted-foreground">{role.company}</span>
									<span className="text-sm text-muted-foreground">
										{role.period}
									</span>
								</div>

								<p className="mt-3 max-w-[64ch] text-[15px] leading-relaxed text-muted-foreground">
									{role.scope}
								</p>

								<ul className="mt-4 max-w-[64ch] space-y-2.5">
									{role.impact.map((item) => (
										<li
											key={item}
											className="border-l-2 border-border pl-4 text-[16px] leading-[1.7] text-muted-foreground"
										>
											{item}
										</li>
									))}
								</ul>

								<p className="mt-4 text-sm text-muted-foreground">
									{role.stack.join(" · ")}
								</p>
							</li>
						))}
					</ol>
				</section>

				<section
					id="stack"
					className="mt-20 scroll-mt-24 border-t border-border/70 pt-8"
				>
					<h2 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
						Stack
					</h2>
					<Prose className="mt-5">
						<p>
							Grouped by what I use each thing for. There are no proficiency
							ratings here — what a tool is used for is something you can check
							in conversation, and a self-assigned grade is not.
						</p>
					</Prose>

					<div className="mt-10 space-y-10">
						{stackGroups.map((group) => (
							<div key={group.name}>
								<h3 className="text-lg font-semibold tracking-tight">
									{group.name}
								</h3>
								<p className="mt-2 max-w-[62ch] text-[15px] leading-relaxed text-muted-foreground">
									{group.purpose}
								</p>
								<dl className="mt-5 space-y-3">
									{group.items.map((item) => (
										<div key={item.name} className="sm:flex sm:gap-6">
											<dt className="text-[15px] text-foreground sm:w-56 sm:shrink-0">
												{item.name}
											</dt>
											<dd className="text-[15px] leading-relaxed text-muted-foreground">
												{item.usedFor}{" "}
												<span className="text-muted-foreground/70">
													· since {item.since}
												</span>
											</dd>
										</div>
									))}
								</dl>
							</div>
						))}
					</div>
				</section>

				{profile.teaching && (
					<section className="mt-20 border-t border-border/70 pt-8">
						<h2 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
							Also
						</h2>
						<Prose className="mt-5">
							<p>
								I recorded a{" "}
								<a
									href={profile.teaching.href}
									target="_blank"
									rel="noreferrer"
									className="text-foreground underline underline-offset-4 hover:text-accent"
								>
									{profile.teaching.label}
								</a>{" "}
								for engineers starting out. It is not what I want to be hired
								for, but explaining things is part of how I work on a team.
							</p>
						</Prose>
					</section>
				)}
			</div>
		</>
	);
}
