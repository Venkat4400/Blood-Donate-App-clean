import { Button } from "@/components/ui/button";
import { Heart, ArrowRight, Phone, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-secondary text-secondary-foreground relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/20 mb-8">
            <Heart className="h-10 w-10 text-primary animate-heartbeat" />
          </div>

          {/* Heading */}
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Be the Reason Someone{" "}
            <span className="text-primary">Lives</span> Today
          </h2>

          {/* Description */}
          <p className="text-lg text-secondary-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Every 2 seconds, someone needs blood. Your single donation can save up to 3 lives. 
            Join thousands of heroes who are making a difference every day.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/register">
              <Button variant="hero" size="xl" className="w-full sm:w-auto shadow-lg shadow-primary/30">
                <Heart className="h-5 w-5" />
                Register as Donor
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
            <Link to="/request">
              <Button 
                variant="glass" 
                size="xl" 
                className="w-full sm:w-auto border-secondary-foreground/30 hover:bg-secondary-foreground/10"
              >
                Request Blood Now
              </Button>
            </Link>
          </div>

          {/* Emergency Contact */}
          <div className="inline-flex items-center gap-4 p-4 rounded-xl bg-destructive/10 border border-destructive/30">
            <div className="h-12 w-12 rounded-full bg-destructive/20 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div className="text-left">
              <p className="text-sm text-secondary-foreground/70">24/7 Emergency Helpline</p>
              <a 
                href="tel:1800-123-4567" 
                className="flex items-center gap-2 text-xl font-bold text-primary hover:underline"
              >
                <Phone className="h-5 w-5" />
                1800-123-4567
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
