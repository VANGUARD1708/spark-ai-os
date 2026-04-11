import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useGetStats, useGetSavedIdeas, getGetStatsQueryKey, getGetSavedIdeasQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import {
  ArrowRight, Lightbulb, Package, Video, Flame, Palette,
  Crown, CheckCircle2, Circle, Zap, TrendingUp, Users, Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const engines = [
  {
    title: "Idea Generator",
    description: "Find high-demand, low-competition product concepts.",
    href: "/ideas",
    icon: Lightbulb,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "hover:border-yellow-400/30",
  },
  {
    title: "Bundle Builder",
    description: "Craft irresistible offers from basic products.",
    href: "/bundle",
    icon: Package,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "hover:border-blue-400/30",
  },
  {
    title: "TikTok Scripts",
    description: "Generate viral hooks and scripts for your offers.",
    href: "/scripts",
    icon: Video,
    color: "text-pink-400",
    bg: "bg-pink-400/10",
    border: "hover:border-pink-400/30",
  },
  {
    title: "Viral Hooks",
    description: "Scroll-stopping opening lines for any platform.",
    href: "/viral-hooks",
    icon: Flame,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "hover:border-orange-400/30",
  },
  {
    title: "Brand Builder",
    description: "Generate a full brand identity from a single prompt.",
    href: "/brand-builder",
    icon: Palette,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "hover:border-purple-400/30",
  },
];

const checklist = [
  { label: "Generate your first idea", href: "/ideas", key: "totalIdeas" },
  { label: "Build your first bundle", href: "/bundle", key: "totalBundlesGenerated" },
  { label: "Write your first script", href: "/scripts", key: "totalScriptsGenerated" },
];

export default function Dashboard() {
  const { data: stats, isLoading } = useGetStats({ query: { queryKey: getGetStatsQueryKey() } });
  const { data: savedIdeas } = useGetSavedIdeas({ query: { queryKey: getGetSavedIdeasQueryKey() } });

  const totalCompleted = checklist.filter(item => {
    if (item.key === "totalIdeas") return (stats?.totalIdeas ?? 0) > 0;
    if (item.key === "totalBundlesGenerated") return (stats?.totalBundlesGenerated ?? 0) > 0;
    if (item.key === "totalScriptsGenerated") return (stats?.totalScriptsGenerated ?? 0) > 0;
    return false;
  }).length;

  return (
    <Layout>
      <div className="w-full max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

        <section className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Build momentum. <span className="text-primary">Launch fast.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Your AI commerce engine. Turn ideas into products, products into content, and content into revenue.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <Card key={i} className="bg-card/50 border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Ideas Saved</CardTitle>
                  <Lightbulb className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.totalIdeas || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">validated opportunities</p>
                </CardContent>
              </Card>
              <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Bundles Generated</CardTitle>
                  <Package className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.totalBundlesGenerated || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">offer stacks built</p>
                </CardContent>
              </Card>
              <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Scripts Written</CardTitle>
                  <Video className="h-4 w-4 text-pink-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.totalScriptsGenerated || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">pieces of content ready</p>
                </CardContent>
              </Card>
            </>
          )}
        </section>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold tracking-tight">Quick Actions</h2>
              </div>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {engines.map((engine) => (
                  <Link key={engine.href} href={engine.href}>
                    <Card className={`group cursor-pointer h-full bg-card border-border ${engine.border} transition-all duration-300 hover:shadow-md`}>
                      <CardContent className="p-5">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center mb-3 ${engine.bg} ${engine.color}`}>
                          <engine.icon className="h-5 w-5" />
                        </div>
                        <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{engine.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{engine.description}</p>
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
                <div className="space-y-3">
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
                            {idea.demandScore && (
                              <span className="text-[10px] text-green-500">{idea.demandScore}/100 demand</span>
                            )}
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
          </div>

          <div className="space-y-4">
            <section>
              <h2 className="text-xl font-semibold tracking-tight mb-4">Getting Started</h2>
              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">{totalCompleted}/{checklist.length} complete</span>
                    <div className="h-1.5 flex-1 mx-3 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${(totalCompleted / checklist.length) * 100}%` }}
                      />
                    </div>
                  </div>
                  {checklist.map((item) => {
                    const done =
                      item.key === "totalIdeas" ? (stats?.totalIdeas ?? 0) > 0 :
                      item.key === "totalBundlesGenerated" ? (stats?.totalBundlesGenerated ?? 0) > 0 :
                      item.key === "totalScriptsGenerated" ? (stats?.totalScriptsGenerated ?? 0) > 0 :
                      false;
                    return (
                      <Link key={item.href} href={item.href}>
                        <div className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors cursor-pointer ${done ? "opacity-60" : "hover:bg-white/5"}`}>
                          {done ? (
                            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                          )}
                          <span className={`text-sm ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                            {item.label}
                          </span>
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
                  Unlock unlimited generations, brand builder, content planner, and analytics.
                </p>
                <Link href="/pricing">
                  <Button className="w-full h-9 text-sm font-semibold">
                    <Zap className="h-3.5 w-3.5 mr-2" />
                    See Plans
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {!isLoading && stats?.topNiches && stats.topNiches.length > 0 && (
              <section className="rounded-xl border border-border bg-card/30 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-medium">Top Niches Explored</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {stats.topNiches.map((item) => (
                    <div key={item.niche} className="px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium border border-border/50">
                      {item.niche} <span className="opacity-50 ml-1">{item.count}</span>
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
