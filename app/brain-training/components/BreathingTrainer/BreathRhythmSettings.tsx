import { useCallback, useState } from 'react';
import type { BreathPhase, BreathPhaseKey } from '../../data/breathingExercises';
import s from './BreathingTrainer.module.scss';

interface BreathRhythmSettingsProps {
  phases: BreathPhase[];
  onChange: (phaseKey: BreathPhaseKey, seconds: number) => void;
}

type PhaseSecondDrafts = Partial<Record<BreathPhaseKey, string>>;

function getPhaseSecondDrafts(phases: BreathPhase[]): PhaseSecondDrafts {
  return Object.fromEntries(
    phases.map(phase => [phase.key, String(phase.seconds)])
  ) as PhaseSecondDrafts;
}

export default function BreathRhythmSettings({
  phases,
  onChange,
}: BreathRhythmSettingsProps) {
  const [secondDrafts, setSecondDrafts] = useState<PhaseSecondDrafts>(() => (
    getPhaseSecondDrafts(phases)
  ));

  const handleDraftChange = useCallback((phaseKey: BreathPhaseKey, value: string) => {
    const numericValue = value.replace(/\D/g, '');

    setSecondDrafts(prev => ({
      ...prev,
      [phaseKey]: numericValue,
    }));

    if (numericValue === '') {
      return;
    }

    const nextSeconds = Number(numericValue);

    if (Number.isFinite(nextSeconds) && nextSeconds >= 1) {
      onChange(phaseKey, nextSeconds);
    }
  }, [onChange]);

  const handleDraftBlur = useCallback((phase: BreathPhase) => {
    const draft = secondDrafts[phase.key] ?? String(phase.seconds);
    const nextSeconds = Number(draft);

    if (draft === '' || !Number.isFinite(nextSeconds) || nextSeconds < 1) {
      setSecondDrafts(prev => ({
        ...prev,
        [phase.key]: String(phase.seconds),
      }));
      return;
    }

    const roundedSeconds = Math.round(nextSeconds);
    setSecondDrafts(prev => ({
      ...prev,
      [phase.key]: String(roundedSeconds),
    }));
    onChange(phase.key, roundedSeconds);
  }, [onChange, secondDrafts]);

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
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={secondDrafts[phase.key] ?? String(phase.seconds)}
              onBlur={() => handleDraftBlur(phase)}
              onChange={event => handleDraftChange(phase.key, event.target.value)}
              aria-label={`${phase.label}, секунд`}
            />
          </label>
        ))}
      </div>
    </section>
  );
}
