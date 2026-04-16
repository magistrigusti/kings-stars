export const FIRST_LEVEL_SECONDS = 60 * 60;
export const MAX_LEVEL = 20;

export interface LevelProgress {
  level: number;
  maxLevel: number;
  currentSeconds: number;
  nextLevelSeconds: number;
  progressPercent: number;
  isMaxLevel: boolean;
}

export function getLevelProgress(totalSeconds: number): LevelProgress {
  let remainingSeconds = Math.max(0, Math.floor(totalSeconds));
  let level = 1;
  let nextLevelSeconds = FIRST_LEVEL_SECONDS;

  while (level < MAX_LEVEL && remainingSeconds >= nextLevelSeconds) {
    remainingSeconds -= nextLevelSeconds;
    level += 1;
    nextLevelSeconds *= 2;
  }

  const isMaxLevel = level >= MAX_LEVEL;
  const currentSeconds = isMaxLevel ? nextLevelSeconds : remainingSeconds;
  const progressPercent = isMaxLevel
    ? 100
    : Math.min(100, Math.round((currentSeconds / nextLevelSeconds) * 100));

  return {
    level,
    maxLevel: MAX_LEVEL,
    currentSeconds,
    nextLevelSeconds,
    progressPercent,
    isMaxLevel,
  };
}

export function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const restSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}ч ${minutes}м`;
  }

  if (minutes > 0) {
    return `${minutes}м ${restSeconds}с`;
  }

  return `${restSeconds}с`;
}

export function formatXp(seconds: number): string {
  return `${Math.max(0, Math.floor(seconds))} XP`;
}
