// src/hooks/use-mount-animation.ts
import { useEffect, useState } from 'react';

export const useMountAnimation = (delay = 0) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return isMounted;
};