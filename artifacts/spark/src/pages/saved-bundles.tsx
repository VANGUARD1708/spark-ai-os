import { ComingSoon } from "@/components/coming-soon";
import { Archive } from "lucide-react";

export default function SavedBundles() {
  return (
    <ComingSoon
      title="Saved Bundles"
      description="Your generated offer bundles saved and organized. Come back to any bundle, refine it, and launch when ready."
      icon={<Archive className="h-9 w-9" />}
      phase="Phase 2"
    />
  );
}
