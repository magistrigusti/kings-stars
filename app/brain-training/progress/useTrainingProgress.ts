'use client';

import { useUser } from '@clerk/nextjs';
import { useCallback, useEffect, useState } from 'react';
import {
  mergeTrainingProgress,
  sanitizeTrainingProgress,
} from '@/lib/network/trainingProgress';
import type { TrainingProgress } from './types';

const STORAGE_KEY = 'training-zone-progress-v1';
const SYNC_DELAY_MS = 1200;

const EMPTY_PROGRESS: TrainingProgress = {
  brainSeconds: 0,
  breathingSeconds: 0,
  breathingByExercise: {},
  updatedAt: null,
};

function readProgress(): TrainingProgress {
  if (typeof window === 'undefined') {
    return EMPTY_PROGRESS;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return EMPTY_PROGRESS;
    }

    const parsed = JSON.parse(raw) as Partial<TrainingProgress>;

    return {
      brainSeconds: Number(parsed.brainSeconds) || 0,
      breathingSeconds: Number(parsed.breathingSeconds) || 0,
      breathingByExercise:
        parsed.breathingByExercise && typeof parsed.breathingByExercise === 'object'
          ? parsed.breathingByExercise
          : {},
      updatedAt: parsed.updatedAt ?? null,
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function useTrainingProgress() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [progress, setProgress] = useState<TrainingProgress>(readProgress);
  const [remoteReady, setRemoteReady] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {}
  }, [progress]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn || !user?.id) {
      setRemoteReady(false);
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    async function loadRemoteProgress() {
      try {
        const response = await fetch('/api/network/progress', {
          cache: 'no-store',
          signal: controller.signal,
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        const remoteProgress = sanitizeTrainingProgress(data.progress);

        if (!cancelled) {
          setProgress(prev => mergeTrainingProgress(prev, remoteProgress));
        }
      } catch {
      } finally {
        if (!cancelled) {
          setRemoteReady(true);
        }
      }
    }

    setRemoteReady(false);
    loadRemoteProgress();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [isLoaded, isSignedIn, user?.id]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user?.id || !remoteReady) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      fetch('/api/network/progress', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ progress }),
      }).catch(() => {});
    }, SYNC_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isLoaded, isSignedIn, progress, remoteReady, user?.id]);

  const addBrainSeconds = useCallback((seconds = 1) => {
    setProgress(prev => ({
      ...prev,
      brainSeconds: prev.brainSeconds + seconds,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const addBreathingSeconds = useCallback((exerciseId: string, seconds = 1) => {
    setProgress(prev => ({
      ...prev,
      breathingSeconds: prev.breathingSeconds + seconds,
      breathingByExercise: {
        ...prev.breathingByExercise,
        [exerciseId]: (prev.breathingByExercise[exerciseId] ?? 0) + seconds,
      },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  return {
    progress,
    addBrainSeconds,
    addBreathingSeconds,
  };
}
