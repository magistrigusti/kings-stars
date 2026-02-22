"use client"

import { useState, useEffect, useRef, useCallback } from 'react';
import s from './BrainTrainer.module.scss';
import {
  ALPHABET, HANDS, LEGS, SPEED_STEP,
  shuffle, formatTime, getInitialSpeed,
} from './engine/engine';
import { useBrainTrainerControls } from './engine/useBrainTrainerControls';
import BrainTrainerPanel from './BrainTrainerPanel';

export default function BrainTrainer() {
  const [speed, setSpeed] = useState(getInitialSpeed);
  const [fontSize, setFontSize] = useState(100);
  const [timerMax, setTimerMax] = useState(60);
  const [timerSec, setTimerSec] = useState(60);
  const [showHands, setShowHands] = useState(true);
  const [showLegs, setShowLegs] = useState(false);
  const [sizeMode, setSizeMode] = useState<'normal' | 'random' | 'mix'>('normal');
  const [colorMode, setColorMode] = useState<'none' | 'random' | 'mix'>('none');
  const [isDark, setIsDark] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTimerOn, setIsTimerOn] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showPanel, setShowPanel] = useState(true);

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
  type TimeoutId = ReturnType<typeof setTimeout>;
  const mainRef = useRef<TimerId | null>(null);
  const timerIntRef = useRef<TimerId | null>(null);
  const panelTmRef = useRef<TimeoutId | null>(null);
  const secRef = useRef(60);

  const cfg = useRef({
    showHands: true, showLegs: true, sizeMode: 'normal' as string,
    colorMode: 'none' as string, isFullscreen: false, fontSize: 100, isDark: false,
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

  const setMainRef = useCallback((v: TimerId | null) => { mainRef.current = v; }, []);
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
    mainRef, timerIntRef, alphaArr, handArr, legArr,
    alphaIdx, handIdx, legIdx, secRef, cfg,
    setMainRef, setTimerIntRef, setCfg,
    setAlphaArr, setHandArr, setLegArr,
    setAlphaIdx, setHandIdx, setLegIdx, setSecRef,
  });

  useEffect(() => {
    if (isFinished) {
      if (mainRef.current) {
        clearInterval(mainRef.current);
        mainRef.current = null;
      }
      return;
    }
    controls.tick();
    mainRef.current = setInterval(controls.tick, speed);
    return () => {
      if (mainRef.current) {
        clearInterval(mainRef.current);
        mainRef.current = null;
      }
    };
  }, [speed, isFinished, controls.tick]);

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
  }, [isTimerOn]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Enter': controls.handleStart(); break;
        case 'Escape': controls.handleReset(); break;
        case 'ArrowUp': controls.changeSpeed(SPEED_STEP); break;
        case 'ArrowDown': controls.changeSpeed(-SPEED_STEP); break;
        case 'ArrowLeft': setFontSize(p => Math.min(150, p + 5)); break;
        case 'ArrowRight': setFontSize(p => Math.max(30, p - 5)); break;
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [controls.handleStart, controls.handleReset, controls.changeSpeed]);

  useEffect(() => {
    const onChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
      if (!isFull) setShowPanel(true);
    };
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  useEffect(() => {
    if (!isFullscreen) return;
    const show = () => {
      setShowPanel(true);
      if (panelTmRef.current) clearTimeout(panelTmRef.current);
      panelTmRef.current = setTimeout(() => setShowPanel(false), 5000);
    };
    panelTmRef.current = setTimeout(() => setShowPanel(false), 5000);
    document.addEventListener('mousemove', show);
    document.addEventListener('touchstart', show);
    return () => {
      document.removeEventListener('mousemove', show);
      document.removeEventListener('touchstart', show);
      if (panelTmRef.current) clearTimeout(panelTmRef.current);
    };
  }, [isFullscreen]);

  useEffect(() => {
    return () => {
      if (mainRef.current) clearInterval(mainRef.current);
      if (timerIntRef.current) clearInterval(timerIntRef.current);
      if (panelTmRef.current) clearTimeout(panelTmRef.current);
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

  if (isFinished) {
    return (
      <div className={s.finish}>
        <h2 className={s.finishTitle}>Превосходно! Упражнение выполнено!</h2>
        <button className={s.finishBtn} onClick={controls.handleReset}>
          ЕЩЁ ХОЧУ !!!
        </button>
      </div>
    );
  }

  return (
    <div
      className={`${s.trainer} ${isFullscreen ? s.fullscreen : ''}`}
      style={{
        backgroundColor: isFullscreen ? bgColor : undefined,
        cursor: isFullscreen && !showPanel ? 'none' : 'default',
      }}
    >
      <BrainTrainerPanel
        isFullscreen={isFullscreen}
        showPanel={showPanel}
        isTimerOn={isTimerOn}
        timerSec={timerSec}
        timerMax={timerMax}
        speed={speed}
        fontSize={fontSize}
        sizeMode={sizeMode}
        showHands={showHands}
        showLegs={showLegs}
        lSize={lSize}
        hSize={hSize}
        lgSize={lgSize}
        colorMode={colorMode}
        isDark={isDark}
        setIsTimerOn={setIsTimerOn}
        changeSpeed={controls.changeSpeed}
        handleReset={controls.handleReset}
        handleStart={controls.handleStart}
        setFontSize={setFontSize}
        toggleSizeMode={controls.toggleSizeMode}
        toggleColorMode={controls.toggleColorMode}
        toggleHands={controls.toggleHands}
        toggleLegs={controls.toggleLegs}
        onSlider={controls.onSlider}
        setIsDark={setIsDark}
      />

      <div className={s.instructions}>
        <p className={s.instructionsText}>
          Тренировка обоих полушарий через координацию речи и движений.
          Произноси букву вслух и выполняй действие: <b>Л</b> — левая, <b>П</b> — правая, <b>О</b> — обе.
        </p>
      </div>

      <div
        className={`${s.block} ${isFullscreen ? s.blockFull : ''}`}
        style={isFullscreen ? { top: pos.top, left: pos.left } : undefined}
      >
        {showLegs && <p style={{ fontSize: `${curLgS}px`, color: curLgC }}>{leg}</p>}
        <p style={{ fontSize: `${curLS}px`, color: curLC }}>{letter}</p>
        {showHands && <p style={{ fontSize: `${curHS}px`, color: curHC }}>{hand}</p>}
      </div>
    </div>
  );
}