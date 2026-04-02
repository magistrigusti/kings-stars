// ========== ТЕКСТЫ СТРАНИЦЫ «ПЕДАГОГ» — RU + EN (переключатель языка позже из настроек) ==========

export const pedagogueCopy = {
  ru: {
    pageTitle: 'Наш педагог',
    intro:
      'Педагоги центра работают с детьми в духе Монтессори и Реджио: наблюдают, поддерживают и создают среду, ' +
      'в которой ребёнок учится через действие.',
    videoCaption: 'Видео с занятий',
    photosCaption: 'Фото с работы с детьми',
    prevPhoto: 'Предыдущее фото',
    nextPhoto: 'Следующее фото',
    photoN: (n: number) => `Фото ${n}`,
    certificateTitle: 'Сертификат педагога',
    certificateDescription: 'Официальный документ об образовании и квалификации можно открыть по ссылке.',
    certificateLink: 'Открыть PDF',
  },
  en: {
    pageTitle: 'Our teacher',
    intro:
      'Our educators work with children in the spirit of Montessori and Reggio: they observe, support, and create ' +
      'an environment where the child learns through action.',
    videoCaption: 'Class video',
    photosCaption: 'Photos from work with children',
    prevPhoto: 'Previous photo',
    nextPhoto: 'Next photo',
    photoN: (n: number) => `Photo ${n}`,
    certificateTitle: "Teacher's certificate",
    certificateDescription: 'You can open the official qualification document via the link below.',
    certificateLink: 'Open PDF',
  },
} as const;

export type PedagogueLocale = keyof typeof pedagogueCopy;
