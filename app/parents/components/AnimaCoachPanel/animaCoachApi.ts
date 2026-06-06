export type AnimaChatRole = 'user' | 'assistant';

export interface AnimaChatMessage {
  id: string;
  role: AnimaChatRole;
  content: string;
  createdAt: string;
}

export interface AnimaHistoryResponse {
  history: AnimaChatMessage[];
}

export interface AnimaSendResponse extends AnimaHistoryResponse {
  message: AnimaChatMessage;
}

const ANIMA_CHAT_ENDPOINT = '/api/anima/chat';

export async function fetchAnimaHistory(): Promise<AnimaHistoryResponse> {
  const response = await fetch(ANIMA_CHAT_ENDPOINT, {
    cache: 'no-store',
  });

  return parseAnimaResponse<AnimaHistoryResponse>(response);
}

export async function sendAnimaMessage(message: string): Promise<AnimaSendResponse> {
  const response = await fetch(ANIMA_CHAT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });

  return parseAnimaResponse<AnimaSendResponse>(response);
}

export async function clearAnimaHistory(): Promise<AnimaHistoryResponse> {
  const response = await fetch(ANIMA_CHAT_ENDPOINT, {
    method: 'DELETE',
  });

  return parseAnimaResponse<AnimaHistoryResponse>(response);
}

async function parseAnimaResponse<TResponse>(response: Response): Promise<TResponse> {
  const data = await response.json().catch(() => null) as unknown;

  if (!response.ok) {
    throw new Error(readErrorMessage(data));
  }

  return data as TResponse;
}

function readErrorMessage(data: unknown) {
  if (
    typeof data === 'object'
    && data !== null
    && 'error' in data
    && typeof data.error === 'string'
  ) {
    return data.error;
  }

  return 'Anima сейчас не смогла ответить.';
}
