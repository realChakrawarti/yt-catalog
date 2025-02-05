import FAQSection from "~/widgets/faq-section";
import FeatureList from "~/widgets/feature-list";
import HeroSection from "~/widgets/hero-section";

export default function LoginPage() {
  return (
    <div className="flex flex-col pb-3">
      <HeroSection />
      <FeatureList />
      <FAQSection />
    </div>
  );
}
