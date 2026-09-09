import { Section } from "@/components/section";
import { profile } from "@/data/profile";

export function Contact() {
	return (
		<Section id="contact" number="06" eyebrow="Contact" title="Get in touch">
			<div className="max-w-2xl space-y-4 text-lg leading-relaxed text-muted">
				<p>{profile.availability}</p>
				<p>{profile.responseTime}</p>
				<p>
					Email is best. If you are writing about a role, the two things that
					make a reply useful are the team's actual problem and the constraints
					around it.
				</p>
			</div>

			<dl className="mt-10 space-y-5 border-t border-line pt-8">
				<div className="sm:flex sm:gap-8">
					<dt className="text-sm text-muted sm:w-32 sm:shrink-0">Email</dt>
					<dd>
						<a
							href={`mailto:${profile.email}`}
							className="text-lg text-ink underline underline-offset-4 hover:text-accent"
						>
							{profile.email}
						</a>
					</dd>
				</div>
				{profile.links.map((link) => (
					<div key={link.href} className="sm:flex sm:gap-8">
						<dt className="text-sm text-muted sm:w-32 sm:shrink-0">
							{link.label}
						</dt>
						<dd>
							<a
								href={link.href}
								target="_blank"
								rel="noreferrer"
								className="text-lg text-ink underline underline-offset-4 hover:text-accent"
							>
								{link.href.replace(/^https:\/\//, "")}
							</a>
						</dd>
					</div>
				))}
				<div className="sm:flex sm:gap-8">
					<dt className="text-sm text-muted sm:w-32 sm:shrink-0">Location</dt>
					<dd className="text-lg text-ink">
						{profile.location} · {profile.timezone}
					</dd>
				</div>
			</dl>

			{profile.teaching && (
				<p className="mt-10 max-w-2xl text-sm leading-relaxed text-muted">
					I also recorded some tutorials{" "}
					<a
						href={profile.teaching.href}
						target="_blank"
						rel="noreferrer"
						className="text-ink underline underline-offset-4 hover:text-accent"
					>
						{profile.teaching.label}
					</a>{" "}
					for engineers starting out. It is not what I want to be hired for, but
					explaining things is part of how I work on a team.
				</p>
			)}
		</Section>
	);
}
