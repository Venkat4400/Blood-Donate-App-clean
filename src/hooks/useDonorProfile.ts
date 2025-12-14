import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type DonorProfile = Database["public"]["Tables"]["donor_profiles"]["Row"];
type DonorProfileInsert = Database["public"]["Tables"]["donor_profiles"]["Insert"];

export function useDonorProfile() {
  const { user } = useAuth();
  const [donorProfile, setDonorProfile] = useState<DonorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDonorProfile = async () => {
    if (!user) {
      setDonorProfile(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const { data, error } = await supabase
      .from("donor_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching donor profile:", error);
    } else {
      setDonorProfile(data);
    }
    setIsLoading(false);
  };

  const createDonorProfile = async (profile: Omit<DonorProfileInsert, "user_id">) => {
    if (!user) {
      toast.error("You must be logged in");
      return { error: new Error("Not authenticated"), data: null };
    }

    const { data, error } = await supabase
      .from("donor_profiles")
      .insert({ ...profile, user_id: user.id })
      .select()
      .single();

    if (error) {
      console.error("Error creating donor profile:", error);
      toast.error("Failed to create donor profile");
      return { error, data: null };
    }

    // Also add donor role
    await supabase
      .from("user_roles")
      .insert({ user_id: user.id, role: "donor" });

    toast.success("Donor profile created!");
    setDonorProfile(data);
    return { error: null, data };
  };

  const updateDonorProfile = async (updates: Partial<DonorProfile>) => {
    if (!user) {
      toast.error("You must be logged in");
      return { error: new Error("Not authenticated") };
    }

    const { error } = await supabase
      .from("donor_profiles")
      .update(updates)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error updating donor profile:", error);
      toast.error("Failed to update donor profile");
      return { error };
    }

    toast.success("Donor profile updated!");
    fetchDonorProfile();
    return { error: null };
  };

  const toggleAvailability = async () => {
    if (!donorProfile) return;

    const { error } = await supabase
      .from("donor_profiles")
      .update({ is_available: !donorProfile.is_available })
      .eq("user_id", user?.id);

    if (error) {
      toast.error("Failed to update availability");
    } else {
      toast.success(donorProfile.is_available ? "You are now unavailable" : "You are now available");
      fetchDonorProfile();
    }
  };

  useEffect(() => {
    fetchDonorProfile();
  }, [user]);

  return {
    donorProfile,
    isLoading,
    createDonorProfile,
    updateDonorProfile,
    toggleAvailability,
    refetch: fetchDonorProfile,
  };
}
