import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { BloodAvailabilitySection } from "@/components/home/BloodAvailabilitySection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>LifeFlow - Smart Blood Donation & Emergency Management Platform</title>
        <meta 
          name="description" 
          content="Connect with blood donors, find blood banks, and save lives with LifeFlow. Real-time matching, emergency SOS, and a community of 50,000+ verified donors." 
        />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <HeroSection />
          <FeaturesSection />
          <HowItWorksSection />
          <BloodAvailabilitySection />
          <TestimonialsSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
