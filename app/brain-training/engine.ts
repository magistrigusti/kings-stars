// =============================================
// Тренажёр мозга — движок (константы + утилиты)
// =============================================

// =============================================
// Константы скорости
// =============================================

export const STORAGE_KEY_SPEED = 'brain-trainer-speed';
export const SPEED_STEP = 100;
export const SPEED_MIN = 500;
export const SPEED_MAX = 3000;
export const SPEED_DEFAULT = 1200;

// =============================================
// Данные тренажёра
// =============================================

export const ALPHABET = [
  'А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И',
  'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т',
  'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Э', 'Ю', 'Я'
];

export const HANDS = ['Л', 'П', 'О'];
export const LEGS = ['П', 'О', 'Л'];

export const COLORS = [
  'red', 'orange', 'yellow', 'green',
  'blue', 'indigo', 'violet', 'gray'
];

// =============================================
// Утилиты
// =============================================

/** Перемешивание массива (Фишер-Йетс) */
export function shuffle<T>(arr: T[]): T[] {
  const res = [...arr];
  for (let i = res.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [res[i], res[j]] = [res[j], res[i]];
  }
  return res;
}

/** Случайное число в диапазоне */
export function randomInt(min: number, max: number) {
  return Math.floor(
    Math.random() * (max - min + 1)
  ) + min;
}

/** Форматирование секунд в MM : SS */
export function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const ss = sec % 60;
  return `${String(m).padStart(2, '0')} : ${String(ss).padStart(2, '0')}`;
}

/** Расчёт максимальной top позиции (vh) */
export function calcMaxTop(
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

/** Начальная скорость из localStorage */
export function getInitialSpeed(): number {
  if (typeof window === 'undefined') return SPEED_DEFAULT;
  try {
    const stored = localStorage.getItem(STORAGE_KEY_SPEED);
    if (stored) {
      const n = parseInt(stored, 10);
      if (!isNaN(n) && n >= SPEED_MIN && n <= SPEED_MAX) return n;
    }
  } catch {}
  return SPEED_DEFAULT;
}