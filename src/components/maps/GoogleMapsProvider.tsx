import { ReactNode, createContext, useContext } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { Loader2 } from "lucide-react";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

const libraries: ("places" | "geometry")[] = ["places", "geometry"];

interface GoogleMapsContextType {
  isLoaded: boolean;
  loadError: Error | undefined;
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
  loadError: undefined,
});

export const useGoogleMaps = () => useContext(GoogleMapsContext);

interface GoogleMapsProviderProps {
  children: ReactNode;
}

export function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted/50 rounded-lg border border-dashed">
        <div className="text-center p-4">
          <p className="text-muted-foreground">Google Maps API key not configured</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Add VITE_GOOGLE_MAPS_API_KEY to enable maps</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-64 bg-destructive/10 rounded-lg border border-destructive/30">
        <div className="text-center p-4">
          <p className="text-destructive">Failed to load Google Maps</p>
          <p className="text-sm text-destructive/70 mt-1">{loadError.message}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted/50 rounded-lg">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </GoogleMapsContext.Provider>
  );
}
