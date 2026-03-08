import { useState, useEffect } from "react";

const SCAN_BOX_SIZES = {
  sm: { width: 0.9, height: 0.4, x: 0.05, y: 0.1 },
  md: { width: 0.8, height: 0.5, x: 0.1, y: 0.15 },
  lg: { width: 0.6, height: 0.5, x: 0.2, y: 0.15 },
  xl: { width: 0.5, height: 0.8, x: 0.2, y: 0.15 },
  "2xl": { width: 0.4, height: 1.5, x: 0.2, y: 0.15 },
};

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export function useResponsiveScanBox() {
  const [scanBox, setScanBox] = useState(SCAN_BOX_SIZES.md);

  useEffect(() => {
    const updateBox = () => {
      const width = window.innerWidth;
      if (width < breakpoints.sm)
        setScanBox(SCAN_BOX_SIZES.sm); // Tailwind 'sm'
      else if (width < breakpoints.lg)
        setScanBox(SCAN_BOX_SIZES.md); // Tailwind 'md'
      else setScanBox(SCAN_BOX_SIZES.lg); // Tailwind 'lg'
    };

    updateBox();
    window.addEventListener("resize", updateBox);
    return () => window.removeEventListener("resize", updateBox);
  }, []);

  return scanBox;
}
