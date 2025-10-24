import AboutAiAutomations from "@/components/AboutAiAutomations";
import SkillsAiAutomations from "@/components/SkillsAiAutomations";
import AIAutomationsCarousel from "@/components/AIAutomationsCarousel";
export default function AiAutomationsPage() {
  return (
    <main className="overflow-hidden bg-white">
      <AboutAiAutomations />
      <AIAutomationsCarousel />
      <SkillsAiAutomations />

    </main>
  );
}