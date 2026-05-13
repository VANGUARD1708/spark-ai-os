import { Layout } from "@/components/layout";
import { useGetWinningProducts, getWinningProductsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Trophy, Package, Megaphone, Bookmark, ArrowRight, RefreshCw, Zap } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const FILTERS = ["All", "Digital", "Physical", "Info Product", "Subscription", "Service"];

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
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("All");
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());

  const { data, isLoading, error } = useGetWinningProducts(
    filter !== "All" ? { category: filter } : undefined
  );

  const products = data?.products ?? [];
  const filtered = filter === "All" ? products : products.filter(p => p.type === filter);

  const toggleSave = (i: number) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: getWinningProductsQueryKey() });
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
            <p className="text-muted-foreground text-sm">AI-analyzed opportunities ranked by demand, margin, and market timing.</p>
          </div>
          <div className="flex items-center gap-2">
            {data && (
              <Badge variant="outline" className="border-border/50 text-muted-foreground text-[10px]">
                {products.length} opportunities
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading} className="gap-2">
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
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

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 w-full bg-muted/30 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="h-40 flex items-center justify-center border border-dashed rounded-xl border-border text-muted-foreground text-sm">
            Couldn't load opportunities.{" "}
            <button onClick={handleRefresh} className="ml-2 underline text-primary">Retry</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="h-40 flex flex-col items-center justify-center border border-dashed rounded-xl border-border text-center">
            <Trophy className="h-8 w-8 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground text-sm">Loading AI-analyzed opportunities…</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((product, i) => {
              const isSaved = savedIds.has(i);
              const satStyle = SATURATION_COLORS[product.saturation as keyof typeof SATURATION_COLORS] ?? SATURATION_COLORS.Medium;
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
                          <div className="text-xs text-muted-foreground mb-0.5">Demand Score</div>
                          <DemandBar score={product.demand} />
                        </div>

                        {product.tags && product.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {product.tags.map(tag => (
                              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/40 text-muted-foreground">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
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
                          <Link href="/campaigns">
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
        )}

        {!isLoading && !error && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <Zap className="h-4 w-4 text-primary" />
            <p className="text-xs text-muted-foreground">
              AI-analyzed from 2025 market signals · Updated on refresh
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
