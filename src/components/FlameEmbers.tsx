"use client";

import { motion } from "framer-motion";

interface Ember {
  left: number;
  size: number;
  duration: number;
  delay: number;
  color: "gold" | "crimson";
}

const EMBERS: Ember[] = [
  { left: 4, size: 4, duration: 7, delay: 0, color: "gold" },
  { left: 12, size: 3, duration: 9, delay: 1.2, color: "crimson" },
  { left: 20, size: 5, duration: 8, delay: 2.4, color: "gold" },
  { left: 29, size: 3, duration: 10, delay: 0.6, color: "crimson" },
  { left: 38, size: 4, duration: 7.5, delay: 3, color: "gold" },
  { left: 47, size: 3, duration: 9.5, delay: 1.8, color: "crimson" },
  { left: 56, size: 5, duration: 8.5, delay: 0.3, color: "gold" },
  { left: 65, size: 3, duration: 11, delay: 2.1, color: "crimson" },
  { left: 73, size: 4, duration: 7, delay: 3.6, color: "gold" },
  { left: 81, size: 3, duration: 9, delay: 1.5, color: "crimson" },
  { left: 89, size: 5, duration: 8, delay: 2.7, color: "gold" },
  { left: 95, size: 3, duration: 10.5, delay: 0.9, color: "crimson" },
];

const DENSITY_COUNT = {
  low: 6,
  medium: 9,
  high: 12,
};

interface FlameEmbersProps {
  density?: "low" | "medium" | "high";
  className?: string;
}

export default function FlameEmbers({
  density = "low",
  className = "",
}: FlameEmbersProps) {
  const embers = EMBERS.slice(0, DENSITY_COUNT[density]);

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none -z-10 ${className}`}
    >
      {embers.map((ember, i) => (
        <motion.span
          key={i}
          className={`absolute bottom-0 rounded-full blur-[1px] ${
            ember.color === "gold" ? "bg-flame-gold" : "bg-flame-crimson"
          }`}
          style={{
            left: `${ember.left}%`,
            width: ember.size,
            height: ember.size,
          }}
          animate={{
            y: [0, -260, -280],
            x: [0, i % 2 === 0 ? 12 : -12, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: ember.duration,
            delay: ember.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
