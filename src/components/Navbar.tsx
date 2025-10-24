"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-3xl 
                 bg-black/80 backdrop-blur-[20px] border border-cyan-400/20 
                 shadow-[0_0_12px_rgba(6,182,212,0.25)] text-white 
                 px-6 py-3 flex items-center justify-between rounded-2xl z-50 
                 transition-all duration-500 animate-[pulse_3s_ease-in-out_infinite]
                 hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]"
    >
      {/* ✅ Download CV Button */}
      <a
        href="Mujtaba_CV.pdf"
        download
        className="px-4 py-2 bg-cyan-500/20 text-white rounded-lg font-medium 
                   border border-cyan-400/30 hover:bg-cyan-500/30 hover:scale-105 
                   hover:shadow-[0_0_15px_rgba(6,182,212,0.6)] transition-all duration-300"
      >
        📄 Download CV
      </a>

      {/* 🌐 Desktop Menu */}
      <div className="hidden lg:flex gap-8 text-sm sm:text-base font-medium">
        <Link href="/" className="hover:text-cyan-400 transition">Home</Link>
        <Link href="/fullstack" className="hover:text-cyan-400 transition">Full Stack</Link>
        <Link href="/ai-automations" className="hover:text-cyan-400 transition">AI Automations</Link>
        <Link href="/projects" className="hover:text-cyan-400 transition">Projects</Link>
        <Link href="/contact" className="hover:text-cyan-400 transition">Contact</Link>
      </div>

      {/* 🍔 Mobile Menu Button */}
      <button
        className="lg:hidden p-2 hover:bg-cyan-500/10 rounded-lg transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* 📱 Mobile Dropdown */}
      {isOpen && (
        <div
          className="absolute top-full left-0 w-full 
                     bg-black/80 backdrop-blur-[20px] border-t border-cyan-400/20 
                     shadow-[0_0_20px_rgba(6,182,212,0.4)] flex flex-col items-center 
                     py-4 space-y-4 lg:hidden rounded-b-2xl"
        >
          <Link href="/" onClick={() => setIsOpen(false)} className="hover:text-cyan-400 transition">Home</Link>
          <Link href="/fullstack" onClick={() => setIsOpen(false)} className="hover:text-cyan-400 transition">Full Stack</Link>
          <Link href="/ai-automations" onClick={() => setIsOpen(false)} className="hover:text-cyan-400 transition">AI Automations</Link>
          <Link href="/projects" onClick={() => setIsOpen(false)} className="hover:text-cyan-400 transition">Projects</Link>
          <Link href="/contact" onClick={() => setIsOpen(false)} className="hover:text-cyan-400 transition">Contact</Link>

          <a
            href="Mujtaba_CV.pdf"
            download
            className="px-4 py-2 bg-cyan-500/20 text-white rounded-lg font-medium 
                       border border-cyan-400/30 hover:bg-cyan-500/30 hover:scale-105 
                       hover:shadow-[0_0_15px_rgba(6,182,212,0.6)] transition-all duration-300"
          >
            📄 Download CV
          </a>
        </div>
      )}
    </nav>
  );
}
