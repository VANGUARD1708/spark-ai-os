import { Layout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetStats, getGetStatsQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { ArrowRight, Lightbulb, Package, Video, Activity, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { data: stats, isLoading } = useGetStats({
    query: {
      queryKey: getGetStatsQueryKey()
    }
  });

  const engines = [
    {
      title: "Idea Generator",
      description: "Find high-demand, low-competition product concepts.",
      href: "/ideas",
      icon: Lightbulb,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10"
    },
    {
      title: "Bundle Builder",
      description: "Craft irresistible offers from basic products.",
      href: "/bundle",
      icon: Package,
      color: "text-blue-400",
      bg: "bg-blue-400/10"
    },
    {
      title: "TikTok Scripts",
      description: "Generate viral hooks and scripts for your offers.",
      href: "/scripts",
      icon: Video,
      color: "text-pink-400",
      bg: "bg-pink-400/10"
    }
  ];

  return (
    <Layout>
      <div className="w-full max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <section className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Build momentum. <span className="text-primary">Launch fast.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Welcome to your commerce operating system. Turn ideas into highly-converting product bundles and viral content in seconds.
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
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Ideas Saved</CardTitle>
                  <Lightbulb className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.totalIdeas || 0}</div>
                </CardContent>
              </Card>
              <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Bundles Generated</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.totalBundlesGenerated || 0}</div>
                </CardContent>
              </Card>
              <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Scripts Written</CardTitle>
                  <Video className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.totalScriptsGenerated || 0}</div>
                </CardContent>
              </Card>
            </>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold tracking-tight">The Engines</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {engines.map((engine, i) => (
              <Card key={engine.href} className="group relative overflow-hidden bg-card border-border hover:border-primary transition-all duration-300 hover:shadow-md hover:shadow-primary/10">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card/50 pointer-events-none" />
                <CardHeader>
                  <div className={`h-12 w-12 rounded-lg flex items-center justify-center mb-4 ${engine.bg} ${engine.color}`}>
                    <engine.icon className="h-6 w-6" />
                  </div>
                  <CardTitle>{engine.title}</CardTitle>
                  <CardDescription className="text-base">{engine.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={engine.href} className="inline-flex items-center font-medium text-primary hover:text-primary/80 transition-colors">
                    Start <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {!isLoading && stats?.topNiches && stats.topNiches.length > 0 && (
          <section className="rounded-xl border border-border bg-card/30 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Top Niches Explored</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {stats.topNiches.map((item) => (
                <div key={item.niche} className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium border border-border/50">
                  {item.niche} <span className="opacity-50 ml-1">{item.count}</span>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </Layout>
  );
}
