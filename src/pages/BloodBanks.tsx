import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MapPin, 
  Phone, 
  Clock, 
  Search,
  Navigation,
  Star,
  Filter,
  Building2
} from "lucide-react";

const bloodBanks = [
  {
    id: 1,
    name: "City Central Blood Bank",
    address: "123 Healthcare Avenue, Medical District",
    distance: "1.2 km",
    phone: "+91 98765 43210",
    hours: "Open 24/7",
    rating: 4.8,
    reviews: 234,
    availability: ["A+", "B+", "O+", "AB+"],
    lowStock: ["A-", "O-"],
    isOpen: true,
  },
  {
    id: 2,
    name: "Red Cross Blood Center",
    address: "456 Charity Lane, Downtown",
    distance: "2.8 km",
    phone: "+91 98765 43211",
    hours: "8 AM - 8 PM",
    rating: 4.9,
    reviews: 456,
    availability: ["A+", "A-", "B+", "O+", "O-"],
    lowStock: ["AB-"],
    isOpen: true,
  },
  {
    id: 3,
    name: "Government Hospital Blood Bank",
    address: "789 Public Health Road",
    distance: "3.5 km",
    phone: "+91 98765 43212",
    hours: "Open 24/7",
    rating: 4.5,
    reviews: 189,
    availability: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    lowStock: [],
    isOpen: true,
  },
  {
    id: 4,
    name: "Private Medical Center",
    address: "321 Elite Healthcare Blvd",
    distance: "4.2 km",
    phone: "+91 98765 43213",
    hours: "9 AM - 9 PM",
    rating: 4.7,
    reviews: 312,
    availability: ["A+", "B+", "O+"],
    lowStock: ["B-", "AB+"],
    isOpen: true,
  },
  {
    id: 5,
    name: "Community Blood Bank",
    address: "567 Neighborhood Center",
    distance: "5.1 km",
    phone: "+91 98765 43214",
    hours: "10 AM - 6 PM",
    rating: 4.6,
    reviews: 145,
    availability: ["A+", "B+", "O+", "O-"],
    lowStock: ["A-", "AB-"],
    isOpen: false,
  },
];

const BloodBanks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBloodType, setSelectedBloodType] = useState("");

  const filteredBanks = bloodBanks.filter((bank) => {
    const matchesSearch = bank.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bank.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBloodType = !selectedBloodType || 
                            bank.availability.includes(selectedBloodType) ||
                            bank.lowStock.includes(selectedBloodType);
    return matchesSearch && matchesBloodType;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Building2 className="h-4 w-4" />
              Verified Blood Banks
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Find Blood Banks Near You
            </h1>
            <p className="text-muted-foreground text-lg">
              Locate verified blood banks in your area with real-time availability information.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name or location..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedBloodType} onValueChange={setSelectedBloodType}>
              <SelectTrigger className="w-full md:w-48">
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
            <Button variant="hero-outline" className="gap-2">
              <Navigation className="h-4 w-4" />
              Use My Location
            </Button>
          </div>

          {/* Map Placeholder */}
          <Card variant="elevated" className="mb-8 overflow-hidden">
            <div className="h-64 md:h-80 bg-muted flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-muted" />
              <div className="relative text-center p-8">
                <MapPin className="h-16 w-16 text-primary mx-auto mb-4 animate-bounce" />
                <p className="text-foreground font-medium mb-2">Interactive Map Coming Soon</p>
                <p className="text-muted-foreground text-sm">
                  View blood banks on an interactive map with real-time directions
                </p>
              </div>
            </div>
          </Card>

          {/* Results */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredBanks.length}</span> blood banks
            </p>
            <Select defaultValue="distance">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="availability">Availability</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Blood Bank Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {filteredBanks.map((bank, index) => (
              <Card 
                key={bank.id}
                variant="feature"
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display font-semibold text-lg text-foreground">
                          {bank.name}
                        </h3>
                        <Badge variant={bank.isOpen ? "success" : "secondary"}>
                          {bank.isOpen ? "Open" : "Closed"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        <span className="font-medium text-foreground">{bank.rating}</span>
                        <span className="text-muted-foreground">({bank.reviews} reviews)</span>
                      </div>
                    </div>
                    <Badge variant="bloodType" className="text-lg px-3 py-1">
                      {bank.distance}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary shrink-0" />
                      <span>{bank.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary shrink-0" />
                      <span>{bank.hours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary shrink-0" />
                      <a href={`tel:${bank.phone}`} className="hover:text-primary transition-colors">
                        {bank.phone}
                      </a>
                    </div>
                  </div>

                  {/* Blood Availability */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Available Blood Types</p>
                    <div className="flex flex-wrap gap-1">
                      {bank.availability.map((type) => (
                        <Badge key={type} variant="available" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                      {bank.lowStock.map((type) => (
                        <Badge key={type} variant="low" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button variant="hero" className="flex-1">
                      <Navigation className="h-4 w-4" />
                      Get Directions
                    </Button>
                    <Button variant="outline" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BloodBanks;
