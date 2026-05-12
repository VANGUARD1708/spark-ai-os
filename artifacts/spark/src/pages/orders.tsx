import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  TrendingUp, DollarSign, BarChart2, ArrowRight, Zap,
  Target, AlertTriangle, ChevronUp, Info, Crown
} from "lucide-react";
import { useState } from "react";

const SCENARIOS = [
  {
    label: "Conservative",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    monthly: [2100, 2800, 3400, 3900, 4200, 4600],
    cac: 28,
    ltv: 127,
    conversionRate: "1.8%",
    note: "Based on 3 posts/week, no paid traffic.",
  },
  {
    label: "Moderate",
    color: "text-green-400",
    bg: "bg-green-400/10",
    monthly: [2800, 4200, 6100, 7800, 9200, 11000],
    cac: 21,
    ltv: 189,
    conversionRate: "2.4%",
    note: "Based on daily posting + email list of 500.",
  },
  {
    label: "Aggressive",
    color: "text-primary",
    bg: "bg-primary/10",
    monthly: [4100, 7300, 11200, 15800, 20400, 26000],
    cac: 14,
    ltv: 267,
    conversionRate: "3.9%",
    note: "Based on daily content + paid ads + affiliate partners.",
  },
];

const MONTHS = ["Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6"];

const RISK_FACTORS = [
  { label: "Market saturation", level: "Medium", desc: "Your niche is competitive but not oversaturated.", color: "text-yellow-400" },
  { label: "Content consistency", level: "High", desc: "Inconsistent posting is the #1 reason businesses stall.", color: "text-red-400" },
  { label: "Offer clarity", level: "Low", desc: "A clear, specific offer converts significantly better.", color: "text-green-400" },
  { label: "Audience trust", level: "Medium", desc: "Social proof and testimonials reduce purchase hesitation.", color: "text-yellow-400" },
];

const LEVERS = [
  { label: "Post 5× per week", impact: "+34% reach", href: "/schedule" },
  { label: "Add a $7 tripwire to your funnel", impact: "+18% conversion", href: "/digital-product" },
  { label: "Run an A/B test on your hook", impact: "+22% CTR", href: "/ab-testing" },
  { label: "Send weekly value emails", impact: "+12% retention", href: "/performance" },
  { label: "Add 2 bonuses to your offer", impact: "+28% perceived value", href: "/bundle" },
];

function formatK(n: number) {
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}K` : `$${n}`;
}

export default function Orders() {
  const [active, setActive] = useState(1);
  const scenario = SCENARIOS[active];

  return (
    <Layout>
      <div className="w-full max-w-4xl space-y-8 animate-in fade-in duration-500">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-9 w-9 rounded-xl bg-green-400/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Revenue Forecast</h1>
              <Badge variant="outline" className="border-orange-400/30 text-orange-400 text-[10px]">Labs</Badge>
            </div>
            <p className="text-muted-foreground text-sm">6-month projections based on content volume, offer quality, and channel mix.</p>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-lg border border-border/40 bg-card/50">
            {SCENARIOS.map((s, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`text-xs px-3 py-1.5 rounded font-medium transition-all ${active === i ? `${s.bg} ${s.color}` : "text-muted-foreground hover:text-foreground"}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Month 6 Target", value: formatK(scenario.monthly[5]), icon: Target, color: "text-primary" },
            { label: "Customer LTV", value: `$${scenario.ltv}`, icon: DollarSign, color: "text-green-400" },
            { label: "Customer CAC", value: `$${scenario.cac}`, icon: BarChart2, color: "text-blue-400" },
            { label: "Conv. Rate", value: scenario.conversionRate, icon: TrendingUp, color: "text-yellow-400" },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} className="border-border/50 bg-card/50">
                <CardContent className="p-4 text-center">
                  <Icon className={`h-5 w-5 mx-auto mb-2 ${stat.color}`} />
                  <p className="text-2xl font-black">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">6-Month Revenue Projection</CardTitle>
              <span className={`text-xs font-medium ${scenario.color}`}>{scenario.label} scenario</span>
            </div>
            <p className="text-xs text-muted-foreground">{scenario.note}</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-40">
              {scenario.monthly.map((val, i) => {
                const max = Math.max(...scenario.monthly);
                const pct = (val / max) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className={`text-[9px] font-bold ${scenario.color}`}>{formatK(val)}</span>
                    <div className="w-full flex items-end" style={{ height: "96px" }}>
                      <div
                        className={`w-full rounded-t-md transition-all ${scenario.bg} border-t ${scenario.color.replace("text-", "border-")}`}
                        style={{ height: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-muted-foreground text-center leading-tight">{MONTHS[i]}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-secondary/20 border border-border/30 flex items-start gap-2">
              <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">Projections are estimates based on industry benchmarks. Actual results depend on execution, niche, and market conditions.</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <ChevronUp className="h-4 w-4" /> Growth Levers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {LEVERS.map((lever, i) => (
                <Link key={i} href={lever.href}>
                  <div className="flex items-center gap-3 p-2.5 rounded-lg border border-border/40 hover:border-primary/20 hover:bg-primary/5 transition-all group cursor-pointer">
                    <div className="flex-1">
                      <p className="text-xs font-medium">{lever.label}</p>
                    </div>
                    <Badge className="bg-green-400/15 text-green-400 border-0 text-[10px] shrink-0">{lever.impact}</Badge>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> Risk Factors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {RISK_FACTORS.map((risk, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">{risk.label}</span>
                    <span className={`text-[10px] font-bold ${risk.color}`}>{risk.level}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{risk.desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6">
          <div className="flex items-center gap-4">
            <Crown className="h-8 w-8 text-yellow-400 shrink-0" />
            <div className="flex-1">
              <h3 className="font-bold mb-1">Advanced forecasting with Pro</h3>
              <p className="text-sm text-muted-foreground">Connect your real revenue data, track actuals vs projections, and get AI-powered course corrections.</p>
            </div>
            <Link href="/pricing" className="shrink-0">
              <Button>Unlock Pro <ArrowRight className="h-3.5 w-3.5 ml-2" /></Button>
            </Link>
          </div>
        </Card>

      </div>
    </Layout>
  );
}
