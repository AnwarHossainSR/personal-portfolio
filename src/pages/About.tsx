import { SEOHead } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { experienceStats } from "@/data/experience";
import { personalInfo } from "@/data/personal";
import { Award, CheckCircle2, Download, MapPin, Server, Users } from "lucide-react";
import { Link } from "react-router-dom";

const strengths = [
  {
    icon: Server,
    title: "Architecture that survives production",
    copy: "I design APIs, cloud services, data flows, and release paths with maintainability and operations in mind.",
  },
  {
    icon: Users,
    title: "Team-ready senior delivery",
    copy: "I help teams move faster through code reviews, mentoring, planning, and practical engineering standards.",
  },
  {
    icon: Award,
    title: "Full-stack ownership",
    copy: "I can move from product UI to backend systems, AWS infrastructure, DevOps pipelines, and production support.",
  },
];

export default function About() {
  return (
    <>
      <SEOHead
        title="About Me"
        description="Learn about Md. Anwar Hossain, a Senior Software Engineer specializing in AWS, full-stack engineering, system design, and DevOps."
        keywords="Anwar Hossain, Senior Software Engineer, AWS, Full Stack Developer, About"
        url="https://anwarportfolio.vercel.app/about"
      />
      <div className="min-h-screen py-16 sm:py-20">
        <div className="section-shell">
          <section className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="premium-card overflow-hidden p-4">
              <div className="aspect-square overflow-hidden rounded-md bg-secondary">
                <img src={personalInfo.avatar} alt={personalInfo.name} className="h-full w-full object-cover" />
              </div>
            </div>

            <div className="slide-in-up">
              <p className="eyebrow">About</p>
              <h1 className="mt-3 text-4xl font-black sm:text-6xl">A senior engineer for cloud-backed product systems</h1>
              <p className="mt-6 whitespace-pre-line text-lg leading-8 text-muted-foreground">{personalInfo.bio.long}</p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold text-muted-foreground">
                <span className="inline-flex items-center gap-2 rounded-full border border-card-border bg-card px-4 py-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  {personalInfo.location}
                </span>
                <span className="rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-accent">
                  Open to new opportunities
                </span>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button className="bg-gradient-primary font-bold text-primary-foreground" asChild>
                  <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Open resume
                  </a>
                </Button>
                <Button variant="outline" className="border-card-border" asChild>
                  <Link to="/contact">Contact me</Link>
                </Button>
              </div>
            </div>
          </section>

          <section className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Experience", experienceStats.totalYears],
              ["Projects", experienceStats.projectsCompleted],
              ["Technologies", experienceStats.technologies],
              ["Companies", `${experienceStats.companiesWorked}`],
            ].map(([label, value]) => (
              <div key={label} className="metric-tile text-center">
                <div className="text-3xl font-black">{value}</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</div>
              </div>
            ))}
          </section>

          <section className="mt-16">
            <div className="mx-auto max-w-3xl text-center">
              <p className="eyebrow">What I bring</p>
              <h2 className="mt-3 text-3xl font-black sm:text-5xl">Practical senior engineering across the stack</h2>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {strengths.map((strength) => (
                <div key={strength.title} className="premium-card p-6">
                  <strength.icon className="h-7 w-7 text-primary" />
                  <h3 className="mt-5 text-xl font-black">{strength.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{strength.copy}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16 premium-card p-6 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <p className="eyebrow">Highlights</p>
                <h2 className="mt-3 text-3xl font-black">CV-backed strengths</h2>
              </div>
              <div className="grid gap-3">
                {personalInfo.highlights.map((highlight) => (
                  <div key={highlight} className="flex items-start gap-3 rounded-md border border-card-border bg-background/50 p-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span className="text-sm text-muted-foreground">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
