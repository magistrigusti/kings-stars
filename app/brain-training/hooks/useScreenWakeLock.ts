'use client';

import { useEffect, useRef } from 'react';

type ScreenWakeLockType = 'screen';

interface ScreenWakeLockSentinel extends EventTarget {
  readonly released: boolean;
  release: () => Promise<void>;
}

interface ScreenWakeLockController {
  request: (type: ScreenWakeLockType) => Promise<ScreenWakeLockSentinel>;
}

interface WakeLockNavigator extends Navigator {
  wakeLock?: ScreenWakeLockController;
}

export function useScreenWakeLock(active: boolean) {
  const wakeLockRef = useRef<ScreenWakeLockSentinel | null>(null);

  useEffect(() => {
    if (!active || typeof navigator === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const wakeLock = (navigator as WakeLockNavigator).wakeLock;

    if (!wakeLock) {
      return;
    }

    let isCancelled = false;

    const releaseWakeLock = () => {
      const sentinel = wakeLockRef.current;
      wakeLockRef.current = null;

      if (sentinel && !sentinel.released) {
        void sentinel.release().catch(() => undefined);
      }
    };

    const requestWakeLock = async () => {
      if (
        isCancelled ||
        document.visibilityState !== 'visible' ||
        (wakeLockRef.current && !wakeLockRef.current.released)
      ) {
        return;
      }

      try {
        const sentinel = await wakeLock.request('screen');

        if (isCancelled) {
          void sentinel.release().catch(() => undefined);
          return;
        }

        const handleRelease = () => {
          if (wakeLockRef.current === sentinel) {
            wakeLockRef.current = null;
          }

          sentinel.removeEventListener('release', handleRelease);
        };

        sentinel.addEventListener('release', handleRelease);
        wakeLockRef.current = sentinel;
      } catch {
        wakeLockRef.current = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void requestWakeLock();
        return;
      }

      releaseWakeLock();
    };

    void requestWakeLock();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isCancelled = true;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      releaseWakeLock();
    };
  }, [active]);
}
