'use client';

import { useEffect, useState } from 'react';
import Navigation from '../../components/Navigation/Navigation';
import TrainingZone from './components/TrainingZone/TrainingZone';
import s from './page.module.scss';

const THEME_STORAGE_KEY = 'training-theme-mode';

export default function BrainTrainingPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    try {
      setIsDarkMode(localStorage.getItem(THEME_STORAGE_KEY) === 'dark');
    } catch {}
  }, []);

  const handleDarkModeChange = (nextValue: boolean) => {
    setIsDarkMode(nextValue);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextValue ? 'dark' : 'light');
    } catch {}
  };

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
