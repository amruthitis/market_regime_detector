import { useQuery } from "@tanstack/react-query"
import { getPrediction, type PredictionResponse } from "@/lib/api"

export function usePrediction(date?: string) {
  return useQuery<PredictionResponse>({
    queryKey: ["prediction", date ?? "live"],
    queryFn: () => getPrediction(date),
    enabled: false,
    retry: 1,
    staleTime: 60_000,
  })
}
