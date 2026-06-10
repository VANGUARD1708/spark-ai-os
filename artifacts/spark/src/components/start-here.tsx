import { useOnboarding } from "./onboarding-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import {
  Compass, Sparkles, Zap, Rocket, TrendingUp,
  ArrowRight, X, CheckCircle, Lightbulb, Flame,
  Package, Megaphone, BarChart2, ChevronRight
} from "lucide-react";

const PHASES = [
  {
    id: "discover",
    title: "Find an Opportunity",
    desc: "Discover what's trending and what products are winning right now.",
    icon: Compass,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    tools: [
      { label: "Trend Radar", href: "/trending", icon: TrendingUp },
      { label: "Winning Products", href: "/winning", icon: CheckCircle },
      { label: "Idea Generator", href: "/ideas", icon: Lightbulb },
    ],
    cta: "Start Exploring",
    ctaHref: "/trending",
  },
  {
    id: "build",
    title: "Build Your Brand",
    desc: "Turn your idea into a real business concept with brand identity and offers.",
    icon: Sparkles,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20",
    tools: [
      { label: "Brand Builder", href: "/brand-builder", icon: Sparkles },
      { label: "Bundle Builder", href: "/bundle", icon: Package },
      { label: "Offer Builder", href: "/digital-product", icon: CheckCircle },
    ],
    cta: "Build Your Brand",
    ctaHref: "/brand-builder",
  },
  {
    id: "create",
    title: "Create Content",
    desc: "Generate viral hooks, scripts, and campaigns that stop the scroll.",
    icon: Zap,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20",
    tools: [
      { label: "Viral Hooks", href: "/viral-hooks", icon: Flame },
      { label: "TikTok Scripts", href: "/scripts", icon: Zap },
      { label: "Campaign Manager", href: "/campaigns", icon: Megaphone },
    ],
    cta: "Create Content",
    ctaHref: "/viral-hooks",
  },
  {
    id: "launch",
    title: "Launch & Scale",
    desc: "Schedule, automate, and analyze your growth with AI recommendations.",
    icon: Rocket,
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20",
    tools: [
      { label: "Campaign Manager", href: "/campaigns", icon: Megaphone },
      { label: "Analytics", href: "/analytics", icon: BarChart2 },
      { label: "Recommendations", href: "/publish", icon: TrendingUp },
    ],
    cta: "Launch",
    ctaHref: "/campaigns",
  },
];

export function StartHere() {
  const { showStartHere, startTour, endTour, state } = useOnboarding();

  if (!showStartHere) return null;

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header banner */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome to SPARK</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Your AI business engine. Here's your path from idea to revenue.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={startTour} className="gap-2">
            <Compass className="h-3.5 w-3.5" /> Take a Tour
          </Button>
          <button
            onClick={endTour}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Phase cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PHASES.map((phase, i) => {
          const Icon = phase.icon;
          return (
            <Card
              key={phase.id}
              className={`border ${phase.border} ${phase.bg} hover:scale-[1.02] transition-all duration-300 cursor-pointer group`}
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-lg ${phase.bg} flex items-center justify-center`}>
                    <Icon className={`h-4 w-4 ${phase.color}`} />
                  </div>
                  <div className={`text-xs font-bold uppercase tracking-wider ${phase.color}`}>
                    Step {i + 1}
                  </div>
                </div>

                <h3 className="font-bold text-sm">{phase.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{phase.desc}</p>

                <div className="space-y-1">
                  {phase.tools.map(tool => (
                    <Link key={tool.label} href={tool.href}>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground px-2 py-1.5 rounded-md hover:bg-white/5 transition-colors">
                        <tool.icon className="h-3 w-3 shrink-0" />
                        <span>{tool.label}</span>
                        <ChevronRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  ))}
                </div>

                <Link href={phase.ctaHref} className="block">
                  <Button size="sm" className={`w-full text-xs h-8 ${phase.bg} ${phase.color} border ${phase.border} hover:brightness-110`}>
                    {phase.cta} <ArrowRight className="h-3 w-3 ml-1.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick action */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/8 border border-primary/20">
        <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
          <Zap className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">Not sure where to start?</p>
          <p className="text-xs text-muted-foreground">Let SPARK analyze your goals and build a custom plan.</p>
        </div>
        <Link href="/command">
          <Button size="sm">
            <Zap className="h-4 w-4 mr-2" /> Ask SPARK
          </Button>
        </Link>
      </div>
    </div>
  );
}
