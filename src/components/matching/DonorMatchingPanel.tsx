import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Search, Loader2, Users, Brain, AlertTriangle, Sparkles, RefreshCw 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDonorMatching, type DonorMatch } from "@/hooks/useDonorMatching";
import { DonorMatchingCard } from "./DonorMatchingCard";
import { useGeolocation } from "@/hooks/useGeolocation";

interface DonorMatchingPanelProps {
  requestId?: string;
  initialBloodType?: string;
  initialUrgency?: "normal" | "urgent" | "emergency";
  onDonorContact?: (donor: DonorMatch) => void;
}

export function DonorMatchingPanel({
  requestId,
  initialBloodType = "",
  initialUrgency = "normal",
  onDonorContact,
}: DonorMatchingPanelProps) {
  const [bloodType, setBloodType] = useState(initialBloodType);
  const [urgency, setUrgency] = useState<"normal" | "urgent" | "emergency">(initialUrgency);
  const [useAI, setUseAI] = useState(true);
  
  const { latitude, longitude } = useGeolocation();
  const { matches, loading, error, aiInsights, totalCompatible, findMatches, clearMatches } = useDonorMatching();

  const handleSearch = async () => {
    if (!bloodType) return;
    
    await findMatches({
      requestId,
      bloodType,
      latitude,
      longitude,
      urgency,
      maxResults: 10,
      useAI,
    });
  };

  const handleContact = (donor: DonorMatch) => {
    if (donor.profile.phone) {
      window.open(`tel:${donor.profile.phone}`);
    }
    onDonorContact?.(donor);
  };

  const handleGetDirections = (donor: DonorMatch) => {
    if (latitude && longitude) {
      const url = `https://www.google.com/maps/dir/${latitude},${longitude}/${donor.profile.city || ""}`;
      window.open(url, "_blank");
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Panel */}
      <Card variant="elevated">
        <CardHeader className="bg-gradient-primary text-primary-foreground">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Powered Donor Matching
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <Label>Blood Type Needed</Label>
              <Select value={bloodType} onValueChange={setBloodType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select blood type" />
                </SelectTrigger>
                <SelectContent>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Urgency Level</Label>
              <Select value={urgency} onValueChange={(v) => setUrgency(v as typeof urgency)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>AI Insights</Label>
              <div className="flex items-center gap-2 h-10">
                <Switch
                  id="ai-mode"
                  checked={useAI}
                  onCheckedChange={setUseAI}
                />
                <Label htmlFor="ai-mode" className="text-sm text-muted-foreground">
                  {useAI ? "Enabled" : "Disabled"}
                </Label>
              </div>
            </div>
            
            <div className="flex items-end gap-2">
              <Button
                variant="hero"
                className="flex-1"
                onClick={handleSearch}
                disabled={!bloodType || loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Find Donors
              </Button>
              {matches.length > 0 && (
                <Button variant="outline" size="icon" onClick={clearMatches}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Location Status */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className={`h-2 w-2 rounded-full ${latitude ? "bg-success animate-pulse" : "bg-warning"}`} />
            {latitude ? "GPS location active - matching nearby donors" : "Enable location for distance-based matching"}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <AnimatePresence>
        {aiInsights && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">AI Insights</h4>
                  <p className="text-sm text-muted-foreground">{aiInsights}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      {error && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {matches.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg text-foreground">
                Matched Donors
              </h3>
              <Badge variant="secondary">{matches.length} of {totalCompatible} compatible</Badge>
            </div>
            {urgency === "emergency" && (
              <Badge variant="urgent" className="animate-pulse">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Emergency Priority
              </Badge>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {matches.map((match, index) => (
              <DonorMatchingCard
                key={match.donor_id}
                match={match}
                rank={index + 1}
                onContact={handleContact}
                onGetDirections={handleGetDirections}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && matches.length === 0 && bloodType && (
        <Card variant="feature">
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg text-foreground mb-2">
              No Donors Found
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Click "Find Donors" to search for compatible blood donors based on blood type, 
              location, and reliability scores.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
