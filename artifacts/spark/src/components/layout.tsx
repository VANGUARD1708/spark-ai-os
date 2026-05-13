import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { SparkAI } from "./spark-ai";
import { useGetUsage } from "@workspace/api-client-react";
import {
  Zap, LayoutDashboard, Lightbulb, TrendingUp, Trophy,
  Package, Palette, Video, Flame, BarChart2, FlaskConical,
  Bookmark, FolderOpen, Settings, Menu, X, ChevronRight,
  Send, Bot, Megaphone, Search, Globe, Crown, Layers,
  Radio, Clock, Sparkles, Target, Activity, Users, Radar,
  Brain
} from "lucide-react";

type Badge = "Beta" | "Labs" | "Pro" | "Preview" | "Enterprise";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: Badge;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const BADGE_STYLES: Record<Badge, string> = {
  Beta: "text-blue-400/70 bg-blue-400/10",
  Labs: "text-orange-400/70 bg-orange-400/10",
  Pro: "text-yellow-400/70 bg-yellow-400/10",
  Preview: "text-purple-400/70 bg-purple-400/10",
  Enterprise: "text-green-400/70 bg-green-400/10",
};

const sections: NavSection[] = [
  {
    label: "Discover",
    items: [
      { href: "/ideas", label: "Idea Generator", icon: Lightbulb },
      { href: "/trending", label: "Trend Radar", icon: Radar, badge: "Beta" },
      { href: "/winning", label: "Winning Products", icon: Trophy, badge: "Beta" },
      { href: "/insights", label: "Market Signals", icon: Target, badge: "Labs" },
    ],
  },
  {
    label: "Build",
    items: [
      { href: "/bundle", label: "Bundle Builder", icon: Package },
      { href: "/brand-builder", label: "Brand Builder", icon: Palette },
      { href: "/digital-product", label: "Offer Builder", icon: Sparkles, badge: "Beta" },
      { href: "/storefronts", label: "Landing Pages", icon: Globe, badge: "Labs" },
    ],
  },
  {
    label: "Create",
    items: [
      { href: "/viral-hooks", label: "Viral Hooks", icon: Flame },
      { href: "/scripts", label: "TikTok Scripts", icon: Video },
      { href: "/content-planner", label: "Ad Generator", icon: Layers, badge: "Labs" },
      { href: "/performance", label: "Email / SMS", icon: Send, badge: "Labs" },
    ],
  },
  {
    label: "Launch",
    items: [
      { href: "/campaigns", label: "Campaign Manager", icon: Megaphone },
      { href: "/compose", label: "Publish Composer", icon: Send },
      { href: "/schedule", label: "Scheduling", icon: Clock, badge: "Beta" },
      { href: "/distribute", label: "Automations", icon: Radio, badge: "Labs" },
    ],
  },
  {
    label: "Scale",
    items: [
      { href: "/analytics", label: "Analytics", icon: BarChart2 },
      { href: "/ab-testing", label: "A/B Testing", icon: FlaskConical, badge: "Labs" },
      { href: "/publish", label: "Recommendations", icon: Activity, badge: "Labs" },
      { href: "/orders", label: "Revenue Forecast", icon: TrendingUp, badge: "Labs" },
    ],
  },
  {
    label: "AI Agents",
    items: [
      { href: "/agents", label: "All Agents", icon: Bot },
      { href: "/agents", label: "Research Agent", icon: Search, badge: "Beta" },
      { href: "/agents", label: "Growth Agent", icon: TrendingUp, badge: "Beta" },
      { href: "/agents", label: "Sales Agent", icon: Users, badge: "Labs" },
    ],
  },
  {
    label: "Assets",
    items: [
      { href: "/assets", label: "Asset Command Center", icon: Bookmark },
      { href: "/files", label: "Files", icon: FolderOpen, badge: "Beta" },
    ],
  },
];

function UsageBar() {
  const { data: usage } = useGetUsage();
  if (!usage) return null;
  const pct = usage.percentUsed;
  const isLow = usage.remaining <= 10;
  return (
    <div className="px-3 pb-2 pt-1 border-t border-border/40 shrink-0">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Monthly Usage</span>
        <span className={`text-[10px] font-bold ${isLow ? "text-red-400" : "text-muted-foreground"}`}>
          {usage.totalGenerations}/{usage.freeLimit}
        </span>
      </div>
      <div className="h-1 w-full bg-secondary/50 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${pct >= 80 ? "bg-red-400" : pct >= 50 ? "bg-yellow-400" : "bg-primary"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {isLow && (
        <p className="text-[9px] text-red-400 mt-1">{usage.remaining} generations left — upgrade for unlimited</p>
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

  useEffect(() => { setOpen(false); }, [location]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const navLink = (href: string, label: string, Icon: React.ElementType, badge?: Badge) => {
    const isActive = location === href && !(href === "/agents" && label !== "All Agents");
    const activeActual = location === href;
    return (
      <Link key={`${href}-${label}`} href={href}>
        <button className={`w-full flex items-center gap-2.5 px-3 py-[7px] rounded-lg text-[13px] transition-all ${
          activeActual
            ? "bg-primary/15 text-primary font-medium"
            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
        }`}>
          <Icon className="h-[15px] w-[15px] shrink-0" />
          <span className="flex-1 text-left">{label}</span>
          {badge && (
            <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${BADGE_STYLES[badge]}`}>
              {badge}
            </span>
          )}
          {activeActual && !badge && <ChevronRight className="h-3 w-3 opacity-50" />}
        </button>
      </Link>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-4 py-[18px] border-b border-border/40 shrink-0">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Zap className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
        </div>
        <span className="text-[17px] font-black tracking-tight text-foreground">SPARK</span>
        <span className="ml-auto text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">OS</span>
      </div>

      <nav className="flex-1 px-2.5 py-3 overflow-y-auto scrollbar-thin space-y-4">

        <div className="space-y-0.5">
          <Link href="/">
            <button className={`w-full flex items-center gap-2.5 px-3 py-[7px] rounded-lg text-[13px] font-medium transition-all ${
              location === "/" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}>
              <LayoutDashboard className="h-[15px] w-[15px] shrink-0" />
              Dashboard
              {location === "/" && <ChevronRight className="ml-auto h-3 w-3 opacity-50" />}
            </button>
          </Link>

          <Link href="/command">
            <button className={`w-full flex items-center gap-2.5 px-3 py-[7px] rounded-xl text-[13px] font-semibold transition-all border ${
              location === "/command"
                ? "bg-primary/20 text-primary border-primary/30"
                : "border-primary/20 bg-primary/8 text-primary hover:bg-primary/15"
            }`}>
              <Zap className="h-[15px] w-[15px] shrink-0" />
              Command Center
              <span className="ml-auto text-[9px] font-bold uppercase tracking-wider bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                AI
              </span>
            </button>
          </Link>
        </div>

        {sections.map((section) => (
          <div key={section.label}>
            <div className="px-3 mb-1">
              <span className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-muted-foreground/45">
                {section.label}
              </span>
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => navLink(item.href, item.label, item.icon, item.badge))}
            </div>
          </div>
        ))}
      </nav>

      <UsageBar />

      <div className="px-2.5 pb-3 pt-2 border-t border-border/40 space-y-0.5 shrink-0">
        <Link href="/business-profile">
          <button className={`w-full flex items-center gap-2.5 px-3 py-[7px] rounded-lg text-[13px] transition-all ${
            location === "/business-profile" ? "bg-primary/15 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
          }`}>
            <Brain className="h-[15px] w-[15px] shrink-0" />
            Business Memory
          </button>
        </Link>
        <Link href="/pricing">
          <button className={`w-full flex items-center gap-2.5 px-3 py-[7px] rounded-lg text-[13px] transition-all ${
            location === "/pricing" ? "bg-primary/15 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
          }`}>
            <Crown className="h-[15px] w-[15px] shrink-0" />
            Upgrade to Pro
          </button>
        </Link>
        <Link href="/settings">
          <button className={`w-full flex items-center gap-2.5 px-3 py-[7px] rounded-lg text-[13px] transition-all ${
            location === "/settings" ? "bg-primary/15 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
          }`}>
            <Settings className="h-[15px] w-[15px] shrink-0" />
            Settings
          </button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-[100dvh] flex bg-background text-foreground dark overflow-x-hidden">
      <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-border/40 bg-[hsl(0_0%_5%)] fixed top-0 left-0 h-screen z-30">
        <SidebarContent />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setOpen(false)} />
      )}

      <aside className={`fixed top-0 left-0 h-screen w-[260px] z-50 bg-[hsl(0_0%_5%)] border-r border-border/40 md:hidden transition-transform duration-300 ease-in-out ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}>
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 z-10"
        >
          <X className="h-4 w-4" />
        </button>
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 md:ml-60">
        <header className="md:hidden sticky top-0 z-30 flex items-center gap-3 px-4 h-14 bg-background/95 backdrop-blur border-b border-border/40">
          <button
            onClick={() => setOpen(true)}
            className="h-9 w-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="text-base font-black tracking-tight">SPARK</span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-screen-2xl w-full mx-auto">
          {children}
        </main>
      </div>
      <SparkAI />
    </div>
  );
}
