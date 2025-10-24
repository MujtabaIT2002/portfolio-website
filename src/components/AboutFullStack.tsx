"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect } from "react";

export default function AboutFullStack() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -80]);
  const y2 = useTransform(scrollY, [0, 300], [0, 100]);

  // Reset scroll transforms when component mounts
  useEffect(() => {
    // Force scroll to top when component mounts to reset transforms
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Left Side */}
        <motion.div
          style={{ y }}
          className="flex-1 text-center lg:text-left space-y-6"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
            Building the Web, One Line at a Time 🚀
          </h2>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            I'm a passionate{" "}
            <span className="font-semibold text-indigo-400">
              Full Stack Developer
            </span>{" "}
            skilled in building high-performance web and mobile experiences
            using the{" "}
            <span className="font-semibold text-purple-400">MERN stack</span>.
            <br />
            <br />
            My work combines clean UI design with efficient backend logic using{" "}
            <span className="font-medium text-indigo-300">Node.js</span>,{" "}
            <span className="font-medium text-purple-300">Express</span>, and
            modern databases like{" "}
            <span className="text-blue-400 font-medium">MongoDB</span> and{" "}
            <span className="text-teal-400 font-medium">PostgreSQL</span>. I
            love turning ideas into real, scalable products that look as good as
            they perform.
          </p>
        </motion.div>

        {/* Right Side Animated Blob */}
        <motion.div
          style={{ y: y2 }}
          className="flex-1 flex justify-center items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative w-72 h-72 md:w-96 md:h-96 bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 rounded-[3rem] rotate-12 blur-[1px] shadow-[0_0_60px_rgba(168,85,247,0.5)] animate-pulse"></div>
        </motion.div>
      </div>
    </section>
  );
}
