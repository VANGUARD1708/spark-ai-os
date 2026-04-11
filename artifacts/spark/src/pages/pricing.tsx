import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Zap, Crown, ArrowRight } from "lucide-react";

const FREE_FEATURES = [
  "5 idea generations per day",
  "3 bundle builds per day",
  "3 TikTok scripts per day",
  "5 viral hook sets per day",
  "Save up to 10 ideas",
  "7-day content planner",
  "Standard AI model",
  "Community support",
];

const PRO_FEATURES = [
  "Unlimited idea generations",
  "Unlimited bundle builds",
  "Unlimited TikTok scripts",
  "Unlimited viral hooks",
  "Unlimited saved ideas",
  "Priority AI model (fastest)",
  "Brand builder",
  "Digital product generator",
  "Storefront builder",
  "Content calendar with reminders",
  "Distribution Hub (all channels)",
  "Analytics dashboard",
  "A/B testing",
  "AI insights & recommendations",
  "API access",
  "Priority support",
];

const FAQ = [
  {
    q: "Can I upgrade or downgrade anytime?",
    a: "Yes. You can upgrade to Pro at any time and downgrade back to Free whenever you want. No lock-in."
  },
  {
    q: "What happens to my saved ideas if I downgrade?",
    a: "Your data is always preserved. You just won't be able to save new ones beyond the Free limit until you upgrade."
  },
  {
    q: "Is there a free trial for Pro?",
    a: "The Free plan is your trial — use the core features and upgrade when you're ready to scale."
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards. Stripe powers our billing, so your payment is fully secure."
  },
];

export default function Pricing() {
  return (
    <Layout>
      <div className="w-full max-w-4xl space-y-12 animate-in fade-in duration-500">
        <div className="text-center space-y-3">
          <Badge variant="outline" className="text-muted-foreground border-border/60">Pricing</Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Simple, honest pricing</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Start free, scale when you're ready. No hidden fees, no surprises.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">Free</CardTitle>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-black">$0</span>
                <span className="text-muted-foreground mb-1">/ month</span>
              </div>
              <CardDescription className="text-sm">Perfect for getting started and validating your first ideas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {FREE_FEATURES.map(f => (
                <div key={f} className="flex items-center gap-2.5 text-sm">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
              <div className="pt-2">
                <Button variant="outline" className="w-full" disabled>Current Plan</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/40 bg-card/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-400" />
                  <CardTitle className="text-xl">Pro</CardTitle>
                </div>
                <Badge className="bg-yellow-400/15 text-yellow-400 border-0">Most Popular</Badge>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-black">$29</span>
                <span className="text-muted-foreground mb-1">/ month</span>
              </div>
              <div className="text-sm text-muted-foreground">or <span className="text-foreground font-semibold">$197/year</span> — save $151</div>
            </CardHeader>
            <CardContent className="space-y-3">
              {PRO_FEATURES.map(f => (
                <div key={f} className="flex items-center gap-2.5 text-sm">
                  <Check className="h-4 w-4 text-yellow-400 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
              <div className="pt-3 space-y-2">
                <Button className="w-full font-bold h-11" disabled>
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Pro — $29/mo
                </Button>
                <Button variant="ghost" className="w-full text-sm text-muted-foreground" disabled>
                  Annual plan — $197/year
                </Button>
                <p className="text-center text-xs text-muted-foreground">Billing integration coming soon</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-center">Frequently Asked Questions</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {FAQ.map((item) => (
              <div key={item.q} className="p-5 rounded-xl border border-border/50 bg-card/30 space-y-2">
                <h3 className="font-semibold text-sm">{item.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center p-8 rounded-2xl bg-primary/5 border border-primary/20">
          <h3 className="text-xl font-bold mb-2">Ready to build something that sells?</h3>
          <p className="text-muted-foreground mb-6 text-sm">Start free today. No credit card required.</p>
          <a href="/ideas">
            <Button size="lg" className="font-bold px-8">
              Start for Free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>
    </Layout>
  );
}
