'use client';

import { useCallback, useSyncExternalStore } from 'react';
import Navigation from '../../components/Navigation/Navigation';
import TrainingZone from './components/TrainingZone/TrainingZone';
import s from './page.module.scss';

const THEME_STORAGE_KEY = 'training-theme-mode';
const THEME_STORAGE_EVENT = 'training-theme-mode-change';

function getThemeSnapshot() {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY) === 'dark';
  } catch {
    return false;
  }
}

function subscribeToThemeStorage(onStoreChange: () => void) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) {
      onStoreChange();
    }
  };

  window.addEventListener('storage', handleStorageChange);
  window.addEventListener(THEME_STORAGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener(THEME_STORAGE_EVENT, onStoreChange);
  };
}

export default function BrainTrainingPage() {
  const isDarkMode = useSyncExternalStore(
    subscribeToThemeStorage,
    getThemeSnapshot,
    () => false,
  );

  const handleDarkModeChange = useCallback((nextValue: boolean) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextValue ? 'dark' : 'light');
      window.dispatchEvent(new Event(THEME_STORAGE_EVENT));
    } catch {}
  }, []);

  return (
    <main className={`${s.page} ${isDarkMode ? s.pageDark : ''}`}>
      <Navigation />
      <TrainingZone
        isDarkMode={isDarkMode}
        onDarkModeChange={handleDarkModeChange}
      />
    </main>
  );
}
