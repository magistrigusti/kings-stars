import type { LocalizedText } from '../../parentsContent';

export const animaCoachText = {
  title: {
    ru: 'Anima: психолог и коуч',
    en: 'Anima: Psychologist and Coach',
  },
  subtitle: {
    ru: 'Бережный разговор, короткая память диалога и один спокойный следующий шаг.',
    en: 'A gentle conversation, short dialogue memory, and one calm next step.',
  },
  statusReady: {
    ru: 'Anima рядом',
    en: 'Anima is here',
  },
  statusThinking: {
    ru: 'Anima думает',
    en: 'Anima is thinking',
  },
  emptyTitle: {
    ru: 'Можно начать с пары слов.',
    en: 'You can start with a few words.',
  },
  emptyText: {
    ru: 'Напиши, что сейчас внутри: чувство, ситуация или вопрос.',
    en: 'Write what is inside now: a feeling, situation, or question.',
  },
  inputLabel: {
    ru: 'Сообщение для Anima',
    en: 'Message for Anima',
  },
  inputPlaceholder: {
    ru: 'Например: мне тревожно, помоги разложить мысли...',
    en: 'For example: I feel anxious, help me sort my thoughts...',
  },
  sendButton: {
    ru: 'Отправить',
    en: 'Send',
  },
  clearButton: {
    ru: 'Очистить',
    en: 'Clear',
  },
  loadingHistory: {
    ru: 'Поднимаю память диалога...',
    en: 'Loading dialogue memory...',
  },
  fallbackError: {
    ru: 'Anima сейчас не смогла ответить. Попробуй ещё раз чуть позже.',
    en: 'Anima could not answer right now. Try again a little later.',
  },
  privacyNote: {
    ru: 'Не отправляй паспортные данные, адреса, пароли, банковские данные или чужие личные сведения.',
    en: 'Do not send passport data, addresses, passwords, banking data, or personal data about other people.',
  },
  userLabel: {
    ru: 'Вы',
    en: 'You',
  },
  assistantLabel: {
    ru: 'Anima',
    en: 'Anima',
  },
} as const satisfies Record<string, LocalizedText>;

export const animaCoachPrompts = [
  {
    ru: 'Мне тревожно. Помоги понять, что со мной происходит.',
    en: 'I feel anxious. Help me understand what is happening.',
  },
  {
    ru: 'Мне нужно мягко собрать план на ближайший час.',
    en: 'I need to gently make a plan for the next hour.',
  },
  {
    ru: 'Я устал и хочу спокойно поговорить.',
    en: 'I am tired and want to talk calmly.',
  },
] as const satisfies readonly LocalizedText[];
