import { ComingSoon } from "@/components/coming-soon";
import { FlaskConical } from "lucide-react";

export default function ABTesting() {
  return (
    <ComingSoon
      title="A/B Testing"
      description="Test headlines, pricing, and offers side-by-side. Let data tell you which version makes more money."
      icon={<FlaskConical className="h-9 w-9" />}
      phase="Phase 4"
    />
  );
}
