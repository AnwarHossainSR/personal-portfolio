import { SEOHead } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { experience as experiences, experienceStats } from "@/data/experience";
import { Award, Calendar, Download, MapPin } from "lucide-react";

export default function Experience() {
  return (
    <>
      <SEOHead
        title="Professional Experience"
        description="Explore Md. Anwar Hossain's professional software engineering experience across AWS, full-stack development, DevOps, and system design."
        keywords="Anwar Hossain Experience, Senior Software Engineer, AWS, Full Stack, DevOps"
        url="https://anwarportfolio.vercel.app/experience"
      />
      <div className="min-h-screen py-16 sm:py-20">
        <div className="section-shell">
          <div className="mx-auto max-w-3xl text-center slide-in-up">
            <p className="eyebrow">Experience</p>
            <h1 className="mt-3 text-4xl font-black sm:text-6xl">Professional track record</h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              6+ years across scalable web platforms, AWS cloud systems, backend APIs, frontend delivery, and DevOps automation.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Years", experienceStats.totalYears],
              ["Companies", `${experienceStats.companiesWorked}`],
              ["Projects", experienceStats.projectsCompleted],
              ["Stack", experienceStats.technologies],
            ].map(([label, value]) => (
              <div key={label} className="metric-tile text-center">
                <div className="text-3xl font-black">{value}</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>

          <div className="mt-12 space-y-6">
            {experiences.map((experience) => (
              <article key={experience.id} className="premium-card p-6 sm:p-8">
                <div className="grid gap-6 lg:grid-cols-[0.34fr_0.66fr]">
                  <div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{experience.type}</span>
                    <h2 className="mt-4 text-2xl font-black">{experience.position}</h2>
                    <p className="mt-2 text-lg font-bold text-primary">{experience.company}</p>
                    <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        {experience.duration}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        {experience.location}
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="leading-7 text-muted-foreground">{experience.description}</p>
                    <div className="mt-5">
                      <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide">
                        <Award className="h-4 w-4 text-accent" />
                        Selected impact
                      </h3>
                      <div className="mt-3 grid gap-2">
                        {experience.achievements.map((achievement) => (
                          <div key={achievement} className="rounded-md border border-card-border bg-background/50 p-3 text-sm text-muted-foreground">
                            {achievement}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {experience.technologies.map((tech) => (
                        <span key={tech} className="rounded-full bg-muted/70 px-3 py-1 text-xs font-semibold text-muted-foreground">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 premium-card p-8 text-center">
            <h2 className="text-2xl font-black">Need the complete resume?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Open the PDF for the full professional profile, contact details, and technical background.
            </p>
            <Button className="mt-6 bg-gradient-primary font-bold text-primary-foreground" asChild>
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" />
                Open resume
              </a>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
