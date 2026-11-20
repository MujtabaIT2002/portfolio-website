import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const pixel = localFont({
  src: "../fonts/PressStart2P.woff2",
  variable: "--font-pixel",
  weight: "400",
  display: "swap",
  preload: true,
});

const term = localFont({
  src: "../fonts/VT323.woff2",
  variable: "--font-term",
  weight: "400",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Mujtaba Tariq — MUJTABA.EXE | AI / Full-Stack Developer",
  description:
    "Explore Mujtaba Tariq's interactive pixel-art portfolio: an island of ASCII oceans, quests and arcade cabinets. AI / Full-Stack developer — LLM fine-tuning, automation systems, MERN.",
  metadataBase: new URL("https://mujtabatariq.dev"),
  openGraph: {
    title: "MUJTABA.EXE — an explorable pixel-art portfolio",
    description: "AI / Full-Stack Developer · LLM Fine-Tuning · Automation Systems",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b0624",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${pixel.variable} ${term.variable}`}>
      <body>{children}</body>
    </html>
  );
}
