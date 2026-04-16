import BrainTrainer from '../../BrainTrainer';
import { formatDuration, formatXp, getLevelProgress } from '../../progress/progression';
import type { TrainingProgress } from '../../progress/types';
import s from './BrainTrainingArea.module.scss';

interface BrainTrainingAreaProps {
  progress: TrainingProgress;
  onTrainingSecond: () => void;
}

export default function BrainTrainingArea({
  progress,
  onTrainingSecond,
}: BrainTrainingAreaProps) {
  const level = getLevelProgress(progress.brainSeconds);

  return (
    <section className={s.area} aria-label="Тренировка мозга">
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
    </section>
  );
}
