import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import StatsSection from "./StatsSection";
import DashboardPreviewSection from "./DashboardPreviewSection";
import FeaturesSection from "./FeaturesSection";
import TierSection from "./TierSection";
import PricingSection from "./PricingSection";
import HowItWorksSection from "./HowItWorksSection";
import TestimonialsSection from "./TestimonialsSection";
import FAQSection from "./FAQSection";
import CTASection from "./CTASection";
import Footer from "../Footer";

/**
 * LandingPage - Gacor CRM (versi final / PRD v3)
 * Halaman publik untuk pengunjung anonim. Menyusun seluruh section:
 * Navbar, Hero, Stats, Dashboard Preview, Features, Tier, Pricing Comparison,
 * How It Works, Testimonials, FAQ, CTA, dan Footer.
 */
export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white font-poppins text-teks">
            <Navbar />
            <main>
                <HeroSection />
                <StatsSection />
                <DashboardPreviewSection />
                <FeaturesSection />
                <TierSection />
                <PricingSection />
                <HowItWorksSection />
                <TestimonialsSection />
                <FAQSection />
                <CTASection />
            </main>
            <Footer />
        </div>
    );
}
