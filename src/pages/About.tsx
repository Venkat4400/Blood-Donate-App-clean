import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Target, 
  Users, 
  Award,
  Lightbulb,
  Shield,
  Clock,
  Globe,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const teamMembers = [
  { name: "VENKAT", role: "Founder & Project Lead", avatar: "VK" },
  { name: "Dr. Aisha Patel", role: "Chief Medical Advisor", avatar: "AP" },
  { name: "Priya Gupta", role: "Head of Operations", avatar: "PG" },
  { name: "Vikram Singh", role: "Technology Lead", avatar: "VS" },
];

const milestones = [
  { year: "2020", title: "The Spark", description: "A personal experience with blood shortage ignited the mission" },
  { year: "2021", title: "Research Phase", description: "Studied healthcare systems across India and global best practices" },
  { year: "2022", title: "Development", description: "Built the core platform with GPS, AI matching, and real-time features" },
  { year: "2023", title: "Beta Launch", description: "Partnered with 50+ hospitals for pilot testing" },
  { year: "2024", title: "Full Launch", description: "Launched AI-powered donor matching across major Indian cities" },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 right-[20%] w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-[10%] w-96 h-96 bg-accent/30 rounded-full blur-3xl" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Heart className="h-4 w-4 fill-primary" />
                Our Story
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Connecting Hearts, <span className="text-primary">Saving Lives</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                LifeFlow was born from a simple yet powerful belief: no one should die due to lack of blood. 
                We're building the world's most efficient blood donation ecosystem, connecting donors with 
                those in need, instantly.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card variant="elevated" className="p-8">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To create a seamless, technology-driven blood donation ecosystem that ensures no life is lost 
                  due to blood unavailability. We aim to make blood donation accessible, efficient, and 
                  rewarding for everyone.
                </p>
              </Card>
              <Card variant="elevated" className="p-8">
                <div className="h-14 w-14 rounded-xl bg-success/10 flex items-center justify-center mb-6">
                  <Lightbulb className="h-7 w-7 text-success" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  A world where blood is available to anyone, anywhere, within minutes. We envision a global 
                  network of empowered donors, smart hospitals, and AI-driven matching that eliminates 
                  preventable deaths.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 bg-gradient-secondary text-secondary-foreground">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
              {[
                { value: "152K+", label: "Lives Saved", icon: Heart },
                { value: "50K+", label: "Active Donors", icon: Users },
                { value: "500+", label: "Partner Hospitals", icon: Shield },
                { value: "24/7", label: "Support", icon: Clock },
              ].map((stat) => (
                <div key={stat.label}>
                  <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <p className="font-display text-4xl font-bold mb-1">{stat.value}</p>
                  <p className="text-secondary-foreground/70">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Long Journey
              </h2>
              <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                What started as a deeply personal experience transformed into a mission to revolutionize emergency healthcare in India. 
                After witnessing the devastating impact of blood shortages firsthand, VENKAT embarked on a journey to build a platform 
                that could bridge the gap between donors and those in desperate need. This isn't just a technology project—it's a 
                movement to ensure that no family ever has to face the tragedy of losing a loved one due to unavailable blood.
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
                
                {milestones.map((milestone, index) => (
                  <div 
                    key={milestone.year}
                    className="relative flex gap-6 pb-12 last:pb-0 animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative z-10 h-16 w-16 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center font-display font-bold shadow-lg">
                      {milestone.year}
                    </div>
                    <div className="pt-3">
                      <h3 className="font-display font-semibold text-xl text-foreground mb-1">
                        {milestone.title}
                      </h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
                <Users className="h-4 w-4" />
                Our Team
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Meet the People Behind LifeFlow
              </h2>
            </div>
            <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {teamMembers.map((member, index) => (
                <Card 
                  key={member.name}
                  variant="feature"
                  className="text-center animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="h-20 w-20 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center text-2xl font-display font-bold mx-auto mb-4">
                      {member.avatar}
                    </div>
                    <h3 className="font-semibold text-foreground">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Core Values
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { 
                  icon: Heart, 
                  title: "Compassion First", 
                  description: "Every decision we make is guided by our commitment to saving lives and helping those in need." 
                },
                { 
                  icon: Shield, 
                  title: "Trust & Safety", 
                  description: "We ensure the highest standards of safety and privacy for all donors and recipients." 
                },
                { 
                  icon: Globe, 
                  title: "Accessibility", 
                  description: "Blood donation should be easy and accessible to everyone, everywhere." 
                },
              ].map((value, index) => (
                <Card 
                  key={value.title}
                  variant="stat"
                  className="text-center p-6 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <Award className="h-16 w-16 mx-auto mb-6 opacity-80" />
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Be Part of Something Greater
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join thousands of heroes who are making a difference every day. 
              Your single donation can save up to 3 lives.
            </p>
            <Link to="/register">
              <Button 
                variant="glass" 
                size="xl" 
                className="border-primary-foreground/30 hover:bg-primary-foreground/10"
              >
                Join LifeFlow Today
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
