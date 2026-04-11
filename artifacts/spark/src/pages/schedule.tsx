import { ComingSoon } from "@/components/coming-soon";
import { Clock } from "lucide-react";

export default function Schedule() {
  return (
    <ComingSoon
      title="Scheduling"
      description="Post now or schedule for later. AI-suggested best posting times based on your audience and platform."
      icon={<Clock className="h-9 w-9" />}
      phase="Phase 3"
    />
  );
}
