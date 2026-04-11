import { Layout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Zap, Crown, Check, Lock } from "lucide-react";

const freePlanFeatures = [
  "5 idea generations / day",
  "3 bundle builds / day",
  "3 TikTok scripts / day",
  "Save up to 10 ideas",
  "Standard AI model",
];

const proPlanFeatures = [
  "Unlimited idea generations",
  "Unlimited bundle builds",
  "Unlimited TikTok scripts",
  "Unlimited saved ideas",
  "Priority AI model (fastest)",
  "Digital product generator",
  "Brand builder",
  "Content planner",
  "Analytics dashboard",
  "A/B testing",
  "AI insights & recommendations",
];

export default function Settings() {
  return (
    <Layout>
      <div className="w-full max-w-4xl space-y-8 animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your plan and preferences.</p>
        </div>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Current Plan</h2>
            <Badge variant="outline" className="text-muted-foreground border-border/60">Free</Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-border/50 bg-card/50">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Free
                  </CardTitle>
                  <Badge className="bg-primary/20 text-primary border-0 hover:bg-primary/20">Current Plan</Badge>
                </div>
                <CardDescription className="text-2xl font-bold text-foreground pt-1">$0 / month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {freePlanFeatures.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-primary/40 bg-card/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-400" />
                    Pro
                  </CardTitle>
                  <Badge className="bg-yellow-400/15 text-yellow-400 border-0 hover:bg-yellow-400/15">Most Popular</Badge>
                </div>
                <CardDescription className="text-2xl font-bold text-foreground pt-1">
                  $29 / month
                  <span className="text-sm font-normal text-muted-foreground ml-2">or $197/year</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {proPlanFeatures.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-yellow-400 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
                <div className="pt-2">
                  <Button className="w-full font-semibold" size="sm">
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade to Pro
                    <Lock className="h-3.5 w-3.5 ml-2 opacity-60" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="border-border/40" />

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Account</h2>
          <Card className="border-border/50 bg-card/50">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Authentication</p>
                  <p className="text-sm text-muted-foreground">Sign in to sync your data and unlock Pro</p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Coming Soon
                </Button>
              </div>
              <Separator className="border-border/30" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Data Export</p>
                  <p className="text-sm text-muted-foreground">Download all your ideas and assets</p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </Layout>
  );
}
