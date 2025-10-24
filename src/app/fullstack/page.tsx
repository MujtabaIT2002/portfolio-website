import AboutFullStack from "@/components/AboutFullStack";
import SkillsFullStack from "@/components/SkillsFullStack";
import FullstackCarousel from "@/components/FullStackCarousel";

export default function FullStackPage() {
  return (
    <main className="overflow-hidden bg-white">
      <AboutFullStack />
      <FullstackCarousel />
      <SkillsFullStack />
    </main>
  );
}
