import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetStats,
  useGetAnalytics,
  useGetSavedIdeas,
  getGetStatsQueryKey,
  getGetAnalyticsQueryKey,
  getGetSavedIdeasQueryKey,
} from "@workspace/api-client-react";
import { Link } from "wouter";
import {
  ArrowRight, Lightbulb, Package, Video, Flame, Palette,
  Crown, CheckCircle2, Circle, Zap, Activity, TrendingUp,
  Bookmark, Archive, Hash, BarChart2, Megaphone, Flame as FlameIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";

const engines = [
  { title: "Idea Generator", desc: "Find high-demand niches.", href: "/ideas", icon: Lightbulb, color: "text-yellow-400", bg: "bg-yellow-400/10", border: "hover:border-yellow-400/30" },
  { title: "Bundle Builder", desc: "Craft irresistible offers.", href: "/bundle", icon: Package, color: "text-blue-400", bg: "bg-blue-400/10", border: "hover:border-blue-400/30" },
  { title: "TikTok Scripts", desc: "Viral hooks and scripts.", href: "/scripts", icon: Video, color: "text-pink-400", bg: "bg-pink-400/10", border: "hover:border-pink-400/30" },
  { title: "Viral Hooks", desc: "Scroll-stopping openers.", href: "/viral-hooks", icon: Flame, color: "text-orange-400", bg: "bg-orange-400/10", border: "hover:border-orange-400/30" },
  { title: "Brand Builder", desc: "Full brand from a prompt.", href: "/brand-builder", icon: Palette, color: "text-purple-400", bg: "bg-purple-400/10", border: "hover:border-purple-400/30" },
  { title: "Campaigns", desc: "Plan your distribution.", href: "/campaigns", icon: Megaphone, color: "text-green-400", bg: "bg-green-400/10", border: "hover:border-green-400/30" },
];

const checklist = [
  { label: "Generate your first idea", href: "/ideas", check: (s: any) => (s?.totalIdeas ?? 0) > 0 },
  { label: "Build your first bundle", href: "/bundle", check: (s: any) => (s?.totalBundlesGenerated ?? 0) > 0 },
  { label: "Write your first script", href: "/scripts", check: (s: any) => (s?.totalScriptsGenerated ?? 0) > 0 },
  { label: "Analyze your analytics", href: "/analytics", check: () => false },
];

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetStats({ query: { queryKey: getGetStatsQueryKey() } });
  const { data: analytics } = useGetAnalytics({ query: { queryKey: getGetAnalyticsQueryKey() } });
  const { data: savedIdeas } = useGetSavedIdeas({ query: { queryKey: getGetSavedIdeasQueryKey() } });

  const streak = useMemo(() => {
    if (!analytics?.generationsByDay?.length) return 0;
    const days = analytics.generationsByDay;
    const today = new Date().toISOString().split("T")[0];
    let count = 0;
    const sortedDays = [...days].sort((a, b) => b.date.localeCompare(a.date));
    for (let i = 0; i < sortedDays.length; i++) {
      const expected = new Date();
      expected.setDate(expected.getDate() - i);
      const expectedStr = expected.toISOString().split("T")[0];
      const match = sortedDays.find(d => d.date === expectedStr && d.count > 0);
      if (match) count++;
      else if (i > 0) break;
    }
    return count;
  }, [analytics]);

  const savedAssets = analytics?.savedAssets;
  const totalAssets = savedAssets
    ? (savedAssets.ideas + savedAssets.bundles + savedAssets.scripts + savedAssets.hooks + savedAssets.brands)
    : 0;

  const assetCards = [
    { label: "Ideas", count: savedAssets?.ideas ?? 0, icon: Lightbulb, color: "text-yellow-400", href: "/assets" },
    { label: "Bundles", count: savedAssets?.bundles ?? 0, icon: Archive, color: "text-blue-400", href: "/assets?tab=bundles" },
    { label: "Scripts", count: savedAssets?.scripts ?? 0, icon: Video, color: "text-pink-400", href: "/assets?tab=scripts" },
    { label: "Hooks", count: savedAssets?.hooks ?? 0, icon: Flame, color: "text-orange-400", href: "/assets?tab=hooks" },
    { label: "Brands", count: savedAssets?.brands ?? 0, icon: Palette, color: "text-purple-400", href: "/assets?tab=brands" },
  ];

  const totalCompleted = checklist.filter(item => item.check(stats)).length;

  return (
    <Layout>
      <div className="w-full max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

        <section className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Build momentum. <span className="text-primary">Launch fast.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Your AI commerce engine — from idea to revenue.
            </p>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-orange-400/30 bg-orange-400/10 shrink-0">
              <FlameIcon className="h-4 w-4 text-orange-400" />
              <span className="text-sm font-bold text-orange-400">{streak} day streak</span>
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">Your Assets</h2>
            <Link href="/assets">
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground -mr-2">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {assetCards.map((a) => (
              <Link key={a.label} href={a.href}>
                <Card className="cursor-pointer border-border/50 bg-card/50 hover:border-primary/30 transition-colors text-center py-4 px-2">
                  <a.icon className={`h-5 w-5 mx-auto mb-2 ${a.color}`} />
                  <div className="text-2xl font-bold">{statsLoading ? "–" : a.count}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{a.label}</div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <section>
              <h2 className="text-xl font-semibold tracking-tight mb-4">Quick Actions</h2>
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
                {engines.map((engine) => (
                  <Link key={engine.href} href={engine.href}>
                    <Card className={`group cursor-pointer h-full bg-card border-border ${engine.border} transition-all duration-300 hover:shadow-md`}>
                      <CardContent className="p-4">
                        <div className={`h-9 w-9 rounded-lg flex items-center justify-center mb-2.5 ${engine.bg} ${engine.color}`}>
                          <engine.icon className="h-4.5 w-4.5" />
                        </div>
                        <h3 className="font-semibold text-sm mb-0.5 group-hover:text-primary transition-colors">{engine.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{engine.desc}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>

            {savedIdeas && savedIdeas.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold tracking-tight">Recent Ideas</h2>
                  <Link href="/assets">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground -mr-2">
                      View all <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
                <div className="space-y-2.5">
                  {savedIdeas.slice(0, 3).map((idea) => (
                    <Card key={idea.id} className="border-border/50 bg-card/50">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-8 w-8 rounded-lg bg-yellow-400/10 flex items-center justify-center shrink-0">
                          <Lightbulb className="h-4 w-4 text-yellow-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{idea.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="outline" className="text-[10px] py-0 h-4 border-border/50 text-muted-foreground">{idea.niche}</Badge>
                            {idea.demandScore && <span className="text-[10px] text-green-500">{idea.demandScore}/100 demand</span>}
                          </div>
                        </div>
                        <Link href={`/bundle?title=${encodeURIComponent(idea.title)}&desc=${encodeURIComponent(idea.description)}&aud=${encodeURIComponent(idea.targetAudience || "")}`}>
                          <Button variant="ghost" size="sm" className="h-8 shrink-0 text-muted-foreground hover:text-primary">
                            Build <ArrowRight className="ml-1 h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {analytics && analytics.generationsByType.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-semibold tracking-tight">Activity</h2>
                  <Link href="/analytics">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground -mr-2">
                      Full report <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
                <Card className="border-border/50 bg-card/50">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last 30 days</span>
                      <span className="font-bold text-primary">{analytics.totalGenerations} generations</span>
                    </div>
                    {analytics.generationsByType.map((t) => (
                      <div key={t.type} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="capitalize text-muted-foreground">{t.type}</span>
                          <span className="font-medium">{t.count}</span>
                        </div>
                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${t.percentage}%` }} />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </section>
            )}
          </div>

          <div className="space-y-4">
            <section>
              <h2 className="text-xl font-semibold tracking-tight mb-4">Getting Started</h2>
              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">{totalCompleted}/{checklist.length} complete</span>
                    <div className="h-1.5 flex-1 mx-3 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${(totalCompleted / checklist.length) * 100}%` }} />
                    </div>
                  </div>
                  {checklist.map((item) => {
                    const done = item.check(stats);
                    return (
                      <Link key={item.href} href={item.href}>
                        <div className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors cursor-pointer ${done ? "opacity-60" : "hover:bg-white/5"}`}>
                          {done ? <CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> : <Circle className="h-4 w-4 text-muted-foreground shrink-0" />}
                          <span className={`text-sm ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>{item.label}</span>
                        </div>
                      </Link>
                    );
                  })}
                </CardContent>
              </Card>
            </section>

            <Card className="border-primary/30 bg-gradient-to-b from-primary/10 to-primary/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-400" />
                  <span className="font-bold">Upgrade to Pro</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Unlock unlimited generations, advanced analytics, and the full campaign manager.
                </p>
                <Link href="/pricing">
                  <Button className="w-full h-9 text-sm font-semibold">
                    <Zap className="h-3.5 w-3.5 mr-2" />
                    See Plans
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {analytics?.topNiches && analytics.topNiches.length > 0 && (
              <section className="rounded-xl border border-border bg-card/30 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-medium">Top Niches</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analytics.topNiches.slice(0, 5).map((item) => (
                    <div key={item.niche} className="px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium border border-border/50">
                      {item.niche.length > 20 ? item.niche.slice(0, 20) + "…" : item.niche}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

      </div>
    </Layout>
  );
}
