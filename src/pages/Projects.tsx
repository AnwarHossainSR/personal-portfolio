import { SEOHead } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { projects } from "@/data/projects";
import { ArrowUpRight, BadgeCheck, Github, Search } from "lucide-react";
import { useState } from "react";

function ProjectVisual({ notes }: { notes?: string[] }) {
  const nodes = notes?.slice(0, 5) ?? ["Client", "API", "Service", "Data", "Ops"];

  return (
    <div className="relative overflow-hidden rounded-lg border border-card-border/60 bg-secondary/45 p-4">
      <div className="absolute inset-0 mesh-gradient opacity-60" />
      <div className="relative grid grid-cols-5 gap-2">
        {nodes.map((node) => (
          <div
            key={node}
            className="flex min-h-20 min-w-0 flex-col items-center justify-center rounded-md border border-card-border/60 bg-background/70 px-2 text-center"
          >
            <div className="mb-2 h-2 w-2 rounded-full bg-primary" />
            <span className="text-[10px] font-bold leading-tight text-muted-foreground">
              {node}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = ["All", ...new Set(projects.map((project) => project.category))];

  const filteredProjects = projects.filter((project) => {
    const query = searchTerm.toLowerCase();
    const matchesFilter = filter === "All" || project.category === filter;
    const matchesSearch =
      project.title.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.technologies.some((tech) => tech.toLowerCase().includes(query));

    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <SEOHead
        title="Projects Portfolio"
        description="Explore Md. Anwar Hossain's software project case studies across AI automation, AWS, full-stack development, DevOps, backend systems, and cloud architecture."
        keywords="Anwar Hossain Projects, AI Automation, Agentic AI, AWS Projects, Full Stack Portfolio, DevOps, System Design"
        url="https://anwarportfolio.vercel.app/projects"
      />
      <div className="min-h-screen py-16 sm:py-20">
        <div className="section-shell">
          <div className="mx-auto max-w-3xl text-center slide-in-up">
            <p className="eyebrow">Project proof</p>
            <h1 className="mt-3 text-4xl font-black text-balance sm:text-6xl">
              Practical systems, automation, and cloud delivery
            </h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Selected work across AI automation, agentic workflows, cloud systems, backend platforms, DevOps automation, analytics, and full-stack product delivery.
            </p>
          </div>

          <div className="mt-10 rounded-lg border border-card-border/60 bg-card/80 p-4 shadow-card">
            <div className="grid gap-4 lg:grid-cols-[1fr_320px] lg:items-start">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setFilter(category)}
                    className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                      filter === category
                        ? "bg-primary text-primary-foreground shadow-glow"
                        : "border border-card-border/60 bg-secondary/55 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search stack or project..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="border-card-border/70 bg-background/70 pl-10"
                />
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {filteredProjects.map((project) => (
              <article key={project.id} className="premium-card interactive-card flex h-full flex-col overflow-hidden p-5">
                <ProjectVisual notes={project.architectureNotes} />

                <div className="relative mt-5 flex flex-1 flex-col">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                      {project.category}
                    </span>
                    <span className="rounded-full border border-card-border/60 px-3 py-1 text-xs font-bold text-muted-foreground">
                      {project.status}
                    </span>
                    {project.isVerified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        CV-aligned
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-black leading-tight">{project.title}</h2>
                      <p className="mt-2 text-sm font-semibold text-muted-foreground">
                        {project.role} | {project.year} | {project.duration}
                      </p>
                    </div>
                    {project.githubUrl && (
                      <Button variant="outline" size="icon" className="shrink-0 border-card-border/70" asChild>
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} GitHub profile`}>
                          <Github className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>

                  <p className="mt-4 line-clamp-4 leading-7 text-muted-foreground">{project.longDescription}</p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {Object.entries(project.metrics).map(([label, value]) => (
                      <div key={label} className="rounded-md border border-card-border/60 bg-background/45 p-3">
                        <div className="text-sm font-black text-foreground">{value}</div>
                        <div className="mt-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-md border border-card-border/60 bg-secondary/35 p-4">
                    <p className="text-sm font-bold text-foreground">Outcome</p>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {project.outcome}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.technologies.slice(0, 7).map((tech) => (
                      <span key={tech} className="rounded-full bg-muted/70 px-3 py-1 text-xs font-semibold text-muted-foreground">
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 7 && (
                      <span className="rounded-full bg-muted/70 px-3 py-1 text-xs font-semibold text-muted-foreground">
                        +{project.technologies.length - 7}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="mt-12 rounded-lg border border-card-border/60 bg-card p-10 text-center">
              <Search className="mx-auto h-8 w-8 text-muted-foreground" />
              <h2 className="mt-4 text-xl font-bold">No matching projects</h2>
              <p className="mt-2 text-muted-foreground">Try a different category or search term.</p>
            </div>
          )}

          <div className="mt-12 premium-card p-8 text-center">
            <h2 className="text-2xl font-black">Want to inspect the engineering profile?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Visit GitHub for repositories and contributions, or open the resume for the full professional background.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button className="bg-gradient-primary font-bold text-primary-foreground" asChild>
                <a href="https://github.com/AnwarHossainSR" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub profile
                </a>
              </Button>
              <Button variant="outline" className="border-card-border/70" asChild>
                <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                  Open resume
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
