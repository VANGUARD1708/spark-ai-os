import { Layout } from "@/components/layout";
import { useGetTrending, getTrendingQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { TrendingUp, Flame, Zap, Package, Video, ArrowRight, Bookmark, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const CATEGORIES = ["All", "Health", "Finance", "Creator Economy", "Fashion", "Tech", "Food", "Mindset"];

const STATUS_STYLES = {
  hot: { label: "Hot", color: "text-red-400", bg: "bg-red-400/10 border-red-400/20", dot: "bg-red-400" },
  rising: { label: "Rising", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20", dot: "bg-yellow-400" },
  peak: { label: "Peak", color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/20", dot: "bg-orange-400" },
  emerging: { label: "Emerging", color: "text-green-400", bg: "bg-green-400/10 border-green-400/20", dot: "bg-green-400" },
};

const DIFFICULTY_COLORS = {
  Low: "text-green-400",
  Medium: "text-yellow-400",
  High: "text-red-400",
};

export default function Trending() {
  const queryClient = useQueryClient();
  const [category, setCategory] = useState("All");
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());

  const { data, isLoading, error } = useGetTrending(
    category !== "All" ? { category } : undefined
  );

  const trends = data?.trends ?? [];
  const filtered = category === "All" ? trends : trends.filter(t => t.category === category);

  const toggleSave = (i: number) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: getTrendingQueryKey() });
  };

  return (
    <Layout>
      <div className="w-full max-w-5xl space-y-8 animate-in fade-in duration-500">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Trend Radar</h1>
            </div>
            <p className="text-muted-foreground text-sm">Real-time AI analysis of what's gaining momentum in 2025.</p>
          </div>
          <div className="flex items-center gap-2">
            {data && (
              <Badge variant="outline" className="border-border/50 text-muted-foreground text-[10px]">
                {trends.length} trends
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading} className="gap-2">
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                category === c
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-40 bg-muted/30 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="h-40 flex items-center justify-center border border-dashed rounded-xl border-border text-muted-foreground text-sm">
            Couldn't load trends.{" "}
            <button onClick={handleRefresh} className="ml-2 underline text-primary">Retry</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="h-40 flex flex-col items-center justify-center border border-dashed rounded-xl border-border text-center">
            <TrendingUp className="h-8 w-8 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground text-sm">Loading AI trend analysis…</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((trend, i) => {
              const st = STATUS_STYLES[trend.status as keyof typeof STATUS_STYLES] ?? STATUS_STYLES.rising;
              const diffColor = DIFFICULTY_COLORS[trend.difficulty as keyof typeof DIFFICULTY_COLORS] ?? "text-muted-foreground";
              const isSaved = savedIds.has(i);
              return (
                <Card key={i} className="border-border/50 hover:border-primary/20 transition-all duration-200 bg-card/50 group">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-2">
                          <Badge variant="outline" className={`text-[10px] h-5 border ${st.bg} ${st.color}`}>
                            <span className={`h-1.5 w-1.5 rounded-full mr-1 inline-block ${st.dot}`} />
                            {st.label}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] h-5 border-border/50 text-muted-foreground">
                            {trend.category}
                          </Badge>
                        </div>
                        <h3 className="font-bold text-sm leading-tight">{trend.title}</h3>
                      </div>
                      <button
                        onClick={() => toggleSave(i)}
                        className={`shrink-0 h-7 w-7 flex items-center justify-center rounded-lg transition-colors ${
                          isSaved ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                        }`}
                      >
                        <Bookmark className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">{trend.description}</p>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Flame className="h-3.5 w-3.5 text-orange-400" />
                        <span className="font-bold text-orange-400">{trend.growth}</span>
                      </div>
                      <div className="text-muted-foreground">{trend.volume}</div>
                      <div className="ml-auto">
                        <span className="text-muted-foreground">Difficulty: </span>
                        <span className={`font-semibold ${diffColor}`}>{trend.difficulty}</span>
                      </div>
                    </div>

                    {trend.tags && trend.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {trend.tags.map(tag => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/40 text-muted-foreground">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2 pt-1">
                      <Link href={`/ideas?niche=${encodeURIComponent(trend.title)}`} className="flex-1">
                        <Button size="sm" className="w-full text-xs h-7" variant="outline">
                          <Zap className="h-3 w-3 mr-1" /> Find Ideas
                        </Button>
                      </Link>
                      <Link href={`/bundle?title=${encodeURIComponent(trend.title)}`} className="flex-1">
                        <Button size="sm" className="w-full text-xs h-7">
                          <Package className="h-3 w-3 mr-1" /> Build Offer
                          <ArrowRight className="h-3 w-3 ml-auto" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!isLoading && !error && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <Zap className="h-4 w-4 text-primary" />
            <p className="text-xs text-muted-foreground">
              AI-analyzed from 2025 platform signals · Click Refresh to get new trends
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
