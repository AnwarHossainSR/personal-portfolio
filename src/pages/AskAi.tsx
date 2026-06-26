import { SEOHead } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { experience } from "@/data/experience";
import { personalInfo } from "@/data/personal";
import { projects } from "@/data/projects";
import { certifications, skillCategories, topSkills } from "@/data/skills";
import {
  AlertTriangle,
  Bot,
  Clock,
  Key,
  Loader2,
  MessageSquare,
  RefreshCw,
  Send,
  Settings,
  Sparkles,
  User,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
  errorType?: "rate_limit" | "api_error" | "config_error";
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
  { icon: Zap, text: "How does Anwar approach AI automation?" },
  { icon: MessageSquare, text: "Tell me about his agentic AI work" },
  { icon: Sparkles, text: "What tech stack does he specialize in?" },
  { icon: Bot, text: "How can I get in touch with Anwar?" },
];

const getGeminiText = (data: {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
}) =>
  data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text)
    .filter(Boolean)
    .join("\n")
    .trim();

export default function AskAi() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [retryCountdown, setRetryCountdown] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [customApiKey, setCustomApiKey] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("gemini_api_key") || "";
    }
    return "";
  });
  const [tempApiKey, setTempApiKey] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Countdown timer for rate limiting
  useEffect(() => {
    if (retryCountdown > 0) {
      const timer = setTimeout(
        () => setRetryCountdown(retryCountdown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [retryCountdown]);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, []);

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading || retryCountdown > 0) return;

    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const apiKey = customApiKey || import.meta.env.VITE_GEMINI_API_KEY;
      const model = import.meta.env.VITE_GEMINI_MODEL || "gemini-1.5-flash";

      if (!apiKey) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env.local file or set your own Gemini key in the API settings to enable the AI assistant.",
            isError: true,
            errorType: "config_error",
          },
        ]);
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
          apiKey,
        )}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: SYSTEM_CONTEXT }],
            },
            contents: [
              ...messages.filter((m) => !m.isError).map((m) => ({
                role: m.role === "assistant" ? "model" : "user",
                parts: [{ text: m.content }],
              })),
              { role: "user", parts: [{ text }] },
            ],
            generationConfig: {
              maxOutputTokens: 500,
              temperature: 0.7,
            },
          }),
        }
      );

      if (response.status === 429) {
        // Rate limited - extract retry time if available
        const retryAfter = response.headers.get("Retry-After");
        const waitTime = retryAfter ? Number.parseInt(retryAfter, 10) : 30;
        setRetryCountdown(waitTime);

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `I'm receiving too many requests right now. Please wait ${waitTime} seconds before trying again. The countdown will show when you can send another message.`,
            isError: true,
            errorType: "rate_limit",
          },
        ]);
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const responseText = getGeminiText(data);
      const assistantMessage: Message = {
        role: "assistant",
        content:
          responseText ||
          "Sorry, I couldn't generate a response.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Something went wrong while processing your request. Please check your internet connection and try again.",
          isError: true,
          errorType: "api_error",
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

  const clearChat = () => {
    setMessages([]);
    setRetryCountdown(0);
  };

  const saveApiKey = () => {
    if (tempApiKey.trim()) {
      setCustomApiKey(tempApiKey.trim());
      localStorage.setItem("gemini_api_key", tempApiKey.trim());
    }
    setTempApiKey("");
    setShowSettings(false);
  };

  const clearApiKey = () => {
    setCustomApiKey("");
    localStorage.removeItem("gemini_api_key");
    setTempApiKey("");
  };

  return (
    <>
    <SEOHead
      title="Ask AI"
      description="Chat with a Gemini-powered AI assistant about Anwar Hossain's professional experience, AI automation focus, skills, and projects."
      keywords="Ask AI, Anwar Hossain AI, Portfolio Assistant, AI Chatbot, Gemini AI, Agentic AI"
      url="https://anwarportfolio.vercel.app/ask-ai"
    />
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 mb-6">
            <div className="relative">
              <Sparkles className="w-4 h-4 text-primary" />
              <div className="absolute inset-0 animate-ping">
                <Sparkles className="w-4 h-4 text-primary opacity-50" />
              </div>
            </div>
            <span className="text-sm font-semibold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Gemini-Powered Assistant
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
            Ask About{" "}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
              Anwar
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto leading-relaxed">
            Curious about my experience, skills, or projects? Chat with my AI
            assistant for instant answers.
          </p>
        </div>

        {/* Chat Container */}
        <Card className="relative overflow-hidden border-0 shadow-2xl shadow-primary/5">
          {/* Gradient border effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 via-purple-500/10 to-pink-500/20 p-[1px]">
            <div className="h-full w-full rounded-xl bg-background" />
          </div>

          <div className="relative">
            {/* Messages Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-lg shadow-primary/25">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Portfolio Assistant</h3>
                  <p className="text-xs text-muted-foreground">
                    {isLoading
                      ? "Thinking..."
                      : retryCountdown > 0
                      ? `Available in ${retryCountdown}s`
                      : "Online"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {messages.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearChat}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setTempApiKey(customApiKey);
                    setShowSettings(true);
                  }}
                  className="text-muted-foreground hover:text-foreground"
                  title="API Settings"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Settings Modal */}
            {showSettings && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-6">
                <div className="w-full max-w-md p-6 bg-card border border-border rounded-xl shadow-2xl animate-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Key className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">API Settings</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowSettings(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Provide your own Gemini API key. If set, it will be used
                    instead of the default configuration.
                  </p>
                  <div className="space-y-3">
                    <Input
                      type="password"
                      placeholder="Gemini API key"
                      value={tempApiKey}
                      onChange={(e) => setTempApiKey(e.target.value)}
                      className="font-mono text-sm"
                    />
                    {customApiKey && (
                      <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        Custom Gemini key is active
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        onClick={saveApiKey}
                        className="flex-1 bg-gradient-to-r from-primary to-purple-500"
                        disabled={!tempApiKey.trim()}
                      >
                        Save Key
                      </Button>
                      {customApiKey && (
                        <Button variant="outline" onClick={clearApiKey}>
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                    Your key is stored locally in your browser and never sent to
                    any server except directly to Google Gemini.
                  </p>
                </div>
              </div>
            )}

            {/* Messages Area */}
            <ScrollArea className="h-[420px]" ref={scrollRef}>
              <div className="p-6">
                {messages.length === 0 ? (
                  <div className="h-[360px] flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center mb-6 shadow-xl">
                      <MessageSquare className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">
                      Start a Conversation
                    </h3>
                    <p className="text-muted-foreground text-sm mb-8 max-w-sm leading-relaxed">
                      Ask me anything about Anwar's professional journey,
                      technical expertise, or projects.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                      {suggestedQuestions.map((q, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          className="group h-auto py-3 px-4 text-left justify-start gap-3 bg-muted/30 border-border/50 hover:bg-primary/5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                          onClick={() => sendMessage(q.text)}
                          disabled={retryCountdown > 0}
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <q.icon className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-xs font-medium leading-tight">
                            {q.text}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {messages.map((message, i) => (
                      <div
                        key={i}
                        className={`flex gap-4 ${
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        } animate-in fade-in slide-in-from-bottom-2 duration-300`}
                      >
                        {message.role === "assistant" && (
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                              message.isError
                                ? "bg-gradient-to-br from-amber-500/20 to-orange-500/20"
                                : "bg-gradient-to-br from-primary/20 to-purple-500/20"
                            }`}
                          >
                            {message.isError ? (
                              message.errorType === "rate_limit" ? (
                                <Clock className="w-4 h-4 text-amber-500" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-amber-500" />
                              )
                            ) : (
                              <Bot className="w-4 h-4 text-primary" />
                            )}
                          </div>
                        )}
                        <div
                          className={`max-w-[75%] rounded-2xl px-5 py-3.5 shadow-sm ${
                            message.role === "user"
                              ? "bg-gradient-to-r from-primary to-purple-500 text-white"
                              : message.isError
                              ? "bg-amber-500/10 border border-amber-500/20"
                              : "bg-muted/50 border border-border/50"
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.content}
                          </p>
                        </div>
                        {message.role === "user" && (
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-4 justify-start animate-in fade-in duration-300">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Bot className="w-4 h-4 text-primary" />
                        </div>
                        <div className="bg-muted/50 border border-border/50 rounded-2xl px-5 py-4">
                          <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.3s]" />
                            <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.15s]" />
                            <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Rate Limit Warning Banner */}
            {retryCountdown > 0 && (
              <div className="mx-6 mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3 animate-in fade-in duration-300">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                    Rate limit reached
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Please wait {retryCountdown} seconds before sending another
                    message
                  </p>
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-6 bg-gradient-to-t from-muted/50 to-transparent">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      retryCountdown > 0
                        ? `Please wait ${retryCountdown}s...`
                        : "Ask something about Anwar..."
                    }
                    className="min-h-[52px] max-h-32 resize-none pr-4 bg-background border-border/50 focus:border-primary/50 rounded-xl shadow-sm"
                    disabled={isLoading || retryCountdown > 0}
                  />
                </div>
                <Button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading || retryCountdown > 0}
                  size="icon"
                  className="h-[52px] w-[52px] rounded-xl bg-gradient-to-r from-primary to-purple-500 hover:opacity-90 shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Powered by{" "}
                <span className="font-medium">Google Gemini</span> -
                Responses are AI-generated
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
    </>
  );
}
