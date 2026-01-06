import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GoogleMapsProvider } from "@/components/maps/GoogleMapsProvider";
import { LiveBloodBankMap } from "@/components/maps/LiveBloodBankMap";
import { useVerifiedBloodBanks } from "@/hooks/useVerifiedBloodBanks";
import { 
  MapPin, Phone, Clock, Search, Navigation, Star, Filter, Building2, Shield, Loader2, Map, List, AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";

const BloodBanks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBloodType, setSelectedBloodType] = useState("");
  const [radiusKm, setRadiusKm] = useState(50);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  
  const { bloodBanks, loading, error, userLocation, refetch } = useVerifiedBloodBanks({
    radiusKm,
    onlyVerified: true,
    bloodType: selectedBloodType,
  });

  const filteredBanks = bloodBanks.filter((bank) => {
    const matchesSearch = bank.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bank.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bank.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Shield className="h-4 w-4" />
              Verified Blood Banks
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Find Blood Banks Near You
            </h1>
            <p className="text-muted-foreground">
              {userLocation 
                ? `Showing ${filteredBanks.length} verified blood banks within ${radiusKm}km of your location`
                : "Enable location to find blood banks near you"}
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name, city..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedBloodType} onValueChange={setSelectedBloodType}>
              <SelectTrigger className="w-full md:w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Blood Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={radiusKm.toString()} onValueChange={(v) => setRadiusKm(Number(v))}>
              <SelectTrigger className="w-full md:w-36">
                <Navigation className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">Within 10 km</SelectItem>
                <SelectItem value="25">Within 25 km</SelectItem>
                <SelectItem value="50">Within 50 km</SelectItem>
                <SelectItem value="100">Within 100 km</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button variant={viewMode === "map" ? "hero" : "outline"} size="icon" onClick={() => setViewMode("map")}>
                <Map className="h-4 w-4" />
              </Button>
              <Button variant={viewMode === "list" ? "hero" : "outline"} size="icon" onClick={() => setViewMode("list")}>
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <Card className="mb-6 border-destructive/50 bg-destructive/10">
              <CardContent className="p-4 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <p className="text-destructive">{error}</p>
                <Button variant="outline" size="sm" onClick={refetch}>Retry</Button>
              </CardContent>
            </Card>
          )}

          {/* Map View */}
          {viewMode === "map" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
              <GoogleMapsProvider>
                <LiveBloodBankMap
                  bloodBanks={filteredBanks}
                  userLocation={userLocation}
                  loading={loading}
                  height="500px"
                  showClusters={filteredBanks.length > 10}
                />
              </GoogleMapsProvider>
            </motion.div>
          )}

          {/* Results Count */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-muted-foreground">
              {loading ? "Loading..." : `Showing ${filteredBanks.length} verified blood banks`}
            </p>
          </div>

          {/* List View */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredBanks.map((bank, index) => (
                <motion.div
                  key={bank.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card variant="feature">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-display font-semibold text-lg text-foreground">{bank.name}</h3>
                            {bank.is_verified && (
                              <Badge variant="success" className="text-xs"><Shield className="h-3 w-3 mr-1" />Verified</Badge>
                            )}
                          </div>
                          {bank.rating && (
                            <div className="flex items-center gap-1 text-sm">
                              <Star className="h-4 w-4 fill-warning text-warning" />
                              <span className="font-medium">{bank.rating}</span>
                            </div>
                          )}
                        </div>
                        {bank.distance !== undefined && (
                          <Badge variant="bloodType" className="text-lg px-3 py-1">
                            {bank.distance.toFixed(1)} km
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary shrink-0" />
                          <span>{bank.address}, {bank.city}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary shrink-0" />
                          <span>{bank.is_24x7 ? "Open 24/7" : "Check hours"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-primary shrink-0" />
                          <a href={`tel:${bank.phone}`} className="hover:text-primary">{bank.phone}</a>
                        </div>
                        {bank.travelTime && (
                          <div className="flex items-center gap-2">
                            <Navigation className="h-4 w-4 text-primary shrink-0" />
                            <span>~{bank.travelTime} min drive</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          variant="hero" 
                          className="flex-1"
                          onClick={() => {
                            const origin = userLocation ? `${userLocation.lat},${userLocation.lng}` : "";
                            window.open(`https://www.google.com/maps/dir/${origin}/${bank.latitude},${bank.longitude}`, "_blank");
                          }}
                        >
                          <Navigation className="h-4 w-4" />
                          Directions
                        </Button>
                        <Button variant="outline" size="icon" asChild>
                          <a href={`tel:${bank.phone}`}><Phone className="h-4 w-4" /></a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BloodBanks;
