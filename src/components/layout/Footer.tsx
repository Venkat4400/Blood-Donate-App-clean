import { Link } from "react-router-dom";
import { Heart, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-primary fill-primary" />
              <span className="font-display text-xl font-bold">
                Life<span className="text-primary">Flow</span>
              </span>
            </Link>
            <p className="text-secondary-foreground/70 text-sm leading-relaxed">
              Connecting donors with those in need. Every drop counts, every life matters. Join our mission to save lives through blood donation.
            </p>
            <div className="flex gap-3">
              <a href="#" className="h-10 w-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {["Find Donors", "Request Blood", "Blood Banks", "Donation Camps", "Eligibility", "FAQ"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Blood Types */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Blood Types</h3>
            <div className="grid grid-cols-4 gap-2">
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
                <div
                  key={type}
                  className="h-10 rounded-lg bg-secondary-foreground/10 flex items-center justify-center text-sm font-bold hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  {type}
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Emergency Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">24/7 Helpline</p>
                  <a href="tel:1800-123-4567" className="text-primary font-bold">1800-123-4567</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Email Us</p>
                  <a href="mailto:help@lifeflow.org" className="text-sm text-secondary-foreground/70 hover:text-primary">help@lifeflow.org</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Head Office</p>
                  <p className="text-sm text-secondary-foreground/70">123 Healthcare Avenue, Medical District</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-secondary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-secondary-foreground/50">
            © 2024 LifeFlow. All rights reserved. Made with ❤️ for humanity.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-secondary-foreground/50 hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-secondary-foreground/50 hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="text-sm text-secondary-foreground/50 hover:text-primary transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
