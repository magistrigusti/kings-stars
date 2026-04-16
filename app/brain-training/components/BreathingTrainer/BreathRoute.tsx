import type { CSSProperties } from 'react';
import { IoPause, IoPlay } from 'react-icons/io5';
import type {
  BreathPhase,
  BreathPhaseKey,
  BreathingExercise,
} from '../../data/breathingExercises';
import type { ActiveBreathState } from './breathingSession';
import s from './BreathRoute.module.scss';

interface BreathRouteProps {
  exercise: BreathingExercise;
  activeState: ActiveBreathState;
  isRunning: boolean;
  onStartPause: () => void;
}

interface RoutePoint {
  x: number;
  y: number;
}

interface RouteSegment {
  key: BreathPhaseKey;
  start: RoutePoint;
  end: RoutePoint;
}

const VIEWBOX_WIDTH = 400;
const VIEWBOX_HEIGHT = 320;

const START: RoutePoint = { x: 74, y: 252 };
const TOP_LEFT: RoutePoint = { x: 108, y: 70 };
const TOP_RIGHT: RoutePoint = { x: 292, y: 70 };
const BOTTOM_RIGHT: RoutePoint = { x: 326, y: 252 };

function getPhaseLabel(phase: BreathPhase): string {
  if (phase.key === 'holdIn' || phase.key === 'holdOut') {
    return 'Пауза';
  }

  return phase.shortLabel;
}

function interpolate(start: RoutePoint, end: RoutePoint, progress: number): RoutePoint {
  const clamped = Math.min(1, Math.max(0, progress));

  return {
    x: start.x + (end.x - start.x) * clamped,
    y: start.y + (end.y - start.y) * clamped,
  };
}

function getSegmentForPhase(
  phase: BreathPhase,
  hasHoldIn: boolean
): RouteSegment {
  if (phase.key === 'inhale') {
    return {
      key: phase.key,
      start: START,
      end: TOP_LEFT,
    };
  }

  if (phase.key === 'holdIn') {
    return {
      key: phase.key,
      start: TOP_LEFT,
      end: TOP_RIGHT,
    };
  }

  if (phase.key === 'exhale') {
    return {
      key: phase.key,
      start: hasHoldIn ? TOP_RIGHT : TOP_LEFT,
      end: BOTTOM_RIGHT,
    };
  }

  if (phase.key === 'holdOut' || phase.key === 'rest') {
    return {
      key: phase.key,
      start: BOTTOM_RIGHT,
      end: START,
    };
  }

  return {
    key: phase.key,
    start: START,
    end: START,
  };
}

function getRouteSegments(exercise: BreathingExercise): RouteSegment[] {
  const hasHoldIn = exercise.phases.some(phase => phase.key === 'holdIn');

  return exercise.phases
    .filter(phase => phase.key !== 'prepare')
    .map(phase => getSegmentForPhase(phase, hasHoldIn));
}

function getTravelerPoint(
  exercise: BreathingExercise,
  activeState: ActiveBreathState
): RoutePoint {
  const hasHoldIn = exercise.phases.some(phase => phase.key === 'holdIn');
  const segment = getSegmentForPhase(activeState.phase, hasHoldIn);

  return interpolate(segment.start, segment.end, activeState.phaseProgress);
}

function getTickPoints(activeState: ActiveBreathState, exercise: BreathingExercise) {
  if (activeState.phase.key === 'prepare') {
    return [];
  }

  const hasHoldIn = exercise.phases.some(phase => phase.key === 'holdIn');
  const segment = getSegmentForPhase(activeState.phase, hasHoldIn);

  return Array.from({ length: activeState.phase.seconds }, (_, index) => ({
    point: interpolate(segment.start, segment.end, (index + 1) / activeState.phase.seconds),
    isDone: index < activeState.phaseElapsed,
  }));
}

export default function BreathRoute({
  exercise,
  activeState,
  isRunning,
  onStartPause,
}: BreathRouteProps) {
  const segments = getRouteSegments(exercise);
  const traveler = getTravelerPoint(exercise, activeState);
  const tickPoints = getTickPoints(activeState, exercise);
  const activeLabel = getPhaseLabel(activeState.phase);
  const style = {
    '--breath-tone': exercise.tone,
    '--traveler-x': `${(traveler.x / VIEWBOX_WIDTH) * 100}%`,
    '--traveler-y': `${(traveler.y / VIEWBOX_HEIGHT) * 100}%`,
  } as CSSProperties;

  return (
    <div className={s.route} style={style}>
      <svg
        className={s.svg}
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        role="img"
        aria-label={`Маршрут дыхания: ${exercise.title}`}
      >
        {segments.map(segment => (
          <line
            key={segment.key}
            className={`${s.segment} ${
              segment.key === activeState.phase.key ? s.segmentActive : ''
            }`}
            x1={segment.start.x}
            y1={segment.start.y}
            x2={segment.end.x}
            y2={segment.end.y}
          />
        ))}

        <circle className={s.node} cx={START.x} cy={START.y} r="10" />
        <circle className={s.node} cx={TOP_LEFT.x} cy={TOP_LEFT.y} r="10" />
        {segments.some(segment => segment.key === 'holdIn') && (
          <circle className={s.node} cx={TOP_RIGHT.x} cy={TOP_RIGHT.y} r="10" />
        )}
        <circle className={s.node} cx={BOTTOM_RIGHT.x} cy={BOTTOM_RIGHT.y} r="10" />

        {tickPoints.map(({ point, isDone }, index) => (
          <circle
            key={`${activeState.phase.key}-${index}`}
            className={`${s.tick} ${isDone ? s.tickDone : ''}`}
            cx={point.x}
            cy={point.y}
            r="4"
          />
        ))}

        <text className={s.label} x="52" y="286">Старт</text>
        <text className={s.label} x="64" y="48">Вдох</text>
        {segments.some(segment => segment.key === 'holdIn') && (
          <text className={s.label} x="184" y="48">Пауза</text>
        )}
        <text className={s.label} x="310" y="48">Выдох</text>
        {segments.some(segment => segment.key === 'rest' || segment.key === 'holdOut') && (
          <text className={s.label} x="252" y="286">Покой</text>
        )}
      </svg>

      <div className={s.traveler} aria-hidden="true">
        <span />
      </div>

      <div className={s.readout}>
        <span>{activeLabel}</span>
        <strong>{activeState.phaseRemaining}</strong>
      </div>

      <button
        type="button"
        className={s.playButton}
        onClick={onStartPause}
        aria-label={isRunning ? 'Пауза' : 'Старт'}
      >
        {isRunning ? <IoPause /> : <IoPlay />}
      </button>
    </div>
  );
}
