import { ReactNode } from "react";
import { Link } from "wouter";
import { Crown, Lock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlan } from "@/hooks/use-plan";

interface UpgradeGateProps {
  children: ReactNode;
  feature?: string;
  description?: string;
  blur?: boolean;
}

export function UpgradeGate({ children, feature = "this feature", description, blur = false }: UpgradeGateProps) {
  const { isPro, isLoading } = usePlan();

  if (isLoading) return <>{children}</>;
  if (isPro) return <>{children}</>;

  if (blur) {
    return (
      <div className="relative">
        <div className="pointer-events-none select-none blur-sm opacity-40">{children}</div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl">
          <div className="text-center p-6 max-w-xs">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold text-base mb-2">Pro Feature</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {description ?? `Upgrade to Pro to unlock ${feature}.`}
            </p>
            <Link href="/pricing">
              <Button size="sm" className="w-full">
                <Crown className="h-3.5 w-3.5 mr-2" />
                Upgrade to Pro
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-border rounded-xl bg-card/20 p-8">
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Crown className="h-6 w-6 text-yellow-400" />
      </div>
      <h3 className="font-bold text-base mb-2">Pro Feature</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-xs">
        {description ?? `Upgrade to Pro to unlock ${feature} and get unlimited access to all tools.`}
      </p>
      <Link href="/pricing">
        <Button size="sm">
          <Zap className="h-3.5 w-3.5 mr-2" />
          See Plans
        </Button>
      </Link>
    </div>
  );
}
