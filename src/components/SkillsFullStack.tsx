"use client";

import { motion } from "framer-motion";
import {
  FaReact, FaNodeJs, FaHtml5, FaCss3Alt,
  FaJsSquare, FaGitAlt, FaMobileAlt
} from "react-icons/fa";
import {
  SiPostgresql, SiMongodb, SiNextdotjs, SiPostman
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc"; // ✅ Correct import for VS Code icon

export default function SkillsFullStack() {
  const skills = [
    { name: "React.js", icon: <FaReact className="text-cyan-400" />, level: 90 },
    { name: "Next.js", icon: <SiNextdotjs className="text-white" />, level: 85 },
    { name: "Node.js", icon: <FaNodeJs className="text-green-400" />, level: 88 },
    { name: "MongoDB", icon: <SiMongodb className="text-green-500" />, level: 80 },
    { name: "PostgreSQL", icon: <SiPostgresql className="text-blue-400" />, level: 75 },
    { name: "JavaScript", icon: <FaJsSquare className="text-yellow-400" />, level: 92 },
    { name: "HTML", icon: <FaHtml5 className="text-orange-500" />, level: 95 },
    { name: "CSS", icon: <FaCss3Alt className="text-blue-500" />, level: 90 },
    { name: "React Native", icon: <FaMobileAlt className="text-indigo-400" />, level: 80 },
  ];

  const tools = [
    { name: "Git", icon: <FaGitAlt className="text-orange-400" /> },
    { name: "VS Code", icon: <VscVscode className="text-blue-400" /> }, // ✅ Fixed icon
    { name: "Postman", icon: <SiPostman className="text-orange-400" /> },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-black via-gray-900 to-gray-950 py-20 px-6 text-gray-100">
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl md:text-5xl font-extrabold text-center mb-16 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text"
      >
        My Skills Dashboard ⚡
      </motion.h2>

      {/* Skills Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 justify-items-center max-w-6xl mx-auto">
        {skills.map((skill, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="bg-gray-800/70 border border-gray-700 rounded-2xl p-6 w-36 sm:w-40 shadow-lg hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all flex flex-col items-center"
          >
            <div className="text-4xl mb-2">{skill.icon}</div>
            <h3 className="text-sm font-semibold text-gray-200 mb-2">
              {skill.name}
            </h3>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-2 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full"
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
          className="text-2xl md:text-3xl font-bold mb-10 bg-gradient-to-r from-indigo-400 to-pink-400 text-transparent bg-clip-text"
        >
          Tools I Use 🧰
        </motion.h3>

        <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
          {tools.map((tool, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-gray-800/70 border border-gray-700 shadow-md hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] rounded-2xl px-5 py-4 flex flex-col items-center w-28 sm:w-32"
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
