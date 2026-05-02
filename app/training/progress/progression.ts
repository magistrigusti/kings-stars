import { BRAIN_LEVEL_MINUTES } from '../data/brainLevelMinutes';
import { BREATHING_LEVEL_MINUTES } from '../data/breathingLevelMinutes';

const SECONDS_PER_MINUTE = 60;

type LevelMinuteRequirement = {
  level: number;
  totalMinutes: number;
};

type LevelSecondRequirement = {
  level: number;
  totalSeconds: number;
};

function toSecondRequirements(
  requirements: readonly LevelMinuteRequirement[],
): LevelSecondRequirement[] {
  return requirements.map(requirement => ({
    level: requirement.level,
    totalSeconds: requirement.totalMinutes * SECONDS_PER_MINUTE,
  }));
}

const BREATHING_LEVEL_SECONDS = toSecondRequirements(BREATHING_LEVEL_MINUTES);
const BRAIN_LEVEL_XP = toSecondRequirements(BRAIN_LEVEL_MINUTES);

export const FIRST_LEVEL_SECONDS = BREATHING_LEVEL_SECONDS[0]?.totalSeconds ?? 50 * SECONDS_PER_MINUTE;
export const MAX_LEVEL = BREATHING_LEVEL_SECONDS.length;

export const BRAIN_FIRST_LEVEL_XP = BRAIN_LEVEL_XP[0]?.totalSeconds ?? 50 * SECONDS_PER_MINUTE;
export const BRAIN_MAX_LEVEL = BRAIN_LEVEL_XP.length;
export const BRAIN_TOTAL_XP_FOR_MAX_LEVEL =
  BRAIN_LEVEL_XP[BRAIN_LEVEL_XP.length - 1]?.totalSeconds ?? BRAIN_FIRST_LEVEL_XP;
export const BRAIN_MAX_SPEED_BONUS = 0.35;

export interface LevelProgress {
  level: number;
  maxLevel: number;
  currentSeconds: number;
  nextLevelSeconds: number;
  progressPercent: number;
  isMaxLevel: boolean;
  remainingSeconds: number;
  totalSecondsForLevel: number;
  totalSecondsForNextLevel: number;
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

function getProgressFromRequirements(
  totalSeconds: number,
  requirements: readonly LevelSecondRequirement[],
): LevelProgress {
  const cleanSeconds = Math.max(0, Math.floor(totalSeconds));
  const maxLevel = requirements.length;
  let completedIndex = -1;

  for (let index = 0; index < requirements.length; index += 1) {
    if (cleanSeconds >= requirements[index].totalSeconds) {
      completedIndex = index;
    } else {
      break;
    }
  }

  const isMaxLevel = completedIndex >= requirements.length - 1;
  const level = completedIndex >= 0 ? requirements[completedIndex].level : 0;
  const totalSecondsForLevel = completedIndex >= 0
    ? requirements[completedIndex].totalSeconds
    : 0;
  const nextRequirement = isMaxLevel
    ? requirements[requirements.length - 1]
    : requirements[completedIndex + 1];
  const totalSecondsForNextLevel = nextRequirement?.totalSeconds ?? totalSecondsForLevel;
  const nextLevelSeconds = Math.max(1, totalSecondsForNextLevel - totalSecondsForLevel);
  const currentSeconds = isMaxLevel
    ? nextLevelSeconds
    : Math.max(0, cleanSeconds - totalSecondsForLevel);
  const remainingSeconds = isMaxLevel
    ? 0
    : Math.max(0, totalSecondsForNextLevel - cleanSeconds);
  const progressPercent = isMaxLevel
    ? 100
    : Math.min(100, Math.round((currentSeconds / nextLevelSeconds) * 100));

  return {
    level,
    maxLevel,
    currentSeconds,
    nextLevelSeconds,
    progressPercent,
    isMaxLevel,
    remainingSeconds,
    totalSecondsForLevel,
    totalSecondsForNextLevel,
  };
}

export function getLevelProgress(totalSeconds: number): LevelProgress {
  return getProgressFromRequirements(totalSeconds, BREATHING_LEVEL_SECONDS);
}

export function getBrainTotalXpForLevel(level: number): number {
  const cleanLevel = Math.min(
    BRAIN_MAX_LEVEL,
    Math.max(0, Math.floor(level)),
  );

  if (cleanLevel <= 0) {
    return 0;
  }

  return BRAIN_LEVEL_XP[cleanLevel - 1]?.totalSeconds ?? BRAIN_TOTAL_XP_FOR_MAX_LEVEL;
}

export function getBrainLevelProgress(totalXp: number): BrainLevelProgress {
  const cleanXp = Math.max(0, Number.isFinite(totalXp) ? Math.floor(totalXp) : 0);
  const levelProgress = getProgressFromRequirements(cleanXp, BRAIN_LEVEL_XP);

  return {
    level: levelProgress.level,
    maxLevel: BRAIN_MAX_LEVEL,
    currentXp: levelProgress.currentSeconds,
    nextLevelXp: levelProgress.nextLevelSeconds,
    progressPercent: levelProgress.progressPercent,
    isMaxLevel: levelProgress.isMaxLevel,
    remainingXp: levelProgress.remainingSeconds,
    totalXpForLevel: levelProgress.totalSecondsForLevel,
    totalXpForNextLevel: levelProgress.totalSecondsForNextLevel,
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
