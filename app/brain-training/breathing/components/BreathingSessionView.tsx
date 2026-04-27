import { IoRefreshOutline } from 'react-icons/io5';
import type { BreathingExercise } from '../data/breathingExercises';
import {
  getBreathingPhases,
  getCycleSeconds,
  getPrepareSeconds,
  getSessionSeconds,
  type ActiveBreathState,
} from './breathingSession';
import BreathRoute from './BreathRoute';
import s from './BreathingTrainer.module.scss';

interface BreathingSessionProps {
  selectedExercise: BreathingExercise;
  tunedExercise: BreathingExercise;
  activeState: ActiveBreathState;
  isRunning: boolean;
  completedAt: Date | null;
  isDarkMode: boolean;
  onExit: () => void;
  onReset: () => void;
  onStartPause: () => void;
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const restSeconds = seconds % 60;

  if (minutes <= 0) {
    return `${restSeconds}с`;
  }

  return restSeconds > 0 ? `${minutes}м ${restSeconds}с` : `${minutes}м`;
}

function formatEndTime(date: Date | null): string {
  if (!date) {
    return '—';
  }

  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatBreathsPerMinute(exercise: BreathingExercise): string {
  const sessionMinutes = getSessionSeconds(exercise) / 60;

  if (sessionMinutes <= 0) {
    return '0';
  }

  return (exercise.cycles / sessionMinutes).toFixed(2).replace('.', ',');
}

function formatCyclePattern(exercise: BreathingExercise): string {
  return getBreathingPhases(exercise)
    .map(phase => phase.seconds)
    .join(' : ');
}

export default function BreathingSession({
  selectedExercise,
  tunedExercise,
  activeState,
  isRunning,
  completedAt,
  isDarkMode,
  onExit,
  onReset,
  onStartPause,
}: BreathingSessionProps) {
  const actionText = isRunning
    ? 'Пауза'
    : activeState.isComplete
      ? 'Сначала'
      : 'Старт';
  const prepareSeconds = getPrepareSeconds(tunedExercise);
  const cycleSeconds = getCycleSeconds(tunedExercise);

  return (
    <div className={`${s.sessionStage} ${isDarkMode ? s.sessionStageDark : ''}`}>
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
            isDarkMode={isDarkMode}
            onStartPause={onStartPause}
          />
        </div>

        <div className={s.guidance}>
          <div>
            {activeState.isComplete ? (
              <div className={s.completionPanel}>
                <p className={s.exerciseTitle}>{selectedExercise.title}</p>
                <h3>Упражнение завершено</h3>
                <div className={s.completionRows}>
                  <div>
                    <span>Время окончания</span>
                    <strong>{formatEndTime(completedAt)}</strong>
                  </div>
                  <div>
                    <span>Продолжительность</span>
                    <strong>{formatDuration(getSessionSeconds(tunedExercise))}</strong>
                  </div>
                  <div>
                    <span>Количество циклов</span>
                    <strong>{tunedExercise.cycles}</strong>
                  </div>
                  <div>
                    <span>Дыханий в мин</span>
                    <strong>{formatBreathsPerMinute(tunedExercise)}</strong>
                  </div>
                  <div>
                    <span>Длина цикла</span>
                    <strong>{formatDuration(cycleSeconds)}</strong>
                  </div>
                  <div>
                    <span>Дыхательный цикл</span>
                    <strong>{formatCyclePattern(tunedExercise)}</strong>
                  </div>
                  <div>
                    <span>Подготовка</span>
                    <strong>{formatDuration(prepareSeconds)}</strong>
                  </div>
                  <div>
                    <span>Заметка</span>
                    <strong>—</strong>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <p className={s.exerciseTitle}>{selectedExercise.title}</p>
                <h3>{activeState.phase.label}</h3>
                <p>{activeState.phase.cue}</p>
              </>
            )}
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

          <div className={s.cycleDots} aria-label={`Круг ${activeState.cycle} из ${tunedExercise.cycles}`}>
            {Array.from({ length: tunedExercise.cycles }, (_, index) => (
              <span
                key={index}
                className={index < activeState.completedCycles ? s.dotDone : ''}
              />
            ))}
          </div>

          <div className={s.sessionInfo}>
            <span>Круг {activeState.cycle} из {tunedExercise.cycles}</span>
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
