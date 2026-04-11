import { ComingSoon } from "@/components/coming-soon";
import { FolderOpen } from "lucide-react";

export default function Files() {
  return (
    <ComingSoon
      title="Files"
      description="All your generated digital products, scripts, and assets in one place. Ready to download, share, or deliver."
      icon={<FolderOpen className="h-9 w-9" />}
      phase="Phase 2"
    />
  );
}
