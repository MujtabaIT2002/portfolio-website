"use client";

import { motion } from "framer-motion";
import {
  FaInstagram,
  FaGithub,
  FaLinkedin,
  FaReddit,
} from "react-icons/fa";
import { SiGmail } from "react-icons/si"; // ✅ Gmail logo

export default function SocialBlob() {
  return (
    <div className="relative flex items-center justify-center w-full h-[400px] md:h-[550px] overflow-hidden bg-black">
      {/* 🌈 Multi-layer Animated Blob Background */}
      <div className="relative w-full h-full">
        {/* Primary Blob */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 rounded-full blur-xl opacity-80"
          animate={{
            x: ["-20%", "20%", "-20%"],
            y: ["-10%", "10%", "-10%"],
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            borderRadius: [
              "30% 70% 70% 30%",
              "70% 30% 30% 70%",
              "50% 50% 70% 30%",
              "30% 70% 50% 50%",
              "30% 70% 70% 30%",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Secondary Blob */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] md:w-[350px] md:h-[350px] bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-400 rounded-full blur-lg opacity-60"
          animate={{
            x: ["15%", "-15%", "15%"],
            y: ["15%", "-15%", "15%"],
            scale: [1.1, 0.9, 1.1],
            rotate: [180, 360, 180],
            borderRadius: [
              "70% 30% 50% 50%",
              "30% 70% 50% 50%",
              "50% 50% 70% 30%",
              "50% 50% 30% 70%",
              "70% 30% 50% 50%",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Tertiary Blob */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] md:w-[300px] md:h-[300px] bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full blur-md opacity-50"
          animate={{
            scale: [1, 1.5, 1],
            rotate: [90, 270, 90],
            borderRadius: [
              "40% 60% 60% 40%",
              "60% 40% 40% 60%",
              "40% 40% 60% 60%",
              "60% 60% 40% 40%",
              "40% 60% 60% 40%",
            ],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* ✨ Glowing Particles */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full blur-sm"
          animate={{
            x: [-100, 100, -50, 50, -100],
            y: [-50, 50, -100, 100, -50],
            scale: [0, 1, 0.5, 1, 0],
            opacity: [0, 1, 0.8, 1, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-cyan-300 rounded-full blur-sm"
          animate={{
            x: [80, -80, 40, -40, 80],
            y: [-80, 80, -40, 40, -80],
            scale: [0, 0.8, 0.3, 0.8, 0],
            opacity: [0, 1, 0.6, 1, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* 🌐 Centered Social Icons */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-wrap justify-center gap-6 md:gap-8 z-10">
        {[
          {
            icon: FaInstagram,
            href: "https://www.instagram.com/mujtaba.tariq.184",
            color: "text-pink-400",
            hoverColor: "text-pink-300",
          },
          {
            icon: FaGithub,
            href: "https://github.com/MujtabaIT2002",
            color: "text-gray-300",
            hoverColor: "text-white",
          },
          {
            icon: FaLinkedin,
            href: "https://www.linkedin.com/in/mujtaba-tariq-97053b277",
            color: "text-blue-400",
            hoverColor: "text-blue-300",
          },
          {
            icon: FaReddit,
            href: "https://www.reddit.com/user/Mujjutariq",
            color: "text-orange-400",
            hoverColor: "text-orange-300",
          },
          {
            icon: SiGmail, // ✅ Gmail icon
            href: "https://mail.google.com/mail/?view=cm&fs=1&to=Mujtabatariq01@gmail.com",
            color: "text-red-400",
            hoverColor: "text-red-300",
          },
        ].map((social, index) => (
          <motion.a
            key={index}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative"
            whileHover={{ scale: 1.3, y: -5 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: index * 0.1,
              type: "spring",
              stiffness: 100,
            }}
          >
            <social.icon
              className={`text-4xl md:text-5xl ${social.color} transition-all duration-300 group-hover:${social.hoverColor} filter drop-shadow-lg`}
            />
          </motion.a>
        ))}
      </div>

      {/* ✨ Floating Text */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm font-light tracking-wider"
        animate={{
          opacity: [0.3, 1, 0.3],
          y: [0, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        Connect with me
      </motion.div>
    </div>
  );
}
