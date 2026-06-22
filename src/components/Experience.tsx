"use client";

import { motion } from "framer-motion";
import experience from "@/app/Data/experienceData";
import FlameGlow from "./FlameGlow";

export default function Experience() {
  return (
    <section
      id="experience"
      className="relative bg-flame-cream py-16 sm:py-20 px-6 overflow-hidden"
    >
      <FlameGlow variant="reverse" />

      <div className="relative text-center mb-10 sm:mb-12">
        <span className="inline-block px-4 py-1 rounded-full bg-flame-crimson text-flame-cream text-sm uppercase tracking-[0.2em] font-semibold mb-6">
          Career
        </span>
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-3xl sm:text-4xl md:text-5xl mb-4 bg-gradient-to-r from-flame-crimson via-flame-scarlet to-flame-gold bg-clip-text text-transparent"
        >
          My Journey
        </motion.h2>
        <div className="w-24 h-1.5 mx-auto rounded-full bg-gradient-to-r from-flame-gold via-flame-crimson to-flame-scarlet" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* vertical flame line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[3px] md:-translate-x-1/2 bg-gradient-to-b from-flame-gold via-flame-crimson to-flame-scarlet rounded-full" />

        <div className="space-y-12">
          {experience.map((role, index) => {
            const isOngoing = role.endDate === null;
            const alignRight = index % 2 === 1;

            return (
              <div
                key={role.id}
                className="relative flex md:items-start md:justify-between"
              >
                {/* node marker */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.1 + 0.2,
                    ease: "easeOut",
                  }}
                  className={`absolute left-4 md:left-1/2 -translate-x-1/2 top-1.5 w-4 h-4 rounded-full z-10 ${
                    isOngoing ? "animate-pulse" : ""
                  }`}
                  style={{
                    background:
                      "radial-gradient(circle, #f5d469 0%, #c33a33 70%)",
                    boxShadow: "0 0 12px rgba(245,212,105,0.7)",
                  }}
                />

                <motion.div
                  initial={{ opacity: 0, x: alignRight ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  className={`w-full pl-10 sm:pl-12 md:pl-0 md:w-[46%] ${
                    alignRight ? "md:ml-auto" : ""
                  }`}
                >
                  <div className="bg-flame-ink/5 border-2 border-flame-scarlet/35 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-[0_0_25px_rgba(245,212,105,0.4)] hover:border-flame-gold/60 transition-all">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-heading text-xl sm:text-2xl text-flame-crimson">
                        {role.role}
                      </h3>
                      {isOngoing && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-flame-gold text-flame-ink font-semibold animate-pulse">
                          Present
                        </span>
                      )}
                    </div>
                    <p className="text-flame-ink font-semibold text-base sm:text-lg">
                      {role.company} · {role.location}
                    </p>
                    <p className="text-flame-ink/60 text-sm sm:text-base mb-4">
                      {role.startDate} – {role.endDate ?? "Present"}
                    </p>
                    <ul className="text-flame-ink/80 text-base space-y-1.5 list-disc list-inside text-left">
                      {role.bullets.map((bullet, i) => (
                        <li key={i}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
