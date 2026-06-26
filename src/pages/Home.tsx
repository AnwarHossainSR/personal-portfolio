import { SEOHead } from "@/components/SEO";
import Terminal from "@/components/Terminal";
import { Button } from "@/components/ui/button";
import { experienceStats } from "@/data/experience";
import { personalInfo } from "@/data/personal";
import { featuredProjects } from "@/data/projects";
import { topSkills } from "@/data/skills";
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  CheckCircle2,
  Download,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Server,
  Sparkles,
  Workflow,
} from "lucide-react";
import { Link } from "react-router-dom";

const heroMetrics = [
  { label: "Years experience", value: experienceStats.totalYears },
  { label: "Projects delivered", value: experienceStats.projectsCompleted },
  { label: "Core technologies", value: experienceStats.technologies },
  { label: "Companies", value: `${experienceStats.companiesWorked}` },
];

const services = [
  {
    icon: Bot,
    title: "AI automation and agentic workflows",
    copy: "LLM-assisted tools, prompt systems, workflow orchestration, and automation-first product thinking.",
  },
  {
    icon: Workflow,
    title: "Cloud automation",
    copy: "AWS serverless, APIs, event flows, databases, storage, monitoring, and delivery automation.",
  },
  {
    icon: Server,
    title: "Full-stack AI-ready systems",
    copy: "React, Next.js, Node.js, Laravel, TypeScript, and practical product execution.",
  },
];

function ArchitecturePreview({ notes }: { notes?: string[] }) {
  const items = notes?.slice(0, 5) ?? ["Client", "API", "Service", "Data", "Ops"];

  return (
    <div className="rounded-lg border border-card-border bg-secondary/50 p-4">
      <div className="grid grid-cols-5 gap-2">
        {items.map((item, index) => (
          <div key={item} className="min-w-0">
            <div className="h-16 rounded-md border border-primary/20 bg-background/70 p-2 flex items-center justify-center text-center text-[10px] font-semibold text-muted-foreground">
              {item}
            </div>
            {index < items.length - 1 && (
              <div className="mx-auto my-2 h-px w-full bg-gradient-to-r from-primary/10 via-primary/60 to-primary/10" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <SEOHead
        title="Senior Software Engineer"
        description="Md. Anwar Hossain is a Senior Software Engineer specializing in AI automation, agentic AI workflows, AWS cloud architecture, full-stack development, and DevOps."
        keywords="Md. Anwar Hossain, AI Automation Engineer, Agentic AI, Senior Software Engineer, AWS Architect, Full Stack Developer, React, Node.js, DevOps"
        url="https://anwarportfolio.vercel.app"
      />
      <div className="min-h-screen">
        <section className="relative overflow-hidden bg-gradient-hero py-20 sm:py-24 lg:py-28">
          <div className="section-shell">
            <div className="grid items-center gap-12 lg:grid-cols-[1.12fr_0.88fr]">
              <div className="slide-in-up">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  Available for AI automation, agentic AI, and senior cloud engineering roles
                </div>

                <h1 className="max-w-4xl text-4xl font-black tracking-tight text-balance text-foreground sm:text-6xl lg:text-7xl">
                  {personalInfo.name}
                  <span className="block gradient-text">builds AI automation and reliable cloud software.</span>
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                  {personalInfo.bio.short}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button size="lg" className="bg-gradient-primary font-bold text-primary-foreground shadow-glow" asChild>
                    <Link to="/projects">
                      View case studies
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-card-border bg-card/80" asChild>
                    <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-4 w-4" />
                      Resume
                    </a>
                  </Button>
                  <Button size="lg" variant="ghost" className="text-muted-foreground hover:text-foreground" asChild>
                    <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="mr-2 h-4 w-4" />
                      LinkedIn
                    </a>
                  </Button>
                </div>

                <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {heroMetrics.map((metric) => (
                    <div key={metric.label} className="metric-tile">
                      <div className="text-2xl font-black text-foreground">{metric.value}</div>
                      <div className="mt-1 text-xs font-medium text-muted-foreground">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="premium-card overflow-hidden p-4">
                  <div className="aspect-[4/5] overflow-hidden rounded-md bg-secondary">
                    <img src={personalInfo.avatar} alt={personalInfo.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="relative mt-4 space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-primary">{personalInfo.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{personalInfo.subtitle}</p>
                    </div>
                    <div className="grid gap-2 text-sm text-muted-foreground">
                      {personalInfo.highlights.slice(0, 4).map((item) => (
                        <div key={item} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 border-card-border" asChild>
                        <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-4 w-4" />
                          GitHub
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 border-card-border" asChild>
                        <Link to="/contact">
                          <Mail className="mr-2 h-4 w-4" />
                          Contact
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="section-shell">
            <div className="grid gap-4 lg:grid-cols-3">
              {services.map((service) => (
                <div key={service.title} className="premium-card interactive-card p-6">
                  <service.icon className="h-7 w-7 text-primary" />
                  <h2 className="mt-5 text-xl font-bold">{service.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{service.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="section-shell">
            <div className="mx-auto max-w-3xl text-center">
              <p className="eyebrow">Selected expertise</p>
              <h2 className="mt-3 text-3xl font-black sm:text-5xl">
                Built around real production delivery
              </h2>
              <p className="mt-4 text-muted-foreground">
                A focused stack for AI-assisted products, workflow automation, cloud-backed applications, backend services, and polished product interfaces.
              </p>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {topSkills.map((skill) => (
                <span key={skill} className="rounded-full border border-card-border bg-card px-4 py-2 text-sm font-semibold text-muted-foreground">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="section-shell">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow">Case studies</p>
                <h2 className="mt-3 text-3xl font-black sm:text-5xl">Featured project proof</h2>
              </div>
              <Button variant="outline" className="border-card-border" asChild>
                <Link to="/projects">
                  Explore all projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <article key={project.id} className="premium-card interactive-card overflow-hidden p-5">
                  <ArchitecturePreview notes={project.architectureNotes} />
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                      {project.category}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">{project.year}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-black">{project.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{project.description}</p>
                  <div className="mt-5 rounded-md border border-card-border bg-background/50 p-3">
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span>{project.outcome}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="section-shell">
            <div className="premium-card overflow-hidden p-8 text-center sm:p-12">
              <Sparkles className="mx-auto h-8 w-8 text-primary" />
              <h2 className="mt-5 text-3xl font-black sm:text-5xl">Need AI automation that actually ships?</h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                I can help with agentic workflows, AI-assisted tools, cloud architecture, backend systems, full-stack delivery, DevOps automation, and technical leadership.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button className="bg-gradient-primary font-bold text-primary-foreground" asChild>
                  <Link to="/contact">
                    Start a conversation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="border-card-border" asChild>
                  <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                    Open resume
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <Terminal />
      </div>
    </>
  );
}
