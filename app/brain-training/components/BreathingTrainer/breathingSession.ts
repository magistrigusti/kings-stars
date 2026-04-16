import type { BreathPhase, BreathingExercise } from '../../data/breathingExercises';

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

export function getCycleSeconds(exercise: BreathingExercise): number {
  return exercise.phases.reduce((sum, phase) => sum + phase.seconds, 0);
}

export function getSessionSeconds(exercise: BreathingExercise): number {
  return getCycleSeconds(exercise) * exercise.cycles;
}

export function getActiveBreathState(
  exercise: BreathingExercise,
  elapsedSeconds: number
): ActiveBreathState {
  const sessionSeconds = getSessionSeconds(exercise);
  const cycleSeconds = getCycleSeconds(exercise);
  const clampedElapsed = Math.min(Math.max(0, elapsedSeconds), sessionSeconds);
  const isComplete = clampedElapsed >= sessionSeconds;

  if (isComplete) {
    const lastPhase = exercise.phases[exercise.phases.length - 1];

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

  const cycleIndex = Math.floor(clampedElapsed / cycleSeconds);
  const cycleElapsed = clampedElapsed % cycleSeconds;
  let phaseStart = 0;
  let activePhase = exercise.phases[0];

  for (const phase of exercise.phases) {
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
