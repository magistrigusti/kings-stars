import Image from 'next/image';
import { BREATHING_EXERCISES } from '../data/breathingExercises';
import { formatDuration, formatXp, getLevelProgress } from '../../progress/progression';
import type { TrainingProgress } from '../../progress/types';
import {
  getBreathingChakra,
  getBreathingChakraProgress,
} from '../progress/breathingChakras';
import s from './BreathingTrainer.module.scss';

interface BreathJournalProps {
  progress: TrainingProgress;
}

export default function BreathJournal({ progress }: BreathJournalProps) {
  const level = getLevelProgress(progress.breathingSeconds);
  const chakra = getBreathingChakra(level.level);
  const chakraProgress = getBreathingChakraProgress(level);

  return (
    <section className={s.journal} aria-label="Журнал дыхания">
      <div className={s.journalHead}>
        <div className={s.journalTitle}>
          <p className={s.kicker}>Журнал</p>
          <h3>Дыхательный опыт</h3>
          <span>{chakra.title}: уровни {chakra.fromLevel}-{chakra.toLevel}</span>
        </div>
        <div className={s.chakraLevel}>
          <Image
            src={chakra.imageSrc}
            alt={chakra.title}
            width={54}
            height={54}
            className={s.chakraIcon}
          />
          <div className={s.journalLevel}>
            <span>Уровень {level.level}</span>
            <strong>{formatXp(progress.breathingSeconds)}</strong>
          </div>
        </div>
      </div>

      <div className={s.journalBar} aria-hidden="true">
        <span style={{ width: `${level.progressPercent}%` }} />
      </div>

      <div className={s.chakraBar} aria-label={`Прогресс чакры ${chakra.title}: ${chakraProgress}%`}>
        <span style={{ width: `${chakraProgress}%` }} />
      </div>

      <div className={s.journalRows}>
        {BREATHING_EXERCISES.map(exercise => (
          <div className={s.journalRow} key={exercise.id}>
            <Image
              src={chakra.imageSrc}
              alt=""
              width={24}
              height={24}
              className={s.journalChakra}
              aria-hidden="true"
            />
            <strong>{exercise.title}</strong>
            <span>{formatDuration(progress.breathingByExercise[exercise.id] ?? 0)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
