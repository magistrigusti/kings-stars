import { KEGEL_MAX_LEVEL, KEGEL_MIN_LEVEL } from './kegelProgram';

const KEGEL_LEVEL_STEP_SECONDS = 5 * 60;

export interface KegelLevelProgress {
  level: number;
  completedLevels: number;
  currentSeconds: number;
  requiredSeconds: number;
  remainingSeconds: number;
  progressPercent: number;
  isMaxLevel: boolean;
}

export function getKegelLevelRequirementSeconds(level: number) {
  const cleanLevel = Math.min(
    KEGEL_MAX_LEVEL,
    Math.max(KEGEL_MIN_LEVEL, Math.round(level)),
  );

  return cleanLevel * KEGEL_LEVEL_STEP_SECONDS;
}

export function getKegelLevelProgress(totalTrainingSeconds: number): KegelLevelProgress {
  let restSeconds = Math.max(0, Math.floor(totalTrainingSeconds));
  let completedLevels = 0;

  for (let level = KEGEL_MIN_LEVEL; level <= KEGEL_MAX_LEVEL; level += 1) {
    const requiredSeconds = getKegelLevelRequirementSeconds(level);

    if (restSeconds < requiredSeconds) {
      return {
        level,
        completedLevels,
        currentSeconds: restSeconds,
        requiredSeconds,
        remainingSeconds: requiredSeconds - restSeconds,
        progressPercent: (restSeconds / requiredSeconds) * 100,
        isMaxLevel: false,
      };
    }

    restSeconds -= requiredSeconds;
    completedLevels = level;
  }

  const maxRequiredSeconds = getKegelLevelRequirementSeconds(KEGEL_MAX_LEVEL);

  return {
    level: KEGEL_MAX_LEVEL,
    completedLevels: KEGEL_MAX_LEVEL,
    currentSeconds: maxRequiredSeconds,
    requiredSeconds: maxRequiredSeconds,
    remainingSeconds: 0,
    progressPercent: 100,
    isMaxLevel: true,
  };
}
