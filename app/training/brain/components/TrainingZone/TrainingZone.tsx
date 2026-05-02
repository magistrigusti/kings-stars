'use client';

import { useCallback, useState } from 'react';
import {
  IoFitnessOutline,
  IoMoonOutline,
  IoPulseOutline,
  IoSunnyOutline,
} from 'react-icons/io5';
import BrainTrainingArea from '../BrainTrainingArea/BrainTrainingArea';
import { BreathingTrainer } from '../../../breathing';
import { useTrainingProgress } from '../../../progress/useTrainingProgress';
import s from './TrainingZone.module.scss';

type TrainingTab = 'brain' | 'breathing';

interface TrainingZoneProps {
  isDarkMode: boolean;
  onDarkModeChange: (nextValue: boolean) => void;
}

const TABS: Array<{
  id: TrainingTab;
  title: string;
  text: string;
}> = [
  {
    id: 'brain',
    title: 'Мозг',
    text: 'внимание и координация',
  },
  {
    id: 'breathing',
    title: 'Лёгкие',
    text: 'дыхание и спокойствие',
  },
];

export default function TrainingZone({
  isDarkMode,
  onDarkModeChange,
}: TrainingZoneProps) {
  const [activeTab, setActiveTab] = useState<TrainingTab>('brain');
  const { progress, addBrainSeconds, addBreathingSeconds } = useTrainingProgress();

  const handleBrainSecond = useCallback((xpAmount = 1) => {
    addBrainSeconds(1, xpAmount);
  }, [addBrainSeconds]);

  const handleBreathingSecond = useCallback((exerciseId: string) => {
    addBreathingSeconds(exerciseId, 1);
  }, [addBreathingSeconds]);

  return (
    <div className={`${s.zone} ${isDarkMode ? s.zoneDark : ''}`}>
      <header className={s.header}>
        <button
          type="button"
          className={s.themeToggle}
          onClick={() => onDarkModeChange(!isDarkMode)}
          aria-label={isDarkMode ? 'Включить светлый режим зоны тренировок' : 'Включить тёмный режим зоны тренировок'}
          title={isDarkMode ? 'Светлый режим' : 'Тёмный режим'}
        >
          {isDarkMode ? <IoMoonOutline /> : <IoSunnyOutline />}
        </button>
        <p className={s.kicker}>Здоровая качалка</p>
        <h1>
          Зона <span>тренировок</span>
        </h1>
        <p>
          Мозг, дыхание и спокойный рост каждый день. Время занятий становится
          опытом, а опыт открывает новые уровни.
        </p>
      </header>

      <div className={s.tabs} role="tablist" aria-label="Разделы тренировки">
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = tab.id === 'brain' ? IoFitnessOutline : IoPulseOutline;

          return (
            <button
              key={tab.id}
              type="button"
              className={`${s.tab} ${isActive ? s.tabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={isActive}
            >
              <Icon className={s.tabIcon} />
              <span>
                <strong>{tab.title}</strong>
                <small>{tab.text}</small>
              </span>
            </button>
          );
        })}
      </div>

      {activeTab === 'brain' ? (
        <BrainTrainingArea
          progress={progress}
          onTrainingSecond={handleBrainSecond}
          isDarkMode={isDarkMode}
        />
      ) : (
        <BreathingTrainer
          progress={progress}
          onTrainingSecond={handleBreathingSecond}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}
