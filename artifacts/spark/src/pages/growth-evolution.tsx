import { Layout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetStats } from "@workspace/api-client-react";
import {
  LineChart, TrendingUp, Zap, Rocket, ArrowRight,
  CheckCircle, Lock, Sparkles, Crown, Flame
} from "lucide-react";

const MILESTONES = [
  {
    stage: 1,
    name: "Spark",
    icon: Zap,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    description: "You have an idea and have started exploring. You are in discovery mode.",
    actions: ["Generate 3 product ideas", "Save your top idea", "Build your first offer"],
    metric: "1-3 generations",
  },
  {
    stage: 2,
    name: "Ignition",
    icon: Flame,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20",
    description: "You have built your first offer and are creating initial content.",
    actions: ["Generate 5 viral hooks", "Write your first script", "Create a brand identity"],
    metric: "5-10 generations",
  },
  {
    stage: 3,
    name: "Momentum",
    icon: TrendingUp,
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20",
    description: "You are posting consistently and building your first audience.",
    actions: ["Launch a campaign", "Schedule content", "Track analytics"],
    metric: "10-25 generations",
  },
  {
    stage: 4,
    name: "Scale",
    icon: Rocket,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    description: "You have systems, automations, and a growing revenue stream.",
    actions: ["Set up automations", "A/B test offers", "Forecast revenue"],
    metric: "25-50 generations",
  },
  {
    stage: 5,
    name: "Empire",
    icon: Crown,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
    description: "You are a full-stack creator with multiple revenue streams.",
    actions: ["Launch new products", "Build a team", "Expand platforms"],
    metric: "50+ generations",
  },
];

export default function GrowthEvolution() {
  const { data: stats } = useGetStats();
  const statsAny = stats as any;
  const totalGens = statsAny?.totalGenerations ?? 0;

  const currentStage = totalGens >= 50 ? 5 : totalGens >= 25 ? 4 : totalGens >= 10 ? 3 : totalGens >= 5 ? 2 : 1;
  const progressPct = totalGens >= 50 ? 100 : totalGens >= 25 ? ((totalGens - 25) / 25) * 100 : totalGens >= 10 ? ((totalGens - 10) / 15) * 100 : totalGens >= 5 ? ((totalGens - 5) / 5) * 100 : (totalGens / 5) * 100;
  const currentMilestone = MILESTONES[currentStage - 1];
  const StageIcon = currentMilestone.icon;

  return (
    <Layout>
      <div className="w-full max-w-5xl space-y-6 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-yellow-400/10 flex items-center justify-center">
                <LineChart className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Growth Evolution</h1>
                <p className="text-sm text-muted-foreground">Your journey from first idea to full empire.</p>
              </div>
            </div>
          </div>
          <Badge className="bg-yellow-400/10 text-yellow-400 border-yellow-400/20">AI Powered</Badge>
        </div>

        {/* Current stage card */}
        <Card className={`${currentMilestone.border} ${currentMilestone.bg}`}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className={`h-14 w-14 rounded-xl ${currentMilestone.bg} flex items-center justify-center`}>
                <StageIcon className={`h-7 w-7 ${currentMilestone.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Current Stage</p>
                <h2 className="text-xl font-bold">
                  Stage {currentStage}: {currentMilestone.name}
                </h2>
              </div>
              <div className="ml-auto text-right">
                <p className="text-2xl font-bold">{totalGens}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Total Generations</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {currentMilestone.description}
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progress to next stage</span>
                <span className="font-semibold">{Math.round(progressPct)}%</span>
              </div>
              <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stage timeline */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Growth Stages</h3>
          {MILESTONES.map((m) => {
            const isComplete = m.stage < currentStage;
            const isActive = m.stage === currentStage;
            const isLocked = m.stage > currentStage;
            const MIcon = m.icon;
            const StatusIcon = isComplete ? CheckCircle : isLocked ? Lock : m.icon;

            return (
              <Card
                key={m.stage}
                className={`transition-all ${
                  isActive ? m.border + " " + m.bg : "border-border/30"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                      isComplete ? "bg-green-400/10" : isActive ? m.bg : "bg-secondary/20"
                    }`}>
                      <StatusIcon className={`h-5 w-5 ${
                        isComplete ? "text-green-400" : isActive ? m.color : "text-muted-foreground"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-semibold text-sm ${isActive ? m.color : ""}`}>
                          Stage {m.stage}: {m.name}
                        </h4>
                        {isComplete && <Badge className="bg-green-400/10 text-green-400 text-[9px]">Completed</Badge>}
                        {isActive && <Badge className={`${m.bg} ${m.color} text-[9px]`}>Current</Badge>}
                        {isLocked && <Badge className="bg-secondary/30 text-muted-foreground text-[9px]">Locked</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{m.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {m.actions.map((action, i) => (
                          <span
                            key={i}
                            className={`text-[10px] px-2 py-1 rounded-md ${
                              isComplete || isActive
                                ? "bg-secondary/40 text-foreground"
                                : "bg-secondary/20 text-muted-foreground"
                            }`}
                          >
                            {action}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] text-muted-foreground">{m.metric}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <Card className="border-yellow-400/20 bg-yellow-400/5">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="text-sm font-semibold">Keep building to unlock the next stage</p>
                <p className="text-xs text-muted-foreground">Each generation brings you closer to your empire.</p>
              </div>
            </div>
            <Button className="bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30 border-yellow-400/30">
              <ArrowRight className="h-4 w-4 mr-2" /> Generate Something
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
