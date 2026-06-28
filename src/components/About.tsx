"use client";

import { motion } from "framer-motion";
import FlameEmbers from "./FlameEmbers";
import FlameGlow from "./FlameGlow";

export default function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-flame-cream py-16 sm:py-20 px-6"
    >
      <FlameGlow />
      <FlameEmbers density="low" />

      <div className="relative max-w-3xl mx-auto text-center">
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="inline-block px-4 py-1 rounded-full bg-flame-crimson text-flame-cream text-sm uppercase tracking-[0.2em] font-semibold mb-6"
        >
          About Me
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="font-jp text-3xl sm:text-4xl md:text-5xl mb-2 bg-gradient-to-r from-flame-crimson via-flame-scarlet to-flame-gold bg-clip-text text-transparent"
        >
          炎の呼吸でコードを鍛える
        </motion.h2>
        <p className="text-flame-ink/50 text-sm italic mb-4">
          Forging Code Like Flame Breathing
        </p>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-24 h-1.5 mx-auto mb-10 rounded-full bg-gradient-to-r from-flame-gold via-flame-crimson to-flame-scarlet"
        />

        <motion.p
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-flame-ink/80 text-lg sm:text-xl leading-relaxed mb-6"
        >
          I&apos;m an AI and Full-Stack Developer who builds end-to-end
          applications with React.js, Node.js, Flask, and database-backed
          architectures from REST APIs and authentication to admin panels
          and deployment with Docker.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-flame-ink/80 text-lg sm:text-xl leading-relaxed"
        >
          On the AI side, I work across machine learning, LLM fine-tuning
          (PEFT, QLoRA), computer vision, and workflow automation building
          practical tools that combine model integration, web scraping, and
          API pipelines to solve real business problems.
        </motion.p>
      </div>
    </section>
  );
}
