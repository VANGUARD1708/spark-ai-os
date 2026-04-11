import { Layout } from "@/components/layout";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Video, Flame, BookOpen, Mic, ArrowRight, Sparkles, BarChart2 } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";

const CONTENT_TYPES = [
  { type: "TikTok Hook", icon: Flame, color: "text-orange-400", bg: "bg-orange-400/10" },
  { type: "Educational", icon: BookOpen, color: "text-blue-400", bg: "bg-blue-400/10" },
  { type: "Behind the Scenes", icon: Video, color: "text-pink-400", bg: "bg-pink-400/10" },
  { type: "Testimonial", icon: Mic, color: "text-green-400", bg: "bg-green-400/10" },
  { type: "Product Demo", icon: Sparkles, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  { type: "Analytics Reveal", icon: BarChart2, color: "text-purple-400", bg: "bg-purple-400/10" },
  { type: "TikTok Hook", icon: Flame, color: "text-orange-400", bg: "bg-orange-400/10" },
];

const IDEAS_BANK = [
  "Show the 1 thing that changed everything for your business",
  "3 mistakes I made in my first 30 days (and what to do instead)",
  "What a day in my life actually looks like when I'm building",
  "The exact product that made my first $1,000 online",
  "Real numbers: what I earned last month and how",
  "I tried [popular method] for 7 days — here's what happened",
  "The 30-second routine that doubled my energy",
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function ContentPlanner() {
  const [niche, setNiche] = useState("");
  const [revealed, setRevealed] = useState(false);

  const today = new Date();
  const weekDates = DAYS.map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - today.getDay() + 1 + i);
    return d;
  });

  return (
    <Layout>
      <div className="w-full max-w-5xl space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Content Planner</h1>
            <p className="text-muted-foreground mt-2">Your 7-day content calendar. One idea per day, zero blank pages.</p>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Your niche (e.g. fitness)"
              value={niche}
              onChange={e => setNiche(e.target.value)}
              className="bg-card border-border/50 w-48"
            />
            <Button onClick={() => setRevealed(true)} disabled={!niche.trim()}>
              <Sparkles className="h-4 w-4 mr-2" />
              Plan Week
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {DAYS.map((day, i) => {
            const ContentIcon = CONTENT_TYPES[i].icon;
            const date = weekDates[i];
            const isToday = date.toDateString() === today.toDateString();
            const idea = IDEAS_BANK[i % IDEAS_BANK.length];

            return (
              <Card key={day} className={`border-border/50 flex flex-col transition-all ${isToday ? "border-primary/40 shadow-sm shadow-primary/10" : "hover:border-border"}`}>
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-center justify-between gap-1">
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-wider ${isToday ? "text-primary" : "text-muted-foreground"}`}>{day}</p>
                      <p className="text-lg font-semibold">{date.getDate()}</p>
                    </div>
                    {isToday && <Badge className="text-[9px] bg-primary/20 text-primary border-0 h-4">Today</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4 flex-1 flex flex-col gap-3">
                  <div className={`flex items-center gap-1.5 ${CONTENT_TYPES[i].color}`}>
                    <div className={`h-6 w-6 rounded flex items-center justify-center ${CONTENT_TYPES[i].bg}`}>
                      <ContentIcon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs font-semibold">{CONTENT_TYPES[i].type}</span>
                  </div>
                  {revealed ? (
                    <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                      {niche ? idea.replace("[popular method]", `${niche} hacks`) : idea}
                    </p>
                  ) : (
                    <div className="space-y-1.5 flex-1">
                      <div className="h-2 bg-muted/40 rounded animate-pulse" style={{ animationDelay: `${i * 100}ms`, width: "90%" }} />
                      <div className="h-2 bg-muted/40 rounded animate-pulse" style={{ animationDelay: `${i * 100 + 50}ms`, width: "70%" }} />
                      <div className="h-2 bg-muted/40 rounded animate-pulse" style={{ animationDelay: `${i * 100 + 100}ms`, width: "80%" }} />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {revealed && (
          <div className="flex flex-col sm:flex-row gap-3 items-center p-4 rounded-xl border border-border/50 bg-card/50">
            <div className="flex-1">
              <p className="text-sm font-medium">Content plan ready for this week</p>
              <p className="text-xs text-muted-foreground">7 content ideas across 5 formats. Turn each into a script in seconds.</p>
            </div>
            <a href={`/scripts?title=${encodeURIComponent(niche)}&desc=Weekly+content+idea&aud=my+audience`}>
              <Button size="sm" className="shrink-0 group/btn">
                <Video className="h-4 w-4 mr-2" />
                Write Scripts
                <ArrowRight className="ml-2 h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
              </Button>
            </a>
          </div>
        )}

        <div className="p-4 rounded-xl border border-border/40 bg-card/20 text-center">
          <p className="text-xs text-muted-foreground">
            Full calendar sync, reminders, and content streaks coming in Phase 2.
          </p>
        </div>
      </div>
    </Layout>
  );
}
