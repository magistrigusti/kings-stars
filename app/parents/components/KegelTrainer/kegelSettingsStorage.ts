import { KEGEL_MAX_LEVEL, KEGEL_MIN_LEVEL } from './kegelProgram';

const KEGEL_SETTINGS_STORAGE_KEY = 'parents-kegel-settings-v1';

export interface KegelStoredSettings {
  selectedLevel: number;
  autoLevelEnabled: boolean;
  lastAutoLevelDate: string | null;
}

export const DEFAULT_KEGEL_SETTINGS: KegelStoredSettings = {
  selectedLevel: KEGEL_MIN_LEVEL,
  autoLevelEnabled: false,
  lastAutoLevelDate: null,
};

function clampKegelLevel(level: number) {
  if (!Number.isFinite(level)) {
    return KEGEL_MIN_LEVEL;
  }

  return Math.min(KEGEL_MAX_LEVEL, Math.max(KEGEL_MIN_LEVEL, Math.round(level)));
}

function getLocalDateStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function getPassedDays(fromDateKey: string, toDate: Date) {
  const fromDate = new Date(`${fromDateKey}T00:00:00`);

  if (Number.isNaN(fromDate.getTime())) {
    return 0;
  }

  const dayLengthMs = 24 * 60 * 60 * 1000;
  const fromStart = getLocalDateStart(fromDate);
  const toStart = getLocalDateStart(toDate);

  return Math.max(0, Math.floor((toStart - fromStart) / dayLengthMs));
}

export function getKegelDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function normalizeKegelSettings(
  settings: Partial<KegelStoredSettings>,
  today = new Date()
): KegelStoredSettings {
  const todayKey = getKegelDateKey(today);
  const autoLevelEnabled = settings.autoLevelEnabled === true;
  const lastAutoLevelDate = typeof settings.lastAutoLevelDate === 'string'
    ? settings.lastAutoLevelDate
    : null;
  const selectedLevel = clampKegelLevel(
    typeof settings.selectedLevel === 'number'
      ? settings.selectedLevel
      : DEFAULT_KEGEL_SETTINGS.selectedLevel
  );

  if (!autoLevelEnabled) {
    return {
      selectedLevel,
      autoLevelEnabled,
      lastAutoLevelDate,
    };
  }

  if (!lastAutoLevelDate) {
    return {
      selectedLevel,
      autoLevelEnabled,
      lastAutoLevelDate: todayKey,
    };
  }

  const passedDays = getPassedDays(lastAutoLevelDate, today);

  if (passedDays <= 0) {
    return {
      selectedLevel,
      autoLevelEnabled,
      lastAutoLevelDate,
    };
  }

  return {
    selectedLevel: clampKegelLevel(selectedLevel + passedDays),
    autoLevelEnabled,
    lastAutoLevelDate: todayKey,
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
