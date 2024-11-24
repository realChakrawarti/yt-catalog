import FAQSection from "~/components/custom/faq-section";
import FeatureList from "~/components/custom/feature-list";
import HeroSection from "~/components/custom/hero-section";

export default function LoginPage() {
  return (
    <div className="flex flex-col pb-3">
      <HeroSection />
      <FeatureList />
      <FAQSection />
    </div>
  );
}
