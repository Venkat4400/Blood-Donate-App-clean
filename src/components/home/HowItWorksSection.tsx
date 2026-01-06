import { Button } from "@/components/ui/button";
import { UserPlus, Search, Droplets, Heart, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  {
    step: "01",
    icon: UserPlus,
    title: "Register & Verify",
    description: "Create your account, complete health questionnaire, and get verified as a donor",
    color: "bg-info",
  },
  {
    step: "02",
    icon: Search,
    title: "Find or Get Found",
    description: "Search for blood when needed or get notified when someone nearby needs your blood type",
    color: "bg-warning",
  },
  {
    step: "03",
    icon: Droplets,
    title: "Donate Safely",
    description: "Visit the nearest blood bank or donation camp, our team ensures a safe experience",
    color: "bg-success",
  },
  {
    step: "04",
    icon: Heart,
    title: "Save Lives",
    description: "Your donation reaches those in need, track your impact and earn rewards",
    color: "bg-primary",
  },
];

const donorBenefits = [
  "Free health check-up with every donation",
  "Reduced risk of heart disease",
  "Burn up to 650 calories per donation",
  "Earn rewards and badges",
  "Be part of a life-saving community",
  "Priority access during emergencies",
];

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
            <Droplets className="h-4 w-4" />
            Simple Process
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg">
            Saving lives has never been easier. Follow these simple steps to become a hero.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-info via-warning via-success to-primary" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item, index) => (
              <div 
                key={item.step} 
                className="relative text-center animate-slide-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Step Number & Icon */}
                <div className="relative inline-block mb-6">
                  <div className={`h-20 w-20 rounded-2xl ${item.color} text-primary-foreground flex items-center justify-center shadow-lg mx-auto`}>
                    <item.icon className="h-10 w-10" />
                  </div>
                  <span className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-card border-2 border-border flex items-center justify-center text-sm font-bold text-foreground shadow-md">
                    {item.step}
                  </span>
                </div>
                
                {/* Content */}
                <h3 className="font-display font-semibold text-xl text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-24 grid lg:grid-cols-2 gap-12 items-center">
          {/* Benefits List */}
          <div className="animate-slide-up">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
              Why Become a Donor?
            </h3>
            <p className="text-muted-foreground mb-8">
              Blood donation is not just about helping others – it benefits you too! 
              Here's why regular donors love being part of our community.
            </p>
            <ul className="space-y-4">
              {donorBenefits.map((benefit, index) => (
                <li 
                  key={benefit} 
                  className="flex items-center gap-3 animate-slide-in-right"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                  <span className="text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
            <Link to="/register" className="inline-block mt-8">
              <Button variant="hero" size="lg">
                Become a Donor Today
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          {/* Stats Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-3xl opacity-20" />
            <div className="relative p-8 rounded-3xl bg-card border border-border shadow-xl">
              <div className="text-center mb-8">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-10 w-10 text-primary animate-heartbeat" />
                </div>
                <h4 className="font-display text-xl font-bold text-foreground">
                  Your Impact Matters
                </h4>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 rounded-xl bg-muted/50">
                  <p className="font-display text-3xl font-bold text-primary">3</p>
                  <p className="text-sm text-muted-foreground">Lives saved per donation</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-muted/50">
                  <p className="font-display text-3xl font-bold text-success">5 min</p>
                  <p className="text-sm text-muted-foreground">Donation time</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-muted/50">
                  <p className="font-display text-3xl font-bold text-info">56 days</p>
                  <p className="text-sm text-muted-foreground">Between donations</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-muted/50">
                  <p className="font-display text-3xl font-bold text-warning">∞</p>
                  <p className="text-sm text-muted-foreground">Gratitude received</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
