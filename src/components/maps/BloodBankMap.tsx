import { useState, useCallback, memo } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Navigation, Clock } from "lucide-react";

interface BloodBank {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  is_24x7?: boolean;
  is_verified?: boolean;
}

interface BloodBankMapProps {
  bloodBanks: BloodBank[];
  userLocation?: { lat: number; lng: number } | null;
  center?: { lat: number; lng: number };
  onBankSelect?: (bank: BloodBank) => void;
}

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629, // Center of India
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ],
};

function BloodBankMapComponent({
  bloodBanks,
  userLocation,
  center,
  onBankSelect,
}: BloodBankMapProps) {
  const [selectedBank, setSelectedBank] = useState<BloodBank | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    
    if (bloodBanks.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      bloodBanks.forEach((bank) => {
        bounds.extend({ lat: bank.latitude, lng: bank.longitude });
      });
      if (userLocation) {
        bounds.extend(userLocation);
      }
      map.fitBounds(bounds);
    }
  }, [bloodBanks, userLocation]);

  const handleMarkerClick = (bank: BloodBank) => {
    setSelectedBank(bank);
    onBankSelect?.(bank);
  };

  const handleGetDirections = (bank: BloodBank) => {
    const origin = userLocation
      ? `${userLocation.lat},${userLocation.lng}`
      : "";
    const destination = `${bank.latitude},${bank.longitude}`;
    const url = `https://www.google.com/maps/dir/${origin}/${destination}`;
    window.open(url, "_blank");
  };

  return (
    <Card className="overflow-hidden">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center || userLocation || defaultCenter}
        zoom={12}
        onLoad={onLoad}
        options={mapOptions}
      >
        {/* User location marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeColor: "#fff",
              strokeWeight: 3,
            }}
            title="Your Location"
          />
        )}

        {/* Blood bank markers */}
        {bloodBanks.map((bank) => (
          <Marker
            key={bank.id}
            position={{ lat: bank.latitude, lng: bank.longitude }}
            onClick={() => handleMarkerClick(bank)}
            icon={{
              url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
                  <path d="M16 0C7.164 0 0 7.164 0 16c0 12 16 24 16 24s16-12 16-24C32 7.164 24.836 0 16 0z" fill="#DC2626"/>
                  <circle cx="16" cy="14" r="8" fill="#fff"/>
                  <text x="16" y="18" text-anchor="middle" fill="#DC2626" font-size="10" font-weight="bold">+</text>
                </svg>
              `),
              scaledSize: new google.maps.Size(32, 40),
            }}
          />
        ))}

        {/* Info window for selected bank */}
        {selectedBank && (
          <InfoWindow
            position={{ lat: selectedBank.latitude, lng: selectedBank.longitude }}
            onCloseClick={() => setSelectedBank(null)}
          >
            <div className="p-2 max-w-xs">
              <h3 className="font-semibold text-foreground mb-1">{selectedBank.name}</h3>
              <div className="space-y-1 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{selectedBank.address}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <span>{selectedBank.phone}</span>
                </div>
                {selectedBank.is_24x7 && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <Badge variant="success" className="text-xs">24/7 Open</Badge>
                  </div>
                )}
              </div>
              <Button
                size="sm"
                className="w-full"
                onClick={() => handleGetDirections(selectedBank)}
              >
                <Navigation className="h-3 w-3 mr-1" />
                Get Directions
              </Button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </Card>
  );
}

export const BloodBankMap = memo(BloodBankMapComponent);
