import crypto from 'crypto';
import { cookies } from 'next/headers';

export const KINGSTARS_PORTAL_SESSION_COOKIE = 'kingstars_portal_session';

export type KingStarsPortalUser = {
  userId: string;
  username: string | null;
  name: string;
  imageUrl: string | null;
  emailAddress: string | null;
  authProvider: 'clerk' | 'telegram';
};

type PortalTicketPayload = KingStarsPortalUser & {
  exp: number;
};

type KingStarsSessionPayload = KingStarsPortalUser & {
  exp: number;
};

const getPortalSsoSecret = () => {
  const secret = process.env.PORTAL_SSO_SECRET || process.env.TELEGRAM_BOT_TOKEN;

  if (!secret) {
    throw new Error('PORTAL_SSO_SECRET is not configured');
  }

  return secret;
};

const base64UrlDecode = (value: string) =>
  Buffer.from(value, 'base64url').toString('utf8');

const base64UrlEncode = (value: string) =>
  Buffer.from(value).toString('base64url');

const sign = (payload: string) =>
  crypto.createHmac('sha256', getPortalSsoSecret()).update(payload).digest('base64url');

function verifySignedPayload(value?: string) {
  if (!value) return null;

  const [encodedPayload, signature] = value.split('.');
  if (!encodedPayload || !signature) return null;

  const expectedSignature = sign(encodedPayload);
  if (signature.length !== expectedSignature.length) return null;

  const isValid = crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature),
  );

  if (!isValid) return null;

  const payload = JSON.parse(base64UrlDecode(encodedPayload)) as { exp: number };
  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;

  return payload;
}

export function verifyPortalSsoTicket(ticket?: string): KingStarsPortalUser | null {
  const payload = verifySignedPayload(ticket) as PortalTicketPayload | null;
  if (!payload?.userId) return null;

  return {
    userId: payload.userId,
    username: payload.username ?? null,
    name: payload.name,
    imageUrl: payload.imageUrl ?? null,
    emailAddress: payload.emailAddress ?? null,
    authProvider: payload.authProvider,
  };
}

export function createKingStarsPortalSession(user: KingStarsPortalUser) {
  const payload: KingStarsSessionPayload = {
    ...user,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export async function getKingStarsPortalSession(): Promise<KingStarsPortalUser | null> {
  const cookieStore = await cookies();
  const payload = verifySignedPayload(
    cookieStore.get(KINGSTARS_PORTAL_SESSION_COOKIE)?.value,
  ) as KingStarsSessionPayload | null;

  if (!payload?.userId) return null;

  return {
    userId: payload.userId,
    username: payload.username ?? null,
    name: payload.name,
    imageUrl: payload.imageUrl ?? null,
    emailAddress: payload.emailAddress ?? null,
    authProvider: payload.authProvider,
  };
}
