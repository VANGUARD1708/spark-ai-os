import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Zap, Lightbulb, Package, Video, Bookmark, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: Zap },
    { href: "/ideas", label: "Idea Generator", icon: Lightbulb },
    { href: "/bundle", label: "Bundle Builder", icon: Package },
    { href: "/scripts", label: "TikTok Scripts", icon: Video },
    { href: "/saved", label: "Saved Ideas", icon: Bookmark },
  ];

  const NavLinks = ({ className = "" }: { className?: string }) => (
    <nav className={`flex gap-1 ${className}`}>
      {navItems.map((item) => {
        const isActive = location === item.href;
        return (
          <Link key={item.href} href={item.href} className="w-full">
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className={`w-full justify-start gap-2 ${isActive ? "bg-secondary text-secondary-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground dark">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center px-4 max-w-screen-2xl mx-auto">
          <div className="md:hidden mr-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px] sm:w-[300px] border-r-border/40 bg-background">
                <div className="flex flex-col gap-6 py-4">
                  <div className="flex items-center gap-2 px-2">
                    <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                      <Zap className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">SPARK</span>
                  </div>
                  <NavLinks className="flex-col" />
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          <div className="flex items-center gap-2 mr-8">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="hidden md:inline-block text-xl font-bold tracking-tight">SPARK</span>
          </div>

          <div className="hidden md:flex flex-1">
            <NavLinks className="flex-row items-center space-x-2" />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center p-4 md:p-8 max-w-screen-2xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
