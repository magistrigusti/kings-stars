"use client"

import { useEffect, useState, type ChangeEvent } from 'react';
import { formatTime, SPEED_STEP } from './engine/engine';
import s from './BrainTrainer.module.scss';

export type SizeMode = 'normal' | 'random' | 'mix';

const TIMER_MIN = 60;
const TIMER_MAX = 1200;
const TIMER_PRESETS = [60, 300, 600, 900, 1200];

interface BrainTrainerPanelProps {
  isFullscreen: boolean;
  showPanel: boolean;
  timerMax: number;
  speed: number;
  fontSize: number;
  sizeMode: SizeMode;
  showHands: boolean;
  showLegs: boolean;
  lSize: number;
  hSize: number;
  lgSize: number;
  colorMode: 'none' | 'random' | 'mix';
  isDark: boolean;
  changeSpeed: (delta: number) => void;
  handleReset: () => void;
  setFontSize: (v: number | ((p: number) => number)) => void;
  toggleSizeMode: (mode: 'random' | 'mix') => void;
  toggleColorMode: (mode: 'random' | 'mix') => void;
  toggleHands: () => void;
  toggleLegs: () => void;
  onTimerChange: (seconds: number) => void;
  isProMode: boolean;
}

function clampTimer(seconds: number) {
  return Math.max(TIMER_MIN, Math.min(TIMER_MAX, Math.round(seconds)));
}

function parseTimerInput(value: string) {
  const compact = value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/минут[а-я]*/, 'm')
    .replace(/мин\./, 'm')
    .replace(/мин/, 'm');

  if (!compact) return null;

  const timeMatch = compact.match(/^(\d{1,3}):(\d{1,2})$/);
  if (timeMatch) {
    const minutes = Number(timeMatch[1]);
    const seconds = Number(timeMatch[2]);
    if (Number.isFinite(minutes) && Number.isFinite(seconds)) {
      return minutes * 60 + seconds;
    }
  }

  const minutesText = compact.replace(/m$/, '').replace(',', '.');
  const minutes = Number(minutesText);
  if (!Number.isFinite(minutes)) return null;

  return minutes * 60;
}

export default function BrainTrainerPanel(props: BrainTrainerPanelProps) {
  const {
    isFullscreen,
    showPanel,
    timerMax,
    speed,
    fontSize,
    sizeMode,
    showHands,
    showLegs,
    lSize,
    hSize,
    lgSize,
    colorMode,
    isDark,
    changeSpeed,
    handleReset,
    setFontSize,
    toggleSizeMode,
    toggleColorMode,
    toggleHands,
    toggleLegs,
    onTimerChange,
    isProMode,
  } = props;
  const [timerDraft, setTimerDraft] = useState(formatTime(timerMax));

  useEffect(() => {
    setTimerDraft(formatTime(timerMax));
  }, [timerMax]);

  const commitTimerDraft = () => {
    const parsed = parseTimerInput(timerDraft);
    const next = parsed === null ? timerMax : clampTimer(parsed);
    onTimerChange(next);
    setTimerDraft(formatTime(next));
  };

  const handleRangeChange = (event: ChangeEvent<HTMLInputElement>) => {
    onTimerChange(clampTimer(Number(event.target.value)));
  };

  return (
    <div
      className={`${s.panel} ${isDark ? s.panelDark : ''} ${
        isFullscreen && !showPanel ? s.hidden : ''
      } ${isProMode ? s.panelPro : ''}`}
    >
      {isProMode && (
        <>
          <div className={`${s.section} ${s.sectionCompact}`}>
            <div className={s.sizeWrap}>
              <div className={s.sizeCol}>
                {sizeMode === 'normal' && (
                  <button
                    type="button"
                    className={s.ctrlBtn}
                    onClick={() => setFontSize(p => Math.max(30, p - 5))}
                  >
                    -
                  </button>
                )}
                {sizeMode === 'mix' ? (
                  <div className={s.mixSizes}>
                    <span className={s.mixVal}>{lSize}</span>
                    {showHands && <span className={s.mixVal}>{hSize}</span>}
                    {showLegs && <span className={s.mixVal}>{lgSize}</span>}
                  </div>
                ) : (
                  <input
                    type="number"
                    className={s.numInput}
                    value={sizeMode === 'random' ? lSize : fontSize}
                    readOnly
                  />
                )}
                {sizeMode === 'normal' && (
                  <button
                    type="button"
                    className={s.ctrlBtn}
                    onClick={() => setFontSize(p => Math.min(150, p + 5))}
                  >
                    +
                  </button>
                )}
              </div>
              <div className={s.modeCol}>
                <label className={s.check}>
                  <input type="checkbox" checked={sizeMode === 'mix'} onChange={() => toggleSizeMode('mix')} />
                  <span>Микс</span>
                </label>
                <label className={s.check}>
                  <input type="checkbox" checked={sizeMode === 'random'} onChange={() => toggleSizeMode('random')} />
                  <span>Рандом</span>
                </label>
              </div>
            </div>
          </div>

          <div className={`${s.section} ${s.sectionCompact}`}>
            <div className={s.optWrap}>
              <div className={s.optCol}>
                <label className={s.check}>
                  <input type="checkbox" checked={colorMode === 'random'} onChange={() => toggleColorMode('random')} />
                  <span>Цвет-Рандом</span>
                </label>
                <label className={s.check}>
                  <input type="checkbox" checked={colorMode === 'mix'} onChange={() => toggleColorMode('mix')} />
                  <span>Цвет-Микс</span>
                </label>
              </div>
              <div className={s.optCol}>
                <label className={s.check}>
                  <input type="checkbox" checked={showLegs} onChange={toggleLegs} />
                  <span>Верх</span>
                </label>
                <label className={s.check}>
                  <input type="checkbox" checked={showHands} onChange={toggleHands} />
                  <span>Низ</span>
                </label>
              </div>
            </div>
          </div>
        </>
      )}

      <div className={`${s.section} ${s.timerSection}`}>
        <div className={s.timerWrap}>
          <div className={s.timerHeader}>
            <span>Время</span>
            <input
              type="text"
              inputMode="numeric"
              className={s.timerEditInput}
              value={timerDraft}
              onChange={event => setTimerDraft(event.target.value)}
              onBlur={commitTimerDraft}
              onFocus={event => event.currentTarget.select()}
              onKeyDown={event => {
                if (event.key === 'Enter') {
                  event.currentTarget.blur();
                }
              }}
              aria-label="Время упражнения"
            />
          </div>
          <input
            type="range"
            className={s.slider}
            min={TIMER_MIN}
            max={TIMER_MAX}
            step={20}
            value={timerMax}
            onChange={handleRangeChange}
          />
          <div className={s.timerPresets}>
            {TIMER_PRESETS.map(seconds => (
              <button
                key={seconds}
                type="button"
                className={timerMax === seconds ? s.timerPresetActive : ''}
                onClick={() => onTimerChange(seconds)}
              >
                {seconds / 60}м
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={s.section}>
        <div className={s.speedWrap}>
          <div className={s.speedCol}>
            <button className={s.ctrlBtn} type="button" onClick={() => changeSpeed(SPEED_STEP)} title="Медленнее">
              Скорость -
            </button>
            <input type="number" className={s.numInput} value={speed} readOnly />
            <button className={s.ctrlBtn} type="button" onClick={() => changeSpeed(-SPEED_STEP)} title="Быстрее">
              Скорость +
            </button>
          </div>
          <div className={s.actCol}>
            <button className={s.actionBtn} type="button" onClick={handleReset}>Сброс</button>
          </div>
        </div>
      </div>
    </div>
  );
}
