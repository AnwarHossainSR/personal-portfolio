import { Award, Building, Calendar, ExternalLink } from "lucide-react";
import { SEOHead } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { experience as experiences } from "@/data/experience";

export default function Experience() {
	return (
		<>
			<SEOHead
				title="Professional Experience"
				description="Explore Anwar Hossain's 6+ years of professional experience at Craftsmen Ltd., BJIT Group, and AIUB Annon Lab. AWS architect and full-stack development expertise."
				keywords="Anwar Hossain Experience, Software Engineer Career, AWS Architect, Craftsmen Ltd, BJIT Group"
				url="https://anwarportfolio.vercel.app/experience"
			/>
			<div className="min-h-screen py-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Header */}
					<div className="text-center mb-10 sm:mb-16 slide-in-up">
						<h1 className="text-3xl sm:text-5xl font-bold mb-4">
							Professional <span className="gradient-text">Experience</span>
						</h1>
						<p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
							A journey through impactful roles, innovative projects, and
							continuous growth in software engineering
						</p>
					</div>

					{/* Timeline */}
					<div className="relative">
						{/* Timeline Line */}
						<div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-primary hidden md:block" />

						<div className="space-y-12">
							{experiences.map((experience, index) => (
								<div
									key={experience.id}
									className="relative group slide-in-up"
									style={{ animationDelay: `${index * 200}ms` }}
								>
									{/* Timeline Dot */}
									<div className="absolute left-6 w-4 h-4 bg-primary rounded-full border-4 border-background shadow-glow hidden md:block" />

									{/* Content Card */}
									<div className="md:ml-20 premium-card p-5 sm:p-8 hover:scale-102 transition-all duration-300">
										<div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
											{/* Main Content */}
											<div className="flex-1">
												<div className="flex items-center gap-3 mb-4">
													<Building className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
													<div>
														<h3 className="text-xl sm:text-2xl font-bold">
															{experience.position}
														</h3>
														<p className="text-base sm:text-lg text-primary font-medium">
															{experience.company}
														</p>
													</div>
												</div>

												<div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-5 sm:mb-6 text-muted-foreground">
													<div className="flex items-center gap-2 text-xs sm:text-sm">
														<Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
														{experience.duration}
													</div>
													<span className="text-[10px] sm:text-sm px-2 py-0.5 sm:px-3 sm:py-1 bg-primary/10 text-primary rounded-full">
														{experience.type}
													</span>
												</div>

												<p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
													{experience.description}
												</p>

												{/* Key Achievements */}
												{experience.achievements &&
													experience.achievements.length > 0 && (
														<div className="mb-6">
															<h4 className="font-semibold mb-3 flex items-center gap-2">
																<Award className="w-4 h-4 text-primary" />
																Key Achievements
															</h4>
															<ul className="space-y-2">
																{experience.achievements.map(
																	(achievement, i) => (
																		<li
																			key={i}
																			className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground"
																		>
																			<div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 sm:mt-2 flex-shrink-0" />
																			{achievement}
																		</li>
																	),
																)}
															</ul>
														</div>
													)}

												{/* Technologies */}
												<div className="flex flex-wrap gap-1.5 sm:gap-2">
													{experience.technologies.map((tech) => (
														<span
															key={tech}
															className="text-[10px] sm:text-xs bg-muted/50 text-muted-foreground px-2 py-0.5 sm:px-3 sm:py-1 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
														>
															{tech}
														</span>
													))}
												</div>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* CTA Section */}
					<div className="text-center mt-20 premium-card p-8 cursor-pointer">
						<h3 className="text-2xl font-bold mb-4">
							Interested in My <span className="gradient-text">Experience</span>
							?
						</h3>
						<p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
							Download my full resume to learn more about my professional
							journey and technical expertise.
						</p>
						<Button
							size="lg"
							className="bg-gradient-primary cursor-pointer"
							asChild
						>
							<a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
								<ExternalLink className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform" />
								Download Resume
							</a>
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}
