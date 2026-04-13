import { Layout } from "@/components/layout";
import { useGetAnalytics, getGetAnalyticsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { BarChart2, TrendingUp, Activity, Zap, Lightbulb, Package, Video, Flame, Palette } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const PERIOD_OPTIONS = [
  { label: "7 days", value: 7 },
  { label: "30 days", value: 30 },
  { label: "90 days", value: 90 },
];

const TYPE_COLORS: Record<string, string> = {
  idea: "#facc15",
  bundle: "#60a5fa",
  script: "#f472b6",
  hook: "#fb923c",
  brand: "#c084fc",
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  idea: <Lightbulb className="h-4 w-4 text-yellow-400" />,
  bundle: <Package className="h-4 w-4 text-blue-400" />,
  script: <Video className="h-4 w-4 text-pink-400" />,
  hook: <Flame className="h-4 w-4 text-orange-400" />,
  brand: <Palette className="h-4 w-4 text-purple-400" />,
};

function SkeletonBar() {
  return <div className="h-[220px] bg-muted/30 rounded-xl animate-pulse" />;
}

export default function Analytics() {
  const [days, setDays] = useState(30);
  const { data, isLoading } = useGetAnalytics(
    { days },
    { query: { queryKey: getGetAnalyticsQueryKey({ days }) } }
  );

  const chartData = data?.generationsByDay.map(d => ({
    date: d.date.slice(5),
    count: d.count,
  })) ?? [];

  const savedAssets = data?.savedAssets;
  const totalSaved = savedAssets
    ? savedAssets.ideas + savedAssets.bundles + savedAssets.scripts + savedAssets.hooks + savedAssets.brands
    : 0;

  return (
    <Layout>
      <div className="w-full max-w-5xl space-y-8 animate-in fade-in duration-500">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground mt-1.5">Track your generation activity and asset growth.</p>
          </div>
          <div className="flex gap-1 border border-border/50 rounded-lg p-1 bg-card/50">
            {PERIOD_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setDays(opt.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  days === opt.value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Generations</span>
              </div>
              <div className="text-3xl font-bold">{isLoading ? "–" : (data?.totalGenerations ?? 0)}</div>
              <p className="text-xs text-muted-foreground mt-1">in last {days} days</p>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-muted-foreground">Total Saved</span>
              </div>
              <div className="text-3xl font-bold">{isLoading ? "–" : totalSaved}</div>
              <p className="text-xs text-muted-foreground mt-1">across all types</p>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-sm text-muted-foreground">Top Type</span>
              </div>
              <div className="text-3xl font-bold capitalize">
                {isLoading ? "–" : (data?.generationsByType[0]?.type ?? "—")}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {data?.generationsByType[0] ? `${data.generationsByType[0].percentage}% of activity` : "no data yet"}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <BarChart2 className="h-4 w-4 text-orange-400" />
                <span className="text-sm text-muted-foreground">Active Days</span>
              </div>
              <div className="text-3xl font-bold">
                {isLoading ? "–" : (data?.generationsByDay.filter(d => d.count > 0).length ?? 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">days with activity</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Generations Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <SkeletonBar /> : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={false}
                    interval={Math.floor(chartData.length / 7)}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                    itemStyle={{ color: "hsl(var(--primary))" }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Generations" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
                No generation activity in this period yet.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">By Generation Type</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                Array(4).fill(0).map((_, i) => <div key={i} className="h-8 bg-muted/30 rounded animate-pulse" />)
              ) : data?.generationsByType.length ? (
                data.generationsByType.map((t) => (
                  <div key={t.type} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        {TYPE_ICONS[t.type] ?? <Activity className="h-4 w-4 text-muted-foreground" />}
                        <span className="capitalize">{t.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-xs">{t.count}</span>
                        <Badge variant="outline" className="text-[10px] py-0 h-4 border-border/50">{t.percentage}%</Badge>
                      </div>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${t.percentage}%`, backgroundColor: TYPE_COLORS[t.type] ?? "hsl(var(--primary))" }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">No data yet. Start generating content.</p>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="border-border/50 bg-card/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Saved Assets</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-3">
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => <div key={i} className="h-16 bg-muted/30 rounded-lg animate-pulse" />)
                ) : [
                  { label: "Ideas", count: savedAssets?.ideas ?? 0, color: "text-yellow-400", icon: Lightbulb },
                  { label: "Bundles", count: savedAssets?.bundles ?? 0, color: "text-blue-400", icon: Package },
                  { label: "Scripts", count: savedAssets?.scripts ?? 0, color: "text-pink-400", icon: Video },
                  { label: "Hooks", count: savedAssets?.hooks ?? 0, color: "text-orange-400", icon: Flame },
                  { label: "Brands", count: savedAssets?.brands ?? 0, color: "text-purple-400", icon: Palette },
                ].map((a) => (
                  <div key={a.label} className="flex flex-col items-center justify-center p-3 rounded-xl bg-secondary/20 border border-border/30">
                    <a.icon className={`h-4 w-4 mb-1.5 ${a.color}`} />
                    <div className="text-xl font-bold">{a.count}</div>
                    <div className="text-[10px] text-muted-foreground">{a.label}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Top Niches</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {isLoading ? (
                  Array(4).fill(0).map((_, i) => <div key={i} className="h-7 bg-muted/30 rounded animate-pulse" />)
                ) : data?.topNiches.length ? (
                  data.topNiches.slice(0, 6).map((n, i) => (
                    <div key={n.niche} className="flex items-center gap-2 text-sm">
                      <span className="text-xs text-muted-foreground w-4 shrink-0">#{i + 1}</span>
                      <span className="flex-1 truncate">{n.niche}</span>
                      <Badge variant="outline" className="text-[10px] py-0 h-4 border-border/50 shrink-0">{n.count}</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-2">No niches tracked yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </Layout>
  );
}
