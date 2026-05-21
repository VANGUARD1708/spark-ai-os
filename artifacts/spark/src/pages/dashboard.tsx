import { Layout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import {
  useGetStats,
  useGetAnalytics,
  useGetSavedIdeas,
  getGetStatsQueryKey,
  getGetAnalyticsQueryKey,
  getGetSavedIdeasQueryKey,
} from "@workspace/api-client-react";

import { Link } from "wouter";

import {
  ArrowRight,
  Lightbulb,
  Package,
  Video,
  Flame,
  Palette,
  Crown,
  CheckCircle2,
  Circle,
  Zap,
  Activity,
  TrendingUp,
  Bookmark,
  Archive,
  Megaphone,
  Brain,
  Rocket,
  Sparkles,
  Radar,
  Target,
  Wand2,
  LineChart,
  Hash,
  Send,
  Compass,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";

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
  const { data: stats } = useGetStats({
    query: { queryKey: getGetStatsQueryKey() },
  });

  const { data: analytics } = useGetAnalytics({
    query: { queryKey: getGetAnalyticsQueryKey() },
  });

  const { data: savedIdeas } = useGetSavedIdeas({
    query: { queryKey: getGetSavedIdeasQueryKey() },
  });

  const streak = useMemo(() => {
    if (!analytics?.generationsByDay?.length) return 0;

    let count = 0;

    const sortedDays = [...analytics.generationsByDay].sort((a, b) =>
      b.date.localeCompare(a.date)
    );

    for (let i = 0; i < sortedDays.length; i++) {
      const expected = new Date();

      expected.setDate(expected.getDate() - i);

      const expectedStr = expected.toISOString().split("T")[0];

      const match = sortedDays.find(
        (d) => d.date === expectedStr && d.count > 0
      );

      if (match) count++;
      else if (i > 0) break;
    }

    return count;
  }, [analytics]);

  const completedMissions = missions.filter((m) => m.done).length;

  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* HERO */}

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
                  Transform your raw ideas into scalable internet businesses,
                  creator brands, campaigns, and social media systems using AI.
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
                    {streak || 0}
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

                  <p className="text-xs text-muted-foreground mt-1">
                    growth activity
                  </p>
                </CardContent>
              </Card>

            </div>

          </div>

        </section>

        {/* AI INSIGHTS */}

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
                Storytelling content is currently outperforming direct-selling
                content in creator education niches.
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
                Faceless AI creator brands are trending strongly this week.
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
                Convert your strongest ideas into TikTok scripts for faster
                audience growth.
              </p>
            </CardContent>
          </Card>

        </section>

        {/* CREATOR DNA */}

        <section>

          <div className="flex items-center gap-2 mb-4">
            <Compass className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">
              Your Creator DNA
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-4">

            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Creator Type
                </p>

                <h3 className="text-xl font-bold">
                  Storyteller
                </h3>

                <p className="text-sm text-muted-foreground mt-2">
                  Your content performs best when emotional and narrative-driven.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Strongest Skill
                </p>

                <h3 className="text-xl font-bold">
                  Viral Hooks
                </h3>

                <p className="text-sm text-muted-foreground mt-2">
                  Your strongest asset is attention-grabbing content openings.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Best Platform
                </p>

                <h3 className="text-xl font-bold">
                  TikTok
                </h3>

                <p className="text-sm text-muted-foreground mt-2">
                  Your content style aligns strongly with short-form platforms.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Monetization Fit
                </p>

                <h3 className="text-xl font-bold">
                  Digital Products
                </h3>

                <p className="text-sm text-muted-foreground mt-2">
                  Your audience profile matches scalable digital offers.
                </p>
              </CardContent>
            </Card>

          </div>

        </section>

        {/* QUICK ACTIONS */}

        <section>

          <div className="flex items-center justify-between mb-4">

            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Quick Actions
              </h2>

              <p className="text-sm text-muted-foreground mt-1">
                Build, create, and launch faster using SPARK AI.
              </p>
            </div>

          </div>

          <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">

            {engines.map((engine) => (
              <Link key={engine.href} href={engine.href}>

                <Card className="group cursor-pointer border-border/50 bg-card/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">

                  <CardContent className="p-5">

                    <div
                      className={`h-11 w-11 rounded-xl flex items-center justify-center mb-4 ${engine.bg}`}
                    >
                      <engine.icon className={`h-5 w-5 ${engine.color}`} />
                    </div>

                    <h3 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">
                      {engine.title}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {engine.desc}
                    </p>

                  </CardContent>

                </Card>

              </Link>
            ))}

          </div>

        </section>

        {/* DAILY MISSIONS */}

        <section>

          <div className="flex items-center gap-2 mb-4">
            <LineChart className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">
              Daily Missions
            </h2>
          </div>

          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-5 space-y-4">

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {completedMissions}/{missions.length} complete
                </span>

                <div className="h-2 w-40 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{
                      width: `${(completedMissions / missions.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {missions.map((mission) => (
                <div
                  key={mission.title}
                  className="flex items-center gap-3"
                >
                  {mission.done ? (
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                  )}

                  <span className="text-sm">
                    {mission.title}
                  </span>
                </div>
              ))}

            </CardContent>
          </Card>

        </section>

        {/* RECENT IDEAS */}

        {savedIdeas && savedIdeas.length > 0 && (
          <section>

            <div className="flex items-center justify-between mb-4">

              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Recent Ideas
                </h2>

                <p className="text-sm text-muted-foreground mt-1">
                  Continue building your strongest concepts.
                </p>
              </div>

            </div>

            <div className="space-y-3">

              {savedIdeas.slice(0, 3).map((idea) => (

                <Card
                  key={idea.id}
                  className="border-border/50 bg-card/50"
                >

                  <CardContent className="p-5 flex items-center gap-4">

                    <div className="h-10 w-10 rounded-xl bg-yellow-400/10 flex items-center justify-center shrink-0">
                      <Lightbulb className="h-5 w-5 text-yellow-400" />
                    </div>

                    <div className="flex-1 min-w-0">

                      <h3 className="font-semibold truncate">
                        {idea.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-2 mt-2">

                        <Badge
                          variant="outline"
                          className="border-border/50"
                        >
                          {idea.niche}
                        </Badge>

                        <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                          Viral Score 92
                        </Badge>

                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          Monetization High
                        </Badge>

                      </div>

                    </div>

                    <Link
                      href={`/bundle?title=${encodeURIComponent(
                        idea.title
                      )}`}
                    >
                      <Button variant="outline">
                        Build
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>

                  </CardContent>

                </Card>

              ))}

            </div>

          </section>
        )}

      </div>
    </Layout>
  );
}