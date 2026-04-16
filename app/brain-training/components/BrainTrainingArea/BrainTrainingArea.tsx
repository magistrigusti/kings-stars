'use client';

import { useState } from 'react';
import BrainTrainer from '../../BrainTrainer';
import { formatDuration, formatXp, getLevelProgress } from '../../progress/progression';
import type { TrainingProgress } from '../../progress/types';
import BrainProgressPanel from './BrainProgressPanel';
import s from './BrainTrainingArea.module.scss';

interface BrainTrainingAreaProps {
  progress: TrainingProgress;
  onTrainingSecond: () => void;
}

type BrainSubTab = 'exercise' | 'progress';

const SUB_TABS: Array<{
  id: BrainSubTab;
  title: string;
}> = [
  {
    id: 'exercise',
    title: 'Упражнение',
  },
  {
    id: 'progress',
    title: 'Прогресс',
  },
];

export default function BrainTrainingArea({
  progress,
  onTrainingSecond,
}: BrainTrainingAreaProps) {
  const [activeSubTab, setActiveSubTab] = useState<BrainSubTab>('exercise');
  const level = getLevelProgress(progress.brainSeconds);

  return (
    <section className={s.area} aria-label="Тренировка мозга">
      <div className={s.subTabs} role="tablist" aria-label="Разделы мозга">
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

      {activeSubTab === 'exercise' ? (
        <>
          <div className={s.copy}>
            <div>
              <p className={s.kicker}>Координация</p>
              <h2>Тренировка мозга</h2>
            </div>
            <p>
              Произноси букву вслух и выполняй движение: <b>Л</b> — левая,
              <b> П</b> — правая, <b>О</b> — обе. Включай таймер, и время будет
              добавляться в опыт.
            </p>
            <div className={s.progressLine}>
              <span>Уровень {level.level}</span>
              <span>{formatDuration(progress.brainSeconds)}</span>
              <span>{formatXp(progress.brainSeconds)}</span>
            </div>
          </div>

          <div className={s.trainerSurface}>
            <BrainTrainer onTrainingSecond={onTrainingSecond} />
          </div>
        </>
      ) : (
        <BrainProgressPanel progress={progress} />
      )}
    </section>
  );
}
