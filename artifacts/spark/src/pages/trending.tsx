import { ComingSoon } from "@/components/coming-soon";
import { TrendingUp } from "lucide-react";

export default function Trending() {
  return (
    <ComingSoon
      title="Trending Products"
      description="Discover what's selling right now. Real-time trend detection across platforms — so you're always ahead of the market."
      icon={<TrendingUp className="h-9 w-9" />}
      phase="Phase 2"
    />
  );
}
