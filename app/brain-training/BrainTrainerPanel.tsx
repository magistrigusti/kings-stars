"use client"

import { IoPlay, IoPause } from 'react-icons/io5';
import { formatTime } from './engine/engine';
import { SPEED_STEP } from './engine/engine';
import s from './BrainTrainer.module.scss';

export type SizeMode = 'normal' | 'random' | 'mix';

interface BrainTrainerPanelProps {
  isFullscreen: boolean;
  showPanel: boolean;
  isTimerOn: boolean;
  timerSec: number;
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
  setIsTimerOn: (v: boolean | ((p: boolean) => boolean)) => void;
  changeSpeed: (delta: number) => void;
  handleReset: () => void;
  handleStart: () => void;
  setFontSize: (v: number | ((p: number) => number)) => void;
  toggleSizeMode: (mode: 'random' | 'mix') => void;
  toggleColorMode: (mode: 'random' | 'mix') => void;
  toggleHands: () => void;
  toggleLegs: () => void;
  onSlider: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setIsDark: (v: boolean | ((p: boolean) => boolean)) => void;
}

export default function BrainTrainerPanel(props: BrainTrainerPanelProps) {
  const {
    isFullscreen,
    showPanel,
    isTimerOn,
    timerSec,
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
    setIsTimerOn,
    changeSpeed,
    handleReset,
    handleStart,
    setFontSize,
    toggleSizeMode,
    toggleColorMode,
    toggleHands,
    toggleLegs,
    onSlider,
    setIsDark,
  } = props;

  return (
    <div
      className={`${s.panel} ${
        isFullscreen && !showPanel ? s.hidden : ''
      }`}
    >
      <div className={s.section}>
        <div className={s.timerWrap}>
          <div className={s.timerBtns}>
            <button
              className={`${s.playBtn} ${isTimerOn ? s.active : ''}`}
              onClick={() => setIsTimerOn(true)}
              title="Запустить таймер"
            >
              <IoPlay />
            </button>
            <button
              className={`${s.stopBtn} ${
                !isTimerOn && timerSec < timerMax ? s.stopped : ''
              }`}
              onClick={() => setIsTimerOn(false)}
              title="Остановить таймер"
            >
              <IoPause />
            </button>
          </div>
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

      <div className={`${s.section} ${s.sectionAlt}`}>
        <div className={s.speedWrap}>
          <div className={s.speedCol}>
            <button className={s.ctrlBtn} onClick={() => changeSpeed(-SPEED_STEP)}>
              Скорость -
            </button>
            <input type="number" className={s.numInput} value={speed} readOnly />
            <button className={s.ctrlBtn} onClick={() => changeSpeed(SPEED_STEP)}>
              Скорость +
            </button>
          </div>
          <div className={s.actCol}>
            <button className={s.actionBtn} onClick={handleReset}>Сброс</button>
            <button className={s.actionBtn} onClick={handleStart}>Старт</button>
          </div>
        </div>
      </div>

      <div className={s.section}>
        <div className={s.sizeWrap}>
          <div className={s.sizeCol}>
            {sizeMode === 'normal' && (
              <button
                className={s.ctrlBtn}
                onClick={() => setFontSize(p => Math.min(150, p + 5))}
              >
                Размер +
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
                onClick={() => setFontSize(p => Math.max(30, p - 5))}
              >
                Размер -
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

      <div className={`${s.section} ${s.sectionAlt}`}>
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
    </div>
  );
}