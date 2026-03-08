import { useState, useEffect } from "react";

// Matches Tailwind's default breakpoints
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

type Breakpoint = keyof typeof breakpoints;

export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>("sm");

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;

      if (width >= breakpoints["2xl"]) setBp("2xl");
      else if (width >= breakpoints.xl) setBp("xl");
      else if (width >= breakpoints.lg) setBp("lg");
      else if (width >= breakpoints.md) setBp("md");
      else setBp("sm");
    };

    update(); // Run on mount
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return bp;
}
