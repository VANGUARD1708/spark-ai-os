import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useRunCommand } from "@workspace/api-client-react";
import { Link } from "wouter";
import {
  Zap, Send, ArrowRight, Search, Palette, FileText, Rocket,
  TrendingUp, Bot, Sparkles, RotateCcw, Copy, ChevronRight,
  Lightbulb, Package, Video, Megaphone, BarChart2
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const SECTION_CONFIG: Record<string, { color: string; bg: string; border: string; icon: React.ElementType }> = {
  research: { color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", icon: Search },
  brand: { color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20", icon: Palette },
  content: { color: "text-pink-400", bg: "bg-pink-400/10", border: "border-pink-400/20", icon: FileText },
  launch: { color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20", icon: Rocket },
  insight: { color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20", icon: TrendingUp },
  action: { color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", icon: Zap },
};

const ACTION_ICONS: Record<string, React.ElementType> = {
  "/ideas": Lightbulb,
  "/bundle": Package,
  "/brand-builder": Palette,
  "/scripts": Video,
  "/viral-hooks": Zap,
  "/campaigns": Megaphone,
  "/analytics": BarChart2,
};

const EXAMPLE_PROMPTS = [
  "Build me a premium wellness brand for stressed entrepreneurs.",
  "I want to sell a fitness program for busy moms — where do I start?",
  "Create a digital product business in the personal finance space.",
  "Launch a TikTok content brand around dog training.",
  "Build a $10k/month creator business teaching productivity.",
];

interface Section {
  type: string;
  title: string;
  content: string;
  items?: string[];
}

interface Action {
  label: string;
  href: string;
  description?: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  sections?: Section[];
  actions?: Action[];
}

function UserMessage({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-tr-sm bg-primary text-primary-foreground text-sm leading-relaxed">
        {content}
      </div>
    </div>
  );
}

function SectionCard({ section }: { section: Section }) {
  const config = SECTION_CONFIG[section.type] ?? SECTION_CONFIG.insight;
  const Icon = config.icon;
  const [expanded, setExpanded] = useState(true);

  return (
    <div className={`rounded-xl border ${config.border} ${config.bg} overflow-hidden`}>
      <button
        className="w-full flex items-center gap-2.5 p-3 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <Icon className={`h-4 w-4 shrink-0 ${config.color}`} />
        <span className={`text-sm font-semibold ${config.color}`}>{section.title}</span>
        <ChevronRight className={`h-3.5 w-3.5 ml-auto ${config.color} opacity-60 transition-transform ${expanded ? "rotate-90" : ""}`} />
      </button>
      {expanded && (
        <div className="px-3 pb-3 space-y-2">
          <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
          {section.items && section.items.length > 0 && (
            <ul className="space-y-1.5">
              {section.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className={`mt-1 h-1.5 w-1.5 rounded-full shrink-0 ${config.color.replace("text-", "bg-")}`} />
                  <span className="text-foreground/80">{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function AssistantMessage({ message }: { message: Message }) {
  return (
    <div className="flex gap-3 max-w-full">
      <div className="h-8 w-8 rounded-xl bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
        <Zap className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0 space-y-3">
        {message.content && (
          <p className="text-sm leading-relaxed text-foreground/90">{message.content}</p>
        )}
        {message.sections && message.sections.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {message.sections.map((section, i) => (
              <SectionCard key={i} section={section} />
            ))}
          </div>
        )}
        {message.actions && message.actions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {message.actions.map((action, i) => {
              const Icon = ACTION_ICONS[action.href] ?? ArrowRight;
              return (
                <Link key={i} href={action.href}>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors">
                    <Icon className="h-3 w-3" />
                    {action.label}
                    <ArrowRight className="h-2.5 w-2.5 opacity-60" />
                  </button>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Command() {
  const { toast } = useToast();
  const runCommand = useRunCommand();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = () => {
    const goal = input.trim();
    if (!goal || runCommand.isPending) return;

    const userMsg: Message = { role: "user", content: goal };
    const history = messages.map(m => ({ role: m.role, content: m.content }));

    setMessages(prev => [...prev, userMsg]);
    setInput("");

    runCommand.mutate(
      { data: { goal, history } },
      {
        onSuccess: (data) => {
          const assistantMsg: Message = {
            role: "assistant",
            content: data.message,
            sections: data.sections as Section[],
            actions: data.actions as Action[],
          };
          setMessages(prev => [...prev, assistantMsg]);
        },
        onError: () => {
          toast({ title: "SPARK encountered an issue. Please try again.", variant: "destructive" });
          setMessages(prev => prev.slice(0, -1));
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleExampleClick = (prompt: string) => {
    setInput(prompt);
    textareaRef.current?.focus();
  };

  const handleReset = () => {
    setMessages([]);
    setInput("");
  };

  return (
    <Layout>
      <div className="w-full max-w-4xl flex flex-col" style={{ height: "calc(100dvh - 64px - 2rem)" }}>

        <div className="flex items-center justify-between mb-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">SPARK Command Center</h1>
              <p className="text-xs text-muted-foreground">Tell me what business you want to build.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">AI OS</Badge>
            {messages.length > 0 && (
              <Button variant="ghost" size="sm" className="text-muted-foreground h-8" onClick={handleReset}>
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> New
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 space-y-6 pb-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-8 py-8">
              <div>
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">What are you building?</h2>
                <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
                  Describe your business goal and SPARK will research the market, design your brand,
                  create your content strategy, and map your launch plan — instantly.
                </p>
              </div>

              <div className="w-full max-w-xl space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-3">Try one of these</p>
                {EXAMPLE_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleExampleClick(prompt)}
                    className="w-full text-left px-4 py-3 rounded-xl border border-border/50 bg-card/30 hover:border-primary/30 hover:bg-primary/5 transition-all text-sm text-muted-foreground hover:text-foreground group"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {prompt}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {messages.map((msg, i) =>
                msg.role === "user" ? (
                  <UserMessage key={i} content={msg.content} />
                ) : (
                  <AssistantMessage key={i} message={msg} />
                )
              )}
              {runCommand.isPending && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                    <Zap className="h-4 w-4 text-primary animate-pulse" />
                  </div>
                  <div className="flex items-center gap-1.5 py-2">
                    <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="shrink-0 pt-4 border-t border-border/40">
          <div className="relative flex gap-3 items-end">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Build me a premium wellness brand for stressed entrepreneurs…"
              className="resize-none bg-card border-border/50 focus-visible:border-primary/50 text-sm leading-relaxed min-h-[52px] max-h-[160px] pr-14"
              rows={1}
              style={{ fieldSizing: "content" } as any}
              disabled={runCommand.isPending}
            />
            <Button
              size="icon"
              className="h-10 w-10 shrink-0 mb-[1px]"
              onClick={handleSubmit}
              disabled={!input.trim() || runCommand.isPending}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground/40 mt-2 text-center">
            SPARK uses AI to generate business strategies. Always validate with real market research.
          </p>
        </div>

      </div>
    </Layout>
  );
}
