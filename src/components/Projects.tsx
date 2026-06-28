"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import projects from "@/app/Data/projectsData";
import FlameGlow from "./FlameGlow";

// Column spans only — rows size to content so expanding a card never breaks the grid.
const BENTO_SPAN = [
  "sm:col-span-2 lg:col-span-2", // 1 Phi-3 Mini Marketing AI — featured
  "sm:col-span-2 lg:col-span-2", // 2 Protein Antigenicity
  "", // 3 Solace Pixel
  "", // 4 Terminal Daraz Scraper
  "sm:col-span-2 lg:col-span-2", // 5 Smart Construction Model — featured
  "", // 6 Medical AI Assistant Bot
  "", // 7 X-ray Image Classification
  "sm:col-span-2 lg:col-span-2", // 8 Prayer Time Calculation Engine
];

const FEATURED_INDICES = [0, 4];

export default function Projects() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <section id="projects" className="relative bg-flame-cream py-16 sm:py-20 px-6 overflow-hidden">
      <FlameGlow />

      <div className="relative text-center mb-10 sm:mb-12">
        <span className="inline-block px-4 py-1 rounded-full bg-flame-crimson text-flame-cream text-sm uppercase tracking-[0.2em] font-semibold mb-6">
          My Work
        </span>
        <motion.h2
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="font-jp text-3xl sm:text-4xl md:text-5xl mb-2 bg-gradient-to-r from-flame-crimson via-flame-scarlet to-flame-gold bg-clip-text text-transparent"
        >
          作品
        </motion.h2>
        <p className="text-flame-ink/50 text-sm italic mb-4">Projects</p>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-24 h-1.5 mx-auto rounded-full bg-gradient-to-r from-flame-gold via-flame-crimson to-flame-scarlet"
        />
      </div>

      <div
        className="relative max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
                   items-start grid-flow-dense gap-5 sm:gap-6"
      >
        {projects.map((project, i) => {
          const isFeatured = FEATURED_INDICES.includes(i);
          const isExpanded = expandedId === project.id;

          return (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.07, ease: "easeOut" }}
              className={`rounded-2xl overflow-hidden border-2 bg-flame-cream transition-colors duration-300 ${
                isExpanded
                  ? "border-flame-crimson/70 shadow-[0_10px_35px_rgba(195,58,51,0.2)]"
                  : "border-flame-scarlet/25 hover:border-flame-gold/70 hover:shadow-[0_0_30px_rgba(245,212,105,0.4)] hover:-translate-y-1"
              } ${BENTO_SPAN[i]}`}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : project.id)}
                aria-expanded={isExpanded}
                className={`group relative w-full block text-left ${
                  isFeatured ? "h-64 sm:h-72 md:h-80" : "h-48 sm:h-56"
                }`}
              >
                {project.image ? (
                  <Image
                    src={`/${project.image}`}
                    alt={project.title}
                    fill
                    sizes={
                      isFeatured
                        ? "(max-width: 639px) 100vw, 50vw"
                        : "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                    }
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-flame-crimson via-flame-scarlet to-flame-gold" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-flame-ink/95 via-flame-ink/55 to-flame-ink/10" />

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
                  <span className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-flame-gold">
                    {isExpanded ? "Hide Details" : "View Details"}
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </span>
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && project.caseStudy && (
                  <motion.div
                    key="detail"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 sm:p-6 border-t-2 border-flame-scarlet/15 space-y-4">
                      <div>
                        <h4 className="font-heading text-flame-crimson text-lg mb-1">Overview</h4>
                        <p className="text-flame-ink/80 text-base leading-relaxed">
                          {project.caseStudy.overview}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-heading text-flame-crimson text-lg mb-1">Problem</h4>
                        <p className="text-flame-ink/80 text-base leading-relaxed">
                          {project.caseStudy.problem}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-heading text-flame-crimson text-lg mb-1">Solution</h4>
                        <p className="text-flame-ink/80 text-base leading-relaxed">
                          {project.caseStudy.solution}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-heading text-flame-crimson text-lg mb-2">Tech Stack</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.caseStudy.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="text-sm px-3 py-1 rounded-full bg-flame-crimson text-flame-cream font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        {project.codeLink ? (
                          <a
                            href={project.codeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base px-4 py-2 rounded-lg bg-flame-crimson text-flame-cream hover:bg-flame-scarlet transition-colors"
                          >
                            Code
                          </a>
                        ) : (
                          <span className="text-sm px-3 py-2 rounded-full bg-flame-ink/10 text-flame-ink/60 border border-flame-ink/20">
                            Private / Available on request
                          </span>
                        )}
                        {project.demoLink && (
                          <a
                            href={project.demoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base px-4 py-2 rounded-lg bg-flame-gold text-flame-ink hover:shadow-[0_0_15px_rgba(245,212,105,0.6)] transition-shadow"
                          >
                            Live Demo
                          </a>
                        )}
                        <button
                          onClick={() => setExpandedId(null)}
                          className="text-sm font-semibold text-flame-ink/50 hover:text-flame-crimson transition-colors ml-auto"
                        >
                          Show less ↑
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
