import { IoFitnessOutline } from 'react-icons/io5';
import {
  formatDuration,
  formatXp,
  getBrainLevelProgress,
} from '../../progress/progression';
import type { TrainingProgress } from '../../progress/types';
import BrainNeuronMap from './BrainNeuronMap';
import s from './BrainTrainingArea.module.scss';

interface BrainProgressPanelProps {
  progress: TrainingProgress;
}

export default function BrainProgressPanel({ progress }: BrainProgressPanelProps) {
  const level = getBrainLevelProgress(progress.brainXp);
  const nextLevelText = level.isMaxLevel
    ? 'Максимальный уровень'
    : formatXp(level.remainingXp);
  const normalSpeedTime = level.isMaxLevel
    ? null
    : formatDuration(level.remainingXp);

  return (
    <div className={s.progressPanel}>
      <div className={s.progressIntro}>
        <p className={s.kicker}>Рост</p>
        <h2>Прогресс мозга</h2>
        <p>
          Теперь мозг растёт по 100 уровням: первый переход занимает около часа,
          а полная карта раскрывается за 100 суток чистой практики. Скорость
          даёт мягкий бонус к опыту, но главный закон остаётся честным: регулярность сильнее рывка.
        </p>
      </div>

      <BrainNeuronMap level={level} totalXp={progress.brainXp} />

      <section className={s.progressSummary} aria-label="Прогресс мозга">
        <div className={s.progressMain}>
          <IoFitnessOutline className={s.progressIcon} />
          <div>
            <p>Мозг</p>
            <h3>Уровень {level.level} из {level.maxLevel}</h3>
            <span>
              {formatDuration(progress.brainSeconds)} занятий, {formatXp(progress.brainXp)}
            </span>
          </div>
        </div>

        <div className={s.progressBar} aria-hidden="true">
          <span style={{ width: `${level.progressPercent}%` }} />
        </div>
      </section>

      <div className={s.nextLevel}>
        <span>До следующей клетки мозга</span>
        <strong>
          {nextLevelText}
          {normalSpeedTime ? ` · около ${normalSpeedTime}` : ''}
        </strong>
      </div>
    </div>
  );
}
