import { ComingSoon } from "@/components/coming-soon";
import { Activity } from "lucide-react";

export default function Performance() {
  return (
    <ComingSoon
      title="Performance"
      description="Views, clicks, orders, and revenue by channel and campaign. Know your best content and double down."
      icon={<Activity className="h-9 w-9" />}
      phase="Phase 4"
    />
  );
}
