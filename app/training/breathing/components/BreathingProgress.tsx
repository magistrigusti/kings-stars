import { formatDuration, getLevelProgress } from '../../progress/progression';
import type { TrainingProgress } from '../../progress/types';
import { BREATHING_EXERCISES } from '../data/breathingExercises';
import BreathJournal from './BreathJournal';
import s from './BreathingTrainer.module.scss';

interface BreathingProgressProps {
  progress: TrainingProgress;
}

export default function BreathingProgress({ progress }: BreathingProgressProps) {
  const summedExerciseSeconds = BREATHING_EXERCISES.reduce(
    (sum, exercise) => sum + (progress.breathingByExercise[exercise.id] ?? 0),
    0,
  );
  const totalBreathingSeconds = Math.max(progress.breathingSeconds, summedExerciseSeconds);
  const level = getLevelProgress(totalBreathingSeconds);
  const nextLevelText = level.isMaxLevel
    ? 'Максимальный уровень'
    : formatDuration(level.remainingSeconds);

  return (
    <div className={s.progressPanel}>
      <div className={s.progressIntro}>
        <p className={s.kicker}>Рост</p>
        <h2>Дыхательный опыт</h2>
      </div>

      <BreathJournal progress={progress} totalSeconds={totalBreathingSeconds} />
      <div className={s.nextLevel}>
        <span>До следующего общего уровня лёгких</span>
        <strong>{nextLevelText}</strong>
      </div>
    </div>
  );
}
