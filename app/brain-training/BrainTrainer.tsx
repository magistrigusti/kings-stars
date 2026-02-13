"use client"

import { 
  useState, 
  useEffect, 
  useRef, 
  useCallback 
} from 'react';
import { IoPlay, IoPause } from 'react-icons/io5';
import s from './BrainTrainer.module.scss';

// =============================================
// Константы
// =============================================

// Русский алфавит (27 букв)
const ALPHABET = [
  'А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И',
  'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т',
  'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Э', 'Ю', 'Я'
];

// Команды для рук (Л-левая, П-правая, О-обе)
const HANDS = ['Л', 'П', 'О'];

// Команды для ног
const LEGS = ['П', 'О', 'Л'];

// Палитра цветов для режима рандом
const COLORS = [
  'red', 'orange', 'yellow', 'green',
  'blue', 'indigo', 'violet', 'gray'
];

// =============================================
// Утилиты
// =============================================

/** Перемешивание массива (Фишер-Йетс) */
function shuffle<T>(arr: T[]): T[] {
  const res = [...arr];
  for (let i = res.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [res[i], res[j]] = [res[j], res[i]];
  }
  return res;
}

/** Случайное число в диапазоне */
function randomInt(min: number, max: number) {
  return Math.floor(
    Math.random() * (max - min + 1)
  ) + min;
}

/** Форматирование секунд в MM : SS */
function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const ss = sec % 60;
  return `${String(m).padStart(2, '0')} : ${String(ss).padStart(2, '0')}`;
}

/** 
 * Расчёт максимальной top позиции (vh)
 * чтобы буквы не вылезали за экран
 */
function calcMaxTop(
  size: number, 
  count: number, 
  isMix: boolean
): number {
  if (isMix) {
    return count >= 3 ? 40 : 59;
  }
  if (count >= 3) {
    return Math.max(
      40, Math.round(96 - size * 0.33)
    );
  }
  return Math.max(
    60, Math.round(96 - size * 0.2)
  );
}

// =============================================
// Компонент тренажёра
// =============================================

export default function BrainTrainer() {

  // --- Контролы UI ---
  const [speed, setSpeed] = useState(1200);
  const [fontSize, setFontSize] = useState(100);
  const [timerMax, setTimerMax] = useState(60);
  const [timerSec, setTimerSec] = useState(60);
  const [showHands, setShowHands] = useState(true);
  const [showLegs, setShowLegs] = useState(true);

  const [sizeMode, setSizeMode] = useState<
    'normal' | 'random' | 'mix'
  >('normal');

  const [colorMode, setColorMode] = useState<
    'none' | 'random' | 'mix'
  >('none');

  const [isDark, setIsDark] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTimerOn, setIsTimerOn] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showPanel, setShowPanel] = useState(true);

  // --- Данные для отображения ---
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

  // --- Рефы для цикла анимации ---
  const alphaArr = useRef(shuffle(ALPHABET));
  const handArr = useRef(shuffle(HANDS));
  const legArr = useRef(shuffle(LEGS));
  const alphaIdx = useRef(0);
  const handIdx = useRef(0);
  const legIdx = useRef(0);

  // --- Рефы для интервалов ---
  type TimerId = ReturnType<typeof setInterval>;
  type TimeoutId = ReturnType<typeof setTimeout>;

  const mainRef = useRef<TimerId | null>(null);
  const timerIntRef = useRef<TimerId | null>(null);
  const panelTmRef = useRef<TimeoutId | null>(null);
  const secRef = useRef(60);

  // --- Реф-зеркало настроек для tick ---
  const cfg = useRef({
    showHands: true,
    showLegs: true,
    sizeMode: 'normal' as string,
    colorMode: 'none' as string,
    isFullscreen: false,
    fontSize: 100,
    isDark: false,
  });

  // Синхронизация state -> ref
  useEffect(() => {
    cfg.current = {
      showHands, showLegs, sizeMode,
      colorMode, isFullscreen, fontSize, isDark,
    };
  }, [
    showHands, showLegs, sizeMode,
    colorMode, isFullscreen, fontSize, isDark,
  ]);

  useEffect(() => {
    secRef.current = timerSec;
  }, [timerSec]);

  // =============================================
  // Основной тик анимации
  // =============================================

  const tick = useCallback(() => {
    const c = cfg.current;

    // Следующая буква
    const ai = alphaIdx.current;
    const newLetter = alphaArr.current[ai];
    alphaIdx.current = (ai + 1) % ALPHABET.length;
    if (alphaIdx.current === 0) {
      alphaArr.current = shuffle(ALPHABET);
    }

    // Следующая команда для рук
    const hi = handIdx.current;
    const newHand = handArr.current[hi];
    handIdx.current = (hi + 1) % HANDS.length;
    if (handIdx.current === 0) {
      handArr.current = shuffle(HANDS);
    }

    // Следующая команда для ног
    const li = legIdx.current;
    const newLeg = legArr.current[li];
    legIdx.current = (li + 1) % LEGS.length;
    if (legIdx.current === 0) {
      legArr.current = shuffle(LEGS);
    }

    // Размеры
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

    // Цвета
    let newLC = '';
    let newHC = '';
    let newLgC = '';

    if (c.colorMode === 'random') {
      const col = COLORS[
        randomInt(0, COLORS.length - 1)
      ];
      newLC = col;
      newHC = col;
      newLgC = col;
    } else if (c.colorMode === 'mix') {
      newLC = COLORS[
        randomInt(0, COLORS.length - 1)
      ];
      newHC = COLORS[
        randomInt(0, COLORS.length - 1)
      ];
      newLgC = COLORS[
        randomInt(0, COLORS.length - 1)
      ];
    }

    // Позиция (случайная в полноэкранном)
    let newPos = { top: '', left: '' };

    if (c.isFullscreen) {
      const cnt = 1 
        + (c.showHands ? 1 : 0)
        + (c.showLegs ? 1 : 0);
      const maxSz = Math.max(newLS, newHS, newLgS);
      const maxTop = calcMaxTop(
        maxSz, cnt, c.sizeMode === 'mix'
      );
      newPos = {
        top: `${randomInt(0, maxTop)}vh`,
        left: `${randomInt(0, 90)}vw`,
      };
    }

    // Обновляем отображение
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
  }, []);

  // =============================================
  // Обработчики
  // =============================================

  /** Старт — вход в полноэкранный режим */
  const handleStart = useCallback(() => {
    document.documentElement
      .requestFullscreen()
      .catch(() => {});
  }, []);

  /** Сброс — полный перезапуск тренажёра */
  const handleReset = useCallback(() => {
    // Останавливаем интервалы
    if (mainRef.current) {
      clearInterval(mainRef.current);
      mainRef.current = null;
    }
    if (timerIntRef.current) {
      clearInterval(timerIntRef.current);
      timerIntRef.current = null;
    }

    // Сбрасываем состояние
    setSpeed(1200);
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

    // Обновляем реф настроек
    cfg.current = {
      showHands: true,
      showLegs: true,
      sizeMode: 'normal',
      colorMode: 'none',
      isFullscreen: false,
      fontSize: 100,
      isDark: false,
    };

    // Перемешиваем массивы заново
    alphaArr.current = shuffle(ALPHABET);
    handArr.current = shuffle(HANDS);
    legArr.current = shuffle(LEGS);
    alphaIdx.current = 0;
    handIdx.current = 0;
    legIdx.current = 0;
    secRef.current = 60;

    // Выход из полноэкранного
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  /** Переключение режима размера */
  const toggleSizeMode = useCallback(
    (mode: 'random' | 'mix') => {
      setSizeMode(p => p === mode ? 'normal' : mode);
    }, []
  );

  /** Переключение режима цвета */
  const toggleColorMode = useCallback(
    (mode: 'random' | 'mix') => {
      setColorMode(p => p === mode ? 'none' : mode);
    }, []
  );

  /** Переключение показа рук */
  const toggleHands = useCallback(() => {
    setShowHands(p => {
      // Нельзя выключить оба — включаем ноги
      if (p) setShowLegs(true);
      return !p;
    });
  }, []);

  /** Переключение показа ног */
  const toggleLegs = useCallback(() => {
    setShowLegs(p => {
      // Нельзя выключить оба — включаем руки
      if (p) setShowHands(true);
      return !p;
    });
  }, []);

  /** Слайдер таймера */
  const onSlider = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = parseInt(e.target.value);
      setTimerMax(v);
      setTimerSec(v);
      secRef.current = v;
      setIsTimerOn(false);
    }, []
  );

  // =============================================
  // Эффекты
  // =============================================

  // Основной интервал — цикл букв
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

  // Таймер обратного отсчёта
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
        // Упражнение завершено
        if (timerIntRef.current) {
          clearInterval(timerIntRef.current);
        }
        if (mainRef.current) {
          clearInterval(mainRef.current);
        }
        setIsTimerOn(false);
        setIsFinished(true);

        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
      }
    }, 1000);

    return () => {
      if (timerIntRef.current) {
        clearInterval(timerIntRef.current);
        timerIntRef.current = null;
      }
    };
  }, [isTimerOn]);

  // Горячие клавиши
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Enter':
          handleStart();
          break;
        case 'Escape':
          handleReset();
          break;
        case 'ArrowUp':
          setSpeed(p => Math.min(3000, p + 10));
          break;
        case 'ArrowDown':
          setSpeed(p => Math.max(500, p - 10));
          break;
        case 'ArrowLeft':
          setFontSize(p => Math.min(150, p + 5));
          break;
        case 'ArrowRight':
          setFontSize(p => Math.max(30, p - 5));
          break;
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
    };
  }, [handleStart, handleReset]);

  // Отслеживание fullscreen
  useEffect(() => {
    const onChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
      if (!isFull) setShowPanel(true);
    };
    document.addEventListener(
      'fullscreenchange', onChange
    );
    return () => {
      document.removeEventListener(
        'fullscreenchange', onChange
      );
    };
  }, []);

  // Автоскрытие панели в полноэкранном
  useEffect(() => {
    if (!isFullscreen) return;

    const show = () => {
      setShowPanel(true);
      if (panelTmRef.current) {
        clearTimeout(panelTmRef.current);
      }
      panelTmRef.current = setTimeout(
        () => setShowPanel(false), 5000
      );
    };

    // Первое скрытие через 5 сек
    panelTmRef.current = setTimeout(
      () => setShowPanel(false), 5000
    );

    document.addEventListener('mousemove', show);
    document.addEventListener('touchstart', show);

    return () => {
      document.removeEventListener('mousemove', show);
      document.removeEventListener('touchstart', show);
      if (panelTmRef.current) {
        clearTimeout(panelTmRef.current);
      }
    };
  }, [isFullscreen]);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (mainRef.current) clearInterval(mainRef.current);
      if (timerIntRef.current) {
        clearInterval(timerIntRef.current);
      }
      if (panelTmRef.current) {
        clearTimeout(panelTmRef.current);
      }
    };
  }, []);

  // =============================================
  // Вычисляемые значения
  // =============================================

  const txtColor = isDark ? 'white' : 'black';
  const bgColor = isDark ? '#000' : '#fff';

  const curLS = sizeMode === 'normal' 
    ? fontSize : lSize;
  const curHS = sizeMode === 'normal' 
    ? fontSize : hSize;
  const curLgS = sizeMode === 'normal' 
    ? fontSize : lgSize;

  const curLC = colorMode !== 'none' 
    ? lColor : txtColor;
  const curHC = colorMode !== 'none' 
    ? hColor : txtColor;
  const curLgC = colorMode !== 'none' 
    ? lgColor : txtColor;

  // =============================================
  // Рендер
  // =============================================

  // Экран завершения
  if (isFinished) {
    return (
      <div className={s.finish}>
        <h2 className={s.finishTitle}>
          Превосходно! Упражнение выполнено!
        </h2>
        <button
          className={s.finishBtn}
          onClick={handleReset}
        >
          ЕЩЁ ХОЧУ !!!
        </button>
      </div>
    );
  }

  return (
    <div
      className={`${s.trainer} ${
        isFullscreen ? s.fullscreen : ''
      }`}
      style={{
        backgroundColor: isFullscreen 
          ? bgColor : undefined,
        cursor: isFullscreen && !showPanel 
          ? 'none' : 'default',
      }}
    >
      {/* ====== Панель управления ====== */}
      <div className={`${s.panel} ${
        isFullscreen && !showPanel ? s.hidden : ''
      }`}>

        {/* --- 1. Таймер --- */}
        <div className={s.section}>
          <div className={s.timerWrap}>
            <div className={s.timerBtns}>
              <button
                className={`${s.playBtn} ${
                  isTimerOn ? s.active : ''
                }`}
                onClick={() => setIsTimerOn(true)}
                title="Запустить таймер"
              >
                <IoPlay />
              </button>
              <button
                className={`${s.stopBtn} ${
                  !isTimerOn && timerSec < timerMax 
                    ? s.stopped : ''
                }`}
                onClick={() => setIsTimerOn(false)}
                title="Остановить таймер"
              >
                <IoPause />
              </button>
            </div>

            <div className={s.timerRight}>
              <div className={s.timerVal}>
                {formatTime(timerSec)}
              </div>
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
                <span>1м</span>
                <span>5м</span>
                <span>10м</span>
                <span>15м</span>
                <span>20м</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- 2. Скорость + Старт/Сброс --- */}
        <div className={`${s.section} ${s.sectionAlt}`}>
          <div className={s.speedWrap}>
            <div className={s.speedCol}>
              <button
                className={s.ctrlBtn}
                onClick={() => setSpeed(
                  p => Math.min(3000, p + 10)
                )}
              >
                Скорость -
              </button>
              <input
                type="number"
                className={s.numInput}
                value={speed}
                readOnly
              />
              <button
                className={s.ctrlBtn}
                onClick={() => setSpeed(
                  p => Math.max(500, p - 10)
                )}
              >
                Скорость +
              </button>
            </div>

            <div className={s.actCol}>
              <button
                className={s.actionBtn}
                onClick={handleReset}
              >
                Сброс
              </button>
              <button
                className={s.actionBtn}
                onClick={handleStart}
              >
                Старт
              </button>
            </div>
          </div>
        </div>

        {/* --- 3. Размер + Режимы --- */}
        <div className={s.section}>
          <div className={s.sizeWrap}>
            <div className={s.sizeCol}>
              {sizeMode === 'normal' && (
                <button
                  className={s.ctrlBtn}
                  onClick={() => setFontSize(
                    p => Math.min(150, p + 5)
                  )}
                >
                  Размер +
                </button>
              )}

              {sizeMode === 'mix' ? (
                <div className={s.mixSizes}>
                  <span className={s.mixVal}>
                    {lSize}
                  </span>
                  {showHands && (
                    <span className={s.mixVal}>
                      {hSize}
                    </span>
                  )}
                  {showLegs && (
                    <span className={s.mixVal}>
                      {lgSize}
                    </span>
                  )}
                </div>
              ) : (
                <input
                  type="number"
                  className={s.numInput}
                  value={
                    sizeMode === 'random'
                      ? lSize
                      : fontSize
                  }
                  readOnly
                />
              )}

              {sizeMode === 'normal' && (
                <button
                  className={s.ctrlBtn}
                  onClick={() => setFontSize(
                    p => Math.max(30, p - 5)
                  )}
                >
                  Размер -
                </button>
              )}
            </div>

            <div className={s.modeCol}>
              <label className={s.check}>
                <input
                  type="checkbox"
                  checked={sizeMode === 'mix'}
                  onChange={
                    () => toggleSizeMode('mix')
                  }
                />
                <span>Микс</span>
              </label>
              <label className={s.check}>
                <input
                  type="checkbox"
                  checked={sizeMode === 'random'}
                  onChange={
                    () => toggleSizeMode('random')
                  }
                />
                <span>Рандом</span>
              </label>
            </div>
          </div>
        </div>

        {/* --- 4. Цвета + Тема + Верх/Низ --- */}
        <div className={`${s.section} ${s.sectionAlt}`}>
          <div className={s.optWrap}>
            <div className={s.optCol}>
              <label className={s.check}>
                <input
                  type="checkbox"
                  checked={colorMode === 'random'}
                  onChange={
                    () => toggleColorMode('random')
                  }
                />
                <span>Цвет-Рандом</span>
              </label>
              <label className={s.check}>
                <input
                  type="checkbox"
                  checked={colorMode === 'mix'}
                  onChange={
                    () => toggleColorMode('mix')
                  }
                />
                <span>Цвет-Микс</span>
              </label>
            </div>

            <div className={s.optCol}>
              <label className={s.check}>
                <input
                  type="checkbox"
                  checked={showLegs}
                  onChange={toggleLegs}
                />
                <span>Верх</span>
              </label>
              <label className={s.check}>
                <input
                  type="checkbox"
                  checked={showHands}
                  onChange={toggleHands}
                />
                <span>Низ</span>
              </label>
            </div>

            <label className={s.themeCheck}>
              <input
                type="checkbox"
                checked={isDark}
                onChange={() => setIsDark(p => !p)}
              />
              <span>Тёмный экран</span>
            </label>
          </div>
        </div>
      </div>

      {/* ====== Блок с буквами ====== */}
      <div
        className={`${s.block} ${
          isFullscreen ? s.blockFull : ''
        }`}
        style={isFullscreen ? {
          top: pos.top,
          left: pos.left,
        } : undefined}
      >
        {showLegs && (
          <p
            style={{
              fontSize: `${curLgS}px`,
              color: curLgC,
            }}
          >
            {leg}
          </p>
        )}

        <p
          style={{
            fontSize: `${curLS}px`,
            color: curLC,
          }}
        >
          {letter}
        </p>

        {showHands && (
          <p
            style={{
              fontSize: `${curHS}px`,
              color: curHC,
            }}
          >
            {hand}
          </p>
        )}
      </div>
    </div>
  );
}
