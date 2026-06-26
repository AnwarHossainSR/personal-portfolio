import { SEOHead } from "@/components/SEO";
import { certifications, skillCategories, topSkills } from "@/data/skills";
import { Bot, Cloud, Code, Database, Layers, Monitor, Server, Settings, ShieldCheck } from "lucide-react";

const iconMap = {
  "AI Automation": Bot,
  Backend: Server,
  Frontend: Monitor,
  "Cloud & DevOps": Cloud,
  Databases: Database,
  Architecture: Layers,
  Tools: Settings,
  Languages: Code,
};

export default function Skills() {
  return (
    <>
      <SEOHead
        title="Technical Skills"
        description="Technical capabilities of Md. Anwar Hossain across backend, frontend, AWS cloud, DevOps, databases, system design, and production engineering."
        keywords="Anwar Hossain Skills, AWS, React, Node.js, DevOps, System Design"
        url="https://anwarportfolio.vercel.app/skills"
      />
      <div className="min-h-screen py-16 sm:py-20">
        <div className="section-shell">
          <div className="mx-auto max-w-3xl text-center slide-in-up">
            <p className="eyebrow">Capabilities</p>
            <h1 className="mt-3 text-4xl font-black sm:text-6xl">Skills organized by production responsibility</h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              A practical stack for building, shipping, operating, and improving cloud-backed software products.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {topSkills.map((skill) => (
              <span key={skill} className="rounded-full border border-card-border bg-card px-4 py-2 text-sm font-bold text-muted-foreground">
                {skill}
              </span>
            ))}
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {skillCategories.map((category) => {
              const Icon = iconMap[category.name as keyof typeof iconMap] ?? Code;

              return (
                <article key={category.name} className="premium-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-md bg-primary/10 p-3 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black">{category.name}</h2>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{category.description}</p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {category.skills.map((skill) => (
                      <div key={skill.name} className="rounded-md border border-card-border bg-background/50 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-bold">{skill.name}</h3>
                            <p className="mt-1 text-xs font-semibold text-muted-foreground">{skill.yearsOfExperience} years production use</p>
                          </div>
                          <span className="rounded-full bg-accent/10 px-2 py-1 text-[11px] font-bold text-accent">
                            {skill.level}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-12 premium-card p-6 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.34fr_0.66fr]">
              <div>
                <p className="eyebrow">Credential signals</p>
                <h2 className="mt-3 text-3xl font-black">Professional focus areas</h2>
              </div>
              <div className="grid gap-3">
                {certifications.map((certification) => (
                  <div key={certification.name} className="flex items-start gap-3 rounded-md border border-card-border bg-background/50 p-4">
                    <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-accent" />
                    <div>
                      <h3 className="font-bold">{certification.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {certification.level} · {certification.issuer} · {certification.credentialId}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
