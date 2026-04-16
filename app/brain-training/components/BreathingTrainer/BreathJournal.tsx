import { BREATHING_EXERCISES } from '../../data/breathingExercises';
import { formatDuration, formatXp, getLevelProgress } from '../../progress/progression';
import type { TrainingProgress } from '../../progress/types';
import s from './BreathingTrainer.module.scss';

interface BreathJournalProps {
  progress: TrainingProgress;
}

export default function BreathJournal({ progress }: BreathJournalProps) {
  const level = getLevelProgress(progress.breathingSeconds);

  return (
    <section className={s.journal} aria-label="Журнал дыхания">
      <div className={s.journalHead}>
        <div>
          <p className={s.kicker}>Журнал</p>
          <h3>Дыхательный опыт</h3>
        </div>
        <div className={s.journalLevel}>
          <span>Уровень {level.level}</span>
          <strong>{formatXp(progress.breathingSeconds)}</strong>
        </div>
      </div>

      <div className={s.journalBar} aria-hidden="true">
        <span style={{ width: `${level.progressPercent}%` }} />
      </div>

      <div className={s.journalRows}>
        {BREATHING_EXERCISES.map(exercise => (
          <div className={s.journalRow} key={exercise.id}>
            <span className={s.journalTone} style={{ backgroundColor: exercise.tone }} />
            <strong>{exercise.title}</strong>
            <span>{formatDuration(progress.breathingByExercise[exercise.id] ?? 0)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
