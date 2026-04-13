import { useGetMe } from "@workspace/api-client-react";

export function usePlan() {
  const { data: user, isLoading } = useGetMe();
  const plan = user?.plan ?? "free";
  const isPro = plan === "pro";
  return { plan, isPro, isGuest: user?.isGuest ?? true, isLoading };
}
