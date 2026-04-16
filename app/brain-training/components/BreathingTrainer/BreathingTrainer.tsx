'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { IoPause, IoPlay, IoRefreshOutline } from 'react-icons/io5';
import { BREATHING_EXERCISES } from '../../data/breathingExercises';
import type { TrainingProgress } from '../../progress/types';
import BreathExerciseList from './BreathExerciseList';
import BreathJournal from './BreathJournal';
import {
  getActiveBreathState,
  getBreathScale,
  getSessionSeconds,
} from './breathingSession';
import s from './BreathingTrainer.module.scss';

interface BreathingTrainerProps {
  progress: TrainingProgress;
  onTrainingSecond: (exerciseId: string) => void;
}

export default function BreathingTrainer({
  progress,
  onTrainingSecond,
}: BreathingTrainerProps) {
  const [selectedId, setSelectedId] = useState(BREATHING_EXERCISES[0].id);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const selectedExercise = useMemo(
    () => BREATHING_EXERCISES.find(exercise => exercise.id === selectedId) ?? BREATHING_EXERCISES[0],
    [selectedId]
  );

  const sessionSeconds = getSessionSeconds(selectedExercise);
  const activeState = getActiveBreathState(selectedExercise, elapsedSeconds);
  const breathScale = getBreathScale(activeState.phase.key);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setElapsedSeconds(prev => {
        if (prev >= sessionSeconds) {
          setIsRunning(false);
          return sessionSeconds;
        }

        onTrainingSecond(selectedExercise.id);

        const next = prev + 1;
        if (next >= sessionSeconds) {
          setIsRunning(false);
        }

        return next;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isRunning, onTrainingSecond, selectedExercise.id, sessionSeconds]);

  const handleSelectExercise = useCallback((exerciseId: string) => {
    setSelectedId(exerciseId);
    setElapsedSeconds(0);
    setIsRunning(false);
  }, []);

  const handleStartPause = () => {
    if (activeState.isComplete) {
      setElapsedSeconds(0);
      setIsRunning(true);
      return;
    }

    setIsRunning(prev => !prev);
  };

  const handleReset = () => {
    setElapsedSeconds(0);
    setIsRunning(false);
  };

  return (
    <section className={s.area} aria-label="Дыхательная тренировка">
      <div className={s.copy}>
        <div>
          <p className={s.kicker}>Дыхание</p>
          <h2>Тренировка лёгких</h2>
        </div>
        <p>
          Выбери ритм, нажми старт и дыши вместе с кругом. Каждая спокойная
          секунда добавляется в журнал и общий опыт.
        </p>
      </div>

      <BreathExerciseList
        exercises={BREATHING_EXERCISES}
        selectedId={selectedId}
        progress={progress}
        onSelect={handleSelectExercise}
      />

      <div className={s.practice}>
        <div className={s.visual} style={{ '--breath-tone': selectedExercise.tone } as React.CSSProperties}>
          <div className={s.breathField}>
            <div
              className={s.breathCircle}
              style={{ transform: `scale(${breathScale})` }}
            >
              <span>{activeState.phase.shortLabel}</span>
              <strong>{activeState.phaseRemaining}</strong>
            </div>
            <button
              type="button"
              className={s.playButton}
              onClick={handleStartPause}
              aria-label={isRunning ? 'Пауза' : 'Старт'}
            >
              {isRunning ? <IoPause /> : <IoPlay />}
            </button>
          </div>
        </div>

        <div className={s.guidance}>
          <div>
            <p className={s.exerciseTitle}>{selectedExercise.title}</p>
            <h3>{activeState.phase.label}</h3>
            <p>{activeState.phase.cue}</p>
          </div>

          <div className={s.phaseRail} aria-label="Фазы дыхания">
            {selectedExercise.phases.map(phase => (
              <span
                key={phase.key}
                className={phase.key === activeState.phase.key ? s.phaseActive : ''}
              >
                {phase.shortLabel}
              </span>
            ))}
          </div>

          <div className={s.cycleDots} aria-label={`Круг ${activeState.cycle} из ${selectedExercise.cycles}`}>
            {Array.from({ length: selectedExercise.cycles }, (_, index) => (
              <span
                key={index}
                className={index < activeState.completedCycles ? s.dotDone : ''}
              />
            ))}
          </div>

          <div className={s.sessionInfo}>
            <span>Круг {activeState.cycle} из {selectedExercise.cycles}</span>
            <span>{activeState.sessionProgress}%</span>
          </div>

          <div className={s.controls}>
            <button type="button" onClick={handleStartPause}>
              {isRunning ? 'Пауза' : activeState.isComplete ? 'Сначала' : 'Старт'}
            </button>
            <button type="button" onClick={handleReset}>
              <IoRefreshOutline />
              Сброс
            </button>
          </div>
        </div>
      </div>

      <BreathJournal progress={progress} />
    </section>
  );
}
