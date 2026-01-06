import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface DonorMatch {
  donor_id: string;
  blood_type: string;
  match_score: number;
  score_factors: {
    bloodCompatibility?: number;
    distance?: number;
    reliability?: number;
    availability?: number;
    eligibility?: number;
    urgencyBoost?: number;
  };
  distance_km: number | null;
  reliability_score: number;
  total_donations: number;
  last_donation_date: string | null;
  eligibility_score: number;
  profile: {
    full_name: string;
    phone: string | null;
    city: string | null;
    state: string | null;
  };
}

interface MatchDonorsParams {
  requestId?: string;
  bloodType: string;
  latitude?: number | null;
  longitude?: number | null;
  urgency?: "normal" | "urgent" | "emergency";
  maxResults?: number;
  useAI?: boolean;
}

interface MatchResult {
  matches: DonorMatch[];
  total_compatible: number;
  compatible_types: string[];
  ai_insights: string | null;
}

export function useDonorMatching() {
  const [matches, setMatches] = useState<DonorMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [totalCompatible, setTotalCompatible] = useState(0);

  const findMatches = useCallback(async (params: MatchDonorsParams): Promise<MatchResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("match-donors", {
        body: params,
      });

      if (fnError) {
        throw fnError;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setMatches(data.matches || []);
      setTotalCompatible(data.total_compatible || 0);
      setAiInsights(data.ai_insights || null);

      if (data.matches?.length === 0) {
        toast.info("No compatible donors found in your area");
      } else {
        toast.success(`Found ${data.matches.length} matching donors`);
      }

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to find donors";
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearMatches = useCallback(() => {
    setMatches([]);
    setError(null);
    setAiInsights(null);
    setTotalCompatible(0);
  }, []);

  return {
    matches,
    loading,
    error,
    aiInsights,
    totalCompatible,
    findMatches,
    clearMatches,
  };
}
