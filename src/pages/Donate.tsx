import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Heart, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Droplets
} from "lucide-react";
import { toast } from "sonner";

const eligibilityCriteria = [
  { label: "I am between 18-65 years of age", required: true },
  { label: "I weigh at least 50 kg (110 lbs)", required: true },
  { label: "I have not donated blood in the last 56 days", required: true },
  { label: "I am in good health and feeling well today", required: true },
  { label: "I have not had any tattoos or piercings in the last 6 months", required: false },
  { label: "I have not taken antibiotics in the last 7 days", required: false },
];

const upcomingCamps = [
  {
    id: 1,
    name: "City Mall Blood Drive",
    date: "Dec 15, 2024",
    time: "9:00 AM - 5:00 PM",
    location: "Central City Mall, Ground Floor",
    slots: 45,
    totalSlots: 100,
  },
  {
    id: 2,
    name: "University Health Camp",
    date: "Dec 18, 2024",
    time: "10:00 AM - 4:00 PM",
    location: "State University Campus",
    slots: 23,
    totalSlots: 50,
  },
  {
    id: 3,
    name: "Corporate Donation Drive",
    date: "Dec 20, 2024",
    time: "11:00 AM - 6:00 PM",
    location: "Tech Park, Building A",
    slots: 67,
    totalSlots: 80,
  },
];

const Donate = () => {
  const [checkedItems, setCheckedItems] = useState<boolean[]>(new Array(eligibilityCriteria.length).fill(false));
  const [selectedBloodType, setSelectedBloodType] = useState("");

  const allRequiredChecked = eligibilityCriteria
    .filter(c => c.required)
    .every((_, index) => checkedItems[index]);

  const handleSchedule = (campId: number) => {
    if (!allRequiredChecked) {
      toast.error("Please confirm all required eligibility criteria first");
      return;
    }
    if (!selectedBloodType) {
      toast.error("Please select your blood type");
      return;
    }
    toast.success("Appointment scheduled successfully! Check your email for confirmation.");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Heart className="h-4 w-4 fill-primary" />
              Become a Lifesaver
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Schedule Your Donation
            </h1>
            <p className="text-muted-foreground text-lg">
              Complete the eligibility check and book your appointment at a nearby donation center or camp.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Eligibility & Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Eligibility Check */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    Eligibility Checklist
                  </CardTitle>
                  <CardDescription>
                    Please confirm the following before scheduling your donation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {eligibilityCriteria.map((criteria, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        id={`criteria-${index}`}
                        checked={checkedItems[index]}
                        onCheckedChange={(checked) => {
                          const newChecked = [...checkedItems];
                          newChecked[index] = checked as boolean;
                          setCheckedItems(newChecked);
                        }}
                      />
                      <div className="flex-1">
                        <Label 
                          htmlFor={`criteria-${index}`}
                          className="text-foreground cursor-pointer"
                        >
                          {criteria.label}
                        </Label>
                        {criteria.required && (
                          <Badge variant="destructive" className="ml-2 text-xs">Required</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {!allRequiredChecked && (
                    <div className="flex items-center gap-2 p-4 rounded-lg bg-warning/10 border border-warning/30 text-warning">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      <p className="text-sm">Please confirm all required criteria to proceed</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Donor Information */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-primary" />
                    Your Information
                  </CardTitle>
                  <CardDescription>
                    Help us prepare for your donation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="bloodType">Blood Type *</Label>
                      <Select value={selectedBloodType} onValueChange={setSelectedBloodType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood type" />
                        </SelectTrigger>
                        <SelectContent>
                          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastDonation">Last Donation Date</Label>
                      <Input type="date" id="lastDonation" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input type="number" id="weight" placeholder="e.g., 65" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input type="tel" id="phone" placeholder="+91 98765 43210" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Donation Camps */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-semibold text-xl text-foreground">
                  Upcoming Camps
                </h2>
                <Button variant="ghost" size="sm" className="text-primary">
                  View All
                </Button>
              </div>

              {upcomingCamps.map((camp, index) => (
                <Card 
                  key={camp.id}
                  variant="feature"
                  className="animate-slide-in-right"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-foreground mb-3">{camp.name}</h3>
                    
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        {camp.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        {camp.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        {camp.location}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm">
                        <span className="font-semibold text-success">{camp.slots}</span>
                        <span className="text-muted-foreground"> / {camp.totalSlots} slots available</span>
                      </div>
                    </div>

                    <Button 
                      variant="hero" 
                      className="w-full"
                      onClick={() => handleSchedule(camp.id)}
                      disabled={!allRequiredChecked || !selectedBloodType}
                    >
                      Book Appointment
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}

              {/* Info Card */}
              <Card variant="stat" className="bg-primary/5 border-primary/20">
                <CardContent className="p-5">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Heart className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">First Time Donor?</h4>
                      <p className="text-sm text-muted-foreground">
                        Don't worry! Our trained staff will guide you through the entire process. 
                        It's safe, quick, and you'll be a hero!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Donate;
