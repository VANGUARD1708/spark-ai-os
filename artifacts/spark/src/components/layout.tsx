import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { SparkAI } from "./spark-ai";
import { useGetUsage } from "@workspace/api-client-react";
import { GuidedTour } from "./guided-tour";
import { PageGuide } from "./page-guide";
import { useOnboarding } from "./onboarding-context";

import {
  Zap,
  LayoutDashboard,
  Lightbulb,
  TrendingUp,
  Trophy,
  Package,
  Palette,
  Video,
  Flame,
  BarChart2,
  FlaskConical,
  Bookmark,
  FolderOpen,
  Settings,
  Menu,
  X,
  ChevronRight,
  Send,
  Bot,
  Megaphone,
  Search,
  Globe,
  Crown,
  Layers,
  Radio,
  Clock,
  Sparkles,
  Target,
  Activity,
  Users,
  Radar,
  Brain,
  Wand2,
  Rocket,
  LineChart,
  Compass,
} from "lucide-react";

type Badge =
  | "Early Access"
  | "AI Powered"
  | "Pro"
  | "Preview"
  | "Advanced";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: Badge;
}

interface NavSection {
  label: string;
  description: string;
  items: NavItem[];
}

const BADGE_STYLES: Record<Badge, string> = {
  "Early Access": "text-blue-400 bg-blue-400/10",
  "AI Powered": "text-purple-400 bg-purple-400/10",
  Pro: "text-yellow-400 bg-yellow-400/10",
  Preview: "text-pink-400 bg-pink-400/10",
  Advanced: "text-orange-400 bg-orange-400/10",
};

const sections: NavSection[] = [
  {
    label: "Find Opportunities",
    description: "Discover trends, gaps, and winning markets",
    items: [
      {
        href: "/ideas",
        label: "Idea Generator",
        icon: Lightbulb,
      },
      {
        href: "/trending",
        label: "Trend Radar",
        icon: Radar,
        badge: "Early Access",
      },
      {
        href: "/winning",
        label: "Winning Products",
        icon: Trophy,
        badge: "AI Powered",
      },
      {
        href: "/insights",
        label: "Market Signals",
        icon: Target,
        badge: "Advanced",
      },
    ],
  },

  {
    label: "Build Your Business",
    description: "Turn ideas into real businesses",
    items: [
      {
        href: "/bundle",
        label: "Bundle Builder",
        icon: Package,
      },
      {
        href: "/brand-builder",
        label: "Brand Builder",
        icon: Palette,
      },
      {
        href: "/digital-product",
        label: "Offer Builder",
        icon: Sparkles,
        badge: "AI Powered",
      },
      {
        href: "/storefronts",
        label: "Landing Pages",
        icon: Globe,
        badge: "Advanced",
      },
    ],
  },

  {
    label: "Grow Your Audience",
    description: "Create viral content and social reach",
    items: [
      {
        href: "/viral-hooks",
        label: "Viral Hooks",
        icon: Flame,
      },
      {
        href: "/scripts",
        label: "TikTok Scripts",
        icon: Video,
      },
      {
        href: "/content-planner",
        label: "Ad Generator",
        icon: Layers,
        badge: "Advanced",
      },
      {
        href: "/performance",
        label: "Email / SMS",
        icon: Send,
        badge: "Advanced",
      },
    ],
  },

  {
    label: "Launch & Automate",
    description: "Publish, schedule, and distribute content",
    items: [
      {
        href: "/campaigns",
        label: "Campaign Manager",
        icon: Megaphone,
      },
      {
        href: "/compose",
        label: "Publish Composer",
        icon: Send,
      },
      {
        href: "/schedule",
        label: "Scheduling",
        icon: Clock,
        badge: "Early Access",
      },
      {
        href: "/distribute",
        label: "Automations",
        icon: Radio,
        badge: "Advanced",
      },
    ],
  },

  {
    label: "Scale & Optimize",
    description: "Track growth and improve performance",
    items: [
      {
        href: "/analytics",
        label: "Analytics",
        icon: BarChart2,
      },
      {
        href: "/ab-testing",
        label: "A/B Testing",
        icon: FlaskConical,
        badge: "Advanced",
      },
      {
        href: "/publish",
        label: "AI Recommendations",
        icon: Activity,
        badge: "AI Powered",
      },
      {
        href: "/orders",
        label: "Revenue Forecast",
        icon: TrendingUp,
        badge: "Advanced",
      },
    ],
  },

  {
    label: "AI Agents",
    description: "AI assistants that help grow your business",
    items: [
      {
        href: "/agents",
        label: "All Agents",
        icon: Bot,
      },
      {
        href: "/agents",
        label: "Research Agent",
        icon: Search,
        badge: "AI Powered",
      },
      {
        href: "/agents",
        label: "Growth Agent",
        icon: TrendingUp,
        badge: "AI Powered",
      },
      {
        href: "/agents",
        label: "Sales Agent",
        icon: Users,
        badge: "Advanced",
      },
    ],
  },

  {
    label: "Evolution",
    description: "SPARK learns and evolves with you",
    items: [
      {
        href: "/creator-dna",
        label: "Creator DNA",
        icon: Brain,
        badge: "AI Powered",
      },
      {
        href: "/audience-map",
        label: "Audience Map",
        icon: Compass,
        badge: "Preview",
      },
      {
        href: "/attention-map",
        label: "Attention Map",
        icon: Activity,
        badge: "Preview",
      },
      {
        href: "/growth-evolution",
        label: "Growth Evolution",
        icon: LineChart,
        badge: "AI Powered",
      },
    ],
  },

  {
    label: "Assets",
    description: "Manage files, assets, and saved content",
    items: [
      {
        href: "/assets",
        label: "Asset Command Center",
        icon: Bookmark,
      },
      {
        href: "/files",
        label: "Files",
        icon: FolderOpen,
        badge: "Early Access",
      },
    ],
  },
];

function UsageBar() {
  const { data: usage } = useGetUsage();

  if (!usage) return null;

  const pct = usage.percentUsed;
  const isLow = usage.remaining <= 10;

  return (
    <div className="px-3 pb-3 pt-2 border-t border-border/40 shrink-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
          SPARK Usage
        </span>

        <span
          className={`text-[10px] font-bold ${
            isLow ? "text-red-400" : "text-muted-foreground"
          }`}
        >
          {usage.totalGenerations}/{usage.freeLimit}
        </span>
      </div>

      <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            pct >= 80
              ? "bg-red-400"
              : pct >= 50
              ? "bg-yellow-400"
              : "bg-primary"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {isLow && (
        <p className="text-[9px] text-red-400 mt-1">
          You are running low on generations — upgrade for unlimited access.
        </p>
      )}
    </div>
  );
}

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const { showTour, startTour } = useOnboarding();

  useEffect(() => {
    setOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = open || showTour ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open, showTour]);

  const navLink = (
    href: string,
    label: string,
    Icon: React.ElementType,
    badge?: Badge
  ) => {
    const activeActual = location === href;

    return (
      <Link key={`${href}-${label}`} href={href}>
        <button
          className={`w-full flex items-center gap-2.5 px-3 py-[8px] rounded-xl text-[13px] transition-all ${
            activeActual
              ? "bg-primary/15 text-primary font-semibold"
              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
          }`}
        >
          <Icon className="h-[15px] w-[15px] shrink-0" />

          <span className="flex-1 text-left">{label}</span>

          {badge && (
            <span
              className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${BADGE_STYLES[badge]}`}
            >
              {badge}
            </span>
          )}

          {activeActual && (
            <ChevronRight className="h-3 w-3 opacity-50" />
          )}
        </button>
      </Link>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      <div className="flex items-center gap-3 px-4 py-5 border-b border-border/40 shrink-0">
        <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
          <Zap className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
        </div>

        <div>
          <h1 className="text-[17px] font-black tracking-tight leading-none">
            SPARK
          </h1>

          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mt-1">
            Commerce OS
          </p>
        </div>
      </div>

      <div className="px-3 py-3 border-b border-border/40">
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3">
          <div className="flex items-center gap-2 mb-2">
            <Wand2 className="h-4 w-4 text-primary" />

            <span className="text-xs font-semibold text-primary">
              What are you building today?
            </span>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed">
            SPARK helps transform your raw ideas into scalable businesses,
            brands, and social media systems.
          </p>

          <Link href="/command">
            <button className="mt-3 w-full h-9 rounded-xl bg-primary text-primary-foreground text-[12px] font-semibold hover:opacity-90 transition">
              Open Command Center
            </button>
          </Link>
        </div>
      </div>

      <div className="px-3 pt-3">
        <div className="rounded-xl bg-white/[0.03] border border-border/30 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              Your Journey
            </span>

            <span className="text-[10px] text-primary font-semibold">
              32%
            </span>
          </div>

          <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
            <div className="h-full w-[32%] bg-primary rounded-full" />
          </div>

          <div className="mt-3 text-[11px] text-muted-foreground leading-relaxed">
            Current phase:
            <span className="text-primary font-medium">
              {" "}
              Building Your Brand
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-2.5 py-4 overflow-y-auto scrollbar-thin space-y-5">

        <div className="space-y-1">
          <Link href="/">
            <button
              className={`w-full flex items-center gap-2.5 px-3 py-[8px] rounded-xl text-[13px] font-medium transition-all ${
                location === "/"
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              <LayoutDashboard className="h-[15px] w-[15px]" />
              Dashboard

              {location === "/" && (
                <ChevronRight className="ml-auto h-3 w-3 opacity-50" />
              )}
            </button>
          </Link>

          <Link href="/command">
            <button
              className={`w-full flex items-center gap-2.5 px-3 py-[9px] rounded-2xl text-[13px] font-semibold transition-all border ${
                location === "/command"
                  ? "bg-primary/20 text-primary border-primary/30"
                  : "border-primary/20 bg-primary/8 text-primary hover:bg-primary/15"
              }`}
            >
              <Zap className="h-[15px] w-[15px]" />

              Command Center

              <span className="ml-auto text-[9px] font-bold uppercase tracking-wider bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                AI
              </span>
            </button>
          </Link>
        </div>

        {sections.map((section) => (
          <div key={section.label}>
            <div className="px-3 mb-2">
              <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50">
                {section.label}
              </div>

              <p className="text-[10px] text-muted-foreground/60 mt-1 leading-relaxed">
                {section.description}
              </p>
            </div>

            <div className="space-y-1">
              {section.items.map((item) =>
                navLink(
                  item.href,
                  item.label,
                  item.icon,
                  item.badge
                )
              )}
            </div>
          </div>
        ))}
      </nav>

      <UsageBar />

      <div className="px-2.5 pb-3 pt-2 border-t border-border/40 space-y-1 shrink-0">
        <button
          onClick={startTour}
          className="w-full flex items-center gap-2.5 px-3 py-[8px] rounded-xl text-[13px] transition-all text-muted-foreground hover:text-primary hover:bg-primary/10"
        >
          <Compass className="h-[15px] w-[15px]" />
          Take a Tour
        </button>

        <Link href="/business-profile">
          <button
            className={`w-full flex items-center gap-2.5 px-3 py-[8px] rounded-xl text-[13px] transition-all ${
              location === "/business-profile"
                ? "bg-primary/15 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            <Brain className="h-[15px] w-[15px]" />

            Business Memory
          </button>
        </Link>

        <Link href="/pricing">
          <button
            className={`w-full flex items-center gap-2.5 px-3 py-[8px] rounded-xl text-[13px] transition-all ${
              location === "/pricing"
                ? "bg-primary/15 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            <Crown className="h-[15px] w-[15px]" />

            Upgrade to Pro
          </button>
        </Link>

        <Link href="/settings">
          <button
            className={`w-full flex items-center gap-2.5 px-3 py-[8px] rounded-xl text-[13px] transition-all ${
              location === "/settings"
                ? "bg-primary/15 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            <Settings className="h-[15px] w-[15px]" />

            Settings
          </button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-[100dvh] flex bg-background text-foreground dark overflow-x-hidden">

      <aside className="hidden md:flex flex-col w-72 shrink-0 border-r border-border/40 bg-[hsl(0_0%_5%)] fixed top-0 left-0 h-screen z-30">
        <SidebarContent />
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-[285px] z-50 bg-[hsl(0_0%_5%)] border-r border-border/40 md:hidden transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 z-10"
        >
          <X className="h-4 w-4" />
        </button>

        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 md:ml-72">

        <header className="md:hidden sticky top-0 z-30 flex items-center gap-3 px-4 h-14 bg-background/95 backdrop-blur border-b border-border/40">

          <button
            onClick={() => setOpen(true)}
            className="h-9 w-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
              <Zap
                className="h-3.5 w-3.5 text-primary-foreground"
                strokeWidth={2.5}
              />
            </div>

            <span className="text-base font-black tracking-tight">
              SPARK
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-screen-2xl w-full mx-auto">
          <div className="flex items-center justify-end mb-4">
            <PageGuide />
          </div>
          {children}
        </main>
      </div>

      <SparkAI />
      <GuidedTour />
    </div>
  );
}