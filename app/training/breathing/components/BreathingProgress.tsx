import { formatDuration, getLevelProgress } from '../../progress/progression';
import type { TrainingProgress } from '../../progress/types';
import BreathJournal from './BreathJournal';
import s from './BreathingTrainer.module.scss';

interface BreathingProgressProps {
  progress: TrainingProgress;
}

export default function BreathingProgress({ progress }: BreathingProgressProps) {
  const level = getLevelProgress(progress.breathingSeconds);
  const nextLevelText = level.isMaxLevel
    ? 'Максимальный уровень'
    : formatDuration(level.remainingSeconds);

  return (
    <div className={s.progressPanel}>
      <div className={s.progressIntro}>
        <p className={s.kicker}>Рост</p>
        <h2>Дыхательный опыт</h2>
      </div>

      <BreathJournal progress={progress} />
      <div className={s.nextLevel}>
        <span>До следующего уровня лёгких</span>
        <strong>{nextLevelText}</strong>
      </div>
    </div>
  );
}
