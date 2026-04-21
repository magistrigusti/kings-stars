'use client';

import { useCallback, useMemo, useRef, useState, type ChangeEvent } from 'react';
import BrainTrainer, {
  getDefaultBrainTrainerSettings,
  type BrainTrainerSettings,
} from '../../BrainTrainer';
import {
  formatTime,
  SPEED_MAX,
  SPEED_MIN,
  SPEED_STEP,
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
  const [isAdvancedSettingsOpen, setIsAdvancedSettingsOpen] = useState(false);
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

  const handleTimerChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const timerMax = parseInt(event.target.value, 10);

    setTrainerSettings(prev => ({
      ...prev,
      timerMax,
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

  const handleFontSizeChange = useCallback((delta: number) => {
    setTrainerSettings(prev => ({
      ...prev,
      fontSize: Math.max(30, Math.min(150, prev.fontSize + delta)),
    }));
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
              <div className={s.settingsHead}>
                <strong>Настройки</strong>
                <button
                  type="button"
                  className={`${s.proButton} ${isAdvancedSettingsOpen ? s.proButtonActive : ''}`}
                  onClick={() => setIsAdvancedSettingsOpen(value => !value)}
                  aria-pressed={isAdvancedSettingsOpen}
                >
                  {isAdvancedSettingsOpen ? 'Про ✓' : 'Про'}
                </button>
              </div>

              <div className={s.quickSettings}>
                <label className={s.rangeSetting}>
                  <span>
                    <b>Время</b>
                    <em>{formatTime(trainerSettings.timerMax)}</em>
                  </span>
                  <input
                    type="range"
                    min={60}
                    max={1200}
                    step={20}
                    value={trainerSettings.timerMax}
                    onChange={handleTimerChange}
                  />
                </label>

                <div className={s.stepSetting}>
                  <span>
                    <b>Скорость</b>
                    <em>{trainerSettings.speed} мс</em>
                  </span>
                  <div>
                    <button type="button" onClick={() => handleSpeedChange(SPEED_STEP)} aria-label="Медленнее">
                      −
                    </button>
                    <button type="button" onClick={() => handleSpeedChange(-SPEED_STEP)} aria-label="Быстрее">
                      +
                    </button>
                  </div>
                </div>
              </div>

              {isAdvancedSettingsOpen && (
                <div className={s.advancedSettings}>
                  <div className={s.stepSetting}>
                    <span>
                      <b>Размер</b>
                      <em>{trainerSettings.sizeMode === 'normal' ? `${trainerSettings.fontSize}` : trainerSettings.sizeMode}</em>
                    </span>
                    <div>
                      <button type="button" onClick={() => handleFontSizeChange(-5)} aria-label="Меньше">
                        −
                      </button>
                      <button type="button" onClick={() => handleFontSizeChange(5)} aria-label="Больше">
                        +
                      </button>
                    </div>
                  </div>

                  <div className={s.segmentedSetting} role="group" aria-label="Режим размера">
                    <button
                      type="button"
                      className={trainerSettings.sizeMode === 'random' ? s.segmentActive : ''}
                      onClick={() => toggleSizeMode('random')}
                    >
                      Рандом
                    </button>
                    <button
                      type="button"
                      className={trainerSettings.sizeMode === 'mix' ? s.segmentActive : ''}
                      onClick={() => toggleSizeMode('mix')}
                    >
                      Микс
                    </button>
                  </div>

                  <div className={s.segmentedSetting} role="group" aria-label="Режим цвета">
                    <button
                      type="button"
                      className={trainerSettings.colorMode === 'random' ? s.segmentActive : ''}
                      onClick={() => toggleColorMode('random')}
                    >
                      Цвет
                    </button>
                    <button
                      type="button"
                      className={trainerSettings.colorMode === 'mix' ? s.segmentActive : ''}
                      onClick={() => toggleColorMode('mix')}
                    >
                      Микс
                    </button>
                  </div>

                  <div className={s.directionToggles}>
                    <label>
                      <input type="checkbox" checked={trainerSettings.showLegs} onChange={toggleTopLetter} />
                      <span>Верх</span>
                    </label>
                    <label>
                      <input type="checkbox" checked={trainerSettings.showHands} onChange={toggleBottomLetter} />
                      <span>Низ</span>
                    </label>
                  </div>
                </div>
              )}
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
