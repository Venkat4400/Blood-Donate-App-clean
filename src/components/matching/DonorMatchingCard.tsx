import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  User, Phone, MapPin, Star, Award, Heart, Navigation, Clock, Shield 
} from "lucide-react";
import { motion } from "framer-motion";
import type { DonorMatch } from "@/hooks/useDonorMatching";

interface DonorMatchingCardProps {
  match: DonorMatch;
  rank: number;
  onContact?: (donor: DonorMatch) => void;
  onGetDirections?: (donor: DonorMatch) => void;
}

export function DonorMatchingCard({ match, rank, onContact, onGetDirections }: DonorMatchingCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-muted-foreground";
  };

  const getScoreBadgeVariant = (score: number): "success" | "warning" | "default" => {
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "default";
  };

  const formatLastDonation = (date: string | null) => {
    if (!date) return "Never donated";
    const days = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    if (days < 30) return `${days} days ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1 }}
    >
      <Card variant="feature" className="hover:shadow-lg transition-all duration-300">
        <CardContent className="p-5">
          {/* Header with Rank and Score */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                {rank <= 3 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-warning flex items-center justify-center">
                    <span className="text-xs font-bold text-warning-foreground">{rank}</span>
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{match.profile.full_name}</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {match.profile.city && (
                    <>
                      <MapPin className="h-3 w-3" />
                      <span>{match.profile.city}, {match.profile.state}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <Badge variant="bloodType" className="text-lg px-3 py-1 mb-1">
                {match.blood_type}
              </Badge>
              <div className={`text-sm font-medium ${getScoreColor(match.match_score)}`}>
                {match.match_score}% match
              </div>
            </div>
          </div>

          {/* Match Score Breakdown */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Match Score</span>
              <Badge variant={getScoreBadgeVariant(match.match_score)}>
                {match.match_score >= 80 ? "Excellent" : match.match_score >= 60 ? "Good" : "Fair"}
              </Badge>
            </div>
            <Progress value={match.match_score} className="h-2" />
          </div>

          {/* Score Factors */}
          <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
            {match.score_factors.bloodCompatibility && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Heart className="h-3 w-3 text-primary" />
                <span>Blood: +{match.score_factors.bloodCompatibility}</span>
              </div>
            )}
            {match.score_factors.distance && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Navigation className="h-3 w-3 text-primary" />
                <span>Distance: +{match.score_factors.distance}</span>
              </div>
            )}
            {match.score_factors.reliability && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Shield className="h-3 w-3 text-primary" />
                <span>Reliability: +{match.score_factors.reliability}</span>
              </div>
            )}
            {match.score_factors.urgencyBoost && (
              <div className="flex items-center gap-1 text-success">
                <Award className="h-3 w-3" />
                <span>Urgency: +{match.score_factors.urgencyBoost}</span>
              </div>
            )}
          </div>

          {/* Donor Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-primary mb-1">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-semibold">{match.reliability_score.toFixed(1)}</span>
              </div>
              <span className="text-xs text-muted-foreground">Reliability</span>
            </div>
            <div className="text-center border-x border-border">
              <div className="font-semibold text-primary mb-1">{match.total_donations}</div>
              <span className="text-xs text-muted-foreground">Donations</span>
            </div>
            <div className="text-center">
              {match.distance_km !== null ? (
                <>
                  <div className="font-semibold text-primary mb-1">{match.distance_km.toFixed(1)} km</div>
                  <span className="text-xs text-muted-foreground">Away</span>
                </>
              ) : (
                <>
                  <div className="font-semibold text-muted-foreground mb-1">--</div>
                  <span className="text-xs text-muted-foreground">Distance</span>
                </>
              )}
            </div>
          </div>

          {/* Last Donation */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Clock className="h-4 w-4" />
            <span>Last donation: {formatLastDonation(match.last_donation_date)}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {match.profile.phone && (
              <Button
                variant="hero"
                className="flex-1"
                onClick={() => onContact?.(match)}
              >
                <Phone className="h-4 w-4 mr-2" />
                Contact
              </Button>
            )}
            {match.distance_km !== null && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => onGetDirections?.(match)}
              >
                <Navigation className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
