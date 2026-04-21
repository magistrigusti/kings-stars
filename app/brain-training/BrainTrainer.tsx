"use client"

import { useState, useEffect, useRef, useCallback } from 'react';
import s from './BrainTrainer.module.scss';
import {
  ALPHABET, HANDS, LEGS, SPEED_STEP,
  formatTime, getInitialSpeed, shuffle,
} from './engine/engine';
import { useBrainTrainerControls, type ColorMode, type SizeMode } from './engine/useBrainTrainerControls';
import { useScreenWakeLock } from './hooks/useScreenWakeLock';

export interface BrainTrainerSettings {
  speed: number;
  fontSize: number;
  timerMax: number;
  showHands: boolean;
  showLegs: boolean;
  sizeMode: SizeMode;
  colorMode: ColorMode;
  isDark: boolean;
}

export function getDefaultBrainTrainerSettings(): BrainTrainerSettings {
  return {
    speed: getInitialSpeed(),
    fontSize: 100,
    timerMax: 60,
    showHands: true,
    showLegs: false,
    sizeMode: 'normal',
    colorMode: 'none',
    isDark: false,
  };
}

interface BrainTrainerProps {
  initialSettings: BrainTrainerSettings;
  onTrainingSecond?: () => void;
  onFinishExit?: () => void;
}

export default function BrainTrainer({
  initialSettings,
  onTrainingSecond,
  onFinishExit,
}: BrainTrainerProps) {
  const [speed, setSpeed] = useState(initialSettings.speed);
  const [fontSize, setFontSize] = useState(initialSettings.fontSize);
  const [, setTimerMax] = useState(initialSettings.timerMax);
  const [timerSec, setTimerSec] = useState(initialSettings.timerMax);
  const [showHands, setShowHands] = useState(initialSettings.showHands);
  const [showLegs, setShowLegs] = useState(initialSettings.showLegs);
  const [sizeMode, setSizeMode] = useState<SizeMode>(initialSettings.sizeMode);
  const [colorMode, setColorMode] = useState<ColorMode>(initialSettings.colorMode);
  const [isDark, setIsDark] = useState(initialSettings.isDark);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTimerOn, setIsTimerOn] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  useScreenWakeLock(!isFinished);

  const [letter, setLetter] = useState('');
  const [hand, setHand] = useState('');
  const [leg, setLeg] = useState('');
  const [lColor, setLColor] = useState('');
  const [hColor, setHColor] = useState('');
  const [lgColor, setLgColor] = useState('');
  const [lSize, setLSize] = useState(100);
  const [hSize, setHSize] = useState(100);
  const [lgSize, setLgSize] = useState(100);
  const [pos, setPos] = useState({ top: '', left: '' });

  const alphaArr = useRef(shuffle(ALPHABET));
  const handArr = useRef(shuffle(HANDS));
  const legArr = useRef(shuffle(LEGS));
  const alphaIdx = useRef(0);
  const handIdx = useRef(0);
  const legIdx = useRef(0);

  type TimerId = ReturnType<typeof setInterval>;
  const mainRef = useRef<TimerId | null>(null);
  const timerIntRef = useRef<TimerId | null>(null);
  const secRef = useRef(initialSettings.timerMax);

  const cfg = useRef({
    showHands: initialSettings.showHands,
    showLegs: initialSettings.showLegs,
    sizeMode: initialSettings.sizeMode as string,
    colorMode: initialSettings.colorMode as string,
    isFullscreen: false,
    fontSize: initialSettings.fontSize,
    isDark: initialSettings.isDark,
  });

  useEffect(() => {
    cfg.current = {
      showHands, showLegs, sizeMode,
      colorMode, isFullscreen, fontSize, isDark,
    };
  }, [showHands, showLegs, sizeMode, colorMode, isFullscreen, fontSize, isDark]);

  useEffect(() => {
    secRef.current = timerSec;
  }, [timerSec]);

  const setTimerIntRef = useCallback((v: TimerId | null) => { timerIntRef.current = v; }, []);
  const setCfg = useCallback((v: { showHands: boolean; showLegs: boolean; sizeMode: string; colorMode: string; isFullscreen: boolean; fontSize: number; isDark: boolean }) => { cfg.current = v; }, []);
  const setAlphaArr = useCallback((v: string[]) => { alphaArr.current = v; }, []);
  const setHandArr = useCallback((v: string[]) => { handArr.current = v; }, []);
  const setLegArr = useCallback((v: string[]) => { legArr.current = v; }, []);
  const setAlphaIdx = useCallback((v: number) => { alphaIdx.current = v; }, []);
  const setHandIdx = useCallback((v: number) => { handIdx.current = v; }, []);
  const setLegIdx = useCallback((v: number) => { legIdx.current = v; }, []);
  const setSecRef = useCallback((v: number) => { secRef.current = v; }, []);

  const controls = useBrainTrainerControls({
    setSpeed, setFontSize, setTimerMax, setTimerSec,
    setShowHands, setShowLegs, setSizeMode, setColorMode,
    setIsDark, setIsTimerOn, setIsFinished,
    setLetter, setHand, setLeg, setLColor, setHColor, setLgColor,
    setLSize, setHSize, setLgSize, setPos,
    timerIntRef, alphaArr, handArr, legArr,
    alphaIdx, handIdx, legIdx, secRef, cfg,
    setTimerIntRef, setCfg,
    setAlphaArr, setHandArr, setLegArr,
    setAlphaIdx, setHandIdx, setLegIdx, setSecRef,
    resetSettings: initialSettings,
  });
  const { changeSpeed, handleReset, handleToggleTimer, tick } = controls;

  useEffect(() => {
    if (isFinished) {
      if (mainRef.current) {
        clearInterval(mainRef.current);
        mainRef.current = null;
      }
      return;
    }
    tick();
    mainRef.current = setInterval(tick, speed);
    return () => {
      if (mainRef.current) {
        clearInterval(mainRef.current);
        mainRef.current = null;
      }
    };
  }, [speed, isFinished, tick]);

  useEffect(() => {
    if (!isTimerOn) {
      if (timerIntRef.current) {
        clearInterval(timerIntRef.current);
        timerIntRef.current = null;
      }
      return;
    }
    timerIntRef.current = setInterval(() => {
      const next = secRef.current - 1;
      onTrainingSecond?.();
      setTimerSec(next);
      if (next <= 0) {
        if (timerIntRef.current) clearInterval(timerIntRef.current);
        if (mainRef.current) clearInterval(mainRef.current);
        setIsTimerOn(false);
        setIsFinished(true);
        if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      }
    }, 1000);
    return () => {
      if (timerIntRef.current) {
        clearInterval(timerIntRef.current);
        timerIntRef.current = null;
      }
    };
  }, [isTimerOn, onTrainingSecond]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Enter': handleToggleTimer(); break;
        case 'Escape': handleReset(); break;
        case 'ArrowUp': changeSpeed(-SPEED_STEP); break;
        case 'ArrowDown': changeSpeed(SPEED_STEP); break;
        case 'ArrowLeft': setFontSize(p => Math.min(150, p + 5)); break;
        case 'ArrowRight': setFontSize(p => Math.max(30, p - 5)); break;
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [changeSpeed, handleReset, handleToggleTimer]);

  useEffect(() => {
    const onChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
    };
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  useEffect(() => {
    return () => {
      if (mainRef.current) clearInterval(mainRef.current);
      if (timerIntRef.current) clearInterval(timerIntRef.current);
    };
  }, []);

  const txtColor = isDark ? 'white' : 'black';
  const bgColor = isDark ? '#000' : '#fff';
  const curLS = sizeMode === 'normal' ? fontSize : lSize;
  const curHS = sizeMode === 'normal' ? fontSize : hSize;
  const curLgS = sizeMode === 'normal' ? fontSize : lgSize;
  const curLC = colorMode !== 'none' ? lColor : txtColor;
  const curHC = colorMode !== 'none' ? hColor : txtColor;
  const curLgC = colorMode !== 'none' ? lgColor : txtColor;

  const handleFinishExit = () => {
    handleReset();
    onFinishExit?.();
  };

  if (isFinished) {
    return (
      <div className={s.finish}>
        <h2 className={s.finishTitle}>Превосходно! Упражнение выполнено!</h2>
        <div className={s.finishActions}>
          <button
            type="button"
            className={`${s.finishBtn} ${s.finishBtnSecondary}`}
            onClick={handleFinishExit}
          >
            Закончить
          </button>
          <button type="button" className={s.finishBtn} onClick={handleReset}>
            Хочу ещё
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${s.trainer} ${isFullscreen ? s.fullscreen : ''} ${isDark ? s.trainerDark : ''}`}
      style={{
        backgroundColor: isDark ? bgColor : isFullscreen ? bgColor : undefined,
      }}
    >
      <div className={s.runtimeBar}>
        <button
          type="button"
          className={`${s.runtimeButton} ${isTimerOn ? s.runtimeButtonActive : ''}`}
          onClick={handleToggleTimer}
          aria-label={isTimerOn ? 'Пауза' : 'Продолжить'}
        >
          {isTimerOn ? 'Пауза' : 'Старт'}
        </button>
        <span className={s.runtimeTime}>{formatTime(timerSec)}</span>
        <button
          type="button"
          className={s.runtimeButton}
          onClick={handleReset}
        >
          Сброс
        </button>
      </div>

      <div
        className={`${s.block} ${isFullscreen ? s.blockFull : ''} ${s.blockGrow}`}
        style={isFullscreen ? { top: pos.top, left: pos.left } : undefined}
      >
        {showLegs && <p style={{ fontSize: `${curLgS}px`, color: curLgC }}>{leg}</p>}
        <p style={{ fontSize: `${curLS}px`, color: curLC }}>{letter}</p>
        {showHands && <p style={{ fontSize: `${curHS}px`, color: curHC }}>{hand}</p>}
      </div>
    </div>
  );
}
