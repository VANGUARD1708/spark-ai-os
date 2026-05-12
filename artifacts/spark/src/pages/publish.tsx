import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Activity, TrendingUp, Zap, ArrowRight, CheckCircle2, Target,
  AlertTriangle, Lightbulb, Package, Flame, BarChart2, Users, Layers
} from "lucide-react";

const PRIORITY_STYLES = {
  High: { badge: "border-red-400/30 text-red-400", dot: "bg-red-400" },
  Medium: { badge: "border-yellow-400/30 text-yellow-400", dot: "bg-yellow-400" },
  Low: { badge: "border-green-400/30 text-green-400", dot: "bg-green-400" },
};

const RECS = [
  {
    priority: "High" as const,
    category: "Content",
    icon: Flame,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    title: "Post at least 5× this week",
    body: "Your engagement drops significantly when posting fewer than 5 times per week. Accounts posting daily grow audiences 3.7× faster on average.",
    action: "Open Scheduler",
    href: "/schedule",
  },
  {
    priority: "High" as const,
    category: "Offer",
    icon: Package,
    color: "text-primary",
    bg: "bg-primary/10",
    title: "Add a low-ticket tripwire offer",
    body: "You currently have no offer under $20. Adding a $7–$17 tripwire converts 12–18% of cold traffic and lowers paid acquisition costs by up to 40%.",
    action: "Build Offer",
    href: "/bundle",
  },
  {
    priority: "Medium" as const,
    category: "Content",
    icon: Target,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    title: "Lead with pain, not desire",
    body: "Pain-first hooks are currently outperforming dream-outcome hooks by 2.1× in your niche. Reframe your next 3 pieces to open with a frustration, not a goal.",
    action: "Write Pain Hooks",
    href: "/viral-hooks?hookType=pain",
  },
  {
    priority: "Medium" as const,
    category: "Analytics",
    icon: BarChart2,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    title: "Review your top 3 performing posts",
    body: "Identifying your best content patterns from the last 30 days and replicating the hook structure is the fastest way to compound reach without new ideas.",
    action: "View Analytics",
    href: "/analytics",
  },
  {
    priority: "Medium" as const,
    category: "Brand",
    icon: Users,
    color: "text-green-400",
    bg: "bg-green-400/10",
    title: "Add a community upsell to your offer",
    body: "Brands that include community access (Discord/Skool) in their upsell stack see 35% higher LTV. Your current offer stack doesn't include a community tier.",
    action: "Update Offer",
    href: "/digital-product",
  },
  {
    priority: "Low" as const,
    category: "Launch",
    icon: Zap,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    title: "Run an A/B test on your headline",
    body: "You haven't tested your main offer headline in over 30 days. A single headline test can increase conversion by 20–40% with the same traffic.",
    action: "Start A/B Test",
    href: "/ab-testing",
  },
];

const GROWTH_METRICS = [
  { label: "Engagement Rate Target", current: "—", target: ">4%", status: "neutral" },
  { label: "Weekly Content Volume", current: "0", target: "5+ posts", status: "low" },
  { label: "Offer Conversion Rate", current: "—", target: ">2%", status: "neutral" },
  { label: "Email Open Rate", current: "—", target: ">35%", status: "neutral" },
];

export default function Publish() {
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
              <Badge variant="outline" className="border-orange-400/30 text-orange-400 text-[10px]">Labs</Badge>
            </div>
            <p className="text-muted-foreground text-sm">Your personalized growth playbook — updated based on market signals.</p>
          </div>
          <Link href="/command">
            <Button>
              <Zap className="h-4 w-4 mr-2" /> Ask SPARK
              <ArrowRight className="h-3.5 w-3.5 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {GROWTH_METRICS.map((m, i) => (
            <Card key={i} className="border-border/50 bg-card/50">
              <CardContent className="p-3 text-center">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{m.label}</p>
                <p className={`text-xl font-black ${m.status === "low" ? "text-red-400" : ""}`}>{m.current}</p>
                <p className="text-[10px] text-muted-foreground">Target: {m.target}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Your Action Plan</h2>
            <span className="text-xs text-muted-foreground">· {RECS.length} recommendations</span>
          </div>

          {RECS.map((rec, i) => {
            const Icon = rec.icon;
            const pr = PRIORITY_STYLES[rec.priority];
            return (
              <Card key={i} className="border-border/50 bg-card/50 hover:border-primary/20 transition-all group">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${rec.bg}`}>
                      <Icon className={`h-5 w-5 ${rec.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-bold text-sm">{rec.title}</h3>
                        <Badge variant="outline" className={`text-[9px] h-4 ${pr.badge}`}>
                          <span className={`h-1.5 w-1.5 rounded-full inline-block mr-1 ${pr.dot}`} />
                          {rec.priority}
                        </Badge>
                        <Badge variant="outline" className="text-[9px] h-4 border-border/50 text-muted-foreground">{rec.category}</Badge>
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

        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 text-center">
          <h3 className="text-lg font-bold mb-2">Want a custom growth plan?</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
            Tell SPARK your business goal and it will build a specific, actionable plan across research, content, offer, and launch.
          </p>
          <Link href="/command">
            <Button>
              <Zap className="h-4 w-4 mr-2" /> Open Command Center
            </Button>
          </Link>
        </Card>

      </div>
    </Layout>
  );
}
