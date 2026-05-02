import { formatXp, type BrainLevelProgress } from '../../../progress/progression';
import s from './BrainTrainingArea.module.scss';

const BRAIN_ROW_COUNTS = [4, 6, 8, 10, 12, 12, 12, 12, 10, 8, 4, 2];
const BRAIN_ROW_WIDTHS = [34, 48, 60, 70, 78, 82, 80, 74, 64, 52, 34, 18];
const GAINED_NEURON_ICON = '/neurons/icon-neuron.png';
const CURRENT_NEURON_ICON = '/neurons/icon-neurons.png';

interface BrainNeuron {
  id: number;
  row: number;
  column: number;
  x: number;
  y: number;
}

interface BrainConnection {
  from: number;
  to: number;
}

interface BrainNeuronMapProps {
  level: BrainLevelProgress;
  totalXp: number;
}

const BRAIN_NEURONS = BRAIN_ROW_COUNTS.flatMap<BrainNeuron>((count, row) => {
  const width = BRAIN_ROW_WIDTHS[row];
  const startX = 50 - width / 2;
  const y = 13 + row * 6.5;

  return Array.from({ length: count }, (_, column) => {
    const id = BRAIN_ROW_COUNTS.slice(0, row).reduce((sum, rowCount) => sum + rowCount, 0) + column;
    const drift = Math.sin((id + 1) * 1.7) * 0.9;

    return {
      id,
      row,
      column,
      x: startX + (width * (column + 0.5)) / count + drift,
      y,
    };
  });
});

const CONNECTIONS = BRAIN_NEURONS.reduce<BrainConnection[]>((connections, neuron) => {
  const rowStart = BRAIN_NEURONS.findIndex(item => item.row === neuron.row);
  const rowCount = BRAIN_ROW_COUNTS[neuron.row];
  const nextRowCount = BRAIN_ROW_COUNTS[neuron.row + 1];
  const nextRowStart = nextRowCount
    ? BRAIN_NEURONS.findIndex(item => item.row === neuron.row + 1)
    : -1;

  if (neuron.column < rowCount - 1) {
    connections.push({ from: neuron.id, to: rowStart + neuron.column + 1 });
  }

  if (nextRowStart >= 0 && nextRowCount) {
    const nextColumn = Math.round(((neuron.column + 0.5) / rowCount) * nextRowCount - 0.5);
    const cleanNextColumn = Math.min(nextRowCount - 1, Math.max(0, nextColumn));

    connections.push({ from: neuron.id, to: nextRowStart + cleanNextColumn });

    if (cleanNextColumn + 1 < nextRowCount && neuron.column % 2 === 0) {
      connections.push({ from: neuron.id, to: nextRowStart + cleanNextColumn + 1 });
    }
  }

  return connections;
}, []);

const BRAIN_STAGES = [
  { level: 1, title: 'Искра', text: 'первая клетка внимания' },
  { level: 10, title: 'Росток', text: 'видна первая сеть' },
  { level: 25, title: 'Фокус', text: 'связи держат ритм' },
  { level: 50, title: 'Синхрон', text: 'полушария работают вместе' },
  { level: 75, title: 'Память', text: 'сеть становится плотной' },
  { level: 100, title: 'Мастер', text: 'полная карта мозга' },
];

function getBrainStage(level: number) {
  return BRAIN_STAGES.reduce((activeStage, stage) => (
    level >= stage.level ? stage : activeStage
  ), BRAIN_STAGES[0]);
}

export default function BrainNeuronMap({
  level,
  totalXp,
}: BrainNeuronMapProps) {
  const activeCells = Math.min(BRAIN_NEURONS.length, Math.max(0, level.level));
  const activeConnections = CONNECTIONS.filter(connection => (
    connection.from < activeCells && connection.to < activeCells
  ));
  const stage = getBrainStage(level.level);
  const nextStage = BRAIN_STAGES.find(item => item.level > level.level);

  return (
    <section className={s.neuronCard} aria-label="Карта развития мозга">
      <div className={s.neuronCopy}>
        <p className={s.kicker}>Нейросеть</p>
        <h3>{stage.title}</h3>
        <span>{stage.text}</span>
      </div>

      <svg
        className={s.neuronMap}
        viewBox="0 0 100 96"
        role="img"
        aria-label={`Активно ${activeCells} клеток мозга из 100`}
      >
        <path
          className={s.brainShape}
          d="M50 11 C39 2 21 8 17 24 C6 29 7 48 17 55 C14 72 28 85 43 80 C48 91 65 89 69 77 C86 75 94 58 85 45 C92 30 80 13 65 16 C61 10 55 8 50 11 Z"
        />
        <path
          className={s.brainSplit}
          d="M50 12 C45 23 55 30 48 41 C43 50 53 57 49 70 C47 76 50 82 54 86"
        />

        {CONNECTIONS.map(connection => {
          const from = BRAIN_NEURONS[connection.from];
          const to = BRAIN_NEURONS[connection.to];
          const isActive = connection.from < activeCells && connection.to < activeCells;

          return (
            <line
              key={`${connection.from}-${connection.to}`}
              className={`${s.neuronLink} ${isActive ? s.neuronLinkActive : ''}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
            />
          );
        })}

        {BRAIN_NEURONS.map(neuron => {
          const isActive = neuron.id < activeCells;
          const isCurrent = activeCells > 0 && neuron.id === activeCells - 1;
          const iconSize = isCurrent ? 6.4 : 5.2;

          if (isActive) {
            return (
              <image
                key={neuron.id}
                className={`${s.neuronImage} ${isCurrent ? s.neuronImageCurrent : ''}`}
                href={isCurrent ? CURRENT_NEURON_ICON : GAINED_NEURON_ICON}
                x={neuron.x - iconSize / 2}
                y={neuron.y - iconSize / 2}
                width={iconSize}
                height={iconSize}
                preserveAspectRatio="xMidYMid meet"
              />
            );
          }

          return (
            <circle
              key={neuron.id}
              className={[
                s.neuronNode,
              ].join(' ')}
              cx={neuron.x}
              cy={neuron.y}
              r={1.35}
            />
          );
        })}
      </svg>

      <div className={s.neuronStats}>
        <div>
          <span>Клетки</span>
          <strong>{activeCells}/100</strong>
        </div>
        <div>
          <span>Связи</span>
          <strong>{activeConnections.length}</strong>
        </div>
        <div>
          <span>Опыт</span>
          <strong>{formatXp(totalXp)}</strong>
        </div>
      </div>

      <div className={s.neuronMilestones}>
        {BRAIN_STAGES.map(stageItem => (
          <span
            key={stageItem.level}
            className={level.level >= stageItem.level ? s.neuronMilestoneActive : ''}
          >
            {stageItem.level}
          </span>
        ))}
      </div>

      {nextStage ? (
        <p className={s.neuronNext}>
          Следующий скачок сети: уровень {nextStage.level}
        </p>
      ) : (
        <p className={s.neuronNext}>Карта мозга раскрыта полностью</p>
      )}
    </section>
  );
}
