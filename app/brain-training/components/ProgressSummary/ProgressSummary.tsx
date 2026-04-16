import { IoFitnessOutline, IoPulseOutline, IoSparklesOutline } from 'react-icons/io5';
import { formatDuration, formatXp, getLevelProgress } from '../../progress/progression';
import type { TrainingProgress } from '../../progress/types';
import s from './ProgressSummary.module.scss';

interface ProgressSummaryProps {
  progress: TrainingProgress;
}

export default function ProgressSummary({ progress }: ProgressSummaryProps) {
  const totalSeconds = progress.brainSeconds + progress.breathingSeconds;
  const totalLevel = getLevelProgress(totalSeconds);
  const brainLevel = getLevelProgress(progress.brainSeconds);
  const breathingLevel = getLevelProgress(progress.breathingSeconds);

  return (
    <section className={s.summary} aria-label="Прогресс тренировок">
      <div className={s.total}>
        <IoSparklesOutline className={s.totalIcon} />
        <div className={s.totalContent}>
          <p className={s.eyebrow}>Общий рост</p>
          <h2>Уровень {totalLevel.level}</h2>
          <p className={s.totalText}>
            {formatDuration(totalSeconds)} в тренировках, {formatXp(totalSeconds)}.
          </p>
          <div className={s.bar} aria-hidden="true">
            <span style={{ width: `${totalLevel.progressPercent}%` }} />
          </div>
        </div>
      </div>

      <div className={s.metrics}>
        <article className={s.metric}>
          <IoFitnessOutline className={s.metricIcon} />
          <div>
            <p>Мозг</p>
            <strong>Уровень {brainLevel.level}</strong>
            <span>{formatDuration(progress.brainSeconds)}</span>
          </div>
        </article>

        <article className={s.metric}>
          <IoPulseOutline className={s.metricIcon} />
          <div>
            <p>Лёгкие</p>
            <strong>Уровень {breathingLevel.level}</strong>
            <span>{formatDuration(progress.breathingSeconds)}</span>
          </div>
        </article>
      </div>
    </section>
  );
}
