import { ComingSoon } from "@/components/coming-soon";
import { Sparkles } from "lucide-react";

export default function Insights() {
  return (
    <ComingSoon
      title="AI Insights"
      description="Proactive recommendations powered by your data. Spark tells you exactly what to change to grow faster."
      icon={<Sparkles className="h-9 w-9" />}
      phase="Phase 4"
    />
  );
}
