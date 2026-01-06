import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { Users, Droplets, TrendingUp, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface DonorStats {
  totalDonors: number;
  recentDonors: Array<{
    id: string;
    full_name: string;
    city: string | null;
    blood_type: string;
    created_at: string;
  }>;
  bloodGroupCounts: Record<string, number>;
}

export function RecentDonors() {
  const [stats, setStats] = useState<DonorStats>({
    totalDonors: 0,
    recentDonors: [],
    bloodGroupCounts: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonorStats = async () => {
      try {
        // Fetch recent donor profiles with their profile info
        const { data: donorProfiles, error: donorError } = await supabase
          .from("donor_profiles")
          .select(`
            id,
            blood_type,
            created_at,
            user_id
          `)
          .order("created_at", { ascending: false })
          .limit(10);

        if (donorError) throw donorError;

        // Get profile info for each donor
        const donorsWithProfiles = await Promise.all(
          (donorProfiles || []).map(async (donor) => {
            const { data: profile } = await supabase
              .from("profiles")
              .select("full_name, city")
              .eq("user_id", donor.user_id)
              .single();

            return {
              id: donor.id,
              full_name: profile?.full_name || "Anonymous Donor",
              city: profile?.city || null,
              blood_type: donor.blood_type,
              created_at: donor.created_at,
            };
          })
        );

        // Count donors by blood type
        const { data: allDonors, error: countError } = await supabase
          .from("donor_profiles")
          .select("blood_type");

        if (countError) throw countError;

        const bloodGroupCounts: Record<string, number> = {};
        (allDonors || []).forEach((donor) => {
          bloodGroupCounts[donor.blood_type] = (bloodGroupCounts[donor.blood_type] || 0) + 1;
        });

        setStats({
          totalDonors: allDonors?.length || 0,
          recentDonors: donorsWithProfiles,
          bloodGroupCounts,
        });
      } catch (error) {
        console.error("Error fetching donor stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonorStats();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("donor-updates")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "donor_profiles" },
        () => {
          fetchDonorStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  if (loading) {
    return (
      <Card variant="elevated">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="h-2 bg-muted rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="stat">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.totalDonors}</p>
                  <p className="text-xs text-muted-foreground">Total Donors</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="stat">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.recentDonors.filter(d => {
                      const date = new Date(d.created_at);
                      const now = new Date();
                      return (now.getTime() - date.getTime()) < 86400000 * 7;
                    }).length}
                  </p>
                  <p className="text-xs text-muted-foreground">This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="col-span-2"
        >
          <Card variant="stat">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-2">Donors by Blood Type</p>
              <div className="flex flex-wrap gap-2">
                {bloodTypes.map((type) => (
                  <Badge key={type} variant="bloodType" className="text-xs">
                    {type}: {stats.bloodGroupCounts[type] || 0}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Donors List */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-primary" />
            Recently Registered Donors
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentDonors.length === 0 ? (
            <div className="text-center py-8">
              <Droplets className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No donors registered yet</p>
              <p className="text-sm text-muted-foreground">Be the first to join our community!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentDonors.map((donor, index) => (
                <motion.div
                  key={donor.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm">
                        {getInitials(donor.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        {donor.full_name.split(" ")[0]}***
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {donor.city || "Location hidden"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="bloodType" className="font-bold">
                      {donor.blood_type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {getTimeAgo(donor.created_at)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
