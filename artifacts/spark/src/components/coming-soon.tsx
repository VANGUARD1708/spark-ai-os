import { Layout } from "./layout";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";

interface ComingSoonProps {
  title: string;
  description: string;
  icon: ReactNode;
  phase?: string;
}

export function ComingSoon({ title, description, icon, phase = "Phase 2" }: ComingSoonProps) {
  return (
    <Layout>
      <div className="w-full max-w-2xl mx-auto py-16 animate-in fade-in duration-500">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-8 text-muted-foreground hover:text-foreground -ml-1">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="flex flex-col items-center text-center space-y-6 px-4">
          <div className="h-20 w-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            {icon}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              <Badge variant="outline" className="text-muted-foreground border-border/60 text-xs">
                {phase}
              </Badge>
            </div>
            <p className="text-muted-foreground text-lg max-w-md">
              {description}
            </p>
          </div>

          <div className="pt-2 w-full max-w-sm p-5 rounded-xl bg-card border border-border/50">
            <p className="text-sm text-muted-foreground leading-relaxed">
              This feature is on the roadmap and will be available in an upcoming release. The Phase 1 engines — Idea Generator, Bundle Builder, and TikTok Scripts — are live and ready to use now.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
