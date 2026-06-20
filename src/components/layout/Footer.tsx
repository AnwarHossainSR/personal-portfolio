import React from "react";
import { getSocialIcon } from "@/constants/social";
import { personalInfo, socialLinks } from "@/data/personal";

export const Footer = React.memo(() => {
	const lastUpdatedDate = personalInfo.lastUpdated;
	const currentYear = new Date().getFullYear();
	const lastUpdatedYear = lastUpdatedDate.getFullYear();

	return (
		<footer className="bg-card/30 backdrop-blur-xl border-t border-border/50 mt-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					{/* Brand Section */}
					<div className="col-span-1 md:col-span-2">
						<h3 className="text-lg sm:text-xl font-bold gradient-text mb-4">
							{personalInfo.name}
						</h3>
						<p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-md">
							Senior Software Engineer passionate about building scalable
							systems and leading development teams to deliver exceptional
							results.
						</p>

						{/* Social Links */}
						<div className="flex space-x-4">
							{socialLinks.map((social) => {
								const Icon = getSocialIcon(social.icon);
								return (
									<a
										key={social.name}
										href={social.url}
										target="_blank"
										rel="noopener noreferrer"
										className="p-2 rounded-lg bg-muted/50 hover:bg-primary/20 hover:text-primary transition-all duration-200 group"
										aria-label={social.name}
									>
										<Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
									</a>
								);
							})}
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
							Quick Links
						</h4>
						<ul className="space-y-3">
							{[
								{ name: "About Me", href: "/about" },
								{ name: "Experience", href: "/experience" },
								{ name: "Projects", href: "/projects" },
								{ name: "Skills", href: "/skills" },
							].map((link) => (
								<li key={link.name}>
									<a
										href={link.href}
										className="text-muted-foreground hover:text-primary transition-colors duration-200"
									>
										{link.name}
									</a>
								</li>
							))}
						</ul>
					</div>

					{/* Contact Info */}
					<div>
						<h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
							Get in Touch
						</h4>
						<ul className="space-y-3 text-muted-foreground">
							<li>
								<a
									href={`mailto:${personalInfo.email}`}
									className="hover:text-primary transition-colors duration-200"
								>
									{personalInfo.email}
								</a>
							</li>
							<li>
								<a
									href={`tel:${personalInfo.phone}`}
									className="hover:text-primary transition-colors duration-200"
								>
									{personalInfo.phone}
								</a>
							</li>
							<li className="text-sm">{personalInfo.location}</li>
						</ul>
					</div>
				</div>

				{/* Bottom Section */}
				<div className="mt-8 sm:mt-12 pt-8 border-t border-border/50">
					<div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
						<p className="text-[10px] sm:text-sm text-muted-foreground flex items-center text-center sm:text-left">
							© {currentYear} {personalInfo.name}
						</p>
						<p className="text-[10px] sm:text-sm text-muted-foreground mt-0">
							Last updated:{" "}
							{lastUpdatedYear === currentYear
								? lastUpdatedDate.toLocaleDateString()
								: `Updated in ${lastUpdatedYear}`}
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
});
