import type { CSSProperties } from 'react';
import type { BreathingExercise } from '../../data/breathingExercises';
import { formatDuration } from '../../progress/progression';
import { getSessionSeconds } from './breathingSession';
import s from './BreathingTrainer.module.scss';

interface BreathExerciseListProps {
  exercises: BreathingExercise[];
  selectedId: string;
  onSelect: (exerciseId: string) => void;
}

export default function BreathExerciseList({
  exercises,
  selectedId,
  onSelect,
}: BreathExerciseListProps) {
  return (
    <div className={s.exerciseList} aria-label="Дыхательные упражнения">
      {exercises.map(exercise => {
        const isActive = selectedId === exercise.id;
        const style = { '--exercise-tone': exercise.tone } as CSSProperties;

        return (
          <button
            key={exercise.id}
            type="button"
            className={`${s.exerciseButton} ${isActive ? s.exerciseButtonActive : ''}`}
            style={style}
            onClick={() => onSelect(exercise.id)}
          >
            <span>
              <strong>{exercise.title}</strong>
              <small>{exercise.subtitle}</small>
            </span>
            <span className={s.exerciseMeta}>
              <b>{formatDuration(getSessionSeconds(exercise))}</b>
            </span>
          </button>
        );
      })}
    </div>
  );
}
