import { useCallback } from 'react';
import {
  ALPHABET, HANDS, LEGS, COLORS,
  STORAGE_KEY_SPEED, SPEED_MIN, SPEED_MAX,
  shuffle, randomInt, calcMaxTop,
} from './engine';

export type SizeMode = 'normal' | 'random' | 'mix';
export type ColorMode = 'none' | 'random' | 'mix';

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
type Ref<T> = React.MutableRefObject<T>;

type TimerId = ReturnType<typeof setInterval>;
type Cfg = {
  showHands: boolean;
  showLegs: boolean;
  sizeMode: string;
  colorMode: string;
  isFullscreen: boolean;
  fontSize: number;
  isDark: boolean;
};

interface Params {
  setSpeed: SetState<number>;
  setFontSize: SetState<number>;
  setTimerMax: SetState<number>;
  setTimerSec: SetState<number>;
  setShowHands: SetState<boolean>;
  setShowLegs: SetState<boolean>;
  setSizeMode: SetState<SizeMode>;
  setColorMode: SetState<ColorMode>;
  setIsDark: SetState<boolean>;
  setIsTimerOn: SetState<boolean>;
  setIsFinished: SetState<boolean>;
  setLetter: SetState<string>;
  setHand: SetState<string>;
  setLeg: SetState<string>;
  setLColor: SetState<string>;
  setHColor: SetState<string>;
  setLgColor: SetState<string>;
  setLSize: SetState<number>;
  setHSize: SetState<number>;
  setLgSize: SetState<number>;
  setPos: SetState<{ top: string; left: string }>;
  mainRef: Ref<TimerId | null>;
  timerIntRef: Ref<TimerId | null>;
  alphaArr: Ref<string[]>;
  handArr: Ref<string[]>;
  legArr: Ref<string[]>;
  alphaIdx: Ref<number>;
  handIdx: Ref<number>;
  legIdx: Ref<number>;
  secRef: Ref<number>;
  cfg: Ref<Cfg>;
  setMainRef: (v: TimerId | null) => void;
  setTimerIntRef: (v: TimerId | null) => void;
  setCfg: (v: Cfg) => void;
  setAlphaArr: (v: string[]) => void;
  setHandArr: (v: string[]) => void;
  setLegArr: (v: string[]) => void;
  setAlphaIdx: (v: number) => void;
  setHandIdx: (v: number) => void;
  setLegIdx: (v: number) => void;
  setSecRef: (v: number) => void;
}

export function useBrainTrainerControls({
  setSpeed,
  setFontSize,
  setTimerMax,
  setTimerSec,
  setShowHands,
  setShowLegs,
  setSizeMode,
  setColorMode,
  setIsDark,
  setIsTimerOn,
  setIsFinished,
  setLetter,
  setHand,
  setLeg,
  setLColor,
  setHColor,
  setLgColor,
  setLSize,
  setHSize,
  setLgSize,
  setPos,
  mainRef,
  timerIntRef,
  alphaArr,
  handArr,
  legArr,
  alphaIdx,
  handIdx,
  legIdx,
  cfg,
  setMainRef,
  setTimerIntRef,
  setCfg,
  setAlphaArr,
  setHandArr,
  setLegArr,
  setAlphaIdx,
  setHandIdx,
  setLegIdx,
  setSecRef,
}: Params) {
  const changeSpeed = useCallback((delta: number) => {
    setSpeed(prev => {
      const next = Math.max(SPEED_MIN, Math.min(SPEED_MAX, prev + delta));
      try { localStorage.setItem(STORAGE_KEY_SPEED, String(next)); } catch {}
      return next;
    });
  }, [setSpeed]);

  const tick = useCallback(() => {
    const c = cfg.current;

    const ai = alphaIdx.current;
    const newLetter = alphaArr.current[ai];
    const nextAi = (ai + 1) % ALPHABET.length;
    setAlphaIdx(nextAi);
    if (nextAi === 0) {
      setAlphaArr(shuffle(ALPHABET));
    }

    const hi = handIdx.current;
    const newHand = handArr.current[hi];
    const nextHi = (hi + 1) % HANDS.length;
    setHandIdx(nextHi);
    if (nextHi === 0) {
      setHandArr(shuffle(HANDS));
    }

    const li = legIdx.current;
    const newLeg = legArr.current[li];
    const nextLi = (li + 1) % LEGS.length;
    setLegIdx(nextLi);
    if (nextLi === 0) {
      setLegArr(shuffle(LEGS));
    }

    let newLS = c.fontSize;
    let newHS = c.fontSize;
    let newLgS = c.fontSize;

    if (c.sizeMode === 'random') {
      const r = randomInt(30, 130);
      newLS = r;
      newHS = r;
      newLgS = r;
    } else if (c.sizeMode === 'mix') {
      newLS = randomInt(30, 130);
      newHS = randomInt(30, 130);
      newLgS = randomInt(30, 130);
    }

    let newLC = '';
    let newHC = '';
    let newLgC = '';

    if (c.colorMode === 'random') {
      const col = COLORS[randomInt(0, COLORS.length - 1)];
      newLC = col;
      newHC = col;
      newLgC = col;
    } else if (c.colorMode === 'mix') {
      newLC = COLORS[randomInt(0, COLORS.length - 1)];
      newHC = COLORS[randomInt(0, COLORS.length - 1)];
      newLgC = COLORS[randomInt(0, COLORS.length - 1)];
    }

    let newPos = { top: '', left: '' };
    if (c.isFullscreen) {
      const cnt = 1 + (c.showHands ? 1 : 0) + (c.showLegs ? 1 : 0);
      const maxSz = Math.max(newLS, newHS, newLgS);
      const maxTop = calcMaxTop(maxSz, cnt, c.sizeMode === 'mix');
      newPos = {
        top: `${randomInt(0, maxTop)}vh`,
        left: `${randomInt(0, 90)}vw`,
      };
    }

    setLetter(newLetter);
    setHand(c.showHands ? newHand : '');
    setLeg(c.showLegs ? newLeg : '');
    setLColor(newLC);
    setHColor(newHC);
    setLgColor(newLgC);
    setLSize(newLS);
    setHSize(newHS);
    setLgSize(newLgS);
    setPos(newPos);
  }, [
    cfg,
    alphaIdx,
    alphaArr,
    handIdx,
    handArr,
    legIdx,
    legArr,
    setAlphaIdx,
    setAlphaArr,
    setHandIdx,
    setHandArr,
    setLegIdx,
    setLegArr,
    setLetter,
    setHand,
    setLeg,
    setLColor,
    setHColor,
    setLgColor,
    setLSize,
    setHSize,
    setLgSize,
    setPos,
  ]);

  const handleStart = useCallback(() => {
    document.documentElement.requestFullscreen().catch(() => {});
  }, []);

  const handleReset = useCallback(() => {
    if (mainRef.current) {
      clearInterval(mainRef.current);
      setMainRef(null);
    }

    if (timerIntRef.current) {
      clearInterval(timerIntRef.current);
      setTimerIntRef(null);
    }

    setFontSize(100);
    setTimerMax(60);
    setTimerSec(60);
    setShowHands(true);
    setShowLegs(true);
    setSizeMode('normal');
    setColorMode('none');
    setIsDark(false);
    setIsTimerOn(false);
    setIsFinished(false);
    setLetter('');
    setHand('');
    setLeg('');

    setCfg({
      showHands: true,
      showLegs: true,
      sizeMode: 'normal',
      colorMode: 'none',
      isFullscreen: false,
      fontSize: 100,
      isDark: false,
    });

    setAlphaArr(shuffle(ALPHABET));
    setHandArr(shuffle(HANDS));
    setLegArr(shuffle(LEGS));
    setAlphaIdx(0);
    setHandIdx(0);
    setLegIdx(0);
    setSecRef(60);

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }, [
    mainRef,
    timerIntRef,
    setMainRef,
    setTimerIntRef,
    setFontSize,
    setTimerMax,
    setTimerSec,
    setShowHands,
    setShowLegs,
    setSizeMode,
    setColorMode,
    setIsDark,
    setIsTimerOn,
    setIsFinished,
    setLetter,
    setHand,
    setLeg,
    setCfg,
    setAlphaArr,
    setHandArr,
    setLegArr,
    setAlphaIdx,
    setHandIdx,
    setLegIdx,
    setSecRef,
  ]);

  const toggleSizeMode = useCallback((mode: 'random' | 'mix') => {
    setSizeMode(prev => (prev === mode ? 'normal' : mode));
  }, [setSizeMode]);

  const toggleColorMode = useCallback((mode: 'random' | 'mix') => {
    setColorMode(prev => (prev === mode ? 'none' : mode));
  }, [setColorMode]);

  const toggleHands = useCallback(() => {
    setShowHands(prev => {
      if (prev) setShowLegs(true);
      return !prev;
    });
  }, [setShowHands, setShowLegs]);

  const toggleLegs = useCallback(() => {
    setShowLegs(prev => {
      if (prev) setShowHands(true);
      return !prev;
    });
  }, [setShowLegs, setShowHands]);

  const onSlider = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value, 10);
    setTimerMax(v);
    setTimerSec(v);
    setIsTimerOn(false);
  }, [setTimerMax, setTimerSec, setIsTimerOn]);

  return {
    changeSpeed,
    tick,
    handleStart,
    handleReset,
    toggleSizeMode,
    toggleColorMode,
    toggleHands,
    toggleLegs,
    onSlider,
  };
}