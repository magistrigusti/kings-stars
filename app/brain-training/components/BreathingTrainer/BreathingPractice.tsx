'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IoRefreshOutline } from 'react-icons/io5';
import { BREATHING_EXERCISES } from '../../data/breathingExercises';
import type { BreathPhaseKey, BreathingExercise } from '../../data/breathingExercises';
import { useScreenWakeLock } from '../../hooks/useScreenWakeLock';
import BreathExerciseList from './BreathExerciseList';
import BreathRoute from './BreathRoute';
import BreathRhythmSettings from './BreathRhythmSettings';
import { getBreathPhaseAudioSrc } from './breathingAudio';
import {
  getActiveBreathState,
  getSessionSeconds,
} from './breathingSession';
import s from './BreathingTrainer.module.scss';

const MIN_PHASE_SECONDS = 1;
const BREATH_AUDIO_VOLUME = 0.58;

type PhaseSecondOverrides = Partial<Record<BreathPhaseKey, number>>;

interface BreathingPracticeProps {
  onTrainingSecond: (exerciseId: string) => void;
}

function clampPhaseSeconds(seconds: number): number {
  if (!Number.isFinite(seconds)) {
    return MIN_PHASE_SECONDS;
  }

  return Math.max(MIN_PHASE_SECONDS, Math.round(seconds));
}

export default function BreathingPractice({
  onTrainingSecond,
}: BreathingPracticeProps) {
  const [selectedId, setSelectedId] = useState(BREATHING_EXERCISES[0].id);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [phaseSecondOverrides, setPhaseSecondOverrides] = useState<PhaseSecondOverrides>({});
  const elapsedRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioPhaseKeyRef = useRef<BreathPhaseKey | null>(null);
  const audioSrcRef = useRef<string | null>(null);

  const selectedExercise = useMemo(
    () => BREATHING_EXERCISES.find(exercise => exercise.id === selectedId) ?? BREATHING_EXERCISES[0],
    [selectedId]
  );

  const tunedExercise = useMemo<BreathingExercise>(() => ({
    ...selectedExercise,
    phases: selectedExercise.phases.map(phase => ({
      ...phase,
      seconds: phaseSecondOverrides[phase.key] ?? phase.seconds,
    })),
  }), [phaseSecondOverrides, selectedExercise]);

  const sessionSeconds = getSessionSeconds(tunedExercise);
  const activeState = getActiveBreathState(tunedExercise, elapsedSeconds);

  useScreenWakeLock(isRunning && !activeState.isComplete);

  useEffect(() => {
    elapsedRef.current = elapsedSeconds;
  }, [elapsedSeconds]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const intervalId = window.setInterval(() => {
      if (elapsedRef.current >= sessionSeconds) {
        setIsRunning(false);
        return;
      }

      const next = Math.min(elapsedRef.current + 1, sessionSeconds);
      elapsedRef.current = next;
      setElapsedSeconds(next);
      onTrainingSecond(selectedExercise.id);

      if (next >= sessionSeconds) {
        setIsRunning(false);
      }
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isRunning, onTrainingSecond, selectedExercise.id, sessionSeconds]);

  const stopPhaseAudio = useCallback(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.pause();
    audio.currentTime = 0;
    audioRef.current = null;
    audioPhaseKeyRef.current = null;
    audioSrcRef.current = null;
  }, []);

  const playPhaseAudio = useCallback((phaseKey: BreathPhaseKey) => {
    const src = getBreathPhaseAudioSrc(phaseKey);
    const currentAudio = audioRef.current;

    if (
      currentAudio &&
      audioSrcRef.current === src &&
      audioPhaseKeyRef.current === phaseKey
    ) {
      void currentAudio.play().catch(() => undefined);
      return;
    }

    stopPhaseAudio();

    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = BREATH_AUDIO_VOLUME;

    audioRef.current = audio;
    audioPhaseKeyRef.current = phaseKey;
    audioSrcRef.current = src;

    void audio.play().catch(() => undefined);
  }, [stopPhaseAudio]);

  useEffect(() => {
    if (!isRunning || activeState.isComplete) {
      stopPhaseAudio();
      return;
    }

    playPhaseAudio(activeState.phase.key);
  }, [
    activeState.isComplete,
    activeState.phase.key,
    isRunning,
    playPhaseAudio,
    stopPhaseAudio,
  ]);

  useEffect(() => () => stopPhaseAudio(), [stopPhaseAudio]);

  const resetSession = useCallback(() => {
    elapsedRef.current = 0;
    setElapsedSeconds(0);
    setIsRunning(false);
    stopPhaseAudio();
  }, [stopPhaseAudio]);

  const handleSelectExercise = useCallback((exerciseId: string) => {
    if (exerciseId === selectedId) {
      return;
    }

    setSelectedId(exerciseId);
    setPhaseSecondOverrides({});
    resetSession();
  }, [resetSession, selectedId]);

  const handlePhaseSecondsChange = useCallback((phaseKey: BreathPhaseKey, seconds: number) => {
    const nextSeconds = clampPhaseSeconds(seconds);
    const defaultPhase = selectedExercise.phases.find(phase => phase.key === phaseKey);

    if (!defaultPhase) {
      return;
    }

    setPhaseSecondOverrides(prev => {
      if (nextSeconds === defaultPhase.seconds) {
        const next = { ...prev };
        delete next[phaseKey];
        return next;
      }

      return {
        ...prev,
        [phaseKey]: nextSeconds,
      };
    });
    resetSession();
  }, [resetSession, selectedExercise.phases]);

  const handleStartPause = () => {
    if (isRunning) {
      setIsRunning(false);
      stopPhaseAudio();
      return;
    }

    if (activeState.isComplete) {
      elapsedRef.current = 0;
      setElapsedSeconds(0);
      playPhaseAudio(getActiveBreathState(tunedExercise, 0).phase.key);
      setIsRunning(true);
      return;
    }

    playPhaseAudio(activeState.phase.key);
    setIsRunning(true);
  };

  const handleReset = () => {
    resetSession();
  };

  return (
    <>
      <div className={s.copy}>
        <div>
          <p className={s.kicker}>Дыхание</p>
          <h2>Тренировка лёгких</h2>
        </div>
        <p>
          Выбери ритм, нажми старт и дыши за шариком. Каждая спокойная
          секунда добавляется в дыхательный опыт.
        </p>
      </div>

      <BreathExerciseList
        exercises={BREATHING_EXERCISES}
        selectedId={selectedId}
        onSelect={handleSelectExercise}
      />

      <div className={s.practice}>
        <div className={s.visual}>
          <BreathRoute
            exercise={tunedExercise}
            activeState={activeState}
            isRunning={isRunning}
            onStartPause={handleStartPause}
          />
        </div>

        <div className={s.guidance}>
          <div>
            <p className={s.exerciseTitle}>{selectedExercise.title}</p>
            <h3>{activeState.phase.label}</h3>
            <p>{activeState.phase.cue}</p>
          </div>

          <div className={s.phaseRail} aria-label="Фазы дыхания">
            {tunedExercise.phases.map(phase => (
              <span
                key={phase.key}
                className={phase.key === activeState.phase.key ? s.phaseActive : ''}
              >
                {phase.shortLabel}
              </span>
            ))}
          </div>

          <BreathRhythmSettings
            key={selectedId}
            phases={tunedExercise.phases}
            onChange={handlePhaseSecondsChange}
          />

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
    </>
  );
}
