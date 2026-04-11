import { Layout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Zap, Crown, Check, Bell, Key, Moon, LogOut, User, CreditCard, Shield, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Settings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState({ tips: true, updates: true, promotions: false });

  return (
    <Layout>
      <div className="w-full max-w-3xl space-y-8 animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account, plan, and preferences.</p>
        </div>

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Profile</h2>
          </div>
          <Card className="border-border/50 bg-card/50">
            <CardContent className="pt-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Display Name</label>
                  <Input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} className="bg-background" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} className="bg-background" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" size="sm" disabled>Save Changes (Auth coming)</Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="border-border/40" />

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Billing & Subscription</h2>
            <Badge variant="outline" className="text-muted-foreground border-border/60 text-xs">Free Plan</Badge>
          </div>
          <Card className="border-border/50 bg-card/50">
            <CardContent className="pt-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Current Plan: Free</p>
                  <p className="text-sm text-muted-foreground">5 ideas/day · 3 bundles/day · 3 scripts/day</p>
                </div>
                <Link href="/pricing">
                  <Button size="sm" className="font-semibold">
                    <Crown className="h-4 w-4 mr-2 text-yellow-400" />
                    Upgrade to Pro
                  </Button>
                </Link>
              </div>
              <Separator className="border-border/30" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Billing History</p>
                  <p className="text-xs text-muted-foreground">Invoices and receipts</p>
                </div>
                <Button variant="outline" size="sm" disabled>Coming Soon</Button>
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
            <Key className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold">API Keys</h2>
            <Badge variant="outline" className="text-muted-foreground border-border/60 text-xs">Pro</Badge>
          </div>
          <Card className="border-border/50 bg-card/50">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Spark API Access</p>
                  <p className="text-xs text-muted-foreground">Automate Spark with your own integrations</p>
                </div>
                <Button variant="outline" size="sm" disabled>Requires Pro</Button>
              </div>
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
                  <p className="text-xs text-muted-foreground">Active — Spark runs in dark mode by default</p>
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
              <Button variant="outline" size="sm" className="gap-2">
                Privacy Policy <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <Link href="/trust">
              <Button variant="outline" size="sm" className="gap-2">
                Terms of Service <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <Link href="/trust">
              <Button variant="outline" size="sm" className="gap-2">
                Refund Policy <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </section>

        <div className="pt-2">
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2" disabled>
            <LogOut className="h-4 w-4" />
            Log Out (Auth coming)
          </Button>
        </div>
      </div>
    </Layout>
  );
}
