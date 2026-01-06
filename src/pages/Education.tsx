import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BloodGroupEducation } from "@/components/education/BloodGroupEducation";

const Education = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <BloodGroupEducation />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Education;
