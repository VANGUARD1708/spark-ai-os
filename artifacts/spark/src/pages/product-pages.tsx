import { ComingSoon } from "@/components/coming-soon";
import { Globe } from "lucide-react";

export default function ProductPages() {
  return (
    <ComingSoon
      title="Product Pages"
      description="AI-generated sales pages with proven conversion structure — title, benefits, FAQs, social proof, and a high-converting CTA."
      icon={<Globe className="h-9 w-9" />}
      phase="Phase 3"
    />
  );
}
