
import HeroSection from '@/components/landing/HeroSection';
import ProblemSection from '@/components/landing/ProblemSection';
import SolutionSection from '@/components/landing/SolutionSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import ComparisonSection from '@/components/landing/ComparisonSection';
import PricingSection from '@/components/landing/PricingSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';
import Navbar from '@/components/landing/Navbar';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <TestimonialsSection />
      <ComparisonSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Landing;
