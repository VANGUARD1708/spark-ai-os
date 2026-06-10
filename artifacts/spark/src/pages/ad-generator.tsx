import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import {
  Layers, Sparkles, Copy, Check, Megaphone, Flame,
  Target, Zap, Wand2, Eye, MousePointer, ShoppingBag
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdVariant {
  id: number;
  headline: string;
  body: string;
  cta: string;
  hook: string;
  platform: string;
  estimatedCtr: string;
}

const AD_TEMPLATES: Record<string, string[]> = {
  "TikTok": [
    "Stop scrolling. This is the one thing that changes everything.",
    "POV: You finally found the shortcut everyone else is missing.",
    "3 seconds in and you'll already know this is different.",
  ],
  "Instagram": [
    "The method nobody talks about (but everyone needs).",
    "If you're tired of the same advice, this is for you.",
    "Swipe to see what happens in 30 days.",
  ],
  "Facebook": [
    "I spent 6 months figuring this out. Now it takes 30 minutes.",
    "The #1 mistake holding back 90% of creators.",
    "What if the thing you're avoiding is the exact thing you need?",
  ],
  "Google": [
    "The Complete Guide to Scaling Your Creator Business",
    "Stop Guessing. Start Growing. The Proven Method Inside.",
    "What 10,000+ Creators Use to Build Income Streams.",
  ],
};

const CTAS = [
  "Get instant access",
  "Start your free trial",
  "Join 10,000+ creators",
  "Download the blueprint",
  "Claim your spot",
  "See how it works",
];

const BODY_TEMPLATES = [
  "No fluff. No theory. Just the exact framework that took creators from $0 to $10K/month. Inside: the 5-step system, the hook formula, and the offer structure that actually converts.",
  "Most creators burn out because they build the wrong thing first. Here's the sequence that saves 6 months of wasted effort: validate, then build, then scale. The complete playbook inside.",
  "The problem isn't your content. It's your offer. 73% of creators who fix this one thing see revenue within 30 days. Here's the exact checklist to find yours.",
  "You don't need more followers. You need a better system. This is the same framework used by creators earning 6 figures. Works for any niche, any platform, any starting point.",
];

const PLATFORMS = [
  { id: "TikTok", label: "TikTok", icon: Flame, color: "text-pink-400", bg: "bg-pink-400/10", border: "border-pink-400/20" },
  { id: "Instagram", label: "Instagram", icon: Eye, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" },
  { id: "Facebook", label: "Facebook", icon: Target, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
  { id: "Google", label: "Google", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
];

function generateAdVariants(product: string, niche: string, platform: string, count: number): AdVariant[] {
  const hooks = AD_TEMPLATES[platform] || AD_TEMPLATES["TikTok"];
  const variants: AdVariant[] = [];
  for (let i = 0; i < count; i++) {
    const hook = hooks[i % hooks.length].replace("this", product).replace("the one thing", product);
    const body = BODY_TEMPLATES[i % BODY_TEMPLATES.length].replace("creators", `${niche} creators`).replace("Your niche", niche);
    const cta = CTAS[i % CTAS.length];
    const headline = hook.length > 60 ? hook.slice(0, 57) + "..." : hook;
    const ctrs = ["2.1%", "3.4%", "1.8%", "4.2%", "2.8%", "3.1%"];
    variants.push({
      id: i + 1,
      headline,
      body,
      cta,
      hook,
      platform,
      estimatedCtr: ctrs[i % ctrs.length],
    });
  }
  return variants;
}

export default function AdGenerator() {
  const { toast } = useToast();
  const [product, setProduct] = useState("");
  const [niche, setNiche] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("TikTok");
  const [generating, setGenerating] = useState(false);
  const [variants, setVariants] = useState<AdVariant[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"ads" | "copy" | "headlines">("ads");

  const handleGenerate = () => {
    if (!product.trim()) {
      toast({ title: "Enter a product name", variant: "destructive" });
      return;
    }
    setGenerating(true);
    setTimeout(() => {
      const ads = generateAdVariants(product, niche || "creator", selectedPlatform, 4);
      setVariants(ads);
      setGenerating(false);
      toast({ title: `Generated ${ads.length} ad variants` });
    }, 1200);
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({ title: "Copied to clipboard" });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Layout>
      <div className="w-full max-w-5xl space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-9 w-9 rounded-xl bg-orange-400/10 flex items-center justify-center">
                <Megaphone className="h-5 w-5 text-orange-400" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Ad Generator</h1>
              <Badge className="bg-orange-400/15 text-orange-400 border-0 text-[10px]">AI Powered</Badge>
            </div>
            <p className="text-muted-foreground text-sm">Generate scroll-stopping ad copy, headlines, and CTAs for any platform.</p>
          </div>
        </div>

        {/* Input Panel */}
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-6 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product / Offer</label>
                <Input
                  placeholder="e.g. 30-Day Fitness Transformation"
                  value={product}
                  onChange={e => setProduct(e.target.value)}
                  className="bg-background/50 border-border/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Niche (optional)</label>
                <Input
                  placeholder="e.g. fitness, beauty, tech"
                  value={niche}
                  onChange={e => setNiche(e.target.value)}
                  className="bg-background/50 border-border/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Platform</label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map(p => {
                  const Icon = p.icon;
                  const active = selectedPlatform === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPlatform(p.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                        active
                          ? `${p.bg} ${p.color} ${p.border}`
                          : "border-border/40 text-muted-foreground hover:border-border/60 hover:bg-secondary/30"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={handleGenerate} disabled={generating || !product.trim()} className="font-semibold">
                {generating ? (
                  <>
                    <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Ads
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => { setProduct(""); setNiche(""); setVariants([]); }}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Tabs */}
        {variants.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("ads")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "ads" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary/50"
                }`}
              >
                Full Ad Variants
              </button>
              <button
                onClick={() => setActiveTab("headlines")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "headlines" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary/50"
                }`}
              >
                Headlines Only
              </button>
              <button
                onClick={() => setActiveTab("copy")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "copy" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary/50"
                }`}
              >
                Body Copy
              </button>
            </div>

            {activeTab === "ads" && (
              <div className="grid gap-4">
                {variants.map((v, i) => (
                  <Card key={v.id} className="border-border/50 bg-card/50 hover:border-primary/20 transition-colors">
                    <CardContent className="p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">{i + 1}</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold">Variant {i + 1}</p>
                            <p className="text-[10px] text-muted-foreground">{v.platform} Ad</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-400/10 text-green-400 text-[10px]">
                            <MousePointer className="h-3 w-3 mr-1" />
                            Est. CTR {v.estimatedCtr}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => copyToClipboard(`${v.headline}\n\n${v.body}\n\n${v.cta}`, v.id)}
                          >
                            {copiedId === v.id ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Hook</p>
                          <p className="text-sm font-semibold">{v.hook}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Headline</p>
                          <p className="text-sm font-semibold">{v.headline}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Body</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">{v.body}</p>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
                          <p className="text-sm font-semibold text-primary">{v.cta}</p>
                          <ShoppingBag className="h-4 w-4 text-primary/50" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === "headlines" && (
              <div className="grid gap-3">
                {variants.map((v, i) => (
                  <div key={v.id} className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card/50 hover:border-primary/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-muted-foreground">{i + 1}</span>
                      <p className="text-sm font-medium">{v.headline}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => copyToClipboard(v.headline, v.id + 100)}
                    >
                      {copiedId === v.id + 100 ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "copy" && (
              <div className="grid gap-3">
                {variants.map((v, i) => (
                  <Card key={v.id} className="border-border/50 bg-card/50">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">Variant {i + 1}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => copyToClipboard(v.body, v.id + 200)}
                        >
                          {copiedId === v.id + 200 ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{v.body}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {variants.length === 0 && !generating && (
          <Card className="border-border/50 bg-card/30">
            <CardContent className="p-12 text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                <Layers className="h-8 w-8 text-primary/50" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Generate your first ad</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                  Enter your product name, pick a platform, and SPARK will generate 4 ad variants with hooks, headlines, body copy, and CTAs.
                </p>
              </div>
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Flame className="h-3 w-3 text-pink-400" /> TikTok</span>
                <span className="flex items-center gap-1"><Eye className="h-3 w-3 text-purple-400" /> Instagram</span>
                <span className="flex items-center gap-1"><Target className="h-3 w-3 text-blue-400" /> Facebook</span>
                <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-yellow-400" /> Google</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
