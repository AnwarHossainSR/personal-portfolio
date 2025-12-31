import { SEOHead } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { personalInfo, socialLinks } from "@/data/personal";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
  Youtube,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Form validation schema
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
  ExternalLink,
  Youtube,
  Twitter: Mail,
};

export default function Contact() {
  const [copied, setCopied] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onChange", // Validate on change for real-time feedback
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const copyToClipboard = async (text: string, type: string) => {
    try {
      // Simple fallback approach that works in all browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "absolute";
      textArea.style.left = "-9999px";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      textArea.setSelectionRange(0, 99999); // For mobile devices

      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (successful) {
        setCopied(type);
        toast({
          title: "Copied!",
          description: `${type} copied to clipboard`,
        });
        setTimeout(() => setCopied(null), 2000);
      } else {
        throw new Error("Copy command failed");
      }
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real application, you would send the data to your backend
      console.log("Form Data:", data);

      toast({
        title: "Message Sent! 🎉",
        description: "Thank you for your message. I'll get back to you soon!",
      });

      // Reset form after successful submission
      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
          <div className="text-center mb-10 sm:mb-16 slide-in-up">
            <h1 className="text-3xl sm:text-5xl font-bold mb-4">
              Get in <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
              Ready to discuss your next project? I'm always interested in new
              opportunities, collaborations, and innovative challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-6 sm:space-y-8 slide-in-up">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                  Let's Connect
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                  I'm currently open to new opportunities and would love to hear
                  about your project. Whether you're looking for a senior
                  engineer to lead your team or need expert consultation on
                  system architecture, let's start a conversation.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                {/* Email */}
                <div className="premium-card p-4 sm:p-6 group hover:scale-102 transition-all duration-300">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:font-semibold mb-0.5 sm:mb-1">
                        Email
                      </h3>
                      <p className="text-xs sm:text-base text-muted-foreground truncate">
                        {personalInfo.email}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        copyToClipboard(personalInfo.email, "Email")
                      }
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      type="button"
                    >
                      {copied === "Email" ? (
                        <Check className="w-4 h-4 cursor-pointer text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 cursor-pointer" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Phone */}
                <div className="premium-card p-4 sm:p-6 group hover:scale-102 transition-all duration-300">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:font-semibold mb-0.5 sm:mb-1">
                        Phone
                      </h3>
                      <p className="text-xs sm:text-base text-muted-foreground truncate">
                        {personalInfo.phone}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        copyToClipboard(personalInfo.phone, "Phone")
                      }
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      type="button"
                    >
                      {copied === "Phone" ? (
                        <Check className="w-4 h-4 cursor-pointer text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 cursor-pointer" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Location */}
                <div className="premium-card p-4 sm:p-6 hover:scale-102 transition-all duration-300">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:font-semibold mb-0.5 sm:mb-1">
                        Location
                      </h3>
                      <p className="text-xs sm:text-base text-muted-foreground">
                        {personalInfo.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-lg sm:font-semibold mb-4 text-center sm:text-left">
                  Follow Me
                </h3>
                <div className="flex justify-center sm:justify-start gap-4">
                  {socialLinks.map((social) => {
                    const Icon =
                      iconMap[social.icon as keyof typeof iconMap] ??
                      ExternalLink;
                    return (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-muted/50 hover:bg-primary/20 hover:text-primary transition-all duration-200 flex items-center justify-center group hover:scale-110"
                        aria-label={social.name}
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Resume Download */}
              <div className="premium-card p-5 sm:p-6">
                <h3 className="text-lg sm:font-semibold mb-2 sm:mb-3">
                  Resume
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4">
                  Download my complete resume to learn more about my experience
                  and skills.
                </p>
                <Button
                  className="w-full sm:w-auto bg-gradient-primary"
                  asChild
                >
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="w-4 h-4 cursor-pointer mr-2" />
                    Download Resume
                  </a>
                </Button>
              </div>
            </div>

            {/* Contact Form */}
            <div className="slide-in-up" style={{ animationDelay: "200ms" }}>
              <div className="premium-card p-5 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-6">
                  Send a Message
                </h2>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium mb-2"
                      >
                        Name *
                      </label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        {...register("name")}
                        className={
                          errors.name
                            ? "border-red-500 focus:border-red-500"
                            : ""
                        }
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-2"
                      >
                        Email *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        {...register("email")}
                        className={
                          errors.email
                            ? "border-red-500 focus:border-red-500"
                            : ""
                        }
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium mb-2"
                    >
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      placeholder="Project discussion, collaboration, etc."
                      {...register("subject")}
                      className={
                        errors.subject
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium mb-2"
                    >
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Tell me about your project, requirements, or just say hello..."
                      rows={6}
                      {...register("message")}
                      className={
                        errors.message
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-primary group disabled:opacity-50"
                    disabled={!isValid || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 cursor-pointer mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 cursor-pointer mr-2 group-hover:translate-x-1 transition-transform" />
                        Send Message
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground">
                    * All fields are required. Your message will be sent
                    successfully!
                  </p>
                </form>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-20 premium-card p-8">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Start Your <span className="gradient-text">Project</span>
              ?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Whether you need a technical co-founder, senior engineer, or
              system architecture consultant, I'm here to help bring your vision
              to life.
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
