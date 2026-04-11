import { ComingSoon } from "@/components/coming-soon";
import { Send } from "lucide-react";

export default function Compose() {
  return (
    <ComingSoon
      title="Publish Composer"
      description="Auto-fill your title, caption, price, and CTA from your Spark content. Add media, select your channels, and publish."
      icon={<Send className="h-9 w-9" />}
      phase="Phase 3"
    />
  );
}
