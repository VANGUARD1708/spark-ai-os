import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customFetch } from "./custom-fetch";

// ─── Types ──────────────────────────────────────────────────

export interface WinningProduct {
  name: string;
  type: string;
  demand: number;
  saturation: "Low" | "Medium" | "High";
  margin: string;
  price: string;
  platform: string;
  why: string;
  tags: string[];
}

export interface WinningProductsResponse {
  products: WinningProduct[];
  generatedAt: string;
}

export interface TrendItem {
  title: string;
  category: string;
  status: "hot" | "rising" | "peak" | "emerging";
  growth: string;
  volume: string;
  difficulty: "Low" | "Medium" | "High";
  description: string;
  tags: string[];
}

export interface TrendingResponse {
  trends: TrendItem[];
  generatedAt: string;
}

export interface Recommendation {
  priority: "High" | "Medium" | "Low";
  category: string;
  title: string;
  body: string;
  action: string;
  href: string;
}

export interface GrowthMetric {
  label: string;
  current: string;
  target: string;
  status: "good" | "neutral" | "low";
}

export interface RecommendationsResponse {
  insight: string;
  recommendations: Recommendation[];
  metrics: GrowthMetric[];
  generatedAt: string;
}

export interface UserProfile {
  id?: number;
  userId?: string;
  businessName?: string | null;
  niche?: string | null;
  audience?: string | null;
  brandVoice?: string | null;
  topProduct?: string | null;
  goals?: string | null;
  updatedAt?: string;
  createdAt?: string;
}

export interface UsageResponse {
  totalGenerations: number;
  freeLimit: number;
  remaining: number;
  percentUsed: number;
  plan: string;
  generationsByType: { type: string; count: number }[];
  resetDate: string;
}

export interface IdeaCritique {
  verdict: "strong" | "promising" | "weak" | "overcrowded";
  verdictLabel: string;
  overallRating: number;
  sparkTake: string;
  strengths: string[];
  risks: string[];
  improvements: string[];
  bestAngle: string;
}

// ─── Winning Products ────────────────────────────────────────

export const getWinningProductsQueryKey = (params?: { category?: string }) =>
  ["/api/spark/winning-products", params] as const;

export const useGetWinningProducts = (
  params?: { category?: string },
  options?: { query?: { enabled?: boolean } }
) =>
  useQuery({
    queryKey: getWinningProductsQueryKey(params),
    queryFn: () => {
      const qs = params?.category && params.category !== "All" ? `?category=${encodeURIComponent(params.category)}` : "";
      return customFetch<WinningProductsResponse>(`/api/spark/winning-products${qs}`);
    },
    staleTime: 1000 * 60 * 10, // 10 min cache
    ...options?.query,
  });

// ─── Trending ────────────────────────────────────────────────

export const getTrendingQueryKey = (params?: { category?: string }) =>
  ["/api/spark/trending", params] as const;

export const useGetTrending = (
  params?: { category?: string },
  options?: { query?: { enabled?: boolean } }
) =>
  useQuery({
    queryKey: getTrendingQueryKey(params),
    queryFn: () => {
      const qs = params?.category && params.category !== "All" ? `?category=${encodeURIComponent(params.category)}` : "";
      return customFetch<TrendingResponse>(`/api/spark/trending${qs}`);
    },
    staleTime: 1000 * 60 * 10,
    ...options?.query,
  });

// ─── Recommendations ─────────────────────────────────────────

export const getRecommendationsQueryKey = () =>
  ["/api/spark/recommendations"] as const;

export const useGetRecommendations = (options?: { query?: { enabled?: boolean } }) =>
  useQuery({
    queryKey: getRecommendationsQueryKey(),
    queryFn: () => customFetch<RecommendationsResponse>("/api/spark/recommendations"),
    staleTime: 1000 * 60 * 5,
    ...options?.query,
  });

// ─── User Profile ────────────────────────────────────────────

export const getUserProfileQueryKey = () =>
  ["/api/spark/user-profile"] as const;

export const useGetUserProfile = (options?: { query?: { enabled?: boolean } }) =>
  useQuery({
    queryKey: getUserProfileQueryKey(),
    queryFn: () => customFetch<UserProfile | null>("/api/spark/user-profile"),
    staleTime: 1000 * 60 * 60,
    ...options?.query,
  });

export const useUpsertUserProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<UserProfile, "id" | "userId" | "createdAt" | "updatedAt">) =>
      customFetch<UserProfile>("/api/spark/user-profile", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUserProfileQueryKey() });
    },
  });
};

// ─── Usage ───────────────────────────────────────────────────

export const getUsageQueryKey = () =>
  ["/api/spark/usage"] as const;

export const useGetUsage = (options?: { query?: { enabled?: boolean } }) =>
  useQuery({
    queryKey: getUsageQueryKey(),
    queryFn: () => customFetch<UsageResponse>("/api/spark/usage"),
    staleTime: 1000 * 60 * 2,
    ...options?.query,
  });

// ─── Critique Idea ───────────────────────────────────────────

export const useCritiqueIdea = () =>
  useMutation({
    mutationFn: (data: {
      title: string;
      description?: string;
      niche?: string;
      demandScore?: number;
      competitionScore?: number;
    }) =>
      customFetch<IdeaCritique>("/api/spark/critique", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  });
