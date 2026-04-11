import { ComingSoon } from "@/components/coming-soon";
import { Radio } from "lucide-react";

export default function Distribute() {
  return (
    <ComingSoon
      title="Connected Accounts"
      description="Connect TikTok, Instagram, Facebook, and WhatsApp. Publish your content everywhere from a single place."
      icon={<Radio className="h-9 w-9" />}
      phase="Phase 3"
    />
  );
}
