import { Layout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

import {
  ArrowRight,
  Lightbulb,
  Video,
  Flame,
  Palette,
  Zap,
  TrendingUp,
  Megaphone,
  Brain,
  Rocket,
  Sparkles,
  Radar,
  Target,
  LineChart,
  Send,
  Compass,
  CheckCircle2,
  Circle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const engines = [
  {
    title: "Idea Generator",
    desc: "Turn raw thoughts into valuable business ideas.",
    href: "/ideas",
    icon: Lightbulb,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },

  {
    title: "Brand Builder",
    desc: "Build a complete internet brand identity.",
    href: "/brand-builder",
    icon: Palette,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },

  {
    title: "TikTok Scripts",
    desc: "Create viral short-form storytelling scripts.",
    href: "/scripts",
    icon: Video,
    color: "text-pink-400",
    bg: "bg-pink-400/10",
  },

  {
    title: "Viral Hooks",
    desc: "Generate scroll-stopping opening hooks.",
    href: "/viral-hooks",
    icon: Flame,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
  },

  {
    title: "Campaign Manager",
    desc: "Launch and distribute your campaigns.",
    href: "/campaigns",
    icon: Megaphone,
    color: "text-green-400",
    bg: "bg-green-400/10",
  },

  {
    title: "Trend Radar",
    desc: "Discover growing trends before competitors.",
    href: "/trending",
    icon: Radar,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
  },
];

const missions = [
  {
    title: "Generate 1 idea",
    icon: Lightbulb,
    done: true,
  },

  {
    title: "Create 1 viral hook",
    icon: Flame,
    done: false,
  },

  {
    title: "Build 1 campaign",
    icon: Megaphone,
    done: false,
  },

  {
    title: "Publish to social media",
    icon: Send,
    done: false,
  },
];

export default function Dashboard() {
  const streak = 0;

  const completedMissions = missions.filter((m) => m.done).length;

  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

        <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background p-8 md:p-10">

          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">

            <div className="space-y-5 max-w-3xl">

              <Badge className="bg-primary/15 text-primary border-primary/20 px-3 py-1">
                SPARK AI Operating System
              </Badge>

              <div className="space-y-3">

                <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                  What are you
                  <span className="text-primary"> building today?</span>
                </h1>

                <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                  Transform your raw ideas into scalable internet businesses.
                </p>

              </div>

              <div className="flex flex-wrap gap-3">

                <Link href="/command">
                  <Button className="h-11 px-5 text-sm font-semibold">
                    <Zap className="h-4 w-4 mr-2" />
                    Open Command Center
                  </Button>
                </Link>

                <Link href="/ideas">
                  <Button
                    variant="outline"
                    className="h-11 px-5 text-sm font-semibold"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Ideas
                  </Button>
                </Link>

              </div>

            </div>

            <div className="grid grid-cols-2 gap-4 w-full lg:max-w-sm">

              <Card className="border-primary/20 bg-background/50 backdrop-blur">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Flame className="h-4 w-4 text-orange-400" />
                    <span className="text-xs font-medium text-muted-foreground">
                      Current Streak
                    </span>
                  </div>

                  <div className="text-3xl font-black text-orange-400">
                    {streak}
                  </div>

                  <p className="text-xs text-muted-foreground mt-1">
                    days creating
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-background/50 backdrop-blur">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Rocket className="h-4 w-4 text-green-400" />
                    <span className="text-xs font-medium text-muted-foreground">
                      Momentum
                    </span>
                  </div>

                  <div className="text-3xl font-black text-green-400">
                    High
                  </div>

                </CardContent>
              </Card>

            </div>

          </div>

        </section>

        <section className="grid gap-4 md:grid-cols-3">

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">
                  SPARK Insight
                </span>
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">
                Storytelling content is outperforming direct-selling content.
              </p>
            </CardContent>
          </Card>

          <Card className="border-orange-400/20 bg-orange-400/5">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-orange-400" />
                <span className="text-sm font-semibold">
                  Trending Opportunity
                </span>
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">
                Faceless AI creator brands are trending strongly.
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-400/20 bg-green-400/5">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-4 w-4 text-green-400" />
                <span className="text-sm font-semibold">
                  Recommended Next Step
                </span>
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">
                Convert your strongest ideas into TikTok scripts.
              </p>
            </CardContent>
          </Card>

        </section>

      </div>
    </Layout>
  );
}