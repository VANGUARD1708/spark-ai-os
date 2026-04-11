import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  Zap, LayoutDashboard, Lightbulb, TrendingUp, Trophy,
  Package, FileText, Palette, ShoppingBag, Globe, ClipboardList,
  Video, Calendar, Flame, BarChart2, FlaskConical, Sparkles,
  Bookmark, Archive, FolderOpen, Settings, Menu, X, ChevronRight,
  Radio, Send, Layers, Clock, Activity
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  soon?: boolean;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const sections: NavSection[] = [
  {
    label: "Research",
    items: [
      { href: "/ideas", label: "Idea Generator", icon: Lightbulb },
      { href: "/trending", label: "Trending Products", icon: TrendingUp, soon: true },
      { href: "/winning", label: "Winning Products", icon: Trophy, soon: true },
    ],
  },
  {
    label: "Build",
    items: [
      { href: "/bundle", label: "Bundle Builder", icon: Package },
      { href: "/digital-product", label: "Digital Product", icon: FileText, soon: true },
      { href: "/brand-builder", label: "Brand Builder", icon: Palette },
    ],
  },
  {
    label: "Sell",
    items: [
      { href: "/storefronts", label: "Storefronts", icon: ShoppingBag, soon: true },
      { href: "/product-pages", label: "Product Pages", icon: Globe, soon: true },
      { href: "/orders", label: "Orders", icon: ClipboardList, soon: true },
    ],
  },
  {
    label: "Grow",
    items: [
      { href: "/scripts", label: "TikTok Scripts", icon: Video },
      { href: "/content-planner", label: "Content Planner", icon: Calendar },
      { href: "/viral-hooks", label: "Viral Hooks", icon: Flame },
    ],
  },
  {
    label: "Distribute",
    items: [
      { href: "/distribute", label: "Connected Accounts", icon: Radio, soon: true },
      { href: "/compose", label: "Publish Composer", icon: Send, soon: true },
      { href: "/publish", label: "Multi-Channel", icon: Layers, soon: true },
      { href: "/schedule", label: "Scheduling", icon: Clock, soon: true },
      { href: "/performance", label: "Performance", icon: Activity, soon: true },
    ],
  },
  {
    label: "Optimize",
    items: [
      { href: "/analytics", label: "Analytics", icon: BarChart2, soon: true },
      { href: "/ab-testing", label: "A/B Testing", icon: FlaskConical, soon: true },
      { href: "/insights", label: "Insights", icon: Sparkles, soon: true },
    ],
  },
  {
    label: "Assets",
    items: [
      { href: "/assets", label: "Saved Ideas", icon: Bookmark },
      { href: "/saved-bundles", label: "Saved Bundles", icon: Archive, soon: true },
      { href: "/files", label: "Files", icon: FolderOpen, soon: true },
    ],
  },
];

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-border/40 shrink-0">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Zap className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
        </div>
        <span className="text-lg font-black tracking-tight text-foreground">SPARK</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto scrollbar-thin">
        <div>
          <Link href="/">
            <button className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              location === "/"
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}>
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              Dashboard
              {location === "/" && <ChevronRight className="ml-auto h-3 w-3 opacity-60" />}
            </button>
          </Link>
        </div>

        {sections.map((section) => (
          <div key={section.label}>
            <div className="px-3 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                {section.label}
              </span>
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <button className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                      isActive
                        ? "bg-primary/15 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    }`}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.soon && (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/40 bg-white/5 px-1.5 py-0.5 rounded">
                          Soon
                        </span>
                      )}
                      {isActive && !item.soon && <ChevronRight className="h-3 w-3 opacity-60" />}
                    </button>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 pb-4 pt-2 border-t border-border/40 space-y-0.5 shrink-0">
        <Link href="/pricing">
          <button className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
            location === "/pricing"
              ? "bg-primary/15 text-primary font-medium"
              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
          }`}>
            <Zap className="h-4 w-4 shrink-0" />
            Pricing
          </button>
        </Link>
        <Link href="/settings">
          <button className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
            location === "/settings"
              ? "bg-primary/15 text-primary font-medium"
              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
          }`}>
            <Settings className="h-4 w-4 shrink-0" />
            Settings
          </button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-[100dvh] flex bg-background text-foreground dark overflow-x-hidden">
      <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-border/40 bg-card/30 fixed top-0 left-0 h-screen z-30">
        <SidebarContent />
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside className={`fixed top-0 left-0 h-screen w-[260px] z-50 bg-[hsl(0_0%_6%)] border-r border-border/40 md:hidden transition-transform duration-300 ease-in-out ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}>
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors z-10"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </button>
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 md:ml-60">
        <header className="md:hidden sticky top-0 z-30 flex items-center gap-3 px-4 h-14 bg-background/95 backdrop-blur border-b border-border/40">
          <button
            onClick={() => setOpen(true)}
            className="h-9 w-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
            aria-label="Open sidebar"
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
    </div>
  );
}
