"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function RengokuClosing() {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-flame-ink">
      {!imgError ? (
        <Image
          src="/rengoku.jpg"
          alt="Kyojuro Rengoku"
          fill
          className="object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-flame-ink via-flame-scarlet to-flame-crimson" />
      )}

      {/* gradient fades */}
      <div className="absolute inset-0 bg-gradient-to-t from-flame-crimson/85 via-flame-ink/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-flame-cream/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-flame-scarlet/20 via-transparent to-flame-gold/15" />

      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center z-20 px-6 w-full">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="font-heading text-flame-cream text-3xl sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
        >
          Set your heart ablaze!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
          className="font-heading text-flame-gold text-base sm:text-xl md:text-2xl mt-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
        >
          心を燃やせ — Kokoro wo moyase
        </motion.p>
      </div>
    </section>
  );
}
