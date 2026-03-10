"use client";
import * as React from "react";

const MOBILE_BREAKPOINT = 1024;

interface UseIsMobileReturn {
  isMobile: boolean;
  isLoading: boolean;
}

export function useIsMobile(): UseIsMobileReturn {
  const [isMobile, setIsMobile] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    const checkScreen = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      setIsLoading(false);
    };

    checkScreen();
    mql.addEventListener("change", checkScreen);

    return () => {
      mql.removeEventListener("change", checkScreen);
    };
  }, []);

  return { isMobile, isLoading };
}
