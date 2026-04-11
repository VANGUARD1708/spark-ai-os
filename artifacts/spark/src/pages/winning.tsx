import { ComingSoon } from "@/components/coming-soon";
import { Trophy } from "lucide-react";

export default function Winning() {
  return (
    <ComingSoon
      title="Winning Products"
      description="Proven products that are already selling at scale. Curated from real sales data so you can model what's working."
      icon={<Trophy className="h-9 w-9" />}
      phase="Phase 2"
    />
  );
}
