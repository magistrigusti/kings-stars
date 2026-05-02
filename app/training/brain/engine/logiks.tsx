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

const STORAGE_KEY_SPEED = 'brain-trainer-speed';
const SPEED_STEP = 100;
const SPEED_MIN = 500;
const SPEED_MAX = 3000;
const SPEED_DEFAULT = 1200;

function getInitialSpeed(): number {
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