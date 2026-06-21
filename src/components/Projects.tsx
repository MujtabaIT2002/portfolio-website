"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import projects, { Project } from "@/app/Data/projectsData";
import ProjectModal from "./ProjectModal";
import FlameGlow from "./FlameGlow";

// Bento spans applied from sm+ up; mobile (1 col) always stacks uniformly.
const BENTO_SPAN = [
  "sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2", // 1 Phi-3 Mini Marketing AI — featured
  "sm:col-span-2 lg:col-span-2 lg:row-span-1", // 2 Protein Antigenicity
  "", // 3 Solace Pixel
  "", // 4 Terminal Daraz Scraper
  "sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2", // 5 Smart Construction Model — featured
  "", // 6 Medical AI Assistant Bot
  "", // 7 X-ray Image Classification
  "sm:col-span-2 lg:col-span-2 lg:row-span-1", // 8 Prayer Time Calculation Engine
];

const FEATURED_INDICES = [0, 4];

export default function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section id="projects" className="relative bg-flame-ink py-24 px-6 overflow-hidden">
      <FlameGlow />

      <div className="relative text-center mb-16">
        <span className="inline-block px-4 py-1 rounded-full bg-flame-crimson text-flame-cream text-sm uppercase tracking-[0.2em] font-semibold mb-6">
          My Work
        </span>
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-3xl sm:text-4xl md:text-5xl mb-4 bg-gradient-to-r from-flame-crimson via-flame-scarlet to-flame-gold bg-clip-text text-transparent"
        >
          Projects
        </motion.h2>
        <div className="w-24 h-1.5 mx-auto rounded-full bg-gradient-to-r from-flame-gold via-flame-crimson to-flame-scarlet" />
      </div>

      <div
        className="relative max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
                   grid-flow-dense gap-5 sm:gap-6
                   auto-rows-[280px] sm:auto-rows-[220px] lg:auto-rows-[210px]"
      >
        {projects.map((project, i) => {
          const isFeatured = FEATURED_INDICES.includes(i);
          return (
            <motion.button
              key={project.id}
              onClick={() => setSelected(project)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.07 }}
              className={`group relative text-left rounded-2xl overflow-hidden border-2 border-flame-scarlet/25
                          hover:border-flame-gold/70 hover:shadow-[0_0_30px_rgba(245,212,105,0.45)]
                          hover:-translate-y-1 transition-all duration-300 ${BENTO_SPAN[i]}`}
            >
              {/* background */}
              {project.image ? (
                <Image
                  src={`/${project.image}`}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-flame-crimson via-flame-scarlet to-flame-gold">
                  <span className={isFeatured ? "text-7xl" : "text-5xl"}>🔥</span>
                </div>
              )}

              {/* overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-flame-ink/95 via-flame-ink/55 to-flame-ink/10" />

              {/* content */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5">
                <span className="self-start mb-2 text-xs sm:text-sm px-2.5 py-0.5 rounded-full bg-flame-gold text-flame-ink font-semibold uppercase tracking-wide">
                  {project.category === "ai" ? "AI / Automation" : "Full Stack"}
                </span>
                <h3
                  className={`font-heading text-flame-cream mb-1 ${
                    isFeatured ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"
                  }`}
                >
                  {project.title}
                </h3>
                <p
                  className={`text-flame-cream/80 text-sm sm:text-base ${
                    isFeatured ? "line-clamp-3" : "line-clamp-2"
                  }`}
                >
                  {project.description}
                </p>
                <span className="mt-3 text-sm font-semibold text-flame-gold opacity-0 group-hover:opacity-100 transition-opacity">
                  View Case Study →
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
