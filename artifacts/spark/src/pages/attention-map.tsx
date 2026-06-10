import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity, Flame, TrendingUp, Eye, Clock, ArrowRight,
  Zap, Target, AlertTriangle, Sparkles
} from "lucide-react";
import { useState } from "react";

const ATTENTION_ZONES = [
  {
    zone: "Hook (0-3 sec)",
    icon: Flame,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20",
    importance: "Critical",
    score: "80% drop-off here",
    tips: [
      "Open with a specific number or result",
      "Use a curiosity gap: I did X and got Y",
      "Show the end result first, then explain",
      "Pattern interrupt: unexpected visual or statement",
    ],
  },
  {
    zone: "Setup (3-10 sec)",
    icon: Target,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
    importance: "High",
    score: "50% drop-off here",
    tips: [
      "Establish the problem in 1 sentence",
      "Show you understand the viewer's pain",
      "Use a relatable scenario or story",
      "Keep it under 7 seconds",
    ],
  },
  {
    zone: "Proof (10-30 sec)",
    icon: TrendingUp,
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20",
    importance: "Medium",
    score: "30% drop-off here",
    tips: [
      "Show, don't tell - visual proof beats claims",
      "Use before/after, transformation, or demo",
      "Include one surprising fact or stat",
      "Keep the pace fast with cuts",
    ],
  },
  {
    zone: "CTA (Final 3 sec)",
    icon: Zap,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    importance: "Critical",
    score: "10% drop-off here (but 90% of conversions)",
    tips: [
      "One clear action: Follow for part 2 or Link in bio",
      "Create urgency: Only 3 spots left",
      "Repeat the main benefit in the CTA",
      "End on a high-energy note",
    ],
  },
];

export default function AttentionMap() {
  const [activeZone, setActiveZone] = useState(0);
  const zone = ATTENTION_ZONES[activeZone];
  const ZoneIcon = zone.icon;

  return (
    <Layout>
      <div className="w-full max-w-5xl space-y-6 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Attention Map</h1>
                <p className="text-sm text-muted-foreground">Where viewers drop off and how to keep them watching.</p>
              </div>
            </div>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/20">Preview</Badge>
        </div>

        {/* Timeline selector */}
        <div className="flex items-center gap-2">
          {ATTENTION_ZONES.map((z, i) => {
            const ZIcon = z.icon;
            return (
              <button
                key={z.zone}
                onClick={() => setActiveZone(i)}
                className={`flex-1 p-3 rounded-xl border text-left transition-all ${
                  activeZone === i
                    ? z.border + " " + z.bg
                    : "border-border/30 hover:border-border/60"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <ZIcon className={`h-4 w-4 ${activeZone === i ? z.color : "text-muted-foreground"}`} />
                  <span className={`text-xs font-semibold ${activeZone === i ? z.color : "text-muted-foreground"}`}>
                    {z.zone}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground">{z.importance}</p>
              </button>
            );
          })}
        </div>

        {/* Active zone detail */}
        <Card className={`${zone.border}`}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`h-12 w-12 rounded-xl ${zone.bg} flex items-center justify-center`}>
                <ZoneIcon className={`h-6 w-6 ${zone.color}`} />
              </div>
              <div>
                <h2 className="text-lg font-bold">{zone.zone}</h2>
                <div className="flex items-center gap-2">
                  <Badge className={`${zone.bg} ${zone.color} text-[10px]`}>{zone.importance}</Badge>
                  <span className="text-xs text-muted-foreground">{zone.score}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">What works here</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {zone.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border/30">
                    <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-primary">{i + 1}</span>
                    </div>
                    <p className="text-xs text-foreground/90 leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Eye className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-lg font-bold">3.2s</p>
              <p className="text-[10px] text-muted-foreground uppercase">Avg Hook Retention</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-5 w-5 text-blue-400 mx-auto mb-2" />
              <p className="text-lg font-bold">18.5s</p>
              <p className="text-[10px] text-muted-foreground uppercase">Avg Watch Time</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-5 w-5 text-green-400 mx-auto mb-2" />
              <p className="text-lg font-bold">42%</p>
              <p className="text-[10px] text-muted-foreground uppercase">Completion Rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mx-auto mb-2" />
              <p className="text-lg font-bold">3.8%</p>
              <p className="text-[10px] text-muted-foreground uppercase">CTR from CTA</p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-semibold">Build scroll-stopping hooks now</p>
                <p className="text-xs text-muted-foreground">SPARK generates 5 hook variants for any product in seconds.</p>
              </div>
            </div>
            <Button className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/30">
              <ArrowRight className="h-4 w-4 mr-2" /> Go to Hooks
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
