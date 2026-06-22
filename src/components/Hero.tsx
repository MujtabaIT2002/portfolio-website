"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import FlameEmbers from "./FlameEmbers";
import FlameGlow from "./FlameGlow";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-flame-cream text-flame-ink px-6"
    >
      <FlameGlow />
      <FlameEmbers density="medium" />

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative mb-6 sm:mb-8"
      >
        <div className="absolute inset-0 rounded-full bg-flame-gold/50 blur-2xl scale-110 animate-pulse" />
        <Image
          src="/profile.png"
          alt="Mujtaba Tariq"
          width={220}
          height={220}
          priority
          className="relative rounded-full object-cover shadow-2xl border-4 border-flame-gold
                     w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] md:w-[240px] md:h-[240px] lg:w-[260px] lg:h-[260px]"
        />
      </motion.div>

      <motion.span
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="px-4 py-1 rounded-full bg-flame-crimson text-flame-cream text-sm uppercase tracking-[0.2em] font-semibold mb-4"
      >
        Welcome
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-center bg-gradient-to-r from-flame-crimson via-flame-scarlet to-flame-gold bg-clip-text text-transparent"
      >
        Mujtaba Tariq
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-4 text-center text-base sm:text-lg md:text-xl text-flame-ink/70 max-w-xl"
      >
        Full Stack Developer &amp; AI Automation Engineer — building web apps,
        LLM-driven tools, and intelligent automation systems.
      </motion.p>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { duration: 0.8, delay: 1 },
          y: { duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 1 },
        }}
        className="absolute bottom-8 sm:bottom-10 flex flex-col items-center gap-2 text-flame-crimson"
      >
        <span className="text-xs uppercase tracking-[0.3em]">Scroll</span>
        <span className="text-2xl">⌄</span>
      </motion.a>
    </section>
  );
}
