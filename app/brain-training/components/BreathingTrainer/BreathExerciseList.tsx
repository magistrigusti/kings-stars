import type { CSSProperties } from 'react';
import type { BreathingExercise } from '../../data/breathingExercises';
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
            aria-pressed={isActive}
            aria-label={`${exercise.title}. ${exercise.subtitle}`}
          >
            <strong>{exercise.title}</strong>
          </button>
        );
      })}
    </div>
  );
}
