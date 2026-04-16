'use client';

import { useCallback, useRef, useState } from 'react';
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
  const [isTrainingMode, setIsTrainingMode] = useState(false);
  const areaRef = useRef<HTMLElement>(null);
  const trainingRef = useRef<HTMLDivElement>(null);
  const level = getLevelProgress(progress.brainSeconds);

  const handleStartTraining = useCallback(() => {
    setIsTrainingMode(true);
  }, []);

  const handleFinishTraining = useCallback(() => {
    setIsTrainingMode(false);
    window.requestAnimationFrame(() => {
      areaRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }, []);

  const handleSubTabChange = (tabId: BrainSubTab) => {
    setActiveSubTab(tabId);
    if (tabId === 'progress') {
      setIsTrainingMode(false);
    }
  };

  return (
    <section ref={areaRef} className={s.area} aria-label="Тренировка мозга">
      <div className={s.subTabs} role="tablist" aria-label="Разделы мозга">
        {SUB_TABS.map(tab => {
          const isActive = activeSubTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              className={`${s.subTab} ${isActive ? s.subTabActive : ''}`}
              onClick={() => handleSubTabChange(tab.id)}
              role="tab"
              aria-selected={isActive}
            >
              {tab.title}
            </button>
          );
        })}
      </div>

      {activeSubTab === 'exercise' ? (
        isTrainingMode ? (
          <div ref={trainingRef} className={s.trainingStage}>
            <div className={s.trainingHeader}>
              <div>
                <p className={s.kicker}>Координация</p>
                <h2>Тренировка мозга</h2>
              </div>
              <button
                type="button"
                className={s.exitButton}
                onClick={handleFinishTraining}
              >
                К описанию
              </button>
            </div>

            <div className={`${s.trainerSurface} ${s.trainerSurfaceActive}`}>
              <BrainTrainer
                onTrainingSecond={onTrainingSecond}
                onFinishExit={handleFinishTraining}
              />
            </div>
          </div>
        ) : (
          <div className={s.intro}>
            <div className={s.introCopy}>
              <p className={s.kicker}>Координация</p>
              <h2>Тренировка мозга</h2>
              <p>
                Произноси букву вслух и выполняй движение: <b>Л</b> — левая,
                <b> П</b> — правая, <b>О</b> — обе. Включай таймер, и время будет
                добавляться в опыт.
              </p>
            </div>

            <div className={s.introStats}>
              <span>Уровень {level.level}</span>
              <span>{formatDuration(progress.brainSeconds)}</span>
              <span>{formatXp(progress.brainSeconds)}</span>
            </div>

            <button
              type="button"
              className={s.startButton}
              onClick={handleStartTraining}
            >
              Начать
            </button>
          </div>
        )
      ) : (
        <BrainProgressPanel progress={progress} />
      )}
    </section>
  );
}
