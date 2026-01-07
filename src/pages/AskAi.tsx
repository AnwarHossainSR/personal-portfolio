import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { experience } from "@/data/experience";
import { personalInfo } from "@/data/personal";
import { projects } from "@/data/projects";
import { certifications, skillCategories, topSkills } from "@/data/skills";
import { Bot, Loader2, Send, Sparkles, User } from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Build context about Anwar for the AI
const buildSystemContext = () => {
  const expSummary = experience
    .map(
      (e) =>
        `${e.position} at ${e.company} (${e.duration}): ${
          e.description
        } Key achievements: ${e.achievements.join(", ")}`
    )
    .join("\n");

  const projectsSummary = projects
    .slice(0, 4)
    .map(
      (p) =>
        `${p.title}: ${p.description} Technologies: ${p.technologies.join(
          ", "
        )}`
    )
    .join("\n");

  const skillsSummary = skillCategories
    .map((cat) => `${cat.name}: ${cat.skills.map((s) => s.name).join(", ")}`)
    .join("\n");

  const certsSummary = certifications
    .map((c) => `${c.name} (${c.level}) from ${c.issuer}, ${c.year}`)
    .join("\n");

  return `You are an AI assistant for ${
    personalInfo.name
  }'s portfolio website. Answer questions about him professionally and helpfully.

PERSONAL INFO:
- Name: ${personalInfo.name}
- Title: ${personalInfo.title}
- Subtitle: ${personalInfo.subtitle}
- Email: ${personalInfo.email}
- Location: ${personalInfo.location}
- LinkedIn: ${personalInfo.linkedin}
- GitHub: ${personalInfo.github}
- YouTube: ${personalInfo.youtube}

BIO:
${personalInfo.bio.long}

KEY HIGHLIGHTS:
${personalInfo.highlights.join("\n")}

CURRENT FOCUS:
${personalInfo.currentFocus.join("\n")}

EXPERIENCE:
${expSummary}

TOP SKILLS: ${topSkills.join(", ")}

SKILLS BY CATEGORY:
${skillsSummary}

CERTIFICATIONS:
${certsSummary}

NOTABLE PROJECTS:
${projectsSummary}

INSTRUCTIONS:
- Be friendly, professional, and helpful
- Answer questions about Anwar's experience, skills, projects, and background
- If asked about something not related to Anwar or his work, politely redirect
- Keep responses concise but informative
- Use markdown formatting when appropriate for links or lists`;
};

const SYSTEM_CONTEXT = buildSystemContext();

const suggestedQuestions = [
  "What is Anwar's experience with AWS?",
  "Tell me about Anwar's recent projects",
  "What programming languages does Anwar know?",
  "How can I contact Anwar?",
];

export default function AskAi() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

      if (!apiKey) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "⚠️ OpenAI API key is not configured. Please add `VITE_OPENAI_API_KEY` to your `.env.local` file.",
          },
        ]);
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: SYSTEM_CONTEXT },
              ...messages.map((m) => ({ role: m.role, content: m.content })),
              { role: "user", content: text },
            ],
            max_tokens: 500,
            temperature: 0.7,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content:
          data.choices[0]?.message?.content ||
          "Sorry, I couldn't generate a response.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, there was an error processing your request. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              AI Assistant
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Ask About{" "}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Anwar
            </span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Have questions about my experience, skills, or projects? Ask the AI
            assistant below!
          </p>
        </div>

        {/* Chat Container */}
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
          {/* Messages Area */}
          <ScrollArea
            className="h-[400px] sm:h-[500px] p-4"
            ref={scrollRef as any}
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mb-4">
                  <Bot className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Start a Conversation
                </h3>
                <p className="text-muted-foreground text-sm mb-6 max-w-sm">
                  Ask me anything about Anwar's professional background,
                  technical skills, or projects.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                  {suggestedQuestions.map((q) => (
                    <Button
                      key={q}
                      variant="outline"
                      size="sm"
                      className="text-left justify-start h-auto py-2 px-3 text-xs hover:bg-primary/5 hover:border-primary/30"
                      onClick={() => sendMessage(q)}
                    >
                      {q}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/50 border border-border/50"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                    {message.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-blue-500" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div className="bg-muted/50 border border-border/50 rounded-2xl px-4 py-2.5">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-border/50 p-4 bg-background/50">
            <div className="flex gap-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask something about Anwar..."
                className="min-h-[44px] max-h-32 resize-none bg-muted/30 border-border/50 focus:border-primary/50"
                disabled={isLoading}
              />
              <Button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="h-[44px] w-[44px] bg-gradient-to-r from-primary to-purple-500 hover:opacity-90"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Powered by OpenAI GPT-4o-mini • Responses are AI-generated
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
