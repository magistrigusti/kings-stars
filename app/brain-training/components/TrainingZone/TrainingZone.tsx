'use client';

import { useCallback, useState } from 'react';
import { IoFitnessOutline, IoPulseOutline } from 'react-icons/io5';
import BrainTrainingArea from '../BrainTrainingArea/BrainTrainingArea';
import BreathingTrainer from '../BreathingTrainer/BreathingTrainer';
import { useTrainingProgress } from '../../progress/useTrainingProgress';
import s from './TrainingZone.module.scss';

type TrainingTab = 'brain' | 'breathing';

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

export default function TrainingZone() {
  const [activeTab, setActiveTab] = useState<TrainingTab>('brain');
  const { progress, addBrainSeconds, addBreathingSeconds } = useTrainingProgress();

  const handleBrainSecond = useCallback(() => {
    addBrainSeconds(1);
  }, [addBrainSeconds]);

  const handleBreathingSecond = useCallback((exerciseId: string) => {
    addBreathingSeconds(exerciseId, 1);
  }, [addBreathingSeconds]);

  return (
    <div className={s.zone}>
      <header className={s.header}>
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
        />
      ) : (
        <BreathingTrainer
          progress={progress}
          onTrainingSecond={handleBreathingSecond}
        />
      )}
    </div>
  );
}
