"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function AboutAiAutomations() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -80]);
  const y2 = useTransform(scrollY, [0, 300], [0, 100]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-black via-gray-900 to-gray-950">
      <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col lg:flex-row-reverse items-center justify-between gap-10">
        {/* Right Side Text */}
        <motion.div
          style={{ y }}
          className="flex-1 text-center lg:text-left space-y-6"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent leading-tight">
            Automating the Future, Intelligently 🤖
          </h2>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            I specialize in developing{" "}
            <span className="text-indigo-400 font-semibold">AI automations</span> 
            that streamline workflows and boost productivity.
            <br />
            <br />
            From integrating{" "}
            <span className="font-medium text-purple-400">LLMs</span> with tools like 
            <span className="font-medium text-pink-400"> LangChain</span> 
            to building custom agents using 
            <span className="font-medium text-indigo-400"> Python</span>, 
            <span className="font-medium text-purple-400"> Playwright</span>, 
            and <span className="font-medium text-pink-400"> Puppeteer</span>, 
            I create intelligent automations that learn, adapt, and evolve.
            <br />
            <br />
            My focus lies in making complex AI systems 
            <span className="text-indigo-400 font-semibold"> simple, scalable, and human-friendly.</span>
          </p>
        </motion.div>

        {/* Left Side Blob Animation */}
        <motion.div
          style={{ y: y2 }}
          className="flex-1 flex justify-center items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative w-72 h-72 md:w-96 md:h-96 bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 rounded-[3rem] -rotate-12 blur-[1px] shadow-[0_0_50px_rgba(192,132,252,0.5)]"></div>
        </motion.div>
      </div>
    </section>
  );
}
