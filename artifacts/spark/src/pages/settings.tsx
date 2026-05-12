import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Zap, Crown, Check, Bell, Key, Moon, LogOut, User, CreditCard,
  Shield, ExternalLink, Brain, BarChart2, TrendingUp, Lightbulb,
  Flame, Globe, Code, ArrowRight
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { useUser, useClerk, Show } from "@clerk/react";
import { useGetAnalytics, getGetAnalyticsQueryKey } from "@workspace/api-client-react";

const INTEGRATIONS = [
  { name: "Zapier", desc: "Automate workflows", icon: "⚡" },
  { name: "Shopify", desc: "Sync products and orders", icon: "🛍️" },
  { name: "Discord", desc: "Community notifications", icon: "💬" },
  { name: "Notion", desc: "Export to your workspace", icon: "📝" },
  { name: "Google Sheets", desc: "Sync analytics data", icon: "📊" },
];

const USAGE_LIMITS = [
  { label: "Idea generations", used: 3, total: 5, color: "bg-yellow-400" },
  { label: "Bundle builds", used: 1, total: 3, color: "bg-blue-400" },
  { label: "TikTok scripts", used: 2, total: 3, color: "bg-pink-400" },
  { label: "Trend scans", used: 2, total: 5, color: "bg-red-400" },
  { label: "Saved assets", used: 4, total: 10, color: "bg-primary" },
];

export default function Settings() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [notifications, setNotifications] = useState({ tips: true, updates: true, promotions: false });
  const { data: analytics } = useGetAnalytics(
    { days: 30 },
    { query: { queryKey: getGetAnalyticsQueryKey({ days: 30 }) } }
  );

  const topType = analytics?.generationsByType?.[0]?.type;
  const totalGenerations = analytics?.totalGenerations ?? 0;

  return (
    <Layout>
      <div className="w-full max-w-3xl space-y-8 animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">Your account, plan, and preferences.</p>
        </div>

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Profile</h2>
          </div>
          <Card className="border-border/50 bg-card/50">
            <CardContent className="pt-5 space-y-4">
              <Show when="signed-in">
                <div className="flex items-center gap-4 p-3 rounded-xl bg-primary/5 border border-primary/20">
                  {user?.imageUrl ? (
                    <img src={user.imageUrl} className="h-12 w-12 rounded-full object-cover" alt="Avatar" />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{user?.fullName || user?.username || "SPARK User"}</p>
                    <p className="text-sm text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
                  </div>
                  <Badge className="ml-auto bg-primary/15 text-primary border-0 text-xs">Free Plan</Badge>
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2"
                    onClick={() => signOut({ redirectUrl: "/" })}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </Show>
              <Show when="signed-out">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Not signed in</p>
                    <p className="text-sm text-muted-foreground">Sign in to save your work and unlock all features.</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/sign-in">
                      <Button variant="outline" size="sm">Sign In</Button>
                    </Link>
                    <Link href="/sign-up">
                      <Button size="sm">Create Account</Button>
                    </Link>
                  </div>
                </div>
              </Show>
            </CardContent>
          </Card>
        </section>

        <Separator className="border-border/40" />

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Account Intelligence</h2>
          </div>
          <Card className="border-border/50 bg-card/50">
            <CardContent className="pt-5 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: "Generations (30d)", value: totalGenerations.toString(), icon: Zap, color: "text-primary" },
                  { label: "Top content type", value: topType ? topType.charAt(0).toUpperCase() + topType.slice(1) : "—", icon: TrendingUp, color: "text-green-400" },
                  { label: "Saved assets", value: String((analytics?.savedAssets?.ideas ?? 0) + (analytics?.savedAssets?.bundles ?? 0) + (analytics?.savedAssets?.scripts ?? 0)), icon: Lightbulb, color: "text-yellow-400" },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="p-3 rounded-xl bg-secondary/20 border border-border/30 text-center">
                      <Icon className={`h-4 w-4 mx-auto mb-1.5 ${stat.color}`} />
                      <p className="text-xl font-bold">{stat.value}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
              {topType && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <Flame className="h-4 w-4 text-primary shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    Your best-performing content type this period:{" "}
                    <span className="text-foreground font-semibold capitalize">{topType}</span>.
                    Create more of it to compound your results.
                  </p>
                </div>
              )}
              <Link href="/analytics">
                <Button variant="outline" size="sm" className="w-full">
                  <BarChart2 className="h-4 w-4 mr-2" /> View Full Analytics
                  <ArrowRight className="h-3.5 w-3.5 ml-auto" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>

        <Separator className="border-border/40" />

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Billing & Usage</h2>
            <Badge variant="outline" className="text-muted-foreground border-border/60 text-xs">Free Plan</Badge>
          </div>
          <Card className="border-border/50 bg-card/50">
            <CardContent className="pt-5 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Current Plan: Free</p>
                  <p className="text-sm text-muted-foreground">Resets daily at midnight UTC.</p>
                </div>
                <Link href="/pricing">
                  <Button size="sm" className="font-semibold">
                    <Crown className="h-4 w-4 mr-2 text-yellow-400" />
                    Upgrade to Pro
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                {USAGE_LIMITS.map((item) => {
                  const pct = (item.used / item.total) * 100;
                  return (
                    <div key={item.label} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className={`font-semibold ${pct >= 80 ? "text-red-400" : "text-foreground"}`}>
                          {item.used}/{item.total} used today
                        </span>
                      </div>
                      <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.color} transition-all`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-3 rounded-lg bg-yellow-400/5 border border-yellow-400/20">
                <p className="text-xs text-yellow-400 font-medium">Pro removes all daily limits — unlimited generations, scans, and saves.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="border-border/40" />

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold">SPARK API Access</h2>
            <Badge variant="outline" className="text-yellow-400 border-yellow-400/30 text-xs">Pro</Badge>
          </div>
          <Card className="border-border/50 bg-card/50">
            <CardContent className="pt-5 space-y-4">
              <div>
                <p className="font-medium text-sm mb-1">Build custom workflows and connect SPARK to your tools.</p>
                <p className="text-xs text-muted-foreground">Use the SPARK API to automate content generation, read your analytics, and integrate with any platform.</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" className="gap-2">
                  <Code className="h-3.5 w-3.5" /> View Documentation
                  <ExternalLink className="h-3 w-3" />
                </Button>
                <Link href="/pricing">
                  <Button size="sm" className="gap-2">
                    <Crown className="h-3.5 w-3.5 text-yellow-400" /> Unlock API Access
                  </Button>
                </Link>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Connect to your favorite tools</p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {INTEGRATIONS.map((intg) => (
                    <div key={intg.name} className="flex flex-col items-center gap-1 p-2.5 rounded-lg border border-border/40 bg-secondary/20 opacity-60">
                      <span className="text-xl">{intg.icon}</span>
                      <span className="text-[10px] font-medium text-center">{intg.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="border-border/40" />

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
          <Card className="border-border/50 bg-card/50">
            <CardContent className="pt-5 space-y-4">
              {[
                { key: "tips" as const, label: "Tips & tutorials", desc: "Weekly tips to help you earn more" },
                { key: "updates" as const, label: "Product updates", desc: "New features and improvements" },
                { key: "promotions" as const, label: "Promotions", desc: "Special offers and discounts" },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                    className={`h-6 w-11 rounded-full transition-colors relative ${notifications[item.key] ? "bg-primary" : "bg-secondary"}`}
                  >
                    <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${notifications[item.key] ? "left-5" : "left-0.5"}`} />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <Separator className="border-border/40" />

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Appearance</h2>
          </div>
          <Card className="border-border/50 bg-card/50">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">Active — SPARK runs in dark mode by default</p>
                </div>
                <div className="h-6 w-11 rounded-full bg-primary relative cursor-default">
                  <div className="absolute top-0.5 left-5 h-5 w-5 rounded-full bg-white shadow" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="border-border/40" />

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Legal</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/trust">
              <Button variant="outline" size="sm" className="gap-2">Privacy Policy <ExternalLink className="h-3.5 w-3.5" /></Button>
            </Link>
            <Link href="/trust">
              <Button variant="outline" size="sm" className="gap-2">Terms of Service <ExternalLink className="h-3.5 w-3.5" /></Button>
            </Link>
            <Link href="/trust">
              <Button variant="outline" size="sm" className="gap-2">Refund Policy <ExternalLink className="h-3.5 w-3.5" /></Button>
            </Link>
          </div>
        </section>

      </div>
    </Layout>
  );
}
