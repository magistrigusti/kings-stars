import type { BreathPhaseKey, BreathingExercise } from '../../data/breathingExercises';
import BreathExerciseList from './BreathExerciseList';
import BreathRhythmSettings from './BreathRhythmSettings';
import s from './BreathingTrainer.module.scss';

interface BreathingSetupProps {
  exercises: BreathingExercise[];
  selectedExercise: BreathingExercise;
  tunedExercise: BreathingExercise;
  selectedId: string;
  onSelectExercise: (exerciseId: string) => void;
  onPhaseSecondsChange: (phaseKey: BreathPhaseKey, seconds: number) => void;
  onStart: () => void;
}

export default function BreathingSetup({
  exercises,
  selectedExercise,
  tunedExercise,
  selectedId,
  onSelectExercise,
  onPhaseSecondsChange,
  onStart,
}: BreathingSetupProps) {
  return (
    <div className={s.setup}>
      <div className={s.copy}>
        <div>
          <p className={s.kicker}>Дыхание</p>
          <h2>Тренировка лёгких</h2>
        </div>
        <p>
          Выбери ритм, настрой секунды и нажми начать. Потом откроется
          отдельный экран с шариком-проводником дыхания.
        </p>
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
          onChange={onPhaseSecondsChange}
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
