'use client';

import { useState } from 'react';
import type { TrainingProgress } from '../../progress/types';
import BreathingPractice from './BreathingPractice';
import BreathingProgress from './BreathingProgress';
import s from './BreathingTrainer.module.scss';

interface BreathingTrainerProps {
  progress: TrainingProgress;
  onTrainingSecond: (exerciseId: string) => void;
  isDarkMode: boolean;
}

type BreathingSubTab = 'practice' | 'progress';

const SUB_TABS: Array<{
  id: BreathingSubTab;
  title: string;
}> = [
  {
    id: 'practice',
    title: 'Тренировка',
  },
  {
    id: 'progress',
    title: 'Опыт',
  },
];

export default function BreathingTrainer({
  progress,
  onTrainingSecond,
  isDarkMode,
}: BreathingTrainerProps) {
  const [activeSubTab, setActiveSubTab] = useState<BreathingSubTab>('practice');

  return (
    <section
      className={`${s.area} ${isDarkMode ? s.areaDark : ''}`}
      aria-label="Дыхательная тренировка"
    >
      <div className={s.subTabs} role="tablist" aria-label="Разделы дыхания">
        {SUB_TABS.map(tab => {
          const isActive = activeSubTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              className={`${s.subTab} ${isActive ? s.subTabActive : ''}`}
              onClick={() => setActiveSubTab(tab.id)}
              role="tab"
              aria-selected={isActive}
            >
              {tab.title}
            </button>
          );
        })}
      </div>

      {activeSubTab === 'practice' ? (
        <BreathingPractice onTrainingSecond={onTrainingSecond} />
      ) : (
        <BreathingProgress progress={progress} />
      )}
    </section>
  );
}
