import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Search, Palette, FileText, TrendingUp, BarChart2, ShoppingCart,
  Bot, Zap, ArrowRight, CheckCircle2, Clock, Sparkles
} from "lucide-react";

interface Agent {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  status: "active" | "beta" | "labs";
  capabilities: string[];
  primaryHref: string;
  primaryLabel: string;
}

const AGENTS: Agent[] = [
  {
    id: "research",
    name: "Research Agent",
    tagline: "Find your market before you build it.",
    description: "Scans trends, identifies gaps, analyzes audience pain points, and surfaces competitor weaknesses to give you an unfair advantage before you launch.",
    icon: Search,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20 hover:border-blue-400/40",
    status: "active",
    capabilities: [
      "Trend detection across platforms",
      "Audience pain point mapping",
      "Competitor gap analysis",
      "Market size estimation",
    ],
    primaryHref: "/ideas",
    primaryLabel: "Generate Ideas",
  },
  {
    id: "brand",
    name: "Brand Agent",
    tagline: "Your identity, built by AI.",
    description: "Crafts your complete brand identity from a single prompt — name, tone, messaging, color system, typography, and positioning that resonates with your exact audience.",
    icon: Palette,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20 hover:border-purple-400/40",
    status: "active",
    capabilities: [
      "Full brand identity generation",
      "Voice and tone calibration",
      "Messaging hierarchy",
      "Color and typography system",
    ],
    primaryHref: "/brand-builder",
    primaryLabel: "Build Brand",
  },
  {
    id: "content",
    name: "Content Agent",
    tagline: "Viral content, on demand.",
    description: "Creates scroll-stopping hooks, TikTok scripts, ad copy, email sequences, and UGC concepts — all calibrated to your brand voice and target audience.",
    icon: FileText,
    color: "text-pink-400",
    bg: "bg-pink-400/10",
    border: "border-pink-400/20 hover:border-pink-400/40",
    status: "active",
    capabilities: [
      "TikTok / short-form scripts",
      "Scroll-stopping hook writing",
      "Ad copy for multiple angles",
      "Email and SMS sequences",
    ],
    primaryHref: "/scripts",
    primaryLabel: "Create Content",
  },
  {
    id: "growth",
    name: "Growth Agent",
    tagline: "Scale what works, kill what doesn't.",
    description: "Orchestrates your distribution strategy — choosing the right channels, optimal posting times, and content sequencing to maximize reach and conversions.",
    icon: TrendingUp,
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20 hover:border-green-400/40",
    status: "beta",
    capabilities: [
      "Multi-channel publishing strategy",
      "Content calendar optimization",
      "Audience retargeting logic",
      "Platform-specific formatting",
    ],
    primaryHref: "/campaigns",
    primaryLabel: "Launch Campaign",
  },
  {
    id: "analytics",
    name: "Analytics Agent",
    tagline: "Intelligence, not just data.",
    description: "Transforms raw metrics into actionable intelligence — detecting creative fatigue, spotting audience shifts, and surfacing your highest-leverage optimization opportunities.",
    icon: BarChart2,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20 hover:border-yellow-400/40",
    status: "beta",
    capabilities: [
      "Winning pattern detection",
      "Creative fatigue alerts",
      "Audience trend analysis",
      "AI-driven recommendations",
    ],
    primaryHref: "/analytics",
    primaryLabel: "View Analytics",
  },
  {
    id: "sales",
    name: "Sales Agent",
    tagline: "Build offers that convert.",
    description: "Optimizes your entire funnel — offer structure, pricing psychology, upsell sequencing, and bundle composition — to maximize revenue per customer.",
    icon: ShoppingCart,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20 hover:border-orange-400/40",
    status: "labs",
    capabilities: [
      "Offer and bundle optimization",
      "Pricing psychology engine",
      "Upsell sequence design",
      "Funnel conversion analysis",
    ],
    primaryHref: "/bundle",
    primaryLabel: "Build Offer",
  },
];

const STATUS_STYLES = {
  active: { label: "Active", badge: "border-green-400/30 text-green-400 bg-green-400/10", icon: CheckCircle2 },
  beta: { label: "Beta", badge: "border-blue-400/30 text-blue-400 bg-blue-400/10", icon: Sparkles },
  labs: { label: "Labs", badge: "border-orange-400/30 text-orange-400 bg-orange-400/10", icon: Clock },
};

export default function Agents() {
  return (
    <Layout>
      <div className="w-full max-w-5xl space-y-8 animate-in fade-in duration-500">

        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">AI Agents</h1>
              <p className="text-muted-foreground text-sm mt-0.5">Your AI-powered business team, working 24/7.</p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            SPARK operates like a company. Each agent has a specialized function — from market research to brand creation to content production to sales optimization. Together they run your business autonomously.
          </p>
          <div className="flex items-center gap-3">
            <Link href="/command">
              <Button>
                <Zap className="h-4 w-4 mr-2" />
                Open Command Center
                <ArrowRight className="h-3.5 w-3.5 ml-2" />
              </Button>
            </Link>
            <Badge variant="outline" className="border-primary/30 text-primary text-xs">
              All agents work through the Command Center
            </Badge>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {AGENTS.map((agent) => {
            const st = STATUS_STYLES[agent.status];
            const StatusIcon = st.icon;
            return (
              <Card
                key={agent.id}
                className={`border bg-card/50 transition-all duration-300 hover:shadow-lg hover:shadow-black/20 ${agent.border}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${agent.bg}`}>
                      <agent.icon className={`h-6 w-6 ${agent.color}`} />
                    </div>
                    <Badge variant="outline" className={`text-[10px] h-5 border ${st.badge} flex items-center gap-1`}>
                      <StatusIcon className="h-2.5 w-2.5" />
                      {st.label}
                    </Badge>
                  </div>
                  <CardTitle className="text-base">{agent.name}</CardTitle>
                  <p className={`text-xs font-medium ${agent.color}`}>{agent.tagline}</p>
                  <CardDescription className="text-xs leading-relaxed mt-1">{agent.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    {agent.capabilities.map((cap, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className={`h-1 w-1 rounded-full shrink-0 ${agent.color.replace("text-", "bg-")}`} />
                        {cap}
                      </div>
                    ))}
                  </div>
                  <Link href={agent.primaryHref} className="block">
                    <Button
                      variant={agent.status === "active" ? "default" : "outline"}
                      size="sm"
                      className="w-full"
                      disabled={agent.status === "labs"}
                    >
                      <agent.icon className="h-3.5 w-3.5 mr-2" />
                      {agent.status === "labs" ? "Coming Soon" : agent.primaryLabel}
                      {agent.status !== "labs" && <ArrowRight className="h-3.5 w-3.5 ml-auto" />}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--primary)/0.08)_0%,_transparent_70%)]" />
          <div className="relative">
            <h2 className="text-2xl font-bold mb-3">The Autonomous Loop</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-6 leading-relaxed">
              Tell SPARK your business goal. All 6 agents collaborate in the background — researching, creating, launching, and optimizing — while you stay in control.
            </p>
            <div className="flex justify-center items-center gap-3 text-sm text-muted-foreground mb-6 flex-wrap">
              {["DISCOVER", "BUILD", "LAUNCH", "SCALE", "LEARN", "EVOLVE"].map((step, i, arr) => (
                <span key={step} className="flex items-center gap-3">
                  <span className={`font-bold ${i === 0 ? "text-primary" : ""}`}>{step}</span>
                  {i < arr.length - 1 && <span className="text-border">→</span>}
                </span>
              ))}
            </div>
            <Link href="/command">
              <Button size="lg" className="font-semibold px-8">
                <Zap className="h-4 w-4 mr-2" />
                Activate SPARK
              </Button>
            </Link>
          </div>
        </section>

      </div>
    </Layout>
  );
}
