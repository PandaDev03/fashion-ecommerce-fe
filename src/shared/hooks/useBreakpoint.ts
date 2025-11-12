import { useEffect, useState } from 'react';
import { breakpoints } from '../utils/theme';

interface WindowSize {
  width: number | undefined;
  height: number | undefined;
}

const initialWindowSize: WindowSize = {
  width: undefined,
  height: undefined,
};

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<WindowSize>(initialWindowSize);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

export const useBreakpoint = () => {
  const { width } = useWindowSize();

  if (width === undefined)
    return {
      isXs: true,
      isSm: false,
      isMd: false,
      isLg: false,
      isXl: false,
      is2Xl: false,
    };

  return {
    // isXs: width < breakpoints.sm,
    isXs: width >= breakpoints.xs,
    isSm: width >= breakpoints.sm,
    isMd: width >= breakpoints.md,
    isLg: width >= breakpoints.lg,
    isXl: width >= breakpoints.xl,
    is2Xl: width >= breakpoints['2xl'],

    isMobile: width < breakpoints.md,
    isDesktop: width >= breakpoints.lg,
  };
};
