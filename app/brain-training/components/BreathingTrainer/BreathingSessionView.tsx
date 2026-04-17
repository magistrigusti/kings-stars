import { IoRefreshOutline } from 'react-icons/io5';
import type { BreathingExercise } from '../../data/breathingExercises';
import type { ActiveBreathState } from './breathingSession';
import BreathRoute from './BreathRoute';
import s from './BreathingTrainer.module.scss';

interface BreathingSessionProps {
  selectedExercise: BreathingExercise;
  tunedExercise: BreathingExercise;
  activeState: ActiveBreathState;
  isRunning: boolean;
  onExit: () => void;
  onReset: () => void;
  onStartPause: () => void;
}

export default function BreathingSession({
  selectedExercise,
  tunedExercise,
  activeState,
  isRunning,
  onExit,
  onReset,
  onStartPause,
}: BreathingSessionProps) {
  const actionText = isRunning
    ? 'Пауза'
    : activeState.isComplete
      ? 'Сначала'
      : 'Старт';

  return (
    <div className={s.sessionStage}>
      <div className={s.sessionHeader}>
        <div>
          <p className={s.kicker}>Дыхание</p>
          <h2>{selectedExercise.title}</h2>
        </div>
        <button
          type="button"
          className={s.exitButton}
          onClick={onExit}
        >
          К настройкам
        </button>
      </div>

      <div className={s.practice}>
        <div className={s.visual}>
          <BreathRoute
            exercise={tunedExercise}
            activeState={activeState}
            isRunning={isRunning}
            onStartPause={onStartPause}
          />
        </div>

        <div className={s.guidance}>
          <div>
            <p className={s.exerciseTitle}>{selectedExercise.title}</p>
            <h3>{activeState.phase.label}</h3>
            <p>{activeState.phase.cue}</p>
          </div>

          <div className={s.phaseRail} aria-label="Фазы дыхания">
            {tunedExercise.phases.map(phase => (
              <span
                key={phase.key}
                className={phase.key === activeState.phase.key ? s.phaseActive : ''}
              >
                {phase.shortLabel} {phase.seconds}с
              </span>
            ))}
          </div>

          <div className={s.cycleDots} aria-label={`Круг ${activeState.cycle} из ${selectedExercise.cycles}`}>
            {Array.from({ length: selectedExercise.cycles }, (_, index) => (
              <span
                key={index}
                className={index < activeState.completedCycles ? s.dotDone : ''}
              />
            ))}
          </div>

          <div className={s.sessionInfo}>
            <span>Круг {activeState.cycle} из {selectedExercise.cycles}</span>
            <span>{activeState.sessionProgress}%</span>
          </div>

          <div className={s.controls}>
            <button type="button" onClick={onStartPause}>
              {actionText}
            </button>
            <button type="button" onClick={onReset}>
              <IoRefreshOutline />
              Сброс
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
