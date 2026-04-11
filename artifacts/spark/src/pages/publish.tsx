import { ComingSoon } from "@/components/coming-soon";
import { Layers } from "lucide-react";

export default function Publish() {
  return (
    <ComingSoon
      title="Multi-Channel Publish"
      description="Select TikTok, Facebook, Instagram, and more — then hit Publish Everywhere to go live on all platforms at once."
      icon={<Layers className="h-9 w-9" />}
      phase="Phase 3"
    />
  );
}
