import { ComingSoon } from "@/components/coming-soon";
import { Palette } from "lucide-react";

export default function BrandBuilder() {
  return (
    <ComingSoon
      title="Brand Builder"
      description="Generate a complete brand identity — name, colors, voice, and visual style — tailored to your niche and audience."
      icon={<Palette className="h-9 w-9" />}
      phase="Phase 2"
    />
  );
}
