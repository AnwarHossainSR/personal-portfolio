import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Copy, Check, Github, Linkedin, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SEOHead } from '@/components/SEO';
import { personalInfo, socialLinks } from '@/data/personal';
import { useToast } from '@/hooks/use-toast';

const iconMap = {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Twitter: Mail
};

export default function Contact() {
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      });
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <SEOHead
        title="Contact Me"
        description="Get in touch with Anwar Hossain for collaboration opportunities, technical discussions, or project inquiries. Available for AWS consulting and full-stack development."
        keywords="Contact Anwar Hossain, Software Engineer Contact, AWS Consultant, Full Stack Developer Hire"
        url="https://anwarportfolio.vercel.app/contact"
      />
      <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 slide-in-up">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to discuss your next project? I'm always interested in new opportunities, collaborations, and innovative challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8 slide-in-up">
            <div>
              <h2 className="text-2xl font-bold mb-6">Let's Connect</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                I'm currently open to new opportunities and would love to hear about your project. 
                Whether you're looking for a senior engineer to lead your team or need expert consultation 
                on system architecture, let's start a conversation.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              {/* Email */}
              <div className="premium-card p-6 group hover:scale-102 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-muted-foreground">{personalInfo.email}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(personalInfo.email, 'Email')}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copied === 'Email' ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Phone */}
              <div className="premium-card p-6 group hover:scale-102 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-muted-foreground">{personalInfo.phone}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(personalInfo.phone, 'Phone')}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copied === 'Phone' ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Location */}
              <div className="premium-card p-6 hover:scale-102 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Location</h3>
                    <p className="text-muted-foreground">{personalInfo.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="font-semibold mb-4">Follow Me</h3>
              <div className="flex gap-4">
                {socialLinks.map((social) => {
                  const Icon = iconMap[social.icon as keyof typeof iconMap] ?? ExternalLink;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-lg bg-muted/50 hover:bg-primary/20 hover:text-primary transition-all duration-200 flex items-center justify-center group hover:scale-110"
                      aria-label={social.name}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Resume Download */}
            <div className="premium-card p-6">
              <h3 className="font-semibold mb-3">Resume</h3>
              <p className="text-muted-foreground mb-4">
                Download my complete resume to learn more about my experience and skills.
              </p>
              <Button className="bg-gradient-primary" asChild>
                <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </a>
              </Button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="slide-in-up" style={{ animationDelay: '200ms' }}>
            <div className="premium-card p-8">
              <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name *
                    </label>
                    <Input id="name" placeholder="Your name" required />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <Input id="email" type="email" placeholder="your.email@example.com" required />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject *
                  </label>
                  <Input id="subject" placeholder="Project discussion, collaboration, etc." required />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Tell me about your project, requirements, or just say hello..."
                    rows={6}
                    required
                  />
                </div>

                <Button 
                  type="button" 
                  size="lg" 
                  className="w-full bg-gradient-primary group"
                  onClick={() => {
                    toast({
                      title: "Demo Mode",
                      description: "This is a demo form. In production, this would send your message.",
                    });
                  }}
                >
                  <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Send Message
                </Button>
                
                <p className="text-xs text-muted-foreground">
                  * This is a demo form. For now, please reach out via email or social media.
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20 premium-card p-8">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Start Your <span className="gradient-text">Project</span>?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Whether you need a technical co-founder, senior engineer, or system architecture consultant, 
            I'm here to help bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-primary" asChild>
              <a href={`mailto:${personalInfo.email}`}>
                <Mail className="mr-2 w-4 h-4" />
                Email Me Directly
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href={`tel:${personalInfo.phone}`}>
                <Phone className="mr-2 w-4 h-4" />
                Schedule a Call
              </a>
            </Button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}