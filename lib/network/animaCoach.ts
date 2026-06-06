import type { PortalAnimaModelMessage } from './anima';

type AnimaChatRole = 'system' | 'user' | 'assistant';

interface AnimaChatMessage {
  role: AnimaChatRole;
  content: string;
}

interface CreateAnimaAnswerInput {
  userText: string;
  history: PortalAnimaModelMessage[];
}

const DEFAULT_NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1';
const DEFAULT_NVIDIA_MODEL = 'nvidia/nemotron-3-super-120b-a12b';
const NVIDIA_ERROR_TEXT = 'Anima сейчас не смогла получить ответ от нейросети.';
const TELEGRAM_TEXT_LIMIT = 3600;

const CRISIS_PATTERNS = [
  'не хочу жить',
  'хочу умереть',
  'хочу сдохнуть',
  'убью себя',
  'убить себя',
  'покончу с собой',
  'покончить с собой',
  'наложить на себя руки',
  'суицид',
  'самоубий',
  'свести счеты',
  'свести счёты',
  'порезать вены',
  'выйти в окно',
  'прыгнуть с крыши',
  'kill myself',
  'suicide',
  'end my life',
  'i want to die',
] as const;

const CRISIS_TEXT = [
  'Я слышу, что сейчас может быть очень опасный момент.',
  'Пожалуйста, не оставайся с этим один.',
  '',
  'Если есть риск, что ты можешь навредить себе или кому-то рядом, сразу позвони в местную экстренную службу: 112, 911 или другой номер твоей страны.',
  'Если рядом есть человек, напиши ему или подойди к нему прямо сейчас.',
  '',
  'Ответь коротко: ты сейчас в физической безопасности?',
].join('\n');

const SYSTEM_PROMPT = `
Ты Anima — бережная психологическая помощница и коуч в портале "Страна Улыбок".

Твоя роль:
- отвечай тепло, спокойно и по-человечески;
- помогай пользователю назвать чувства, отделить факты от мыслей,
  найти один маленький следующий шаг;
- не ставь диагнозы;
- не назначай лекарства;
- не обещай исцеление;
- не изображай врача, психотерапевта или кризисную службу;
- не дави позитивом и не обесценивай боль пользователя;
- не проси паспортные данные, адреса, пароли, банковские данные;
- если пользователь пишет на русском, отвечай на русском;
- если пользователь явно пишет на английском, отвечай на английском.

Формат ответа:
- 3-7 коротких абзацев;
- сначала отражение чувства;
- затем 1-3 практичных шага;
- в конце один мягкий вопрос, который помогает продолжить разговор.
`.trim();

export class AnimaCoachError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AnimaCoachError';
  }
}

export async function createAnimaCoachAnswer({
  userText,
  history,
}: CreateAnimaAnswerInput): Promise<string> {
  const cleanText = userText.trim();

  if (hasCrisisSignal(cleanText)) {
    return CRISIS_TEXT;
  }

  const messages: AnimaChatMessage[] = [
    {
      role: 'system',
      content: SYSTEM_PROMPT,
    },
    ...history,
    {
      role: 'user',
      content: cleanText,
    },
  ];

  const answer = await requestNvidiaAnswer(messages);

  return prepareAnimaAnswer(answer);
}

function hasCrisisSignal(text: string) {
  const normalizedText = text.toLowerCase();

  return CRISIS_PATTERNS.some(pattern => normalizedText.includes(pattern));
}

function prepareAnimaAnswer(answer: string) {
  const cleanAnswer = answer.trim();

  if (!cleanAnswer) {
    return NVIDIA_ERROR_TEXT;
  }

  if (cleanAnswer.length <= TELEGRAM_TEXT_LIMIT) {
    return cleanAnswer;
  }

  return `${cleanAnswer.slice(0, TELEGRAM_TEXT_LIMIT).trimEnd()}...`;
}

async function requestNvidiaAnswer(messages: AnimaChatMessage[]) {
  const apiKey = readEnv('ANIMA_NVIDIA_API_KEY') || readEnv('NVIDIA_API_KEY');

  if (!apiKey) {
    throw new AnimaCoachError('NVIDIA_API_KEY не задан для портальной Anima.');
  }

  const baseUrl = readEnv('NVIDIA_BASE_URL', DEFAULT_NVIDIA_BASE_URL).replace(/\/+$/, '');
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(buildNvidiaPayload(messages)),
    signal: AbortSignal.timeout(readNumberEnv('NVIDIA_TIMEOUT_SECONDS', 45) * 1000),
  }).catch(error => {
    throw new AnimaCoachError(`NVIDIA API недоступен: ${String(error)}`);
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new AnimaCoachError(
      `NVIDIA API вернул HTTP ${response.status}: ${responseText.slice(0, 500)}`,
    );
  }

  return extractNvidiaAnswer(parseJson(responseText));
}

function buildNvidiaPayload(messages: AnimaChatMessage[]) {
  const reasoningBudget = readNumberEnv('NVIDIA_REASONING_BUDGET', 16384);
  const payload: Record<string, unknown> = {
    model: readEnv('NVIDIA_MODEL', DEFAULT_NVIDIA_MODEL),
    messages,
    temperature: readNumberEnv('NVIDIA_TEMPERATURE', 1),
    top_p: readNumberEnv('NVIDIA_TOP_P', 0.95),
    max_tokens: readNumberEnv('NVIDIA_MAX_TOKENS', 16384),
  };

  if (readBooleanEnv('NVIDIA_ENABLE_THINKING', true) && reasoningBudget > 0) {
    payload.chat_template_kwargs = {
      enable_thinking: true,
    };
    payload.reasoning_budget = reasoningBudget;
  }

  return payload;
}

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch (error) {
    throw new AnimaCoachError(`NVIDIA API вернул не JSON: ${String(error)}`);
  }
}

function extractNvidiaAnswer(data: unknown) {
  if (!isRecord(data)) {
    throw new AnimaCoachError('NVIDIA API вернул не JSON-объект.');
  }

  const choices = data.choices;

  if (!Array.isArray(choices) || choices.length === 0) {
    throw new AnimaCoachError('NVIDIA API вернул ответ без choices.');
  }

  const firstChoice = choices[0];

  if (!isRecord(firstChoice) || !isRecord(firstChoice.message)) {
    throw new AnimaCoachError('NVIDIA API вернул choice без message.');
  }

  const content = firstChoice.message.content;

  if (typeof content !== 'string' || !content.trim()) {
    throw new AnimaCoachError('NVIDIA API вернул пустой текст.');
  }

  return content.trim();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readEnv(name: string, fallback = '') {
  return (process.env[name] ?? fallback).trim();
}

function readNumberEnv(name: string, fallback: number) {
  const rawValue = readEnv(name);

  if (!rawValue) {
    return fallback;
  }

  const parsedValue = Number(rawValue);

  return Number.isFinite(parsedValue) ? parsedValue : fallback;
}

function readBooleanEnv(name: string, fallback: boolean) {
  const rawValue = readEnv(name).toLowerCase();

  if (!rawValue) {
    return fallback;
  }

  return ['1', 'true', 'yes', 'on'].includes(rawValue);
}
