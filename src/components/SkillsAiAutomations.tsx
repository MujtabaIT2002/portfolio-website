"use client";

import { motion } from "framer-motion";
import {
  SiPython, SiTensorflow, SiLangchain, SiPandas, SiScikitlearn, 
  SiGoogle, SiDocker, SiN8N
} from "react-icons/si";
import { FaRobot, FaCodeBranch } from "react-icons/fa";
import { RiGoogleFill } from "react-icons/ri";

export default function SkillsAiAutomations() {
  const skills = [
    { name: "Ollama", icon: <FaRobot className="text-pink-400" />, level: 85 },
    { name: "TensorFlow", icon: <SiTensorflow className="text-orange-400" />, level: 80 },
    { name: "LangChain", icon: <SiLangchain className="text-indigo-400" />, level: 88 },
    { name: "Python", icon: <SiPython className="text-yellow-400" />, level: 95 },
    { name: "Pandas", icon: <SiPandas className="text-blue-400" />, level: 85 },
    { name: "Scikit-learn", icon: <SiScikitlearn className="text-green-400" />, level: 78 },
    { name: "App Scripts", icon: <SiGoogle className="text-red-400" />, level: 82 },
    { name: "Playwright", icon: <FaCodeBranch className="text-purple-400" />, level: 80 },
    { name: "Puppeteer", icon: <FaRobot className="text-cyan-400" />, level: 75 },
    { name: "OpenRouter", icon: <SiLangchain className="text-pink-400" />, level: 77 },
  ];

  const tools = [
    { name: "Docker", icon: <SiDocker className="text-blue-400" /> },
    { name: "Google Sheets", icon: <RiGoogleFill className="text-green-400" /> },
    { name: "LLMs", icon: <FaRobot className="text-purple-400" /> },
    { name: "n8n", icon: <SiN8N className="text-red-400" /> },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-black via-gray-900 to-gray-950 py-20 px-6 text-gray-100">
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl md:text-5xl font-extrabold text-center mb-16 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-transparent bg-clip-text"
      >
        AI & Automation Skills 🧠
      </motion.h2>

      {/* Skills Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 justify-items-center max-w-6xl mx-auto">
        {skills.map((skill, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="bg-gray-800/70 border border-gray-700 rounded-2xl p-6 w-36 sm:w-40 shadow-lg hover:shadow-[0_0_25px_rgba(236,72,153,0.4)] transition-all flex flex-col items-center"
          >
            <div className="text-4xl mb-2">{skill.icon}</div>
            <h3 className="text-sm font-semibold text-gray-200 mb-2">
              {skill.name}
            </h3>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tools Section */}
      <div className="mt-20 text-center">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-2xl md:text-3xl font-bold mb-10 bg-gradient-to-r from-pink-400 to-indigo-400 text-transparent bg-clip-text"
        >
          Tools I Use ⚙️
        </motion.h3>

        <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
          {tools.map((tool, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-gray-800/70 border border-gray-700 shadow-md hover:shadow-[0_0_25px_rgba(236,72,153,0.4)] rounded-2xl px-5 py-4 flex flex-col items-center w-28 sm:w-32"
            >
              <div className="text-3xl mb-2">{tool.icon}</div>
              <p className="text-sm font-medium text-gray-200">{tool.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
