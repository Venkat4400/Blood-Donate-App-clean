import { useState, useCallback, memo, useEffect, useMemo } from "react";
import { GoogleMap, Marker, InfoWindow, MarkerClusterer } from "@react-google-maps/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Navigation, Clock, Shield, Star, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGoogleMaps } from "./GoogleMapsProvider";

interface BloodBank {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  is_24x7?: boolean;
  is_verified?: boolean;
  rating?: number;
  city?: string;
  state?: string;
  distance?: number;
  travelTime?: number;
}

interface LiveBloodBankMapProps {
  bloodBanks: BloodBank[];
  userLocation?: { lat: number; lng: number } | null;
  center?: { lat: number; lng: number };
  onBankSelect?: (bank: BloodBank) => void;
  loading?: boolean;
  height?: string;
  showClusters?: boolean;
}

const defaultCenter = {
  lat: 28.6139,
  lng: 77.2090, // New Delhi
};

const mapStyles = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.medical",
    elementType: "all",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ lightness: 100 }],
  },
];

const darkMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "poi.medical",
    elementType: "all",
    stylers: [{ visibility: "on" }],
  },
];

function LiveBloodBankMapComponent({
  bloodBanks,
  userLocation,
  center,
  onBankSelect,
  loading = false,
  height = "500px",
  showClusters = true,
}: LiveBloodBankMapProps) {
  const { isLoaded } = useGoogleMaps();
  const [selectedBank, setSelectedBank] = useState<BloodBank | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const mapContainerStyle = {
    width: "100%",
    height,
  };

  const mapOptions = useMemo(() => {
    if (!isLoaded) return {};
    return {
      disableDefaultUI: false,
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: true,
      styles: isDarkMode ? darkMapStyles : mapStyles,
    } as google.maps.MapOptions;
  }, [isLoaded, isDarkMode]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    
    if (bloodBanks.length > 0 && isLoaded) {
      const bounds = new google.maps.LatLngBounds();
      bloodBanks.forEach((bank) => {
        bounds.extend({ lat: bank.latitude, lng: bank.longitude });
      });
      if (userLocation) {
        bounds.extend(userLocation);
      }
      map.fitBounds(bounds);
    }
  }, [bloodBanks, userLocation, isLoaded]);

  const handleMarkerClick = (bank: BloodBank) => {
    setSelectedBank(bank);
    onBankSelect?.(bank);
    map?.panTo({ lat: bank.latitude, lng: bank.longitude });
  };

  const handleGetDirections = (bank: BloodBank) => {
    const origin = userLocation
      ? `${userLocation.lat},${userLocation.lng}`
      : "";
    const destination = `${bank.latitude},${bank.longitude}`;
    const url = `https://www.google.com/maps/dir/${origin}/${destination}`;
    window.open(url, "_blank");
  };

  const createMarkerIcon = useCallback((isVerified: boolean, is24x7: boolean) => {
    if (!isLoaded) return undefined;
    
    const color = isVerified ? "#DC2626" : "#6B7280";
    return {
      url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50">
          <defs>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
            </filter>
          </defs>
          <path d="M20 0C9.0 0 0 9 0 20c0 15 20 30 20 30s20-15 20-30C40 9 31 0 20 0z" fill="${color}" filter="url(#shadow)"/>
          <circle cx="20" cy="18" r="10" fill="#fff"/>
          <path d="M20 11v14M13 18h14" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
          ${is24x7 ? '<circle cx="32" cy="8" r="6" fill="#10B981"/><text x="32" y="11" text-anchor="middle" fill="#fff" font-size="8" font-weight="bold">24</text>' : ''}
        </svg>
      `),
      scaledSize: new google.maps.Size(40, 50),
      anchor: new google.maps.Point(20, 50),
    };
  }, [isLoaded]);

  if (loading || !isLoaded) {
    return (
      <Card className="overflow-hidden">
        <div 
          className="flex items-center justify-center bg-muted/50"
          style={{ height }}
        >
          <div className="text-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-2" />
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        </div>
      </Card>
    );
  }

  const userLocationIcon = {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 12,
    fillColor: "#3B82F6",
    fillOpacity: 1,
    strokeColor: "#fff",
    strokeWeight: 3,
  };

  const markerAnimation = google.maps.Animation.DROP;

  return (
    <Card className="overflow-hidden shadow-lg">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center || userLocation || defaultCenter}
        zoom={12}
        onLoad={onLoad}
        options={mapOptions}
      >
        {/* User location marker with pulse effect */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={userLocationIcon}
            title="Your Location"
            zIndex={1000}
          />
        )}

        {/* Blood bank markers with clustering */}
        {showClusters && bloodBanks.length > 10 ? (
          <MarkerClusterer>
            {(clusterer) => (
              <>
                {bloodBanks.map((bank) => (
                  <Marker
                    key={bank.id}
                    position={{ lat: bank.latitude, lng: bank.longitude }}
                    onClick={() => handleMarkerClick(bank)}
                    clusterer={clusterer}
                    icon={createMarkerIcon(bank.is_verified || false, bank.is_24x7 || false)}
                    animation={markerAnimation}
                  />
                ))}
              </>
            )}
          </MarkerClusterer>
        ) : (
          bloodBanks.map((bank) => (
            <Marker
              key={bank.id}
              position={{ lat: bank.latitude, lng: bank.longitude }}
              onClick={() => handleMarkerClick(bank)}
              icon={createMarkerIcon(bank.is_verified || false, bank.is_24x7 || false)}
              animation={markerAnimation}
            />
          ))
        )}

        {/* Info window for selected bank */}
        <AnimatePresence>
          {selectedBank && (
            <InfoWindow
              position={{ lat: selectedBank.latitude, lng: selectedBank.longitude }}
              onCloseClick={() => setSelectedBank(null)}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-3 max-w-xs min-w-[250px]"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-foreground text-sm">{selectedBank.name}</h3>
                  {selectedBank.is_verified && (
                    <Badge variant="success" className="text-xs flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-1.5 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-primary shrink-0" />
                    <span className="line-clamp-2">{selectedBank.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3 w-3 text-primary shrink-0" />
                    <a href={`tel:${selectedBank.phone}`} className="hover:text-primary">
                      {selectedBank.phone}
                    </a>
                  </div>
                  {selectedBank.is_24x7 && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3 text-success shrink-0" />
                      <span className="text-success font-medium">Open 24/7</span>
                    </div>
                  )}
                  {selectedBank.rating && (
                    <div className="flex items-center gap-1.5">
                      <Star className="h-3 w-3 fill-warning text-warning shrink-0" />
                      <span>{selectedBank.rating.toFixed(1)} rating</span>
                    </div>
                  )}
                  {selectedBank.distance !== undefined && (
                    <div className="flex items-center gap-1.5">
                      <Navigation className="h-3 w-3 text-primary shrink-0" />
                      <span>{selectedBank.distance.toFixed(1)} km away</span>
                      {selectedBank.travelTime && (
                        <span className="text-muted-foreground">
                          (~{selectedBank.travelTime} min)
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 h-8 text-xs"
                    onClick={() => handleGetDirections(selectedBank)}
                  >
                    <Navigation className="h-3 w-3 mr-1" />
                    Directions
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8"
                    asChild
                  >
                    <a href={`tel:${selectedBank.phone}`}>
                      <Phone className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </motion.div>
            </InfoWindow>
          )}
        </AnimatePresence>
      </GoogleMap>
    </Card>
  );
}

export const LiveBloodBankMap = memo(LiveBloodBankMapComponent);
