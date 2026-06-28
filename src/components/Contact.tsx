"use client";

import { motion } from "framer-motion";
import SocialBlob from "./SocialBlob";
import ContactForm from "./ContactForm";
import FlameGlow from "./FlameGlow";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative bg-flame-cream py-16 sm:py-20 px-6 overflow-hidden"
    >
      <FlameGlow variant="reverse" />

      <div className="relative text-center mb-10 sm:mb-12">
        <span className="inline-block px-4 py-1 rounded-full bg-flame-crimson text-flame-cream text-sm uppercase tracking-[0.2em] font-semibold mb-6">
          Get In Touch
        </span>
        <motion.h2
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="font-jp text-3xl sm:text-4xl md:text-5xl mb-2 bg-gradient-to-r from-flame-crimson via-flame-scarlet to-flame-gold bg-clip-text text-transparent"
        >
          繋がろう
        </motion.h2>
        <p className="text-flame-ink/50 text-sm italic mb-4">Let&apos;s Connect</p>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-24 h-1.5 mx-auto rounded-full bg-gradient-to-r from-flame-gold via-flame-crimson to-flame-scarlet"
        />
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px" }}
          transition={{ type: "spring", stiffness: 180, damping: 16 }}
          className="order-2 md:order-1"
        >
          <SocialBlob />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="order-1 md:order-2"
        >
          <ContactForm />
        </motion.div>
      </div>
    </section>
  );
}
