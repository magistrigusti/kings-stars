import type { LevelProgress } from '../../progress/progression';

const LEVELS_PER_CHAKRA = 5;

export interface BreathingChakra {
  id: string;
  title: string;
  imageSrc: string;
  fromLevel: number;
  toLevel: number;
}

export const BREATHING_CHAKRAS: BreathingChakra[] = [
  {
    id: 'muladhara',
    title: 'Муладхара',
    imageSrc: '/chakra/MULADHARA.png',
    fromLevel: 1,
    toLevel: 5,
  },
  {
    id: 'svadhishthana',
    title: 'Свадхистхана',
    imageSrc: '/chakra/SVADHISHTHANA.png',
    fromLevel: 6,
    toLevel: 10,
  },
  {
    id: 'manipura',
    title: 'Манипура',
    imageSrc: '/chakra/MANIPURA.png',
    fromLevel: 11,
    toLevel: 15,
  },
  {
    id: 'anahata',
    title: 'Анахата',
    imageSrc: '/chakra/ANAHATA.png',
    fromLevel: 16,
    toLevel: 20,
  },
  {
    id: 'vishuddha',
    title: 'Вишуддха',
    imageSrc: '/chakra/VISHUDDHA.png',
    fromLevel: 21,
    toLevel: 25,
  },
  {
    id: 'ajna',
    title: 'Аджна',
    imageSrc: '/chakra/AJNA.png',
    fromLevel: 26,
    toLevel: 30,
  },
  {
    id: 'sahasrara',
    title: 'Сахасрара',
    imageSrc: '/chakra/SAHASRARA.png',
    fromLevel: 31,
    toLevel: 35,
  },
];

export function getBreathingChakra(level: number): BreathingChakra {
  const index = Math.min(
    BREATHING_CHAKRAS.length - 1,
    Math.max(0, Math.floor((Math.max(1, level) - 1) / LEVELS_PER_CHAKRA)),
  );

  return BREATHING_CHAKRAS[index];
}

export function getBreathingChakraProgress(levelProgress: LevelProgress): number {
  const currentChakra = getBreathingChakra(levelProgress.level);
  const levelsInsideChakra = currentChakra.toLevel - currentChakra.fromLevel + 1;
  const completedLevels = Math.max(0, levelProgress.level - currentChakra.fromLevel);
  const currentLevelPart = levelProgress.progressPercent / 100;

  return Math.min(
    100,
    Math.round(((completedLevels + currentLevelPart) / levelsInsideChakra) * 100),
  );
}
