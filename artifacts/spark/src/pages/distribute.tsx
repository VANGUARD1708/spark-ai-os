import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Radio, Zap, ArrowRight, Play, Pause, CheckCircle2,
  Clock, Send, BarChart2, Flame, Mail, Users, Bell, TrendingUp
} from "lucide-react";
import { useState } from "react";

interface Automation {
  id: number;
  name: string;
  description: string;
  trigger: string;
  action: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  category: string;
  active: boolean;
  runs: number;
}

const AUTOMATIONS: Automation[] = [
  {
    id: 1,
    name: "Welcome Sequence",
    description: "Send a 3-email welcome series automatically when someone joins your list.",
    trigger: "New subscriber",
    action: "Send Email Sequence",
    icon: Mail,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    category: "Email",
    active: false,
    runs: 0,
  },
  {
    id: 2,
    name: "Cart Recovery",
    description: "Automatically follow up with visitors who added to cart but didn't purchase.",
    trigger: "Abandoned cart",
    action: "Send SMS + Email",
    icon: TrendingUp,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    category: "Recovery",
    active: false,
    runs: 0,
  },
  {
    id: 3,
    name: "Weekly Hook Digest",
    description: "Every Sunday night, send your audience a collection of your best hooks from the week.",
    trigger: "Every Sunday 8PM",
    action: "Send Email Digest",
    icon: Flame,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    category: "Email",
    active: false,
    runs: 0,
  },
  {
    id: 4,
    name: "Post-Purchase Upsell",
    description: "Deliver upsell offer automatically 10 minutes after a purchase is confirmed.",
    trigger: "Purchase confirmed",
    action: "Send Upsell Email",
    icon: Zap,
    color: "text-primary",
    bg: "bg-primary/10",
    category: "Sales",
    active: false,
    runs: 0,
  },
  {
    id: 5,
    name: "Content Performance Alert",
    description: "Get notified when any piece of content exceeds 10K views or breaks a CTR record.",
    trigger: "Content milestone",
    action: "Send Notification",
    icon: Bell,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    category: "Analytics",
    active: false,
    runs: 0,
  },
  {
    id: 6,
    name: "Re-Engagement Campaign",
    description: "Automatically detect inactive subscribers (30+ days) and send a win-back sequence.",
    trigger: "30 days inactive",
    action: "Send Win-Back Series",
    icon: Users,
    color: "text-green-400",
    bg: "bg-green-400/10",
    category: "Email",
    active: false,
    runs: 0,
  },
];

const CATEGORY_FILTERS = ["All", "Email", "Sales", "Recovery", "Analytics"];

export default function Distribute() {
  const [automations, setAutomations] = useState(AUTOMATIONS);
  const [filter, setFilter] = useState("All");

  const toggleActive = (id: number) => {
    setAutomations(prev =>
      prev.map(a => a.id === id ? { ...a, active: !a.active } : a)
    );
  };

  const activeCount = automations.filter(a => a.active).length;
  const filtered = filter === "All" ? automations : automations.filter(a => a.category === filter);

  return (
    <Layout>
      <div className="w-full max-w-4xl space-y-8 animate-in fade-in duration-500">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Radio className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Automations</h1>
              <Badge variant="outline" className="border-orange-400/30 text-orange-400 text-[10px]">Labs</Badge>
            </div>
            <p className="text-muted-foreground text-sm">Set it and forget it. Your business runs while you sleep.</p>
          </div>
          <div className="flex items-center gap-3">
            {activeCount > 0 && (
              <Badge className="bg-green-400/15 text-green-400 border-0 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                {activeCount} active
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Active Automations", value: activeCount.toString(), icon: Play, color: "text-green-400" },
            { label: "Total Runs", value: automations.reduce((s, a) => s + a.runs, 0).toString(), icon: BarChart2, color: "text-blue-400" },
            { label: "Available", value: automations.length.toString(), icon: Radio, color: "text-primary" },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <Card key={i} className="border-border/50 bg-card/50">
                <CardContent className="p-4 text-center">
                  <Icon className={`h-5 w-5 mx-auto mb-2 ${s.color}`} />
                  <p className="text-2xl font-black">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORY_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                filter === f
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map(automation => {
            const Icon = automation.icon;
            return (
              <Card
                key={automation.id}
                className={`border transition-all duration-200 ${automation.active ? "border-green-400/20 bg-green-400/5" : "border-border/50 bg-card/50"}`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${automation.bg} ${automation.active ? "ring-1 ring-green-400/30" : ""}`}>
                      <Icon className={`h-6 w-6 ${automation.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h3 className="font-bold text-sm">{automation.name}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">{automation.description}</p>
                        </div>
                        <button
                          onClick={() => toggleActive(automation.id)}
                          className={`shrink-0 flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
                            automation.active
                              ? "border-green-400/40 bg-green-400/10 text-green-400"
                              : "border-border/50 text-muted-foreground hover:border-primary/30 hover:text-primary"
                          }`}
                        >
                          {automation.active ? (
                            <><Pause className="h-3 w-3" /> Active</>
                          ) : (
                            <><Play className="h-3 w-3" /> Enable</>
                          )}
                        </button>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span className="font-medium text-foreground/60">Trigger:</span> {automation.trigger}
                        </span>
                        <span className="flex items-center gap-1">
                          <Send className="h-3 w-3" />
                          <span className="font-medium text-foreground/60">Action:</span> {automation.action}
                        </span>
                        <Badge variant="outline" className="text-[9px] h-4 border-border/50 text-muted-foreground ml-auto">
                          {automation.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold mb-1">Build custom automations with AI</h3>
              <p className="text-sm text-muted-foreground">Tell SPARK what you want to automate and it will design the workflow for you.</p>
            </div>
            <Link href="/command" className="shrink-0">
              <Button>
                Open Command Center
                <ArrowRight className="h-3.5 w-3.5 ml-2" />
              </Button>
            </Link>
          </div>
        </Card>

      </div>
    </Layout>
  );
}
