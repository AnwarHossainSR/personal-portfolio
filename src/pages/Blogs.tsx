import { SEOHead } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface BlogPost {
  title: string;
  excerpt: string;
  date: string; // ISO date
  url: string;
  tags: string[];
  readingTime: string;
}

const posts: BlogPost[] = [
  {
    title: "Designing Scalable AWS Architectures",
    excerpt:
      "A practical guide to building fault-tolerant, cost‑efficient systems on AWS using proven patterns.",
    date: "2024-03-18",
    url: "https://example.com/blog/scalable-aws-architectures",
    tags: ["AWS", "Architecture", "DevOps"],
    readingTime: "8 min read",
  },
  {
    title: "React 19 Adoption Strategy",
    excerpt:
      "What changes in React 19 and a roadmap to safely migrate a production app without downtime.",
    date: "2024-02-10",
    url: "https://example.com/blog/react-19-adoption",
    tags: ["React", "TypeScript", "Frontend"],
    readingTime: "6 min read",
  },
  {
    title: "Serverless Observability Essentials",
    excerpt:
      "How to trace, log, and monitor serverless workloads with low overhead and maximum insight.",
    date: "2024-01-28",
    url: "https://example.com/blog/serverless-observability",
    tags: ["Serverless", "Monitoring", "Best Practices"],
    readingTime: "7 min read",
  },
  {
    title: "Type-Safe APIs with Zod",
    excerpt:
      "Enforce end‑to‑end type safety in your React apps using Zod schemas and shared contracts.",
    date: "2023-12-15",
    url: "https://example.com/blog/type-safe-apis-zod",
    tags: ["TypeScript", "Zod", "API"],
    readingTime: "5 min read",
  },
];

export default function Blogs() {
  return (
    <>
      <SEOHead
        title="Blogs"
        description="Articles on AWS, React, TypeScript, and system design — practical guides and architecture patterns."
        keywords="blog, articles, AWS, React, TypeScript, system design"
        url="https://anwarportfolio.vercel.app/blogs"
        type="blog"
      />

      {/* Structured Data for Blog and Articles */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Anwar's Engineering Blog",
          url: "https://anwarportfolio.vercel.app/blogs",
          blogPost: posts.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            description: p.excerpt,
            datePublished: p.date,
            author: { "@type": "Person", name: "Md. Anwar Hossain" },
            mainEntityOfPage: p.url,
          })),
        })}
      </script>

      <header className="relative py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-accent/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="premium-card p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blogs</h1>
            <p className="text-muted-foreground/90 text-lg max-w-3xl">
              Practical deep‑dives and concise guides on building scalable, reliable, and elegant software.
            </p>
          </div>
        </div>
      </header>

      <main className="relative py-12 md:py-20">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <article key={post.title} className="premium-card interactive-card">
              <Card className="bg-transparent border-none shadow-none">
                <CardHeader>
                  <CardTitle className="text-2xl leading-snug">{post.title}</CardTitle>
                  <CardDescription>
                    <time dateTime={post.date} className="mr-2">
                      {new Date(post.date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                    </time>
                    • {post.readingTime}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground/90 mb-4">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                  <Button asChild variant="outline">
                    <a href={post.url} target="_blank" rel="noopener noreferrer" aria-label={`Read article ${post.title}`}>
                      Read Article <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
