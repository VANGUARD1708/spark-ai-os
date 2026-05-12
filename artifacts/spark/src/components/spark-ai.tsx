import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Zap, X, Send, Sparkles, ArrowRight, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const PAGE_TIPS: Record<string, { tip: string; suggestions: string[] }> = {
  "/": {
    tip: "Start with a trend to build momentum fastest.",
    suggestions: ["Show me a trending niche", "Build a brand from scratch", "Generate hooks for my product"],
  },
  "/trending": {
    tip: "Niches with Low difficulty + High growth are your best entry points.",
    suggestions: ["Which niche should I pick?", "How do I validate demand?", "Build an offer around this trend"],
  },
  "/winning": {
    tip: "Digital products with 99% margins are always your highest leverage plays.",
    suggestions: ["Help me pick the best product", "How do I price my offer?", "Create a campaign for this product"],
  },
  "/insights": {
    tip: "Pain-first content is outperforming desire-first by 2× right now.",
    suggestions: ["Write me pain-first hooks", "What angle should I use?", "Build content around this signal"],
  },
  "/bundle": {
    tip: "Stacking 2–3 bonuses increases perceived value by 40% without raising your price.",
    suggestions: ["Optimize my bundle", "What bonuses should I add?", "Suggest a price point"],
  },
  "/brand-builder": {
    tip: "Great brand names are 1–2 syllables and evoke emotion, not description.",
    suggestions: ["Generate name ideas", "Write my brand story", "Suggest a color palette"],
  },
  "/digital-product": {
    tip: "A $7 tripwire offer converts 3–5× better than going straight to a high-ticket product.",
    suggestions: ["Build my offer stack", "Suggest bonus ideas", "What should my guarantee be?"],
  },
  "/viral-hooks": {
    tip: "Hooks that open with a specific number ('I made $3,847') outperform vague claims by 4×.",
    suggestions: ["Write pain-first hooks", "Give me controversy hooks", "Hooks for [my niche]"],
  },
  "/scripts": {
    tip: "The first 2 seconds determine everything. Lead with the conflict, not the solution.",
    suggestions: ["Write my hook line", "Make my script shorter", "Add a stronger CTA"],
  },
  "/analytics": {
    tip: "Find your best-performing content type and create 3× more of it this week.",
    suggestions: ["What should I make more of?", "Explain my top metric", "How do I improve CTR?"],
  },
  "/ab-testing": {
    tip: "Never test more than one variable at a time — otherwise you can't know what caused the change.",
    suggestions: ["Set up a hook test", "What should I test first?", "Analyze my test results"],
  },
  "/schedule": {
    tip: "Consistent posting beats perfect posting. 5 days a week > 1 viral post.",
    suggestions: ["Build my content schedule", "Best posting times for TikTok", "Plan my launch week"],
  },
  "/campaigns": {
    tip: "Your campaign should tell a story across 3 acts: attention, education, offer.",
    suggestions: ["Plan my launch campaign", "Write my campaign sequence", "What channels should I use?"],
  },
};

const DEFAULT_TIP = {
  tip: "SPARK works best when you give it context. Describe your niche for personalized guidance.",
  suggestions: ["Help me pick a niche", "What should I build first?", "Review my strategy"],
};

export function SparkAI() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const [input, setInput] = useState("");
  const [pulse, setPulse] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const pageTip = PAGE_TIPS[location] ?? DEFAULT_TIP;

  useEffect(() => {
    const t = setTimeout(() => setPulse(true), 3000);
    const t2 = setTimeout(() => setPulse(false), 6000);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [location]);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleSuggestion = (s: string) => {
    setInput(s);
  };

  const handleSubmit = () => {
    if (!input.trim()) return;
    const encoded = encodeURIComponent(input.trim());
    window.location.href = `/command?prompt=${encoded}`;
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {open && (
        <div className="fixed bottom-20 right-4 z-50 w-80 rounded-2xl border border-primary/30 bg-[hsl(0_0%_7%)] shadow-2xl shadow-black/60 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between p-4 border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-sm font-bold leading-none">SPARK AI</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Always on</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            <div className="flex items-start gap-2.5">
              <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">{pageTip.tip}</p>
            </div>

            <div className="flex flex-col gap-1.5">
              {pageTip.suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestion(s)}
                  className="text-left text-xs px-3 py-2 rounded-lg border border-border/40 text-muted-foreground hover:border-primary/30 hover:text-foreground hover:bg-primary/5 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder="Ask SPARK anything…"
                className="flex-1 text-xs bg-secondary/40 border border-border/40 rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/40 transition-colors"
              />
              <button
                onClick={handleSubmit}
                disabled={!input.trim()}
                className="h-9 w-9 flex items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-40 transition-opacity shrink-0"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>

            <Link href="/command">
              <button
                onClick={() => setOpen(false)}
                className="w-full text-xs text-center text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1"
              >
                Open full Command Center
                <ArrowRight className="h-3 w-3" />
              </button>
            </Link>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 h-10 px-4 rounded-full font-semibold text-xs text-primary-foreground shadow-lg transition-all duration-300 ${
          open
            ? "bg-secondary text-foreground"
            : `bg-primary hover:bg-primary/90 ${pulse ? "ring-2 ring-primary/40 ring-offset-2 ring-offset-background" : ""}`
        }`}
      >
        {open ? (
          <X className="h-4 w-4" />
        ) : (
          <>
            <Sparkles className="h-3.5 w-3.5" />
            Ask SPARK
          </>
        )}
      </button>
    </>
  );
}
