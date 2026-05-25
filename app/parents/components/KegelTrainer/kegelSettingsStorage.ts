import { KEGEL_MAX_LEVEL, KEGEL_MIN_LEVEL } from './kegelProgram';

const KEGEL_SETTINGS_STORAGE_KEY = 'parents-kegel-settings-v2';

export interface KegelStoredSettings {
  selectedLevel: number;
  autoLevelEnabled: boolean;
}

export const DEFAULT_KEGEL_SETTINGS: KegelStoredSettings = {
  selectedLevel: KEGEL_MIN_LEVEL,
  autoLevelEnabled: true,
};

function clampKegelLevel(level: number) {
  if (!Number.isFinite(level)) {
    return KEGEL_MIN_LEVEL;
  }

  return Math.min(KEGEL_MAX_LEVEL, Math.max(KEGEL_MIN_LEVEL, Math.round(level)));
}

export function normalizeKegelSettings(
  settings: Partial<KegelStoredSettings>
): KegelStoredSettings {
  const autoLevelEnabled = settings.autoLevelEnabled !== false;
  const selectedLevel = clampKegelLevel(
    typeof settings.selectedLevel === 'number'
      ? settings.selectedLevel
      : DEFAULT_KEGEL_SETTINGS.selectedLevel
  );

  return {
    selectedLevel,
    autoLevelEnabled,
  };
}

export function readKegelSettings(): KegelStoredSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_KEGEL_SETTINGS;
  }

  try {
    const rawValue = window.localStorage.getItem(KEGEL_SETTINGS_STORAGE_KEY);

    if (!rawValue) {
      return DEFAULT_KEGEL_SETTINGS;
    }

    return normalizeKegelSettings(JSON.parse(rawValue) as Partial<KegelStoredSettings>);
  } catch {
    return DEFAULT_KEGEL_SETTINGS;
  }
}

export function saveKegelSettings(settings: KegelStoredSettings) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(KEGEL_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {}
}
