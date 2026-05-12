import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";
import {
  Mail, MessageSquare, Send, Users, BarChart2, ArrowRight,
  CheckCircle2, Zap, TrendingUp, Clock, ShoppingCart, Heart
} from "lucide-react";
import { useState } from "react";

const TABS = ["Email", "SMS"];

const EMAIL_TEMPLATES = [
  {
    name: "Welcome Sequence",
    type: "Automation",
    subject: "You just made a great decision 👊",
    preview: "Here's exactly what's inside your new program — and how to get started in the next 15 minutes...",
    openRate: "48%",
    clickRate: "12%",
    tag: "Onboarding",
    color: "text-green-400",
    bg: "bg-green-400/10",
    icon: Heart,
  },
  {
    name: "Cart Recovery Email",
    type: "Automation",
    subject: "You left something behind…",
    preview: "Hey — I noticed you were checking out [product name] but didn't complete your purchase. Here's what you're missing...",
    openRate: "39%",
    clickRate: "8%",
    tag: "Recovery",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    icon: ShoppingCart,
  },
  {
    name: "Weekly Value Email",
    type: "Broadcast",
    subject: "3 things working right now in [niche]",
    preview: "Every week I share the 3 most effective strategies I've discovered. This week: the micro-transformation offer, pain-first content, and community upsells...",
    openRate: "34%",
    clickRate: "6%",
    tag: "Nurture",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    icon: TrendingUp,
  },
  {
    name: "Launch Sequence Email 1",
    type: "Campaign",
    subject: "Something big is coming [first name]...",
    preview: "I've been working on this for months. Before it goes live to the public, I wanted to give you first access...",
    openRate: "52%",
    clickRate: "18%",
    tag: "Launch",
    color: "text-red-400",
    bg: "bg-red-400/10",
    icon: Zap,
  },
];

const SMS_TEMPLATES = [
  {
    name: "Flash Sale Alert",
    body: "🔥 [First Name] — for the next 4 hours only, get [Product] for 40% off. This won't come back. Grab it here: [link]",
    ctr: "24%",
    tag: "Promotion",
  },
  {
    name: "Cart Recovery SMS",
    body: "Hey [First Name] — you left [Product] in your cart. Ready to finish? [link] Reply STOP to unsubscribe.",
    ctr: "18%",
    tag: "Recovery",
  },
  {
    name: "Content Drop Alert",
    body: "New post just dropped 🔥 You need to see this before you post anything this week: [link]",
    ctr: "21%",
    tag: "Engagement",
  },
];

const STATS = [
  { label: "Avg Open Rate", value: "43%", trend: "+5%", icon: Mail },
  { label: "Click Rate", value: "11%", trend: "+2%", icon: BarChart2 },
  { label: "Subscribers", value: "—", note: "Connect list", icon: Users },
];

export default function Performance() {
  const [tab, setTab] = useState("Email");
  const [composing, setComposing] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  return (
    <Layout>
      <div className="w-full max-w-5xl space-y-8 animate-in fade-in duration-500">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-9 w-9 rounded-xl bg-blue-400/10 flex items-center justify-center">
                <Mail className="h-5 w-5 text-blue-400" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Email / SMS</h1>
              <Badge variant="outline" className="border-orange-400/30 text-orange-400 text-[10px]">Labs</Badge>
            </div>
            <p className="text-muted-foreground text-sm">Campaigns, automations, and broadcast templates — ready to send.</p>
          </div>
          <Button onClick={() => setComposing(true)} className="shrink-0">
            <Send className="h-4 w-4 mr-2" /> Compose
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <Card key={i} className="border-border/50 bg-card/50">
                <CardContent className="p-4 text-center">
                  <Icon className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
                  <p className="text-2xl font-black">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  {s.trend && <p className="text-xs text-green-400 font-medium mt-0.5">{s.trend}</p>}
                  {s.note && <p className="text-xs text-primary/60 mt-0.5">{s.note}</p>}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {composing && (
          <Card className="border-primary/30 bg-primary/5 animate-in slide-in-from-top-2 duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">New {tab}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tab === "Email" && (
                <Input
                  placeholder="Subject line…"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="bg-background"
                />
              )}
              <Textarea
                placeholder={tab === "Email" ? "Write your email body…" : "Write your SMS (160 chars)…"}
                value={body}
                onChange={e => setBody(e.target.value)}
                className="bg-background resize-none h-32"
                maxLength={tab === "SMS" ? 160 : undefined}
              />
              {tab === "SMS" && (
                <p className="text-xs text-muted-foreground text-right">{body.length}/160</p>
              )}
              <div className="flex gap-2">
                <Button size="sm" disabled={!body.trim()}>
                  <Send className="h-3.5 w-3.5 mr-2" /> Save Draft
                </Button>
                <Button variant="ghost" size="sm" onClick={() => { setComposing(false); setSubject(""); setBody(""); }}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-2 border-b border-border/40 pb-0">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-all ${tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {t === "Email" ? <Mail className="h-4 w-4 inline mr-1.5" /> : <MessageSquare className="h-4 w-4 inline mr-1.5" />}
              {t}
            </button>
          ))}
        </div>

        {tab === "Email" && (
          <div className="space-y-4">
            {EMAIL_TEMPLATES.map((tpl, i) => {
              const Icon = tpl.icon;
              return (
                <Card key={i} className="border-border/50 hover:border-primary/20 transition-all bg-card/50 group">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${tpl.bg}`}>
                        <Icon className={`h-5 w-5 ${tpl.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-bold text-sm">{tpl.name}</h3>
                          <Badge variant="outline" className="text-[9px] h-4 border-border/50 text-muted-foreground">{tpl.type}</Badge>
                          <Badge variant="outline" className={`text-[9px] h-4 border-0 ${tpl.bg} ${tpl.color}`}>{tpl.tag}</Badge>
                        </div>
                        <p className="text-sm font-medium text-foreground/90 mb-1">{tpl.subject}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">{tpl.preview}</p>
                        <div className="flex items-center gap-4">
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" /> Open: <span className="font-semibold text-foreground">{tpl.openRate}</span>
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <BarChart2 className="h-3 w-3" /> Click: <span className="font-semibold text-foreground">{tpl.clickRate}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="shrink-0 h-8 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {tab === "SMS" && (
          <div className="space-y-4">
            {SMS_TEMPLATES.map((tpl, i) => (
              <Card key={i} className="border-border/50 hover:border-primary/20 transition-all bg-card/50 group">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-green-400/10 flex items-center justify-center shrink-0">
                    <MessageSquare className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-sm">{tpl.name}</h3>
                      <Badge variant="outline" className="text-[9px] h-4 border-green-400/30 text-green-400">{tpl.tag}</Badge>
                      <span className="text-xs text-muted-foreground ml-auto">CTR: <span className="font-semibold text-foreground">{tpl.ctr}</span></span>
                    </div>
                    <p className="text-sm text-muted-foreground font-mono leading-relaxed">{tpl.body}</p>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0 h-8 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    Use
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="border-border/40 bg-card/20 p-4">
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-primary shrink-0" />
            <p className="text-sm text-muted-foreground">Write custom email sequences with AI using the Command Center.</p>
            <Link href="/command" className="ml-auto shrink-0">
              <Button size="sm" variant="outline">
                Open Command Center <ArrowRight className="h-3.5 w-3.5 ml-2" />
              </Button>
            </Link>
          </div>
        </Card>

      </div>
    </Layout>
  );
}
