import type { LocalizedText } from '../../parentsContent';

export const kegelText = {
  title: {
    ru: 'Упражнения Кегеля',
    en: 'Kegel Exercises',
  },
  trainingTab: {
    ru: 'Тренировка',
    en: 'Training',
  },
  statsTab: {
    ru: 'Статистика',
    en: 'Statistics',
  },
  todayTitle: {
    ru: 'Тренировка на сегодня',
    en: 'Today Training',
  },
  levelLabel: {
    ru: 'Уровень',
    en: 'Level',
  },
  classicTitle: {
    ru: 'Кегель классика',
    en: 'Classic Kegel',
  },
  pulseTitle: {
    ru: 'Кегель пульс',
    en: 'Kegel Pulse',
  },
  startButton: {
    ru: 'Начать тренировку',
    en: 'Start Training',
  },
  levelSettingsTitle: {
    ru: 'Настройка уровня',
    en: 'Level Settings',
  },
  autoLevelLabel: {
    ru: 'Автоматически',
    en: 'Automatic',
  },
  autoLevelHint: {
    ru: 'Уровень растёт сам каждый новый день.',
    en: 'Level grows by itself each new day.',
  },
  guideTitle: {
    ru: 'Как выполнять упражнения?',
    en: 'How to train?',
  },
  guideText: {
    ru: 'Сжимайте мышцы мягко, без боли и без задержки дыхания. Если появляется дискомфорт, остановитесь и уменьшите уровень.',
    en: 'Contract gently, without pain and without holding your breath. If discomfort appears, stop and lower the level.',
  },
  pauseButton: {
    ru: 'Пауза',
    en: 'Pause',
  },
  resumeButton: {
    ru: 'Продолжить',
    en: 'Resume',
  },
  exitButton: {
    ru: 'Выход',
    en: 'Exit',
  },
  contractLabel: {
    ru: 'Сжатие',
    en: 'Contract',
  },
  releaseLabel: {
    ru: 'Отдых',
    en: 'Rest',
  },
  recoveryLabel: {
    ru: 'Небольшой отдых',
    en: 'Short Rest',
  },
  prepareLabel: {
    ru: 'Приготовьтесь',
    en: 'Get Ready',
  },
  completeTitle: {
    ru: 'Тренировка завершена',
    en: 'Training Complete',
  },
  completedSessions: {
    ru: 'Тренировок',
    en: 'Sessions',
  },
  totalTime: {
    ru: 'Время',
    en: 'Time',
  },
  bestLevel: {
    ru: 'Лучший уровень',
    en: 'Best Level',
  },
  loadByLevels: {
    ru: 'Нагрузка по уровням',
    en: 'Load by Levels',
  },
  historyTitle: {
    ru: 'Последние тренировки',
    en: 'Recent Workouts',
  },
  emptyHistory: {
    ru: 'Пока нет завершённых тренировок.',
    en: 'No completed workouts yet.',
  },
} as const satisfies Record<string, LocalizedText>;
