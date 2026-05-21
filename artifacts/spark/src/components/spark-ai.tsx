import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";

import {
  Zap,
  X,
  Send,
  Sparkles,
  ArrowRight,
  Brain,
  Flame,
  TrendingUp,
  Compass,
  Target,
  Wand2,
  Rocket,
} from "lucide-react";

import { Link } from "wouter";

const PAGE_CONTEXT: Record<
  string,
  {
    title: string;
    insight: string;
    suggestions: string[];
  }
> = {
  "/": {
    title: "Business Direction",
    insight:
      "Your strongest opportunities come from combining personality + trends + monetization.",
    suggestions: [
      "Build me a creator business",
      "Find me a profitable niche",
      "Generate a viral business idea",
    ],
  },

  "/trending": {
    title: "Trend Intelligence",
    insight:
      "Fast-growing niches with low saturation are your best leverage opportunities.",
    suggestions: [
      "Show me a low competition niche",
      "Find me a viral trend",
      "Analyze this trend for me",
    ],
  },

  "/viral-hooks": {
    title: "Attention Engineering",
    insight:
      "Curiosity + specificity + emotion creates the highest-performing hooks.",
    suggestions: [
      "Write emotional hooks",
      "Generate controversy hooks",
      "Hooks for my niche",
    ],
  },

  "/scripts": {
    title: "Storytelling Engine",
    insight:
      "Your first 2 seconds determine whether viewers stay or scroll away.",
    suggestions: [
      "Write a TikTok script",
      "Improve my CTA",
      "Turn this idea into content",
    ],
  },

  "/brand-builder": {
    title: "Identity Builder",
    insight:
      "The strongest brands feel emotional, memorable, and instantly recognizable.",
    suggestions: [
      "Create my brand identity",
      "Generate a premium brand",
      "Build a luxury brand direction",
    ],
  },

  "/campaigns": {
    title: "Campaign Intelligence",
    insight:
      "The best campaigns educate, build trust, then transition into conversion.",
    suggestions: [
      "Plan my launch campaign",
      "Generate a content funnel",
      "Build a sales campaign",
    ],
  },
};

const DEFAULT_CONTEXT = {
  title: "SPARK Intelligence",
  insight:
    "SPARK evolves your raw ideas into scalable creator businesses and internet brands.",
  suggestions: [
    "Help me build a business",
    "Find my creator niche",
    "What should I create?",
  ],
};

export function SparkAI() {
  const [location] = useLocation();

  const [open, setOpen] = useState(false);

  const [input, setInput] = useState("");

  const [pulse, setPulse] = useState(false);

  const [typing, setTyping] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const context = PAGE_CONTEXT[location] ?? DEFAULT_CONTEXT;

  useEffect(() => {
    const t1 = setTimeout(() => setPulse(true), 2500);

    const t2 = setTimeout(() => setPulse(false), 5500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [location]);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [open]);

  const handleSuggestion = (text: string) => {
    setInput(text);
  };

  const handleSubmit = () => {
    if (!input.trim()) return;

    setTyping(true);

    setTimeout(() => {
      const encoded = encodeURIComponent(input.trim());

      window.location.href = `/command?prompt=${encoded}`;
    }, 500);
  };

  return (
    <>
      {/* OVERLAY */}

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
        />
      )}

      {/* AI PANEL */}

      {open && (
        <div className="fixed bottom-20 right-4 z-50 w-[370px] max-w-[calc(100vw-2rem)] rounded-3xl border border-primary/20 bg-[hsl(0_0%_7%)] shadow-2xl shadow-black/70 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">

          {/* TOP HEADER */}

          <div className="relative overflow-hidden border-b border-border/40">

            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />

            <div className="relative flex items-center justify-between p-5">

              <div className="flex items-center gap-3">

                <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                  <Zap
                    className="h-5 w-5 text-primary-foreground"
                    strokeWidth={2.5}
                  />
                </div>

                <div>

                  <div className="flex items-center gap-2">

                    <h2 className="text-sm font-black tracking-tight">
                      SPARK AI
                    </h2>

                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-primary/15 text-primary border border-primary/20">
                      LIVE
                    </span>

                  </div>

                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Your AI business cofounder
                  </p>

                </div>

              </div>

              <button
                onClick={() => setOpen(false)}
                className="h-8 w-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

            </div>

          </div>

          {/* CONTENT */}

          <div className="p-5 space-y-5">

            {/* CONTEXT CARD */}

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">

              <div className="flex items-center gap-2 mb-3">

                <Brain className="h-4 w-4 text-primary" />

                <span className="text-xs font-semibold tracking-wide">
                  {context.title}
                </span>

              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {context.insight}
              </p>

            </div>

            {/* AI INSIGHTS */}

            <div className="grid grid-cols-3 gap-2">

              <div className="rounded-xl border border-orange-400/20 bg-orange-400/5 p-3">

                <div className="flex items-center gap-1.5 mb-1">
                  <Flame className="h-3.5 w-3.5 text-orange-400" />

                  <span className="text-[10px] font-medium">
                    Viral
                  </span>
                </div>

                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Storytelling hooks are trending.
                </p>

              </div>

              <div className="rounded-xl border border-green-400/20 bg-green-400/5 p-3">

                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingUp className="h-3.5 w-3.5 text-green-400" />

                  <span className="text-[10px] font-medium">
                    Growth
                  </span>
                </div>

                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Educational creators growing fastest.
                </p>

              </div>

              <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-3">

                <div className="flex items-center gap-1.5 mb-1">
                  <Target className="h-3.5 w-3.5 text-cyan-400" />

                  <span className="text-[10px] font-medium">
                    Strategy
                  </span>
                </div>

                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Build audience before monetization.
                </p>

              </div>

            </div>

            {/* QUICK SUGGESTIONS */}

            <div className="space-y-2">

              <div className="flex items-center gap-2">

                <Compass className="h-4 w-4 text-primary" />

                <span className="text-xs font-semibold">
                  Suggested Actions
                </span>

              </div>

              <div className="flex flex-col gap-2">

                {context.suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestion(suggestion)}
                    className="group text-left rounded-xl border border-border/40 bg-background/30 px-3 py-3 hover:border-primary/30 hover:bg-primary/5 transition-all"
                  >

                    <div className="flex items-center gap-2">

                      <Wand2 className="h-3.5 w-3.5 text-primary shrink-0" />

                      <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                        {suggestion}
                      </span>

                    </div>

                  </button>
                ))}

              </div>

            </div>

            {/* INPUT */}

            <div className="space-y-3">

              <div className="relative">

                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSubmit()
                  }
                  placeholder="Tell SPARK what you want to build..."
                  className="w-full h-12 rounded-2xl border border-border/40 bg-background/40 px-4 pr-14 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors"
                />

                <button
                  onClick={handleSubmit}
                  disabled={!input.trim() || typing}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 transition-all"
                >

                  {typing ? (
                    <Rocket className="h-4 w-4 animate-pulse" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}

                </button>

              </div>

              <div className="flex items-center justify-between">

                <p className="text-[10px] text-muted-foreground">
                  SPARK evolves your ideas into businesses, brands, and
                  social growth systems.
                </p>

                <Link href="/command">

                  <button
                    onClick={() => setOpen(false)}
                    className="text-[11px] text-primary hover:opacity-80 transition-opacity flex items-center gap-1"
                  >
                    Full AI
                    <ArrowRight className="h-3 w-3" />
                  </button>

                </Link>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* FLOATING BUTTON */}

      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-4 right-4 z-50 h-12 px-5 rounded-full flex items-center gap-2 font-semibold text-sm shadow-2xl transition-all duration-300 ${
          open
            ? "bg-secondary text-foreground"
            : `bg-primary text-primary-foreground hover:scale-[1.03] ${
                pulse
                  ? "ring-4 ring-primary/30 ring-offset-4 ring-offset-background"
                  : ""
              }`
        }`}
      >

        {open ? (
          <>
            <X className="h-4 w-4" />
            Close
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Ask SPARK
          </>
        )}

      </button>
    </>
  );
}