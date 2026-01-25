import { personalInfo } from "@/data/personal";
import { featuredProjects } from "@/data/projects";
import { topSkills } from "@/data/skills";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

interface TerminalLine {
  type: "command" | "output" | "error";
  content: string;
}

const COMMANDS = {
  help: "Display all available commands",
  about: "Show information about me",
  skills: "List my technical skills",
  projects: "Display featured projects",
  contact: "Show contact information",
  experience: "Display work history",
  clear: "Clear terminal screen",
  theme: "Toggle theme (dark/light)",
  whoami: "Display current user info",
  ls: "List available sections",
  cat: "Display section content (usage: cat [section])",
  github: "Open GitHub profile",
  linkedin: "Open LinkedIn profile",
  resume: "Download resume",
  exit: "Minimize terminal",
};

const ASCII_BANNER = `
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   █████╗ ███╗   ██╗██╗    ██╗ █████╗ ██████╗            ║
║  ██╔══██╗████╗  ██║██║    ██║██╔══██╗██╔══██╗           ║
║  ███████║██╔██╗ ██║██║ █╗ ██║███████║██████╔╝           ║
║  ██╔══██║██║╚██╗██║██║███╗██║██╔══██║██╔══██╗           ║
║  ██║  ██║██║ ╚████║╚███╔███╔╝██║  ██║██║  ██║           ║
║  ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝           ║
║                                                           ║
║          Senior Software Engineer & AWS Architect         ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

Type 'help' to see available commands.
`;

export default function Terminal() {
  const [isMinimized, setIsMinimized] = useState(true);
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "output", content: ASCII_BANNER },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const [command, ...args] = trimmedCmd.split(" ");

    setLines((prev) => [...prev, { type: "command", content: `$ ${cmd}` }]);

    if (!command) return;

    switch (command) {
      case "help":
        const helpText = Object.entries(COMMANDS)
          .map(([cmd, desc]) => `  ${cmd.padEnd(12)} - ${desc}`)
          .join("\n");
        setLines((prev) => [
          ...prev,
          { type: "output", content: "Available commands:\n\n" + helpText },
        ]);
        break;

      case "about":
        setLines((prev) => [
          ...prev,
          {
            type: "output",
            content: `${personalInfo.name}\n${personalInfo.title}\n\n${personalInfo.bio.short}\n\nLocation: ${personalInfo.location}\nEmail: ${personalInfo.email}`,
          },
        ]);
        break;

      case "skills":
        setLines((prev) => [
          ...prev,
          {
            type: "output",
            content: `Core Technical Skills:\n\n${topSkills.map((skill, i) => `  ${i + 1}. ${skill}`).join("\n")}`,
          },
        ]);
        break;

      case "projects":
        const projectsList = featuredProjects
          .map(
            (p, i) =>
              `  ${i + 1}. ${p.title} (${p.year})\n     ${p.description}\n     Tech: ${p.technologies.slice(0, 3).join(", ")}`,
          )
          .join("\n\n");
        setLines((prev) => [
          ...prev,
          { type: "output", content: `Featured Projects:\n\n${projectsList}` },
        ]);
        break;

      case "contact":
        setLines((prev) => [
          ...prev,
          {
            type: "output",
            content: `Contact Information:\n\nEmail: ${personalInfo.email}\nGitHub: github.com/AnwarHossainSR\nLinkedIn: linkedin.com/in/anwar-hossain\n\nType 'github' or 'linkedin' to open profiles.`,
          },
        ]);
        break;

      case "experience":
        setLines((prev) => [
          ...prev,
          {
            type: "output",
            content: `Work Experience:\n\n6+ years in software engineering\nSpecializations:\n  • AWS Cloud Architecture\n  • Full-Stack Development\n  • DevOps & CI/CD\n  • System Design\n\nFor detailed experience, visit /experience page.`,
          },
        ]);
        break;

      case "clear":
        setLines([]);
        break;

      case "theme":
        document.documentElement.classList.toggle("light");
        setLines((prev) => [
          ...prev,
          { type: "output", content: "Theme toggled!" },
        ]);
        break;

      case "whoami":
        setLines((prev) => [
          ...prev,
          {
            type: "output",
            content: `${personalInfo.name}\nSenior Software Engineer\nAWS Certified Solutions Architect`,
          },
        ]);
        break;

      case "ls":
        setLines((prev) => [
          ...prev,
          {
            type: "output",
            content:
              "Available sections:\n\n  home/\n  about/\n  experience/\n  projects/\n  skills/\n  contact/\n  youtube/",
          },
        ]);
        break;

      case "cat":
        if (args.length === 0) {
          setLines((prev) => [
            ...prev,
            { type: "error", content: "Usage: cat [section]" },
          ]);
        } else {
          const section = args[0];
          navigate(`/${section}`);
          setLines((prev) => [
            ...prev,
            { type: "output", content: `Navigating to /${section}...` },
          ]);
        }
        break;

      case "github":
        window.open("https://github.com/AnwarHossainSR", "_blank");
        setLines((prev) => [
          ...prev,
          { type: "output", content: "Opening GitHub profile..." },
        ]);
        break;

      case "linkedin":
        window.open("https://linkedin.com/in/anwar-hossain", "_blank");
        setLines((prev) => [
          ...prev,
          { type: "output", content: "Opening LinkedIn profile..." },
        ]);
        break;

      case "resume":
        window.open("/resume.pdf", "_blank");
        setLines((prev) => [
          ...prev,
          { type: "output", content: "Opening resume..." },
        ]);
        break;

      case "exit":
        setIsMinimized(true);
        break;

      default:
        setLines((prev) => [
          ...prev,
          {
            type: "error",
            content: `Command not found: ${command}\nType 'help' for available commands.`,
          },
        ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setHistory((prev) => [...prev, input]);
    setHistoryIndex(-1);
    executeCommand(input);
    setInput("");
    setSuggestions([]);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex =
          historyIndex === -1
            ? history.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = Math.min(history.length - 1, historyIndex + 1);
        if (newIndex === history.length - 1 && historyIndex === newIndex) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (suggestions.length > 0) {
        setInput(suggestions[0]);
        setSuggestions([]);
      }
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    if (value.trim()) {
      const matches = Object.keys(COMMANDS).filter((cmd) =>
        cmd.startsWith(value.toLowerCase()),
      );
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  if (isMinimized) {
    return (
      <button
        type="button"
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-primary text-white rounded-xl shadow-premium hover:shadow-glow transition-all duration-300 hover:scale-105 font-mono text-xs sm:text-sm"
      >
        $ Open Terminal
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-full sm:max-w-2xl">
      <div className="premium-card overflow-hidden font-mono text-xs sm:text-sm">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 bg-gradient-to-r from-primary/20 to-accent/20 border-b border-card-border/50">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1.5 sm:space-x-2">
              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
                aria-label="Minimize"
              />
              <button
                type="button"
                onClick={() => setLines([])}
                className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
                aria-label="Clear"
              />
              <div className="w-3 h-3 rounded-full bg-red-500" />
            </div>
            <span className="ml-4 text-foreground/70">anwar@portfolio:~$</span>
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
            Interactive Terminal
          </div>
        </div>

        {/* Terminal Body */}
        <div
          ref={terminalRef}
          className="bg-background/95 backdrop-blur-xl p-3 sm:p-4 h-64 sm:h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent"
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((line, i) => (
            <div
              key={i}
              className={`mb-1.5 sm:mb-2 ${
                line.type === "command"
                  ? "text-primary font-semibold"
                  : line.type === "error"
                    ? "text-destructive"
                    : "text-foreground/80"
              }`}
            >
              <pre className="whitespace-pre-wrap font-mono text-[10px] sm:text-xs leading-relaxed">
                {line.content}
              </pre>
            </div>
          ))}

          {/* Input Line */}
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <span className="text-primary">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-foreground font-mono text-xs"
              placeholder="Type 'help' for commands..."
              autoFocus
            />
          </form>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="mt-2 text-muted-foreground text-xs">
              Suggestions: {suggestions.join(", ")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
