import { ComingSoon } from "@/components/coming-soon";
import { Calendar } from "lucide-react";

export default function ContentPlanner() {
  return (
    <ComingSoon
      title="Content Planner"
      description="A full posting calendar with daily content ideas. Stay consistent, stay visible, and never run out of things to post."
      icon={<Calendar className="h-9 w-9" />}
      phase="Phase 2"
    />
  );
}
