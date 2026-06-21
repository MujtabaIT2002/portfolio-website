import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import { MusicProvider } from "@/context/MusicContext";
import "./globals.css";

const sekaiwo = localFont({
  src: "../fonts/Sekaiwo-Regular.ttf",
  variable: "--font-sekaiwo",
  weight: "400",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mujtaba Tariq | Full Stack & AI Developer",
  description:
    "Portfolio of Mujtaba Tariq — Full Stack Developer and AI Automation Engineer specializing in MERN, LLM fine-tuning, and intelligent automation systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sekaiwo.variable} ${inter.variable} antialiased`}
      >
        <MusicProvider>
          <Navbar />
          {children}
        </MusicProvider>
      </body>
    </html>
  );
}
