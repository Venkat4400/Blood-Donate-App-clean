import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useGeolocation } from "./useGeolocation";
import type { Tables } from "@/integrations/supabase/types";

type BloodBank = Tables<"blood_banks"> & {
  distance?: number;
  travelTime?: number;
};

interface UseVerifiedBloodBanksOptions {
  radiusKm?: number;
  onlyVerified?: boolean;
  bloodType?: string;
}

export function useVerifiedBloodBanks(options: UseVerifiedBloodBanksOptions = {}) {
  const { radiusKm = 50, onlyVerified = true, bloodType } = options;
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const geolocation = useGeolocation();
  const { latitude, longitude, isLoading: locationLoading } = geolocation;
  
  const calculateDistance = (lat: number, lng: number): number => {
    if (!latitude || !longitude) return Infinity;
    const R = 6371;
    const dLat = ((lat - latitude) * Math.PI) / 180;
    const dLon = ((lng - longitude) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((latitude * Math.PI) / 180) * Math.cos((lat * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };
  
  const estimateTravelTime = (distanceKm: number): number => Math.round((distanceKm / 30) * 60);

  // Note: Blood banks are seeded via database migration, not client-side
  // This avoids RLS policy violations for anonymous users

  const fetchBloodBanks = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from("blood_banks").select("*");

      if (onlyVerified) {
        query = query.eq("is_verified", true);
      }

      const { data, error: fetchError } = await query.order("name");

      if (fetchError) throw fetchError;

      if (data && latitude && longitude) {
        // Calculate distance and travel time for each blood bank
        const banksWithDistance = data.map((bank) => {
          const distance = calculateDistance(bank.latitude, bank.longitude);
          const travelTime = estimateTravelTime(distance);
          return { ...bank, distance, travelTime };
        });

        // Filter by radius and sort by distance
        const filteredBanks = banksWithDistance
          .filter((bank) => bank.distance <= radiusKm)
          .sort((a, b) => a.distance - b.distance);

        setBloodBanks(filteredBanks);
      } else if (data) {
        setBloodBanks(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch blood banks");
      console.error("Error fetching blood banks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!locationLoading) {
      fetchBloodBanks();
    }
  }, [latitude, longitude, locationLoading, radiusKm, onlyVerified, bloodType]);

  // Real-time subscription for blood banks updates
  useEffect(() => {
    const channel = supabase
      .channel('blood-banks-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'blood_banks' },
        () => {
          fetchBloodBanks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [latitude, longitude, radiusKm, onlyVerified]);

  const refetch = () => {
    fetchBloodBanks();
  };

  return {
    bloodBanks,
    loading: loading || locationLoading,
    error,
    refetch,
    userLocation: latitude && longitude ? { lat: latitude, lng: longitude } : null,
    locationError: geolocation.error,
  };
}
