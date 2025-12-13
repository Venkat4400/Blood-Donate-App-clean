import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MapPin, Clock, Phone, ArrowRight, Droplets } from "lucide-react";
import { Link } from "react-router-dom";

const bloodTypes = [
  { type: "A+", available: 85, status: "available", donors: 1234 },
  { type: "A-", available: 32, status: "low", donors: 456 },
  { type: "B+", available: 78, status: "available", donors: 987 },
  { type: "B-", available: 45, status: "available", donors: 321 },
  { type: "AB+", available: 92, status: "available", donors: 234 },
  { type: "AB-", available: 28, status: "low", donors: 123 },
  { type: "O+", available: 71, status: "available", donors: 1567 },
  { type: "O-", available: 15, status: "urgent", donors: 789 },
];

const nearbyBanks = [
  {
    name: "City Central Blood Bank",
    distance: "1.2 km",
    availability: ["A+", "B+", "O+", "AB+"],
    phone: "+91 98765 43210",
    status: "Open 24/7",
  },
  {
    name: "Red Cross Blood Center",
    distance: "2.8 km",
    availability: ["A+", "A-", "B+", "O+", "O-"],
    phone: "+91 98765 43211",
    status: "Open till 8 PM",
  },
  {
    name: "Government Hospital Blood Bank",
    distance: "3.5 km",
    availability: ["All types"],
    phone: "+91 98765 43212",
    status: "Open 24/7",
  },
];

export function BloodAvailabilitySection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Droplets className="h-4 w-4" />
            Real-time Data
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Blood Availability Dashboard
          </h2>
          <p className="text-muted-foreground text-lg">
            Live tracking of blood inventory across our network. 
            Find what you need, when you need it.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Blood Types Grid */}
          <div className="lg:col-span-2">
            <Card variant="elevated" className="overflow-hidden">
              <CardHeader className="bg-gradient-primary text-primary-foreground">
                <CardTitle className="flex items-center justify-between">
                  <span>Current Blood Stock</span>
                  <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-0">
                    Updated 5 min ago
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {bloodTypes.map((blood) => (
                    <div
                      key={blood.type}
                      className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-display font-bold text-foreground">
                          {blood.type}
                        </span>
                        <Badge
                          variant={blood.status as "available" | "low" | "urgent"}
                          className="capitalize"
                        >
                          {blood.status}
                        </Badge>
                      </div>
                      <Progress 
                        value={blood.available} 
                        className="h-2 mb-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{blood.available}% available</span>
                        <span>{blood.donors} donors</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Legend */}
                <div className="mt-6 pt-6 border-t border-border flex flex-wrap gap-4 justify-center">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-success" />
                    <span className="text-sm text-muted-foreground">Available (&gt;50%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-warning" />
                    <span className="text-sm text-muted-foreground">Low (25-50%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-destructive" />
                    <span className="text-sm text-muted-foreground">Urgent (&lt;25%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Nearby Blood Banks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-lg text-foreground">
                Nearby Blood Banks
              </h3>
              <Link to="/blood-banks">
                <Button variant="ghost" size="sm" className="text-primary">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
            
            {nearbyBanks.map((bank, index) => (
              <Card 
                key={bank.name} 
                variant="feature"
                className="animate-slide-in-right"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">{bank.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        {bank.distance}
                        <span className="text-border">•</span>
                        <Clock className="h-3 w-3" />
                        {bank.status}
                      </div>
                    </div>
                    <a href={`tel:${bank.phone}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {bank.availability.map((type) => (
                      <Badge key={type} variant="bloodType" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
