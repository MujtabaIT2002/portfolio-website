import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import RengokuClosing from "@/components/RengokuClosing";
import IntroMusicGate from "@/components/IntroMusicGate";
import MusicToggle from "@/components/MusicToggle";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <IntroMusicGate />
      <MusicToggle />
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Projects />
      <Contact />
      <RengokuClosing />
    </main>
  );
}
