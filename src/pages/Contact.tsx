import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Copy, Download, Github, Linkedin, Mail, MapPin, Phone, Send, Youtube } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { SEOHead } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { personalInfo, socialLinks } from "@/data/personal";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const iconMap = {
  Github,
  Linkedin,
  Mail,
  Youtube,
};

export default function Contact() {
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      toast({ title: "Copied", description: `${type} copied to clipboard.` });
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast({
        title: "Copy failed",
        description: "Please copy it manually.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = (data: ContactFormData) => {
    const subject = encodeURIComponent(data.subject);
    const body = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`,
    );
    window.location.href = `mailto:${personalInfo.email}?subject=${subject}&body=${body}`;
  };

  return (
    <>
      <SEOHead
        title="Contact Me"
        description="Contact Md. Anwar Hossain for senior software engineering, AWS cloud, DevOps, system design, and full-stack development opportunities."
        keywords="Contact Anwar Hossain, Senior Software Engineer, AWS Consultant, Full Stack Developer"
        url="https://anwarportfolio.vercel.app/contact"
      />
      <div className="min-h-screen py-16 sm:py-20">
        <div className="section-shell">
          <div className="mx-auto max-w-3xl text-center slide-in-up">
            <p className="eyebrow">Contact</p>
            <h1 className="mt-3 text-4xl font-black sm:text-6xl">Let us discuss the engineering work</h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Open to senior engineering roles, cloud architecture conversations, full-stack delivery, and DevOps-focused collaboration.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="space-y-4">
              {[
                { label: "Email", value: personalInfo.email, href: `mailto:${personalInfo.email}`, icon: Mail },
                { label: "Phone", value: personalInfo.phone, href: `tel:${personalInfo.phone}`, icon: Phone },
                { label: "Location", value: personalInfo.location, href: null, icon: MapPin },
              ].map((item) => (
                <div key={item.label} className="premium-card p-5">
                  <div className="flex items-center gap-4">
                    <div className="rounded-md bg-primary/10 p-3 text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-bold">{item.label}</h2>
                      {item.href ? (
                        <a href={item.href} className="mt-1 block truncate text-sm text-muted-foreground hover:text-primary">
                          {item.value}
                        </a>
                      ) : (
                        <p className="mt-1 text-sm text-muted-foreground">{item.value}</p>
                      )}
                    </div>
                    <Button variant="outline" size="icon" className="border-card-border" onClick={() => copyToClipboard(item.value, item.label)}>
                      {copied === item.label ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              ))}

              <div className="premium-card p-5">
                <h2 className="font-bold">Professional links</h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {socialLinks.map((social) => {
                    const Icon = iconMap[social.icon as keyof typeof iconMap] ?? Mail;
                    return (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-md border border-card-border bg-secondary/60 px-3 py-2 text-sm font-bold text-muted-foreground transition hover:border-primary/50 hover:text-primary"
                      >
                        <Icon className="h-4 w-4" />
                        {social.name}
                      </a>
                    );
                  })}
                </div>
              </div>

              <div className="premium-card p-5">
                <h2 className="font-bold">Resume</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Open the PDF resume for the complete experience, skills, and contact summary.
                </p>
                <Button className="mt-4 w-full bg-gradient-primary font-bold text-primary-foreground" asChild>
                  <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Open resume
                  </a>
                </Button>
              </div>
            </div>

            <div className="premium-card p-6 sm:p-8">
              <h2 className="text-2xl font-black">Send a message</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                This opens your email app with the message prepared. No backend form service is required.
              </p>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-bold">Name</label>
                    <Input id="name" placeholder="Your name" {...register("name")} className="border-card-border bg-background/70" />
                    {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-bold">Email</label>
                    <Input id="email" type="email" placeholder="you@example.com" {...register("email")} className="border-card-border bg-background/70" />
                    {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="mb-2 block text-sm font-bold">Subject</label>
                  <Input id="subject" placeholder="Project, role, or collaboration" {...register("subject")} className="border-card-border bg-background/70" />
                  {errors.subject && <p className="mt-1 text-sm text-destructive">{errors.subject.message}</p>}
                </div>
                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-bold">Message</label>
                  <Textarea id="message" rows={7} placeholder="Tell me what you are building or hiring for..." {...register("message")} className="border-card-border bg-background/70" />
                  {errors.message && <p className="mt-1 text-sm text-destructive">{errors.message.message}</p>}
                </div>
                <Button type="submit" size="lg" className="w-full bg-gradient-primary font-bold text-primary-foreground" disabled={!isValid}>
                  <Send className="mr-2 h-4 w-4" />
                  Prepare email
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
