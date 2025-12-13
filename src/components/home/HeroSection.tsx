import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Droplets, Users, Clock, ArrowRight, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero min-h-[90vh] flex items-center">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/50 rounded-full blur-3xl" />
        
        {/* Floating blood drops */}
        <div className="absolute top-20 right-[20%] animate-float" style={{ animationDelay: "0s" }}>
          <Droplets className="h-8 w-8 text-primary/20" />
        </div>
        <div className="absolute top-40 left-[15%] animate-float" style={{ animationDelay: "1s" }}>
          <Droplets className="h-6 w-6 text-primary/15" />
        </div>
        <div className="absolute bottom-40 right-[10%] animate-float" style={{ animationDelay: "2s" }}>
          <Droplets className="h-10 w-10 text-primary/20" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-slide-up">
            <div className="flex items-center gap-2">
              <Badge variant="bloodType" className="text-sm px-3 py-1">
                <Heart className="h-3 w-3 mr-1 fill-primary" />
                Trusted by 50,000+ donors
              </Badge>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
              Every Drop of{" "}
              <span className="text-gradient-primary">Blood</span>{" "}
              Can Save a{" "}
              <span className="relative inline-block">
                Life
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 10C50 2 150 2 198 10" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Join our community of life-savers. Whether you want to donate blood, 
              find a donor, or locate the nearest blood bank – we've got you covered. 
              Your one donation can save up to 3 lives.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/donate">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  <Heart className="h-5 w-5" />
                  Donate Now
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <Link to="/request">
                <Button variant="hero-outline" size="xl" className="w-full sm:w-auto">
                  Request Blood
                </Button>
              </Link>
            </div>

            {/* Emergency CTA */}
            <div className="p-4 rounded-xl border-2 border-destructive/30 bg-destructive/5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Need blood urgently?</p>
                <p className="text-sm text-muted-foreground">Get matched with nearby donors in minutes</p>
              </div>
              <Link to="/emergency">
                <Button variant="emergency" size="sm">
                  SOS
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Content - Stats Cards */}
          <div className="relative lg:pl-8">
            <div className="grid grid-cols-2 gap-4">
              {/* Main Stat Card */}
              <div className="col-span-2 p-6 rounded-2xl bg-gradient-primary text-primary-foreground shadow-xl shadow-primary/20 animate-scale-in">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary-foreground/80 text-sm font-medium">Lives Saved</p>
                    <p className="font-display text-4xl font-bold mt-1">152,847</p>
                  </div>
                  <div className="h-16 w-16 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                    <Heart className="h-8 w-8 fill-primary-foreground" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-primary-foreground/20 flex gap-6">
                  <div>
                    <p className="text-2xl font-bold">24/7</p>
                    <p className="text-xs text-primary-foreground/70">Support</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">500+</p>
                    <p className="text-xs text-primary-foreground/70">Blood Banks</p>
                  </div>
                </div>
              </div>

              {/* Donors Card */}
              <div className="p-5 rounded-xl bg-card shadow-card border border-border/50 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                <div className="h-12 w-12 rounded-lg bg-info/10 flex items-center justify-center mb-3">
                  <Users className="h-6 w-6 text-info" />
                </div>
                <p className="font-display text-2xl font-bold text-foreground">50K+</p>
                <p className="text-sm text-muted-foreground">Active Donors</p>
              </div>

              {/* Response Time Card */}
              <div className="p-5 rounded-xl bg-card shadow-card border border-border/50 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center mb-3">
                  <Clock className="h-6 w-6 text-success" />
                </div>
                <p className="font-display text-2xl font-bold text-foreground">&lt;30min</p>
                <p className="text-sm text-muted-foreground">Avg Response</p>
              </div>

              {/* Blood Availability */}
              <div className="col-span-2 p-5 rounded-xl bg-card shadow-card border border-border/50 animate-slide-up" style={{ animationDelay: "0.3s" }}>
                <p className="text-sm font-medium text-foreground mb-3">Current Blood Availability</p>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { type: "A+", status: "available" },
                    { type: "A-", status: "low" },
                    { type: "B+", status: "available" },
                    { type: "B-", status: "available" },
                    { type: "AB+", status: "available" },
                    { type: "AB-", status: "low" },
                    { type: "O+", status: "available" },
                    { type: "O-", status: "urgent" },
                  ].map((blood) => (
                    <Badge
                      key={blood.type}
                      variant={blood.status as "available" | "low" | "urgent"}
                      className="px-3 py-1"
                    >
                      {blood.type}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
