import { ComingSoon } from "@/components/coming-soon";
import { BarChart2 } from "lucide-react";

export default function Analytics() {
  return (
    <ComingSoon
      title="Analytics"
      description="Revenue, conversion rates, and traffic sources at a glance. Know exactly what's working and where to double down."
      icon={<BarChart2 className="h-9 w-9" />}
      phase="Phase 4"
    />
  );
}
