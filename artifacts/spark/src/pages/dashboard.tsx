import { Layout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

import {
  Lightbulb,
  Flame,
  Palette,
  Megaphone,
  Radar,
  Zap,
  Rocket,
  Sparkles,
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

export default function Dashboard() {
  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto space-y-8">

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
                    0
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

        <section>

          <div className="flex items-center justify-between mb-4">

            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Quick Actions
              </h2>

              <p className="text-sm text-muted-foreground mt-1">
                Build faster using SPARK AI.
              </p>
            </div>

          </div>

          <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">

            {engines.map((engine) => (
              <Link key={engine.href} href={engine.href}>

                <Card className="group cursor-pointer border-border/50 bg-card/50 hover:border-primary/30 transition-all duration-300">

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

      </div>
    </Layout>
  );
}