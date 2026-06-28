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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-flame-ink/75 backdrop-blur-md p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
        >
          <motion.div
            className="relative w-full max-w-md rounded-3xl border-2 border-flame-gold/40 bg-flame-ink shadow-[0_25px_70px_rgba(0,0,0,0.55)] overflow-hidden px-6 sm:px-10 py-10 sm:py-12 text-center"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
          >
            <FlameEmbers density="low" />

            <div className="relative z-10 flex flex-col items-center gap-6">
              <p className="font-jp text-flame-gold/70 text-xs tracking-[0.3em] uppercase">
                心を燃やせ
              </p>
              <h1 className="font-heading text-flame-cream text-2xl sm:text-3xl">
                Welcome, Traveler
              </h1>
              <p className="text-flame-cream/70 text-sm sm:text-base max-w-xs">
                Would you like to set the mood with music while exploring this
                portfolio?
              </p>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-1">
                <motion.button
                  onClick={choosePlay}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 rounded-lg font-semibold text-sm sm:text-base bg-flame-gold text-flame-ink border-2 border-flame-gold shadow-[0_0_20px_rgba(245,212,105,0.5)] hover:shadow-[0_0_35px_rgba(245,212,105,0.8)] transition-shadow"
                >
                  Play with Sound
                </motion.button>
                <motion.button
                  onClick={chooseSilence}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 rounded-lg font-semibold text-sm sm:text-base bg-transparent text-flame-cream border-2 border-flame-cream/30 hover:border-flame-cream/70 transition-colors"
                >
                  Continue in Silence
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
