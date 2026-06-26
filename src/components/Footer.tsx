import { personalInfo, socialLinks } from "@/data/personal";
import { ExternalLink, Github, Linkedin, Mail, Youtube } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const iconMap = {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Youtube,
};

export const Footer = React.memo(() => {
  const lastUpdatedDate = personalInfo.lastUpdated;
  const currentYear = new Date().getFullYear();
  const lastUpdatedYear = lastUpdatedDate.getFullYear();

  return (
    <footer className="mt-20 border-t border-border bg-card/70">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <h3 className="text-xl font-black">
              Md. Anwar <span className="text-primary">Hossain</span>
            </h3>
            <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
              Senior Software Engineer focused on AWS cloud architecture, full-stack delivery, DevOps automation, and reliable product systems.
            </p>

            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => {
                const Icon = iconMap[social.icon as keyof typeof iconMap] ?? ExternalLink;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md border border-card-border bg-secondary/60 p-2 text-muted-foreground transition hover:border-primary/50 hover:text-primary"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Quick links</h4>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                { name: "About", href: "/about" },
                { name: "Experience", href: "/experience" },
                { name: "Projects", href: "/projects" },
                { name: "Skills", href: "/skills" },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-muted-foreground transition hover:text-primary">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Get in touch</h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <a href={`mailto:${personalInfo.email}`} className="transition hover:text-primary">
                  {personalInfo.email}
                </a>
              </li>
              <li>
                <a href={`tel:${personalInfo.phone}`} className="transition hover:text-primary">
                  {personalInfo.phone}
                </a>
              </li>
              <li>{personalInfo.location}</li>
              <li>
                <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-bold text-primary">
                  Open resume
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright {currentYear} {personalInfo.name}</p>
          <p>
            Last updated:{" "}
            {lastUpdatedYear === currentYear
              ? lastUpdatedDate.toLocaleDateString()
              : `Updated in ${lastUpdatedYear}`}
          </p>
        </div>
      </div>
    </footer>
  );
});
