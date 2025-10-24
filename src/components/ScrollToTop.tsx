"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Small delay to ensure the page has rendered
    const timer = setTimeout(() => {
      // Use immediate scroll to top without smooth behavior to prevent timing issues
      window.scrollTo(0, 0);
      
      // Also ensure the document element is at the top
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Force a reflow to ensure the scroll position is set
      document.documentElement.offsetHeight;
      
      // Additional fix for Framer Motion scroll transforms
      // Dispatch a custom event to reset any scroll-based animations
      window.dispatchEvent(new Event('scroll'));
      
      // Force another scroll event after a brief delay to ensure transforms reset
      setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
      }, 50);
    }, 0);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
