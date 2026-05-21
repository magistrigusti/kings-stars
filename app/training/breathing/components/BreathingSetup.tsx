import type { BreathPhaseKey, BreathingExercise } from '../data/breathingExercises';
import BreathExerciseList from './BreathExerciseList';
import BreathRhythmSettings from './BreathRhythmSettings';
import s from './BreathingTrainer.module.scss';

interface BreathingSetupProps {
  exercises: BreathingExercise[];
  selectedExercise: BreathingExercise;
  tunedExercise: BreathingExercise;
  selectedId: string;
  maxCycles: number;
  maxRounds: number;
  onSelectExercise: (exerciseId: string) => void;
  onPhaseSecondsChange: (phaseKey: BreathPhaseKey, seconds: number) => void;
  onCyclesChange: (cycles: number) => void;
  onRoundsChange: (rounds: number) => void;
  onStart: () => void;
}

export default function BreathingSetup({
  exercises,
  selectedExercise,
  tunedExercise,
  selectedId,
  maxCycles,
  maxRounds,
  onSelectExercise,
  onPhaseSecondsChange,
  onCyclesChange,
  onRoundsChange,
  onStart,
}: BreathingSetupProps) {
  return (
    <div className={s.setup}>
      <div className={s.copy}>
        <div>
          <p className={s.kicker}>Дыхание</p>
          <h2>Тренировка лёгких</h2>
          <p>
            Улучшает анаэробные возможности, развивает и оздоравливает
            митохондрии.
          </p>
        </div>
      </div>

      <BreathExerciseList
        exercises={exercises}
        selectedId={selectedId}
        onSelect={onSelectExercise}
      />

      <div className={s.setupPanel}>
        <div className={s.setupSummary}>
          <p className={s.exerciseTitle}>{selectedExercise.title}</p>
          <h3>{selectedExercise.subtitle}</h3>
        </div>

        <BreathRhythmSettings
          key={selectedId}
          phases={tunedExercise.phases}
          cycles={tunedExercise.cycles}
          rounds={tunedExercise.rounds ?? 1}
          cycleLabel={tunedExercise.cycleLabel}
          showRounds={tunedExercise.protocol === 'wim-hof'}
          maxCycles={maxCycles}
          maxRounds={maxRounds}
          onChange={onPhaseSecondsChange}
          onCyclesChange={onCyclesChange}
          onRoundsChange={onRoundsChange}
        />

        <button
          type="button"
          className={s.startButton}
          onClick={onStart}
        >
          Начать
        </button>
      </div>
    </div>
  );
}
