export const KEGEL_MAX_LEVEL = 50;
export const KEGEL_MIN_LEVEL = 1;

export type KegelPhaseKind =
  | 'prepare'
  | 'classicHold'
  | 'classicRest'
  | 'recovery'
  | 'pulse'
  | 'pulseRest';

export interface KegelLevelPlan {
  level: number;
  classicRepeats: number;
  classicHoldSeconds: number;
  classicRestSeconds: number;
  recoverySeconds: number;
  pulseSets: number;
  pulseSetSeconds: number;
  pulseRestSeconds: number;
  prepareSeconds: number;
  totalSeconds: number;
}

export interface KegelSessionPhase {
  id: string;
  kind: KegelPhaseKind;
  title: string;
  durationSeconds: number;
  repetition?: number;
  set?: number;
}

function clampKegelLevel(level: number) {
  if (!Number.isFinite(level)) {
    return KEGEL_MIN_LEVEL;
  }

  return Math.min(KEGEL_MAX_LEVEL, Math.max(KEGEL_MIN_LEVEL, Math.round(level)));
}

function getLevelProgress(level: number) {
  return (clampKegelLevel(level) - KEGEL_MIN_LEVEL) / (KEGEL_MAX_LEVEL - KEGEL_MIN_LEVEL);
}

function interpolateLevelValue(level: number, firstLevelValue: number, maxLevelValue: number) {
  const levelProgress = getLevelProgress(level);

  return Math.round(firstLevelValue + (maxLevelValue - firstLevelValue) * levelProgress);
}

export function formatKegelDuration(totalSeconds: number) {
  const cleanSeconds = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(cleanSeconds / 60);
  const seconds = cleanSeconds % 60;

  if (minutes <= 0) {
    return `${seconds} сек`;
  }

  if (seconds === 0) {
    return `${minutes} мин`;
  }

  return `${minutes} мин ${seconds} сек`;
}

export function getKegelLevelPlan(level: number): KegelLevelPlan {
  const cleanLevel = clampKegelLevel(level);
  const classicRepeats = interpolateLevelValue(cleanLevel, 10, 20);
  const classicHoldSeconds = interpolateLevelValue(cleanLevel, 3, 20);
  const classicRestSeconds = 5;
  const recoverySeconds = 30;
  const pulseSets = 3;
  const pulseSetSeconds = interpolateLevelValue(cleanLevel, 10, 45);
  const pulseRestSeconds = 10;
  const prepareSeconds = 3;
  const classicRestTotal = Math.max(0, classicRepeats - 1) * classicRestSeconds;
  const pulseRestTotal = Math.max(0, pulseSets - 1) * pulseRestSeconds;
  const totalSeconds =
    prepareSeconds
    + classicRepeats * classicHoldSeconds
    + classicRestTotal
    + recoverySeconds
    + pulseSets * pulseSetSeconds
    + pulseRestTotal;

  return {
    level: cleanLevel,
    classicRepeats,
    classicHoldSeconds,
    classicRestSeconds,
    recoverySeconds,
    pulseSets,
    pulseSetSeconds,
    pulseRestSeconds,
    prepareSeconds,
    totalSeconds,
  };
}

export function buildKegelSessionPhases(plan: KegelLevelPlan): KegelSessionPhase[] {
  const phases: KegelSessionPhase[] = [
    {
      id: 'prepare',
      kind: 'prepare',
      title: 'Приготовьтесь',
      durationSeconds: plan.prepareSeconds,
    },
  ];

  for (let repetition = 1; repetition <= plan.classicRepeats; repetition += 1) {
    phases.push({
      id: `classic-hold-${repetition}`,
      kind: 'classicHold',
      title: 'Кегель классика',
      durationSeconds: plan.classicHoldSeconds,
      repetition,
    });

    if (repetition < plan.classicRepeats) {
      phases.push({
        id: `classic-rest-${repetition}`,
        kind: 'classicRest',
        title: 'Кегель классика',
        durationSeconds: plan.classicRestSeconds,
        repetition,
      });
    }
  }

  phases.push({
    id: 'recovery',
    kind: 'recovery',
    title: 'Небольшой отдых',
    durationSeconds: plan.recoverySeconds,
  });

  for (let set = 1; set <= plan.pulseSets; set += 1) {
    phases.push({
      id: `pulse-${set}`,
      kind: 'pulse',
      title: 'Кегель пульс',
      durationSeconds: plan.pulseSetSeconds,
      set,
    });

    if (set < plan.pulseSets) {
      phases.push({
        id: `pulse-rest-${set}`,
        kind: 'pulseRest',
        title: 'Отдых между подходами',
        durationSeconds: plan.pulseRestSeconds,
        set,
      });
    }
  }

  return phases;
}

export function getAllKegelLevelPlans() {
  return Array.from({ length: KEGEL_MAX_LEVEL }, (_, index) => (
    getKegelLevelPlan(index + KEGEL_MIN_LEVEL)
  ));
}
