import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
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
  CheckCircle,
  Loader2,
  Building2,
  Users,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import type { Database } from "@/integrations/supabase/types";

type BloodType = Database["public"]["Enums"]["blood_type"];
type AppRole = Database["public"]["Enums"]["app_role"];

const ROLES = [
  { value: "donor" as AppRole, label: "Donor", icon: Heart, description: "Register as a blood donor to save lives" },
  { value: "receiver" as AppRole, label: "Receiver", icon: Users, description: "Request blood for yourself or a patient" },
  { value: "hospital" as AppRole, label: "Hospital", icon: Building2, description: "Register as a hospital or blood bank" },
];

const Register = () => {
  const navigate = useNavigate();
  const { user, signUp } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    // Step 1: Role & Account
    role: "" as AppRole | "",
    email: "",
    password: "",
    confirmPassword: "",
    
    // Step 2: Personal Info
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    
    // Step 3: Location
    address: "",
    city: "",
    state: "",
    pincode: "",
    
    // Step 4: Donor Profile (only for donors)
    bloodType: "" as BloodType | "",
    weight: "",
    height: "",
    lastDonation: "",
    
    // Preferences
    agreeTerms: false,
    receiveNotifications: true,
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const totalSteps = formData.role === "donor" ? 5 : 4;
  const progress = (step / totalSteps) * 100;

  const validateStep = () => {
    setError(null);
    
    if (step === 1) {
      if (!formData.role) {
        setError("Please select a role");
        return false;
      }
      if (!formData.email || !formData.password) {
        setError("Email and password are required");
        return false;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
    }
    
    if (step === 2) {
      if (!formData.firstName || !formData.lastName) {
        setError("First and last name are required");
        return false;
      }
      if (!formData.phone) {
        setError("Phone number is required");
        return false;
      }
    }
    
    if (step === 3) {
      if (!formData.city || !formData.state) {
        setError("City and state are required");
        return false;
      }
    }
    
    if (step === 4 && formData.role === "donor") {
      if (!formData.bloodType) {
        setError("Blood type is required for donors");
        return false;
      }
      if (!formData.weight || Number(formData.weight) < 50) {
        setError("Weight must be at least 50 kg to donate blood");
        return false;
      }
    }
    
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeTerms) {
      setError("You must agree to the terms and conditions");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // 1. Sign up the user
      const { error: signUpError } = await signUp(
        formData.email,
        formData.password,
        {
          full_name: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
        }
      );
      
      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          setError("This email is already registered. Please sign in instead.");
        } else {
          setError(signUpError.message);
        }
        setIsSubmitting(false);
        return;
      }

      // Get the user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast.success("Registration successful! Please check your email to verify your account.");
        navigate("/login");
        return;
      }

      const userId = session.user.id;

      // 2. Update profile with additional info
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          date_of_birth: formData.dateOfBirth || null,
          gender: formData.gender || null,
          address: formData.address || null,
          city: formData.city || null,
          state: formData.state || null,
          pincode: formData.pincode || null,
        })
        .eq("user_id", userId);

      if (profileError) {
        console.error("Profile update error:", profileError);
      }

      // 3. Assign role
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({
          user_id: userId,
          role: formData.role as AppRole,
        });

      if (roleError) {
        console.error("Role assignment error:", roleError);
      }

      // 4. Create donor profile if donor
      if (formData.role === "donor" && formData.bloodType) {
        const { error: donorError } = await supabase
          .from("donor_profiles")
          .insert({
            user_id: userId,
            blood_type: formData.bloodType as BloodType,
            weight: formData.weight ? Number(formData.weight) : null,
            height: formData.height ? Number(formData.height) : null,
            last_donation_date: formData.lastDonation || null,
            is_available: true,
            reliability_score: 5.0,
            eligibility_score: 100,
          });

        if (donorError) {
          console.error("Donor profile error:", donorError);
        }
      }

      toast.success("Registration successful! Welcome to LifeFlow.");
      navigate("/dashboard");
      
    } catch (err) {
      console.error("Registration error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepLabels = () => {
    const labels = ["Account", "Personal", "Location"];
    if (formData.role === "donor") {
      labels.push("Health", "Confirm");
    } else {
      labels.push("Confirm");
    }
    return labels;
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
              Join LifeFlow
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Create Your Account
            </h1>
            <p className="text-muted-foreground">
              Join our life-saving community today
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
              {getStepLabels().map((label, index) => (
                <span 
                  key={label}
                  className={`text-xs ${step > index ? "text-primary font-medium" : "text-muted-foreground"}`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/30 flex items-center gap-3"
              >
                <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
                <p className="text-destructive text-sm">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <Card variant="elevated">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {/* Step 1: Role & Account */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-2 mb-6">
                        <User className="h-5 w-5 text-primary" />
                        <h2 className="font-display font-semibold text-xl">Choose Your Role</h2>
                      </div>

                      <RadioGroup
                        value={formData.role}
                        onValueChange={(value) => setFormData({ ...formData, role: value as AppRole })}
                        className="grid gap-4"
                      >
                        {ROLES.map((role) => (
                          <Label
                            key={role.value}
                            htmlFor={role.value}
                            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              formData.role === role.value
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <RadioGroupItem value={role.value} id={role.value} className="sr-only" />
                            <div className={`p-3 rounded-lg ${
                              formData.role === role.value ? "bg-primary text-primary-foreground" : "bg-muted"
                            }`}>
                              <role.icon className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-foreground">{role.label}</p>
                              <p className="text-sm text-muted-foreground">{role.description}</p>
                            </div>
                            {formData.role === role.value && (
                              <CheckCircle className="h-5 w-5 text-primary" />
                            )}
                          </Label>
                        ))}
                      </RadioGroup>

                      <div className="space-y-4 pt-4 border-t">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id="email" 
                              type="email"
                              className="pl-10"
                              placeholder="you@example.com"
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                              placeholder="Min 6 characters"
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
                              placeholder="Confirm password"
                              value={formData.confirmPassword}
                              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Personal Info */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
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
                          <Label htmlFor="dob">Date of Birth</Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id="dob" 
                              type="date"
                              className="pl-10"
                              value={formData.dateOfBirth}
                              onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
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
                    </motion.div>
                  )}

                  {/* Step 3: Location */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-2 mb-6">
                        <MapPin className="h-5 w-5 text-primary" />
                        <h2 className="font-display font-semibold text-xl">Location Details</h2>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input 
                          id="address" 
                          placeholder="Street address"
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
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
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pincode">PIN Code</Label>
                        <Input 
                          id="pincode" 
                          placeholder="123456"
                          value={formData.pincode}
                          onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Health Details (Donors only) */}
                  {step === 4 && formData.role === "donor" && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-2 mb-6">
                        <Droplets className="h-5 w-5 text-primary" />
                        <h2 className="font-display font-semibold text-xl">Donor Health Details</h2>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bloodType">Blood Type *</Label>
                          <Select 
                            value={formData.bloodType}
                            onValueChange={(value) => setFormData({...formData, bloodType: value as BloodType})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select blood type" />
                            </SelectTrigger>
                            <SelectContent>
                              {(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as BloodType[]).map((type) => (
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
                            min="50"
                            placeholder="e.g., 65"
                            value={formData.weight}
                            onChange={(e) => setFormData({...formData, weight: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="height">Height (cm)</Label>
                          <Input 
                            id="height" 
                            type="number"
                            placeholder="e.g., 170"
                            value={formData.height}
                            onChange={(e) => setFormData({...formData, height: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastDonation">Last Donation Date</Label>
                          <Input 
                            id="lastDonation" 
                            type="date"
                            value={formData.lastDonation}
                            onChange={(e) => setFormData({...formData, lastDonation: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-info/10 border border-info/30">
                        <p className="text-sm text-info">
                          <strong>Eligibility Requirements:</strong> You must be between 18-65 years old, 
                          weigh at least 50 kg, and be in good health to donate blood.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Final Step: Confirmation */}
                  {((step === 4 && formData.role !== "donor") || (step === 5 && formData.role === "donor")) && (
                    <motion.div
                      key="stepFinal"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-2 mb-6">
                        <Shield className="h-5 w-5 text-primary" />
                        <h2 className="font-display font-semibold text-xl">Confirm & Complete</h2>
                      </div>

                      {/* Summary */}
                      <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
                        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-success" />
                          Registration Summary
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Role</p>
                            <p className="font-medium text-foreground capitalize">{formData.role}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Name</p>
                            <p className="font-medium text-foreground">{formData.firstName} {formData.lastName}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Email</p>
                            <p className="font-medium text-foreground">{formData.email}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Location</p>
                            <p className="font-medium text-foreground">{formData.city}, {formData.state}</p>
                          </div>
                          {formData.role === "donor" && (
                            <>
                              <div>
                                <p className="text-muted-foreground">Blood Type</p>
                                <p className="font-medium text-foreground">{formData.bloodType}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Weight</p>
                                <p className="font-medium text-foreground">{formData.weight} kg</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Terms */}
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                          <Checkbox
                            id="notifications"
                            checked={formData.receiveNotifications}
                            onCheckedChange={(checked) => setFormData({...formData, receiveNotifications: checked as boolean})}
                          />
                          <div>
                            <Label htmlFor="notifications" className="font-medium cursor-pointer">
                              Receive notifications
                            </Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              Get notified about blood requests and important updates.
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
                              By registering, you agree to our terms and allow us to use your data for matching.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex justify-between pt-8 mt-8 border-t">
                  {step > 1 ? (
                    <Button type="button" variant="outline" onClick={handleBack}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                  ) : (
                    <div />
                  )}

                  {((step < 4) || (step === 4 && formData.role === "donor")) ? (
                    <Button type="button" variant="hero" onClick={handleNext}>
                      Continue
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      variant="hero"
                      disabled={isSubmitting || !formData.agreeTerms}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Complete Registration
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Sign In Link */}
          <p className="text-center mt-6 text-muted-foreground">
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
