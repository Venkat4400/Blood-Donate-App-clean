import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  AlertTriangle,
  Droplets,
  MapPin,
  Phone,
  Clock,
  Send,
  Users,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";

const urgencyLevels = [
  { value: "critical", label: "Critical - Needed within hours", color: "destructive" },
  { value: "urgent", label: "Urgent - Needed within 24 hours", color: "warning" },
  { value: "scheduled", label: "Scheduled - Planned surgery/transfusion", color: "info" },
];

const Request = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    patientName: "",
    bloodType: "",
    units: "1",
    urgency: "",
    hospital: "",
    contactName: "",
    contactPhone: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success("Blood request submitted successfully! Nearby donors have been notified.");
    setIsSubmitting(false);
  };

  const handleEmergencySOS = () => {
    toast.success("Emergency SOS activated! Nearby donors and blood banks are being notified immediately.");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4">
          {/* Emergency Banner */}
          <Card variant="emergency" className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-destructive/20 flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-7 w-7 text-destructive" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-xl text-foreground">
                      Life-Threatening Emergency?
                    </h2>
                    <p className="text-muted-foreground">
                      Activate Emergency SOS to instantly notify all nearby donors and blood banks
                    </p>
                  </div>
                </div>
                <Button 
                  variant="emergency" 
                  size="xl"
                  onClick={handleEmergencySOS}
                  className="shrink-0"
                >
                  <AlertTriangle className="h-5 w-5" />
                  Emergency SOS
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Page Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Request Blood
            </h1>
            <p className="text-muted-foreground text-lg">
              Fill out the form below to request blood. We'll match you with nearby donors and blood banks.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Request Form */}
            <div className="lg:col-span-2">
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-primary" />
                    Blood Request Form
                  </CardTitle>
                  <CardDescription>
                    Provide accurate details for faster matching
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="patientName">Patient Name *</Label>
                        <Input 
                          id="patientName" 
                          placeholder="Enter patient name"
                          value={formData.patientName}
                          onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bloodType">Blood Type Required *</Label>
                        <Select 
                          value={formData.bloodType}
                          onValueChange={(value) => setFormData({...formData, bloodType: value})}
                        >
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
                        <Label htmlFor="units">Units Required *</Label>
                        <Select 
                          value={formData.units}
                          onValueChange={(value) => setFormData({...formData, units: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} unit{num > 1 ? "s" : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="urgency">Urgency Level *</Label>
                        <Select 
                          value={formData.urgency}
                          onValueChange={(value) => setFormData({...formData, urgency: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select urgency" />
                          </SelectTrigger>
                          <SelectContent>
                            {urgencyLevels.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hospital">Hospital / Location *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="hospital" 
                          className="pl-10"
                          placeholder="Enter hospital name and address"
                          value={formData.hospital}
                          onChange={(e) => setFormData({...formData, hospital: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="contactName">Contact Person *</Label>
                        <Input 
                          id="contactName" 
                          placeholder="Your name"
                          value={formData.contactName}
                          onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactPhone">Phone Number *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="contactPhone" 
                            className="pl-10"
                            placeholder="+91 98765 43210"
                            value={formData.contactPhone}
                            onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea 
                        id="notes" 
                        placeholder="Any additional information (e.g., patient condition, special requirements)"
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        rows={4}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      variant="hero" 
                      size="lg" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          Submit Blood Request
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* How it Works */}
              <Card variant="stat">
                <CardHeader>
                  <CardTitle className="text-lg">How It Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { step: 1, text: "Submit your blood request with details" },
                    { step: 2, text: "Our AI matches you with nearby donors" },
                    { step: 3, text: "Donors receive instant notifications" },
                    { step: 4, text: "Coordinate pickup at the hospital" },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                        {item.step}
                      </div>
                      <p className="text-sm text-muted-foreground">{item.text}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Stats */}
              <Card variant="feature">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <p className="font-display text-2xl font-bold text-foreground">&lt;30 min</p>
                      <p className="text-sm text-muted-foreground">Average response time</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-info/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-info" />
                    </div>
                    <div>
                      <p className="font-display text-2xl font-bold text-foreground">50K+</p>
                      <p className="text-sm text-muted-foreground">Active donors nearby</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-display text-2xl font-bold text-foreground">98%</p>
                      <p className="text-sm text-muted-foreground">Request fulfillment rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Helpline */}
              <Card variant="elevated" className="bg-gradient-secondary text-secondary-foreground">
                <CardContent className="p-6">
                  <p className="text-sm text-secondary-foreground/70 mb-2">24/7 Helpline</p>
                  <a href="tel:1800-123-4567" className="font-display text-2xl font-bold flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    1800-123-4567
                  </a>
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

export default Request;
