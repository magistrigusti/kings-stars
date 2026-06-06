import { auth } from '@clerk/nextjs/server';
import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import {
  appendPortalAnimaMessage,
  clearPortalAnimaHistory,
  getPortalAnimaHistory,
  getPortalAnimaModelHistory,
} from '@/lib/network/anima';
import {
  AnimaCoachError,
  createAnimaCoachAnswer,
} from '@/lib/network/animaCoach';
import { getKingStarsPortalSession } from '@/lib/network/portalSession';

export const runtime = 'nodejs';

const ANIMA_SESSION_COOKIE = 'kingstars_anima_session';
const ANIMA_SESSION_MAX_AGE = 60 * 60 * 24 * 180;
const MAX_USER_MESSAGE_LENGTH = 2000;

interface AnimaOwner {
  ownerId: string;
  sessionCookieValue: string | null;
}

export async function GET(request: NextRequest) {
  const owner = await resolveAnimaOwner(request);
  const history = await getPortalAnimaHistory(owner.ownerId);
  const response = NextResponse.json({ history });

  return attachSessionCookie(response, owner);
}

export async function POST(request: NextRequest) {
  const owner = await resolveAnimaOwner(request);
  const body = await request.json().catch(() => null);
  const userText = readUserMessage(body);

  if (!userText) {
    const response = NextResponse.json(
      { error: 'Напиши сообщение для Anima.' },
      { status: 400 },
    );

    return attachSessionCookie(response, owner);
  }

  const modelHistory = await getPortalAnimaModelHistory(owner.ownerId);

  try {
    const answer = await createAnimaCoachAnswer({
      userText,
      history: modelHistory,
    });

    await appendPortalAnimaMessage(owner.ownerId, 'user', userText);
    const assistantMessage = await appendPortalAnimaMessage(owner.ownerId, 'assistant', answer);
    const history = await getPortalAnimaHistory(owner.ownerId);
    const response = NextResponse.json({
      message: assistantMessage,
      history,
    });

    return attachSessionCookie(response, owner);
  } catch (error) {
    console.error('Portal Anima answer failed:', error);

    const response = NextResponse.json(
      {
        error: error instanceof AnimaCoachError
          ? 'Anima пока не подключена на сервере. Проверь ключ NVIDIA для портала.'
          : 'Anima сейчас не смогла ответить. Попробуй позже.',
      },
      { status: error instanceof AnimaCoachError ? 503 : 500 },
    );

    return attachSessionCookie(response, owner);
  }
}

export async function DELETE(request: NextRequest) {
  const owner = await resolveAnimaOwner(request);

  await clearPortalAnimaHistory(owner.ownerId);

  const response = NextResponse.json({ history: [] });

  return attachSessionCookie(response, owner);
}

async function resolveAnimaOwner(request: NextRequest): Promise<AnimaOwner> {
  const portalUser = await getKingStarsPortalSession();

  if (portalUser) {
    return {
      ownerId: `portal:${portalUser.userId}`,
      sessionCookieValue: null,
    };
  }

  const { userId } = await auth();

  if (userId) {
    return {
      ownerId: `clerk:${userId}`,
      sessionCookieValue: null,
    };
  }

  const currentSessionId = request.cookies.get(ANIMA_SESSION_COOKIE)?.value;

  if (currentSessionId && isValidSessionId(currentSessionId)) {
    return {
      ownerId: `guest:${currentSessionId}`,
      sessionCookieValue: null,
    };
  }

  const nextSessionId = randomUUID();

  return {
    ownerId: `guest:${nextSessionId}`,
    sessionCookieValue: nextSessionId,
  };
}

function attachSessionCookie(response: NextResponse, owner: AnimaOwner) {
  if (!owner.sessionCookieValue) {
    return response;
  }

  response.cookies.set(ANIMA_SESSION_COOKIE, owner.sessionCookieValue, {
    httpOnly: true,
    maxAge: ANIMA_SESSION_MAX_AGE,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}

function readUserMessage(body: unknown) {
  if (!isRecord(body) || typeof body.message !== 'string') {
    return '';
  }

  const message = body.message.trim();

  if (!message) {
    return '';
  }

  return message.slice(0, MAX_USER_MESSAGE_LENGTH);
}

function isValidSessionId(value: string) {
  return /^[a-zA-Z0-9-]{20,80}$/.test(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
