import Image from 'next/image';
import type { CSSProperties } from 'react';
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
  totalSeconds: number;
}

export default function BreathJournal({ progress, totalSeconds }: BreathJournalProps) {
  const level = getLevelProgress(totalSeconds);
  const chakra = getBreathingChakra(level.level);
  const chakraProgress = getBreathingChakraProgress(level);
  const exerciseRows = BREATHING_EXERCISES.map(exercise => {
    const seconds = progress.breathingByExercise[exercise.id] ?? 0;
    const exerciseLevel = getLevelProgress(seconds);
    const exerciseChakra = getBreathingChakra(exerciseLevel.level);

    return {
      exercise,
      seconds,
      level: exerciseLevel,
      chakra: exerciseChakra,
    };
  });

  return (
    <section className={s.journal} aria-label="Журнал дыхания">
      <div className={s.journalHead}>
        <div className={s.journalTitle}>
          <p className={s.kicker}>Журнал</p>
          <h3>Общий дыхательный опыт</h3>
          <span>Сумма всех дыхательных упражнений</span>
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
            <strong>{formatXp(totalSeconds)}</strong>
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
        {exerciseRows.map(({ exercise, seconds, level: exerciseLevel, chakra: exerciseChakra }) => (
          <div
            className={s.journalRow}
            key={exercise.id}
            style={{ '--exercise-tone': exercise.tone } as CSSProperties}
          >
            <Image
              src={exerciseChakra.imageSrc}
              alt=""
              width={24}
              height={24}
              className={s.journalChakra}
              aria-hidden="true"
            />
            <div className={s.journalExercise}>
              <strong>{exercise.title}</strong>
              <span>{exerciseChakra.title}: уровень {exerciseLevel.level}</span>
              <div className={s.exerciseBar} aria-hidden="true">
                <span style={{ width: `${exerciseLevel.progressPercent}%` }} />
              </div>
            </div>
            <div className={s.journalExerciseStats}>
              <strong>{formatXp(seconds)}</strong>
              <span>{formatDuration(seconds)}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
