"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { useMusic } from "@/context/MusicContext";

export default function MusicToggle() {
  const { mounted, hasChosen, isPlaying, toggle } = useMusic();

  if (!mounted || !hasChosen) return null;

  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      aria-label={isPlaying ? "Mute music" : "Play music"}
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 border-flame-gold bg-flame-ink shadow-[0_0_20px_rgba(245,212,105,0.4)] transition-opacity ${
        isPlaying ? "opacity-100" : "opacity-50"
      }`}
    >
      <Flame
        size={20}
        className={isPlaying ? "text-flame-gold" : "text-flame-cream/60"}
        fill={isPlaying ? "currentColor" : "none"}
      />
    </motion.button>
  );
}
