"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Project } from "@/app/Data/projectsData";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-flame-ink/50 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-flame-ink border-2 border-flame-scarlet/40 rounded-2xl p-5 sm:p-8 shadow-[0_0_40px_rgba(195,58,51,0.25)]"
          >
            <span className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-flame-gold via-flame-crimson to-flame-scarlet" />
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-flame-cream/10 transition-colors"
            >
              <X size={20} className="text-flame-cream" />
            </button>

            <h3 className="font-heading text-2xl sm:text-3xl text-flame-gold mb-1 pr-8">
              {project.title}
            </h3>
            <span className="text-sm uppercase tracking-wide text-flame-cream/50">
              {project.category === "ai" ? "AI / Automation" : "Full Stack"}
            </span>

            <p className="mt-4 text-base sm:text-lg text-flame-cream/90 italic border-l-4 border-flame-gold pl-4">
              {project.description}
            </p>

            {project.caseStudy && (
              <div className="mt-6 space-y-5">
                <div>
                  <h4 className="font-heading text-flame-gold text-xl mb-1">
                    Overview
                  </h4>
                  <p className="text-flame-cream/80 text-base leading-relaxed">
                    {project.caseStudy.overview}
                  </p>
                </div>
                <div>
                  <h4 className="font-heading text-flame-gold text-xl mb-1">
                    Problem
                  </h4>
                  <p className="text-flame-cream/80 text-base leading-relaxed">
                    {project.caseStudy.problem}
                  </p>
                </div>
                <div>
                  <h4 className="font-heading text-flame-gold text-xl mb-1">
                    Solution
                  </h4>
                  <p className="text-flame-cream/80 text-base leading-relaxed">
                    {project.caseStudy.solution}
                  </p>
                </div>
                <div>
                  <h4 className="font-heading text-flame-gold text-xl mb-2">
                    Tech Stack
                  </h4>
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
              </div>
            )}

            <div className="flex flex-wrap gap-3 mt-8">
              {project.codeLink ? (
                <a
                  href={project.codeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base px-4 py-2 rounded-lg bg-flame-crimson text-flame-cream hover:bg-flame-scarlet transition-colors"
                >
                  💻 Code
                </a>
              ) : (
                <span className="text-sm px-3 py-2 rounded-full bg-flame-cream/10 text-flame-cream/60 border border-flame-cream/20">
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
                  🌐 Live Demo
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
