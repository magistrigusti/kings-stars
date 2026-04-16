import { IoFitnessOutline } from 'react-icons/io5';
import { formatDuration, formatXp, getLevelProgress } from '../../progress/progression';
import type { TrainingProgress } from '../../progress/types';
import s from './BrainTrainingArea.module.scss';

interface BrainProgressPanelProps {
  progress: TrainingProgress;
}

export default function BrainProgressPanel({ progress }: BrainProgressPanelProps) {
  const level = getLevelProgress(progress.brainSeconds);
  const nextLevelText = level.isMaxLevel
    ? 'Максимальный уровень'
    : formatDuration(level.nextLevelSeconds - level.currentSeconds);

  return (
    <div className={s.progressPanel}>
      <div className={s.progressIntro}>
        <p className={s.kicker}>Рост</p>
        <h2>Прогресс мозга</h2>
        <p>
          Мозговой опыт растёт от времени занятий. Первый уровень — один час,
          каждый следующий требует в два раза больше практики.
        </p>
      </div>

      <section className={s.progressSummary} aria-label="Прогресс мозга">
        <div className={s.progressMain}>
          <IoFitnessOutline className={s.progressIcon} />
          <div>
            <p>Мозг</p>
            <h3>Уровень {level.level}</h3>
            <span>
              {formatDuration(progress.brainSeconds)}, {formatXp(progress.brainSeconds)}
            </span>
          </div>
        </div>

        <div className={s.progressBar} aria-hidden="true">
          <span style={{ width: `${level.progressPercent}%` }} />
        </div>
      </section>

      <div className={s.nextLevel}>
        <span>До следующего уровня мозга</span>
        <strong>{nextLevelText}</strong>
      </div>
    </div>
  );
}
