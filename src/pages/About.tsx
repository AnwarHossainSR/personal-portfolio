import { Button } from "@/components/ui/button";
import { personalInfo } from "@/data/personal";
import { Award, Calendar, Code, Download, MapPin, Users } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Profile Image */}
            <div className="relative group">
              <div className="aspect-square rounded-2xl bg-gradient-surface overflow-hidden shadow-premium">
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <span className="text-6xl font-bold text-muted-foreground">
                    A
                  </span>
                </div>
              </div>
              <div className="absolute -inset-4 bg-gradient-primary rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
            </div>

            {/* Content */}
            <div className="space-y-8 slide-in-up">
              <div>
                <h1 className="text-3xl sm:text-5xl font-bold mb-4">
                  About <span className="gradient-text">Me</span>
                </h1>
                <p className="text-base sm:text-xl text-muted-foreground leading-relaxed">
                  {personalInfo.bio.long}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="premium-card p-3 sm:p-4 text-center hover:scale-105 transition-transform">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-primary" />
                  <div className="text-xl sm:text-2xl font-bold">6+</div>
                  <div className="text-[10px] sm:text-sm text-muted-foreground whitespace-nowrap">
                    Years Experience
                  </div>
                </div>
                <div className="premium-card p-3 sm:p-4 text-center hover:scale-105 transition-transform">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-primary" />
                  <div className="text-xl sm:text-2xl font-bold">50+</div>
                  <div className="text-[10px] sm:text-sm text-muted-foreground whitespace-nowrap">
                    Projects Delivered
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  {personalInfo.location}
                </div>
              </div>

              <Button size="lg" className="bg-gradient-primary" asChild>
                <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 w-4 h-4" />
                  Download Resume
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Highlights */}
      <section className="py-20 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What I <span className="gradient-text">Bring</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Core competencies that drive successful project delivery and team
              excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="premium-card p-6 sm:p-8 text-center group hover:scale-105 transition-all duration-300">
              <Code className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                System Architecture
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Designing scalable, maintainable systems using AWS cloud
                services and modern development practices.
              </p>
            </div>

            <div className="premium-card p-6 sm:p-8 text-center group hover:scale-105 transition-all duration-300">
              <Users className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                Team Leadership
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Leading development teams, mentoring engineers, and establishing
                best practices for code quality.
              </p>
            </div>

            <div className="premium-card p-6 sm:p-8 text-center group hover:scale-105 transition-all duration-300">
              <Award className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                Technical Excellence
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Delivering high-quality solutions with focus on performance,
                security, and developer experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              My <span className="gradient-text">Journey</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Key milestones in my software engineering career
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                year: "2024",
                title: "Senior Software Engineer",
                company: "Craftsmen Ltd.",
                description:
                  "Leading full-stack development and system architecture decisions",
              },
              {
                year: "2021",
                title: "Software Engineer",
                company: "BJIT Group Ltd.",
                description:
                  "Developed scalable web applications and mentored junior developers",
              },
              {
                year: "2018",
                title: "Started Journey",
                company: "Annon Lab",
                description:
                  "Began my career in software development and system design",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="relative premium-card p-6 hover:scale-102 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                    {item.year}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                    <p className="text-primary font-medium mb-2">
                      {item.company}
                    </p>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
