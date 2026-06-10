import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  HelpCircle, X, ArrowRight, Sparkles, Zap, Lightbulb,
  TrendingUp, Trophy, Compass, Package, Palette, Video,
  Flame, Megaphone, BarChart2, FlaskConical, Activity,
  Brain, Rocket, Target, Radar, Layers, Send, Clock, Radio,
  Globe, Bookmark, FolderOpen, Bot, Search, Users, Crown,
  Settings, LineChart, Dna
} from "lucide-react";

interface PageGuideInfo {
  title: string;
  purpose: string;
  why: string;
  what: string;
  example: string;
  next: string;
  nextHref: string;
  icon: React.ElementType;
  color: string;
}

const PAGE_GUIDES: Record<string, PageGuideInfo> = {
  "/ideas": {
    title: "Idea Generator",
    purpose: "Turn raw thoughts into validated product opportunities.",
    why: "Most businesses fail because they build what nobody wants. This finds what people are already searching for.",
    what: "SPARK analyzes your niche and generates product ideas with demand scores, competition levels, and profit potential.",
    example: '"Teacher creators turning classroom moments into TikTok" \u2192 3 product ideas with 85+ demand scores and monetization paths.',
    next: "Build an offer around your best idea",
    nextHref: "/bundle",
    icon: Lightbulb,
    color: "text-yellow-400",
  },
  "/trending": {
    title: "Trend Radar",
    purpose: "Find fast-growing opportunities before they become crowded.",
    why: "Early trends are easier to grow and monetize. Late trends fight for attention.",
    what: "SPARK scans platform signals to identify emerging niches with growth rates, search volume, and difficulty ratings.",
    example: '"AI meal planning for busy professionals" \u2192 +312% growth, 2.1M searches/mo, Low difficulty.',
    next: "Build a brand around this trend",
    nextHref: "/brand-builder",
    icon: Radar,
    color: "text-primary",
  },
  "/winning": {
    title: "Winning Products",
    purpose: "See what's actually selling right now with demand and margin data.",
    why: "Data beats guessing. These products have proven demand, not just hype.",
    what: "AI analyzes 2025 market signals to surface 8 product opportunities ranked by demand, saturation, and profit margin.",
    example: '"AI Client Onboarding Suite" \u2192 92 demand score, 95% margin, Low saturation, $47-$127 price range.',
    next: "Build your offer",
    nextHref: "/bundle",
    icon: Trophy,
    color: "text-yellow-400",
  },
  "/bundle": {
    title: "Bundle Builder",
    purpose: "Craft an irresistible offer from any product idea.",
    why: "A great offer converts 3x better than a product listing. Price psychology + bonuses = sales.",
    what: "SPARK builds your product title, pricing, bonuses, urgency, and guarantee from a single idea.",
    example: '"Teacher Creator Toolkit" \u2192 $97 offer with 6 bonuses, scarcity timer, and 30-day guarantee.',
    next: "Create viral content to promote it",
    nextHref: "/viral-hooks",
    icon: Package,
    color: "text-primary",
  },
  "/brand-builder": {
    title: "Brand Builder",
    purpose: "Generate a complete brand identity from one prompt.",
    why: "Strong brands command premium pricing. Weak brands compete on price.",
    what: "SPARK creates your brand name, slogan, color palette, typography, voice, and positioning.",
    example: '"Bold fitness brand for busy moms" \u2192 "STRONGHER" with electric lime palette, empowering voice, and gym-free positioning.',
    next: "Create content that matches your brand voice",
    nextHref: "/scripts",
    icon: Palette,
    color: "text-purple-400",
  },
  "/viral-hooks": {
    title: "Viral Hooks",
    purpose: "Write scroll-stopping opening lines for any content.",
    why: "The first 3 seconds decide if someone watches. 80% of viewers drop in the first second.",
    what: "SPARK generates 5 hook variants for your product using curiosity gaps, specificity, and emotional triggers.",
    example: '"I made $12K in 30 days using a tool most creators ignore" \u2192 Pattern: numbers + curiosity + authority.',
    next: "Build a full TikTok script",
    nextHref: "/scripts",
    icon: Flame,
    color: "text-orange-400",
  },
  "/scripts": {
    title: "TikTok Scripts",
    purpose: "Generate full video scripts with structure, hooks, and CTAs.",
    why: "Structure beats talent. A well-structured script keeps viewers watching and clicking.",
    what: "SPARK writes your hook, body, transition, CTA, and caption — optimized for your niche and product.",
    example: '"60-second script for fitness meal planner" \u2192 Hook + problem + solution + proof + CTA + trending audio.',
    next: "Schedule your campaign",
    nextHref: "/campaigns",
    icon: Video,
    color: "text-pink-400",
  },
  "/campaigns": {
    title: "Campaign Manager",
    purpose: "Plan, organize, and launch your marketing campaigns.",
    why: "Random posting doesn't scale. Campaigns create consistent momentum.",
    what: "Create campaign plans, track channels, set launch dates, and measure results.",
    example: '"Summer Launch" \u2192 5 posts across TikTok, IG, Email with scheduled dates and metrics.',
    next: "Check your analytics",
    nextHref: "/analytics",
    icon: Megaphone,
    color: "text-green-400",
  },
  "/publish": {
    title: "AI Recommendations",
    purpose: "Get personalized growth actions based on your actual activity.",
    why: "Generic advice doesn't help. SPARK knows what you've built and what you haven't.",
    what: "SPARK analyzes your generations, saves, and content to recommend your next best move.",
    example: '"You have 3 ideas but 0 scripts. Your next move: create TikTok content for your top idea."',
    next: "Create content for your top idea",
    nextHref: "/scripts",
    icon: Activity,
    color: "text-primary",
  },
  "/analytics": {
    title: "Analytics",
    purpose: "Track what you're building and how you're growing.",
    why: "You can't improve what you don't measure. Data turns guessing into decisions.",
    what: "See generation counts, saved assets, top niches, and daily activity trends.",
    example: '"12 generations this week, top niche: fitness, 3 scripts saved" \u2192 Insight: double down on fitness content.',
    next: "Get AI recommendations for your next move",
    nextHref: "/publish",
    icon: BarChart2,
    color: "text-blue-400",
  },
  "/command": {
    title: "Command Center",
    purpose: "Ask SPARK anything and get instant answers.",
    why: "Sometimes you need a specific answer, not a whole page. This is your AI assistant.",
    what: "Type any question about business, content, or strategy. SPARK responds with context-aware answers.",
    example: '"How do I price my course?" \u2192 Pricing psychology, anchor points, and 3 pricing tiers with rationale.',
    next: "Build whatever SPARK suggested",
    nextHref: "/bundle",
    icon: Zap,
    color: "text-primary",
  },
  "/business-profile": {
    title: "Business Memory",
    purpose: "Tell SPARK about your business once. It uses it everywhere.",
    why: "No more repeating your niche. SPARK auto-injects your context into every generation.",
    what: "Save your business name, niche, audience, brand voice, top product, and goals.",
    example: '"Fitness brand for busy moms" \u2192 Every idea, script, and hook is now targeted to that audience.',
    next: "Generate ideas for your niche",
    nextHref: "/ideas",
    icon: Brain,
    color: "text-purple-400",
  },
  "/insights": {
    title: "Market Signals",
    purpose: "Get AI-analyzed market intelligence and trend signals.",
    why: "Markets shift fast. Signals tell you what's changing before it becomes obvious.",
    what: "SPARK surfaces real-time signals about audience behavior, platform shifts, and monetization opportunities.",
    example: '"Audience craving simplicity" \u2192 3.4x better engagement with "1 thing, not 10 things" content.',
    next: "Generate hooks using this signal",
    nextHref: "/viral-hooks",
    icon: Target,
    color: "text-blue-400",
  },
  "/storefronts": {
    title: "Landing Pages",
    purpose: "Build high-converting landing pages from proven templates.",
    why: "Your landing page is your storefront. A good one converts 3x better.",
    what: "Browse templates, customize sections, and export your landing page structure.",
    example: '"Product Launch" template \u2192 Hero + Benefits + Testimonials + FAQ + CTA.',
    next: "Build an offer for this page",
    nextHref: "/bundle",
    icon: Globe,
    color: "text-green-400",
  },
  "/content-planner": {
    title: "Ad Generator",
    purpose: "Plan and generate content across all your channels.",
    why: "Consistent posting beats sporadic posting. A plan keeps you consistent.",
    what: "Create 7-day content calendars with AI-generated ideas for each day.",
    example: '"Fitness niche" \u2192 Mon-TikTok Hook, Tue-Educational, Wed-BTS, Thu-Testimonial, Fri-Demo.',
    next: "Generate hooks for the first post",
    nextHref: "/viral-hooks",
    icon: Layers,
    color: "text-orange-400",
  },
  "/performance": {
    title: "Email / SMS",
    purpose: "Create high-converting email and SMS campaigns.",
    why: "Email converts 40x better than social. SMS opens at 98%. Own your channel.",
    what: "Write welcome sequences, cart recovery, launch emails, and SMS blasts.",
    example: '"Welcome Sequence" \u2192 48% open rate, 12% click rate. 3 emails over 5 days.',
    next: "Build a campaign to promote this sequence",
    nextHref: "/campaigns",
    icon: Send,
    color: "text-blue-400",
  },
  "/compose": {
    title: "Publish Composer",
    purpose: "Create and publish multi-channel campaigns in one place.",
    why: "Cross-posting manually wastes time. Composer lets you plan once, publish everywhere.",
    what: "Write captions, select channels, set pricing, and publish to campaigns.",
    example: '"Summer Launch" \u2192 TikTok + Instagram + X with unique captions per platform.',
    next: "Check your campaign progress",
    nextHref: "/campaigns",
    icon: Send,
    color: "text-green-400",
  },
  "/schedule": {
    title: "Scheduling",
    purpose: "Plan when to post for maximum engagement.",
    why: "Posting at the right time increases reach by 2-3x. Timing matters.",
    what: "Drag content onto a calendar, see optimal times per platform, and schedule your week.",
    example: '"TikTok at 6PM, Instagram at 12PM, YouTube at 3PM" \u2192 40% higher average engagement.',
    next: "Set up automations for recurring posts",
    nextHref: "/distribute",
    icon: Clock,
    color: "text-yellow-400",
  },
  "/distribute": {
    title: "Automations",
    purpose: "Set up automated workflows that run while you sleep.",
    why: "Manual work doesn't scale. Automations handle repetitive tasks.",
    what: "Create trigger-based workflows: welcome sequences, follow-ups, cart recovery.",
    example: '"New subscriber \u2192 Welcome email \u2192 Day 3: Value email \u2192 Day 5: Offer email"',
    next: "Track how your automations perform",
    nextHref: "/analytics",
    icon: Radio,
    color: "text-primary",
  },
  "/ab-testing": {
    title: "A/B Testing",
    purpose: "Test what works and double down on winners.",
    why: "Guessing is expensive. Testing removes the guesswork.",
    what: "Compare hooks, CTAs, pricing, and landing pages. See which variant wins.",
    example: '"Hook A: Question" vs "Hook B: Statement" \u2192 Hook B wins with +38% CTR.',
    next: "Generate more variants of your winning hook",
    nextHref: "/viral-hooks",
    icon: FlaskConical,
    color: "text-orange-400",
  },
  "/orders": {
    title: "Revenue Forecast",
    purpose: "Predict your revenue based on your content output.",
    why: "You can't scale what you don't forecast. Data-driven planning beats hoping.",
    what: "Choose a scenario and see projected revenue, CAC, LTV, and conversion rates.",
    example: '"Moderate scenario" \u2192 $42K in 6 months with daily posting + 500 email list.',
    next: "Build a campaign to hit your forecast",
    nextHref: "/campaigns",
    icon: TrendingUp,
    color: "text-green-400",
  },
  "/creator-dna": {
    title: "Creator DNA",
    purpose: "Discover your natural creator archetype based on your behavior.",
    why: "Knowing your strengths helps you double down on what works instead of fixing what doesn't.",
    what: "SPARK analyzes your generations and activity to identify your dominant archetype.",
    example: '"Builder + Storyteller" \u2192 Best at turning ideas into content that converts.',
    next: "Build content that matches your DNA",
    nextHref: "/scripts",
    icon: Brain,
    color: "text-purple-400",
  },
  "/audience-map": {
    title: "Audience Map",
    purpose: "Understand your audience segments and how to reach each one.",
    why: "Not all followers are equal. Different segments need different content.",
    what: "Map your audience into core fans, engaged followers, and casual browsers.",
    example: '"Core Fans: 8% of audience, 60% of revenue. Focus: exclusive content and early access."',
    next: "Create content for each segment",
    nextHref: "/scripts",
    icon: Compass,
    color: "text-blue-400",
  },
  "/attention-map": {
    title: "Attention Map",
    purpose: "Learn where viewers drop off and how to keep them watching.",
    why: "80% of viewers drop in the first 3 seconds. Fix the hook, fix the video.",
    what: "Explore each zone of a video (Hook, Setup, Proof, CTA) and see what works.",
    example: '"Hook: specific number + result" \u2192 3x better retention than generic questions.',
    next: "Generate hooks that hold attention",
    nextHref: "/viral-hooks",
    icon: Activity,
    color: "text-primary",
  },
  "/growth-evolution": {
    title: "Growth Evolution",
    purpose: "Track your journey from idea to empire.",
    why: "Progress is motivating. Seeing your growth stages keeps you moving.",
    what: "SPARK maps your 5 growth stages based on generations and activity.",
    example: '"Stage 3: Momentum" \u2192 10-25 generations, consistent posting, first campaign launched.',
    next: "Generate your next campaign",
    nextHref: "/campaigns",
    icon: LineChart,
    color: "text-yellow-400",
  },
  "/assets": {
    title: "Asset Command Center",
    purpose: "Manage all your saved ideas, brands, bundles, and scripts.",
    why: "Your best work is scattered. Centralize it so you can reuse and iterate.",
    what: "View, filter, and organize all your saved AI generations in one place.",
    example: '"3 saved ideas, 2 bundles, 5 scripts" \u2192 Filter by type, search, and reuse instantly.',
    next: "Generate something new",
    nextHref: "/ideas",
    icon: Bookmark,
    color: "text-primary",
  },
  "/agents": {
    title: "AI Agents",
    purpose: "Deploy specialized AI agents for specific business tasks.",
    why: "General AI is good. Specialized agents are great. Each agent is optimized for one job.",
    what: "Research, Growth, Sales, and Content agents — each with their own expertise.",
    example: '"Research Agent" \u2192 Scans trends, finds gaps, analyzes competitors in 30 seconds.',
    next: "Activate your first agent",
    nextHref: "/command",
    icon: Bot,
    color: "text-primary",
  },
  "/pricing": {
    title: "Pricing",
    purpose: "Compare plans and upgrade for unlimited access.",
    why: "Free gets you started. Pro gets you to scale. Know what you're unlocking.",
    what: "Compare Free vs Pro features, see usage, and upgrade with one click.",
    example: '"Free: 5 ideas/day" \u2192 "Pro: Unlimited + Brand Builder + Analytics + Priority AI."',
    next: "Continue building",
    nextHref: "/",
    icon: Crown,
    color: "text-yellow-400",
  },
  "/settings": {
    title: "Settings",
    purpose: "Manage your SPARK account and preferences.",
    why: "Your setup matters. Configure SPARK to work the way you work.",
    what: "Update profile, manage notifications, reset onboarding, and control preferences.",
    example: '"Reset onboarding" \u2192 Start the tour again or change your journey preferences.',
    next: "Back to dashboard",
    nextHref: "/",
    icon: Settings,
    color: "text-muted-foreground",
  },
};

export function PageGuide() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const info = PAGE_GUIDES[location];
  if (!info) return null;

  const Icon = info.icon;

  return (
    <div className="relative">
      {/* Trigger button */}
      {!open && !dismissed && (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-white/5 transition-all group"
        >
          <HelpCircle className="h-3.5 w-3.5 group-hover:text-primary transition-colors" />
          <span className="hidden sm:inline">What does this page do?</span>
        </button>
      )}

      {/* Guide panel */}
      {open && (
        <Card className="absolute top-full right-0 mt-2 w-[380px] max-w-[calc(100vw-32px)] z-50 border-border/50 shadow-2xl bg-[hsl(0_0%_8%)] animate-in fade-in zoom-in-95 duration-200">
          <CardContent className="p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center bg-secondary/30`}>
                <Icon className={`h-4 w-4 ${info.color}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm">{info.title}</h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="h-7 w-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Sections */}
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Purpose</p>
                <p className="text-xs text-foreground/90 leading-relaxed">{info.purpose}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Why it matters</p>
                <p className="text-xs text-foreground/90 leading-relaxed">{info.why}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">What happens here</p>
                <p className="text-xs text-foreground/90 leading-relaxed">{info.what}</p>
              </div>

              <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">Example result</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{info.example}</p>
              </div>
            </div>

            {/* Next step */}
            <div className="flex items-center gap-3 pt-2 border-t border-border/30">
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Suggested next step</p>
                <p className="text-xs font-medium">{info.next}</p>
              </div>
              <Button size="sm" className="h-7 text-xs shrink-0" onClick={() => setOpen(false)}>
                <ArrowRight className="h-3 w-3 mr-1" /> Go
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
