import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { debounce } from "lodash";
import { Download, ExternalLink, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navigationItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Experience", href: "/experience" },
  { name: "Projects", href: "/projects" },
  { name: "Skills", href: "/skills" },
  { name: "YouTube", href: "/youtube" },
  { name: "Ask AI", href: "/ask-ai" },
  { name: "Contact", href: "/contact" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = debounce(() => {
      setScrolled(window.scrollY > 24);
    }, 80);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <>
      <nav
        className={cn(
          "fixed left-0 right-0 top-0 z-[100] transition-all duration-300",
          scrolled ? "glass-nav shadow-premium" : "border-b border-transparent bg-background/70 backdrop-blur-md",
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <Link to="/" className="text-lg font-black tracking-tight text-foreground transition hover:text-primary">
              Anwar<span className="text-primary">.dev</span>
            </Link>

            <div className="hidden items-center gap-1 lg:flex">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-semibold transition",
                    location.pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <ThemeToggle />
              <Button size="sm" className="bg-gradient-primary font-bold text-primary-foreground" asChild>
                <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  Resume
                  <ExternalLink className="ml-2 h-3.5 w-3.5" />
                </a>
              </Button>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="z-[110] rounded-md border border-card-border bg-card p-2 transition hover:bg-muted md:hidden"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="h-5 w-5 text-primary" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className={cn("overflow-hidden transition-all duration-300 md:hidden", isOpen ? "max-h-[90vh] opacity-100" : "max-h-0 opacity-0")}>
          <div className="border-t border-border bg-background/98 px-4 pb-6 pt-3 shadow-premium">
            <div className="grid gap-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-semibold transition",
                    location.pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <div className="mt-3 flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm font-semibold text-muted-foreground">Theme</span>
                <ThemeToggle />
              </div>
              <Button className="mt-2 w-full bg-gradient-primary font-bold text-primary-foreground" asChild>
                <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  Download resume
                </a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="h-16" />
    </>
  );
}
