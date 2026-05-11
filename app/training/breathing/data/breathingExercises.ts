export type BreathPhaseKey = 'prepare' | 'inhale' | 'holdIn' | 'exhale' | 'holdOut' | 'rest';

export interface BreathPhase {
  key: BreathPhaseKey;
  label: string;
  shortLabel: string;
  routeLabel?: string;
  seconds: number;
  cue: string;
}

export interface BreathingExercise {
  id: string;
  title: string;
  subtitle: string;
  timeOfDay: 'morning' | 'day' | 'night';
  timeLabel: string;
  tone: string;
  cycles: number;
  phases: BreathPhase[];
}

export const BREATHING_EXERCISES: BreathingExercise[] = [
  {
    id: 'clear-mind',
    title: 'Ясный ум',
    subtitle: 'Утреннее дыхание для пробуждения внимания и ясности.',
    timeOfDay: 'morning',
    timeLabel: 'Утро',
    tone: '#1fb3de',
    cycles: 10,
    phases: [
      {
        key: 'prepare',
        label: 'Подготовка',
        shortLabel: 'Старт',
        seconds: 5,
        cue: 'Сядь ровно, расправь спину и мягко открой взгляд.',
      },
      {
        key: 'inhale',
        label: 'Вдох',
        shortLabel: 'Вдох',
        seconds: 4,
        cue: 'Вдыхай спокойно, будто наполняешь голову свежим светом.',
      },
      {
        key: 'holdIn',
        label: 'Задержка',
        shortLabel: 'Пауза',
        seconds: 2,
        cue: 'Сохрани воздух внутри спокойно и собери внимание.',
      },
      {
        key: 'exhale',
        label: 'Выдох',
        shortLabel: 'Выдох',
        seconds: 4,
        cue: 'Выдыхай ровно, отпуская сонливость и тяжесть.',
      },
      {
        key: 'holdOut',
        label: 'Пауза после выдоха',
        shortLabel: 'Пауза',
        routeLabel: 'Покой',
        seconds: 2,
        cue: 'Побудь в нижней паузе спокойно и начни новый круг яснее.',
      },
    ],
  },
  {
    id: 'strength',
    title: 'Сила',
    subtitle: 'Дневная тренировка для развития дыхательной способности.',
    timeOfDay: 'day',
    timeLabel: 'День',
    tone: '#ff9f43',
    cycles: 10,
    phases: [
      {
        key: 'prepare',
        label: 'Подготовка',
        shortLabel: 'Старт',
        seconds: 5,
        cue: 'Поставь стопы на пол и расправь спину.',
      },
      {
        key: 'rest',
        label: 'Отдых',
        shortLabel: 'Покой',
        seconds: 2,
        cue: 'Восстанови дыхание свободно перед рабочим вдохом.',
      },
      {
        key: 'inhale',
        label: 'Вдох',
        shortLabel: 'Вдох',
        seconds: 4,
        cue: 'Набирай воздух ровно и спокойно, без рывка.',
      },
      {
        key: 'holdIn',
        label: 'Задержка',
        shortLabel: 'Пауза',
        seconds: 2,
        cue: 'Держи воздух спокойно, сохраняя ровную осанку.',
      },
      {
        key: 'exhale',
        label: 'Выдох',
        shortLabel: 'Выдох',
        seconds: 4,
        cue: 'Выдыхай ровно и не спеши.',
      },
      {
        key: 'holdOut',
        label: 'Задержка выдоха',
        shortLabel: 'Задержка',
        seconds: 2,
        cue: 'После выдоха мягко задержи дыхание и не напрягай лицо.',
      },
    ],
  },
  {
    id: 'harmony',
    title: 'Гармония',
    subtitle: 'Ночной ритм для восстановления дыхания перед сном.',
    timeOfDay: 'night',
    timeLabel: 'Ночь',
    tone: '#10b981',
    cycles: 8,
    phases: [
      {
        key: 'prepare',
        label: 'Подготовка',
        shortLabel: 'Старт',
        seconds: 5,
        cue: 'Ляг или сядь удобно и отпусти лишнее напряжение.',
      },
      {
        key: 'inhale',
        label: 'Вдох',
        shortLabel: 'Вдох',
        seconds: 4,
        cue: 'Вдохни коротко и спокойно, без усилия.',
      },
      {
        key: 'exhale',
        label: 'Выдох',
        shortLabel: 'Выдох',
        seconds: 6,
        cue: 'Выдыхай длинно и мягко, будто укладываешь тело спать.',
      },
      {
        key: 'rest',
        label: 'Отдых',
        shortLabel: 'Покой',
        seconds: 2,
        cue: 'После выдоха побудь в покое и дай следующему вдоху начаться мягко.',
      },
    ],
  },
];
