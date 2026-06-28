"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState("home");

  useEffect(() => {
    const sections = NAV_LINKS.map((link) =>
      document.getElementById(link.href.slice(1))
    ).filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 w-[94%] max-w-3xl
                 bg-flame-cream/95 backdrop-blur-[20px] border-2 border-flame-scarlet/30
                 shadow-[0_0_15px_rgba(195,58,51,0.25)] text-flame-ink
                 px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between rounded-2xl z-50
                 transition-all duration-500
                 hover:shadow-[0_0_25px_rgba(245,212,105,0.6)]"
    >
      <span className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-flame-gold via-flame-crimson to-flame-scarlet" />

      <a
        href="/Mujtaba_CV.pdf"
        download
        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-flame-crimson text-flame-cream rounded-lg font-medium
                   text-sm sm:text-base hover:bg-flame-scarlet hover:scale-105
                   hover:shadow-[0_0_15px_rgba(195,58,51,0.6)] transition-all duration-300 whitespace-nowrap"
      >
        <span className="hidden sm:inline">Download </span>CV
      </a>

      <div className="hidden lg:flex gap-1 text-base font-medium">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeId === link.href.slice(1)
                ? "bg-flame-crimson text-flame-cream font-semibold"
                : "text-flame-ink/70 hover:text-flame-crimson hover:bg-flame-crimson/10"
            }`}
          >
            {link.label}
          </a>
        ))}
      </div>

      <button
        className="lg:hidden p-2 hover:bg-flame-crimson/10 rounded-lg transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-[calc(100%+0.5rem)] left-0 w-full
                       bg-flame-cream/95 backdrop-blur-[20px] border-2 border-flame-scarlet/30
                       shadow-[0_0_20px_rgba(195,58,51,0.35)] flex flex-col items-center
                       py-4 space-y-3 lg:hidden rounded-2xl"
          >
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
                className={`px-4 py-1.5 rounded-lg transition-colors ${
                  activeId === link.href.slice(1)
                    ? "bg-flame-crimson text-flame-cream font-semibold"
                    : "text-flame-ink/70 hover:text-flame-crimson"
                }`}
              >
                {link.label}
              </motion.a>
            ))}

            <a
              href="/Mujtaba_CV.pdf"
              download
              className="px-4 py-2 bg-flame-crimson text-flame-cream rounded-lg font-medium
                         text-base hover:bg-flame-scarlet hover:scale-105
                         hover:shadow-[0_0_15px_rgba(195,58,51,0.6)] transition-all duration-300"
            >
              Download CV
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
