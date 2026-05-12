import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Target, TrendingUp, AlertTriangle, Zap, Brain,
  Flame, Heart, ArrowRight, RefreshCw, Users, Activity, Lightbulb
} from "lucide-react";

const SIGNALS = [
  {
    type: "opportunity",
    icon: TrendingUp,
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20",
    title: "Audience craving simplicity",
    body: "Audiences across health, finance, and productivity are rejecting complexity. Content that promises '1 thing, not 10 things' is outperforming by 3.4×.",
    action: "Create Hooks",
    href: "/viral-hooks?productTitle=simple+solution",
    intensity: 89,
  },
  {
    type: "warning",
    icon: AlertTriangle,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
    title: "Authenticity demand spike",
    body: "Polished, AI-sounding content is dropping in engagement. Audiences want raw, real, and personal. Brands leading with vulnerability are winning.",
    action: "Adjust Brand Voice",
    href: "/brand-builder",
    intensity: 77,
  },
  {
    type: "opportunity",
    icon: Flame,
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
    title: "Pain-point content outperforming desire",
    body: "This quarter, content that opens with a problem (not a dream) is converting at 2.1× higher rates across TikTok and Instagram Reels.",
    action: "Generate Pain Hooks",
    href: "/viral-hooks?hookType=pain",
    intensity: 93,
  },
  {
    type: "trend",
    icon: Brain,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20",
    title: "Micro-transformation offers winning",
    body: "Products promising a 7–14 day result are outselling '90-day' programs. Audiences want wins faster. Reframe your offer timeline to match.",
    action: "Reframe Offer",
    href: "/bundle",
    intensity: 81,
  },
  {
    type: "opportunity",
    icon: Users,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    title: "Community-first positioning rising",
    body: "Brands that lead with community (not product) are building stronger LTV. Discord, Skool, and private groups are becoming the new upsell.",
    action: "Update Brand Strategy",
    href: "/brand-builder",
    intensity: 73,
  },
  {
    type: "warning",
    icon: Activity,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20",
    title: "Ad fatigue increasing in wellness niche",
    body: "Wellness audiences are showing 18% higher skip rates on traditional testimonial ads. Shift to educational content with embedded CTA.",
    action: "Create Educational Content",
    href: "/scripts?style=educational",
    intensity: 68,
  },
];

const EMOTIONS = [
  { label: "Hope / Aspiration", value: 82, color: "bg-green-400" },
  { label: "Anxiety / FOMO", value: 67, color: "bg-yellow-400" },
  { label: "Overwhelm / Burnout", value: 74, color: "bg-red-400" },
  { label: "Curiosity", value: 91, color: "bg-blue-400" },
  { label: "Distrust of institutions", value: 58, color: "bg-purple-400" },
  { label: "Desire for speed", value: 88, color: "bg-primary" },
];

const RECOMMENDATIONS = [
  {
    priority: "High",
    text: "Lead your next 3 pieces of content with a problem statement, not a benefit.",
    href: "/viral-hooks?hookType=pain",
  },
  {
    priority: "High",
    text: "Shorten your offer promise from '90 days' to '14 days' and A/B test conversions.",
    href: "/bundle",
  },
  {
    priority: "Medium",
    text: "Add a community bonus to your next bundle to increase perceived value.",
    href: "/bundle",
  },
  {
    priority: "Medium",
    text: "Create one 'raw and real' behind-the-scenes video this week.",
    href: "/scripts",
  },
];

export default function Insights() {
  return (
    <Layout>
      <div className="w-full max-w-5xl space-y-8 animate-in fade-in duration-500">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Market Signals</h1>
            </div>
            <p className="text-muted-foreground text-sm">Audience behavior patterns and emotional trends — updated daily.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Updated today</span>
            <Badge variant="outline" className="border-primary/30 text-primary text-[10px]">Labs</Badge>
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SIGNALS.map((signal, i) => {
            const Icon = signal.icon;
            return (
              <Card key={i} className={`border ${signal.border} bg-card/50 hover:shadow-md transition-all`}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${signal.bg}`}>
                      <Icon className={`h-5 w-5 ${signal.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-sm">{signal.title}</h3>
                      </div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="flex-1 h-1 bg-secondary/50 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${signal.color.replace("text-", "bg-")}`} style={{ width: `${signal.intensity}%` }} />
                        </div>
                        <span className={`text-[10px] font-bold ${signal.color}`}>{signal.intensity}/100</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">{signal.body}</p>
                  <Link href={signal.href}>
                    <Button variant="outline" size="sm" className="text-xs h-8 w-full">
                      <Zap className="h-3 w-3 mr-1.5" />
                      {signal.action}
                      <ArrowRight className="h-3 w-3 ml-auto" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Heart className="h-4 w-4" /> Audience Emotional Index
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {EMOTIONS.map((e, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{e.label}</span>
                    <span className="font-semibold">{e.value}</span>
                  </div>
                  <div className="h-1.5 bg-secondary/40 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${e.color}`} style={{ width: `${e.value}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Lightbulb className="h-4 w-4" /> AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {RECOMMENDATIONS.map((rec, i) => (
                <Link key={i} href={rec.href}>
                  <div className="flex items-start gap-3 p-3 rounded-lg border border-border/40 hover:border-primary/20 hover:bg-primary/5 transition-all group cursor-pointer">
                    <Badge
                      variant="outline"
                      className={`shrink-0 text-[9px] h-5 mt-0.5 ${rec.priority === "High" ? "border-red-400/30 text-red-400" : "border-yellow-400/30 text-yellow-400"}`}
                    >
                      {rec.priority}
                    </Badge>
                    <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">{rec.text}</p>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </section>

      </div>
    </Layout>
  );
}
