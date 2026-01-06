import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function FloatingSOSButton() {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleSOS = () => {
    toast.success(
      "Emergency SOS activated! Nearby donors and blood banks are being notified immediately.",
      {
        duration: 5000,
      }
    );
    setIsExpanded(false);
    navigate("/request");
  };

  const handleCall = () => {
    window.open("tel:1800-123-4567", "_self");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 p-4 bg-card border border-border rounded-xl shadow-xl w-72"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-semibold">Emergency Options</span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-3">
              <Button
                variant="emergency"
                className="w-full justify-start"
                onClick={handleSOS}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Request Blood Now
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleCall}
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Helpline: 1800-123-4567
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground mt-3">
              Our team is available 24/7 for emergencies
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className={`h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-colors ${
          isExpanded
            ? "bg-muted text-muted-foreground"
            : "bg-destructive text-destructive-foreground animate-pulse"
        }`}
      >
        {isExpanded ? (
          <X className="h-6 w-6" />
        ) : (
          <AlertTriangle className="h-6 w-6" />
        )}
      </motion.button>
    </div>
  );
}
