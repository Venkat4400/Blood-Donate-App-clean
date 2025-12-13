import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Droplets,
  Shield,
  ArrowRight,
  ArrowLeft,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    gender: "",
    bloodType: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    weight: "",
    lastDonation: "",
    medicalConditions: false,
    agreeTerms: false,
    receiveNotifications: true,
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Registration successful! Welcome to LifeFlow. Please verify your email.");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Heart className="h-4 w-4 fill-primary" />
              Join Our Community
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Register as a Donor
            </h1>
            <p className="text-muted-foreground">
              Become part of a life-saving community. Your blood can save up to 3 lives.
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Step {step} of {totalSteps}</span>
              <span className="text-primary font-medium">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-2">
              {["Personal Info", "Health Details", "Preferences"].map((label, index) => (
                <span 
                  key={label}
                  className={`text-xs ${step > index ? "text-primary" : "text-muted-foreground"}`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Form */}
          <Card variant="elevated">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit}>
                {/* Step 1: Personal Information */}
                {step === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center gap-2 mb-6">
                      <User className="h-5 w-5 text-primary" />
                      <h2 className="font-display font-semibold text-xl">Personal Information</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input 
                          id="firstName" 
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input 
                          id="lastName" 
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="email" 
                          type="email"
                          className="pl-10"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="phone" 
                          type="tel"
                          className="pl-10"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">Password *</Label>
                        <Input 
                          id="password" 
                          type="password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password *</Label>
                        <Input 
                          id="confirmPassword" 
                          type="password"
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth *</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="dob" 
                            type="date"
                            className="pl-10"
                            value={formData.dateOfBirth}
                            onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender *</Label>
                        <Select 
                          value={formData.gender}
                          onValueChange={(value) => setFormData({...formData, gender: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Health Details */}
                {step === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center gap-2 mb-6">
                      <Droplets className="h-5 w-5 text-primary" />
                      <h2 className="font-display font-semibold text-xl">Health Details</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bloodType">Blood Type *</Label>
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
                        <Label htmlFor="weight">Weight (kg) *</Label>
                        <Input 
                          id="weight" 
                          type="number"
                          placeholder="e.g., 65"
                          value={formData.weight}
                          onChange={(e) => setFormData({...formData, weight: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastDonation">Last Donation Date (if any)</Label>
                      <Input 
                        id="lastDonation" 
                        type="date"
                        value={formData.lastDonation}
                        onChange={(e) => setFormData({...formData, lastDonation: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="address" 
                          className="pl-10"
                          placeholder="Street address"
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input 
                          id="city" 
                          placeholder="City"
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Input 
                          id="state" 
                          placeholder="State"
                          value={formData.state}
                          onChange={(e) => setFormData({...formData, state: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pincode">PIN Code *</Label>
                        <Input 
                          id="pincode" 
                          placeholder="123456"
                          value={formData.pincode}
                          onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-lg bg-warning/10 border border-warning/30">
                      <Checkbox
                        id="medicalConditions"
                        checked={formData.medicalConditions}
                        onCheckedChange={(checked) => setFormData({...formData, medicalConditions: checked as boolean})}
                      />
                      <div>
                        <Label htmlFor="medicalConditions" className="font-medium cursor-pointer">
                          I have read and understood the eligibility criteria
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          You must be between 18-65 years, weigh at least 50 kg, and be in good health.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Preferences */}
                {step === 3 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center gap-2 mb-6">
                      <Shield className="h-5 w-5 text-primary" />
                      <h2 className="font-display font-semibold text-xl">Preferences & Consent</h2>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                        <Checkbox
                          id="notifications"
                          checked={formData.receiveNotifications}
                          onCheckedChange={(checked) => setFormData({...formData, receiveNotifications: checked as boolean})}
                        />
                        <div>
                          <Label htmlFor="notifications" className="font-medium cursor-pointer">
                            Receive emergency blood request notifications
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Get notified when someone nearby needs your blood type urgently.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                        <Checkbox
                          id="terms"
                          checked={formData.agreeTerms}
                          onCheckedChange={(checked) => setFormData({...formData, agreeTerms: checked as boolean})}
                          required
                        />
                        <div>
                          <Label htmlFor="terms" className="font-medium cursor-pointer">
                            I agree to the Terms of Service and Privacy Policy *
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            By registering, you agree to our terms and allow us to use your data for matching blood requests.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
                      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-success" />
                        Almost Done!
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Name</p>
                          <p className="font-medium text-foreground">{formData.firstName} {formData.lastName}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Blood Type</p>
                          <p className="font-medium text-foreground">{formData.bloodType || "Not set"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Location</p>
                          <p className="font-medium text-foreground">{formData.city || "Not set"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Phone</p>
                          <p className="font-medium text-foreground">{formData.phone || "Not set"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-6 border-t border-border">
                  {step > 1 ? (
                    <Button type="button" variant="outline" onClick={handleBack}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                  ) : (
                    <div />
                  )}
                  
                  {step < totalSteps ? (
                    <Button type="button" variant="hero" onClick={handleNext}>
                      Continue
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button type="submit" variant="hero" disabled={!formData.agreeTerms}>
                      <Heart className="h-4 w-4 mr-2" />
                      Complete Registration
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Login Link */}
          <p className="text-center text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
