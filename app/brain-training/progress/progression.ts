export const FIRST_LEVEL_SECONDS = 100 * 60;
export const MAX_LEVEL = 35;

export const BRAIN_FIRST_LEVEL_XP = 60 * 60;
export const BRAIN_MAX_LEVEL = 100;
export const BRAIN_TOTAL_XP_FOR_MAX_LEVEL = 100 * 24 * 60 * 60;
export const BRAIN_MAX_SPEED_BONUS = 0.35;

export interface LevelProgress {
  level: number;
  maxLevel: number;
  currentSeconds: number;
  nextLevelSeconds: number;
  progressPercent: number;
  isMaxLevel: boolean;
}

export interface BrainLevelProgress {
  level: number;
  maxLevel: number;
  currentXp: number;
  nextLevelXp: number;
  progressPercent: number;
  isMaxLevel: boolean;
  remainingXp: number;
  totalXpForLevel: number;
  totalXpForNextLevel: number;
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

const BRAIN_LEVEL_CURVE_POWER = Math.log(
  BRAIN_FIRST_LEVEL_XP / BRAIN_TOTAL_XP_FOR_MAX_LEVEL
) / Math.log(1 / (BRAIN_MAX_LEVEL - 1));

export function getBrainTotalXpForLevel(level: number): number {
  const cleanLevel = Math.min(
    BRAIN_MAX_LEVEL,
    Math.max(1, Math.floor(level)),
  );

  if (cleanLevel <= 1) {
    return 0;
  }

  const levelProgress = (cleanLevel - 1) / (BRAIN_MAX_LEVEL - 1);

  return Math.round(
    BRAIN_TOTAL_XP_FOR_MAX_LEVEL * Math.pow(levelProgress, BRAIN_LEVEL_CURVE_POWER),
  );
}

export function getBrainLevelProgress(totalXp: number): BrainLevelProgress {
  const cleanXp = Math.max(0, Number.isFinite(totalXp) ? totalXp : 0);
  let level = 1;

  while (
    level < BRAIN_MAX_LEVEL &&
    cleanXp >= getBrainTotalXpForLevel(level + 1)
  ) {
    level += 1;
  }

  const isMaxLevel = level >= BRAIN_MAX_LEVEL;
  const totalXpForLevel = getBrainTotalXpForLevel(level);
  const totalXpForNextLevel = isMaxLevel
    ? BRAIN_TOTAL_XP_FOR_MAX_LEVEL
    : getBrainTotalXpForLevel(level + 1);
  const nextLevelXp = Math.max(1, totalXpForNextLevel - totalXpForLevel);
  const currentXp = isMaxLevel
    ? nextLevelXp
    : Math.max(0, cleanXp - totalXpForLevel);
  const remainingXp = isMaxLevel
    ? 0
    : Math.max(0, totalXpForNextLevel - cleanXp);
  const progressPercent = isMaxLevel
    ? 100
    : Math.min(100, Math.round((currentXp / nextLevelXp) * 100));

  return {
    level,
    maxLevel: BRAIN_MAX_LEVEL,
    currentXp,
    nextLevelXp,
    progressPercent,
    isMaxLevel,
    remainingXp,
    totalXpForLevel,
    totalXpForNextLevel,
  };
}

export function getBrainSpeedXpMultiplier(speed: number): number {
  const speedMin = 500;
  const speedMax = 3000;
  const cleanSpeed = Math.max(speedMin, Math.min(speedMax, Math.round(speed)));
  const fastRatio = (speedMax - cleanSpeed) / (speedMax - speedMin);

  return 1 + fastRatio * BRAIN_MAX_SPEED_BONUS;
}

export function formatXpMultiplier(multiplier: number): string {
  return `x${multiplier.toFixed(2)} XP`;
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

export function formatXp(points: number): string {
  return `${Math.max(0, Math.floor(points))} XP`;
}
