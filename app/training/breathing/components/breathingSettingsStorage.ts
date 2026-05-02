import type { BreathPhaseKey } from '../data/breathingExercises';

const STORAGE_KEY = 'breathing-practice-settings-v1';

export interface BreathingPracticeSettings {
  selectedId: string | null;
  phaseSecondsByExercise: Record<string, Partial<Record<BreathPhaseKey, number>>>;
  cyclesByExercise: Record<string, number>;
}

export const EMPTY_BREATHING_SETTINGS: BreathingPracticeSettings = {
  selectedId: null,
  phaseSecondsByExercise: {},
  cyclesByExercise: {},
};

export function readBreathingPracticeSettings(): BreathingPracticeSettings {
  if (typeof window === 'undefined') {
    return EMPTY_BREATHING_SETTINGS;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return EMPTY_BREATHING_SETTINGS;
    }

    const parsed = JSON.parse(raw) as Partial<BreathingPracticeSettings>;

    return {
      selectedId: typeof parsed.selectedId === 'string' ? parsed.selectedId : null,
      phaseSecondsByExercise:
        parsed.phaseSecondsByExercise && typeof parsed.phaseSecondsByExercise === 'object'
          ? parsed.phaseSecondsByExercise
          : {},
      cyclesByExercise:
        parsed.cyclesByExercise && typeof parsed.cyclesByExercise === 'object'
          ? parsed.cyclesByExercise
          : {},
    };
  } catch {
    return EMPTY_BREATHING_SETTINGS;
  }
}

export function saveBreathingPracticeSettings(settings: BreathingPracticeSettings) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {}
}
