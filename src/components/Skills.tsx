"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  FaReact,
  FaNodeJs,
  FaHtml5,
  FaCss3Alt,
  FaJsSquare,
  FaGitAlt,
  FaMobileAlt,
  FaRobot,
  FaCodeBranch,
  FaCuttlefish,
} from "react-icons/fa";
import {
  SiPostgresql,
  SiMongodb,
  SiNextdotjs,
  SiPostman,
  SiPython,
  SiTensorflow,
  SiPytorch,
  SiScikitlearn,
  SiOpencv,
  SiExpress,
  SiPrisma,
  SiN8N,
  SiGoogle,
  SiDocker,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import FlameGlow from "./FlameGlow";

interface Skill {
  name: string;
  icon: ReactNode;
}

interface SkillCategory {
  category: string;
  skills: Skill[];
}

const CATEGORIES: SkillCategory[] = [
  {
    category: "Languages",
    skills: [
      { name: "Python", icon: <SiPython /> },
      { name: "JavaScript", icon: <FaJsSquare /> },
      { name: "C++", icon: <FaCuttlefish /> },
      { name: "SQL", icon: <SiPostgresql /> },
    ],
  },
  {
    category: "AI / Machine Learning",
    skills: [
      { name: "PyTorch", icon: <SiPytorch /> },
      { name: "TensorFlow", icon: <SiTensorflow /> },
      { name: "Scikit-learn", icon: <SiScikitlearn /> },
      { name: "OpenCV", icon: <SiOpencv /> },
      { name: "Model Fine-Tuning", icon: <FaRobot /> },
    ],
  },
  {
    category: "Web Development",
    skills: [
      { name: "React.js", icon: <FaReact /> },
      { name: "Next.js", icon: <SiNextdotjs /> },
      { name: "Node.js", icon: <FaNodeJs /> },
      { name: "Express.js", icon: <SiExpress /> },
      { name: "HTML", icon: <FaHtml5 /> },
      { name: "CSS", icon: <FaCss3Alt /> },
      { name: "React Native", icon: <FaMobileAlt /> },
    ],
  },
  {
    category: "Databases",
    skills: [
      { name: "PostgreSQL", icon: <SiPostgresql /> },
      { name: "MongoDB", icon: <SiMongodb /> },
      { name: "Prisma ORM", icon: <SiPrisma /> },
    ],
  },
  {
    category: "Automation / Scraping",
    skills: [
      { name: "Playwright", icon: <FaCodeBranch /> },
      { name: "Google Apps Script", icon: <SiGoogle /> },
      { name: "Workflow Automation", icon: <FaRobot /> },
    ],
  },
  {
    category: "Tools",
    skills: [
      { name: "Git", icon: <FaGitAlt /> },
      { name: "VS Code", icon: <VscVscode /> },
      { name: "Postman", icon: <SiPostman /> },
      { name: "Docker", icon: <SiDocker /> },
      { name: "n8n", icon: <SiN8N /> },
    ],
  },
];

const ICON_COLORS = ["text-flame-crimson", "text-flame-scarlet", "text-flame-gold"];
const CHIP_BORDERS = [
  "border-flame-crimson/40",
  "border-flame-scarlet/40",
  "border-flame-gold/50",
];

export default function Skills() {
  return (
    <section id="skills" className="relative bg-flame-ink py-24 px-6 overflow-hidden">
      <FlameGlow />

      <div className="relative text-center mb-16">
        <span className="inline-block px-4 py-1 rounded-full bg-flame-crimson text-flame-cream text-sm uppercase tracking-[0.2em] font-semibold mb-6">
          Toolbox
        </span>
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-3xl sm:text-4xl md:text-5xl mb-4 bg-gradient-to-r from-flame-crimson via-flame-scarlet to-flame-gold bg-clip-text text-transparent"
        >
          My Arsenal
        </motion.h2>
        <div className="w-24 h-1.5 mx-auto rounded-full bg-gradient-to-r from-flame-gold via-flame-crimson to-flame-scarlet" />
      </div>

      <div className="relative max-w-5xl mx-auto space-y-14">
        {CATEGORIES.map((cat, ci) => (
          <div key={cat.category}>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: ci * 0.05 }}
              className="font-heading text-xl sm:text-2xl text-flame-gold mb-6 flex items-center gap-3"
            >
              <span className="w-2 h-6 rounded-full bg-gradient-to-b from-flame-gold to-flame-scarlet" />
              {cat.category}
            </motion.h3>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {cat.skills.map((skill, i) => {
                const colorIndex = (ci + i) % 3;
                return (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className={`flex items-center gap-2 bg-flame-cream/5 border-2 ${CHIP_BORDERS[colorIndex]} rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-flame-crimson/5 hover:shadow-[0_0_20px_rgba(245,212,105,0.5)] transition-all`}
                  >
                    <span className={`text-xl sm:text-2xl ${ICON_COLORS[colorIndex]}`}>
                      {skill.icon}
                    </span>
                    <span className="text-sm sm:text-base font-medium text-flame-cream">
                      {skill.name}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
