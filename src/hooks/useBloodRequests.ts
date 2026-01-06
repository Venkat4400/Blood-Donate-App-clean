import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type BloodRequest = Database["public"]["Tables"]["blood_requests"]["Row"];
type BloodRequestInsert = Database["public"]["Tables"]["blood_requests"]["Insert"];

export function useBloodRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("blood_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching blood requests:", error);
      toast.error("Failed to fetch blood requests");
    } else {
      setRequests(data || []);
    }
    setIsLoading(false);
  };

  const createRequest = async (request: Omit<BloodRequestInsert, "requester_id">) => {
    if (!user) {
      toast.error("You must be logged in to create a request");
      return { error: new Error("Not authenticated"), data: null };
    }

    const { data, error } = await supabase
      .from("blood_requests")
      .insert({ ...request, requester_id: user.id })
      .select()
      .single();

    if (error) {
      console.error("Error creating blood request:", error);
      toast.error("Failed to create blood request");
      return { error, data: null };
    }

    toast.success("Blood request created successfully!");
    fetchRequests();
    return { error: null, data };
  };

  const updateRequest = async (id: string, updates: Partial<BloodRequest>) => {
    const { error } = await supabase
      .from("blood_requests")
      .update(updates)
      .eq("id", id);

    if (error) {
      console.error("Error updating blood request:", error);
      toast.error("Failed to update blood request");
      return { error };
    }

    toast.success("Blood request updated!");
    fetchRequests();
    return { error: null };
  };

  const deleteRequest = async (id: string) => {
    const { error } = await supabase
      .from("blood_requests")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting blood request:", error);
      toast.error("Failed to delete blood request");
      return { error };
    }

    toast.success("Blood request deleted!");
    fetchRequests();
    return { error: null };
  };

  // Real-time subscription
  useEffect(() => {
    fetchRequests();

    const channel = supabase
      .channel("blood_requests_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "blood_requests",
        },
        (payload) => {
          console.log("Blood request change:", payload);
          fetchRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    requests,
    isLoading,
    createRequest,
    updateRequest,
    deleteRequest,
    refetch: fetchRequests,
  };
}
