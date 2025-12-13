import { Card, CardContent } from "@/components/ui/card";
import { 
  MapPin, 
  Bell, 
  Shield, 
  Zap, 
  Heart,
  Clock,
  QrCode,
  Trophy,
  BarChart3,
  Smartphone
} from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "GPS-Based Matching",
    description: "Find nearby donors and blood banks instantly using real-time location tracking",
    color: "text-info",
    bgColor: "bg-info/10",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Get instant alerts for blood requests, donation reminders, and camp updates",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    icon: Shield,
    title: "Verified Donors",
    description: "All donors undergo strict verification for safe and reliable donations",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    icon: Zap,
    title: "Emergency SOS",
    description: "One-tap emergency blood requests with auto-escalation to nearby donors",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    icon: QrCode,
    title: "QR Verification",
    description: "Scan and verify donor credentials instantly with secure QR codes",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Trophy,
    title: "Rewards System",
    description: "Earn points and badges for donations, unlock exclusive rewards",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track donation history, health stats, and community impact",
    color: "text-info",
    bgColor: "bg-info/10",
  },
  {
    icon: Clock,
    title: "Appointment Booking",
    description: "Schedule donations at your convenience, skip the wait times",
    color: "text-success",
    bgColor: "bg-success/10",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Heart className="h-4 w-4" />
            Platform Features
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Save Lives
          </h2>
          <p className="text-muted-foreground text-lg">
            Our smart platform connects donors, recipients, hospitals, and blood banks 
            with cutting-edge technology for faster, safer blood donation.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              variant="feature"
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className={`h-14 w-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}>
                  <feature.icon className={`h-7 w-7 ${feature.color}`} />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile App CTA */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-secondary text-secondary-foreground relative overflow-hidden">
          <div className="absolute right-0 top-0 w-1/3 h-full opacity-10">
            <Smartphone className="w-full h-full" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <h3 className="font-display text-2xl font-bold mb-3">
              Download the LifeFlow App
            </h3>
            <p className="text-secondary-foreground/80 mb-6">
              Get the full experience on your mobile. Receive instant notifications, 
              find donors on-the-go, and track your donation journey.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-3 px-6 py-3 rounded-xl bg-secondary-foreground text-secondary hover:opacity-90 transition-opacity">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <div className="text-left">
                  <p className="text-xs opacity-80">Download on</p>
                  <p className="font-semibold">App Store</p>
                </div>
              </button>
              <button className="flex items-center gap-3 px-6 py-3 rounded-xl bg-secondary-foreground text-secondary hover:opacity-90 transition-opacity">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z"/>
                </svg>
                <div className="text-left">
                  <p className="text-xs opacity-80">Get it on</p>
                  <p className="font-semibold">Google Play</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
