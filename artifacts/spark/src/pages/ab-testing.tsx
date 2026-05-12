import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import {
  FlaskConical, Trophy, ArrowRight, Plus, TrendingUp,
  Users, MousePointer, DollarSign, BarChart2, Zap, CheckCircle2
} from "lucide-react";
import { useState } from "react";

interface Test {
  id: number;
  name: string;
  type: string;
  status: "running" | "complete" | "draft";
  variantA: { label: string; impressions: number; clicks: number; conversions: number };
  variantB: { label: string; impressions: number; clicks: number; conversions: number };
  winner?: "A" | "B";
  lift?: string;
}

const SAMPLE_TESTS: Test[] = [
  {
    id: 1,
    name: "Hook: Question vs. Statement",
    type: "Hook",
    status: "complete",
    winner: "B",
    lift: "+38% CTR",
    variantA: {
      label: "Are you tired of struggling to lose weight?",
      impressions: 4820,
      clicks: 289,
      conversions: 23,
    },
    variantB: {
      label: "I lost 30 lbs without a gym. Here's exactly what I did.",
      impressions: 4820,
      clicks: 498,
      conversions: 41,
    },
  },
  {
    id: 2,
    name: "Price Point: $47 vs $97",
    type: "Pricing",
    status: "running",
    variantA: {
      label: "$47 — Lower price, higher volume",
      impressions: 1240,
      clicks: 186,
      conversions: 12,
    },
    variantB: {
      label: "$97 — Premium anchor pricing",
      impressions: 1240,
      clicks: 174,
      conversions: 11,
    },
  },
  {
    id: 3,
    name: "CTA: 'Get Instant Access' vs 'Start Free Trial'",
    type: "CTA",
    status: "complete",
    winner: "A",
    lift: "+22% CVR",
    variantA: {
      label: "Get Instant Access →",
      impressions: 3200,
      clicks: 451,
      conversions: 38,
    },
    variantB: {
      label: "Start Free Trial →",
      impressions: 3200,
      clicks: 389,
      conversions: 31,
    },
  },
];

const TYPE_OPTIONS = ["Hook", "Pricing", "CTA", "Headline", "Offer Name"];

const STATUS_STYLES = {
  complete: { label: "Complete", badge: "bg-green-400/15 text-green-400 border-0" },
  running: { label: "Running", badge: "bg-blue-400/15 text-blue-400 border-0" },
  draft: { label: "Draft", badge: "bg-secondary text-muted-foreground border-0" },
};

function CVR(clicks: number, conversions: number) {
  if (!clicks) return "0.0%";
  return ((conversions / clicks) * 100).toFixed(1) + "%";
}

function CTR(impressions: number, clicks: number) {
  if (!impressions) return "0.0%";
  return ((clicks / impressions) * 100).toFixed(1) + "%";
}

export default function ABTesting() {
  const [tests, setTests] = useState<Test[]>(SAMPLE_TESTS);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("Hook");
  const [varA, setVarA] = useState("");
  const [varB, setVarB] = useState("");

  const createTest = () => {
    if (!newName.trim() || !varA.trim() || !varB.trim()) return;
    setTests(prev => [...prev, {
      id: Date.now(),
      name: newName,
      type: newType,
      status: "running",
      variantA: { label: varA, impressions: 0, clicks: 0, conversions: 0 },
      variantB: { label: varB, impressions: 0, clicks: 0, conversions: 0 },
    }]);
    setNewName(""); setVarA(""); setVarB("");
    setShowNew(false);
  };

  return (
    <Layout>
      <div className="w-full max-w-4xl space-y-8 animate-in fade-in duration-500">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-9 w-9 rounded-xl bg-purple-400/10 flex items-center justify-center">
                <FlaskConical className="h-5 w-5 text-purple-400" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">A/B Testing</h1>
              <Badge variant="outline" className="border-orange-400/30 text-orange-400 text-[10px]">Labs</Badge>
            </div>
            <p className="text-muted-foreground text-sm">Test hooks, prices, and CTAs. Let data pick the winner.</p>
          </div>
          <Button onClick={() => setShowNew(!showNew)} className="shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            New Test
          </Button>
        </div>

        {showNew && (
          <Card className="border-primary/30 bg-primary/5 animate-in slide-in-from-top-2 duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Create New Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Test Name</label>
                  <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Hook A vs Hook B" className="bg-background" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Test Type</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {TYPE_OPTIONS.map(t => (
                      <button
                        key={t}
                        onClick={() => setNewType(t)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-all ${newType === t ? "border-primary bg-primary/15 text-primary" : "border-border/50 text-muted-foreground"}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Variant A</label>
                  <Input value={varA} onChange={e => setVarA(e.target.value)} placeholder="First version…" className="bg-background" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Variant B</label>
                  <Input value={varB} onChange={e => setVarB(e.target.value)} placeholder="Alternative version…" className="bg-background" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={createTest} disabled={!newName || !varA || !varB}>Start Test</Button>
                <Button variant="ghost" onClick={() => setShowNew(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-5">
          {tests.map(test => {
            const st = STATUS_STYLES[test.status];
            const aWins = test.status === "complete" && test.winner === "A";
            const bWins = test.status === "complete" && test.winner === "B";

            return (
              <Card key={test.id} className="border-border/50 bg-card/50 overflow-hidden">
                <CardHeader className="pb-3 flex-row items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`text-[10px] h-5 ${st.badge}`}>{st.label}</Badge>
                      <Badge variant="outline" className="text-[10px] h-5 border-border/50 text-muted-foreground">{test.type}</Badge>
                      {test.winner && test.lift && (
                        <Badge className="text-[10px] h-5 bg-green-400/15 text-green-400 border-0 flex items-center gap-1">
                          <TrendingUp className="h-2.5 w-2.5" />{test.lift}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-base">{test.name}</CardTitle>
                  </div>
                  {test.status === "complete" && (
                    <div className="flex items-center gap-1.5 text-yellow-400 shrink-0">
                      <Trophy className="h-4 w-4" />
                      <span className="text-sm font-bold">Winner: {test.winner}</span>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {([
                      { variant: "A", data: test.variantA, wins: aWins },
                      { variant: "B", data: test.variantB, wins: bWins },
                    ] as const).map(({ variant, data, wins }) => (
                      <div
                        key={variant}
                        className={`p-4 rounded-xl border transition-all ${wins ? "border-green-400/40 bg-green-400/5" : "border-border/40 bg-secondary/20"}`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs font-black rounded px-1.5 py-0.5 ${wins ? "bg-green-400/20 text-green-400" : "bg-secondary text-muted-foreground"}`}>
                            {variant}
                          </span>
                          {wins && <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />}
                        </div>
                        <p className="text-sm font-medium leading-snug mb-3">{data.label}</p>
                        {test.status !== "draft" && (
                          <div className="grid grid-cols-3 gap-2">
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground">Impressions</p>
                              <p className="text-sm font-bold">{data.impressions.toLocaleString()}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground">CTR</p>
                              <p className={`text-sm font-bold ${wins ? "text-green-400" : ""}`}>{CTR(data.impressions, data.clicks)}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground">CVR</p>
                              <p className={`text-sm font-bold ${wins ? "text-green-400" : ""}`}>{CVR(data.clicks, data.conversions)}</p>
                            </div>
                          </div>
                        )}
                        {test.status === "running" && (
                          <div className="mt-2">
                            <div className="h-1 bg-secondary/40 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-400/60 rounded-full animate-pulse" style={{ width: `${Math.random() * 30 + 30}%` }} />
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-1">Collecting data…</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border-border/40 bg-card/30 p-5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Generate variants with AI</p>
              <p className="text-xs text-muted-foreground">Let SPARK write two versions of your hook, headline, or offer and set up the test automatically.</p>
            </div>
            <Link href="/command" className="ml-auto shrink-0">
              <Button size="sm">
                Open Command Center <ArrowRight className="h-3.5 w-3.5 ml-2" />
              </Button>
            </Link>
          </div>
        </Card>

      </div>
    </Layout>
  );
}
