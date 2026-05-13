import { Layout } from "@/components/layout";
import { useGetRecommendations, getRecommendationsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Activity, Zap, ArrowRight, Lightbulb, RefreshCw,
  AlertTriangle, CheckCircle, Minus
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const PRIORITY_STYLES = {
  High: { badge: "border-red-400/30 text-red-400", dot: "bg-red-400", glow: "hover:border-red-400/20" },
  Medium: { badge: "border-yellow-400/30 text-yellow-400", dot: "bg-yellow-400", glow: "hover:border-yellow-400/20" },
  Low: { badge: "border-green-400/30 text-green-400", dot: "bg-green-400", glow: "hover:border-green-400/20" },
};

const STATUS_ICONS = {
  good: <CheckCircle className="h-4 w-4 text-green-400" />,
  neutral: <Minus className="h-4 w-4 text-muted-foreground" />,
  low: <AlertTriangle className="h-4 w-4 text-red-400" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  Content: "text-orange-400 bg-orange-400/10",
  Offer: "text-primary bg-primary/10",
  Analytics: "text-purple-400 bg-purple-400/10",
  Brand: "text-blue-400 bg-blue-400/10",
  Launch: "text-green-400 bg-green-400/10",
  Growth: "text-pink-400 bg-pink-400/10",
};

export default function Publish() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useGetRecommendations();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: getRecommendationsQueryKey() });
  };

  return (
    <Layout>
      <div className="w-full max-w-4xl space-y-8 animate-in fade-in duration-500">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">AI Recommendations</h1>
            </div>
            <p className="text-muted-foreground text-sm">Your personalized growth playbook — built from your actual activity.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading} className="gap-2">
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Link href="/command">
              <Button size="sm">
                <Zap className="h-4 w-4 mr-2" /> Ask SPARK
              </Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-20 w-full bg-muted/30 rounded-xl animate-pulse" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[1,2,3,4].map(i => <div key={i} className="h-20 bg-muted/30 rounded-xl animate-pulse" />)}
            </div>
            {[1,2,3,4,5].map(i => <div key={i} className="h-24 bg-muted/30 rounded-xl animate-pulse" />)}
          </div>
        ) : error ? (
          <div className="h-40 flex items-center justify-center border border-dashed rounded-xl border-border text-muted-foreground text-sm">
            Couldn't load recommendations. <button onClick={handleRefresh} className="ml-2 underline text-primary">Retry</button>
          </div>
        ) : data ? (
          <>
            {data.insight && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/8 border border-primary/20">
                <Lightbulb className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary mr-2">SPARK's Take</span>
                  <span className="text-sm text-foreground/90">{data.insight}</span>
                </div>
              </div>
            )}

            {data.metrics && data.metrics.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {data.metrics.map((m, i) => (
                  <Card key={i} className="border-border/50 bg-card/50">
                    <CardContent className="p-3 text-center">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{m.label}</p>
                      <div className="flex items-center justify-center gap-1 mb-0.5">
                        {STATUS_ICONS[m.status as keyof typeof STATUS_ICONS] ?? STATUS_ICONS.neutral}
                        <p className={`text-lg font-black ${m.status === "low" ? "text-red-400" : m.status === "good" ? "text-green-400" : ""}`}>
                          {m.current}
                        </p>
                      </div>
                      <p className="text-[10px] text-muted-foreground">Target: {m.target}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {data.recommendations && data.recommendations.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Your Action Plan</h2>
                  <span className="text-xs text-muted-foreground">· {data.recommendations.length} recommendations</span>
                </div>

                {data.recommendations.map((rec, i) => {
                  const pr = PRIORITY_STYLES[rec.priority as keyof typeof PRIORITY_STYLES] ?? PRIORITY_STYLES.Low;
                  const catColor = CATEGORY_COLORS[rec.category] ?? "text-muted-foreground bg-secondary/30";
                  return (
                    <Card key={i} className={`border-border/50 bg-card/50 transition-all group ${pr.glow}`}>
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${catColor.split(" ")[1]}`}>
                            <Zap className={`h-5 w-5 ${catColor.split(" ")[0]}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="font-bold text-sm">{rec.title}</h3>
                              <Badge variant="outline" className={`text-[9px] h-4 ${pr.badge}`}>
                                <span className={`h-1.5 w-1.5 rounded-full inline-block mr-1 ${pr.dot}`} />
                                {rec.priority}
                              </Badge>
                              <Badge variant="outline" className="text-[9px] h-4 border-border/50 text-muted-foreground">
                                {rec.category}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">{rec.body}</p>
                          </div>
                          <Link href={rec.href} className="shrink-0">
                            <Button variant="outline" size="sm" className="h-8 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {rec.action} <ArrowRight className="h-3 w-3 ml-1.5" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 text-center">
              <h3 className="text-lg font-bold mb-2">Want a custom growth plan?</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                Tell SPARK your business goal and it will build a specific, actionable plan across research, content, offer, and launch.
              </p>
              <Link href="/command">
                <Button><Zap className="h-4 w-4 mr-2" /> Open Command Center</Button>
              </Link>
            </Card>
          </>
        ) : null}
      </div>
    </Layout>
  );
}
