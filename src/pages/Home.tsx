import { SEOHead } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { personalInfo, socialLinks } from "@/data/personal";
import { featuredProjects } from "@/data/projects";
import { topSkills } from "@/data/skills";
import {
  ArrowRight,
  ChevronDown,
  Download,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";
import { Link } from "react-router-dom";

const iconMap = {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Twitter: Mail, // fallback
};

export default function Home() {
  return (
    <>
      <SEOHead
        title="Home"
        description="Senior Software Engineer with 6+ years of experience in AWS cloud architecture, full-stack development, and DevOps. Specialized in React, Node.js, and serverless systems."
        keywords="Anwar Hossain, Senior Software Engineer, AWS Architect, Full Stack Developer, React, Node.js, DevOps"
        url="https://anwarportfolio.vercel.app"
      />
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-hero opacity-50" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "2s" }}
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-12 slide-in-up hero-glow">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-4">
                  <span className="text-sm text-primary font-medium">
                    🚀 Senior Software Engineer
                  </span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight">
                  <span className="block">Hi, I'm</span>
                  <span className="gradient-text block mt-1 sm:mt-2">
                    {personalInfo.name}
                  </span>
                </h1>

                <h2 className="text-lg sm:text-2xl lg:text-4xl font-medium text-muted-foreground/80 leading-tight">
                  Architecting Scalable Systems on
                  <span className="text-primary"> AWS Cloud</span>
                </h2>

                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 text-xs sm:text-sm lg:text-base">
                  <span className="px-2 py-1 sm:px-4 sm:py-2 bg-card/50 backdrop-blur-sm rounded-full border border-card-border text-foreground/80">
                    System Design Expert
                  </span>
                  <span className="px-2 py-1 sm:px-4 sm:py-2 bg-card/50 backdrop-blur-sm rounded-full border border-card-border text-foreground/80">
                    DevOps Engineer
                  </span>
                  <span className="px-2 py-1 sm:px-4 sm:py-2 bg-card/50 backdrop-blur-sm rounded-full border border-card-border text-foreground/80">
                    6+ Years Experience
                  </span>
                </div>
              </div>

              <p className="text-sm sm:text-lg lg:text-xl text-muted-foreground/90 max-w-4xl mx-auto leading-relaxed font-light px-2 sm:px-0">
                {personalInfo.bio.short}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                <Button
                  size="default"
                  className="group bg-gradient-primary text-white px-8 py-3 rounded-xl shadow-premium hover:shadow-glow transition-all duration-500 hover:scale-105"
                  asChild
                >
                  <Link to="/projects">
                    <ArrowRight className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                    View My Work
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="default"
                  className="group px-8 py-3 rounded-xl border-2 border-primary/30 bg-card/20 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/50 hover:scale-105 transition-all duration-500"
                  asChild
                >
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                    Download Resume
                  </a>
                </Button>
              </div>

              {/* Social Links */}
              <div className="flex justify-center space-x-6 pt-8">
                {socialLinks.map((social) => {
                  const Icon = iconMap[social.icon as keyof typeof iconMap];
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-4 rounded-2xl bg-card/30 backdrop-blur-sm border border-card-border/50 hover:bg-primary/10 hover:border-primary/30 transition-all duration-500 hover:scale-110"
                      aria-label={social.name}
                    >
                      <Icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="flex flex-col items-center space-y-2">
              <ChevronDown className="w-6 h-6 text-muted-foreground/60" />
              <span className="text-xs text-muted-foreground/60 font-medium">
                Scroll to explore
              </span>
            </div>
          </div>
        </section>

        {/* Featured Skills */}
        <section className="py-16 sm:py-24 lg:py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/20 to-transparent" />
          <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-16 lg:mb-20">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                Core <span className="gradient-text">Expertise</span>
              </h2>
              <p className="text-sm sm:text-lg lg:text-xl text-muted-foreground/80 max-w-3xl mx-auto leading-relaxed px-2">
                Technologies and methodologies I leverage to architect and
                deliver enterprise-grade solutions
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 lg:gap-6 fade-in-stagger">
              {topSkills.map((skill, index) => (
                <div
                  key={skill}
                  className="group premium-card interactive-card px-3 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 cursor-default"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="text-xs sm:text-sm lg:text-base font-semibold text-foreground/90 group-hover:text-primary transition-colors">
                    {skill}
                  </span>
                  <div className="w-full h-0.5 sm:h-1 bg-muted rounded-full mt-1 sm:mt-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-primary rounded-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"
                      style={{ transitionDelay: `${index * 0.05}s` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="py-16 sm:py-24 lg:py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
          <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-16 lg:mb-20">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                Featured <span className="gradient-text">Projects</span>
              </h2>
              <p className="text-sm sm:text-lg lg:text-xl text-muted-foreground/80 max-w-3xl mx-auto leading-relaxed px-2">
                Production-ready solutions showcasing technical expertise across
                full-stack development and cloud architecture
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10 fade-in-stagger">
              {featuredProjects.map((project, index) => (
                <div
                  key={project.id}
                  className="group premium-card interactive-card p-4 sm:p-6 lg:p-8 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    <div className="aspect-video bg-gradient-surface rounded-xl mb-6 overflow-hidden border border-card-border/50">
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                        <span className="text-lg font-medium text-muted-foreground/70 group-hover:text-primary transition-colors duration-300">
                          {project.title}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-medium text-primary bg-primary/10 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-primary/20">
                          {project.category}
                        </span>
                        <span className="text-xs sm:text-sm text-muted-foreground/70">
                          {project.year}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold group-hover:text-primary transition-colors duration-300">
                        {project.title}
                      </h3>

                      <p className="text-muted-foreground/80 text-xs sm:text-sm lg:text-base leading-relaxed">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="text-sm px-3 py-1.5 bg-muted/30 text-muted-foreground rounded-lg hover:bg-accent/10 hover:text-accent transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="text-sm px-3 py-1.5 bg-muted/30 text-muted-foreground rounded-lg">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-16">
              <Button
                variant="outline"
                size="default"
                className="group px-8 py-3 rounded-xl border-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50 hover:scale-105 transition-all duration-500"
                asChild
              >
                <Link to="/projects">
                  Explore All Projects
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24 lg:py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10" />
          <div className="relative max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 text-center">
            <div className="premium-card p-6 sm:p-10 lg:p-16 hero-glow">
              <h2 className="text-xl sm:text-3xl lg:text-5xl font-bold mb-4 sm:mb-6 lg:mb-8">
                Ready to Build Something{" "}
                <span className="gradient-text">Extraordinary</span>?
              </h2>
              <p className="text-sm sm:text-base lg:text-xl text-muted-foreground/90 mb-6 sm:mb-8 lg:mb-12 max-w-3xl mx-auto leading-relaxed">
                I'm passionate about tackling complex technical challenges and
                building scalable systems that drive business growth. Let's
                discuss how we can bring your vision to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="default"
                  className="group bg-gradient-primary text-white px-8 py-3 rounded-xl shadow-premium hover:shadow-glow transition-all duration-500 hover:scale-105"
                  asChild
                >
                  <Link to="/contact">
                    <Mail className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                    Let's Connect
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="default"
                  className="group px-8 py-3 rounded-xl border-2 border-accent/30 hover:bg-accent/10 hover:border-accent/50 hover:scale-105 transition-all duration-500"
                  asChild
                >
                  <Link to="/about">
                    <ArrowRight className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                    Discover My Journey
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
