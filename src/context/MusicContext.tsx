"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";

interface MusicContextValue {
  mounted: boolean;
  hasChosen: boolean;
  isPlaying: boolean;
  choosePlay: () => void;
  chooseSilence: () => void;
  toggle: () => void;
}

const MusicContext = createContext<MusicContextValue | null>(null);

const STORAGE_KEY = "musicChoice";

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [hasChosen, setHasChosen] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setMounted(true);
    const choice = sessionStorage.getItem(STORAGE_KEY);
    setHasChosen(choice !== null);
  }, []);

  const choosePlay = () => {
    sessionStorage.setItem(STORAGE_KEY, "play");
    setHasChosen(true);
    setIsPlaying(true);
    audioRef.current?.play().catch(() => {});
  };

  const chooseSilence = () => {
    sessionStorage.setItem(STORAGE_KEY, "silence");
    setHasChosen(true);
    setIsPlaying(false);
  };

  const toggle = () => {
    setIsPlaying((prev) => {
      const next = !prev;
      if (next) {
        audioRef.current?.play().catch(() => {});
      } else {
        audioRef.current?.pause();
      }
      return next;
    });
  };

  return (
    <MusicContext.Provider
      value={{ mounted, hasChosen, isPlaying, choosePlay, chooseSilence, toggle }}
    >
      <audio ref={audioRef} src="/theme-music.mp3" loop preload="none" />
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used within a MusicProvider");
  return ctx;
}
