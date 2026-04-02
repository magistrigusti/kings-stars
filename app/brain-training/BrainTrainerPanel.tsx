"use client"

import { IoPlay, IoPause } from 'react-icons/io5';
import { formatTime } from './engine/engine';
import { SPEED_STEP } from './engine/engine';
import s from './BrainTrainer.module.scss';

export type SizeMode = 'normal' | 'random' | 'mix';

interface BrainTrainerPanelProps {
  isFullscreen: boolean;
  showPanel: boolean;
  timerSec: number;
  timerMax: number;
  isTimerOn: boolean;
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
  handleToggleTimer: () => void;
  handleReset: () => void;
  setFontSize: (v: number | ((p: number) => number)) => void;
  toggleSizeMode: (mode: 'random' | 'mix') => void;
  toggleColorMode: (mode: 'random' | 'mix') => void;
  toggleHands: () => void;
  toggleLegs: () => void;
  onSlider: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setIsDark: (v: boolean | ((p: boolean) => boolean)) => void;
  isProMode: boolean;
}

export default function BrainTrainerPanel(props: BrainTrainerPanelProps) {
  const {
    isFullscreen,
    showPanel,
    timerSec,
    timerMax,
    isTimerOn,
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
    handleToggleTimer,
    handleReset,
    setFontSize,
    toggleSizeMode,
    toggleColorMode,
    toggleHands,
    toggleLegs,
    onSlider,
    setIsDark,
    isProMode,
  } = props;

  return (
    <div
      className={`${s.panel} ${
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
                className={s.ctrlBtn}
                onClick={() => setFontSize(p => Math.max(30, p - 5))}
              >
                −
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

      <div className={`${s.section} ${s.sectionAlt} ${s.sectionCompact}`}>
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
          <label className={s.themeCheck}>
            <input type="checkbox" checked={isDark} onChange={() => setIsDark(p => !p)} />
            <span>Тёмный экран</span>
          </label>
        </div>
      </div>
      </>
      )}

      <div className={s.section}>
        <div className={s.timerWrap}>
          <div className={s.timerRow}>
            <button
              className={`${s.timerToggleBtn} ${isTimerOn ? s.timerToggleBtnActive : ''}`}
              onClick={handleToggleTimer}
              aria-label={isTimerOn ? 'Пауза' : 'Старт'}
            >
              {isTimerOn ? <IoPause className={s.timerToggleIcon} /> : <IoPlay className={s.timerToggleIcon} />}
            </button>
            <div className={s.timerRight}>
            <div className={s.timerVal}>{formatTime(timerSec)}</div>
            <input
              type="range"
              className={s.slider}
              min={60}
              max={1200}
              step={20}
              value={timerMax}
              onChange={onSlider}
            />
            <div className={s.marks}>
              <span>1м</span><span>5м</span><span>10м</span>
              <span>15м</span><span>20м</span>
            </div>
          </div>
          </div>
        </div>
      </div>

      <div className={`${s.section} ${s.sectionAlt}`}>
        <div className={s.speedWrap}>
          <div className={s.speedCol}>
            <button className={s.ctrlBtn} onClick={() => changeSpeed(SPEED_STEP)} title="Медленнее">
              Скорость −
            </button>
            <input type="number" className={s.numInput} value={speed} readOnly />
            <button className={s.ctrlBtn} onClick={() => changeSpeed(-SPEED_STEP)} title="Быстрее">
              Скорость +
            </button>
          </div>
          <div className={s.actCol}>
            <button className={s.actionBtn} onClick={handleReset}>Сброс</button>
          </div>
        </div>
      </div>
    </div>
  );
}