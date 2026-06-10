import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useRunCommand } from "@workspace/api-client-react";
import { Link } from "wouter";

import {
  Zap,
  Send,
  ArrowRight,
  Search,
  Palette,
  FileText,
  Rocket,
  TrendingUp,
  Bot,
  Sparkles,
  RotateCcw,
  ChevronRight,
  Lightbulb,
  Package,
  Video,
  Megaphone,
  BarChart2,
  Flame,
  Brain,
  Target,
  Hash,
  Globe,
  Crown,
  Activity,
  Compass,
} from "lucide-react";

import { useState, useRef, useEffect } from "react";

import { useToast } from "@/hooks/use-toast";

const SECTION_CONFIG: Record<
  string,
  {
    color: string;
    bg: string;
    border: string;
    icon: React.ElementType;
  }
> = {
  research: {
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    icon: Search,
  },

  brand: {
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20",
    icon: Palette,
  },

  content: {
    color: "text-pink-400",
    bg: "bg-pink-400/10",
    border: "border-pink-400/20",
    icon: FileText,
  },

  launch: {
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20",
    icon: Rocket,
  },

  insight: {
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
    icon: TrendingUp,
  },

  action: {
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    icon: Zap,
  },
};

const ACTION_ICONS: Record<string, React.ElementType> = {
  "/ideas": Lightbulb,
  "/bundle": Package,
  "/brand-builder": Palette,
  "/scripts": Video,
  "/viral-hooks": Flame,
  "/campaigns": Megaphone,
  "/analytics": BarChart2,
};

const EXAMPLE_PROMPTS = [
  "Turn my teaching experience into a creator business.",
  "Build me a faceless TikTok business from scratch.",
  "Create a premium fitness brand with viral content strategy.",
  "I want a digital product business around productivity.",
  "Build me a $10k/month creator system.",
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

  /**
   * Main AI response
   */
  content: string;

  /**
   * Structured business sections
   */
  sections?: Section[];

  /**
   * Suggested actions
   */
  actions?: Action[];

  /**
   * Creator identity intelligence
   */
  identity?: {
    creatorType?: string;
    audienceType?: string;
    monetizationStyle?: string;
    contentPersonality?: string;
  };

  /**
   * Trend intelligence
   */
  trendAnalysis?: {
    trendScore?: number;
    viralityScore?: number;
    monetizationScore?: number;
    creatorFit?: string;
    futurePrediction?: string;
  };

  /**
   * Entertainment + culture intelligence
   */
  entertainmentIntel?: {
    trendingTopic?: string;
    whyItsTrending?: string;
    audienceEmotion?: string;
    creatorOpportunity?: string;
  };

  /**
   * Social media intelligence
   */
  socialStrategy?: {
    hashtags?: string[];
    contentAngles?: string[];
    viralHooks?: string[];
    bestPlatforms?: string[];
  };

  /**
   * Audience psychology
   */
  audiencePsychology?: string[];
}

function UserMessage({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-3xl rounded-tr-md bg-primary px-5 py-4 text-sm text-primary-foreground shadow-lg">
        {content}
      </div>
    </div>
  );
}

function SectionCard({ section }: { section: Section }) {
  const config =
    SECTION_CONFIG[section.type] ?? SECTION_CONFIG.insight;

  const Icon = config.icon;

  const [expanded, setExpanded] = useState(true);

  return (
    <div
      className={`rounded-2xl border ${config.border} ${config.bg} overflow-hidden`}
    >

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 text-left"
      >

        <div
          className={`h-8 w-8 rounded-xl flex items-center justify-center ${config.bg}`}
        >
          <Icon className={`h-4 w-4 ${config.color}`} />
        </div>

        <div className="flex-1">

          <h3 className={`text-sm font-bold ${config.color}`}>
            {section.title}
          </h3>

        </div>

        <ChevronRight
          className={`h-4 w-4 transition-transform ${
            expanded ? "rotate-90" : ""
          } ${config.color}`}
        />

      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">

          <p className="text-sm text-muted-foreground leading-relaxed">
            {section.content}
          </p>

          {section.items && section.items.length > 0 && (
            <div className="space-y-2">

              {section.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2"
                >

                  <div
                    className={`mt-2 h-1.5 w-1.5 rounded-full ${config.color.replace(
                      "text-",
                      "bg-"
                    )}`}
                  />

                  <p className="text-sm text-foreground/80">
                    {item}
                  </p>

                </div>
              ))}

            </div>
          )}

        </div>
      )}
    </div>
  );
}

function AssistantMessage({
  message,
}: {
  message: Message;
}) {
  return (
    <div className="flex gap-3">

      <div className="h-10 w-10 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
        <Zap className="h-5 w-5 text-primary" />
      </div>

      <div className="flex-1 space-y-4">

        {/* MAIN MESSAGE */}

        {message.content && (
          <div className="rounded-3xl border border-border/40 bg-card/40 p-5 backdrop-blur-sm">

            <div className="flex items-center gap-2 mb-3">

              <Badge className="bg-primary/10 text-primary border-primary/20">
                SPARK Intelligence
              </Badge>

              {message.trendAnalysis?.trendScore && (
                <Badge variant="outline">
                  Trend {message.trendAnalysis.trendScore}/100
                </Badge>
              )}

            </div>

            <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
              {message.content}
            </p>

          </div>
        )}

        {/* IDENTITY */}

        {message.identity && (
          <div className="grid md:grid-cols-2 gap-3">

            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4">

              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-cyan-400" />
                <h3 className="font-semibold text-cyan-400">
                  Creator Identity
                </h3>
              </div>

              <div className="space-y-2 text-sm">

                {message.identity.creatorType && (
                  <div>
                    <span className="text-muted-foreground">
                      Creator Type:
                    </span>{" "}
                    {message.identity.creatorType}
                  </div>
                )}

                {message.identity.audienceType && (
                  <div>
                    <span className="text-muted-foreground">
                      Audience:
                    </span>{" "}
                    {message.identity.audienceType}
                  </div>
                )}

                {message.identity.monetizationStyle && (
                  <div>
                    <span className="text-muted-foreground">
                      Monetization:
                    </span>{" "}
                    {message.identity.monetizationStyle}
                  </div>
                )}

              </div>

            </div>

            <div className="rounded-2xl border border-purple-400/20 bg-purple-400/5 p-4">

              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <h3 className="font-semibold text-purple-400">
                  Future Prediction
                </h3>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {message.trendAnalysis?.futurePrediction ??
                  "Strong long-term creator opportunity."}
              </p>

            </div>

          </div>
        )}

        {/* TREND SCORES */}

        {message.trendAnalysis && (
          <div className="grid grid-cols-3 gap-3">

            <div className="rounded-2xl border border-orange-400/20 bg-orange-400/5 p-4 text-center">

              <Flame className="h-5 w-5 text-orange-400 mx-auto mb-2" />

              <div className="text-2xl font-black text-orange-400">
                {message.trendAnalysis.viralityScore ?? 0}
              </div>

              <p className="text-xs text-muted-foreground">
                Virality
              </p>

            </div>

            <div className="rounded-2xl border border-green-400/20 bg-green-400/5 p-4 text-center">

              <Target className="h-5 w-5 text-green-400 mx-auto mb-2" />

              <div className="text-2xl font-black text-green-400">
                {message.trendAnalysis.monetizationScore ?? 0}
              </div>

              <p className="text-xs text-muted-foreground">
                Monetization
              </p>

            </div>

            <div className="rounded-2xl border border-blue-400/20 bg-blue-400/5 p-4 text-center">

              <TrendingUp className="h-5 w-5 text-blue-400 mx-auto mb-2" />

              <div className="text-2xl font-black text-blue-400">
                {message.trendAnalysis.trendScore ?? 0}
              </div>

              <p className="text-xs text-muted-foreground">
                Trend Score
              </p>

            </div>

          </div>
        )}

        {/* ENTERTAINMENT INTEL */}

        {message.entertainmentIntel && (
          <div className="rounded-2xl border border-pink-400/20 bg-pink-400/5 p-5">

            <div className="flex items-center gap-2 mb-3">

              <Flame className="h-5 w-5 text-pink-400" />

              <h3 className="font-bold text-pink-400">
                Culture Intelligence
              </h3>

            </div>

            <div className="space-y-3 text-sm">

              {message.entertainmentIntel.trendingTopic && (
                <div>
                  <span className="text-pink-400 font-semibold">
                    Trending:
                  </span>{" "}
                  {message.entertainmentIntel.trendingTopic}
                </div>
              )}

              {message.entertainmentIntel.whyItsTrending && (
                <div>
                  <span className="text-pink-400 font-semibold">
                    Why It Works:
                  </span>{" "}
                  {message.entertainmentIntel.whyItsTrending}
                </div>
              )}

              {message.entertainmentIntel.creatorOpportunity && (
                <div>
                  <span className="text-pink-400 font-semibold">
                    Opportunity:
                  </span>{" "}
                  {message.entertainmentIntel.creatorOpportunity}
                </div>
              )}

            </div>

          </div>
        )}

        {/* SECTIONS */}

        {message.sections && message.sections.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {message.sections.map((section, i) => (
              <SectionCard key={i} section={section} />
            ))}
          </div>
        )}

        {/* SOCIAL STRATEGY */}

        {message.socialStrategy && (
          <div className="grid md:grid-cols-2 gap-3">

            {message.socialStrategy.hashtags &&
              message.socialStrategy.hashtags.length > 0 && (
                <div className="rounded-2xl border border-border/40 bg-card/30 p-4">

                  <div className="flex items-center gap-2 mb-3">

                    <Hash className="h-4 w-4 text-primary" />

                    <h3 className="font-semibold">
                      Viral Hashtags
                    </h3>

                  </div>

                  <div className="flex flex-wrap gap-2">

                    {message.socialStrategy.hashtags.map(
                      (tag, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                        >
                          {tag}
                        </Badge>
                      )
                    )}

                  </div>

                </div>
              )}

            {message.socialStrategy.bestPlatforms &&
              message.socialStrategy.bestPlatforms.length > 0 && (
                <div className="rounded-2xl border border-border/40 bg-card/30 p-4">

                  <div className="flex items-center gap-2 mb-3">

                    <Globe className="h-4 w-4 text-cyan-400" />

                    <h3 className="font-semibold">
                      Best Platforms
                    </h3>

                  </div>

                  <div className="flex flex-wrap gap-2">

                    {message.socialStrategy.bestPlatforms.map(
                      (platform, i) => (
                        <Badge
                          key={i}
                          className="bg-cyan-400/10 text-cyan-400 border-cyan-400/20"
                        >
                          {platform}
                        </Badge>
                      )
                    )}

                  </div>

                </div>
              )}

          </div>
        )}

        {/* AUDIENCE PSYCHOLOGY */}

        {message.audiencePsychology &&
          message.audiencePsychology.length > 0 && (
            <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-5">

              <div className="flex items-center gap-2 mb-4">

                <Brain className="h-5 w-5 text-yellow-400" />

                <h3 className="font-bold text-yellow-400">
                  Audience Psychology
                </h3>

              </div>

              <div className="space-y-2">

                {message.audiencePsychology.map(
                  (item, i) => (
                    <div
                      key={i}
                      className="flex gap-2 text-sm"
                    >

                      <div className="h-2 w-2 rounded-full bg-yellow-400 mt-2" />

                      <p className="text-muted-foreground">
                        {item}
                      </p>

                    </div>
                  )
                )}

              </div>

            </div>
          )}

        {/* ACTIONS */}

        {message.actions && message.actions.length > 0 && (
          <div className="flex flex-wrap gap-2">

            {message.actions.map((action, i) => {
              const Icon =
                ACTION_ICONS[action.href] ?? ArrowRight;

              return (
                <Link key={i} href={action.href}>

                  <button className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition-all">

                    <Icon className="h-3.5 w-3.5" />

                    {action.label}

                    <ArrowRight className="h-3 w-3 opacity-70" />

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
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSubmit = () => {
    const goal = input.trim();

    if (!goal || runCommand.isPending) return;

    const userMsg: Message = {
      role: "user",
      content: goal,
    };

    const history = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    setMessages((prev) => [...prev, userMsg]);

    setInput("");

    runCommand.mutate(
      {
        data: {
          goal,
          history,
        },
      },
      {
        onSuccess: (data) => {
          const assistantMsg: Message = {
            role: "assistant",

            content: data.message,

            sections: data.sections as Section[],

            actions: data.actions as Action[],

            identity: (data as any).identity,

            trendAnalysis: (data as any).trendAnalysis,

            entertainmentIntel: (data as any).entertainmentIntel,

            socialStrategy: (data as any).socialStrategy,

            audiencePsychology: (data as any).audiencePsychology,
          };

          setMessages((prev) => [
            ...prev,
            assistantMsg,
          ]);
        },

        onError: () => {
          toast({
            title:
              "SPARK encountered an issue. Please try again.",
            variant: "destructive",
          });

          setMessages((prev) => prev.slice(0, -1));
        },
      }
    );
  };

  const handleKeyDown = (
    e: React.KeyboardEvent
  ) => {
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

      <div className="w-full max-w-6xl mx-auto flex flex-col">

        {/* HERO */}

        <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background p-8 md:p-10 mb-8">

          <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 blur-3xl rounded-full" />

          <div className="relative z-10 max-w-3xl">

            <div className="flex items-center gap-2 mb-4">

              <Badge className="bg-primary/15 text-primary border border-primary/20 hover:bg-primary/15">
                AI COMMAND
              </Badge>

              <Badge variant="outline">
                2030 Ultra
              </Badge>

            </div>

            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">

              Turn raw ideas into
              <span className="text-primary">
                {" "}
                profitable businesses
              </span>

            </h1>

            <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-2xl">

              SPARK researches your market,
              builds your strategy,
              creates your content,
              plans your monetization,
              and maps your launch system instantly.

            </p>

            <div className="flex flex-wrap gap-3 mt-6">

              <div className="flex items-center gap-2 rounded-full border border-border/40 bg-card/40 px-4 py-2 text-sm">
                <Brain className="h-4 w-4 text-primary" />
                AI Strategy
              </div>

              <div className="flex items-center gap-2 rounded-full border border-border/40 bg-card/40 px-4 py-2 text-sm">
                <Flame className="h-4 w-4 text-orange-400" />
                Viral Content
              </div>

              <div className="flex items-center gap-2 rounded-full border border-border/40 bg-card/40 px-4 py-2 text-sm">
                <Target className="h-4 w-4 text-green-400" />
                Monetization
              </div>

              <div className="flex items-center gap-2 rounded-full border border-border/40 bg-card/40 px-4 py-2 text-sm">
                <Hash className="h-4 w-4 text-pink-400" />
                Social Growth
              </div>

            </div>

          </div>

        </section>

        {/* MAIN */}

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">

          {/* CHAT */}

          <div className="rounded-3xl border border-border/40 bg-card/30 overflow-hidden flex flex-col min-h-[700px]">

            {/* TOP BAR */}

            <div className="flex items-center justify-between border-b border-border/40 px-5 py-4">

              <div className="flex items-center gap-3">

                <div className="h-10 w-10 rounded-2xl bg-primary/15 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-primary" />
                </div>

                <div>

                  <h2 className="font-bold">
                    SPARK Command Center
                  </h2>

                  <p className="text-xs text-muted-foreground">
                    Your AI business operating system
                  </p>

                </div>

              </div>

              {messages.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              )}

            </div>

            {/* CHAT AREA */}

            <div className="flex-1 overflow-y-auto p-5 space-y-6">

              {messages.length === 0 ? (

                <div className="h-full flex flex-col items-center justify-center text-center py-10">

                  <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
                    <Bot className="h-10 w-10 text-primary" />
                  </div>

                  <h2 className="text-3xl font-bold mb-3">
                    What do you want to build?
                  </h2>

                  <p className="text-muted-foreground max-w-xl leading-relaxed mb-8">
                    SPARK transforms your ideas into brands,
                    creator systems,
                    digital products,
                    content funnels,
                    and monetization plans.
                  </p>

                  <div className="w-full max-w-2xl space-y-3">

                    {EXAMPLE_PROMPTS.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() =>
                          handleExampleClick(prompt)
                        }
                        className="group w-full rounded-2xl border border-border/40 bg-background/30 p-4 text-left hover:border-primary/30 hover:bg-primary/5 transition-all"
                      >

                        <div className="flex items-center gap-3">

                          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Sparkles className="h-4 w-4 text-primary" />
                          </div>

                          <div className="flex-1">

                            <p className="text-sm font-medium group-hover:text-primary transition-colors">
                              {prompt}
                            </p>

                          </div>

                          <ArrowRight className="h-4 w-4 opacity-40 group-hover:opacity-100 transition-opacity" />

                        </div>

                      </button>
                    ))}

                  </div>

                </div>

              ) : (

                <div className="space-y-8">

                  {messages.map((msg, i) =>
                    msg.role === "user" ? (
                      <UserMessage
                        key={i}
                        content={msg.content}
                      />
                    ) : (
                      <AssistantMessage
                        key={i}
                        message={msg}
                      />
                    )
                  )}

                  {runCommand.isPending && (

                    <div className="flex gap-3">

                      <div className="h-10 w-10 rounded-2xl bg-primary/15 flex items-center justify-center">
                        <Zap className="h-5 w-5 text-primary animate-pulse" />
                      </div>

                      <div className="rounded-2xl border border-border/40 bg-card/40 px-5 py-4 flex items-center gap-2">

                        <span className="h-2 w-2 rounded-full bg-primary animate-bounce" />

                        <span
                          className="h-2 w-2 rounded-full bg-primary animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />

                        <span
                          className="h-2 w-2 rounded-full bg-primary animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />

                      </div>

                    </div>

                  )}

                  <div ref={messagesEndRef} />

                </div>

              )}

            </div>

            {/* INPUT */}

            <div className="border-t border-border/40 p-5">

              <div className="relative">

                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) =>
                    setInput(e.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="Describe the business, brand, creator system, or product you want to build..."
                  className="min-h-[120px] resize-none rounded-2xl border-border/50 bg-background/40 p-5 pr-20 text-sm leading-relaxed"
                  disabled={runCommand.isPending}
                />

                <Button
                  size="icon"
                  onClick={handleSubmit}
                  disabled={
                    !input.trim() ||
                    runCommand.isPending
                  }
                  className="absolute bottom-4 right-4 h-12 w-12 rounded-2xl"
                >

                  <Send className="h-5 w-5" />

                </Button>

              </div>

              <div className="flex items-center justify-between mt-3">

                <p className="text-[11px] text-muted-foreground">
                  SPARK creates business direction,
                  content strategy,
                  monetization systems,
                  and launch plans.
                </p>

                <div className="flex items-center gap-2 text-[11px] text-primary">

                  <Activity className="h-3.5 w-3.5" />

                  AI Active

                </div>

              </div>

            </div>

          </div>

          {/* SIDEBAR */}

          <div className="space-y-5">

            <div className="rounded-3xl border border-primary/20 bg-primary/5 p-5">

              <div className="flex items-center gap-2 mb-4">

                <Compass className="h-5 w-5 text-primary" />

                <h3 className="font-bold">
                  What SPARK Does
                </h3>

              </div>

              <div className="space-y-3 text-sm text-muted-foreground">

                <div className="flex gap-3">
                  <Search className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                  Finds profitable niches
                </div>

                <div className="flex gap-3">
                  <Palette className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                  Builds your brand identity
                </div>

                <div className="flex gap-3">
                  <Video className="h-4 w-4 text-pink-400 shrink-0 mt-0.5" />
                  Creates viral content ideas
                </div>

                <div className="flex gap-3">
                  <Rocket className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                  Plans your launch strategy
                </div>

                <div className="flex gap-3">
                  <Globe className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                  Helps grow your audience
                </div>

              </div>

            </div>

            <div className="rounded-3xl border border-yellow-400/20 bg-yellow-400/5 p-5">

              <div className="flex items-center gap-2 mb-3">

                <Crown className="h-5 w-5 text-yellow-400" />

                <h3 className="font-bold">
                  Pro Features
                </h3>

              </div>

              <div className="space-y-2 text-sm text-muted-foreground">

                <p>• Unlimited generations</p>

                <p>• AI growth systems</p>

                <p>• Full trend intelligence</p>

                <p>• Social media automation</p>

                <p>• AI business memory</p>

              </div>

              <Link href="/pricing">

                <Button className="w-full mt-5">
                  Upgrade to Pro
                </Button>

              </Link>

            </div>

          </div>

        </div>

      </div>

    </Layout>
  );
}