'use client';

import { useCallback, useEffect, useState } from 'react';
import type { TrainingProgress } from './types';

const STORAGE_KEY = 'training-zone-progress-v1';

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
  const [progress, setProgress] = useState<TrainingProgress>(readProgress);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {}
  }, [progress]);

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
