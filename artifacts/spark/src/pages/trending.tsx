import { Layout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  TrendingUp, Flame, Zap, Palette, Package, Video,
  ArrowRight, Bookmark, BarChart2, Users, RefreshCw
} from "lucide-react";
import { useState } from "react";

const CATEGORIES = ["All", "Health", "Finance", "Creator Economy", "Fashion", "Tech", "Food", "Mindset"];

const TRENDS = [
  {
    title: "Cortisol-lowering morning routines",
    category: "Health",
    status: "hot" as const,
    growth: "+312%",
    volume: "2.1M searches/mo",
    difficulty: "Low",
    description: "Stress reduction content is dominating wellness. Focus on cold exposure, breathwork, and morning rituals.",
    tags: ["wellness", "routine", "cortisol"],
  },
  {
    title: "Digital product side hustles under $100",
    category: "Finance",
    status: "rising" as const,
    growth: "+187%",
    volume: "890K searches/mo",
    difficulty: "Low",
    description: "Budget-conscious creators are looking for low-investment digital product models. Templates and PLR are hot.",
    tags: ["side-hustle", "digital", "passive-income"],
  },
  {
    title: "AI tools for content creators",
    category: "Creator Economy",
    status: "peak" as const,
    growth: "+540%",
    volume: "4.8M searches/mo",
    difficulty: "Medium",
    description: "Creators want to work faster. Any tool or course that reduces production time is a winning product.",
    tags: ["ai", "tools", "content"],
  },
  {
    title: "Aesthetic minimalist fashion dupes",
    category: "Fashion",
    status: "rising" as const,
    growth: "+223%",
    volume: "1.4M searches/mo",
    difficulty: "Medium",
    description: "Budget fashion with premium aesthetics. TikTok audiences want the look without luxury prices.",
    tags: ["fashion", "aesthetic", "dupes"],
  },
  {
    title: "Solo travel safety for women",
    category: "Mindset",
    status: "hot" as const,
    growth: "+198%",
    volume: "760K searches/mo",
    difficulty: "Low",
    description: "Female solo travel is exploding. Safety guides, packing lists, and destination content perform extremely well.",
    tags: ["travel", "women", "safety"],
  },
  {
    title: "High-protein meal prep for busy people",
    category: "Food",
    status: "hot" as const,
    growth: "+267%",
    volume: "3.2M searches/mo",
    difficulty: "Low",
    description: "Time-poor professionals want high-protein meals in under 30 mins. Recipe bundles and guides sell well.",
    tags: ["meal-prep", "protein", "fitness"],
  },
  {
    title: "No-code business automation tools",
    category: "Tech",
    status: "rising" as const,
    growth: "+411%",
    volume: "1.9M searches/mo",
    difficulty: "Medium",
    description: "Small business owners want to automate without coding. Zapier, Make, and AI workflow tutorials dominate.",
    tags: ["automation", "no-code", "business"],
  },
  {
    title: "Dopamine menu lifestyle design",
    category: "Mindset",
    status: "rising" as const,
    growth: "+156%",
    volume: "430K searches/mo",
    difficulty: "Low",
    description: "The concept of building a personal dopamine menu for mental health and motivation is going viral.",
    tags: ["mindset", "mental-health", "lifestyle"],
  },
  {
    title: "YouTube automation + faceless channels",
    category: "Creator Economy",
    status: "peak" as const,
    growth: "+389%",
    volume: "2.7M searches/mo",
    difficulty: "High",
    description: "Faceless YouTube channels with AI voiceovers are generating passive income. High competition, high reward.",
    tags: ["youtube", "automation", "passive"],
  },
  {
    title: "Gut health and microbiome optimization",
    category: "Health",
    status: "hot" as const,
    growth: "+291%",
    volume: "1.8M searches/mo",
    difficulty: "Medium",
    description: "Gut health is the new mental health. Probiotic guides, elimination diets, and gut reset programs are trending.",
    tags: ["gut-health", "wellness", "nutrition"],
  },
];

const STATUS_CONFIG = {
  hot: { label: "Hot", badge: "bg-red-400/15 text-red-400 border-0", icon: Flame },
  rising: { label: "Rising", badge: "bg-green-400/15 text-green-400 border-0", icon: TrendingUp },
  peak: { label: "Peak", badge: "bg-yellow-400/15 text-yellow-400 border-0", icon: Zap },
};

const DIFFICULTY_COLORS = {
  Low: "text-green-400",
  Medium: "text-yellow-400",
  High: "text-red-400",
};

export default function Trending() {
  const [selected, setSelected] = useState("All");
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());

  const filtered = selected === "All" ? TRENDS : TRENDS.filter(t => t.category === selected);

  const toggleSave = (i: number) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <Layout>
      <div className="w-full max-w-5xl space-y-8 animate-in fade-in duration-500">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-9 w-9 rounded-xl bg-red-400/10 flex items-center justify-center">
                <Flame className="h-5 w-5 text-red-400" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Trend Radar</h1>
            </div>
            <p className="text-muted-foreground text-sm">Real-time niche opportunities. Updated daily.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Updated today</span>
            <Badge variant="outline" className="border-primary/30 text-primary text-[10px]">Beta</Badge>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelected(cat)}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                selected === cat
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((trend, i) => {
            const st = STATUS_CONFIG[trend.status];
            const StatusIcon = st.icon;
            const isSaved = savedIds.has(i);
            return (
              <Card key={i} className="border-border/50 hover:border-primary/20 transition-all duration-200 bg-card/50 group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <Badge className={`text-[10px] h-5 ${st.badge} flex items-center gap-1`}>
                          <StatusIcon className="h-2.5 w-2.5" />
                          {st.label}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] h-5 border-border/50 text-muted-foreground">
                          {trend.category}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-base leading-tight">{trend.title}</h3>
                    </div>
                    <button
                      onClick={() => toggleSave(i)}
                      className={`shrink-0 h-8 w-8 flex items-center justify-center rounded-lg transition-colors ${
                        isSaved ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                      }`}
                    >
                      <Bookmark className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">{trend.description}</p>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 rounded-lg bg-secondary/30">
                      <p className="text-base font-bold text-green-400">{trend.growth}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">30-day</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-secondary/30">
                      <p className="text-base font-bold">{trend.volume.split(" ")[0]}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">searches/mo</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-secondary/30">
                      <p className={`text-base font-bold ${DIFFICULTY_COLORS[trend.difficulty as keyof typeof DIFFICULTY_COLORS]}`}>{trend.difficulty}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">difficulty</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/brand-builder?niche=${encodeURIComponent(trend.title)}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full text-xs h-8">
                        <Palette className="h-3 w-3 mr-1.5" /> Build Brand
                      </Button>
                    </Link>
                    <Link href={`/viral-hooks?productTitle=${encodeURIComponent(trend.title)}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full text-xs h-8">
                        <Flame className="h-3 w-3 mr-1.5" /> Create Hooks
                      </Button>
                    </Link>
                    <Link href={`/bundle?title=${encodeURIComponent(trend.title)}&aud=general+audience`} className="flex-1">
                      <Button size="sm" className="w-full text-xs h-8">
                        <Package className="h-3 w-3 mr-1.5" /> Build Offer
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center text-xs text-muted-foreground py-2">
          Showing {filtered.length} of {TRENDS.length} trends · Data sourced from search, social, and platform signals
        </div>
      </div>
    </Layout>
  );
}
