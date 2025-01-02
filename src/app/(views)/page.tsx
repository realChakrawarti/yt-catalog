import FAQSection from "~/components/shared/faq-section";
import FeatureList from "~/components/shared/feature-list";
import HeroSection from "~/components/shared/hero-section";

export default function LoginPage() {
  return (
    <div className="flex flex-col pb-3">
      <HeroSection />
      <FeatureList />
      <FAQSection />
    </div>
  );
}
