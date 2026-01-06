import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote, Heart } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    role: "Chief Medical Officer, City Hospital",
    avatar: "",
    content: "LifeFlow has revolutionized how we manage blood requirements. The real-time matching system has reduced our critical shortages by 60%. A must-have platform for every hospital.",
    rating: 5,
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    role: "Regular Donor, 25+ donations",
    avatar: "",
    content: "I've been donating blood for 10 years, and this app makes it so easy to track my donations, find nearby camps, and see the real impact I'm making. The reward system is a great bonus!",
    rating: 5,
  },
  {
    id: 3,
    name: "Priya Sharma",
    role: "Blood Recipient",
    avatar: "",
    content: "When my father needed an urgent B- blood transfusion, LifeFlow connected us with a donor within 20 minutes. This platform literally saved his life. Forever grateful.",
    rating: 5,
  },
  {
    id: 4,
    name: "Blood Bank Association",
    role: "Partner Network",
    avatar: "",
    content: "Integration with LifeFlow has streamlined our operations significantly. The analytics dashboard helps us predict demand and manage inventory efficiently.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
            <Heart className="h-4 w-4 fill-accent-foreground" />
            Success Stories
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Voices of Our Community
          </h2>
          <p className="text-muted-foreground text-lg">
            Hear from donors, recipients, and healthcare professionals who are 
            part of our life-saving network.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id}
              variant="elevated"
              className="relative animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                {/* Quote Icon */}
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {testimonial.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Community Stats */}
        <div className="mt-16 p-8 rounded-2xl bg-muted/50 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="font-display text-4xl font-bold text-primary">4.9</p>
              <p className="text-sm text-muted-foreground mt-1">App Rating</p>
            </div>
            <div>
              <p className="font-display text-4xl font-bold text-success">50K+</p>
              <p className="text-sm text-muted-foreground mt-1">Happy Donors</p>
            </div>
            <div>
              <p className="font-display text-4xl font-bold text-info">152K+</p>
              <p className="text-sm text-muted-foreground mt-1">Lives Saved</p>
            </div>
            <div>
              <p className="font-display text-4xl font-bold text-warning">500+</p>
              <p className="text-sm text-muted-foreground mt-1">Partner Hospitals</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
