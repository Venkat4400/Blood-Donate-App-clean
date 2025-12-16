import { useState, useEffect } from "react";
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

// Verified blood banks data for India (will be seeded to database)
const VERIFIED_BLOOD_BANKS_SEED = [
  {
    name: "Indian Red Cross Society Blood Bank",
    address: "1, Red Cross Road, Near Connaught Place",
    city: "New Delhi",
    state: "Delhi",
    latitude: 28.6315,
    longitude: 77.2167,
    phone: "+91-11-23711551",
    is_24x7: true,
    is_verified: true,
    rating: 4.8,
    has_component_facility: true,
  },
  {
    name: "Rotary Blood Bank",
    address: "A-3, 56-57, Community Centre, Tughlakabad",
    city: "New Delhi",
    state: "Delhi",
    latitude: 28.5189,
    longitude: 77.2507,
    phone: "+91-11-29957044",
    is_24x7: true,
    is_verified: true,
    rating: 4.9,
    has_component_facility: true,
  },
  {
    name: "AIIMS Blood Bank",
    address: "All India Institute of Medical Sciences, Ansari Nagar",
    city: "New Delhi",
    state: "Delhi",
    latitude: 28.5672,
    longitude: 77.2100,
    phone: "+91-11-26588500",
    is_24x7: true,
    is_verified: true,
    rating: 4.7,
    has_component_facility: true,
  },
  {
    name: "Apollo Hospitals Blood Bank",
    address: "Sarita Vihar, Delhi Mathura Road",
    city: "New Delhi",
    state: "Delhi",
    latitude: 28.5322,
    longitude: 77.2886,
    phone: "+91-11-26925858",
    is_24x7: true,
    is_verified: true,
    rating: 4.8,
    has_component_facility: true,
  },
  {
    name: "Fortis Blood Bank",
    address: "Sector B, Pocket 1, Aruna Asaf Ali Marg, Vasant Kunj",
    city: "New Delhi",
    state: "Delhi",
    latitude: 28.5200,
    longitude: 77.1500,
    phone: "+91-11-42776222",
    is_24x7: true,
    is_verified: true,
    rating: 4.6,
    has_component_facility: true,
  },
  {
    name: "Max Super Speciality Hospital Blood Bank",
    address: "Press Enclave Road, Saket",
    city: "New Delhi",
    state: "Delhi",
    latitude: 28.5274,
    longitude: 77.2186,
    phone: "+91-11-26515050",
    is_24x7: true,
    is_verified: true,
    rating: 4.7,
    has_component_facility: true,
  },
  {
    name: "Sir Ganga Ram Hospital Blood Bank",
    address: "Rajinder Nagar, New Delhi",
    city: "New Delhi",
    state: "Delhi",
    latitude: 28.6412,
    longitude: 77.1821,
    phone: "+91-11-25861831",
    is_24x7: true,
    is_verified: true,
    rating: 4.8,
    has_component_facility: true,
  },
  {
    name: "Prathama Blood Centre",
    address: "Shahibaug",
    city: "Ahmedabad",
    state: "Gujarat",
    latitude: 23.0469,
    longitude: 72.5849,
    phone: "+91-79-22861175",
    is_24x7: true,
    is_verified: true,
    rating: 4.9,
    has_component_facility: true,
  },
  {
    name: "Tata Memorial Hospital Blood Bank",
    address: "Dr. E Borges Road, Parel",
    city: "Mumbai",
    state: "Maharashtra",
    latitude: 19.0045,
    longitude: 72.8426,
    phone: "+91-22-24177000",
    is_24x7: true,
    is_verified: true,
    rating: 4.8,
    has_component_facility: true,
  },
  {
    name: "KEM Hospital Blood Bank",
    address: "Acharya Donde Marg, Parel",
    city: "Mumbai",
    state: "Maharashtra",
    latitude: 19.0000,
    longitude: 72.8400,
    phone: "+91-22-24136051",
    is_24x7: true,
    is_verified: true,
    rating: 4.7,
    has_component_facility: true,
  },
  {
    name: "Lilavati Hospital Blood Bank",
    address: "Bandra Reclamation, Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    latitude: 19.0509,
    longitude: 72.8289,
    phone: "+91-22-26568000",
    is_24x7: true,
    is_verified: true,
    rating: 4.6,
    has_component_facility: true,
  },
  {
    name: "CMC Vellore Blood Bank",
    address: "Ida Scudder Road",
    city: "Vellore",
    state: "Tamil Nadu",
    latitude: 12.9237,
    longitude: 79.1350,
    phone: "+91-416-2281000",
    is_24x7: true,
    is_verified: true,
    rating: 4.9,
    has_component_facility: true,
  },
  {
    name: "Apollo Hospitals Blood Bank Chennai",
    address: "21 Greams Lane, Off Greams Road",
    city: "Chennai",
    state: "Tamil Nadu",
    latitude: 13.0604,
    longitude: 80.2496,
    phone: "+91-44-28293333",
    is_24x7: true,
    is_verified: true,
    rating: 4.8,
    has_component_facility: true,
  },
  {
    name: "Sankara Nethralaya Blood Bank",
    address: "21, Pycrofts Garden Road, Nungambakkam",
    city: "Chennai",
    state: "Tamil Nadu",
    latitude: 13.0633,
    longitude: 80.2497,
    phone: "+91-44-28271616",
    is_24x7: false,
    is_verified: true,
    rating: 4.7,
    has_component_facility: true,
  },
  {
    name: "Narayana Health Blood Bank",
    address: "258/A, Bommasandra Industrial Area",
    city: "Bangalore",
    state: "Karnataka",
    latitude: 12.8152,
    longitude: 77.6567,
    phone: "+91-80-27832100",
    is_24x7: true,
    is_verified: true,
    rating: 4.8,
    has_component_facility: true,
  },
  {
    name: "Manipal Hospital Blood Bank",
    address: "98, HAL Airport Road",
    city: "Bangalore",
    state: "Karnataka",
    latitude: 12.9596,
    longitude: 77.6476,
    phone: "+91-80-25024444",
    is_24x7: true,
    is_verified: true,
    rating: 4.7,
    has_component_facility: true,
  },
  {
    name: "NIMHANS Blood Bank",
    address: "Hosur Road",
    city: "Bangalore",
    state: "Karnataka",
    latitude: 12.9416,
    longitude: 77.5965,
    phone: "+91-80-26995000",
    is_24x7: true,
    is_verified: true,
    rating: 4.6,
    has_component_facility: true,
  },
  {
    name: "Sanjay Gandhi PGIMS Blood Bank",
    address: "Rae Bareli Road",
    city: "Lucknow",
    state: "Uttar Pradesh",
    latitude: 26.7493,
    longitude: 80.9532,
    phone: "+91-522-2668700",
    is_24x7: true,
    is_verified: true,
    rating: 4.7,
    has_component_facility: true,
  },
  {
    name: "PGIMER Blood Bank",
    address: "Sector 12",
    city: "Chandigarh",
    state: "Chandigarh",
    latitude: 30.7650,
    longitude: 76.7756,
    phone: "+91-172-2756565",
    is_24x7: true,
    is_verified: true,
    rating: 4.8,
    has_component_facility: true,
  },
  {
    name: "Sankalp India Foundation",
    address: "Jayanagar 4th Block",
    city: "Bangalore",
    state: "Karnataka",
    latitude: 12.9252,
    longitude: 77.5938,
    phone: "+91-80-26630867",
    is_24x7: true,
    is_verified: true,
    rating: 4.9,
    has_component_facility: true,
  },
];

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
