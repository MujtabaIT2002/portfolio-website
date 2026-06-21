"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMusic } from "@/context/MusicContext";
import FlameEmbers from "./FlameEmbers";

export default function IntroMusicGate() {
  const { mounted, hasChosen, choosePlay, chooseSilence } = useMusic();

  const show = mounted && !hasChosen;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-flame-ink overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
          <FlameEmbers density="medium" />

          <motion.div
            className="relative z-10 flex flex-col items-center gap-8 px-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="text-flame-gold/70 text-xs sm:text-sm tracking-[0.3em] uppercase">
              心を燃やせ
            </p>
            <h1 className="font-heading text-flame-cream text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
              Welcome, Traveler
            </h1>
            <p className="text-flame-cream/70 text-base sm:text-lg max-w-md">
              Would you like to set the mood with music while exploring this
              portfolio?
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <motion.button
                onClick={choosePlay}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-lg font-semibold text-base sm:text-lg bg-flame-gold text-flame-ink border-2 border-flame-gold shadow-[0_0_25px_rgba(245,212,105,0.5)] hover:shadow-[0_0_40px_rgba(245,212,105,0.8)] transition-shadow"
              >
                🔥 Play with Sound
              </motion.button>
              <motion.button
                onClick={chooseSilence}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-lg font-semibold text-base sm:text-lg bg-transparent text-flame-cream border-2 border-flame-cream/30 hover:border-flame-cream/70 transition-colors"
              >
                Continue in Silence
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
