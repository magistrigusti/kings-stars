export type BreathPhaseKey = 'prepare' | 'inhale' | 'holdIn' | 'exhale' | 'holdOut' | 'rest';

export interface BreathPhase {
  key: BreathPhaseKey;
  label: string;
  shortLabel: string;
  seconds: number;
  cue: string;
}

export interface BreathingExercise {
  id: string;
  title: string;
  subtitle: string;
  tone: string;
  cycles: number;
  phases: BreathPhase[];
}

export const BREATHING_EXERCISES: BreathingExercise[] = [
  {
    id: 'clear-mind',
    title: 'Ясный ум',
    subtitle: 'Спокойный ритм для внимания перед занятиями.',
    tone: '#1fb3de',
    cycles: 8,
    phases: [
      {
        key: 'prepare',
        label: 'Подготовка',
        shortLabel: 'Старт',
        seconds: 5,
        cue: 'Сядь ровно и мягко посмотри в центр.',
      },
      {
        key: 'inhale',
        label: 'Вдох',
        shortLabel: 'Вдох',
        seconds: 4,
        cue: 'Вдыхай носом спокойно, без усилия.',
      },
      {
        key: 'exhale',
        label: 'Выдох',
        shortLabel: 'Выдох',
        seconds: 6,
        cue: 'Выдыхай медленно, будто дуешь на пушинку.',
      },
      {
        key: 'rest',
        label: 'Отдых',
        shortLabel: 'Покой',
        seconds: 2,
        cue: 'Отпусти плечи и приготовься к новому кругу.',
      },
    ],
  },
  {
    id: 'strength',
    title: 'Сила',
    subtitle: 'Ровное дыхание для энергии и собранности.',
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
        key: 'inhale',
        label: 'Вдох',
        shortLabel: 'Вдох',
        seconds: 4,
        cue: 'Набирай воздух ровно, как тёплый свет.',
      },
      {
        key: 'holdIn',
        label: 'Задержка',
        shortLabel: 'Пауза',
        seconds: 2,
        cue: 'Держи воздух спокойно, лицо мягкое.',
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
        label: 'Пауза',
        shortLabel: 'Пауза',
        seconds: 2,
        cue: 'Останься в тишине на один маленький миг.',
      },
    ],
  },
  {
    id: 'harmony',
    title: 'Гармония',
    subtitle: 'Мягкий баланс для спокойствия и сна.',
    tone: '#10b981',
    cycles: 8,
    phases: [
      {
        key: 'prepare',
        label: 'Подготовка',
        shortLabel: 'Старт',
        seconds: 5,
        cue: 'Положи ладонь на живот и почувствуй дыхание.',
      },
      {
        key: 'inhale',
        label: 'Вдох',
        shortLabel: 'Вдох',
        seconds: 4,
        cue: 'Вдохни медленно, живот чуть поднимается.',
      },
      {
        key: 'holdIn',
        label: 'Задержка',
        shortLabel: 'Пауза',
        seconds: 4,
        cue: 'Сохрани воздух внутри спокойно.',
      },
      {
        key: 'exhale',
        label: 'Выдох',
        shortLabel: 'Выдох',
        seconds: 6,
        cue: 'Отпускай воздух длинной мягкой волной.',
      },
      {
        key: 'rest',
        label: 'Отдых',
        shortLabel: 'Покой',
        seconds: 2,
        cue: 'Побудь в покое до следующего круга.',
      },
    ],
  },
];
