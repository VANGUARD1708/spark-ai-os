import { ComingSoon } from "@/components/coming-soon";
import { FileText } from "lucide-react";

export default function DigitalProduct() {
  return (
    <ComingSoon
      title="Digital Product Generator"
      description="Auto-generate PDFs, guides, checklists, and mini-courses from a single prompt. Your product, ready to sell in minutes."
      icon={<FileText className="h-9 w-9" />}
      phase="Phase 2"
    />
  );
}
