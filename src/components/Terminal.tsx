import { personalInfo } from "@/data/personal";
import { featuredProjects } from "@/data/projects";
import { topSkills } from "@/data/skills";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

interface TerminalLine {
  type: "command" | "output" | "error";
  content: string;
}

const COMMANDS = {
  help: "Display all available commands",
  about: "Show profile summary",
  skills: "List core technical skills",
  projects: "Display featured projects",
  contact: "Show contact information",
  experience: "Display work focus",
  clear: "Clear terminal screen",
  whoami: "Display current profile",
  ls: "List available sections",
  cat: "Navigate to a section (usage: cat projects)",
  github: "Open GitHub profile",
  linkedin: "Open LinkedIn profile",
  resume: "Open resume",
  exit: "Minimize terminal",
};

const ASCII_BANNER = `
+-----------------------------------------------------------+
| Md. Anwar Hossain                                        |
| Senior Software Engineer | AWS | Full-Stack | DevOps      |
+-----------------------------------------------------------+

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

  useEffect(() => {
    if (!isMinimized) {
      inputRef.current?.focus();
    }
  }, [isMinimized]);

  const appendLine = (line: TerminalLine) => {
    setLines((previous) => [...previous, line]);
  };

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const [command, ...args] = trimmedCmd.split(" ");

    appendLine({ type: "command", content: `$ ${cmd}` });
    if (!command) return;

    switch (command) {
      case "help": {
        const helpText = Object.entries(COMMANDS)
          .map(([name, description]) => `  ${name.padEnd(12)} - ${description}`)
          .join("\n");
        appendLine({ type: "output", content: `Available commands:\n\n${helpText}` });
        break;
      }
      case "about":
        appendLine({
          type: "output",
          content: `${personalInfo.name}\n${personalInfo.title}\n\n${personalInfo.bio.short}\n\nLocation: ${personalInfo.location}\nEmail: ${personalInfo.email}`,
        });
        break;
      case "skills":
        appendLine({
          type: "output",
          content: `Core technical skills:\n\n${topSkills.map((skill, index) => `  ${index + 1}. ${skill}`).join("\n")}`,
        });
        break;
      case "projects": {
        const projectsList = featuredProjects
          .map(
            (project, index) =>
              `  ${index + 1}. ${project.title} (${project.year})\n     ${project.description}\n     Stack: ${project.technologies.slice(0, 4).join(", ")}`,
          )
          .join("\n\n");
        appendLine({ type: "output", content: `Featured projects:\n\n${projectsList}` });
        break;
      }
      case "contact":
        appendLine({
          type: "output",
          content: `Contact:\n\nEmail: ${personalInfo.email}\nGitHub: ${personalInfo.github}\nLinkedIn: ${personalInfo.linkedin}`,
        });
        break;
      case "experience":
        appendLine({
          type: "output",
          content:
            "Work focus:\n\n  - AWS Cloud Architecture\n  - Full-Stack Development\n  - DevOps and CI/CD\n  - System Design\n\nFor details, visit /experience.",
        });
        break;
      case "clear":
        setLines([]);
        break;
      case "whoami":
        appendLine({
          type: "output",
          content: `${personalInfo.name}\n${personalInfo.title}\n${personalInfo.subtitle}`,
        });
        break;
      case "ls":
        appendLine({
          type: "output",
          content: "Available sections:\n\n  about/\n  experience/\n  projects/\n  skills/\n  contact/\n  youtube/\n  ask-ai/",
        });
        break;
      case "cat":
        if (args.length === 0) {
          appendLine({ type: "error", content: "Usage: cat [section]" });
        } else {
          const section = args[0] === "home" ? "" : args[0];
          navigate(`/${section}`);
          appendLine({ type: "output", content: `Navigating to /${section}...` });
        }
        break;
      case "github":
        window.open(personalInfo.github, "_blank");
        appendLine({ type: "output", content: "Opening GitHub profile..." });
        break;
      case "linkedin":
        window.open(personalInfo.linkedin, "_blank");
        appendLine({ type: "output", content: "Opening LinkedIn profile..." });
        break;
      case "resume":
        window.open("/resume.pdf", "_blank");
        appendLine({ type: "output", content: "Opening resume..." });
        break;
      case "exit":
        setIsMinimized(true);
        break;
      default:
        appendLine({
          type: "error",
          content: `Command not found: ${command}\nType 'help' for available commands.`,
        });
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;

    setHistory((previous) => [...previous, input]);
    setHistoryIndex(-1);
    executeCommand(input);
    setInput("");
    setSuggestions([]);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
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
    } else if (event.key === "Tab") {
      event.preventDefault();
      if (suggestions.length > 0) {
        setInput(suggestions[0]);
        setSuggestions([]);
      }
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    setSuggestions(
      value.trim()
        ? Object.keys(COMMANDS).filter((command) => command.startsWith(value.toLowerCase()))
        : [],
    );
  };

  if (isMinimized) {
    return (
      <button
        type="button"
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 z-50 rounded-md border border-primary/30 bg-background/90 px-4 py-2 font-mono text-xs font-bold text-primary shadow-premium backdrop-blur transition hover:bg-primary hover:text-primary-foreground sm:bottom-6 sm:right-6"
      >
        $ terminal
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] sm:bottom-6 sm:right-6 sm:max-w-2xl">
      <div className="premium-card overflow-hidden font-mono text-xs">
        <div className="flex items-center justify-between border-b border-card-border bg-secondary/80 px-4 py-3">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setIsMinimized(true)} className="h-3 w-3 rounded-full bg-yellow-500" aria-label="Minimize" />
            <button type="button" onClick={() => setLines([])} className="h-3 w-3 rounded-full bg-green-500" aria-label="Clear" />
            <span className="text-muted-foreground">anwar@portfolio:~$</span>
          </div>
          <span className="hidden text-muted-foreground sm:block">Developer console</span>
        </div>

        <div ref={terminalRef} className="h-72 overflow-y-auto bg-background/95 p-4 scrollbar-thin sm:h-96">
          {lines.map((line, index) => (
            <div
              key={`${line.content}-${index}`}
              className={`mb-2 ${
                line.type === "command"
                  ? "font-semibold text-primary"
                  : line.type === "error"
                    ? "text-destructive"
                    : "text-foreground/80"
              }`}
            >
              <pre className="whitespace-pre-wrap font-mono leading-relaxed">{line.content}</pre>
            </div>
          ))}

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <span className="text-primary">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => handleInputChange(event.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 border-none bg-transparent font-mono text-foreground outline-none"
              placeholder="Type help..."
            />
          </form>

          {suggestions.length > 0 && (
            <div className="mt-2 text-muted-foreground">Suggestions: {suggestions.join(", ")}</div>
          )}
        </div>
      </div>
    </div>
  );
}
