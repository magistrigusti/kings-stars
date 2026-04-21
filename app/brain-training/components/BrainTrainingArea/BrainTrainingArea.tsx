'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import BrainTrainer, {
  getDefaultBrainTrainerSettings,
  type BrainTrainerSettings,
} from '../../BrainTrainer';
import BrainTrainerPanel from '../../BrainTrainerPanel';
import trainerStyles from '../../BrainTrainer.module.scss';
import {
  SPEED_MAX,
  SPEED_MIN,
  STORAGE_KEY_SPEED,
} from '../../engine/engine';
import { formatDuration, formatXp, getLevelProgress } from '../../progress/progression';
import type { TrainingProgress } from '../../progress/types';
import BrainProgressPanel from './BrainProgressPanel';
import s from './BrainTrainingArea.module.scss';

interface BrainTrainingAreaProps {
  progress: TrainingProgress;
  onTrainingSecond: () => void;
  isDarkMode: boolean;
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
  isDarkMode,
}: BrainTrainingAreaProps) {
  const [activeSubTab, setActiveSubTab] = useState<BrainSubTab>('exercise');
  const [isTrainingMode, setIsTrainingMode] = useState(false);
  const [isProMode, setIsProMode] = useState(false);
  const [trainerSettings, setTrainerSettings] = useState<BrainTrainerSettings>(() => ({
    ...getDefaultBrainTrainerSettings(),
    isDark: isDarkMode,
  }));
  const areaRef = useRef<HTMLElement>(null);
  const trainingRef = useRef<HTMLDivElement>(null);
  const level = getLevelProgress(progress.brainSeconds);
  const activeTrainerSettings = useMemo<BrainTrainerSettings>(() => ({
    ...trainerSettings,
    isDark: isDarkMode,
  }), [isDarkMode, trainerSettings]);

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

  const handleTimerChange = useCallback((timerMax: number) => {
    setTrainerSettings(prev => ({
      ...prev,
      timerMax: Math.max(60, Math.min(1200, Math.round(timerMax))),
    }));
  }, []);

  const handleSpeedChange = useCallback((delta: number) => {
    setTrainerSettings(prev => {
      const speed = Math.max(SPEED_MIN, Math.min(SPEED_MAX, prev.speed + delta));

      try {
        localStorage.setItem(STORAGE_KEY_SPEED, String(speed));
      } catch {}

      return {
        ...prev,
        speed,
      };
    });
  }, []);

  const setPanelFontSize = useCallback((value: number | ((previous: number) => number)) => {
    setTrainerSettings(prev => {
      const nextFontSize = typeof value === 'function'
        ? value(prev.fontSize)
        : value;

      return {
        ...prev,
        fontSize: Math.max(30, Math.min(150, nextFontSize)),
      };
    });
  }, []);

  const toggleSizeMode = useCallback((mode: 'random' | 'mix') => {
    setTrainerSettings(prev => ({
      ...prev,
      sizeMode: prev.sizeMode === mode ? 'normal' : mode,
    }));
  }, []);

  const toggleColorMode = useCallback((mode: 'random' | 'mix') => {
    setTrainerSettings(prev => ({
      ...prev,
      colorMode: prev.colorMode === mode ? 'none' : mode,
    }));
  }, []);

  const toggleTopLetter = useCallback(() => {
    setTrainerSettings(prev => ({
      ...prev,
      showLegs: !prev.showLegs,
      showHands: prev.showLegs ? true : prev.showHands,
    }));
  }, []);

  const toggleBottomLetter = useCallback(() => {
    setTrainerSettings(prev => ({
      ...prev,
      showHands: !prev.showHands,
      showLegs: prev.showHands ? true : prev.showLegs,
    }));
  }, []);

  const handlePreviewReset = useCallback(() => {
    setTrainerSettings({
      ...getDefaultBrainTrainerSettings(),
      isDark: isDarkMode,
    });
  }, [isDarkMode]);

  return (
    <section
      ref={areaRef}
      className={`${s.area} ${isDarkMode ? s.areaDark : ''}`}
      aria-label="Тренировка мозга"
    >
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
                initialSettings={activeTrainerSettings}
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

            <div className={s.settingsPanel} aria-label="Настройки упражнения">
              <div className={trainerStyles.proModeRow}>
                <button
                  type="button"
                  className={`${trainerStyles.proModeBtn} ${isProMode ? trainerStyles.proModeBtnActive : ''} ${isDarkMode ? trainerStyles.proModeBtnDark : ''}`}
                  onClick={() => setIsProMode(value => !value)}
                  title={isProMode ? 'Переключить на обычный режим' : 'Профессиональный режим'}
                >
                  {isProMode ? 'Про ✓' : 'Про'}
                </button>
              </div>

              <BrainTrainerPanel
                isFullscreen={false}
                showPanel
                timerMax={trainerSettings.timerMax}
                speed={trainerSettings.speed}
                fontSize={trainerSettings.fontSize}
                sizeMode={trainerSettings.sizeMode}
                showHands={trainerSettings.showHands}
                showLegs={trainerSettings.showLegs}
                lSize={trainerSettings.fontSize}
                hSize={trainerSettings.fontSize}
                lgSize={trainerSettings.fontSize}
                colorMode={trainerSettings.colorMode}
                isDark={isDarkMode}
                changeSpeed={handleSpeedChange}
                handleReset={handlePreviewReset}
                setFontSize={setPanelFontSize}
                toggleSizeMode={toggleSizeMode}
                toggleColorMode={toggleColorMode}
                toggleHands={toggleBottomLetter}
                toggleLegs={toggleTopLetter}
                onTimerChange={handleTimerChange}
                isProMode={isProMode}
              />
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
