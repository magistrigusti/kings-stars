import type { BreathPhase, BreathingExercise } from '../data/breathingExercises';

export interface ActiveBreathState {
  phase: BreathPhase;
  cycle: number;
  completedCycles: number;
  round: number;
  completedRounds: number;
  phaseElapsed: number;
  phaseProgress: number;
  phaseRemaining: number;
  sessionProgress: number;
  isComplete: boolean;
}

export function getBreathingPhases(exercise: BreathingExercise): BreathPhase[] {
  return exercise.phases.filter(phase => phase.key !== 'prepare');
}

export function getPrepareSeconds(exercise: BreathingExercise): number {
  return exercise.phases.find(phase => phase.key === 'prepare')?.seconds ?? 0;
}

export function getCycleSeconds(exercise: BreathingExercise): number {
  if (exercise.protocol === 'wim-hof') {
    return getPhaseSeconds(exercise, 'inhale') + getPhaseSeconds(exercise, 'exhale');
  }

  return getBreathingPhases(exercise).reduce((sum, phase) => sum + phase.seconds, 0);
}

export function getBreathingRounds(exercise: BreathingExercise): number {
  if (exercise.protocol !== 'wim-hof') {
    return 1;
  }

  return Math.max(1, Math.round(exercise.rounds ?? 1));
}

export function getTotalBreathingCycles(exercise: BreathingExercise): number {
  return exercise.protocol === 'wim-hof'
    ? exercise.cycles * getBreathingRounds(exercise)
    : exercise.cycles;
}

function getPhaseSeconds(exercise: BreathingExercise, key: BreathPhase['key']): number {
  return exercise.phases.find(phase => phase.key === key)?.seconds ?? 0;
}

function getWimHofRoundSeconds(exercise: BreathingExercise): number {
  return getCycleSeconds(exercise) * exercise.cycles
    + getPhaseSeconds(exercise, 'holdOut')
    + getPhaseSeconds(exercise, 'holdIn');
}

export function getSessionSeconds(exercise: BreathingExercise): number {
  if (exercise.protocol === 'wim-hof') {
    return getPrepareSeconds(exercise) + getWimHofRoundSeconds(exercise) * getBreathingRounds(exercise);
  }

  return getPrepareSeconds(exercise) + getCycleSeconds(exercise) * exercise.cycles;
}

export function getActiveBreathState(
  exercise: BreathingExercise,
  elapsedSeconds: number
): ActiveBreathState {
  const sessionSeconds = getSessionSeconds(exercise);
  const cycleSeconds = getCycleSeconds(exercise);
  const prepareSeconds = getPrepareSeconds(exercise);
  const breathingPhases = getBreathingPhases(exercise);
  const clampedElapsed = Math.min(Math.max(0, elapsedSeconds), sessionSeconds);
  const isComplete = clampedElapsed >= sessionSeconds;

  if (isComplete) {
    const lastPhase = breathingPhases[breathingPhases.length - 1] ?? exercise.phases[exercise.phases.length - 1];

    return {
      phase: lastPhase,
      cycle: exercise.cycles,
      completedCycles: exercise.cycles,
      round: getBreathingRounds(exercise),
      completedRounds: getBreathingRounds(exercise),
      phaseElapsed: lastPhase.seconds,
      phaseProgress: 1,
      phaseRemaining: 0,
      sessionProgress: 100,
      isComplete: true,
    };
  }

  const preparePhase = exercise.phases.find(phase => phase.key === 'prepare');

  if (preparePhase && clampedElapsed < prepareSeconds) {
    return {
      phase: preparePhase,
      cycle: 1,
      completedCycles: 0,
      round: 1,
      completedRounds: 0,
      phaseElapsed: clampedElapsed,
      phaseProgress: preparePhase.seconds > 0 ? clampedElapsed / preparePhase.seconds : 1,
      phaseRemaining: Math.max(0, preparePhase.seconds - clampedElapsed),
      sessionProgress: Math.round((clampedElapsed / sessionSeconds) * 100),
      isComplete: false,
    };
  }

  const breathingElapsed = Math.max(0, clampedElapsed - prepareSeconds);

  if (exercise.protocol === 'wim-hof') {
    return getActiveWimHofBreathState(exercise, breathingElapsed, clampedElapsed, sessionSeconds);
  }

  const cycleIndex = Math.floor(breathingElapsed / cycleSeconds);
  const cycleElapsed = breathingElapsed % cycleSeconds;
  let phaseStart = 0;
  let activePhase = breathingPhases[0] ?? exercise.phases[0];

  for (const phase of breathingPhases) {
    if (cycleElapsed < phaseStart + phase.seconds) {
      activePhase = phase;
      break;
    }

    phaseStart += phase.seconds;
  }

  const phaseElapsed = cycleElapsed - phaseStart;

  return {
    phase: activePhase,
    cycle: cycleIndex + 1,
    completedCycles: cycleIndex,
    round: 1,
    completedRounds: 0,
    phaseElapsed,
    phaseProgress: activePhase.seconds > 0 ? phaseElapsed / activePhase.seconds : 1,
    phaseRemaining: Math.max(0, activePhase.seconds - phaseElapsed),
    sessionProgress: Math.round((clampedElapsed / sessionSeconds) * 100),
    isComplete: false,
  };
}

function getActiveWimHofBreathState(
  exercise: BreathingExercise,
  breathingElapsed: number,
  clampedElapsed: number,
  sessionSeconds: number
): ActiveBreathState {
  const rounds = getBreathingRounds(exercise);
  const roundSeconds = Math.max(1, getWimHofRoundSeconds(exercise));
  const roundIndex = Math.min(rounds - 1, Math.floor(breathingElapsed / roundSeconds));
  const roundElapsed = breathingElapsed - roundIndex * roundSeconds;
  const breathSeconds = Math.max(1, getCycleSeconds(exercise));
  const breathBlockSeconds = breathSeconds * exercise.cycles;
  const inhalePhase = exercise.phases.find(phase => phase.key === 'inhale') ?? exercise.phases[0];
  const exhalePhase = exercise.phases.find(phase => phase.key === 'exhale') ?? inhalePhase;
  const holdOutPhase = exercise.phases.find(phase => phase.key === 'holdOut') ?? exhalePhase;
  const holdInPhase = exercise.phases.find(phase => phase.key === 'holdIn') ?? holdOutPhase;

  if (roundElapsed < breathBlockSeconds) {
    const breathIndex = Math.floor(roundElapsed / breathSeconds);
    const breathElapsed = roundElapsed % breathSeconds;
    const activePhase = breathElapsed < inhalePhase.seconds ? inhalePhase : exhalePhase;
    const phaseElapsed = activePhase.key === 'inhale'
      ? breathElapsed
      : Math.max(0, breathElapsed - inhalePhase.seconds);

    return {
      phase: activePhase,
      cycle: breathIndex + 1,
      completedCycles: breathIndex,
      round: roundIndex + 1,
      completedRounds: roundIndex,
      phaseElapsed,
      phaseProgress: activePhase.seconds > 0 ? phaseElapsed / activePhase.seconds : 1,
      phaseRemaining: Math.max(0, activePhase.seconds - phaseElapsed),
      sessionProgress: Math.round((clampedElapsed / sessionSeconds) * 100),
      isComplete: false,
    };
  }

  const holdOutElapsed = roundElapsed - breathBlockSeconds;

  if (holdOutElapsed < holdOutPhase.seconds) {
    return {
      phase: holdOutPhase,
      cycle: exercise.cycles,
      completedCycles: exercise.cycles,
      round: roundIndex + 1,
      completedRounds: roundIndex,
      phaseElapsed: holdOutElapsed,
      phaseProgress: holdOutPhase.seconds > 0 ? holdOutElapsed / holdOutPhase.seconds : 1,
      phaseRemaining: Math.max(0, holdOutPhase.seconds - holdOutElapsed),
      sessionProgress: Math.round((clampedElapsed / sessionSeconds) * 100),
      isComplete: false,
    };
  }

  const holdInElapsed = holdOutElapsed - holdOutPhase.seconds;

  return {
    phase: holdInPhase,
    cycle: exercise.cycles,
    completedCycles: exercise.cycles,
    round: roundIndex + 1,
    completedRounds: roundIndex,
    phaseElapsed: holdInElapsed,
    phaseProgress: holdInPhase.seconds > 0 ? holdInElapsed / holdInPhase.seconds : 1,
    phaseRemaining: Math.max(0, holdInPhase.seconds - holdInElapsed),
    sessionProgress: Math.round((clampedElapsed / sessionSeconds) * 100),
    isComplete: false,
  };
}
