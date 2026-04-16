import type { BreathPhase, BreathPhaseKey } from '../../data/breathingExercises';
import s from './BreathingTrainer.module.scss';

interface BreathRhythmSettingsProps {
  phases: BreathPhase[];
  onChange: (phaseKey: BreathPhaseKey, seconds: number) => void;
}

export default function BreathRhythmSettings({
  phases,
  onChange,
}: BreathRhythmSettingsProps) {
  return (
    <section className={s.rhythmSettings} aria-label="Настройки дыхательного ритма">
      <div className={s.rhythmSettingsHead}>
        <strong>Настройки ритма</strong>
        <span>секунды</span>
      </div>

      <div className={s.rhythmInputs}>
        {phases.map(phase => (
          <label key={phase.key} className={s.rhythmField}>
            <span>{phase.label}</span>
            <input
              name={phase.key}
              type="number"
              inputMode="numeric"
              min={1}
              max={120}
              step={1}
              value={phase.seconds}
              onChange={event => onChange(phase.key, Number(event.target.value))}
              aria-label={`${phase.label}, секунд`}
            />
          </label>
        ))}
      </div>
    </section>
  );
}
