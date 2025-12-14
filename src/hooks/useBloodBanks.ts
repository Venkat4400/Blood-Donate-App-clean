import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { calculateDistance } from "./useGeolocation";
import type { Database } from "@/integrations/supabase/types";

type BloodBank = Database["public"]["Tables"]["blood_banks"]["Row"];
type BloodInventory = Database["public"]["Tables"]["blood_inventory"]["Row"];

interface BloodBankWithInventory extends BloodBank {
  inventory: BloodInventory[];
  distance?: number;
}

export function useBloodBanks(userLat?: number | null, userLng?: number | null) {
  const [bloodBanks, setBloodBanks] = useState<BloodBankWithInventory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBloodBanks = async () => {
    setIsLoading(true);
    
    // Fetch blood banks
    const { data: banksData, error: banksError } = await supabase
      .from("blood_banks")
      .select("*")
      .order("name");

    if (banksError) {
      console.error("Error fetching blood banks:", banksError);
      setIsLoading(false);
      return;
    }

    // Fetch inventory for all banks
    const { data: inventoryData, error: inventoryError } = await supabase
      .from("blood_inventory")
      .select("*");

    if (inventoryError) {
      console.error("Error fetching inventory:", inventoryError);
    }

    // Combine data
    const banksWithInventory: BloodBankWithInventory[] = (banksData || []).map((bank) => {
      const inventory = (inventoryData || []).filter(
        (inv) => inv.blood_bank_id === bank.id
      );
      
      const distance = userLat && userLng
        ? calculateDistance(userLat, userLng, bank.latitude, bank.longitude)
        : undefined;

      return { ...bank, inventory, distance };
    });

    // Sort by distance if available
    if (userLat && userLng) {
      banksWithInventory.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    setBloodBanks(banksWithInventory);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBloodBanks();
  }, [userLat, userLng]);

  return {
    bloodBanks,
    isLoading,
    refetch: fetchBloodBanks,
  };
}
