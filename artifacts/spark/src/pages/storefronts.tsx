import { ComingSoon } from "@/components/coming-soon";
import { ShoppingBag } from "lucide-react";

export default function Storefronts() {
  return (
    <ComingSoon
      title="Storefronts"
      description="Launch a mobile-optimized storefront in one click. No code, no friction — your product live and ready to collect payments."
      icon={<ShoppingBag className="h-9 w-9" />}
      phase="Phase 3"
    />
  );
}
