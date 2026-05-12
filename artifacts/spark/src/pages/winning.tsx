import { Layout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Trophy, TrendingUp, Zap, Package, Megaphone, Star,
  DollarSign, Target, BarChart2, Filter, ArrowRight, Bookmark
} from "lucide-react";
import { useState } from "react";

const FILTERS = ["All", "Digital", "Physical", "Info Product", "Subscription", "Service"];

const PRODUCTS = [
  {
    name: "90-Day Fitness Transformation Guide",
    type: "Info Product",
    demand: 94,
    saturation: "Low",
    margin: "92%",
    price: "$37–$97",
    platform: "TikTok / Instagram",
    why: "Evergreen demand, high perceived value, easy to bundle with meal plan and mindset bonuses.",
    tags: ["fitness", "health", "transformation"],
  },
  {
    name: "Personal Finance Tracker (Notion Template)",
    type: "Digital",
    demand: 88,
    saturation: "Medium",
    margin: "99%",
    price: "$17–$47",
    platform: "TikTok / Pinterest",
    why: "Viral format on TikTok. Low effort to create, extremely high margin, and evergreen utility.",
    tags: ["finance", "notion", "templates"],
  },
  {
    name: "AI Prompts Mega Bundle for Creators",
    type: "Digital",
    demand: 97,
    saturation: "Medium",
    margin: "99%",
    price: "$27–$67",
    platform: "TikTok / Twitter / Email",
    why: "AI tools are the #1 search category right now. Prompt packs require zero technical skill to create and sell.",
    tags: ["ai", "prompts", "creators"],
  },
  {
    name: "Meal Prep Mastery Course",
    type: "Info Product",
    demand: 86,
    saturation: "Low",
    margin: "88%",
    price: "$47–$127",
    platform: "YouTube / Instagram",
    why: "High-protein meal prep is trending hard. Simple video-based course with strong social proof potential.",
    tags: ["food", "meal-prep", "course"],
  },
  {
    name: "Faceless YouTube Starter Kit",
    type: "Info Product",
    demand: 91,
    saturation: "Medium",
    margin: "94%",
    price: "$67–$197",
    platform: "YouTube / TikTok",
    why: "Passive income content explodes every year. Offer includes niche selection, scripting, and monetization guides.",
    tags: ["youtube", "creator", "passive"],
  },
  {
    name: "Social Media Content Calendar Bundle",
    type: "Digital",
    demand: 82,
    saturation: "Low",
    margin: "99%",
    price: "$19–$37",
    platform: "Instagram / Pinterest",
    why: "Every small business needs this. Fast to create in Canva or Notion, bundles well with script packs.",
    tags: ["social-media", "calendar", "bundle"],
  },
  {
    name: "Dog Training Mini-Course",
    type: "Info Product",
    demand: 79,
    saturation: "Low",
    margin: "90%",
    price: "$27–$77",
    platform: "TikTok / Facebook",
    why: "Pet owners spend more than almost any other niche. Simple video course with fast results builds instant trust.",
    tags: ["pets", "dogs", "training"],
  },
  {
    name: "Productivity OS (Notion Dashboard)",
    type: "Digital",
    demand: 85,
    saturation: "Medium",
    margin: "99%",
    price: "$29–$67",
    platform: "TikTok / Twitter",
    why: "Second brain and productivity content is evergreen. Beautiful dashboards screenshot well and go viral.",
    tags: ["productivity", "notion", "system"],
  },
];

const SATURATION_COLORS = {
  Low: "text-green-400 bg-green-400/10",
  Medium: "text-yellow-400 bg-yellow-400/10",
  High: "text-red-400 bg-red-400/10",
};

function DemandBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-secondary/50 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${score >= 90 ? "bg-red-400" : score >= 80 ? "bg-yellow-400" : "bg-green-400"}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-xs font-bold tabular-nums ${score >= 90 ? "text-red-400" : score >= 80 ? "text-yellow-400" : "text-green-400"}`}>{score}</span>
    </div>
  );
}

export default function Winning() {
  const [filter, setFilter] = useState("All");
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());

  const filtered = filter === "All" ? PRODUCTS : PRODUCTS.filter(p => p.type === filter);

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
              <div className="h-9 w-9 rounded-xl bg-yellow-400/10 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-yellow-400" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Winning Products</h1>
            </div>
            <p className="text-muted-foreground text-sm">Proven products with real demand. Ranked by opportunity score.</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-primary/30 text-primary text-[10px]">Beta</Badge>
            <Badge variant="outline" className="border-border/50 text-muted-foreground text-[10px]">
              {PRODUCTS.length} opportunities
            </Badge>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                filter === f
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.map((product, i) => {
            const isSaved = savedIds.has(i);
            const satStyle = SATURATION_COLORS[product.saturation as keyof typeof SATURATION_COLORS];
            return (
              <Card key={i} className="border-border/50 hover:border-primary/20 transition-all duration-200 bg-card/50">
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            <Badge variant="outline" className="text-[10px] h-5 border-border/50 text-muted-foreground">{product.type}</Badge>
                            <Badge className={`text-[10px] h-5 border-0 ${satStyle}`}>
                              {product.saturation} Saturation
                            </Badge>
                          </div>
                          <h3 className="font-bold text-base leading-tight">{product.name}</h3>
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

                      <p className="text-xs text-muted-foreground leading-relaxed">{product.why}</p>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-0.5">
                          <span>Demand Score</span>
                        </div>
                        <DemandBar score={product.demand} />
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 md:w-[200px] shrink-0">
                      <div className="grid grid-cols-3 md:grid-cols-1 gap-2">
                        <div className="p-2.5 rounded-lg bg-secondary/30 text-center md:text-left">
                          <div className="text-[10px] text-muted-foreground mb-0.5">Profit Margin</div>
                          <div className="text-sm font-bold text-green-400">{product.margin}</div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-secondary/30 text-center md:text-left">
                          <div className="text-[10px] text-muted-foreground mb-0.5">Price Range</div>
                          <div className="text-sm font-bold">{product.price}</div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-secondary/30 text-center md:text-left">
                          <div className="text-[10px] text-muted-foreground mb-0.5">Best Platform</div>
                          <div className="text-[11px] font-semibold leading-tight">{product.platform}</div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Link href={`/bundle?title=${encodeURIComponent(product.name)}&aud=general+audience`}>
                          <Button size="sm" className="w-full text-xs h-8">
                            <Package className="h-3 w-3 mr-1.5" /> Build Offer
                            <ArrowRight className="h-3 w-3 ml-auto" />
                          </Button>
                        </Link>
                        <Link href={`/campaigns`}>
                          <Button variant="outline" size="sm" className="w-full text-xs h-8">
                            <Megaphone className="h-3 w-3 mr-1.5" /> Create Campaign
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
