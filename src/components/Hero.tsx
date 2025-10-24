"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const [hovered, setHovered] = useState<"left" | "right" | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClick = (side: "left" | "right") => {
    router.push(side === "left" ? "/fullstack" : "/ai-automations");
  };

  return (
    <section className="relative h-screen w-full overflow-hidden flex flex-col lg:flex-row transition-all duration-700">
      {/* LEFT SIDE */}
      <div
        onClick={() => handleClick("left")}
        className={`flex-1 flex items-center justify-center bg-gradient-to-r 
        from-gray-900 to-gray-800 text-white transition-all duration-700 ease-in-out 
        cursor-pointer overflow-hidden relative z-10
        ${
          hovered === "right"
            ? "lg:w-[0%] opacity-0"
            : hovered === "left"
            ? "lg:w-[65%] opacity-100"
            : "lg:w-1/2 opacity-100"
        }`}
      >
        <div
          onMouseEnter={() => isDesktop && setHovered("left")}
          onMouseLeave={() => isDesktop && setHovered(null)}
          className={`text-center px-4 transition-all duration-700 transform 
          ${
            hovered === "left"
              ? "scale-110 opacity-100"
              : isDesktop
              ? "scale-80 opacity-60"
              : "opacity-100"
          }`}
        >
          <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 leading-tight tracking-wide select-none">
            Full Stack Dev
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm md:text-base lg:text-lg">
            Web Apps | APIs | Databases
          </p>

          {/* Glow Line (Desktop Only) */}
          {isDesktop && (
            <div
              className={`mt-3 h-[2px] w-12 mx-auto bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full transition-all duration-500 ${
                hovered === "left" ? "opacity-100 w-24" : "opacity-40"
              }`}
            />
          )}
        </div>
      </div>

      {/* CENTER IMAGE */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <div
          className={`transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] transform-gpu
          ${
            hovered === "left"
              ? "lg:translate-x-[65%]"
              : hovered === "right"
              ? "lg:-translate-x-[65%]"
              : "translate-x-0"
          }`}
          style={{ transitionDelay: "50ms" }}
        >
          <Image
            src="/profile.png"
            alt="Profile"
            width={220}
            height={220}
            className="rounded-full shadow-2xl object-cover sm:w-[250px] sm:h-[250px] md:w-[280px] md:h-[280px] lg:w-[320px] lg:h-[320px] xl:w-[350px] xl:h-[350px]"
            style={{
              zIndex: 30,
              transition: "transform 0.7s ease, opacity 0.7s ease",
            }}
          />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div
        onClick={() => handleClick("right")}
        className={`flex-1 flex items-center justify-center bg-gradient-to-l 
        from-gray-900 to-gray-800 text-white transition-all duration-700 ease-in-out 
        cursor-pointer overflow-hidden relative z-10
        ${
          hovered === "left"
            ? "lg:w-[0%] opacity-0"
            : hovered === "right"
            ? "lg:w-[65%] opacity-100"
            : "lg:w-1/2 opacity-100"
        }`}
      >
        <div
          onMouseEnter={() => isDesktop && setHovered("right")}
          onMouseLeave={() => isDesktop && setHovered(null)}
          className={`text-center px-4 transition-all duration-700 transform 
          ${
            hovered === "right"
              ? "scale-110 opacity-100"
              : isDesktop
              ? "scale-80 opacity-60"
              : "opacity-100"
          }`}
        >
          <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 leading-tight tracking-wide select-none">
            AI & Automations
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm md:text-base lg:text-lg">
            ML Models | Scripts | Bots
          </p>

          {/* Glow Line */}
          {isDesktop && (
            <div
              className={`mt-3 h-[2px] w-12 mx-auto bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-500 ${
                hovered === "right" ? "opacity-100 w-24" : "opacity-40"
              }`}
            />
          )}
        </div>
      </div>
    </section>
  );
}
