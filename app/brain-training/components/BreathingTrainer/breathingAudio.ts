import type { BreathPhaseKey } from '../../data/breathingExercises';

const BREATH_PHASE_AUDIO: Record<BreathPhaseKey, string> = {
  prepare: '/audio/breathing/otdix.mp3',
  inhale: '/audio/breathing/vdox.mp3',
  holdIn: '/audio/breathing/zaderzka.mp3',
  exhale: '/audio/breathing/vidox.mp3',
  holdOut: '/audio/breathing/otdix.mp3',
  rest: '/audio/breathing/otdix.mp3',
};

export function getBreathPhaseAudioSrc(phaseKey: BreathPhaseKey): string {
  return BREATH_PHASE_AUDIO[phaseKey];
}
