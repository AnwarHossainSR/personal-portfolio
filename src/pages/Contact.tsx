import { SEOHead } from "@/components/SEO";
import { profile } from "@/data/profile";

export default function Contact() {
	return (
		<>
			<SEOHead
				title="Contact"
				description={`Get in touch with ${profile.name}. ${profile.availability}`}
				path="/contact"
			/>
			<div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
				<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
					Contact
				</h1>

				<div className="mt-6 max-w-[62ch] space-y-4 text-[17px] leading-[1.75] text-muted-foreground">
					<p>{profile.availability}</p>
					<p>{profile.responseTime}</p>
					<p>
						Email is best. If you are writing about a role, the two things that
						make a reply useful are the team's actual problem and the
						constraints around it.
					</p>
				</div>

				<dl className="mt-12 space-y-6 border-t border-border/70 pt-8">
					<div className="sm:flex sm:gap-8">
						<dt className="text-sm text-muted-foreground sm:w-32 sm:shrink-0">
							Email
						</dt>
						<dd>
							<a
								href={`mailto:${profile.email}`}
								className="text-[17px] text-foreground underline underline-offset-4 hover:text-accent"
							>
								{profile.email}
							</a>
						</dd>
					</div>
					{profile.links.map((link) => (
						<div key={link.href} className="sm:flex sm:gap-8">
							<dt className="text-sm text-muted-foreground sm:w-32 sm:shrink-0">
								{link.label}
							</dt>
							<dd>
								<a
									href={link.href}
									target="_blank"
									rel="noreferrer"
									className="text-[17px] text-foreground underline underline-offset-4 hover:text-accent"
								>
									{link.href.replace(/^https:\/\//, "")}
								</a>
							</dd>
						</div>
					))}
					<div className="sm:flex sm:gap-8">
						<dt className="text-sm text-muted-foreground sm:w-32 sm:shrink-0">
							Location
						</dt>
						<dd className="text-[17px] text-foreground">
							{profile.location} · {profile.timezone}
						</dd>
					</div>
				</dl>
			</div>
		</>
	);
}
