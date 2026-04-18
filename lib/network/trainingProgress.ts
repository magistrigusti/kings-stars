export interface NetworkTrainingProgress {
  brainSeconds: number;
  breathingSeconds: number;
  breathingByExercise: Record<string, number>;
  updatedAt: string | null;
}

export const EMPTY_NETWORK_PROGRESS: NetworkTrainingProgress = {
  brainSeconds: 0,
  breathingSeconds: 0,
  breathingByExercise: {},
  updatedAt: null,
};

function toSeconds(value: unknown): number {
  const seconds = Number(value);

  if (!Number.isFinite(seconds) || seconds < 0) {
    return 0;
  }

  return Math.floor(seconds);
}

function toDateTime(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const timestamp = Date.parse(value);

  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : null;
}

function toBreathingByExercise(value: unknown): Record<string, number> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return Object.entries(value).reduce<Record<string, number>>((acc, [exerciseId, seconds]) => {
    const cleanId = exerciseId.trim();

    if (cleanId) {
      acc[cleanId] = toSeconds(seconds);
    }

    return acc;
  }, {});
}

export function sanitizeTrainingProgress(value: unknown): NetworkTrainingProgress {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return EMPTY_NETWORK_PROGRESS;
  }

  const source = value as Partial<NetworkTrainingProgress>;

  return {
    brainSeconds: toSeconds(source.brainSeconds),
    breathingSeconds: toSeconds(source.breathingSeconds),
    breathingByExercise: toBreathingByExercise(source.breathingByExercise),
    updatedAt: toDateTime(source.updatedAt),
  };
}

function latestDate(a: string | null, b: string | null): string | null {
  if (!a) {
    return b;
  }

  if (!b) {
    return a;
  }

  return Date.parse(a) >= Date.parse(b) ? a : b;
}

export function mergeTrainingProgress(
  localProgress: NetworkTrainingProgress,
  remoteProgress: NetworkTrainingProgress,
): NetworkTrainingProgress {
  const exerciseIds = new Set([
    ...Object.keys(localProgress.breathingByExercise),
    ...Object.keys(remoteProgress.breathingByExercise),
  ]);

  const breathingByExercise = Array.from(exerciseIds).reduce<Record<string, number>>((acc, exerciseId) => {
    acc[exerciseId] = Math.max(
      localProgress.breathingByExercise[exerciseId] ?? 0,
      remoteProgress.breathingByExercise[exerciseId] ?? 0,
    );

    return acc;
  }, {});

  return {
    brainSeconds: Math.max(localProgress.brainSeconds, remoteProgress.brainSeconds),
    breathingSeconds: Math.max(localProgress.breathingSeconds, remoteProgress.breathingSeconds),
    breathingByExercise,
    updatedAt: latestDate(localProgress.updatedAt, remoteProgress.updatedAt),
  };
}
