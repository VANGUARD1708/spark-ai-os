import { ComingSoon } from "@/components/coming-soon";
import { ClipboardList } from "lucide-react";

export default function Orders() {
  return (
    <ComingSoon
      title="Orders"
      description="Track every order in real time. Status updates, fulfillment tracking, and digital delivery — all in one place."
      icon={<ClipboardList className="h-9 w-9" />}
      phase="Phase 3"
    />
  );
}
