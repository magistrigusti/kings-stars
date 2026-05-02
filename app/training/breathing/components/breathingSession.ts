import type { BreathPhase, BreathingExercise } from '../data/breathingExercises';

export interface ActiveBreathState {
  phase: BreathPhase;
  cycle: number;
  completedCycles: number;
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
  return getBreathingPhases(exercise).reduce((sum, phase) => sum + phase.seconds, 0);
}

export function getSessionSeconds(exercise: BreathingExercise): number {
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
      phaseElapsed: clampedElapsed,
      phaseProgress: preparePhase.seconds > 0 ? clampedElapsed / preparePhase.seconds : 1,
      phaseRemaining: Math.max(0, preparePhase.seconds - clampedElapsed),
      sessionProgress: Math.round((clampedElapsed / sessionSeconds) * 100),
      isComplete: false,
    };
  }

  const breathingElapsed = Math.max(0, clampedElapsed - prepareSeconds);
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
    phaseElapsed,
    phaseProgress: activePhase.seconds > 0 ? phaseElapsed / activePhase.seconds : 1,
    phaseRemaining: Math.max(0, activePhase.seconds - phaseElapsed),
    sessionProgress: Math.round((clampedElapsed / sessionSeconds) * 100),
    isComplete: false,
  };
}
