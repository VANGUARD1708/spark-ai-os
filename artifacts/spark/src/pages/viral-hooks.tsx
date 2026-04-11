import { ComingSoon } from "@/components/coming-soon";
import { Flame } from "lucide-react";

export default function ViralHooks() {
  return (
    <ComingSoon
      title="Viral Hooks"
      description="A swipe file of scroll-stopping opening lines engineered for maximum attention. One hook can change everything."
      icon={<Flame className="h-9 w-9" />}
      phase="Phase 2"
    />
  );
}
