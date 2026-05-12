import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Clock, Calendar, Flame, Video, BookOpen, Mic, BarChart2,
  Sparkles, Plus, ChevronLeft, ChevronRight, Send, Zap
} from "lucide-react";
import { useState } from "react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const SLOT_TIMES = ["9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"];

const CONTENT_TYPES = [
  { type: "TikTok Hook", icon: Flame, color: "text-orange-400", bg: "bg-orange-400/10" },
  { type: "Educational", icon: BookOpen, color: "text-blue-400", bg: "bg-blue-400/10" },
  { type: "Behind the Scenes", icon: Video, color: "text-pink-400", bg: "bg-pink-400/10" },
  { type: "Testimonial", icon: Mic, color: "text-green-400", bg: "bg-green-400/10" },
  { type: "Product Demo", icon: Sparkles, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  { type: "Analytics Reveal", icon: BarChart2, color: "text-purple-400", bg: "bg-purple-400/10" },
  { type: "Story/Vlog", icon: Video, color: "text-red-400", bg: "bg-red-400/10" },
];

const OPTIMAL_TIMES = [
  { platform: "TikTok", times: ["6:00 PM", "9:00 PM"], color: "text-pink-400" },
  { platform: "Instagram", times: ["12:00 PM", "6:00 PM"], color: "text-purple-400" },
  { platform: "YouTube", times: ["3:00 PM", "9:00 PM"], color: "text-red-400" },
];

interface ScheduledPost {
  day: number;
  time: string;
  type: string;
  platform: string;
}

const INITIAL_POSTS: ScheduledPost[] = [
  { day: 0, time: "9:00 AM", type: "TikTok Hook", platform: "TikTok" },
  { day: 1, time: "6:00 PM", type: "Educational", platform: "Instagram" },
  { day: 2, time: "3:00 PM", type: "Product Demo", platform: "YouTube" },
  { day: 4, time: "9:00 PM", type: "Behind the Scenes", platform: "TikTok" },
  { day: 6, time: "12:00 PM", type: "Testimonial", platform: "Instagram" },
];

const PLATFORMS = ["TikTok", "Instagram", "YouTube", "Email"];
const PLATFORM_COLORS: Record<string, string> = {
  TikTok: "text-pink-400 bg-pink-400/10",
  Instagram: "text-purple-400 bg-purple-400/10",
  YouTube: "text-red-400 bg-red-400/10",
  Email: "text-blue-400 bg-blue-400/10",
};

export default function Schedule() {
  const today = new Date();
  const [weekOffset, setWeekOffset] = useState(0);
  const [posts, setPosts] = useState<ScheduledPost[]>(INITIAL_POSTS);
  const [selected, setSelected] = useState<{ day: number; time: string } | null>(null);
  const [selectedType, setSelectedType] = useState("TikTok Hook");
  const [selectedPlatform, setSelectedPlatform] = useState("TikTok");

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7);

  const weekDates = DAYS.map((_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const getPostsForCell = (day: number, time: string) =>
    posts.filter(p => p.day === day && p.time === time);

  const addPost = () => {
    if (!selected) return;
    setPosts(prev => [...prev, { ...selected, type: selectedType, platform: selectedPlatform }]);
    setSelected(null);
  };

  const removePost = (day: number, time: string, type: string) => {
    setPosts(prev => prev.filter(p => !(p.day === day && p.time === time && p.type === type)));
  };

  return (
    <Layout>
      <div className="w-full max-w-5xl space-y-8 animate-in fade-in duration-500">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-9 w-9 rounded-xl bg-blue-400/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-400" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Scheduling</h1>
              <Badge variant="outline" className="border-blue-400/30 text-blue-400 text-[10px]">Beta</Badge>
            </div>
            <p className="text-muted-foreground text-sm">Plan your content calendar. Click any slot to schedule a post.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => setWeekOffset(o => o - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium tabular-nums min-w-[120px] text-center">
              {weekDates[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} –{" "}
              {weekDates[6].toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => setWeekOffset(o => o + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 px-4">
          <div className="min-w-[640px]">
            <div className="grid grid-cols-8 gap-1.5 mb-1.5">
              <div className="text-xs text-muted-foreground text-center font-medium p-2" />
              {DAYS.map((day, i) => {
                const date = weekDates[i];
                const isToday = date.toDateString() === today.toDateString();
                return (
                  <div key={day} className={`text-center p-2 rounded-lg ${isToday ? "bg-primary/10" : ""}`}>
                    <p className={`text-xs font-bold uppercase ${isToday ? "text-primary" : "text-muted-foreground"}`}>{day}</p>
                    <p className={`text-base font-semibold ${isToday ? "text-primary" : ""}`}>{date.getDate()}</p>
                  </div>
                );
              })}
            </div>

            {SLOT_TIMES.map(time => (
              <div key={time} className="grid grid-cols-8 gap-1.5 mb-1.5">
                <div className="text-[10px] text-muted-foreground flex items-center justify-center font-medium">
                  {time}
                </div>
                {DAYS.map((_, di) => {
                  const cellPosts = getPostsForCell(di, time);
                  const isSelected = selected?.day === di && selected?.time === time;
                  return (
                    <div
                      key={di}
                      onClick={() => setSelected(isSelected ? null : { day: di, time })}
                      className={`min-h-[60px] rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? "border-primary/50 bg-primary/10"
                          : cellPosts.length > 0
                          ? "border-border/40 bg-secondary/20"
                          : "border-border/20 bg-transparent hover:border-border/40 hover:bg-secondary/10"
                      }`}
                    >
                      {cellPosts.map((post, pi) => {
                        const ct = CONTENT_TYPES.find(c => c.type === post.type) ?? CONTENT_TYPES[0];
                        const Icon = ct.icon;
                        return (
                          <div
                            key={pi}
                            className={`m-1 p-1.5 rounded border ${ct.bg} border-transparent group relative`}
                            onClick={e => { e.stopPropagation(); }}
                          >
                            <Icon className={`h-3 w-3 ${ct.color} mb-0.5`} />
                            <p className={`text-[9px] font-semibold leading-tight ${ct.color}`}>{post.type}</p>
                            <p className={`text-[9px] ${PLATFORM_COLORS[post.platform]?.split(" ")[0] ?? "text-muted-foreground"}`}>{post.platform}</p>
                            <button
                              className="absolute top-0.5 right-0.5 h-3.5 w-3.5 rounded flex items-center justify-center bg-destructive/80 text-white opacity-0 group-hover:opacity-100 transition-opacity text-[8px]"
                              onClick={e => { e.stopPropagation(); removePost(post.day, post.time, post.type); }}
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}
                      {cellPosts.length === 0 && (
                        <div className="flex items-center justify-center h-full opacity-0 hover:opacity-100 transition-opacity">
                          <Plus className="h-3 w-3 text-muted-foreground/60" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {selected && (
          <Card className="border-primary/30 bg-primary/5 animate-in slide-in-from-bottom-4 duration-300">
            <CardContent className="p-4">
              <p className="text-sm font-semibold mb-3">Schedule content for {DAYS[selected.day]} at {selected.time}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                <div className="flex-1 min-w-[200px]">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Content Type</p>
                  <div className="flex flex-wrap gap-1.5">
                    {CONTENT_TYPES.map(ct => (
                      <button
                        key={ct.type}
                        onClick={() => setSelectedType(ct.type)}
                        className={`text-[10px] px-2 py-1 rounded border transition-all font-medium ${selectedType === ct.type ? "border-primary/50 bg-primary/15 text-primary" : "border-border/50 text-muted-foreground hover:border-border"}`}
                      >
                        {ct.type}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Platform</p>
                  <div className="flex flex-wrap gap-1.5">
                    {PLATFORMS.map(p => (
                      <button
                        key={p}
                        onClick={() => setSelectedPlatform(p)}
                        className={`text-[10px] px-2 py-1 rounded border transition-all font-medium ${selectedPlatform === p ? "border-primary/50 bg-primary/15 text-primary" : "border-border/50 text-muted-foreground hover:border-border"}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={addPost} className="h-8">
                  <Send className="h-3.5 w-3.5 mr-2" />
                  Add to Schedule
                </Button>
                <Button variant="ghost" size="sm" className="h-8" onClick={() => setSelected(null)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-border/50 bg-card/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Optimal Posting Times</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {OPTIMAL_TIMES.map(p => (
                <div key={p.platform} className="flex items-center gap-2">
                  <span className={`text-xs font-semibold w-20 ${p.color}`}>{p.platform}</span>
                  <div className="flex gap-1">
                    {p.times.map(t => (
                      <span key={t} className="text-[10px] bg-secondary/50 px-1.5 py-0.5 rounded text-muted-foreground">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/30">
            <CardContent className="p-4 flex flex-col items-center justify-center h-full gap-2 text-center">
              <Calendar className="h-7 w-7 text-primary" />
              <p className="text-sm font-semibold">{posts.length} posts scheduled</p>
              <p className="text-xs text-muted-foreground">this week</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/30">
            <CardContent className="p-4 flex flex-col justify-center h-full gap-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quick Actions</p>
              <Link href="/scripts">
                <Button variant="outline" size="sm" className="w-full text-xs h-8">
                  <Zap className="h-3 w-3 mr-1.5" /> Generate Scripts
                </Button>
              </Link>
              <Link href="/viral-hooks">
                <Button variant="outline" size="sm" className="w-full text-xs h-8">
                  <Flame className="h-3 w-3 mr-1.5" /> Write Hooks
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
