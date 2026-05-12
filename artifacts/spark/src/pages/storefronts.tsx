import { Layout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import {
  Globe, Zap, ArrowRight, CheckCircle2, Smartphone, Monitor,
  ShoppingCart, Star, MessageSquare, Crown, LayoutTemplate
} from "lucide-react";
import { useState } from "react";

const TEMPLATES = [
  {
    name: "Product Launch",
    desc: "High-converting launch page with countdown, benefits, and social proof.",
    tags: ["Launch", "Digital"],
    sections: ["Hero", "Benefits", "Testimonials", "FAQ", "CTA"],
    color: "border-red-400/30",
    bg: "bg-red-400/5",
    badge: "text-red-400 bg-red-400/10",
  },
  {
    name: "Course Sales Page",
    desc: "Full sales page structure for info products and online courses.",
    tags: ["Course", "Info Product"],
    sections: ["Hook", "Problem", "Solution", "Modules", "Bonuses", "Guarantee", "CTA"],
    color: "border-blue-400/30",
    bg: "bg-blue-400/5",
    badge: "text-blue-400 bg-blue-400/10",
  },
  {
    name: "Minimalist Offer",
    desc: "Clean, distraction-free page focused on a single offer and CTA.",
    tags: ["Simple", "Bundle"],
    sections: ["Headline", "Value Stack", "Price", "CTA"],
    color: "border-primary/30",
    bg: "bg-primary/5",
    badge: "text-primary bg-primary/10",
  },
  {
    name: "Lead Magnet",
    desc: "Capture emails with a compelling free offer. Fast, focused, frictionless.",
    tags: ["Email", "Free Offer"],
    sections: ["Headline", "Benefits", "Form", "Trust"],
    color: "border-green-400/30",
    bg: "bg-green-400/5",
    badge: "text-green-400 bg-green-400/10",
  },
];

const FEATURES = [
  "Mobile-first, responsive layout",
  "AI-generated copy from your offer",
  "Embedded payment / checkout link",
  "Custom domain support",
  "Analytics and conversion tracking",
];

export default function Storefronts() {
  const [productName, setProductName] = useState("");
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <Layout>
      <div className="w-full max-w-4xl space-y-8 animate-in fade-in duration-500">

        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-9 w-9 rounded-xl bg-blue-400/10 flex items-center justify-center">
              <Globe className="h-5 w-5 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Landing Pages</h1>
            <Badge variant="outline" className="border-orange-400/30 text-orange-400 text-[10px]">Labs</Badge>
          </div>
          <p className="text-muted-foreground text-sm">AI-generated sales pages. Pick a template, enter your product — SPARK writes the rest.</p>
        </div>

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-5">
            <p className="text-sm font-semibold mb-3">Start from your product</p>
            <div className="flex gap-2">
              <Input
                placeholder="e.g. 30-Day Fitness Transformation Guide"
                value={productName}
                onChange={e => setProductName(e.target.value)}
                className="bg-background flex-1"
              />
              <Link href={`/bundle?title=${encodeURIComponent(productName)}`}>
                <Button disabled={!productName.trim()} className="shrink-0">
                  <Zap className="h-4 w-4 mr-2" />
                  Generate Page
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div>
          <p className="text-sm font-semibold mb-3">Or choose a template</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TEMPLATES.map((t, i) => (
              <div
                key={i}
                onClick={() => setSelected(i === selected ? null : i)}
                className={`cursor-pointer rounded-xl border p-5 transition-all ${selected === i ? t.color + " " + t.bg : "border-border/50 bg-card/50 hover:border-border"}`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex gap-1.5 mb-2 flex-wrap">
                      {t.tags.map(tag => (
                        <span key={tag} className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${t.badge}`}>{tag}</span>
                      ))}
                    </div>
                    <h3 className="font-bold text-sm">{t.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{t.desc}</p>
                  </div>
                  {selected === i && <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />}
                </div>
                <div className="flex flex-wrap gap-1">
                  {t.sections.map(s => (
                    <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-secondary/50 text-muted-foreground">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selected !== null && (
          <Card className="border-primary/30 bg-primary/5 animate-in slide-in-from-bottom-2 duration-300">
            <CardContent className="p-5 flex items-center gap-4">
              <LayoutTemplate className="h-8 w-8 text-primary shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-sm">{TEMPLATES[selected].name} selected</p>
                <p className="text-xs text-muted-foreground">Includes {TEMPLATES[selected].sections.length} sections. Add your product name to generate copy.</p>
              </div>
              <Button disabled={!productName.trim()} className="shrink-0">
                Build Page <ArrowRight className="h-3.5 w-3.5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="border-border/50 bg-card/30">
            <CardContent className="p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">What's included</p>
              <div className="space-y-2">
                {FEATURES.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="text-muted-foreground">{f}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/30">
            <CardContent className="p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Preview</p>
              <div className="flex gap-3">
                <div className="flex-1 h-24 rounded-lg border border-border/50 bg-secondary/20 flex flex-col items-center justify-center gap-1">
                  <Monitor className="h-5 w-5 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">Desktop</span>
                </div>
                <div className="w-16 h-24 rounded-lg border border-border/50 bg-secondary/20 flex flex-col items-center justify-center gap-1">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">Mobile</span>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">Preview available after generation.</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5">
          <div className="flex items-center gap-3">
            <Crown className="h-7 w-7 text-yellow-400 shrink-0" />
            <div>
              <p className="font-bold text-sm">Full page builder available in Pro</p>
              <p className="text-xs text-muted-foreground">Custom domains, live editing, conversion analytics, and Stripe checkout integration.</p>
            </div>
            <Link href="/pricing" className="ml-auto shrink-0">
              <Button size="sm">Unlock Pro</Button>
            </Link>
          </div>
        </Card>

      </div>
    </Layout>
  );
}
