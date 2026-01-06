import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecentDonors } from "@/components/dashboard/RecentDonors";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  Heart, 
  Droplets, 
  MapPin, 
  Calendar,
  Bell,
  Settings,
  Award,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";

interface DonorProfile {
  blood_type: string;
  total_donations: number;
  last_donation_date: string | null;
  is_available: boolean;
  reliability_score: number;
}

interface BloodRequest {
  id: string;
  blood_type: string;
  urgency: string;
  status: string;
  city: string;
  created_at: string;
  patient_name: string;
}

const Dashboard = () => {
  const { user, profile, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [donorProfile, setDonorProfile] = useState<DonorProfile | null>(null);
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }

    if (user) {
      fetchDashboardData();
    }
  }, [user, authLoading, navigate]);

  const fetchDashboardData = async () => {
    try {
      // Fetch donor profile
      const { data: donorData } = await supabase
        .from("donor_profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (donorData) {
        setDonorProfile(donorData);
      }

      // Fetch user's blood requests
      const { data: requestsData } = await supabase
        .from("blood_requests")
        .select("*")
        .eq("requester_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (requestsData) {
        setBloodRequests(requestsData);
      }

      // Fetch notifications
      const { data: notifData } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (notifData) {
        setNotifications(notifData);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Real-time subscription for notifications
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("dashboard-updates")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        (payload) => {
          setNotifications((prev) => [payload.new as any, ...prev].slice(0, 5));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "matched":
        return "info";
      case "fulfilled":
        return "success";
      default:
        return "secondary";
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "emergency":
        return <Badge variant="destructive">Emergency</Badge>;
      case "urgent":
        return <Badge variant="warning">Urgent</Badge>;
      default:
        return <Badge variant="secondary">Normal</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <div className="container mx-auto px-4">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Welcome back, {profile?.full_name?.split(" ")[0] || "Hero"}! 👋
            </h1>
            <p className="text-muted-foreground">
              {donorProfile?.is_available 
                ? "You're available to donate. Thank you for being a lifesaver!"
                : "Update your availability to help save more lives."}
            </p>
          </motion.div>

          {/* Quick Stats */}
          {donorProfile && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card variant="stat">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Droplets className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{donorProfile.blood_type}</p>
                        <p className="text-xs text-muted-foreground">Blood Type</p>
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
                      <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                        <Heart className="h-6 w-6 text-success" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{donorProfile.total_donations || 0}</p>
                        <p className="text-xs text-muted-foreground">Donations</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card variant="stat">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                        <Award className="h-6 w-6 text-warning" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{donorProfile.reliability_score?.toFixed(1) || "5.0"}</p>
                        <p className="text-xs text-muted-foreground">Reliability</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card variant="stat">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${donorProfile.is_available ? 'bg-success/10' : 'bg-muted'}`}>
                        {donorProfile.is_available ? (
                          <CheckCircle className="h-6 w-6 text-success" />
                        ) : (
                          <AlertCircle className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="text-lg font-bold text-foreground">
                          {donorProfile.is_available ? "Available" : "Unavailable"}
                        </p>
                        <p className="text-xs text-muted-foreground">Status</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="requests">My Requests</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
              <TabsTrigger value="notifications">
                Notifications
                {notifications.filter(n => !n.is_read).length > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                    {notifications.filter(n => !n.is_read).length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-3">
                    <Button variant="hero" className="h-auto py-4" onClick={() => navigate("/donate")}>
                      <div className="text-center">
                        <Heart className="h-6 w-6 mx-auto mb-2" />
                        <span>Schedule Donation</span>
                      </div>
                    </Button>
                    <Button variant="outline" className="h-auto py-4" onClick={() => navigate("/request")}>
                      <div className="text-center">
                        <Droplets className="h-6 w-6 mx-auto mb-2" />
                        <span>Request Blood</span>
                      </div>
                    </Button>
                    <Button variant="outline" className="h-auto py-4" onClick={() => navigate("/blood-banks")}>
                      <div className="text-center">
                        <MapPin className="h-6 w-6 mx-auto mb-2" />
                        <span>Find Blood Banks</span>
                      </div>
                    </Button>
                    <Button variant="outline" className="h-auto py-4" onClick={() => navigate("/education")}>
                      <div className="text-center">
                        <TrendingUp className="h-6 w-6 mx-auto mb-2" />
                        <span>Learn More</span>
                      </div>
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {bloodRequests.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">No recent activity</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {bloodRequests.slice(0, 3).map((request) => (
                          <div key={request.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                            <div className="flex items-center gap-3">
                              <Badge variant="bloodType">{request.blood_type}</Badge>
                              <div>
                                <p className="text-sm font-medium text-foreground">Blood Request</p>
                                <p className="text-xs text-muted-foreground">{request.city}</p>
                              </div>
                            </div>
                            <Badge variant={getStatusColor(request.status) as any}>
                              {request.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="requests">
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>My Blood Requests</span>
                    <Button variant="hero" size="sm" onClick={() => navigate("/request")}>
                      New Request
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {bloodRequests.length === 0 ? (
                    <div className="text-center py-12">
                      <Droplets className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-medium text-foreground mb-2">No requests yet</p>
                      <p className="text-muted-foreground mb-4">Create a blood request when you need it</p>
                      <Button variant="hero" onClick={() => navigate("/request")}>
                        Create Request
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bloodRequests.map((request) => (
                        <motion.div
                          key={request.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center justify-between p-4 rounded-lg border border-border bg-card"
                        >
                          <div className="flex items-center gap-4">
                            <Badge variant="bloodType" className="text-lg px-3 py-1">
                              {request.blood_type}
                            </Badge>
                            <div>
                              <p className="font-medium text-foreground">{request.patient_name}</p>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {request.city}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {getUrgencyBadge(request.urgency)}
                            <Badge variant={getStatusColor(request.status) as any}>
                              {request.status}
                            </Badge>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="community">
              <RecentDonors />
            </TabsContent>

            <TabsContent value="notifications">
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {notifications.length === 0 ? (
                    <div className="text-center py-12">
                      <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-medium text-foreground mb-2">No notifications</p>
                      <p className="text-muted-foreground">You're all caught up!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 rounded-lg border ${notif.is_read ? 'bg-muted/30 border-border' : 'bg-primary/5 border-primary/20'}`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-foreground">{notif.title}</p>
                              <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                            </div>
                            {!notif.is_read && (
                              <div className="h-2 w-2 rounded-full bg-primary"></div>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(notif.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
