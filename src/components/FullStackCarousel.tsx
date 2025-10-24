"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import projects from "../app/Data/projectsData";

export default function FullstackCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const tickSound = useRef<HTMLAudioElement | null>(null);

  const fullstackProjects = projects.filter((p) => p.category === "fullstack");

  // preload sound
  useEffect(() => {
    tickSound.current = new Audio("tick.mp3");
    tickSound.current.volume = 0.4;
  }, []);

  // Manual infinite scroll (no auto movement)
  useEffect(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    let lastCardIndex = -1;

    const handleScroll = () => {
      const cardWidth = container.querySelector("div")?.offsetWidth || 350;
      const currentIndex = Math.floor(container.scrollLeft / cardWidth);

      // Loop back when reaching halfway to make it infinite
      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft = 0;
      }

      // Play sound once per new card
      if (currentIndex !== lastCardIndex) {
        if (tickSound.current) {
          tickSound.current.currentTime = 0;
          tickSound.current.play().catch(() => {});
        }
        lastCardIndex = currentIndex;
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // 🖱️ Mouse wheel horizontal scroll
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        container.scrollLeft += e.deltaY * 1; // adjust multiplier for speed if needed
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  // Swipe (mobile/tablet)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!scrollRef.current || touchStart === null) return;
    const touchEnd = e.touches[0].clientX;
    const diff = touchStart - touchEnd;
    scrollRef.current.scrollLeft += diff * 0.8;
    setTouchStart(touchEnd);
  };

  return (
    <section className="relative w-full overflow-hidden py-12 bg-gradient-to-b from-gray-900 via-gray-950 to-black">
      <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500 mb-8">
        🌍 Fullstack Projects
      </h2>

      <div
        ref={scrollRef}
        className={`flex overflow-x-scroll no-scrollbar gap-6 px-6 py-4 rounded-xl transition-all duration-300 ${
          hovered
            ? "shadow-[0_0_25px_rgba(6,182,212,0.5)] scale-[1.01]"
            : ""
        }`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {[...fullstackProjects, ...fullstackProjects].map((project, index) => (
          <div
            key={index}
            className="min-w-[280px] sm:min-w-[350px] md:min-w-[400px] bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 rounded-2xl p-6 text-gray-100 hover:scale-105 transition-transform duration-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
          >
            <Image
              src={project.image}
              alt={project.title}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />
            <h3 className="text-xl font-semibold mb-2 text-cyan-300">
              {project.title}
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              {project.description}
            </p>

            <div className="flex items-center justify-between mt-auto">
              <a
                href={project.codeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm px-3 py-2 bg-cyan-600 rounded-lg hover:bg-cyan-700 transition"
              >
                Code
              </a>

              {project.demoLink && project.demoLink.trim() !== "" && (
                <a
                  href={project.demoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg hover:shadow-[0_0_10px_rgba(6,182,212,0.8)] transition"
                >
                  Live Demo
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
